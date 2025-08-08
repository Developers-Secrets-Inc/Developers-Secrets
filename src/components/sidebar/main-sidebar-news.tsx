import { News, type NewsArticle } from '@/components/sidebar/sidebar-news'

const DEMO_ARTICLES: NewsArticle[] = [
  {
    href: 'https://developerssecrets.com/#',
    title: 'AI Challenges Now Available',
    summary:
      'Explore cutting-edge AI programming challenges designed to test your machine learning and algorithmic skills across various difficulty levels.',
    image: '',
  },
  {
    href: 'https://developerssecrets.com/#',
    title: 'New Python Course',
    summary:
      'Master Python fundamentals with our comprehensive new course covering everything from basic syntax to advanced concepts like decorators and generators.',
    image: '',
  },
  {
    href: 'https://developerssecrets.com/#',
    title: 'New Python OOP Course',
    summary:
      'Dive deep into Object-Oriented Programming with Python through practical examples and real-world design patterns for scalable applications.',
    image: '',
  },
]

export const MainSidebarNews = () => {
  return <News articles={DEMO_ARTICLES} />
}
