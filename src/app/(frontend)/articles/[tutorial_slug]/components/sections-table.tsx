import { Section } from '@/api/articles/actions'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export const ArticlesSectionsTable = ({ sections, tutorialSlug, type = '' }: { sections: Section[], tutorialSlug: string, type?: string }) => {
  if (!sections || sections.length === 0) return null;
  return (
    <Card className="max-w-5xl mx-auto p-0">
      <CardContent className='px-0'>
        <Tabs defaultValue={sections[0].name} className="w-full">
          <div className="flex gap-6">
            <div className="min-w-[180px] border-r">
              <TabsList className="flex flex-col h-fit bg-transparent w-full p-0">
                {sections.map((section, index) => (
                  <TabsTrigger 
                    key={section.name} 
                    value={section.name} 
                    className={`text-left w-full justify-start text-base py-3 px-4 data-[state=active]:bg-primary/10 data-[state=active]:border-primary/0 data-[state=active]:border data-[state=active]:text-foreground ${
                      index === 0 ? 'rounded-tl-lg' : ''
                    } ${
                      index === sections.length - 1 ? 'rounded-bl-lg' : ''
                    } ${
                      index !== 0 && index !== sections.length - 1 ? 'rounded-none' : ''
                    }`}
                  >
                    {section.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="flex-1">
              {sections.map((section) => (
                <TabsContent key={section.name} value={section.name} className="mt-0 p-0">
                  <ul className="m-0 p-0 list-none divide-y">
                    {section.articles.map((article, index) => (
                      <li key={article.slug} className="py-4 text-lg flex items-center gap-4">
                        <div className="w-8 h-8 border border-primary/20 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <Link href={`/articles/${tutorialSlug}${type ? `/${type}` : ''}/${article.slug}`} className="hover:text-primary transition-colors">
                          {article.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
