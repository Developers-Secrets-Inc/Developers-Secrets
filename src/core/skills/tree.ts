import config from '@payload-config'
import { getPayload } from 'payload'
import type { Concept, ImplementationConcept, UserConceptProgression } from '@/payload-types'
import { getSkillBySlug } from './index'
// Import React Flow types if needed later for Node/Edge formatting
import type { Node, Edge } from 'reactflow'
// Need the actual Payload type for the helper function parameter
import type { Payload } from 'payload'
import * as dagre from 'dagre'

/**
 * Helper function to recursively find all prerequisite concepts.
 * @param initialConceptIds - Set of starting Concept IDs.
 * @param payload - The resolved Payload client instance.
 * @returns A Promise resolving to a Map of all unique Concept IDs found to their full Concept objects.
 */
const findAllConceptsAndPrerequisites = async (
  initialConceptIds: Set<number>,
  payload: Payload,
): Promise<Map<number, Concept>> => {
  const allConceptsMap = new Map<number, Concept>() // Stores fetched concepts by ID
  const conceptIdsToProcess = new Set<number>(initialConceptIds) // IDs we need to fetch details for
  const processedConceptIds = new Set<number>() // IDs whose prerequisites have been checked

  while (conceptIdsToProcess.size > 0) {
    const currentBatchIds = Array.from(conceptIdsToProcess)
    conceptIdsToProcess.clear() // Clear the set for the next iteration

    console.log(`Fetching details for concepts:`, currentBatchIds)

    // Use the passed 'payload' instance directly
    const conceptsResult = await payload.find({
      collection: 'concepts',
      where: {
        id: { in: currentBatchIds },
      },
      limit: currentBatchIds.length, // Fetch exactly the IDs we need
      depth: 1, // Need 'requiredConcepts' populated (assuming it's depth 1)
      pagination: false,
    })

    for (const concept of conceptsResult.docs as Concept[]) {
      // Store the fetched concept
      if (!allConceptsMap.has(concept.id)) {
        allConceptsMap.set(concept.id, concept)
      }
      processedConceptIds.add(concept.id) // Mark as processed

      // Check prerequisites
      if (concept.requiredConcepts && Array.isArray(concept.requiredConcepts)) {
        for (const req of concept.requiredConcepts) {
          const reqId = typeof req === 'number' ? req : req.id // Get ID whether populated or not
          // If this prerequisite hasn't been processed or added yet, add it to the next batch
          if (reqId && !processedConceptIds.has(reqId) && !allConceptsMap.has(reqId)) {
            conceptIdsToProcess.add(reqId)
          }
        }
      }
    }
  }

  console.log(`Total unique concepts found (incl. prerequisites): ${allConceptsMap.size}`)
  return allConceptsMap
}

// --- Dagre Layout Calculation ---
const calculateLayout = (nodes: Node[], edges: Edge[]): Node[] => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({})) // Default edge label function
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 70, ranksep: 90 }) // Top-to-bottom, adjust spacing

  // Define approximate dimensions of our ConceptNode
  // Adjust these based on the actual rendered size of your ConceptNode component
  const nodeWidth = 192 // w-48 in Tailwind (48 * 4 = 192) + padding/border?
  const nodeHeight = 100 // Approximate height based on content

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { label: node.data.label, width: nodeWidth, height: nodeHeight })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  // Apply calculated positions to our nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    // We need to center the node position relative to the calculated layout coordinates
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    }
    return node
  })

  return layoutedNodes
}
// --- End Dagre Layout ---

/**
 * Retrieves and structures the concept tree data for a specific skill and user.
 * Currently retrieves initial concepts linked via ImplementationConcepts.
 * Does NOT yet fetch prerequisites, user progress, or calculate layout.
 *
 * @param skillSlug - The slug of the target skill.
 * @param userId - The ID of the user (for future progress fetching).
 * @returns A promise resolving to an object containing nodes and edges for React Flow.
 */
