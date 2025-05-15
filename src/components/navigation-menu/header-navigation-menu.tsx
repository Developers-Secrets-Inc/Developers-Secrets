'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Code,
  FileCode,
  Braces,
  Atom,
  Globe,
  Database,
  Smartphone,
  Terminal,
  Brackets,
  Server,
} from 'lucide-react'

interface CategoryItem {
  title: string
  description: string
  icon: React.ReactNode
  href?: string
  isNew?: boolean
  isLocked?: boolean
}

// Tutorial categories that can be expanded in the future
const tutorialCategories: CategoryItem[] = [
  {
    title: 'Python',
    href: '/articles/python',
    description: 'Learn Python programming from basics to advanced concepts.',
    icon: <Terminal className="h-5 w-5" />,
    isNew: true,
  },
  {
    title: 'JavaScript',
    description: 'Master JavaScript for web development and beyond.',
    icon: <Braces className="h-5 w-5" />,
    isLocked: true,
  },
  {
    title: 'TypeScript',
    description: 'Enhance your JavaScript with static typing and advanced features.',
    icon: <FileCode className="h-5 w-5" />,
    isLocked: true,
  },
  {
    title: 'React',
    description: 'Build modern user interfaces with the React library.',
    icon: <Atom className="h-5 w-5" />,
    isLocked: true,
  },
]

// Course categories
const courseCategories: CategoryItem[] = [
  {
    title: 'Frontend Development',
    description: 'Learn modern frontend technologies and frameworks.',
    icon: <Globe className="h-5 w-5" />,
    isLocked: true,
  },
  {
    title: 'Backend Development',
    description: 'Master server-side programming and API development.',
    icon: <Server className="h-5 w-5" />,
    isLocked: true,
  },
  {
    title: 'Databases',
    description: 'Learn database design, management and optimization.',
    icon: <Database className="h-5 w-5" />,
    isLocked: true,
  },
  {
    title: 'Software Engineering',
    description: 'Best practices, design patterns, and software architecture.',
    icon: <Code className="h-5 w-5" />,
    isLocked: true,
  },
]

export function MainNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-muted-foreground">Tutorials</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <div className="flex flex-col bg-muted/20 overflow-hidden">
              <div className="bg-background p-4">
                <ul className="grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {tutorialCategories.map((category) => (
                    <ListItem
                      key={category.title}
                      title={category.title}
                      href={category.href}
                      icon={category.icon}
                      isNew={category.isNew}
                      isLocked={category.isLocked}
                    >
                      {category.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-end border-t p-3">
                <Button variant="default" size="sm" asChild disabled className="opacity-50">
                  <Link href="/articles" className="text-sm font-medium">
                    View all tutorials
                  </Link>
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-muted-foreground">Courses</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <div className="flex flex-col bg-muted/20 overflow-hidden">
              <div className="bg-background p-4">
                <ul className="grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {courseCategories.map((course) => (
                    <ListItem
                      key={course.title}
                      title={course.title}
                      href={course.href}
                      icon={course.icon}
                      isNew={course.isNew}
                      isLocked={course.isLocked}
                    >
                      {course.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-end border-t p-3">
                <Button variant="default" size="sm" asChild disabled className="opacity-50">
                  <Link href="/courses" className="text-sm font-medium">
                    View all courses
                  </Link>
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/pricing" className={`${navigationMenuTriggerStyle()} text-muted-foreground`}>
            Pricing
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blog" className={`${navigationMenuTriggerStyle()} text-muted-foreground`}>
            Blog
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & {
    icon?: React.ReactNode
    isNew?: boolean
    isLocked?: boolean
    href?: string
  }
>(({ className, title, children, icon, isNew, isLocked, href, ...props }, ref) => {
  const content = (
    <div
      ref={ref}
      className={cn(
        'group relative flex flex-row items-center gap-3 p-3 rounded-lg transition-colors',
        href && !isLocked
          ? 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
          : 'bg-muted/50',
        isLocked && 'cursor-not-allowed opacity-75',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex-shrink-0 rounded-full p-2 flex items-center justify-center w-10 h-10',
          href && !isLocked
            ? 'bg-primary/10 text-primary'
            : 'bg-muted-foreground/20 text-muted-foreground',
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="truncate text-sm font-medium leading-none flex-1 min-w-0">{title}</div>
          <div className="flex-shrink-0 flex items-center gap-2">
            {isNew && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
                New
              </span>
            )}
            {isLocked && (
              <span className="rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                Coming Soon
              </span>
            )}
          </div>
        </div>
        <p className="line-clamp-1 text-sm leading-snug text-muted-foreground">{children}</p>
      </div>
    </div>
  )

  if (href && !isLocked) {
    return (
      <li>
        <NavigationMenuLink className="block" asChild>
          <Link href={href}>{content}</Link>
        </NavigationMenuLink>
      </li>
    )
  }

  return <li>{content}</li>
})
ListItem.displayName = 'ListItem'
