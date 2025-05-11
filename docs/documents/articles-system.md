# Plan de Développement : Système d'Articles V2

## Introduction

Ce document décrit le plan de développement pour la version 2 du système d'articles, visant à améliorer l'engagement des utilisateurs, la découvrabilité du contenu, les performances et les capacités de gestion pour les administrateurs.

## 1. Pages de Destination des Tutoriels (Mini-Pages de Vente)

*   **Objectif :** Créer une page d'accueil dédiée pour chaque tutoriel, présentant la technologie et servant de hub central pour tous les contenus associés.
*   **Structure de la Page :**
    *   Remplacer la redirection actuelle de `src/app/(frontend)/articles/[tutorial_slug]/page.tsx` par une nouvelle page de présentation.
    *   La page comportera trois onglets (tabs) :
        *   **Onglet 1 : Présentation & Tutoriels**
            *   Description de la technologie (avantages, cas d'usage, etc.).
            *   Liste des articles de type "tutoriel" associés à cette technologie.
        *   **Onglet 2 : Exemples**
            *   Liste des articles de type "exemple" concrets pour cette technologie.
        *   **Onglet 3 : Références**
            *   Liste des articles de type "référence" (API, documentation technique) pour cette technologie.
*   **Points Techniques :**
    *   Créer un nouveau composant React pour cette page (ex: `TutorialLandingPage`).
    *   Adapter les fonctions de récupération de données (`getTutorial`, `getTutorialArticles`, `getTutorialExampleArticles`, `getTutorialReferenceArticles`) pour charger toutes les informations nécessaires à cette page, y compris les trois types d'articles.
    *   Concevoir l'UI/UX pour les onglets et la présentation du contenu.
    *   Mettre à jour la logique de `generateStaticParams` si nécessaire pour ces nouvelles pages.

## 2. Système de Liens Internes Avancé

*   **Objectif :** Améliorer l'expérience utilisateur et le maillage interne en affichant un aperçu informatif des articles liés au survol.
*   **Fonctionnalité :**
    *   Lorsqu'un utilisateur survole un lien interne pointant vers un autre article, une `HoverCard` (similaire à l'exemple fourni par l'utilisateur) apparaîtra.
    *   Le contenu de la `HoverCard` affichera :
        *   Titre de l'article lié.
        *   Description courte ou sous-titre de l'article.
        *   Temps de lecture estimé.
        *   Date de dernière mise à jour.
    *   Le texte du lien sera le déclencheur (pas une image).
*   **Points Techniques :**
    *   Créer ou adapter un composant React (ex: `InternalLinkHoverCard`) basé sur `HoverCard` de `shadcn/ui`.
    *   Modifier le parseur Markdown ou le composant de rendu Markdown (`src/components/markdown/index.tsx` ou `src/utils/markdown-parser/index.ts`) pour identifier et enrichir les liens internes.
        *   Alternativement, créer une syntaxe Markdown spécifique pour ces liens si nécessaire, ou un composant React à utiliser directement dans le MDX.
    *   Développer une fonction côté serveur pour récupérer les métadonnées nécessaires (titre, description, temps de lecture, date de màj) pour un article donné par son slug/ID, optimisée pour des appels fréquents.
    *   S'assurer que cette fonctionnalité n'impacte pas négativement les performances de rendu des pages.

## 3. Tracking Analytique Avancé

*   **Objectif :** Collecter des données précises sur l'engagement des utilisateurs avec le contenu pour informer les décisions éditoriales et d'amélioration.
*   **Métriques à Suivre :**
    *   **Pages de Destination des Tutoriels & Pages d'Articles Individuels :**
        *   Nombre de visites uniques.
        *   Temps moyen passé sur la page.
    *   **Articles Recommandés (Composant `RecommendedArticles`) :**
        *   Nombre de clics sur chaque article recommandé (distinguer les populaires et les personnalisés).
*   **Points Techniques :**
    *   Choisir et intégrer une solution d'analytics (Vercel Analytics, Google Analytics, Plausible, ou une solution custom).
    *   Implémenter des événements de tracking spécifiques pour :
        *   Les vues de page.
        *   Les clics sur les liens des articles recommandés.
        *   Le temps passé.
    *   S'assurer de la conformité RGPD.

## 4. Informations en Interface pour les Administrateurs

*   **Objectif :** Fournir aux administrateurs des données clés et des outils directement dans leur interface de gestion du contenu (Payload CMS).
*   **Fonctionnalités Envisagées (à détailler) :**
    *   Affichage des statistiques de base (vues, temps passé) sur la page d'édition d'un article dans Payload.
    *   Indicateurs sur les articles peu performants ou nécessitant une mise à jour.
    *   Accès rapide aux feedbacks utilisateurs liés à un article.
*   **Points Techniques :**
    *   Développer des composants React personnalisés pour l'interface d'administration de Payload.
    *   Créer des endpoints API sécurisés pour que l'admin Payload puisse requêter les données analytiques agrégées.
    *   Modifier les collections Payload pour stocker/afficher ces informations.

## 5. Maximisation des Performances (Objectif 100/100 Web Core Vitals & Lighthouse)

*   **Objectif :** Assurer une expérience utilisateur ultra-rapide et obtenir des scores parfaits sur les outils de mesure de performance web.
*   **Axes d'Optimisation Continus :**
    *   **Rendu :** SSG (`generateStaticParams`), optimisation SSR.
    *   **Images :** `next/image`, compression (AVIF/WebP), lazy loading.
    *   **Code Splitting.**
    *   **JavaScript :** Minimisation, analyse de bundles, éviter scripts bloquants.
    *   **CSS :** Techniques modernes, purge CSS inutilisé.
    *   **Chargement des Données :** Optimisation requêtes API, cache Next.js (`revalidateTag`).
    *   **Polices :** Optimisation (`next/font`).
    *   **Scripts Tiers :** Chargement asynchrone/différé.
    *   **Pré-chargement :** `Link prefetch`.
    *   **Infrastructure :** Configuration CDN, edge functions.
*   **Points Techniques :**
    *   Intégrer des outils de monitoring de performance (Lighthouse CI, Sentry Performance, Vercel Analytics).
    *   Effectuer des audits de performance réguliers.

## 6. Architecture du Layout pour Optimisation ISR/SSG

*   **Objectif :** Assurer que le contenu principal des pages d'articles puisse bénéficier de la génération statique (SSG) ou de la régénération statique incrémentielle (ISR), même en présence d'un header dynamique (dépendant des cookies pour l'authentification).
*   **Problématique :** Le composant `ArticleHeader` (utilisé dans les pages d'articles et contenant par exemple `AuthButtons`) est dynamique car il dépend de l'état de session de l'utilisateur (cookies). Son inclusion directe dans les fichiers `page.tsx` des articles rend ces pages entièrement dynamiques, empêchant l'ISR/SSG optimal pour le contenu principal.
*   **Solution :**
    1.  **Créer un Layout Commun pour les Articles :**
        *   Mettre en place un fichier `src/app/(frontend)/articles/layout.tsx`.
    2.  **Déplacer le Header Dynamique :**
        *   Le `ArticleHeader` sera inclus dans ce `articles/layout.tsx`.
        *   Il est probable que le composant `ArticleHeader` (actuellement dans `src/app/(frontend)/articles/[tutorial_slug]/components/article-header.tsx`) et son composant dépendant `MainNavigationMenu` (actuellement dans `src/app/(frontend)/articles/[tutorial_slug]/[article_slug]/components/main-navigation-menu.tsx`) doivent être déplacés vers un emplacement plus central et générique (par ex: `src/app/(frontend)/articles/components/` ou `src/components/layout/`) pour être facilement accessibles par le layout principal des articles.
    3.  **Mettre à Jour les Pages d'Articles :**
        *   Retirer l'instanciation directe de `ArticleHeader` des fichiers `page.tsx` des différentes sections d'articles (tutoriels, exemples, références). Le header sera désormais fourni par le `articles/layout.tsx` parent.
        *   La structure interne des pages (par ex: `SidebarProvider`, `ArticleSidebar`, `SidebarInset`, `ArticleContent`) restera dans les `page.tsx` si elle est spécifique à chaque page ou si ses données sont chargées statiquement pour cette page. Le `children` du layout contiendra cette structure.
*   **Bénéfices :**
    *   Le contenu principal des articles (le `children` du layout) pourra être servi statiquement et mis à jour via ISR, améliorant considérablement les temps de chargement et les scores de performance (Core Web Vitals).
    *   Le header dynamique sera géré au niveau du layout, n'impactant pas la stratégie de rendu du contenu principal.
*   **Considérations :**
    *   Vérifier l'utilisation de `HomeHeader` dans `src/app/(frontend)/articles/[tutorial_slug]/[article_slug]/page.tsx` et l'harmoniser avec `ArticleHeader` si les deux servent un rôle similaire et ont des dépendances dynamiques. Si `HomeHeader` est aussi dynamique, il devrait suivre le même pattern.
