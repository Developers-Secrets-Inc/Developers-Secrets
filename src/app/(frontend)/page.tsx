import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Developers Secrets',
  description: 'Master fullstack development through interactive coding challenges',
  openGraph: {
    title: 'Developers Secrets',
    description: 'Master fullstack development through interactive coding challenges',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developers Secrets',
    description: 'Master fullstack development through interactive coding challenges',
  },
}

export default function Home() {
  return (
    <div>
      <HomeHeader />
      <section className="py-32">
        <div className="container flex flex-col items-center text-center max-w-5xl mx-auto">
          <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">
            It has never been easier to become a fullstack developer
          </h1>
          <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat
            omnis! Porro facilis quo animi consequatur. Explicabo.
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button
              variant="default"
              className="gap-2 w-full sm:w-auto h-9 px-4 py-2 has-[>svg]:px-3"
            >
              Primary
            </Button>
            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto h-9 px-4 py-2 has-[>svg]:px-3"
            >
              Secondary
            </Button>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            The Real Problem With Learning Fullstack Today
          </h2>
          <p className="text-muted-foreground mb-8">
            You&apos;re ambitious. You know that mastering fullstack web development opens
            incredible career opportunities and lets you build anything you can imagine. But trying
            to get there can feel like navigating a chaotic maze.
          </p>
          <p className="text-muted-foreground mb-8">
            You&apos;ve seen the landscape: dozens of languages, frameworks, and tools, all claiming
            to be the &quot;best.&quot; It&apos;s overwhelming. Where do you even begin? You&apos;re
            left confused, unsure which path is the <em>right</em> one, and terrified of investing
            time in the wrong tech.
          </p>
          <p className="text-muted-foreground mb-8">
            Maybe you&apos;ve tried online tutorials or courses. You invest your time, energy, maybe
            even money... only to find they&apos;re teaching skills from years ago, or they only
            scratch the surface. They give you theory on &quot;what&quot; things are, but never show
            you &quot;how&quot; to build the professional applications the real world demands.
          </p>
          <p className="text-muted-foreground mb-8">
            Becoming an exceptional developer requires constant, hands-on practice building real
            applications. But without a clear roadmap and structured challenges, it&apos;s easy to
            wander aimlessly, reinforcing bad habits and adding <em>years</em> to your learning
            journey. Just watching videos isn&apos;t enough.
          </p>
          <p className="text-muted-foreground mb-8">
            This cycle of confusion, outdated knowledge, and lack of practical building experience
            leaves you feeling stuck. You look at job descriptions and wonder if you&apos;ll ever be
            truly &quot;job-ready,&quot; questioning if you&apos;re cut out for a development
            career.
          </p>
          <p className="text-muted-foreground mb-8">
            You deserve a clear, effective, and engaging path to fullstack mastery, not a
            frustrating dead end.
          </p>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Your Path to Fullstack Mastery
          </h2>
          {/* Transition from the problem - you can keep the last problem paragraph if you like, or transition directly */}
          <p className="text-muted-foreground mb-8">
            But what if everything you thought about learning fullstack was wrong? What if becoming a skilled web developer wasn't about sifting through endless, outdated content or getting stuck without practical guidance?
          </p>
          {/* Concept: Bridge from the problem, challenge assumptions. */}

          <p className="text-muted-foreground mb-8">
            The reality is, there <em>is</em> a system designed to make you an exceptional fullstack developer, step-by-step. A system that demands almost no wasted effort and is engineered to help you learn up to <strong>10X faster</strong>.
          </p>
          {/* Concept: State the core reality/solution promise clearly. Use strong, quantifiable benefits. Address Effort & Time Delay levers. */}

          <p className="text-muted-foreground mb-8">
            Introducing <strong>Developers Secrets</strong>: The revolutionary learning platform that makes mastering fullstack development <strong>easier and faster</strong> than ever before. With Developers Secrets, you will be able to become a job-ready fullstack developer <strong>in less than six months</strong> - no matter your current skill level or specific learning goals.
          </p>
          {/* Concept: Name the solution (USP), state main promise, timeframe, and personalization. Highlight Ease and Speed. */}

          <p className="text-muted-foreground mb-8">
            Forget digging through hundreds of scattered tutorials or outdated courses teaching skills from years ago. Our <strong>adaptive learning path</strong> cuts through the noise, guiding you precisely through the <em>exact</em> skills and technologies you <em>actually</em> need to learn for today&apos;s jobs. From the moment you log in, you&apos;ll have a <strong>crystal-clear roadmap</strong>, always knowing the next step.
          </p>
          {/* Concept: Directly counter problems of overwhelm, outdated/basic content, and unclear path. Promise clarity and relevance. Reduce Effort & Time Delay. */}

          <p className="text-muted-foreground mb-8">
            We don&apos;t just teach you &quot;what&quot; features do. Our platform is built around
            <strong> hands-on projects and real-world challenges</strong> that force you to apply theory and
            build professional-grade applications. No more wandering aimlessly - you&apos;ll build
            a powerful portfolio step-by-step.
          </p>
          {/* Concept: Counter problems of What vs How and lack of professional focus/practice. Emphasize hands-on application and portfolio building. Increase Perceived Likelihood. */}

          <p className="text-muted-foreground mb-8">
            Say goodbye to feeling stuck or doubting your ability. Our <strong>AI-powered feedback</strong> gives you instant, objective insights on your code, showing you exactly where you went wrong and how to improve. Plus, our <strong>real-time skill tracking</strong> provides undeniable proof of your growing mastery, boosting your confidence every step of the way.
          </p>
          {/* Concept: Counter problems of ineffectiveness without practice and doubting ability. Highlight unique features (AI, skill tracking) as solutions. Increase Perceived Likelihood, reduce Effort & Sacrifice. */}

           <p className="text-muted-foreground mb-8">
            Experience a learning journey that&apos;s effective, engaging, and gets you job-ready.
          </p>
           {/* Concept: Summarize the key benefits/feeling before the CTA. */}

        </div>
      </section>
    </div>
  )
}
