import { Button } from '@/components/ui/button'
import { Bot, Code, Network, Users, Award, Medal, User as UserIcon } from 'lucide-react'
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

const leaderboardData = [
  { name: 'Alice Johnson', score: 1520, rank: 1 },
  { name: 'Bob Smith', score: 1460, rank: 2 },
  { name: 'Charlie Lee', score: 1390, rank: 3 },
  { name: 'Diana Prince', score: 1320, rank: 4 },
  { name: 'Ethan Brown', score: 1280, rank: 5 },
  { name: 'Fiona Green', score: 1200, rank: 6 },
  { name: 'George King', score: 1150, rank: 7 },
  { name: 'Hannah White', score: 1100, rank: 8 },
  { name: 'Ivan Petrov', score: 1080, rank: 9 },
  { name: 'Julia Kim', score: 1050, rank: 10 },
]

function getLeague(rank: number) {
  if (rank === 1)
    return { label: 'Gold', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' }
  if (rank === 2)
    return { label: 'Silver', color: 'bg-gray-500/10 border-gray-500/20 text-gray-500' }
  if (rank === 3)
    return { label: 'Bronze', color: 'bg-orange-500/10 border-orange-500/20 text-orange-500' }
  return { label: 'Platinum', color: 'bg-blue-500/10 border-blue-500/20 text-blue-500' }
}

// ProfileCard composant fictif
function ProfileCard() {
  return (
    <div className="absolute -top-10 -left-12 z-0 w-[350px] bg-background border border-border rounded-xl shadow-lg flex flex-col items-start p-4 gap-2 opacity-90">
      {/* Division badge en haut à droite */}
      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md border bg-yellow-500/10 border-yellow-500/20 text-yellow-500 text-xs font-medium">
        Gold
      </span>
      <img
        src="https://avatar.vercel.sh/heroUser?rounded=60"
        alt="User profile"
        className="w-12 h-12 rounded-full border border-border mb-2"
      />
      <div className="font-semibold text-base">Hero User</div>
      <div className="mt-1 px-2 py-0.5 rounded-md border border-purple-500/20 bg-purple-500/10 text-xs text-purple-500 font-medium">
        Guild: Code Masters
      </div>
      <div className="text-xs text-muted-foreground">Level 12</div>
      <div className="text-xs text-primary font-medium">2,340 XP</div>
    </div>
  )
}

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

            <div className="flex w-full items-start justify-center pt-10 pb-20 px-8">
              <div className="w-full max-w-3xl">
                <DisplayCards
                  cards={[
                    {
                      icon: <Code className="size-4 text-orange-400" />, // FizzBuzz left
                      title: 'FizzBuzz',
                      description: `Solve the classic FizzBuzz: print specific words depending on number divisibility. A great exercise to test your basics in loops and conditions.`,
                      date: 'Easy • 3 min',
                      className:
                        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-md before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 translate-x-24",
                      difficulty: 'easy',
                    },
                    {
                      icon: <Code className="size-4 text-purple-400" />,
                      title: 'Palindrome',
                      description: `Check if a word or phrase reads the same forwards and backwards. A challenge focused on string manipulation.`,
                      date: 'Medium • 10 min',
                      className:
                        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-md before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                      difficulty: 'medium',
                      status: 'completed',
                    },
                    {
                      icon: <Code className="size-4 text-blue-400" />, // Two Sum right
                      title: 'Two Sum',
                      description: `Find two numbers in an array that add up to a target value. Perfect for practicing array search and logic.`,
                      date: 'Easy • 5 min',
                      className:
                        '[grid-area:stack] translate-x-0 translate-y-20 hover:translate-y-15',
                      difficulty: 'easy',
                      status: 'in_progress',
                    },
                  ]}
                  align="left"
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
          <div className="p-8 sm:col-span-2 flex flex-col items-start justify-center bg-background relative min-h-[320px]">
            <div className="absolute top-8 left-8 z-10">
              <div className="flex flex-row items-center gap-3 mb-2">
                <div className="text-muted-foreground">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="text-base font-medium text-muted-foreground text-left">
                  Skill Tree
                </h3>
              </div>
              <p className="text-left text-xl font-medium text-white mb-6 max-w-md">
                Visualize your progress and discover new skills to unlock as you advance.
              </p>
            </div>
            <div className="w-full flex justify-center items-center min-h-[240px] mt-16">
              <SkillTreeGraph />
            </div>
          </div>
          {features.slice(2).map((feature, i) =>
            i === 0 ? (
              // Première carte de la dernière ligne : AI Chat
              <div
                key="ai-chat"
                className="p-6 bg-card text-card-foreground flex flex-col items-start justify-center relative min-h-[300px]"
              >
                <div className="flex flex-row items-center gap-3 mb-2">
                  <div className="text-muted-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-medium text-muted-foreground text-left">AI Chat</h3>
                </div>
                <p className="text-left text-xl font-medium text-white mb-6 max-w-md">
                  Ask anything to our AI assistant and get instant, contextual answers.
                </p>
                <div className="flex flex-col items-start w-full h-full flex-1">
                  <div className="space-y-2 w-full h-full flex-1">
                    <ChatBubble variant="sent">
                      <ChatBubbleAvatar fallback="US" />
                      <ChatBubbleMessage variant="sent" content="How do I center a div in CSS?" />
                    </ChatBubble>
                    <ChatBubble variant="received">
                      <ChatBubbleAvatar fallback="AI" />
                      <ChatBubbleMessage
                        content={`You can use:\n\n\`\`\`css\ndisplay: flex;\njustify-content: center;\nalign-items: center;\n\`\`\`\n\non the parent element.`}
                      />
                    </ChatBubble>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={i + 2}
                className="p-6 bg-card text-card-foreground flex flex-col items-start justify-start relative min-h-[220px] max-h-96 overflow-hidden"
              >
                <div className="flex flex-row items-center gap-3 mb-2">
                  <div className="text-muted-foreground">{feature.icon}</div>
                  <h3 className="text-base font-medium text-muted-foreground text-left">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-left text-xl font-medium text-white mb-6 max-w-md">
                  {feature.description}
                </p>
                <div className="w-full flex justify-center items-center mt-8">
                  <div className="relative">
                    <ProfileCard />
                    <ul className="divide-y divide-border rounded-md border border-border bg-background overflow-hidden relative z-10">
                      {leaderboardData.slice(0, 4).map((user, idx) => (
                        <li key={user.rank} className="flex items-center gap-3 px-3 py-2">
                          <span
                            className={
                              user.rank === 1
                                ? 'text-yellow-400 mr-2'
                                : user.rank === 2
                                  ? 'text-gray-400 mr-2'
                                  : user.rank === 3
                                    ? 'text-orange-500 mr-2'
                                    : 'text-muted-foreground mr-2'
                            }
                          >
                            {user.rank === 1 ? (
                              <Award className="w-5 h-5" />
                            ) : user.rank === 2 ? (
                              <Medal className="w-5 h-5" />
                            ) : user.rank === 3 ? (
                              <Medal className="w-5 h-5" style={{ color: '#cd7f32' }} />
                            ) : (
                              <UserIcon className="w-5 h-5" />
                            )}
                          </span>
                          <img
                            src={`https://avatar.vercel.sh/${encodeURIComponent(user.name.replace(/\s/g, ''))}?rounded=60`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full border border-border object-cover"
                          />
                          <span className="flex-1 truncate font-medium flex items-center gap-2">
                            {user.name}
                            <span
                              className={`ml-1 px-2 py-0.5 rounded-md border text-xs font-medium ${getLeague(user.rank).color}`}
                            >
                              {getLeague(user.rank).label}
                            </span>
                          </span>
                          <span className="ml-2 text-sm font-mono text-primary">
                            {user.score} XP
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
