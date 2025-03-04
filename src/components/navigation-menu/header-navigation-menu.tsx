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

// Tutorial categories that can be expanded in the future
const tutorialCategories = [
  {
    title: 'Python',
    href: '/articles/python',
    description: 'Learn Python programming from basics to advanced concepts.',
    icon: <Terminal className="h-5 w-5" />,
    isNew: true,
  },
  {
    title: 'JavaScript',
    href: '/articles/javascript',
    description: 'Master JavaScript for web development and beyond.',
    icon: <Braces className="h-5 w-5" />,
  },
  {
    title: 'TypeScript',
    href: '/articles/typescript',
    description: 'Enhance your JavaScript with static typing and advanced features.',
    icon: <FileCode className="h-5 w-5" />,
  },
  {
    title: 'React',
    href: '/articles/react',
    description: 'Build modern user interfaces with the React library.',
    icon: <Atom className="h-5 w-5" />,
    isNew: true,
  },
]

// Course categories
const courseCategories = [
  {
    title: 'Web Development',
    href: '/courses/web-development',
    description: 'Full-stack web development courses for beginners and professionals.',
    icon: <Globe className="h-5 w-5" />,
  },
  {
    title: 'Data Science',
    href: '/courses/data-science',
    description: 'Learn data analysis, visualization, and machine learning.',
    icon: <Database className="h-5 w-5" />,
    isNew: true,
  },
  {
    title: 'Mobile Development',
    href: '/courses/mobile-development',
    description: 'Create mobile applications for iOS and Android platforms.',
    icon: <Smartphone className="h-5 w-5" />,
  },
]

export function MainNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tutorials</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <div className="flex flex-col bg-muted/20 overflow-hidden">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background">
                {tutorialCategories.map((category) => (
                  <ListItem
                    key={category.title}
                    title={category.title}
                    href={category.href}
                    icon={category.icon}
                    isNew={category.isNew}
                  >
                    {category.description}
                  </ListItem>
                ))}
              </ul>
              <div className="flex items-center justify-end border-t p-3">
                <Button variant="default" size="sm" asChild>
                  <Link href="/articles" className="text-sm font-medium">
                    View all tutorials
                  </Link>
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <div className="flex flex-col bg-muted/20 overflow-hidden">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background">
                {courseCategories.map((course) => (
                  <ListItem
                    key={course.title}
                    title={course.title}
                    href={course.href}
                    icon={course.icon}
                    isNew={course.isNew}
                  >
                    {course.description}
                  </ListItem>
                ))}
              </ul>
              <div className="flex items-center justify-end border-t p-3">
                <Button variant="default" size="sm" asChild>
                  <Link href="/courses" className="text-sm font-medium">
                    View all courses
                  </Link>
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Blog</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    icon?: React.ReactNode
    isNew?: boolean
  }
>(({ className, title, children, icon, isNew, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'flex flex-row items-center gap-3 rounded-lg p-3 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground no-underline outline-none transition-colors',
            className,
          )}
          {...props}
        >
          <div className="flex-shrink-0 rounded-full bg-primary/10 p-2 flex items-center justify-center w-10 h-10">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-sm font-medium leading-none">{title}</div>
              {isNew && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                  New
                </span>
              )}
            </div>
            <p className="line-clamp-1 text-sm leading-snug text-muted-foreground">{children}</p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
