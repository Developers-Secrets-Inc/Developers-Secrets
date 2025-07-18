'use client'

import React from 'react'
import ReactFlow, { Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import { HtmlLogoIcon } from '@/components/icons/html-logo-icon'
import { CssLogoIcon } from '@/components/icons/css-logo-icon'
import { JsLogoIcon } from '@/components/icons/js-logo-icon'
import { ReactLogoIcon } from '@/components/icons/react-logo-icon'

// Custom node for a learning path step
function LearningPathNode({ data }: { data: { label: string; icon: React.ReactNode } }) {
  return (
    <div className="px-4 py-3 shadow rounded-md border flex flex-col items-center min-w-[80px] bg-background">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary/30 w-2 h-1"
        style={{ top: -6 }}
      />
      <div className="flex items-center justify-center w-8 h-8 rounded-full mb-1 bg-muted border border-border">
        {data.icon}
      </div>
      <div className="text-xs font-medium text-center truncate w-full">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary/30 w-2 h-1"
        style={{ bottom: -6 }}
      />
    </div>
  )
}

const nodeTypes = { learning: LearningPathNode }

const nodes = [
  {
    id: 'html',
    type: 'learning',
    position: { x: 0, y: 100 },
    data: { label: 'HTML', icon: <HtmlLogoIcon width={24} height={24} /> },
  },
  {
    id: 'css',
    type: 'learning',
    position: { x: 120, y: 100 },
    data: { label: 'CSS', icon: <CssLogoIcon width={24} height={24} /> },
  },
  {
    id: 'js',
    type: 'learning',
    position: { x: 240, y: 100 },
    data: { label: 'JavaScript', icon: <JsLogoIcon width={24} height={24} /> },
  },
  {
    id: 'react',
    type: 'learning',
    position: { x: 360, y: 100 },
    data: { label: 'React', icon: <ReactLogoIcon width={24} height={24} /> },
  },
]

const edges = [
  { id: 'e1', source: 'html', target: 'css', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e2', source: 'css', target: 'js', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e3', source: 'js', target: 'react', style: { stroke: '#38bdf8', strokeWidth: 2 } },
]

const proOptions = { hideAttribution: true }

export function LearningPathGraph() {
  return (
    <div className="relative w-full h-[180px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        elementsSelectable={false}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        className="w-full h-full"
        proOptions={proOptions}
      />
    </div>
  )
}

export default LearningPathGraph
