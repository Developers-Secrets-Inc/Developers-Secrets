import { Eclipse, Twitter, Github, Linkedin, Youtube } from 'lucide-react'

const sections = [
  {
    title: 'Product',
    links: [
      { name: 'Challenges', href: '#' },
      { name: 'Learning Paths', href: '#' },
      { name: 'Skill Tree', href: '#' },
      { name: 'AI Challenges', href: '#' },
      { name: 'Gamification', href: '#' },
      { name: 'Projects', href: '#' },
      { name: 'AI Assistant', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Community', href: '#' },
      { name: 'Docs', href: '#' },
      { name: 'Guide', href: '#' },
      { name: 'Help', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Students', href: '#' },
      { name: 'Enterprises', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Changelog', href: '#' },
      { name: 'Events', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Legal', href: '#' },
    ],
  },
  {
    title: 'Social',
    links: [
      { name: 'Twitter', href: '#', icon: <Twitter className="w-4 h-4 mr-2" /> },
      { name: 'GitHub', href: '#', icon: <Github className="w-4 h-4 mr-2" /> },
      { name: 'LinkedIn', href: '#', icon: <Linkedin className="w-4 h-4 mr-2" /> },
      { name: 'YouTube', href: '#', icon: <Youtube className="w-4 h-4 mr-2" /> },
    ],
  },
]

interface Footer7Props {
  logo?: {
    url: string
    src: string
    alt: string
    title: string
  }
}
const Footer7 = ({
  logo = {
    url: '/',
    src: '/your-logo.svg',
    alt: 'Your Company',
    title: 'Your Company',
  },
}: Footer7Props) => {
  return (
    <section className="py-32 w-full flex">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex w-full flex-col items-center justify-between gap-10 text-center lg:flex-row lg:items-start lg:text-left">
          <div className="grid flex-1 w-full grid-cols-5 gap-6 lg:gap-20">
            {/* Colonnes de liens */}
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-6 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="font-medium hover:text-primary flex items-center">
                      <a href={link.href} className="flex items-center">
                        {'icon' in link && link.icon}
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* 5ème colonne pour l'icône Eclipse, alignée en haut à droite */}
            <div className="flex flex-col items-end justify-start">
              <Eclipse className="h-8 w-8" />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left w-full">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <ul className="flex justify-center gap-4 lg:justify-start">
            <li className="hover:text-primary">
              <a href="#"> Terms and Conditions</a>
            </li>
            <li className="hover:text-primary">
              <a href="#"> Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export { Footer7 }
