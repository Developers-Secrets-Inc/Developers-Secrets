import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

export const FAQ = () => {
  return (
    <section className="border-y border-border py-20 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>What is Developers Secrets?</AccordionTrigger>
            <AccordionContent>
              Developers Secrets is a platform to master fullstack development through interactive
              challenges, learning paths, and real-world projects.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Is there a free trial?</AccordionTrigger>
            <AccordionContent>
              Yes! You can start with a free trial and explore all the main features before
              subscribing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Can I learn at my own pace?</AccordionTrigger>
            <AccordionContent>
              Absolutely. All courses and challenges are self-paced, so you can learn whenever it
              suits you best.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>Do I get a certificate?</AccordionTrigger>
            <AccordionContent>
              Yes, you will receive a certificate of completion for each course or learning path you
              finish.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger>How can I contact support?</AccordionTrigger>
            <AccordionContent>
              You can reach our support team anytime via the contact form or live chat on the
              platform.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
