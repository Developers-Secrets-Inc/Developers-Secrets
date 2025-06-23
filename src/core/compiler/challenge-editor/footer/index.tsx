'use client'

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  Beaker,
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClubIcon,
  DiamondIcon,
  FileOutput,
  HeartIcon,
  Loader2,
  LucideIcon,
  SpadeIcon,
  XCircle,
} from 'lucide-react'
import { TerminalTab, useChallengeEditorStore } from '../store'

// Map icon names to actual LucideIcon components
const IconMap: Record<string, LucideIcon> = {
  HeartIcon,
  DiamondIcon,
  SpadeIcon,
  ClubIcon,
  Beaker,
  Bot,
}

const TERMINAL_STYLE = {
  backgroundColor: '#1a1b26',
  color: '#ffffff',
  fontFamily: 'monospace',
  padding: '12px',
  height: '100%',
  overflow: 'auto',
  whiteSpace: 'pre-wrap' as const,
}

export type TestResult = {
  success: boolean
  input: string
  expectedOutput: string
  actualOutput: string
}

export const TerminalTabs = () => {
  const {
    activeTerminalTab: activeTab,
    isTerminalOpen,
    toggleTerminal: toggleTerminalOpen,
    setActiveTerminalTab: setActiveTab,
  } = useChallengeEditorStore()

  const handleTabChange = (value: string) => {
    setActiveTab(value as TerminalTab)
    if (!isTerminalOpen) {
      toggleTerminalOpen()
    }
  }

  return (
    <div
      className={cn(
        'border-t flex items-center justify-between px-1 h-10',
        isTerminalOpen ? 'border-b-0' : '',
      )}
      onDoubleClick={toggleTerminalOpen}
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
        <TabsList className="flex-grow bg-transparent tabs-list-container">
          <TabsTrigger value="tests" className="flex items-center gap-1.5">
            <Beaker size={14} />
            <span>Test Results</span>
          </TabsTrigger>

          <Separator orientation="vertical" className="h-3 mx-1" />

          <TabsTrigger value="output" className="flex items-center gap-1.5">
            <FileOutput size={14} />
            <span>Output</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div
        className="flex items-center cursor-pointer p-1 hover:bg-muted rounded-sm"
        onClick={toggleTerminalOpen}
        title={isTerminalOpen ? 'Close terminal' : 'Open terminal'}
      >
        {isTerminalOpen ? (
          <ChevronDown size={16} className="text-muted-foreground" />
        ) : (
          <ChevronUp size={16} className="text-muted-foreground" />
        )}
      </div>
    </div>
  )
}

type TestCaseDisplayProps = {
  testResult: TestResult
  index: number
}

const TestCaseDisplay = ({ testResult, index }: TestCaseDisplayProps) => (
  <div className="space-y-4 p-4">
    <div
      className={cn(
        'flex items-center justify-between text-sm font-medium',
        testResult.success ? 'text-green-500' : 'text-red-500',
      )}
    >
      <span>
        Test Case #{index + 1}: {testResult.success ? 'Passed' : 'Failed'}
      </span>
      {testResult.success ? (
        <CheckCircle size={16} className="text-green-500" />
      ) : (
        <XCircle size={16} className="text-red-500" />
      )}
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Input</h3>
        <pre className="p-2 rounded bg-muted/50 text-xs">{testResult.input}</pre>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Expected Output</h3>
        <pre className="p-2 rounded bg-muted/50 text-xs">{testResult.expectedOutput}</pre>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Actual Output</h3>
        <pre
          className={cn(
            'p-2 rounded text-xs',
            testResult.success ? 'bg-green-500/10' : 'bg-red-500/10',
          )}
        >
          {testResult.actualOutput}
        </pre>
      </div>
    </div>
  </div>
)

export const TerminalContent = () => {
  const {
    activeTerminalTab: activeTab,
    isTerminalOpen,
    setActiveTerminalTab: setActiveTab,
    toggleTerminal: toggleTerminalOpen,
    testResults,
    executionOutput,
    isLoadingSubmit,
  } = useChallengeEditorStore()

  const handleTabChange = (value: string) => {
    setActiveTab(value as TerminalTab)
    if (!isTerminalOpen) {
      toggleTerminalOpen()
    }
  }

  return (
        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden',
            isTerminalOpen ? 'h-[30%] opacity-100' : 'h-0 opacity-0',
          )}
        >
          <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
            <TabsContent value="tests" className="h-full p-0 m-0">
              {isLoadingSubmit && activeTab === 'tests' ? (
                <div style={TERMINAL_STYLE} className="flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin mr-2" /> Loading test results...
                </div>
              ) : testResults.length > 0 ? (
                <div className="h-full overflow-auto">
                  <Tabs defaultValue="0" className="h-full border-t">
                    <div className="border-b">
                      <TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
                        {testResults.map((_, index) => (
                          <TabsTrigger
                            key={index}
                            value={index.toString()}
                            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5"
                          >
                            Test {index + 1}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                    {testResults.map((result, index) => (
                      <TabsContent key={index} value={index.toString()}>
                        <TestCaseDisplay testResult={result} index={index} />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ) : (
                <div style={TERMINAL_STYLE}>
                  {'> No test results available. Run your code to see test results.'}
                </div>
              )}
            </TabsContent>

            <TabsContent value="output" className="h-full p-0 m-0">
              <div style={TERMINAL_STYLE}>
                {executionOutput || '> No output available. Run your code to see results.'}
              </div>
            </TabsContent>
          </Tabs>
        </div>
  )
}
