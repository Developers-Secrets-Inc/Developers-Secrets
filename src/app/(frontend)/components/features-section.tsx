import { Button } from '@/components/ui/button'
import { Bot, Code, Network, Users } from 'lucide-react'
import { DisplayCards } from './challenge-card'
import { LearningPathGraph } from './learning-path'
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from './chat-bubble'
import { Copy, RefreshCcw } from 'lucide-react'
import { SkillTreeGraph } from './skill-tree'
import { Cross } from './cross'

const features = [
  {
    icon: <Code className="h-4 w-4" />,
    title: 'Interactive Challenges',
    description:
      'Solve real-world problems in our interactive coding environment. Get instant feedback and improve your skills.',
  },
  {
    icon: <Network className="h-4 w-4" />,
    title: 'Structured Learning Paths',
    description:
      'Follow curated learning paths that take you from beginner to advanced topics in a logical sequence.',
  },
  {
    icon: <Bot className="h-4 w-4" />,
    title: 'AI-Powered Assistance',
    description:
      'Stuck on a problem? Get hints and explanations from our AI assistant without revealing the solution.',
  },
  {
    icon: <Users className="h-4 w-4" />,
    title: 'Community & Leaderboards',
    description:
      'Compete with other learners, climb the leaderboards, and join a community of motivated developers.',
  },
]

export const FeaturesSection = () => {
  return (
    <>
      <div className="border-t border-border">
        <div className="w-full p-8 flex flex-col items-start gap-2">
          <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500 mb-2 inline-block">
            The Solution
          </span>
          <h2 className="text-3xl font-bold md:text-4xl mt-1">Everything you need to succeed</h2>
          <p className="mt-4 text-muted-foreground">
            Our platform provides all the tools and resources you need to master fullstack
            development.
          </p>
        </div>
      </div>
      <section className="border-t border-border relative">
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 divide-x divide-y">
          {/* Première carte (Interactive Challenges) avec DisplayCards en dessous */}
          <div className="p-6 bg-card text-card-foreground border-t">
            <div className="flex flex-row items-center gap-3 mb-2">
              <div className="text-muted-foreground">{features[0].icon}</div>
              <h3 className="text-base font-medium text-muted-foreground text-left">
                {features[0].title}
              </h3>
            </div>
            <p className="text-left text-xl font-medium">{features[0].description}</p>

            <div className="flex min-h-[400px] w-full items-center justify-center pb-20">
              <div className="w-full max-w-3xl">
                <DisplayCards
                  cards={[
                    {
                      icon: <Code className="size-4 text-orange-400" />, // FizzBuzz left
                      title: 'FizzBuzz',
                      description: `
**FizzBuzz** is a classic exercise to test your loop and condition logic:

- Print numbers from 1 to 100
- For multiples of 3, print "Fizz"
- For multiples of 5, print "Buzz"
- For both, print "FizzBuzz"
`,
                      date: 'Easy • 3 min',
                      className:
                        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-md before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 translate-x-24",
                      difficulty: 'easy',
                    },
                    {
                      icon: <Code className="size-4 text-purple-400" />,
                      title: 'Palindrome',
                      description: `
A **palindrome** is a word or phrase that reads the same forwards and backwards.

- Examples: _kayak_, _radar_, _level_
- Ignore case and punctuation

> "A man, a plan, a canal: Panama" is a famous palindrome.`,
                      date: 'Medium • 10 min',
                      className:
                        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-md before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                      difficulty: 'medium',
                      status: 'completed',
                    },
                    {
                      icon: <Code className="size-4 text-blue-400" />, // Two Sum right
                      title: 'Two Sum',
                      description: `
- You are given an array of integers and a target
- Find two indices _i_ and _j_ such that arr[i] + arr[j] == target
- Return the indices as an array

\`\`\`ts
nums = [2, 7, 11, 15], target = 9
=> Result: [0, 1] (because 2 + 7 = 9)
\`\`\`
`,
                      date: 'Easy • 5 min',
                      className:
                        '[grid-area:stack] translate-x-0 translate-y-20 hover:translate-y-15',
                      difficulty: 'easy',
                      status: 'in_progress',
                    },
                  ]} // [grid-area:stack] translate-x-0 translate-y-20 hover:translate-y-10
                />
              </div>
            </div>
          </div>
          {/* Deuxième carte normale */}
          <div className="p-6 bg-card text-card-foreground border-t">
            <div className="flex flex-row items-center gap-3 mb-2">
              <div className="text-muted-foreground">{features[1].icon}</div>
              <h3 className="text-base font-medium text-muted-foreground text-left">
                {features[1].title}
              </h3>
            </div>
            <p className="text-left text-xl font-medium">{features[1].description}</p>
            <div className="mt-8">
              <LearningPathGraph />
            </div>
          </div>
          <div className="p-8 sm:col-span-2 flex flex-col items-center justify-center text-center bg-card">
            <SkillTreeGraph />
          </div>
          {features.slice(2).map((feature, i) =>
            i === 0 ? (
              // Première carte de la dernière ligne : AI Chat
              <div key="ai-chat" className="p-6 bg-card text-card-foreground flex flex-col gap-4">
                <div className="flex flex-row items-center gap-3 mb-2">
                  <div className="text-muted-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-medium text-muted-foreground text-left">AI Chat</h3>
                </div>
                <p className="text-left text-muted-foreground mb-4">
                  Ask anything to our AI assistant and get instant, contextual answers.
                </p>
                <div className="max-w-md space-y-2">
                  <ChatBubble variant="sent">
                    <ChatBubbleAvatar
                      fallback="US"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                    />
                    <ChatBubbleMessage variant="sent" content="How do I center a div in CSS?" />
                  </ChatBubble>
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar
                      fallback="AI"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                    />
                    <ChatBubbleMessage
                      content={`You can use:\n\n\`\`\`css\ndisplay: flex;\njustify-content: center;\nalign-items: center;\n\`\`\`\n\non the parent element.`}
                    />
                  </ChatBubble>
                </div>
              </div>
            ) : (
              <div key={i + 2} className="p-6 bg-card text-card-foreground">
                <div className="flex flex-row items-center gap-3 mb-2">
                  <div className="text-muted-foreground">{feature.icon}</div>
                  <h3 className="text-base font-medium text-muted-foreground text-left">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-left">{feature.description}</p>
              </div>
            ),
          )}
        </div>
        {/* Cross icons bottom left/right */}
        <Cross className="absolute left-0 bottom-0 translate-y-1/2 -translate-x-1/2 z-0" />
        <Cross className="absolute right-0 bottom-0 translate-y-1/2 translate-x-1/2 z-0" />
      </section>
    </>
  )
}
