# Plan de Développement : Assistant IA "Pearl" pour les Challenges (V2.1)

Ce document détaille le plan de développement pour l'amélioration de l'assistant IA "Pearl", en le transformant en un partenaire pédagogique proactif. Cette version (2.1) intègre les meilleures pratiques du Vercel AI SDK.

## 1. Objectifs

L'objectif est de faire de "Pearl" un assistant qui non seulement répond aux questions, mais guide activement l'utilisateur.

### Fonctionnalités Clés :
1.  **Connaissance Approfondie** : Accès à l'historique complet des soumissions de l'utilisateur.
2.  **Sécurité Pédagogique** : Système "garde-fou" pour ne pas donner la solution.
3.  **Persistance des Conversations** : Sauvegarde des échanges pour chaque challenge, en utilisant les mécanismes du Vercel AI SDK.
4.  **Gestion par l'Utilisateur** : Permettre la réinitialisation de la conversation.
5.  **Limitation d'Usage** : Quota quotidien de requêtes basé sur le rôle.
6.  **Assistance Proactive** : Introduction des **"Smart Insights"** pour fournir des retours pertinents.

---

## 2. Architecture & Implémentation

### Phase 1 : Backend - Modélisation et API Route

#### 1. Collections Payload CMS
-   **`ChallengeAIChats`**
    -   **Champs** : `user`, `challenge`, `messages` (JSON). Le champ `messages` stockera des objets conformes à l'interface `Message` de `@ai-sdk/react` (incluant `id`, `role`, `content`, `createdAt`).
-   **`AIRequestLogs`** (inchangé)
    -   **Champs** : `user`, `timestamp`.
-   **`ChallengeAIInsights`** (inchangé)
    -   **Champs** : `user`, `challenge`, `insightContent`, `status`, `triggerAction`.

#### 2. API Route (`/app/api/challenges/chat/route.ts`)
Une route dédiée sera créée pour gérer les interactions avec l'IA, conformément aux pratiques du Vercel AI SDK.

-   **`POST(req: Request)`** :
    1.  Extraire `{ messages, id, body }` du corps de la requête. `id` sera un identifiant unique pour la conversation (ex: `userId-challengeId`).
    2.  Récupérer le `systemPrompt` enrichi (avec historique des soumissions, etc.) via une action serveur.
    3.  Appeler `streamText` avec le modèle, les messages et le prompt système.
    4.  Utiliser le callback **`onFinish`** de `streamText` pour :
        -   Appeler une action serveur `saveChallengeAIChat(id, allMessages)` qui sauvegardera la conversation complète (messages de l'utilisateur + réponse complète de l'IA).
    5.  Retourner `result.toDataStreamResponse()` pour streamer la réponse au client.

#### 3. Actions Serveur (`/src/core/challenges/ai-assistant/`)
-   `getChallengeSubmissions(...)` (inchangé)
-   `getChallengeAIChat(chatId: string)`: Récupère l'historique depuis `ChallengeAIChats` via l'ID unique.
-   `saveChallengeAIChat(chatId: string, messages: Message[])`: Sauvegarde la conversation.
-   `resetChallengeAIChat(chatId: string)`: Supprime la conversation.
-   `logAIRequest(...)`, `getTodaysAIRequestCount(...)`, `getUserAIQuota(...)` (inchangé)
-   `analyzeCodeForInsights(...)`, `getUnreadInsights(...)`, `markInsightAsRead(...)` (inchangé)

---

### Phase 2 : Logique de l'Intelligence Artificielle

(Aucun changement majeur par rapport à la V2, la logique reste la même)

-   **Enrichissement du Contexte de l'IA**
-   **Système de "Garde-fou" Anti-Solution**
-   **Logique de Génération d'Insights**

---

### Phase 3 : Frontend - Interface Utilisateur

#### 1. Modifications du `AIAssistantDialog` (`.../ai-assistant-dialog.tsx`)

-   **Hook `useChat`** :
    -   `const { messages, input, handleInputChange, handleSubmit, status, error, reload, stop, setMessages } = useChat({ api: '/api/challenges/chat', id: 'uniqueChatId', initialMessages: loadedMessages, sendExtraMessageFields: true });`
    -   `initialMessages` sera hydraté avec les messages chargés via `getChallengeAIChat`.
