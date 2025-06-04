'use client'

import { CodeEditor } from './code-editor'
import { Footer } from './footer'
import { TabContent } from './footer'
import { TabTrigger } from './footer'
import { IDEHeader, LanguageSelector, RunButton } from './header'
import { useIDEStore } from './store'

export const IDE = ({ language, code }: { language?: string; code?: string }) => {
  const { initialize, output } = useIDEStore()
  initialize({ language, code })

  return (
    <>
      <IDEHeader>
        <LanguageSelector />
        <RunButton />
      </IDEHeader>
      <div className="flex-grow overflow-hidden relative">
        <CodeEditor />
      </div>
      <Footer>
        <TabTrigger value="output">Output</TabTrigger>
        <TabContent value="output">
          <div style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
        </TabContent>
      </Footer>
    </>
  )
}

/* 

We should be able to 
- reset to the initial code
- save the code to the database (pro only feature)


When we run the code with multiple files, the run button execute the current file, like in a real IDE.


*/
