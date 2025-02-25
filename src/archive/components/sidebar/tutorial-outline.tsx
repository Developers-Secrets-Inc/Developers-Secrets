import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const data = {
  navMain: [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        {
          title: 'Installation',
          url: '#',
        },
        {
          title: 'Project Structure',
          url: '#',
        },
      ],
    },
    {
      title: 'Building Your Application',
      url: '#',
      items: [
        {
          title: 'Routing',
          url: '#',
        },
        {
          title: 'Data Fetching',
          url: '#',
          isActive: true,
        },
        {
          title: 'Rendering',
          url: '#',
        },
        {
          title: 'Caching',
          url: '#',
        },
        {
          title: 'Styling',
          url: '#',
        },
        {
          title: 'Optimizing',
          url: '#',
        },
        {
          title: 'Configuring',
          url: '#',
        },
        {
          title: 'Testing',
          url: '#',
        },
        {
          title: 'Authentication',
          url: '#',
        },
        {
          title: 'Deploying',
          url: '#',
        },
        {
          title: 'Upgrading',
          url: '#',
        },
        {
          title: 'Examples',
          url: '#',
        },
      ],
    },
    {
      title: 'API Reference',
      url: '#',
      items: [
        {
          title: 'Components',
          url: '#',
        },
        {
          title: 'File Conventions',
          url: '#',
        },
        {
          title: 'Functions',
          url: '#',
        },
        {
          title: 'next.config.js Options',
          url: '#',
        },
        {
          title: 'CLI',
          url: '#',
        },
        {
          title: 'Edge Runtime',
          url: '#',
        },
      ],
    },
    {
      title: 'Architecture',
      url: '#',
      items: [
        {
          title: 'Accessibility',
          url: '#',
        },
        {
          title: 'Fast Refresh',
          url: '#',
        },
        {
          title: 'Next.js Compiler',
          url: '#',
        },
        {
          title: 'Supported Browsers',
          url: '#',
        },
        {
          title: 'Turbopack',
          url: '#',
        },
      ],
    },
    {
      title: 'Community',
      url: '#',
      items: [
        {
          title: 'Contribution Guide',
          url: '#',
        },
      ],
    },
    {
      title: 'Advanced Topics',
      url: '#',
      items: [
        {
          title: 'Performance Optimization',
          url: '#',
        },
        {
          title: 'Server-Side Rendering',
          url: '#',
        },
      ],
    },
    {
      title: 'Resources',
      url: '#',
      items: [
        {
          title: 'Documentation',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Community Forums',
          url: '#',
        },
      ],
    },
  ],
}

export const TutorialOutline = () => {
  return (
    <Accordion type="single" collapsible className="space-y-0.5 px-4">
      {data.navMain.map((item) => (
        <AccordionItem key={item.title} value={item.title} className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <a
              href={item.url}
              className="inline-flex items-center gap-2 pr-2 text-sm font-semibold [&_svg]:size-4 [&_svg]:shrink-0 rounded-md w-full text-[#414651] leading-[24px]"
            >
              {item.title}
            </a>
          </AccordionTrigger>
          {item.items?.length ? (
            <AccordionContent className="pb-0">
              <div className="flex flex-col gap-0.5">
                {item.items.map((subItem) => (
                  <a
                    key={subItem.title}
                    href={subItem.url}
                    className={`relative flex flex-row items-center gap-2 rounded-md font-medium px-2 py-2 text-start text-sm [overflow-wrap:anywhere] hover:bg-[#FAFAFA] ${
                      subItem.isActive ? 'bg-fd-primary/10 text-fd-primary' : 'text-[#414651]'
                    }`}
                  >
                    {subItem.title}
                  </a>
                ))}
              </div>
            </AccordionContent>
          ) : null}
        </AccordionItem>
      ))}
    </Accordion>
  )
}
