import React from 'react'
import { MarkdownMDX } from '../components/MarkdownMDX'

// Exemple de composant React à injecter dans le MDX
function CustomAlert(props: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#ffeeba', padding: 12, borderRadius: 4, margin: '12px 0' }}>
      <strong>⚠️ Alert:</strong> {props.children}
    </div>
  )
}

export default {
  title: 'Components/MarkdownMDX',
  component: MarkdownMDX,
}

const markdownExample = `
# Titre Markdown

Ceci est un paragraphe **Markdown** avec un [lien](https://cursor.so).

- Liste 1
- Liste 2

> Citation


def hello() {
  return 'world';
}
`

const mdxExample = `
# Titre MDX

Voici un composant React MDX :

<CustomAlert>Attention, ceci est un composant React dans du MDX !</CustomAlert>

Et du code :


def foo() {
  return 42;
}
`

export const MarkdownOnly = () => <MarkdownMDX>{markdownExample}</MarkdownMDX>

export const MDXWithComponent = () => (
  <MarkdownMDX components={{ CustomAlert }}>
    {/* @ts-ignore */}
    {mdxExample}
  </MarkdownMDX>
)

export const WithCustomTypography = () => (
  <MarkdownMDX
    components={{
      h1: (props) => <h1 style={{ color: 'tomato', fontSize: 40 }} {...props} />,
      p: (props) => <p style={{ fontStyle: 'italic' }} {...props} />,
    }}
  >
    {markdownExample}
  </MarkdownMDX>
)
