import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Beaker, ChevronDown, ChevronUp, FileOutput } from 'lucide-react'

type TerminalTab = 'tests' | 'output'

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

/**
 * Terminal tabs component
 */
type TerminalTabsProps = {
  activeTab: TerminalTab
  isTerminalOpen: boolean
  onTabChange: (value: string) => void
  onChevronClick: (e: React.MouseEvent) => void
  onDoubleClick: (e: React.MouseEvent) => void
}

export const TerminalTabs = ({
  activeTab,
  isTerminalOpen,
  onTabChange,
  onChevronClick,
  onDoubleClick,
}: TerminalTabsProps) => (
  <div
    className={cn(
      'border-t flex items-center justify-between px-1 h-10',
      isTerminalOpen ? 'border-b-0' : '',
    )}
    onDoubleClick={onDoubleClick}
  >
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
      <TabsList className="bg-transparent tabs-list-container">
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
      onClick={onChevronClick}
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

type TestCaseDisplayProps = {
  testResult: TestResult
  index: number
}

const TestCaseDisplay = ({ testResult, index }: TestCaseDisplayProps) => (
  <div className="space-y-4 p-4">
    <div className="grid grid-cols-3 gap-4">
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
    <div
      className={cn('text-sm font-medium', testResult.success ? 'text-green-500' : 'text-red-500')}
    >
      Test Case #{index + 1}: {testResult.success ? 'Passed' : 'Failed'}
    </div>
  </div>
)

/**
 * Terminal content component
 */
type TerminalContentProps = {
  activeTab: TerminalTab
  testResults: TestResult[]
  executionOutput: string
  onTabChange: (value: string) => void
  isTerminalOpen: boolean
}

export const TerminalContent = ({
  activeTab,
  testResults,
  executionOutput,
  onTabChange,
  isTerminalOpen,
}: TerminalContentProps) => (
  <div
    className={cn(
      'transition-all duration-300 ease-in-out overflow-hidden',
      isTerminalOpen ? 'h-[30%] opacity-100' : 'h-0 opacity-0',
    )}
  >
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value)} className="h-full">
      <TabsContent value="tests" className="h-full p-0 m-0">
        {testResults.length > 0 ? (
          <div className="h-full overflow-auto">
            <Tabs defaultValue="0" className="h-full">
              <div className="border-b px-4">
                <TabsList>
                  {testResults.map((_, index) => (
                    <TabsTrigger key={index} value={index.toString()}>
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
