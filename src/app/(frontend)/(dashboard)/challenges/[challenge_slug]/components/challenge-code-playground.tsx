'use client'

import { useState } from 'react'
import { CodeEditor } from '@/components/code-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Exemple de code initial pour JavaScript
const JAVASCRIPT_INITIAL_CODE = `// Écrivez une fonction qui calcule la somme de deux nombres
function sum(a, b) {
  // Votre code ici
  return a + b;
}

// Testez votre fonction
console.log(sum(5, 3)); // Devrait afficher 8
`

// Exemple de code initial pour TypeScript
const TYPESCRIPT_INITIAL_CODE = `// Écrivez une fonction qui calcule la somme de deux nombres
function sum(a: number, b: number): number {
  // Votre code ici
  return a + b;
}

// Testez votre fonction
console.log(sum(5, 3)); // Devrait afficher 8
`

// Exemple de code initial pour Python
const PYTHON_INITIAL_CODE = `# Écrivez une fonction qui calcule la somme de deux nombres
def sum(a, b):
    # Votre code ici
    return a + b

# Testez votre fonction
print(sum(5, 3))  # Devrait afficher 8
`

type Language = 'javascript' | 'typescript' | 'python'

/**
 * Composant d'aire de jeu de code pour les challenges
 */
export function ChallengeCodePlayground() {
  // État pour la langue sélectionnée
  const [language, setLanguage] = useState<Language>('javascript')

  // Obtenir le code initial en fonction de la langue
  const getInitialCode = (lang: Language) => {
    switch (lang) {
      case 'javascript':
        return JAVASCRIPT_INITIAL_CODE
      case 'typescript':
        return TYPESCRIPT_INITIAL_CODE
      case 'python':
        return PYTHON_INITIAL_CODE
      default:
        return JAVASCRIPT_INITIAL_CODE
    }
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Éditeur de code</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={language === 'javascript' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('javascript')}
            >
              JavaScript
            </Button>
            <Button
              variant={language === 'typescript' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('typescript')}
            >
              TypeScript
            </Button>
            <Button
              variant={language === 'python' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('python')}
            >
              Python
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CodeEditor
          initialCode={getInitialCode(language)}
          language={language}
          onChange={(code) => console.log('Code mis à jour:', code)}
        />
      </CardContent>
    </Card>
  )
}
