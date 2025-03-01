import { HelpCircle, MessageSquare } from 'lucide-react'
import * as React from 'react'

import { CreateAccountCTA } from '@/components/cards/create-account-cta'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  convertPayloadTutorialToTutorial,
  getSlugFromTitle
} from '@/core/articles'
import { Article as PayloadArticle } from '@/payload-types'
import { Tutorial } from '@/types/tutorial'
import config from '@payload-config'
import { getPayload } from 'payload'
import { SearchForm } from '../[article_slug]/components/search-form'
import { ArticlesSwitcher } from './articles-switcher'

type Outline = {
  title: string
  items: {
    title: string
    url: string
  }[]
}

interface ArticleSidebarProps {
  tutorial: Tutorial
  currentArticleSlug: string
  articles: PayloadArticle[]
  articleType: 'tutorial' | 'examples' | 'references'
}

// Function to create tutorial outline from tutorial sections and articles
const createTutorialOutline = (
  tutorial: ReturnType<typeof convertPayloadTutorialToTutorial>,
  articles: PayloadArticle[],
  articleType: 'tutorial' | 'examples' | 'references',
) => {
  const sections =
    articleType === 'tutorial'
      ? tutorial.sections
      : articleType === 'examples'
        ? tutorial.exampleSections
        : tutorial.referenceSections

  if (!sections) return []

  return sections.map((section) => ({
    title: section.title,
    items: articles
      .filter((article) => section.articles.includes(String(article.id)))
      .map((article) => ({
        title: article.title,
        url: article.slug,
      })),
  }))
}

export const ArticleSidebar = async ({
  tutorial,
  currentArticleSlug,
  articles,
  articleType,
}: ArticleSidebarProps) => {
  const tutorialOutline = createTutorialOutline(tutorial, articles, articleType)
  const activeGroupIndex = tutorialOutline.findIndex((group) =>
    group.items.some((item) => item.url === currentArticleSlug),
  )

  // Get support status
  let supportStatus = { status: 'online' as 'online' | 'maintenance' | 'offline' }
  try {
    const payload = await getPayload({ config })
    const supportSettings = await payload.find({
      collection: 'support-settings',
      limit: 1,
    })

    if (supportSettings.totalDocs > 0) {
      supportStatus = {
        status: supportSettings.docs[0].status as 'online' | 'maintenance' | 'offline',
      }
    }
  } catch (error) {
    console.error('Error fetching support status:', error)
  }

  // Determine the status indicator color
  const getStatusColor = () => {
    switch (supportStatus.status) {
      case 'online':
        return 'bg-emerald-500'
      case 'maintenance':
        return 'bg-amber-500'
      case 'offline':
        return 'bg-red-500'
      default:
        return 'bg-emerald-500'
    }
  }

  return (
      <Sidebar style={{ '--sidebar-width': '270px' } as React.CSSProperties} className="z-50">
        <SidebarHeader>
          <ArticlesSwitcher
            tutorialSlug={tutorial.slug}
            currentArticleType={articleType}
            tutorialTitle={tutorial.title}
          />
          <SearchForm />
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <Accordion
            type="single"
            defaultValue={activeGroupIndex !== -1 ? `item-${activeGroupIndex}` : undefined}
            collapsible
          >
            {tutorialOutline.map((section, index) => (
              <AccordionItem key={section.title} value={`item-${index}`} className="border-0">
                <SidebarGroup>
                  <SidebarGroupLabel
                    asChild
                    className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      {section.title}
                    </AccordionTrigger>
                  </SidebarGroupLabel>
                  <AccordionContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="pt-2">
                        {section.items.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.url === currentArticleSlug}>
                              <a
                                href={`/articles/${tutorial.slug}/${articleType !== 'tutorial' ? `${articleType}/` : ''}${item.url}`}
                              >
                                {item.title}
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </AccordionContent>
                </SidebarGroup>
              </AccordionItem>
            ))}
          </Accordion>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#feedback" className="flex justify-between w-full">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="size-4" />
                    Feedback
                  </span>
                  <svg
                    className="text-muted-foreground"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#support" className="flex justify-between w-full">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="size-4" />
                    Support
                  </span>
                  <Badge variant="outline" className="gap-1.5 rounded-sm">
                    <span
                      className={`size-1.5 rounded-full ${getStatusColor()}`}
                      aria-hidden="true"
                    ></span>
                    {supportStatus.status === 'online'
                      ? 'Online'
                      : supportStatus.status === 'maintenance'
                        ? 'Maintenance'
                        : 'Offline'}
                  </Badge>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <CreateAccountCTA />
        </SidebarFooter>
      </Sidebar>
  )
}
