'use client'

import { NodeProps, ReactFlow, Background, Edge, Node } from 'reactflow'
import 'reactflow/dist/style.css'
import React from 'react'
import { Handle, Position } from 'reactflow'
import dagre from '@dagrejs/dagre'
import { useNodesState, useEdgesState } from 'reactflow'
import { ConceptNodeWithProgress } from '@/api/skills'
import { Lock, CheckCircle2 } from 'lucide-react'

// Types pour les props
export type SkillTreeProps = {
  skill: {
    id: number
    name: string
    slug: string
    description?: string
  }
  concepts: ConceptNodeWithProgress[] // rootConcepts enrichis
}

// Transforme la structure récursive en nodes/edges pour React Flow
function buildNodesAndEdges(
  concepts: ConceptNodeWithProgress[],
  parentId: number | null = null,
  nodes: Node[] = [],
  edges: Edge[] = [],
  isRootLevel = false,
) {
  for (const concept of concepts) {
    nodes.push({
      id: String(concept.id),
      data: { label: concept.name, progress: concept.progress, isLocked: concept.isLocked },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: 'custom',
    })
    if (parentId !== null) {
      edges.push({
        id: `${parentId}->${concept.id}`,
        source: String(parentId),
        target: String(concept.id),
        type: 'smoothstep',
      })
    }
    // Edges pour les requiredConcepts (prérequis)
    for (const reqId of concept.requiredConcepts) {
      edges.push({
        id: `req-${reqId}->${concept.id}`,
        source: String(reqId),
        target: String(concept.id),
        type: 'dashed',
        style: { strokeDasharray: '4 2', stroke: '#888' },
      })
    }
    buildNodesAndEdges(concept.subConcepts, concept.id, nodes, edges)
  }
  return { nodes, edges }
}

const nodeWidth = 180
const nodeHeight = 60
const skillRootWidth = 260
const skillRootHeight = 80

function getLayoutedElements(nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node) => {
    const isRoot = node.id === 'skill-root'
    dagreGraph.setNode(node.id, {
      width: isRoot ? skillRootWidth : nodeWidth,
      height: isRoot ? skillRootHeight : nodeHeight,
    })
  })
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })
  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - (node.id === 'skill-root' ? skillRootWidth : nodeWidth) / 2,
        y: nodeWithPosition.y - (node.id === 'skill-root' ? skillRootHeight : nodeHeight) / 2,
      },
      draggable: false,
    }
  })
  return { nodes: layoutedNodes, edges }
}

// Node personnalisé inspiré du style de concept-node.tsx (mais sans logique métier)
const CustomConceptNode = ({
  data,
}: {
  data: { label: string; progress?: number; isLocked?: boolean }
}) => {
  const isLocked = data.isLocked
  const progress = typeof data.progress === 'number' ? data.progress : 0
  const isMastered = progress >= 100
  return (
    <div
      className={
        `px-4 py-2 shadow-md rounded-lg border border-border min-w-[120px] max-w-[200px] relative ` +
        (isLocked ? 'opacity-50 grayscale pointer-events-none' : 'bg-background')
      }
    >
      <div className="flex items-center gap-2">
        <div className="text-base font-semibold text-white truncate flex-1" title={data.label}>
          {data.label}
        </div>
        {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
        {!isLocked && isMastered && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      </div>
      {/* Progression */}
      {!isLocked && !isMastered && (
        <div className="mt-1">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <Handle type="target" position={Position.Top} className="w-12 h-1 !bg-primary rounded-full" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-12 h-1 !bg-primary rounded-full"
      />
    </div>
  )
}

// Node central pour le skill
const SkillRootNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="px-6 py-4 shadow-lg rounded-xl text-primary border-primary/20 bg-primary/20 border font-semibold text-xl min-w-[180px] max-w-[320px] flex items-center justify-center relative">
      {data.label}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-12 h-1 !bg-primary rounded-full absolute left-1/2 -translate-x-1/2"
      />
    </div>
  )
}

export const SkillTree: React.FC<SkillTreeProps> = ({ skill, concepts }) => {
  // Génère nodes/edges pour tous les concepts (sans parentId)
  const { nodes, edges } = React.useMemo(() => buildNodesAndEdges(concepts), [concepts])

  // Ajoute le node central (skill)
  const rootNode = {
    id: 'skill-root',
    data: { label: skill.name },
    position: { x: 0, y: 0 },
    type: 'skillRoot' as const,
  }
  // Ajoute un edge du node central vers chaque rootConcept
  const rootEdges = concepts.map((c) => ({
    id: `skill-root->${c.id}`,
    source: 'skill-root',
    target: String(c.id),
    type: 'smoothstep' as const,
  }))

  // Fusionne nodes/edges
  const allNodes = [rootNode, ...nodes]
  const allEdges = [...rootEdges, ...edges]

  // Applique le layout dagre (vertical par défaut)
  const { nodes: layoutedNodes, edges: layoutedEdges } = React.useMemo(
    () => getLayoutedElements(allNodes, allEdges, 'TB'),
    [allNodes, allEdges],
  )

  // Utilise l'état React Flow
  const [rfNodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
  const [rfEdges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

  // Enregistre les nodeTypes
  const nodeTypes = React.useMemo(
    () => ({ custom: CustomConceptNode, skillRoot: SkillRootNode }),
    [],
  )

  return (
    <div style={{ width: '100%', height: '100%', background: '#18181b' }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        style={{ background: '#18181b', color: '#fafafa' }}
        className="dark"
        nodeTypes={nodeTypes}
      >
        <Background color="#27272a" gap={12} />
      </ReactFlow>
    </div>
  )
}
