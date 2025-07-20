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
        position={Position.Left}
        className="!bg-primary/30 w-1 h-2"
        style={{ left: -6, top: '50%', transform: 'translateY(-50%)' }}
      />
      <div className="flex items-center justify-center w-7 h-7 rounded-full mb-1 bg-muted border border-border">
        {data.icon}
      </div>
      <div className="text-xs font-medium text-center truncate w-full">{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary/30 w-1 h-2"
        style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  )
}

const nodeTypes = { skill: SkillNode }

const nodes = [
  // Colonne 1 (départ)
  {
    id: 'variables',
    type: 'skill',
    position: { x: 0, y: 60 },
    data: { label: 'Variables', icon: <Sigma size={18} /> },
  },
  {
    id: 'types',
    type: 'skill',
    position: { x: 0, y: 140 },
    data: { label: 'Types', icon: <FunctionSquare size={18} /> },
  },
  // Colonne 2
  {
    id: 'operators',
    type: 'skill',
    position: { x: 160, y: 20 },
    data: { label: 'Operators', icon: <Shuffle size={18} /> },
  },
  {
    id: 'lists',
    type: 'skill',
    position: { x: 160, y: 100 },
    data: { label: 'Lists', icon: <List size={18} /> },
  },
  {
    id: 'objects',
    type: 'skill',
    position: { x: 160, y: 180 },
    data: { label: 'Objects', icon: <Code2 size={18} /> },
  },
  // Colonne 3
  {
    id: 'loops',
    type: 'skill',
    position: { x: 320, y: 40 },
    data: { label: 'Loops', icon: <Repeat size={18} /> },
  },
  {
    id: 'branching',
    type: 'skill',
    position: { x: 320, y: 120 },
    data: { label: 'Branching', icon: <Split size={18} /> },
  },
  {
    id: 'arrays',
    type: 'skill',
    position: { x: 320, y: 200 },
    data: { label: 'Arrays', icon: <List size={18} /> },
  },
  // Colonne 4
  {
    id: 'functions',
    type: 'skill',
    position: { x: 480, y: 60 },
    data: { label: 'Functions', icon: <FunctionSquare size={18} /> },
  },
  {
    id: 'recursion',
    type: 'skill',
    position: { x: 480, y: 140 },
    data: { label: 'Recursion', icon: <Shuffle size={18} /> },
  },
  // Colonne 5
  {
    id: 'algorithms',
    type: 'skill',
    position: { x: 640, y: 60 },
    data: { label: 'Algorithms', icon: <Code2 size={18} /> },
  },
  {
    id: 'sorting',
    type: 'skill',
    position: { x: 640, y: 140 },
    data: { label: 'Sorting', icon: <Shuffle size={18} /> },
  },
  // Colonne 6 (fin)
  {
    id: 'data-structures',
    type: 'skill',
    position: { x: 800, y: 100 },
    data: { label: 'Data Structures', icon: <List size={18} /> },
  },
]

const edges = [
  // Départ
  {
    id: 'e1',
    source: 'variables',
    target: 'operators',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  { id: 'e2', source: 'variables', target: 'lists', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e3', source: 'types', target: 'objects', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  // Opérateurs vers loops/branching
  { id: 'e4', source: 'operators', target: 'loops', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  {
    id: 'e5',
    source: 'operators',
    target: 'branching',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  // Lists/Objects vers arrays
  { id: 'e6', source: 'lists', target: 'arrays', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  { id: 'e7', source: 'objects', target: 'arrays', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  // Loops/Branching/Arrays vers functions
  { id: 'e8', source: 'loops', target: 'functions', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  {
    id: 'e9',
    source: 'branching',
    target: 'functions',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  {
    id: 'e10',
    source: 'arrays',
    target: 'functions',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  // Functions vers recursion
  {
    id: 'e11',
    source: 'functions',
    target: 'recursion',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  // Recursion vers algorithms/sorting
  {
    id: 'e12',
    source: 'recursion',
    target: 'algorithms',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  {
    id: 'e13',
    source: 'recursion',
    target: 'sorting',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  // Algorithms/Sorting vers data-structures
  {
    id: 'e14',
    source: 'algorithms',
    target: 'data-structures',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
  {
    id: 'e15',
    source: 'sorting',
    target: 'data-structures',
    style: { stroke: '#38bdf8', strokeWidth: 2 },
  },
]

const proOptions = { hideAttribution: true }

export function SkillTreeGraph() {
  return (
    <div className="relative w-full h-[220px]">
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
