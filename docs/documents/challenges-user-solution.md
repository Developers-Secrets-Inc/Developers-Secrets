# Plan de Développement : Création/Édition de Solutions Utilisateur

Ce document décrit les étapes nécessaires pour finaliser et améliorer la fonctionnalité de création et d'édition des solutions utilisateur pour les challenges.

## 1. Complétion des Fonctionnalités et Intégration des Données Réelles

Ces tâches visent à rendre l'interface dynamique et connectée aux données réelles.

*   **Intégration des Statistiques Réelles :**
    *   **Problème :** Le composant `SolutionStats.tsx` affiche des données factices (0).
    *   **Actions :**
        1.  **Chargement Côté Serveur (`page.tsx`) :** Utiliser l'appel existant à `getUserSolution` pour récupérer l'objet `solution` complet.
        2.  **Calculer les Stats :** Dans `page.tsx`, extraire `solution.views` et calculer `likes` et `dislikes` à partir de `solution.votes`.
        3.  **Passer les Props :** Transmettre `views`, `likes`, `dislikes` comme props de `page.tsx` à `SolutionStats.tsx`.
        4.  **Simplifier `SolutionStats.tsx` :** Le composant devient un simple composant d'affichage recevant ses données via props.
*   **Intégration du Système de Commentaires Réel :**
    *   **Problème :** Le composant `SolutionComments.tsx` utilise des données factices et charge côté client.
    *   **Actions (Réutilisation du système `src/core/comments`) :**
        1.  **Chargement Côté Serveur (`page.tsx`) :** Utiliser la même action (`getSessionUserSolution` ou `getUserSolution`) pour récupérer `solution.comments` (s'assurer de la profondeur de la query Payload).
        2.  **Passer les Props :** Transmettre le tableau `initialComments` comme prop de `page.tsx` à `SolutionComments.tsx`.
        3.  **Nettoyer `SolutionComments.tsx` :** Supprimer les données/composants factices.
        4.  **Utiliser `useComments` avec Hydratation :**
            *   Importer `useComments` et `commentContexts`.
            *   Récupérer `solutionId` (converti en `number`) et `userId` depuis le store Zustand.
            *   Initialiser le hook avec `commentContexts.userSolution(numericSolutionId)`, `userId`, et **utiliser `initialComments` (passé en props) pour hydrater `react-query`** (via `initialData` ou `placeholderData`).
            *   Gérer les callbacks (`handleDelete`, `handleAddReply`, `handleEdit`) via `useComments`.
        5.  **Afficher `CommentsHistory` :**
            *   Importer `CommentsHistory`.
            *   Gérer l'état `isLoading` (sera potentiellement plus court grâce à l'hydratation).
            *   Rendre `<CommentsHistory comments={comments} ... />`.
        6.  **Vérifier/Assurer l'Affichage des Réponses :** Confirmer que `CommentThread.tsx` affiche les `replies` et leurs auteurs correctement.
        7.  **Intégrer les Fonctionnalités Spécifiques (Votes, Réponses, Signalement, Édition/Suppression) :** Confirmer que les composants (`CommentVotes`, `CommentResponseTextArea`, `ReportCommentDialog`, etc.) fonctionnent avec les données et callbacks fournis par `useComments`.
        8.  **Styling :** Adapter le style.
        9.  **Fournisseur de Contexte (`QueryClientProvider`) :** Assurer sa présence.
*   **Ajout de Limites de Caractères pour Titre et Description :**
    *   **Problème :** Les champs titre et description dans `SolutionMetadata.tsx` n'ont pas de limite de taille.
    *   **Fichiers Cibles :** `src/app/(frontend)/(dashboard)/challenges/create-solution/components/SolutionMetadata.tsx`, `src/components/tooltip-without-decoration.tsx` (à importer).
    *   **Actions :**
        1.  **Définir les Limites :** Titre (max 50 caractères), Description (max 150 caractères).
        2.  **Appliquer les Limites :** Utiliser l'attribut `maxLength` sur les composants `Input` dans `UserSolutionTitle` et `UserSolutionDescription`.
        3.  **Retour Utilisateur :**
            *   Ajouter un état local dans `UserSolutionTitle` et `UserSolutionDescription` pour suivre si la limite est atteinte.
            *   Afficher conditionnellement une icône d'avertissement (ex: `AlertTriangle` de `lucide-react`) à côté de l'input lorsque la limite est atteinte (`value.length === maxLength`).
            *   Envelopper l'icône d'avertissement avec le composant `TooltipContentCustom` (ou son provider/wrapper).
            *   Le contenu du tooltip indiquera la limite atteinte (ex: "Limite de 50 caractères atteinte").

