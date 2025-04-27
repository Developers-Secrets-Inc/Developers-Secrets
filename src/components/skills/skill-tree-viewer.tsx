'use client' // Add 'use client' directive

import React, { useState, useCallback, useEffect } from 'react'
import ReactFlow, {
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  NodeMouseHandler, // Type for the click handler
  NodeTypes, // Import NodeTypes
  useReactFlow, // Import hook for fitView control
} from 'reactflow'
import 'reactflow/dist/style.css'

// Import your Sheet components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet' // Assuming this is the correct path
import ConceptNode from './concept-node' // Import the custom node
import { fetchSkillTreeAction, fetchChallengesForConceptAction } from '@/core/skills/actions' // Import the Server Action
import { Skeleton } from '@/components/ui/skeleton' // For loading state
import type { SimpleChallenge } from '@/core/challenges' // Assuming SimpleChallenge is exported
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ReactFlowProvider } from 'reactflow' // Keep provider import

// Define the props interface
interface SkillTreeViewerProps {
  selectedSkillSlug?: string // Accept the selected skill slug
}

// Dummy data generation function (example)
const getDummyDataForSkill = (slug?: string): { nodes: Node[]; edges: Edge[] } => {
  switch (slug) {
    case 'python':
      return {
        nodes: [
          {
            id: 'p1',
            type: 'concept', // Set node type
            position: { x: 50, y: 50 },
            data: {
              label: 'Python Basics',
              conceptId: 'py-basics',
              progressValue: 100,
              isMastered: true,
            }, // Add progress/mastery
          },
          {
            id: 'p2',
            type: 'concept',
            position: { x: 50, y: 180 }, // Increased y spacing
            data: { label: 'Python Loops', conceptId: 'py-loops', progressValue: 35 },
          },
          {
            id: 'p3',
            type: 'concept',
            position: { x: 50, y: 310 },
            data: { label: 'Python Functions', conceptId: 'py-funcs', progressValue: 0 },
          },
        ],
        edges: [
          { id: 'ep1-p2', source: 'p1', target: 'p2', type: 'smoothstep', animated: false }, // Example edge type
          { id: 'ep2-p3', source: 'p2', target: 'p3', type: 'smoothstep', animated: false },
        ],
      }
    case 'react':
      return {
        nodes: [
          {
            id: 'r1',
            type: 'concept',
            position: { x: 100, y: 50 },
            data: {
              label: 'React Components',
              conceptId: 'react-comp',
              progressValue: 100,
              isMastered: true,
            },
          },
          {
            id: 'r2',
            type: 'concept',
            position: { x: 100, y: 180 },
            data: { label: 'React State (useState)', conceptId: 'react-state', progressValue: 80 },
          },
          {
            id: 'r3',
            type: 'concept',
            position: { x: 100, y: 310 },
            data: {
              label: 'React Side Effects (useEffect)',
              conceptId: 'react-hooks',
              progressValue: 15,
            },
          },
        ],
        edges: [
          { id: 'er1-r2', source: 'r1', target: 'r2', type: 'smoothstep' },
          { id: 'er2-r3', source: 'r2', target: 'r3', type: 'smoothstep' },
        ],
      }
    case 'typescript':
      return {
        nodes: [
          {
            id: 't1',
            type: 'concept',
            position: { x: 150, y: 50 },
            data: { label: 'TypeScript Types', conceptId: 'ts-types', progressValue: 95 },
          },
          {
            id: 't2',
            type: 'concept',
            position: { x: 150, y: 180 },
            data: { label: 'TypeScript Interfaces', conceptId: 'ts-interfaces', progressValue: 0 },
          },
        ],
        edges: [{ id: 'et1-t2', source: 't1', target: 't2', type: 'smoothstep' }],
      }
    default:
      // Return empty or some default state if no slug matches
      return { nodes: [], edges: [] }
  }
}

// Define the node types for React Flow
const nodeTypes: NodeTypes = {
  concept: ConceptNode, // Map 'concept' type string to our component
}

