'use client'

import React, { memo } from 'react'
import ReactFlow, { Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'
import { EyeOff } from 'lucide-react'
import { ReactLogoIcon } from '@/components/icons/react-logo-icon'
import { TypescriptLogoIcon } from '@/components/icons/typescript-logo-icon'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { DjangoLogoIcon } from '@/components/icons/django-logo-icon'
import { CssLogoIcon } from '@/components/icons/css-logo-icon'
import { HtmlLogoIcon } from '@/components/icons/html-logo-icon'
import { JsLogoIcon } from '@/components/icons/js-logo-icon'
import { GraphQLLogoIcon } from '@/components/icons/graphql-logo-icon'
import { VueLogoIcon } from '@/components/icons/vue-logo-icon'
import { NextjsLogoIcon } from '@/components/icons/nextjs-logo-icon'
import { FastApiLogoIcon } from '@/components/icons/fastapi-logo-icon'
import { PostgreSqlLogoIcon } from '@/components/icons/postgresql-logo-icon'

// Custom node component
type CustomNodeProps = { data: { label: string; icon: React.ReactNode; uncertain?: boolean } }
const CustomNode = memo(({ data }: CustomNodeProps) => {
  return (
    <div
      className={
        'px-4 py-3 shadow-md rounded-md border flex flex-col items-center min-w-[90px] max-w-[140px] ' +
        (data.uncertain
          ? 'bg-muted/60 border-dashed border-orange-300 opacity-60 blur-[1.5px]'
          : 'bg-background border-primary/20')
      }
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-orange-300 w-3 h-2 rounded-sm"
        style={{ top: -8 }}
      />
      <div className="flex items-center justify-center w-10 h-10 rounded-full mb-1 bg-background border border-border">
        {data.icon}
      </div>
      <div className="text-sm font-semibold text-center truncate w-full">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-orange-300 w-3 h-2 rounded-sm"
        style={{ bottom: -8 }}
      />
    </div>
  )
})
const nodeTypes = { custom: CustomNode }

const nodes = [
  {
    id: 'react',
    type: 'custom',
    position: { x: 0, y: 100 },
    data: { label: 'React', icon: <ReactLogoIcon size={24} /> },
  },
  {
    id: 'ts',
    type: 'custom',
    position: { x: 150, y: 0 },
    data: {
      label: 'TypeScript',
      icon: <TypescriptLogoIcon width={24} height={24} />,
      uncertain: true,
    },
  },
  {
    id: 'js',
    type: 'custom',
    position: { x: 300, y: 60 },
    data: { label: 'JavaScript', icon: <JsLogoIcon width={24} height={24} /> },
  },
  {
    id: 'css',
    type: 'custom',
    position: { x: 100, y: 200 },
    data: { label: 'CSS', icon: <CssLogoIcon width={24} height={24} /> },
  },
  {
    id: 'html',
    type: 'custom',
    position: { x: 250, y: 200 },
    data: { label: 'HTML', icon: <HtmlLogoIcon width={24} height={24} /> },
  },
  {
    id: 'vue',
    type: 'custom',
    position: { x: 400, y: 100 },
    data: { label: 'Vue', icon: <VueLogoIcon width={24} height={24} />, uncertain: true },
  },
  {
    id: 'next',
    type: 'custom',
    position: { x: 200, y: 120 },
    data: { label: 'Next.js', icon: <NextjsLogoIcon width={24} height={24} />, uncertain: true },
  },
  {
    id: 'python',
    type: 'custom',
    position: { x: -120, y: 60 },
    data: { label: 'Python', icon: <PythonLogoIcon size={24} /> },
  },
  {
    id: 'django',
    type: 'custom',
    position: { x: -200, y: 160 },
    data: { label: 'Django', icon: <DjangoLogoIcon width={24} height={24} />, uncertain: true },
  },
  {
    id: 'fastapi',
    type: 'custom',
    position: { x: -60, y: 220 },
    data: { label: 'FastAPI', icon: <FastApiLogoIcon width={24} height={24} />, uncertain: true },
  },
  {
    id: 'graphql',
    type: 'custom',
    position: { x: 350, y: 180 },
    data: { label: 'GraphQL', icon: <GraphQLLogoIcon width={24} height={24} />, uncertain: true },
  },
  {
    id: 'postgres',
    type: 'custom',
    position: { x: -100, y: 300 },
    data: {
      label: 'PostgreSQL',
      icon: <PostgreSqlLogoIcon width={24} height={24} />,
      uncertain: true,
    },
  },
]

const edges = [
  {
    id: 'e1',
    source: 'react',
    target: 'ts',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  {
    id: 'e2',
    source: 'ts',
    target: 'js',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  { id: 'e3', source: 'react', target: 'css', style: { stroke: '#38bdf8', strokeWidth: 2 } },
  {
    id: 'e4',
    source: 'css',
    target: 'html',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  {
    id: 'e5',
    source: 'js',
    target: 'vue',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  {
    id: 'e6',
    source: 'js',
    target: 'next',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  {
    id: 'e7',
    source: 'python',
    target: 'django',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  {
    id: 'e8',
    source: 'python',
    target: 'fastapi',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  {
    id: 'e9',
    source: 'django',
    target: 'postgres',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  {
    id: 'e10',
    source: 'fastapi',
    target: 'postgres',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  {
    id: 'e11',
    source: 'next',
    target: 'graphql',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
  {
    id: 'e12',
    source: 'vue',
    target: 'graphql',
    style: { stroke: '#bbb', strokeDasharray: '4', opacity: 0.5 },
  },
]

const proOptions = { hideAttribution: true }

export function NoSkillGraph() {
  return (
    <div className="relative w-full h-[400px]">
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
        className="w-full h-full"
        proOptions={proOptions}
      />
    </div>
  )
}
