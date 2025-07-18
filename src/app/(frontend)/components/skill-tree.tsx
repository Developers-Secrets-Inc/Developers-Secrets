'use client'

import React from 'react'
import ReactFlow, { Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import { List, Repeat, Code2, Split, FunctionSquare, Shuffle, Sigma } from 'lucide-react'

function SkillNode({ data }: { data: { label: string; icon?: React.ReactNode } }) {
  return (
    <div className="px-3 py-2 shadow rounded-md border flex flex-col items-center min-w-[80px] bg-background">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary/30 w-2 h-1"
        style={{ top: -6 }}
      />
      <div className="flex items-center justify-center w-7 h-7 rounded-full mb-1 bg-muted border border-border">
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

const nodeTypes = { skill: SkillNode }

const nodes = [
  {
    id: 'variables',
    type: 'skill',
    position: { x: 200, y: 0 },
    data: { label: 'Variables', icon: <Sigma size={18} /> },
  },
  {
    id: 'lists',
    type: 'skill',
    position: { x: 60, y: 100 },
    data: { label: 'Lists', icon: <List size={18} /> },
  },
  {
    id: 'loops',
    type: 'skill',
    position: { x: 200, y: 100 },
    data: { label: 'Loops', icon: <Repeat size={18} /> },
  },
  {
    id: 'conditions',
    type: 'skill',
    position: { x: 340, y: 100 },
    data: { label: 'Conditions', icon: <Split size={18} /> },
  },
  {
    id: 'functions',
    type: 'skill',
    position: { x: 130, y: 200 },
    data: { label: 'Functions', icon: <FunctionSquare size={18} /> },
  },
  {
    id: 'recursion',
    type: 'skill',
    position: { x: 270, y: 200 },
    data: { label: 'Recursion', icon: <Shuffle size={18} /> },
  },
  {
    id: 'algorithms',
    type: 'skill',
    position: { x: 200, y: 300 },
    data: { label: 'Algorithms', icon: <Code2 size={18} /> },
  },
]

const edges = [
  { id: 'e1', source: 'variables', target: 'lists', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e2', source: 'variables', target: 'loops', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  {
    id: 'e3',
    source: 'variables',
    target: 'conditions',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  { id: 'e4', source: 'lists', target: 'functions', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e5', source: 'loops', target: 'functions', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  {
    id: 'e6',
    source: 'conditions',
    target: 'functions',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  {
    id: 'e7',
    source: 'functions',
    target: 'recursion',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  {
    id: 'e8',
    source: 'recursion',
    target: 'algorithms',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
]

const proOptions = { hideAttribution: true }

export function SkillTreeGraph() {
  return (
    <div className="relative w-full h-[340px]">
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

export default SkillTreeGraph
