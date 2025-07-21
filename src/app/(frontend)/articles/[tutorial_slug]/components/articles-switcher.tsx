import {
  BookOpen,
  ChevronsUpDown,
  Code2,
  FileText,
  GalleryVerticalEnd,
  Lock,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import {
  getFirstTutorialArticle,
  getFirstExampleArticle,
  getFirstReferenceArticle,
} from '@/api/articles'
import { isFailure } from '@/lib/result'

interface ArticlesSwitcherProps {
  tutorialSlug: string
  tutorialTitle: string
}

export const ArticlesSwitcher = async ({
  tutorialSlug,
  tutorialTitle,
}: ArticlesSwitcherProps) => {
  // Fetch first articles for each section
  const [firstTutorialArticle, firstExampleArticle, firstReferenceArticle] = await Promise.all([
    getFirstTutorialArticle(tutorialSlug),
    getFirstExampleArticle(tutorialSlug),
    getFirstReferenceArticle(tutorialSlug),
  ])

  // if (isFailure(firstTutorialArticle)) {
  //   throw firstTutorialArticle.error
  // }

  // if (isFailure(firstExampleArticle)) {
  //   throw firstExampleArticle.error
  // }

  // if (isFailure(firstReferenceArticle)) {
  //   throw firstReferenceArticle.error
  // }

  // Define the menu items with their properties
  const menuItems = [
    firstTutorialArticle && {
      type: 'tutorial',
      icon: BookOpen,
      title: 'Tutorial',
      description: 'Learn step by step',
      href: `/articles/${tutorialSlug}/${firstTutorialArticle.slug}`,
    },
    firstExampleArticle && {
      type: 'examples',
      icon: Code2,
      title: 'Examples',
      description: 'View example projects',
      href: `/articles/${tutorialSlug}/examples/${firstExampleArticle.slug}`,
    },
    firstReferenceArticle && {
      type: 'references',
      icon: FileText,
      title: 'References',
      description: 'API documentation',
      href: `/articles/${tutorialSlug}/references/${firstReferenceArticle.slug}`,
    },
    {
      type: 'compiler',
      icon: Wrench,
      lockIcon: Lock,
      title: 'Compiler',
      description: 'Configuration options',
      href: '#',
      disabled: true,
    },
  ].filter(Boolean)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-4 p-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-foreground">{tutorialTitle}</span>
                </div>
                <div className="ml-auto text-muted-foreground">
                  <ChevronsUpDown className="size-4" />
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border border-border p-2 space-y-0.5 shadow-md"
            align="start"
            side="bottom"
            sideOffset={4}
            avoidCollisions={false}
            style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
          >
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.type}
                className={`flex items-start gap-3 rounded-lg bg-background hover:bg-muted px-3 py-2 ${item.disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={item.disabled}
                asChild={!item.disabled}
              >
                {item.disabled ? (
                  <div className="flex items-start gap-3 w-full">
                    <div className="relative mt-1">
                      <item.icon className="size-4" />
                      <item.lockIcon className="size-2.5 absolute -right-1 -bottom-1 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="leading-6 font-semibold text-foreground">{item.title}</span>
                      <span className="leading-5 text-muted-foreground">{item.description}</span>
                    </div>
                  </div>
                ) : (
                  <Link href={item.href} className="flex items-start gap-3 w-full">
                    <item.icon className="size-4 mt-1" />
                    <div className="flex flex-col">
                      <span className="leading-6 font-semibold text-foreground">{item.title}</span>
                      <span className="leading-5 text-muted-foreground">{item.description}</span>
                    </div>
                  </Link>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
