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
    <div
      className="px-2 py-1 shadow rounded border flex flex-col items-center bg-background text-xs"
      style={{ minWidth: 48, minHeight: 48 }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary/30 w-1 h-1"
        style={{ left: -6, top: '50%', transform: 'translateY(-50%)' }}
      />
      <div className="flex items-center justify-center w-6 h-6 rounded-full mb-0.5 bg-muted border border-border">
        {data.icon}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary/30 w-1 h-1"
        style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }}
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
    data: { label: 'HTML', icon: <HtmlLogoIcon width={16} height={16} /> },
  },
  {
    id: 'css',
    type: 'learning',
    position: { x: 80, y: 100 },
    data: { label: 'CSS', icon: <CssLogoIcon width={16} height={16} /> },
  },
  {
    id: 'js',
    type: 'learning',
    position: { x: 160, y: 100 },
    data: { label: 'JavaScript', icon: <JsLogoIcon width={16} height={16} /> },
  },
  {
    id: 'react',
    type: 'learning',
    position: { x: 240, y: 100 },
    data: { label: 'React', icon: <ReactLogoIcon width={16} height={16} /> },
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
    <div className="relative w-full h-[100px]">
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
