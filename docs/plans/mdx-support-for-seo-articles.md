# Plan de développement : Support de contenu riche (Payload Lexical Rich Text) pour les articles SEO

## Objectif
Permettre aux articles de la collection `Articles` d'utiliser le Lexical Rich Text Editor de Payload CMS. Cela permettra d'intégrer un contenu riche et structuré, y compris des composants React personnalisés (appelés "Payload Blocks"), tout en conservant les fonctionnalités SEO existantes.

## Motivation
L'utilisation de l'éditeur Lexical est l'approche native et recommandée par Payload pour gérer le contenu riche. Elle offre une meilleure expérience d'édition dans le panneau d'administration et une intégration profonde avec les capacités de gestion de contenu de Payload, ce qui est préférable à une solution de parsing MDX externe.

## Hypothèses
*   Un environnement Next.js avec l'App Router est en place.
*   Payload CMS est configuré et utilisé pour la gestion des collections de contenu.
*   Les articles actuels stockent leur contenu en Markdown brut (chaîne de caractères).

## Étapes du plan de développement

### Phase 1 : Préparation et installation des dépendances
1.  **Installation du package Lexical Rich Text :**
    *   Installer la bibliothèque officielle `@payloadcms/richtext-lexical`.

### Phase 2 : Modification du modèle de données (Payload CMS)
1.  **Mise à jour de la collection `Articles` (`src/collections/Articles.ts`) :**
    *   Modifier le champ `content` existant : son `type` doit passer de `textarea` à `richText`.
    *   Configurer le `editor` pour ce champ en utilisant `lexicalEditor({})`.
    *   Si des composants React personnalisés doivent être insérés dans le contenu (équivalent des composants MDX), activer la `BlocksFeature` dans la configuration de l'éditeur. Il faudra alors référencer les définitions de ces "Payload Blocks".
    *   **Impact sur les types TypeScript :** Le processus de génération automatique de types de Payload mettra à jour l'interface `Article` dans `src/payload-types.ts`. Le champ `content` représentera désormais un objet JSON (état de l'éditeur Lexical). S'assurer que les types d'articles personnalisés (`src/types/article.ts`) sont également compatibles.

### Phase 3 : Rendu du contenu Rich Text côté client (React)
1.  **Utilisation du composant `RichText` de Payload :**
    *   Le contenu de l'article récupéré sera un objet JSON. Pour le rendre en JSX, il faudra utiliser le composant `RichText` fourni par `@payloadcms/richtext-lexical/react`.
    *   Ce composant remplacera l'éventuel composant de rendu Markdown existant dans `src/app/(frontend)/articles/[tutorial_slug]/components/article-content.tsx`.
    *   **Gestion des liens internes :** Le composant `RichText` nécessitera une fonction `internalDocToHref` pour convertir les liens internes de Payload en URLs Next.js correctes, afin d'éviter les erreurs console.
    *   **Rendu des "Payload Blocks" :** Le composant `RichText` devra être configuré avec des "converters" spécifiques pour chaque "Payload Block" personnalisé que nous aurons défini. Cela permettra de rendre les composants React définis dans les blocs.

### Phase 4 : Définition des "Payload Blocks" (Composants React personnalisés)
1.  **Création des définitions de blocs :**
    *   Pour chaque élément de contenu interactif ou structuré (ex: un bloc de code, une alerte, un embed vidéo, etc.) qui aurait été un composant MDX, créer une définition de "Payload Block".
    *   Ces définitions incluront un `slug` unique pour le bloc et un schéma de `fields` qui définira les propriétés configurables du bloc dans l'admin Payload.
    *   Chaque définition de bloc pointera vers un composant React (`'use client'`) qui sera responsable du rendu de ce bloc sur le frontend. Ces composants seront placés dans un répertoire dédié (ex: `src/blocks/`).

### Phase 5 : Stratégie de migration du contenu existant
1.  **Conversion du contenu Markdown existant :**
    *   **Option 1 (Manuelle - Recommandée pour petit volume) :** Pour un nombre limité d'articles, ouvrir chaque article dans le panneau d'administration de Payload. L'éditeur Lexical affichera un champ vide. Le contenu Markdown original devra être copié/collé et reformatté manuellement en utilisant les outils de l'éditeur. Les "Payload Blocks" devront être insérés manuellement.
    *   **Option 2 (Scriptée - Complexe et Risquée) :** Pour un grand volume d'articles, développer un script pour convertir programmatiquement le Markdown existant en l'objet JSON de l'état de l'éditeur Lexical. Cela implique de parser le Markdown et de mapper ses éléments aux nœuds Lexical correspondants. Cette approche est complexe et nécessite une validation rigoureuse.

### Phase 6 : Validation et tests
1.  **Tests d'édition dans l'admin Payload :**
    *   Vérifier que le nouvel éditeur Lexical fonctionne comme prévu : création, édition, sauvegarde, insertion de blocs.
2.  **Tests de rendu sur le frontend :**
    *   S'assurer que tous les types de contenu riche (texte, liens, listes, images, et surtout les "Payload Blocks") sont rendus correctement.
    *   Tester les liens internes et s'assurer qu'ils génèrent les bonnes URLs.
3.  **Tests de régression :**
    *   Confirmer que les articles existants (après migration) s'affichent correctement.
    *   S'assurer que les métadonnées SEO (`generateMetadata`) ne sont pas affectées par ce changement de contenu.
    *   Vérifier que les performances de chargement des pages ne sont pas dégradées.

### Phase 7 : Documentation et maintenance
1.  **Mise à jour de la documentation interne :**
    *   Créer des guides pour les contributeurs de contenu sur la manière d'utiliser le nouvel éditeur Lexical et d'insérer des "Payload Blocks".
    *   Documenter chaque "Payload Block" créé (usage, propriétés).
    *   Mettre à jour les règles de développement si de nouvelles conventions d'écriture de blocs ou de contenu riche sont établies.

---

### Dépendances clés
*   Payload CMS
*   Next.js
*   React
*   `@payloadcms/richtext-lexical`
*   `@payloadcms/richtext-lexical/react`