// Loading Skeleton Component
const TreeSkeleton = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
    {/* Simple spinner or more elaborate skeleton */}
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
)

// Error Display Component
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 z-10 p-4 text-center">
    <p className="text-destructive font-semibold mb-2">Error loading skill tree:</p>
    <p className="text-sm text-destructive/80">{message}</p>
  </div>
)

// --- Helper for Challenge Difficulty Badge Style ---
const getDifficultyBadgeClass = (difficulty: SimpleChallenge['difficulty']): string => {
  switch (difficulty) {
    case 'easy':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'medium':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'hard':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    case 'horrible':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    default:
      return ''
  }
}

// --- Component to render the list inside the sheet ---
const SheetChallengeList = ({
  challenges,
  isLoading,
  error,
}: {
  challenges: SimpleChallenge[] | null
  isLoading: boolean
  error: string | null
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3 py-4 px-4">
        {/* Skeleton for challenge list */}
        {[1, 2].map((i) => (
          <div key={i} className="p-3 border rounded-md flex items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive py-4">{error}</p>
  }

  if (!challenges || challenges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No related challenges found for this concept.
      </p>
    )
  }

  return (
    <div className="py-4 space-y-3 px-4">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="p-3 border rounded-md flex items-center justify-between gap-3"
        >
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <p className="font-medium truncate text-sm" title={challenge.title}>
              {challenge.title}
            </p>
            <Badge
              variant="secondary"
              className={cn(
                'capitalize text-xs px-1.5 py-0.5 font-medium border whitespace-nowrap',
                getDifficultyBadgeClass(challenge.difficulty),
              )}
            >
              {challenge.difficulty}
            </Badge>
          </div>
          {/* Ensure link points to the correct challenge description page */}
          <Button asChild variant="outline" size="sm" className="whitespace-nowrap">
            <Link href={`/challenges/${challenge.slug}/description`}>View</Link>
          </Button>
        </div>
      ))}
    </div>
  )
}

