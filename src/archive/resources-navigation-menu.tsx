import * as React from 'react'
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  Book,
  Star,
  Video,
  LucideIcon,
  BookOpen,
  MessageSquare,
  FileText,
  Code2,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

// Sous-composant pour les liens de navigation
interface NavigationLinkProps {
  href: string
  children: React.ReactNode
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="text-base font-semibold leading-6 text-[#535862] justify-start w-full text-left"
  >
    {children}
  </Link>
)

// Sous-composant pour les éléments de ressource
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

// Sous-composant pour les sections de ressources
interface ResourceSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

const ResourceSection: React.FC<ResourceSectionProps> = ({ title, children, className = '' }) => (
  <div className={`flex-1 flex flex-col gap-2 ${className}`}>
    <p className="font-semibold text-[14px] leading-5 text-[#7F56D9]">{title}</p>
    <div className="flex flex-col gap-0.5">{children}</div>
  </div>
)

// Sous-composant pour la section de liens
interface LinksSectionProps {
  title: string
  links: Array<{ title: string; href: string }>
}

const LinksSection: React.FC<LinksSectionProps> = ({ title, links }) => (
  <ResourceSection title={title} className="gap-5">
    <div className="flex flex-col gap-3 items-start">
      {links.map((link) => (
        <NavigationLink key={link.href} href={link.href}>
          {link.title}
        </NavigationLink>
      ))}
    </div>
  </ResourceSection>
)

const resourceLinks = [
  { title: 'Setup 101', href: '/setup-101' },
  { title: 'Adding users', href: '/adding-users' },
  { title: 'Video tutorials', href: '/video-tutorials' },
  { title: 'Libraries and SDKs', href: '/libraries-sdks' },
  { title: 'Adding plugin', href: '/adding-plugin' },
  { title: 'Dashboard Templates', href: '/dashboard-templates' },
]

// Données pour les sections de ressources
const resourceItems = [
  { icon: Book, title: 'Blog', description: 'Get the latest news and updates from our blog' },
  {
    icon: Star,
    title: 'Customer stories',
    description: 'Learn how others are using our platform successfully',
  },
  {
    icon: Code2,
    title: 'Libraries and SDKs',
    description: 'Access development tools and resources for integration',
  },
]

const supportItems = [
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Comprehensive guides and API references',
  },
  {
    icon: MessageSquare,
    title: 'Community forum',
    description: 'Connect with other users and share knowledge',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step visual guides for all skill levels',
  },
]

export function ResourcesNavigationMenuItem() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
      <NavigationMenuContent className="bg-[#FAFAFA] p-0 border border-[#E9EAEB] rounded-2xl shadow-[0_2px_2px_-1px_#0A0D120A,0_4px_6px_-2px_#0A0D1208,0_12px_16px_-4px_#0A0D1214]">
        <div
          id="content"
          className="w-[800px] rounded-[12px] bg-[#FFFFFF] p-6 pt-5 flex flex-col gap-5 border-b border-[#E9EAEB]"
        >
          <div id="text-and-supporting" className="flex flex-col gap-1">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-base leading-6 text-[#181D27]">Resources</p>
            </div>
            <p className="font-normal text-[14px] leading-5 text-[#535862]">
              Get started and learn more about our products
            </p>
          </div>
          <div id="main-content" className="flex flex-row gap-6">
            {/* Section Get Started */}
            <LinksSection title="Get Started" links={resourceLinks} />

            {/* Section Resources */}
            <ResourceSection title="Resources">
              {resourceItems.map((item, index) => (
                <ResourceItem
                  key={`resource-${index}`}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </ResourceSection>

            {/* Section Support */}
            <ResourceSection title="Support">
              {supportItems.map((item, index) => (
                <ResourceItem
                  key={`support-${index}`}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </ResourceSection>
          </div>
        </div>
        <div id="footer" className="py-5 px-6 flex flex-row justify-between">
          <Button variant={'secondary_gray'}>
            <BookOpen className="size-4" />
            Documentation
          </Button>
          <Button>View all resources</Button>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
