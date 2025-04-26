import React, { memo, useMemo, useState } from 'react'
import { Handle, Position, NodeProps, useEdges, useNodeId } from 'reactflow'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress' // Assuming progress component exists
import { CheckCircle2Icon, Zap, Loader2 } from 'lucide-react' // Example icon for mastery, added Zap, Loader2
import { Badge } from '@/components/ui/badge' // <--- Import Badge
import { Button } from '@/components/ui/button' // <--- Add Button
import { masterConceptManually } from '@/core/skills/progression' // <--- Import server action
import { useRouter } from 'next/navigation' // <--- Import router
import { toast } from 'sonner' // Optional: for feedback

// Define the expected structure of the data prop for this node type
interface ConceptNodeData {
  label: string
  conceptId: number // Ensure this is number if used in action
  progressValue?: number // Optional progress (0-100)
  isMastered?: boolean // Optional mastery flag
  groups?: { name: string; slug: string }[] // <--- Add groups type
  isParentMastered?: boolean // <--- Add parent mastery status type
  // Pass necessary info for the action
  userId?: string // Make optional as root nodes might not have it?
  skillSlug?: string
}

// Use NodeProps<ConceptNodeData> for type safety
function ConceptNode({ data, selected }: NodeProps<ConceptNodeData>) {
  const nodeId = useNodeId() // Get the ID of the current node
  const edges = useEdges() // Get all edges in the flow
  const router = useRouter() // Hook for refreshing
  const [isLoading, setIsLoading] = useState(false) // Loading state

  // Check if this node is a target in any edge (has a parent)
  const hasParent = useMemo(() => {
    if (!nodeId) return false
    return edges.some((edge) => edge.target === nodeId)
  }, [edges, nodeId])

  // Check if this node is a source in any edge (has children)
  const hasChildren = useMemo(() => {
    if (!nodeId) return false
    return edges.some((edge) => edge.source === nodeId)
  }, [edges, nodeId])

  const progress = data.progressValue ?? 0
  const isMastered = data.isMastered ?? progress >= 100 // Infer mastery if not provided

  const handleManualMastery = async () => {
    if (isLoading || !data.userId || !data.conceptId || !data.skillSlug) return
    setIsLoading(true)
    try {
      await masterConceptManually(data.userId, data.conceptId, data.skillSlug)
      toast.success(`Concept "${data.label}" mastered!`)
      router.refresh() // Refresh data on success
      // No need to setIsLoading(false) here as the component will re-render after refresh
    } catch (error) {
      console.error('Manual mastery failed:', error)
      toast.error('Failed to master concept.')
      setIsLoading(false) // Reset loading state on error
    }
  }

  return (
    // Main node container - styled like a small card
    <div
      className={cn(
        'relative px-4 py-3 shadow-md rounded-lg border bg-card text-card-foreground w-48', // Card-like style, fixed width
        'transition-all duration-150 ease-in-out',
        selected ? 'border-primary shadow-lg scale-105' : 'border-border', // Style when selected
      )}
    >
      {/* --- Manual Mastery Button --- */}
      {data.isParentMastered && !isMastered && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 text-amber-500 hover:text-amber-400 hover:bg-amber-100/50 disabled:opacity-50"
          onClick={handleManualMastery}
          disabled={isLoading}
          title="Master this concept (parent mastered)"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
        </Button>
      )}
      {/* --- End Manual Mastery Button --- */}

      <div className="flex flex-col gap-2">
        {/* Concept Name */}
        <div className="flex items-center justify-between gap-2 pr-6">
          <div className="text-sm font-semibold truncate" title={data.label}>
            {data.label}
          </div>
          {isMastered && <CheckCircle2Icon className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
        </div>

        {/* Group Badges */}
        {data.groups && data.groups.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.groups.map((group) => (
              <Badge key={group.slug} variant="secondary" className="text-xs px-1.5 py-0.5">
                {group.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress Bar (shown if not mastered and progress > 0) */}
        {!isMastered && progress > 0 && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* Placeholder if no progress */}
        {!isMastered && progress <= 0 && (
          <div className="h-[22px]">
            {' '}
            {/* Reserve space matching progress bar */}
            <p className="text-xs text-muted-foreground/50 italic">Not started</p>
          </div>
        )}
        {isMastered && <div className="h-[22px]" /> /* Reserve space when mastered */}
      </div>

      {/* Conditionally render Top Handle (target) */}
      {hasParent && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-1 !h-1 !-top-1 !border-none !bg-primary/30 hover:!bg-primary/80"
          isConnectable={false} // Optional: make it visually present but not interactable if needed
        />
      )}

      {/* Conditionally render Bottom Handle (source) */}
      {hasChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-1 !h-1 !-bottom-1 !border-none !bg-primary/30 hover:!bg-primary/80"
          isConnectable={false} // Optional
        />
      )}
    </div>
  )
}

// Use memo for performance optimization, especially with many nodes
export default memo(ConceptNode)
