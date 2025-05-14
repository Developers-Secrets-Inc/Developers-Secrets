import React from 'react'

interface ProblemCardProps {
  title: string
  description: string
  // icon?: React.ReactNode; // Optional: if you want to add icons later
}

const ProblemCard: React.FC<ProblemCardProps> = ({ title, description }) => {
  return (
    <div className="bg-card border border-muted p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
      {/* Optional: Icon can be placed here */}
      <h3 className="text-xl font-semibold text-primary mb-3 mt-2">{title}</h3>
      <p className="text-card-foreground text-sm">{description}</p>
    </div>
  )
}

export const ProblemSection = () => {
  const problems: ProblemCardProps[] = [
    {
      title: 'Outdated Resources',
      description:
        "Struggling with irrelevant or overly theoretical learning materials that don't reflect current industry practices.",
    },
    {
      title: 'Lack of Hands-On Practice',
      description:
        'Finding it hard to bridge the gap between theory and application without engaging, real-world coding exercises.',
    },
    {
      title: 'Learning in Isolation',
      description:
        'Missing the motivation, support, and valuable feedback that comes from being part of an active developer community.',
    },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <ProblemCard key={index} title={problem.title} description={problem.description} />
          ))}
        </div>
      </div>
    </section>
  )
}