export const getSkillConceptTreeData = async (
  skillSlug: string,
  userId: string, // userId is included for future use with progression
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  console.log(`Fetching concept tree data for skill: ${skillSlug}, user: ${userId}`)
  const payload = await getPayload({ config })

  let nodes: Node[] = []
  let edges: Edge[] = []

  try {
    // 1. Find the Skill ID from the slug
    const skill = await getSkillBySlug(skillSlug)
    if (!skill) {
      console.error(`Skill with slug "${skillSlug}" not found.`)
      return { nodes: [], edges: [] }
    }
    const skillId = skill.id
    console.log(`Found Skill ID: ${skillId}`)

    // 2. Find ImplementationConcepts linked to this Skill
    const implementationConceptsResult = await payload.find({
      collection: 'implementationConcepts',
      where: {
        implementationSkill: { equals: skillId },
      },
      limit: 0, // Get all implementations for this skill
      depth: 1, // We need the parent 'concept' populated
      pagination: false,
    })

    const implementationConcepts = implementationConceptsResult.docs as (Omit<
      ImplementationConcept,
      'concept'
    > & { concept: Concept })[]

    if (!implementationConcepts || implementationConcepts.length === 0) {
      console.log(`No ImplementationConcepts found for Skill ID: ${skillId}`)
      return { nodes: [], edges: [] }
    }
    console.log(`Found ${implementationConcepts.length} ImplementationConcepts.`)

    // 3. Extract unique parent Concept IDs
    const baseConceptIds = new Set<number>()
    implementationConcepts.forEach((implConcept) => {
      // Ensure the parent concept is populated and has an ID
      if (
        implConcept.concept &&
        typeof implConcept.concept === 'object' &&
        implConcept.concept.id
      ) {
        baseConceptIds.add(implConcept.concept.id)
      } else {
        console.warn(`ImplementationConcept ID ${implConcept.id} missing populated parent concept.`)
      }
    })

    console.log(`Base Concept IDs derived from implementations:`, Array.from(baseConceptIds))

    if (baseConceptIds.size === 0) {
      console.log(`No base concepts identified for skill ${skillSlug}`)
      return { nodes: [], edges: [] }
    }

    // 4. Find all unique concepts including prerequisites
    const allConceptsMap = await findAllConceptsAndPrerequisites(baseConceptIds, payload)

    if (allConceptsMap.size === 0) {
      console.log(`No concepts found (including prerequisites) for skill ${skillSlug}`)
      return { nodes: [], edges: [] }
    }

    const allConceptIds = Array.from(allConceptsMap.keys())
    console.log(`All relevant Concept IDs:`, allConceptIds)

    // 5. Fetch UserConceptProgressions
    const userProgressionsResult = await payload.find({
      collection: 'userConceptProgressions',
      where: {
        user: { equals: userId },
        concept: { in: allConceptIds },
      },
      limit: allConceptIds.length,
      depth: 0,
      pagination: false,
    })

    // Create and populate the Map separately
    const userProgressMap = new Map<number, number>()
    const progressions = userProgressionsResult.docs as UserConceptProgression[]
    for (const prog of progressions) {
      if (
        typeof prog.concept === 'number' &&
        prog.progressValue !== null &&
        prog.progressValue !== undefined
      ) {
        userProgressMap.set(prog.concept, prog.progressValue)
      }
    }
    console.log(`Found ${userProgressMap.size} user progression entries.`)

    // 6. Format Concepts into React Flow 'nodes' (without positions initially)
    const initialNodes: Node[] = []
    allConceptsMap.forEach((concept, conceptId) => {
      const progressValue = userProgressMap.get(conceptId) ?? 0
      const isMastered = progressValue >= 100

      initialNodes.push({
        id: String(conceptId),
        type: 'concept',
        position: { x: 0, y: 0 }, // Placeholder
        data: {
          label: concept.name,
          conceptId: conceptId,
          progressValue: progressValue,
          isMastered: isMastered,
        },
      })
    })
    console.log(`Formatted ${initialNodes.length} initial nodes.`)

    // 7. Format 'requiredConcepts' relationships into React Flow 'edges'
    const formattedEdges: Edge[] = []
    allConceptsMap.forEach((concept, conceptId) => {
      if (concept.requiredConcepts && Array.isArray(concept.requiredConcepts)) {
        concept.requiredConcepts.forEach((req) => {
          const sourceId = typeof req === 'number' ? req : req.id
          const targetId = conceptId

          // Ensure both source and target nodes actually exist in our map before creating edge
          if (sourceId && allConceptsMap.has(sourceId)) {
            formattedEdges.push({
              id: `e-${sourceId}-${targetId}`,
              source: String(sourceId),
              target: String(targetId),
              type: 'smoothstep',
              animated: false,
            })
          } else {
            console.warn(
              `Skipping edge creation: Prerequisite concept ID ${sourceId} for target ${targetId} not found in fetched concepts.`,
            )
          }
        })
      }
    })
    edges = formattedEdges
    console.log(`Formatted ${edges.length} edges.`)

    // 8. Calculate layout using Dagre and update node positions
    if (initialNodes.length > 0) {
      nodes = calculateLayout(initialNodes, edges)
      console.log(`Calculated layout for ${nodes.length} nodes.`)
    } else {
      nodes = [] // Ensure nodes is empty if initialNodes was empty
    }
  } catch (error) {
    console.error(`Error fetching skill concept tree data for slug "${skillSlug}":`, error)
    // Ensure nodes/edges are empty in case of error after partial processing
    nodes = []
    edges = []
  }

  // Final return outside the try...catch
  return { nodes, edges }
}