function SkillTreeViewer({ selectedSkillSlug }: SkillTreeViewerProps) {
  // Initialize state empty, data will be fetched
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [isLoadingTree, setIsLoadingTree] = useState(false)
  const [treeError, setTreeError] = useState<string | null>(null)
  const [selectedConcept, setSelectedConcept] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { fitView } = useReactFlow() // Get fitView function

  // State for the sheet content (challenges)
  const [challengeList, setChallengeList] = useState<SimpleChallenge[] | null>(null)
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false)
  const [challengesError, setChallengesError] = useState<string | null>(null)

  // Effect to fetch data when selectedSkillSlug changes
  useEffect(() => {
    if (!selectedSkillSlug) {
      setNodes([])
      setEdges([])
      setTreeError(null)
      setIsLoadingTree(false)
      return // No skill selected
    }

    const fetchData = async () => {
      setIsLoadingTree(true)
      setTreeError(null)
      console.log(`Calling fetchSkillTreeAction for slug: ${selectedSkillSlug}`)
      try {
        const result = await fetchSkillTreeAction(selectedSkillSlug)

        if (result.error) {
          console.error('Error from Server Action:', result.error)
          setTreeError(result.error)
          setNodes([])
          setEdges([])
        } else {
          console.log(`Received ${result.nodes.length} nodes and ${result.edges.length} edges.`)
          setNodes(result.nodes)
          setEdges(result.edges)
          // Use a short timeout to allow React Flow internal layout calculations
          // before fitting the view, prevents potential race conditions.
          setTimeout(() => {
            fitView({ padding: 0.1, duration: 300 }) // Adjust padding/duration
          }, 50)
        }
      } catch (err: any) {
        console.error('Client-side error calling action:', err)
        setTreeError('An unexpected error occurred.')
        setNodes([])
        setEdges([])
      } finally {
        setIsLoadingTree(false)
      }
    }

    fetchData()

    // Only re-run when the slug changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSkillSlug, fitView]) // Added fitView to dependency array

  // Effect to fetch CHALLENGES when sheet opens for a concept
  useEffect(() => {
    if (isSheetOpen && selectedConcept?.conceptId) {
      const conceptId = selectedConcept.conceptId
      const fetchChallenges = async () => {
        setIsLoadingChallenges(true)
        setChallengesError(null)
        setChallengeList(null) // Clear previous list
        console.log(`Fetching challenges for concept: ${conceptId}`)
        try {
          const result = await fetchChallengesForConceptAction(conceptId)
          if (result.error) {
            setChallengesError(result.error)
          } else {
            setChallengeList(result.challenges || [])
          }
        } catch (err) {
          console.error('Client-side error fetching challenges:', err)
          setChallengesError('Failed to load challenges.')
        } finally {
          setIsLoadingChallenges(false)
        }
      }
      fetchChallenges()
    } else {
      // Clear state when sheet is closed or no concept selected
      setChallengeList(null)
      setIsLoadingChallenges(false)
      setChallengesError(null)
    }
  }, [isSheetOpen, selectedConcept?.conceptId]) // Dependencies: sheet state and concept ID

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes], // Keep setNodes dependency
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges], // Keep setEdges dependency
  )

  // Reset challenge state when node is clicked BEFORE opening sheet
  const handleNodeClick: NodeMouseHandler = useCallback((event, node) => {
    console.log('Node clicked:', node)
    setSelectedConcept(node.data)
    // Reset challenge-related states immediately
    setChallengeList(null)
    setIsLoadingChallenges(false)
    setChallengesError(null)
    setIsSheetOpen(true) // Then open the sheet
  }, [])

  return (
    // Add relative positioning for skeleton/error overlay
    <div
      style={{ height: '100%', width: '100%' }}
      className="relative bg-muted/20 rounded-md overflow-hidden"
    >
      {isLoadingTree && <TreeSkeleton />}
      {treeError && !isLoadingTree && <ErrorDisplay message={treeError} />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes} // Pass the custom node types
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick} // <-- Add the click handler
        // --- Disable interactions ---
        nodesDraggable={false} // Prevent dragging nodes
        nodesConnectable={false} // Prevent creating connections from nodes
        edgesFocusable={false} // Optional: Prevent focusing edges on click
        elementsSelectable={true} // Keep selection enabled for onNodeClick to work easily
        // --- Enable navigation ---
        // fitView // Let useEffect handle fitView
        key={selectedSkillSlug} // Keep key to help reset state if needed
        panOnDrag={true} // Enable panning
        zoomOnScroll={true} // Enable zooming
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        // --- Optional appearance ---
        deleteKeyCode={null} // Disable delete key
        proOptions={{ hideAttribution: true }} // Hide React Flow attribution if needed
        // Key prop can help React Flow reset internal state like zoom/pan on data change if needed
        // Default edge options for style consistency
        defaultEdgeOptions={{ type: 'smoothstep', style: { strokeWidth: 1.5, stroke: '#a1a1aa' } }} // zinc-500
        connectionLineStyle={{ strokeWidth: 1.5, stroke: '#a1a1aa' }}
        // Only render flow when not loading and no error, or if nodes exist despite error
        style={{
          visibility: isLoadingTree || (treeError && nodes.length === 0) ? 'hidden' : 'visible',
        }}
      >
        <Background gap={16} color="#e4e4e7" />
      </ReactFlow>
      {/* Sheet Component */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {' '}
          {/* Allow scroll */}
          <SheetHeader>
            <SheetTitle>Concept: {selectedConcept?.label}</SheetTitle>
            <SheetDescription>Related challenges to practice this concept.</SheetDescription>
          </SheetHeader>
          {/* Render the challenge list component */}
          <SheetChallengeList
            challenges={challengeList}
            isLoading={isLoadingChallenges}
            error={challengesError}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Wrap SkillTreeViewer with ReactFlowProvider to use useReactFlow hook
function SkillTreeViewerWrapper(props: SkillTreeViewerProps) {
  return (
    <ReactFlowProvider>
      <SkillTreeViewer {...props} />
    </ReactFlowProvider>
  )
}

export default SkillTreeViewerWrapper