-   **Gestion de l'UI basée sur l'état** :
    -   Utiliser `status` pour afficher un spinner de chargement (`submitted`, `streaming`) et désactiver l'input.
    -   Utiliser `error` pour afficher un message d'erreur et le bouton `reload` pour réessayer.
    -   Utiliser `stop` pour permettre à l'utilisateur d'interrompre la génération.
-   **Logique de soumission** :
    -   La fonction `handleSubmit` sera utilisée. Avant de l'appeler, nous vérifierons le quota de l'utilisateur.
    -   L'action `logAIRequest` sera appelée au moment de la soumission.
-   **Réinitialisation du chat** :
    -   Le bouton "Réinitialiser" appellera `resetChallengeAIChat` puis `setMessages([])` pour vider l'interface.

#### 2. Intégration des "Smart Insights"

-   **`ChallengeEditor`** : La logique de déclenchement de `analyzeCodeForInsights` après une soumission reste la même.
-   **`TerminalTabs`** : Le nouvel onglet "Insights" affichera les suggestions.
-   **Transition vers le chat** : Le clic sur "Discuter de ça" appellera une fonction qui :
    1.  Ouvre le dialogue du chat.
    2.  Utilise `setMessages(...)` pour ajouter un message de l'utilisateur pré-rempli basé sur l'insight, afin de démarrer la conversation de manière contextuelle.
    3.  Marque l'insight comme "lu" via `markInsightAsRead`.

## 4. Planning Prévisionnel (inchangé)

1.  **Sprint 1 : Backend & Données**
    -   Création des collections et de l'API Route avec la logique de sauvegarde.
2.  **Sprint 2 : Logique IA & Intégration Frontend**
    -   Implémentation de l'UI du chat avec la gestion des états (loading, error) et des "Insights".
3.  **Sprint 3 : Finalisation & Expérience Utilisateur**
    -   Tests complets du flux, y compris la gestion des quotas et la transition "Insight -> Chat".


## Fonctionnalités à venir / Roadmap

> Cette section liste les évolutions majeures prévues pour le système Pearl, en complément des fonctionnalités existantes.

### 1. Gestion avancée des quotas et rôles utilisateurs
- **Limitation dynamique** du nombre de messages ou de tokens générés selon le rôle (gratuit, premium, etc.).
- **Support des items et buffs** : possibilité pour les utilisateurs gratuits d’obtenir des messages supplémentaires ou un accès illimité temporaire via des objets consommables ou des effets spéciaux (buffs).
- **Centralisation de la logique de permission** dans un service unique côté serveur, capable de prendre en compte :
  - Le rôle de l’utilisateur
  - Les items consommés
  - Les effets actifs (ex : accès illimité temporaire)
  - Le solde de crédits (pour les clients payants)
- **Décompte automatique** des crédits/messages/items/buffs à chaque requête IA.

### 2. Architecture de stockage et performance
- **Déport du stockage des historiques de chat** sur S3 (via Payload S3 Storage), pour éviter de surcharger la base de données principale.
- **Mise en cache agressive** des conversations (Redis ou équivalent) pour limiter les accès S3 et accélérer l’expérience utilisateur.
- **Nettoyage automatique** du cache lors de la mise à jour d’une conversation.

### 3. Module IA centralisé et réutilisable
- **Création d’un module AI unique** pour toute l’application, gérant :
  - La construction des prompts
  - L’appel aux modèles (OpenAI, Gemma, etc.)
  - Le suivi des coûts/tokens
  - L’application des règles de permission
- **Réutilisation de Pearl** dans d’autres contextes (ex : système de formations, séquences de challenges, etc.) avec la même logique de base.

### 4. Extensibilité et analytics
- **Logs détaillés** de toutes les requêtes IA (pour audit, facturation, analyse d’usage).
- **Support de nouveaux types d’IA** (ex : agents, assistants spécialisés, etc.) via le même module.
- **Possibilité d’ajouter des fonctionnalités de "Smart Insights" contextuelles dans d’autres modules (formations, feedback, etc.)**.

---