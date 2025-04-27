import config from '@payload-config'
import { getPayload } from 'payload'
import type {
  Concept,
  ImplementationConcept,
  UserConceptProgression,
  UserImplementationConceptProgression,
} from '@/payload-types'
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

    //console.log(`Fetching details for concepts:`, currentBatchIds)
    // Fetch concepts in the current batch, requesting requiredConcepts AND parentConcept
    const conceptsResult = await payload.find({
      collection: 'concepts',
      where: {
        id: { in: currentBatchIds },
      },
      limit: currentBatchIds.length,
      // Depth 2 is needed to get related objects like requiredConcepts,
      // parentConcept, AND the names/slugs within the 'groups' relationship.
      depth: 2,
      pagination: false,
    })

    for (const concept of conceptsResult.docs as Concept[]) {
      if (!allConceptsMap.has(concept.id)) {
        allConceptsMap.set(concept.id, concept)
      }
      processedConceptIds.add(concept.id)

      if (concept.requiredConcepts && Array.isArray(concept.requiredConcepts)) {
        for (const req of concept.requiredConcepts) {
          const reqId = typeof req === 'number' ? req : req.id
          if (reqId && !processedConceptIds.has(reqId) && !allConceptsMap.has(reqId)) {
            conceptIdsToProcess.add(reqId)
          }
        }
      }
      // Also add parent concepts to be processed if not already seen
      const parentConceptRelation = concept.parentConcept
      const parentId =
        typeof parentConceptRelation === 'number'
          ? parentConceptRelation
          : parentConceptRelation?.id
      if (parentId && !processedConceptIds.has(parentId) && !allConceptsMap.has(parentId)) {
        conceptIdsToProcess.add(parentId)
      }
    }
  }
  //console.log(`Total unique concepts found (incl. prerequisites and parents): ${allConceptsMap.size}`)
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

    // 5b. Fetch UserImplementationConceptProgressions for THIS skill
    const implementationConceptIds = implementationConcepts.map((ic) => ic.id)
    const userImplementationProgressionsResult = await payload.find({
      collection: 'userImplementationConceptProgressions',
      where: {
        user: { equals: userId },
        implementationConcept: { in: implementationConceptIds },
      },
      limit: implementationConceptIds.length,
      depth: 1, // Need depth 1 to link back to the base concept via implementationConcept.concept
      pagination: false,
    })

    // Map implementation progress back to the BASE concept ID
    const userImplementationProgressMap = new Map<number, number>()
    const implProgressions =
      userImplementationProgressionsResult.docs as (UserImplementationConceptProgression & {
        implementationConcept: ImplementationConcept & { concept: Concept | number }
      })[]

    for (const implProg of implProgressions) {
      if (
        implProg.implementationConcept &&
        typeof implProg.implementationConcept === 'object' &&
        implProg.implementationConcept.concept &&
        implProg.progressValue !== null &&
        implProg.progressValue !== undefined
      ) {
        const baseConceptId =
          typeof implProg.implementationConcept.concept === 'number'
            ? implProg.implementationConcept.concept
            : implProg.implementationConcept.concept.id
        if (baseConceptId) {
          userImplementationProgressMap.set(baseConceptId, implProg.progressValue)
        }
      }
    }
    console.log(
      `Found ${userImplementationProgressMap.size} user implementation progression entries for this skill.`,
    )

    // 6. Format Concepts into React Flow 'nodes' (without positions initially)
    const initialNodes: Node[] = []
    allConceptsMap.forEach((concept, conceptId) => {
      // --- Determine Parent Mastery ---
      let isParentMastered = false
      const parentConceptRelation = concept.parentConcept
      const parentId =
        typeof parentConceptRelation === 'number'
          ? parentConceptRelation
          : typeof parentConceptRelation === 'object' && parentConceptRelation !== null
            ? parentConceptRelation.id
            : null

      if (parentId && allConceptsMap.has(parentId)) {
        const parentConcept = allConceptsMap.get(parentId)
        if (parentConcept) {
          // Use the SAME logic to determine parent progress (implementation first, then base)
          const parentImplProgress = userImplementationProgressMap.get(parentId)
          const parentBaseProgress = userProgressMap.get(parentId) ?? 0
          const parentProgress =
            parentImplProgress !== undefined ? parentImplProgress : parentBaseProgress
          isParentMastered = parentProgress >= 100
        }
      }
      // --- End Parent Mastery Determination ---

      // Prioritize implementation progress for THIS skill
      const implementationProgress = userImplementationProgressMap.get(conceptId)
      // Fallback to base concept progress if no specific implementation progress exists
      const baseProgress = userProgressMap.get(conceptId) ?? 0

      const progressValue =
        implementationProgress !== undefined ? implementationProgress : baseProgress
      const isMastered = progressValue >= 100 // Base mastery on the displayed progress

      // Extract group information (ensure groups is an array of objects)
      const groupsData = Array.isArray(concept.groups)
        ? concept.groups
            .map((group) => {
              // Check if group is populated object with name and slug
              if (typeof group === 'object' && group !== null && group.name && group.slug) {
                return { name: group.name, slug: group.slug }
              }
              return null // Ignore if not populated correctly
            })
            .filter((g): g is { name: string; slug: string } => g !== null) // Type guard filter
        : []

      initialNodes.push({
        id: String(conceptId),
        type: 'concept',
        position: { x: 0, y: 0 }, // Placeholder
        data: {
          label: concept.name,
          conceptId: conceptId,
          progressValue: progressValue, // Use the prioritized progress
          isMastered: isMastered, // Use the prioritized mastery
          groups: groupsData, // Add groups data here
          isParentMastered: isParentMastered, // <--- Add parent mastery status
          // Pass necessary info for the action
          userId: userId,
          skillSlug: skillSlug,
        },
      })
    })
    console.log(`Formatted ${initialNodes.length} initial nodes.`)

    // 7. Format relationships into React Flow 'edges'
    const requirementEdges: Edge[] = []
    const groupingEdges: Edge[] = [] // Separate array for grouping edges

    allConceptsMap.forEach((concept, conceptId) => {
      // 7a. Create edges for 'requiredConcepts' (Prerequisites)
      if (concept.requiredConcepts && Array.isArray(concept.requiredConcepts)) {
        concept.requiredConcepts.forEach((req) => {
          const sourceId = typeof req === 'number' ? req : req.id
          const targetId = conceptId
          if (sourceId && allConceptsMap.has(sourceId)) {
            requirementEdges.push({
              id: `req-${sourceId}-${targetId}`, // Prefix ID
              source: String(sourceId),
              target: String(targetId),
              type: 'smoothstep',
              // Style for requirement edges (default or slightly darker)
              style: { strokeWidth: 1.5, stroke: '#71717a' }, // zinc-500
              animated: false,
              // markerEnd: { type: MarkerType.ArrowClosed, color: '#71717a' }, // Example arrowhead
            })
          } else {
            console.warn(
              `Skipping requirement edge: Prerequisite concept ID ${sourceId} for target ${targetId} not found.`,
            )
          }
        })
      }

      // 7b. Create edges for 'parentConcept' (Grouping)
      const parentConceptRelation = concept.parentConcept
      const parentId =
        typeof parentConceptRelation === 'number'
          ? parentConceptRelation
          : typeof parentConceptRelation === 'object' && parentConceptRelation !== null // Check object type
            ? parentConceptRelation.id
            : null // Handle cases where it's not number or object

      if (parentId && allConceptsMap.has(parentId)) {
        groupingEdges.push({
          id: `group-${parentId}-${conceptId}`, // Prefix ID differently
          source: String(parentId), // Parent is the source
          target: String(conceptId), // Child is the target
          type: 'smoothstep',
          // Style for grouping edges (dashed, lighter)
          style: { strokeWidth: 1, stroke: '#d4d4d8', strokeDasharray: '5 5' }, // zinc-300 dashed
          animated: false,
          // No arrowhead for grouping? Optional.
        })
      }
    })

    // Combine edges (render requirement edges first potentially)
    edges = [...requirementEdges, ...groupingEdges]
    console.log(
      `Formatted ${requirementEdges.length} requirement edges and ${groupingEdges.length} grouping edges.`,
    )

    // 8. Calculate layout using Dagre and update node positions
    if (initialNodes.length > 0) {
      // Pass ALL edges to the layout algorithm
      nodes = calculateLayout(initialNodes, edges)
      console.log(`Calculated layout for ${nodes.length} nodes.`)
    } else {
      nodes = [] // Ensure nodes is empty if initialNodes was empty
    }
  } catch (error) {
    console.error('Error fetching concept tree data:', error)
    // Ensure nodes/edges are empty in case of error after partial processing
    nodes = []
    edges = []
  }

  // Final return outside the try...catch
  return { nodes, edges } // Return the calculated nodes and edges
}
