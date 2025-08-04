'use client';

import { evaluate, EvaluateOptions } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { useState, useEffect, ComponentType } from 'react';
import { HTMLProps } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TypographyInlineCode } from '@/components/typography';
import { CodeBlock, CodeBlockCode } from '@/components/code-block';

// Define the type for MDX node (from MDX AST)
interface MDXNode {
  position?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

// Define the type for MDX components
interface MDXComponents {
  [key: string]: ComponentType<any>;
  h1?: ComponentType<HTMLProps<HTMLHeadingElement> | null>;
  code?: ComponentType<
    HTMLProps<HTMLElement> & { children?: string; className?: string; node?: MDXNode } | null
  >;
  CustomButton?: ComponentType;
}

// Extend EvaluateOptions to include components
interface CustomEvaluateOptions extends EvaluateOptions {
  components?: MDXComponents;
}

function extractLanguage(className?: string): string {
  if (!className) return 'plaintext';
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : 'plaintext';
}

// Define custom components for MDX
const components: MDXComponents = {
  h1: (props: HTMLProps<HTMLHeadingElement> | null) => {
    const safeProps = props || {};
    return <h1 style={{ color: 'blue' }} {...safeProps} />;
  },
  CustomButton: () => <button>Cliquez-moi</button>,
  code: ({ className, children, node, ...props }: HTMLProps<HTMLElement> & { children?: string; className?: string; node?: MDXNode } | null) => {
    // Guard against null props
    if (!props) {
      return <code>{children || ''}</code>;
    }

    const safeChildren = children || '';
    const isInline = !node?.position?.start.line || node?.position?.start.line === node?.position?.end.line;

    if (isInline) {
      return (
        <TypographyInlineCode {...props} className="text-gray-200">
          {safeChildren}
        </TypographyInlineCode>
      );
    }

    const language = extractLanguage(className);

    return (
      <CodeBlock className={className}>
        <CodeBlockCode code={safeChildren} language={language} />
      </CodeBlock>
    );
  },
};

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  const [MDXContent, setMDXContent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAndRenderMarkdown() {
      try {
        console.log('Markdown content:', markdown);

        const { default: Content } = await evaluate(markdown, {
          ...runtime,
          components,
        } as CustomEvaluateOptions);

        setMDXContent(() => Content);
      } catch (err) {
        console.error('MDX compilation error:', err);
        setError('Failed to render content');
      }
    }

    loadAndRenderMarkdown();
  }, [markdown]);

  if (error) return <div>Error: {error}</div>;
  if (!MDXContent) return <div>Loading...</div>;

  // Render the compiled MDX content by calling the component directly
  return <div>{MDXContent({ components })}</div>;
}