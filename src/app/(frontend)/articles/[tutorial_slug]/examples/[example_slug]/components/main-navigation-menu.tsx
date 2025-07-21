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

// Tutorial categories that can be expanded in the future
const tutorialCategories = [
  {
    title: 'Python',
    href: '/tutorials/python',
    description: 'Learn Python programming from basics to advanced concepts.',
  },
  {
    title: 'JavaScript',
    href: '/tutorials/javascript',
    description: 'Master JavaScript for web development and beyond.',
  },
  {
    title: 'TypeScript',
    href: '/tutorials/typescript',
    description: 'Enhance your JavaScript with static typing and advanced features.',
  },
  {
    title: 'React',
    href: '/tutorials/react',
    description: 'Build modern user interfaces with the React library.',
  },
]

// Course categories
const courseCategories = [
  {
    title: 'Web Development',
    href: '/courses/web-development',
    description: 'Full-stack web development courses for beginners and professionals.',
  },
  {
    title: 'Data Science',
    href: '/courses/data-science',
    description: 'Learn data analysis, visualization, and machine learning.',
  },
  {
    title: 'Mobile Development',
    href: '/courses/mobile-development',
    description: 'Create mobile applications for iOS and Android platforms.',
  },
]

export function MainNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tutorials</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {tutorialCategories.map((category) => (
                <ListItem key={category.title} title={category.title} href={category.href}>
                  {category.description}
                </ListItem>
              ))}
              <ListItem
                title="All Tutorials"
                href="/tutorials"
                className="col-span-full bg-muted/50"
              >
                Browse all available tutorials on our platform
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {courseCategories.map((course) => (
                <ListItem key={course.title} title={course.title} href={course.href}>
                  {course.description}
                </ListItem>
              ))}
              <ListItem title="All Courses" href="/courses" className="col-span-full bg-muted/50">
                Explore our complete catalog of in-depth courses
              </ListItem>
            </ul>
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

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = 'ListItem'