## 2. Raffinement du Système de Tags

Améliorer l'expérience utilisateur lors de la sélection et de la création de tags.

*   **~~Correction du Déclencheur de Création de Tag~~ (Fait via refactoring) :**
    *   ~~Problème : L'erreur Linter sur `onCreateOption` dans `user-solution-tags.tsx` empêche la création de tags à la volée.~~
    *   ~~Action : Corrigé en utilisant `creatable={true}` de `MultipleSelector` et en supprimant la prop `onCreateOption`.~~
*   **Stratégie de Création de Tags :**
    *   **Décision :** Création différée lors de la soumission de la solution via `handleTagsCreation` dans `actions.ts`.
*   **~~Refactoring de `UserSolutionTags`~~ (TERMINÉ) :
    *   ~~Problème : Composant trop complexe, dépend fortement du type `Option` interne, gère une simulation de création.~~
    *   ~~Fichier Cible : `src/app/(frontend)/(dashboard)/challenges/create-solution/components/user-solution-tags.tsx`, `solution-form-store.ts`, `page.tsx`~~
    *   ~~Actions :~~
        ~~1. Utiliser Types `Option[]` dans le Store.~~
        ~~2. Conversion au niveau du Hook : Hook `useSolutionTags` créé pour gérer le fetch, l'état Zustand et la conversion vers `Option[]` pour le composant UI.~~
        ~~3. Supprimer la Simulation et Logique Superflue : Logique locale de recherche/création retirée de `user-solution-tags.tsx`.~~
        ~~4. Simplifier la Recherche : Utilisation de la capacité native de `MultipleSelector`.~~
        ~~5. Clarifier la Création : Utilisation de `creatable={true}` pour la création interne par `MultipleSelector`, gérée ensuite par le hook/store.~~
        ~~6. Nettoyer le Code.~~

## 3. Revue et Refactorisation

Amélioration générale de la qualité du code.

*   **Gestion de l'État :**
    *   Clarifier le rôle du store Zustand (`solution-form-store.ts`) par rapport aux hooks locaux potentiels. Éviter la duplication ou les conflits d'état. Privilégier le store Zustand pour l'état global du formulaire.
*   **Nettoyage du Code :**
    *   Supprimer les hooks/composants devenus obsolètes après refactorisation.
    *   Optimiser les rendus et les dépendances des `useEffect`/`useMemo`/`useCallback`.
*   **~~Refactoring du Bouton de Soumission (`CreateSolutionButton`)~~ (TERMINÉ) :
    *   ~~Problème : Le composant gérait directement la logique de mutation `react-query` et la lecture de nombreux états du store.~~
    *   ~~Fichiers Cibles : `src/app/(frontend)/(dashboard)/challenges/create-solution/components/header/create-solution-button.tsx`, `src/app/(frontend)/(dashboard)/challenges/create-solution/hooks/use-submit-solution.ts`~~.
    *   ~~Actions Réalisées :~~
        ~~1. Création du Hook Personnalisé (`useSubmitSolution`) :~~
            ~~* Déplacement de la logique `useMutation`.~~
            ~~* Lecture des données nécessaires depuis le store Zustand dans le hook.~~
            ~~* Appel de `getEditorContent()` dans la `mutationFn`.~~
            ~~* Retour de la fonction de mutation (`submit`) et de l'état `isPending`.~~
        ~~2. Simplification de `CreateSolutionButton` :~~
            ~~* Utilisation du hook `useSubmitSolution`.~~
            ~~* Appel de la fonction `submit` retournée par le hook.~~
            ~~* Utilisation de l'état `isPending`.~~
            ~~* Suppression des lectures directes des états du store et de la définition de `useMutation`.~~
        ~~3. Correction des Erreurs (Infinite Loop / SSR) :~~
            ~~* Sélection individuelle des slices d'état Zustand dans `CreateSolutionForm` et `useSubmitSolution`.~~
            ~~* Importation dynamique de `DynamicEditor` dans `CreateSolutionForm` avec `ssr: false`.~~
            ~~* Passage de `setEditorContentGetter` via `onEditorReady` pour assurer la disponibilité de la fonction avant soumission.~~

## 4. Intégration d'un Assistant IA (Nouvelle Fonctionnalité)

Cette section décrit l'ajout d'une fonctionnalité d'assistance basée sur l'IA pour aider les utilisateurs à rédiger leurs solutions.

