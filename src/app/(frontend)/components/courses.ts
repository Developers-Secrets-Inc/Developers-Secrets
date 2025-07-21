import { JsLogoIcon } from '@/components/icons/js-logo-icon'
import { TypescriptLogoIcon } from '@/components/icons/typescript-logo-icon'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { GoLogoIcon } from '@/components/icons/go-logo-icon'
import { NextjsLogoIcon } from '@/components/icons/nextjs-logo-icon'
import { FastApiLogoIcon } from '@/components/icons/fastapi-logo-icon'

export interface Course {
  title: string
  description: string
  difficulty: string
  link: string
  isLocked: boolean
}

export const TABS = [
  { key: 'python', label: 'Python', aria: 'Python' },
  { key: 'frontend', label: 'Frontend', aria: 'Frontend' },
  { key: 'backend', label: 'Backend', aria: 'Backend' },
  { key: 'javascript', label: 'JavaScript', aria: 'JavaScript' },
  { key: 'typescript', label: 'TypeScript', aria: 'TypeScript' },
  { key: 'go', label: 'Go', aria: 'Go' },
  { key: 'nextjs', label: 'Next.js', aria: 'Next.js' },
  { key: 'fastapi', label: 'FastAPI', aria: 'FastAPI' },
] as const

export type TabKey = (typeof TABS)[number]['key']

export const COURSES: Record<TabKey, Course[]> = {
  python: [
    {
      title: 'Python Fundamentals',
      description: 'Variables, data types, and control flow in Python.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Python for Web',
      description: 'Build web apps with Flask and Django.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Data Science with Python',
      description: 'Analyze and visualize data using Python.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Python Scripting',
      description: 'Automate tasks and process files with Python.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Testing in Python',
      description: 'Write and run tests for your Python code.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
  ],
  frontend: [
    {
      title: 'React from Scratch',
      description: 'Build modern UIs with React and hooks.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Vue.js Essentials',
      description: 'Learn the fundamentals of Vue.js and build dynamic UIs.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Next.js Masterclass',
      description: 'Server-side rendering, static sites, and advanced routing with Next.js.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'CSS Mastery',
      description: 'Advanced layouts, animations, and responsive design.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Tailwind CSS in Practice',
      description: 'Rapidly build modern, responsive UIs with Tailwind.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'TypeScript for Frontend',
      description: 'Type-safe React and modern JS development.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
  ],
  backend: [
    {
      title: 'Python & Django Bootcamp',
      description: 'Create robust backends and APIs with Django.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Node.js Essentials',
      description: 'Build scalable APIs and services with Node.js.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Go Backend Fundamentals',
      description: 'Learn Go for scalable backend services.',
      difficulty: 'Advanced',
      link: '#',
      isLocked: true,
    },
    {
      title: 'FastAPI for Modern APIs',
      description: 'Build fast, async APIs with Python and FastAPI.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'PostgreSQL Deep Dive',
      description: 'Master relational databases and advanced SQL.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Databases 101',
      description: 'Learn SQL, NoSQL, and data modeling.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
  ],
  javascript: [
    {
      title: 'JavaScript Essentials',
      description: 'Learn the basics of JavaScript, the language of the web.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Modern JavaScript Patterns',
      description: 'ES6+, async/await, modules, and best practices.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'JavaScript Algorithms',
      description: 'Solve classic problems and master JS logic.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'DOM Manipulation',
      description: 'Interact with the browser and build dynamic UIs.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Testing JavaScript',
      description: 'Write reliable tests for your JS code.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
  ],
  typescript: [
    {
      title: 'TypeScript Basics',
      description: 'Get started with types and interfaces in TypeScript.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'TypeScript with React',
      description: 'Build type-safe React apps.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Advanced TypeScript',
      description: 'Generics, utility types, and advanced patterns.',
      difficulty: 'Advanced',
      link: '#',
      isLocked: true,
    },
    {
      title: 'TypeScript Tooling',
      description: 'Linting, formatting, and project setup.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'TypeScript for Node.js',
      description: 'Type your backend code with confidence.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
  ],
  go: [
    {
      title: 'Go Basics',
      description: 'Get started with Go syntax and tooling.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Go Concurrency',
      description: 'Master goroutines and channels.',
      difficulty: 'Advanced',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Building APIs with Go',
      description: 'Create RESTful APIs using Go.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Go for Web Development',
      description: 'Serve web pages and handle requests in Go.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Testing in Go',
      description: 'Write tests and benchmarks for Go code.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
  ],
  nextjs: [
    {
      title: 'Next.js Fundamentals',
      description: 'Pages, routing, and data fetching in Next.js.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Next.js API Routes',
      description: 'Build backend endpoints in your Next.js app.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Static & Dynamic Rendering',
      description: 'Master SSR, SSG, and ISR in Next.js.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Authentication in Next.js',
      description: 'Implement secure authentication flows.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Next.js Deployment',
      description: 'Deploy your Next.js app to Vercel and beyond.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
  ],
  fastapi: [
    {
      title: 'FastAPI Basics',
      description: 'Build your first API with FastAPI.',
      difficulty: 'Beginner',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Async Programming in FastAPI',
      description: 'Leverage async/await for high performance.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'FastAPI Security',
      description: 'Implement authentication and authorization.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'Testing FastAPI Apps',
      description: 'Write tests for your FastAPI endpoints.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
    {
      title: 'FastAPI & Databases',
      description: 'Connect FastAPI to SQL and NoSQL databases.',
      difficulty: 'Intermediate',
      link: '#',
      isLocked: true,
    },
  ],
}
