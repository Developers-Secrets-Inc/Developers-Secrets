'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { ResourcesNavigationMenuItem } from '@/components/resources-navigation-menu'
import {
  Book,
  LucideIcon,
  Code,
  Palette,
  FileCode,
  FileType,
  Boxes,
  Component,
  ArrowRight,
} from 'lucide-react'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
]

interface ResourceItemProps {
  icon: LucideIcon
  title: string
  description: string
}

const ResourceItem: React.FC<ResourceItemProps> = ({ icon: Icon, title, description }) => (
  <div className="rounded-lg p-3 flex flex-row gap-3 hover:bg-[#FAFAFA] cursor-pointer">
    <Icon className="w-[20px] h-[20px] flex-shrink-0 text-[#7F56D9]" />
    <div className="flex flex-col gap-3 overflow-hidden">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-base leading-6 text-[#181D27] truncate">{title}</p>
        </div>
        <p className="font-normal text-[14px] leading-5 text-[#535862] line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  </div>
)

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

const TutorialsNavigation = () => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Tutorials</NavigationMenuTrigger>
      <NavigationMenuContent className="bg-[#FAFAFA] p-0 border border-[#E9EAEB] shadow-[0_2px_2px_-1px_#0A0D120A,0_4px_6px_-2px_#0A0D1208,0_12px_16px_-4px_#0A0D1214]">
        <div className="w-[640px]">
          <div
            id="content"
            className="rounded-b-[12px] bg-white p-2 gap-0.5 border-b border-[#E9EAEB] grid grid-cols-2"
          >
            <ResourceItem
              icon={Code}
              title="HTML"
              description="Learn the fundamentals of HTML for structuring web content"
            />
            <ResourceItem
              icon={Palette}
              title="CSS"
              description="Master styling and layout techniques with CSS"
            />
            <ResourceItem
              icon={FileCode}
              title="JavaScript"
              description="Explore the basics of JavaScript for interactive web development"
            />
            <ResourceItem
              icon={FileCode}
              title="JavaScript"
              description="Explore the basics of JavaScript for interactive web development"
            />
            <ResourceItem
              icon={Boxes}
              title="Python"
              description="Explore the basics of JavaScript for interactive web development"
            />
            <ResourceItem
              icon={Component}
              title="React"
              description="Explore the basics of JavaScript for interactive web development"
            />
          </div>
          <div id="footer" className="p-5 flex flex-row justify-center">
            <Link
              href="/tutorials"
              className="flex flex-row gap-2 items-center font-semibold text-base leading-6 text-[#6941C6]"
            >
              All tutorials
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

const CoursesNavigation = () => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
      <NavigationMenuContent className="bg-[#FAFAFA] p-0 border border-[#E9EAEB] shadow-[0_2px_2px_-1px_#0A0D120A,0_4px_6px_-2px_#0A0D1208,0_12px_16px_-4px_#0A0D1214]">
        <div className="w-[640px]">
          <div
            id="content"
            className="rounded-b-[12px] bg-white p-2 gap-0.5 border-b border-[#E9EAEB] grid grid-cols-2"
          >
            <ResourceItem
              icon={Code}
              title="HTML Fundamentals Course"
              description="Complete HTML course from basics to advanced techniques with projects"
            />
            <ResourceItem
              icon={Palette}
              title="CSS Mastery Course"
              description="Comprehensive CSS course covering layouts, animations, and responsive design"
            />
            <ResourceItem
              icon={FileCode}
              title="JavaScript Essentials"
              description="Master JavaScript fundamentals, DOM manipulation, and modern ES6+ features"
            />
            <ResourceItem
              icon={FileType}
              title="TypeScript for Developers"
              description="Learn TypeScript to build robust, type-safe applications with confidence"
            />
            <ResourceItem
              icon={Boxes}
              title="Python Programming"
              description="Complete Python course covering data structures, algorithms and web development"
            />
            <ResourceItem
              icon={Component}
              title="React Development"
              description="Build professional React applications with hooks, context API and Redux"
            />
          </div>
          <div id="footer" className="p-5 flex flex-row justify-center">
            <Link
              href="/courses"
              className="flex flex-row gap-2 items-center font-semibold text-base leading-6 text-[#6941C6]"
            >
              All courses
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export function TutorialNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <TutorialsNavigation />
        <CoursesNavigation />
        <ResourcesNavigationMenuItem />
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Blog</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