*   **Objectif :** Fournir une aide contextuelle (explication de code, suggestions de formulation, aide au débogage simple) directement dans l'interface de création de solution.
*   **Définition du Périmètre :**
    *   Quel type d'aide l'IA fournira-t-elle ? (Explication, reformulation, génération de snippets, etc.)
    *   Comment l'utilisateur interagira-t-il avec l'IA ? (Chat séparé, commandes dans l'éditeur, sélection de texte + action ?)
    *   Quel modèle/service d'IA sera utilisé ? (API externe, modèle spécifique ?)
*   **Conception UI/UX :**
    *   Intégrer l'interface de l'assistant de manière non intrusive.
    *   Définir comment les suggestions/réponses de l'IA sont présentées à l'utilisateur.
*   **Implémentation Backend :**
    *   Créer les actions serveur ou les routes API nécessaires pour communiquer avec le service d'IA.
    *   Gérer l'authentification et la sécurité des appels à l'IA.
    *   Préparer le contexte à envoyer à l'IA (contenu de l'éditeur, description du challenge, etc.).
*   **Implémentation Frontend :**
    *   Développer les composants UI pour l'interaction avec l'IA.
    *   Gérer les appels aux actions serveur/API backend.
    *   Afficher les réponses de l'IA et permettre à l'utilisateur de les utiliser (ex: insérer dans l'éditeur).
*   **Gestion des Coûts et Limites :**
    *   Mettre en place des mécanismes pour contrôler l'utilisation de l'API IA (limites par utilisateur, etc.).

## 5. Modération du Contenu par IA

Cette section concerne l'analyse automatique du contenu des solutions pour détecter les contenus problématiques.

*   **Objectif :** Assurer un environnement sûr et respectueux en identifiant automatiquement les contenus potentiellement inappropriés, offensants ou contraires aux règles.
*   **Déclenchement :** L'analyse pourrait se faire :
    *   Lors de la soumission/mise à jour de la solution.
    *   Périodiquement sur les solutions existantes.
*   **Service d'IA :** Choisir un service d'IA spécialisé dans la modération de contenu (ex: API Perspective, services cloud AWS/GCP/Azure, etc.).
*   **Implémentation Backend :**
    *   Créer une action serveur ou une tâche de fond (Payload job) qui prend le contenu de la solution.
    *   Appeler l'API de modération de contenu.
    *   Analyser la réponse de l'IA (scores de toxicité, etc.).
*   **Actions en cas de Détection :**
    *   Définir le seuil de déclenchement.
    *   Marquer la solution pour revue manuelle par un modérateur.
    *   (Optionnel) Masquer temporairement la solution.
    *   Notifier l'auteur (optionnel, selon la politique).
*   **Interface Modérateur :** Prévoir une interface (dans Payload Admin ?) pour examiner les solutions signalées.

## 6. Intégration avec les Fonctionnalités Existantes

Cette section couvre l'intégration de la fonctionnalité de solutions avec d'autres systèmes de la plateforme.

*   **Lien depuis le Profil Utilisateur :**
    *   **Objectif :** Permettre aux utilisateurs (et aux visiteurs) de voir les solutions partagées par un utilisateur spécifique depuis sa page de profil.
    *   **Actions :**
        1.  Ajouter une relation ou une query sur la page de profil pour récupérer les solutions de l'utilisateur.
        2.  Afficher une liste ou des cartes de ces solutions sur le profil.
*   **Intégration avec le Système d'Achievements et d'Expérience :**
    *   **Objectif :** Récompenser les utilisateurs pour la création et la qualité de leurs solutions.
    *   **Actions :**
        1.  Définir les déclencheurs d'XP/Achievements (ex: créer une première solution, publier une solution, recevoir X upvotes, avoir une solution sélectionnée comme "top", etc.).
        2.  Intégrer l'attribution d'XP/Achievements dans les actions serveur appropriées (ex: `submitUserSolution`, hooks Payload après vote, tâche de classement hebdomadaire/mensuelle ?).
*   **Leaderboard des Contributeurs de Solutions :**
    *   **Objectif :** Mettre en avant les utilisateurs qui contribuent le plus ou dont les solutions sont les plus appréciées.
    *   **Actions :**
        1.  Définir les critères du leaderboard (nombre de solutions publiées, total d'upvotes reçus sur toutes les solutions, nombre de solutions "top", etc.).
        2.  Créer une nouvelle collection Payload ou une logique de calcul (potentiellement via un job périodique) pour agréger ces statistiques par utilisateur.
        3.  Développer un nouveau composant/page pour afficher ce leaderboard.
*   **Page Dédiée "Mes Solutions" :**
    *   **Objectif :** Créer une page où l'utilisateur connecté peut voir et gérer toutes les solutions qu'il a créées.
    *   **Route :** Définir une nouvelle route (ex: `/my-solutions`).
    *   **Data Fetching :**
        *   Créer une action serveur (ex: `getSessionUserSolutions`) qui récupère toutes les solutions de l'utilisateur connecté.
        *   S'assurer que les informations du challenge associé (titre, slug) sont récupérées (population de la relation).
    *   **Interface Utilisateur :**
        *   Afficher les solutions sous forme de liste ou de cartes.
        *   Inclure le titre de la solution, le titre du challenge associé, le statut (Brouillon/Publié), la date de création/mise à jour.
        *   Fournir des liens directs pour "Voir" la solution (sur la page publique) et "Modifier" la solution (redirigeant vers `/challenges/create-solution?...`).
    *   **Navigation :** Ajouter un lien vers cette nouvelle page dans le menu utilisateur ou la barre latérale.

## 7. Implémentation de la Sauvegarde Automatique (Autosave)

*   **Objectif :** Prévenir la perte de travail en sauvegardant périodiquement le brouillon.
*   **Fichiers Cibles :** `solution-form-store.ts`, `hooks/use-submit-solution.ts` (ou un nouveau hook), `components/header/solution-draft-status.tsx`.
*   **Actions :**
    1.  **Détection des Changements :** Utiliser le store Zustand pour détecter si le contenu (titre, description, tags, contenu éditeur) a changé depuis la dernière sauvegarde.
    2.  **Déclenchement Périodique :** Utiliser un `useEffect` avec un `setTimeout` (ou une librairie comme `use-debounce`) pour déclencher la sauvegarde après une période d'inactivité suivant une modification.
    3.  **Action de Sauvegarde :** Créer une nouvelle action serveur (ex: `saveDraftSolution`) ou adapter `submitUserSolution` pour sauvegarder explicitement en tant que brouillon (`status: 'drafted'`).
    4.  **Mutation :** Appeler l'action de sauvegarde via `useMutation` (probablement dans un hook dédié à l'autosave).
    5.  **Retour Utilisateur :** Mettre à jour le composant `solution-draft-status.tsx` pour indiquer l'état de la sauvegarde (sauvegarde en cours, sauvegardé à HH:mm, non sauvegardé).

---

## Annexe : Sections Archivées

### (Archivé - Ancienne Section 1) Corrections de Bugs et Améliorations Immédiates

Ces tâches étaient prioritaires pour assurer la stabilité et le fonctionnement de base.

*   **~~Simplification et Refactoring de l'Éditeur~~ (TERMINÉ) :**
    *   ~~Problème : Structure de composants excessive, logique de chargement complexe.~~
    *   ~~Fichiers Impactés : `Editor.tsx`, `DynamicEditor.tsx`, `components/index.tsx`, `CreateSolutionForm.tsx`, `hooks/use-solution-editor.ts`.~~
    *   ~~Actions Réalisées :~~
        ~~1. Fusion de la logique dans `DynamicEditor.tsx`.~~
        ~~2. Suppression de `Editor.tsx` et `components/index.tsx`.~~
        ~~3. Suppression de `EditorContainer.tsx` (inutilisé).~~
        ~~4. Création du hook `useSolutionEditor` acceptant `initialBlocks`.~~
        ~~5. Simplification de `DynamicEditor.tsx` pour utiliser `useSolutionEditor`.~~
        ~~6. Déplacement de la logique de parsing Markdown initial dans `CreateSolutionForm.tsx`.~~
        ~~7. Remplacement du texte de chargement par `Skeleton` dans `DynamicEditor.tsx`.~~
        ~~8. Fonctions `formatMarkdownParagraphSpacing` et `convertBlocksToMarkdown` créées dans `useSolutionEditor` pour la clarté.~~
*   **~~Refactorisation de la Structure de Page (`page.tsx` / `CreateSolutionForm.tsx`)~~ (ANNULÉ) :**
    *   ~~Objectif: Déplacer la responsabilité de la mise en page principale et de la logique client vers `page.tsx` (via un wrapper client), simplifier `CreateSolutionForm.tsx`.~~
    *   ~~Actions Tentées : Layout visuel déplacé dans `page.tsx`.~~
    *   **Décision :** Maintenir la logique client (parsing markdown, ref éditeur) et le layout (deux colonnes) dans `CreateSolutionForm.tsx` pour éviter un composant wrapper supplémentaire. `page.tsx` rendra simplement `<CreateSolutionForm />`.
*   **~~Correction des Erreurs Linter restantes~~ (TERMINÉ) :**
    *   ~~Résoudre les erreurs TypeScript dans :~~
        ~~*   `src/app/(frontend)/(dashboard)/challenges/create-solution/components/user-solution-tags.tsx` (Erreur `onCreateOption` résolue par refactoring)~~
*   **~~Refactoring du Système de Tags~~ (TERMINÉ) :**
    *   ~~Problème : Composant `user-solution-tags.tsx` complexe, dépendance au type `Option`, création simulée.~~
    *   ~~Fichiers Impactés : `hooks/use-solution-tags.ts`, `components/user-solution-tags.tsx`, `store/solution-form-store.ts`, `page.tsx`.~~
    *   ~~Actions Réalisées :~~
        ~~1. Création du hook `useSolutionTags` pour fetcher les tags, gérer l'état Zustand et la conversion.~~
        ~~2. Simplification de `user-solution-tags.tsx` pour utiliser le hook.~~
        ~~3. Confirmation que le store et `page.tsx` utilisent déjà `Option[]` pour les tags.~~
*   **~~Vérification du Chargement du Contenu de l'Éditeur~~ (TERMINÉ) :**
    *   ~~Problème : S'assurer que le contenu existant d'une solution est correctement chargé.~~
    *   ~~Fichier Cible : `CreateSolutionForm.tsx` et `hooks/use-solution-editor.ts`.~~
    *   ~~Action : Tester l'édition d'une solution existante. Vérifier que `initialRawContent` est bien parsé en `initialBlocks` dans `CreateSolutionForm.tsx` et que `DynamicEditor` affiche le contenu correctement via `useSolutionEditor`.~~
    *   **Statut :** Confirmé comme fonctionnel.

### (Archivé - Ancienne Section 6) Optimisation des Performances via ISR (Incremental Static Regeneration)

Cette section détaillait la mise en place de la génération statique incrémentale pour les pages affichant les solutions utilisateur.

*   **Objectif :** Améliorer les temps de chargement initiaux et le SEO des pages de solutions en les pré-générant statiquement.
*   **Pages Cibles :**
    *   Page de détail d'une solution utilisateur (ex: `/challenges/[challenge_slug]/solutions/[solution_id]`)
    *   (Optionnel) Page listant les solutions d'un challenge (ex: `/challenges/[challenge_slug]/solutions`)
*   **Implémentation (Next.js) :**
    1.  **Identifier les Chemins (`getStaticPaths`) :**
        *   Implémenter `getStaticPaths` sur la page de détail de la solution.
        *   Cette fonction devra récupérer tous les `challenge_slug` et `solution_id` nécessaires depuis Payload CMS au moment du build pour déterminer quelles pages pré-générer.
        *   Considérer l'utilisation de `fallback: 'blocking'` ou `fallback: true` pour gérer les solutions créées *après* le build sans nécessiter un rebuild complet (génération à la demande).
    2.  **Récupérer les Données (`getStaticProps`) :**
        *   Implémenter `getStaticProps` sur la page de détail de la solution.
        *   Cette fonction récupérera les données complètes d'une solution spécifique (titre, contenu, auteur, votes initiaux, commentaires initiaux, etc.) depuis Payload CMS en utilisant les `params` (challenge_slug, solution_id).
        *   Passer ces données comme props au composant de la page.
    3.  **Activer ISR (`revalidate`) :**
        *   Ajouter une propriété `revalidate` (ex: `revalidate: 60` pour une régénération toutes les 60 secondes) dans la valeur de retour de `getStaticProps`.
        *   Cela permettra de mettre à jour les pages statiques périodiquement en arrière-plan lorsque de nouvelles données sont disponibles (ex: nouveaux votes, commentaires).
*   **Gestion des Données Dynamiques :**
    *   Les données très dynamiques (ex: compte de votes en temps réel) pourraient nécessiter une couche de fetch côté client *en plus* de l'ISR pour une fraîcheur maximale, si nécessaire.
*   **Considérations sur le Temps de Build :**
    *   Évaluer l'impact sur le temps de build si le nombre de solutions est très élevé. `fallback: true` ou `blocking` peut aider à mitiger cela.
