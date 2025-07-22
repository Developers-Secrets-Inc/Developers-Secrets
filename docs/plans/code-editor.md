# Plan de Refonte de l'Éditeur de Code

## 1. Objectif

L'objectif est de refondre l'actuel `ChallengeEditor` pour le transformer en un système modulaire, performant et extensible. Le nouvel éditeur, `CodeEditor`, sera construit autour d'une architecture à base de plugins, permettant d'ajouter ou de modifier des fonctionnalités sans impacter le cœur du système.

## 2. Problématiques de l'Architecture Actuelle

L'éditeur existant repose sur un unique et volumineux store Zustand (`challenge-editor/store.ts`). Cette approche monolithique présente plusieurs inconvénients majeurs :

- **Manque de modularité** : Toutes les logiques (gestion du code, de la langue, du terminal, des tests, de la soumission) sont centralisées, rendant le code difficile à maintenir et à faire évoluer.
- **Problèmes de performance** : N'importe quelle mise à jour du store peut potentiellement provoquer un re-render de l'ensemble des composants de l'éditeur, même s'ils ne sont pas directement concernés par la modification.
- **Extensibilité quasi impossible** : Ajouter une nouvelle fonctionnalité, comme un onglet de débogage ou un linter, nécessite de modifier en profondeur le store central, ce qui est complexe et risqué.

## 3. Nouvelle Architecture Proposée

Nous allons abandonner le store monolithique au profit d'une architecture basée sur la composition de composants et l'utilisation de contextes React multiples et spécialisés.

### 3.1. Structure des Composants

L'éditeur sera décomposé en plusieurs parties logiques, chacune agissant comme un conteneur pour ses propres fonctionnalités :

- `CodeEditor.Container` : Le composant racine qui englobe tout l'éditeur.
- `CodeEditor.Header` : La partie supérieure, destinée à contenir les actions principales (sélection de la langue, boutons d'action).
- `CodeEditor.Content` : La zone centrale contenant l'éditeur de texte (ex: Monaco Editor).
- `CodeEditor.Footer` : La partie inférieure, conçue pour être un panneau à onglets (terminal, résultats de tests, etc.).

### 3.2. Gestion de l'État : Des Stores Spécialisés

Au lieu d'un seul store monolithique, nous utiliserons une hiérarchie de stores Zustand, chacun potentiellement accompagné d'un contexte React pour l'injection si nécessaire.

- **`EditorStore` (Store Principal)** : Il gérera l'état véritablement global qui doit être partagé entre toutes les parties de l'éditeur. Cela inclut :
    - Le contenu des fichiers ouverts.
    - Le fichier actuellement actif.
    - La langue de programmation sélectionnée.

- **`HeaderStore`, `FooterStore` (Stores Spécifiques)** : Chaque section principale (`Header`, `Footer`) aura son propre store pour gérer son état local et son extensibilité.
    - Le `FooterStore`, par exemple, gérera l'état d'ouverture du panneau (`isTerminalOpen`) et la liste dynamique des onglets à afficher (ex: 'Output', 'Tests').

Cette approche garantit une séparation claire des préoccupations et optimise les performances en limitant les re-renders aux seules parties de l'interface qui sont réellement affectées par un changement d'état. Les stores seront accessibles via des hooks personnalisés (ex: `useEditorStore`, `useFooterStore`).

#### Optimisation des Performances avec les Sélecteurs

Pour éviter les re-renders inutiles, chaque composant s'abonnera uniquement à la tranche de l'état qui le concerne via des **sélecteurs**. Un composant ne sera re-rendu que si la valeur spécifique qu'il a sélectionnée change.

Par exemple, un composant affichant le fichier actif utilisera `useEditorStore(state => state.activeFileId)`. Il ne sera donc pas affecté par une modification du contenu d'un autre fichier, garantissant ainsi une réactivité maximale de l'interface.

### 3.3. Un Système de Plugins

Le cœur de la nouvelle architecture est son extensibilité via un système de plugins. Un plugin est une fonctionnalité autonome qui peut s'intégrer à l'éditeur.

- **Enregistrement dynamique** : Un plugin pourra interagir avec les stores spécifiques pour ajouter des éléments d'interface ou modifier l'état. Par exemple :
    - Un plugin de "Tests" appellera une action du `FooterStore` pour y ajouter un onglet "Résultats de test" et le panneau de contenu correspondant.
    - Un plugin de "Sauvegarde" pourra appeler une action du `HeaderStore` pour y ajouter un bouton "Sauvegarder".

- **Implémentation initiale** : L'éditeur sera livré avec un minimum de fonctionnalités. Le panneau "Output" du footer sera lui-même implémenté comme le premier plugin par défaut du système.

## 4. Avantages de la Nouvelle Architecture

- **Modularité et Évolutivité** : Les fonctionnalités sont encapsulées dans des plugins, faciles à ajouter, mettre à jour ou supprimer.
- **Performance** : La gestion de l'état est localisée, ce qui évite les re-renders inutiles et rend l'interface plus réactive.
- **Maintenabilité** : Le code est découplé, plus simple à comprendre, à débugger et à tester.
- **Expérience Développeur** : La création de nouvelles fonctionnalités devient une tâche simple et prévisible, sans avoir besoin de comprendre l'intégralité du système.