import React from 'react'
import { BookX, Code2, Users } from 'lucide-react'

interface ProblemCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

const ProblemCard: React.FC<ProblemCardProps> = ({ title, description, icon }) => {
  return (
    <article className="bg-card border border-muted p-6 rounded-lg shadow-lg flex flex-col items-start text-left">
      <div className="bg-primary/10 p-3 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
      <p className="text-card-foreground text-sm">{description}</p>
    </article>
  )
}

export const ProblemSection = () => {
  const problems: Omit<ProblemCardProps, 'icon'>[] = [
    {
      title: 'Outdated Learning Materials',
      description:
        "Tired of sifting through obsolete tutorials and theoretical content that doesn't match today's tech landscape? Stay ahead with up-to-date, industry-relevant resources.",
    },
    {
      title: 'Limited Practical Experience',
      description:
        'Theoretical knowledge alone won\'t make you job-ready. Build real-world applications and solve actual coding challenges to gain the hands-on experience employers value.',
    },
    {
      title: 'Go Beyond Solo Learning',
      description:
        'Break free from isolation. Connect with a community of like-minded developers, exchange knowledge, and get the support you need to accelerate your growth.',
    },
  ]

  const icons = [
    <BookX key="book-x" className="w-6 h-6 text-primary" />,
    <Code2 key="code-2" className="w-6 h-6 text-primary" />,
    <Users key="users" className="w-6 h-6 text-primary" />
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Feeling Stuck in Your Learning Journey?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Many aspiring developers face common roadblocks. We understand them, and we're here to
            help you overcome them.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {problems.map((problem, index) => (
            <ProblemCard
              key={`problem-${problem.title.toLowerCase().replace(/\s+/g, '-')}`}
              title={problem.title}
              description={problem.description}
              icon={icons[index]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
