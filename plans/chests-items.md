# Plan de Développement : Système d'Items et de Coffres

## Vue d'Ensemble

Ce plan décrit la refonte complète du système d'items et de coffres pour résoudre les problèmes de performance actuels (latence de 45 secondes) et créer une architecture extensible pour les fonctionnalités futures. Le système passera d'un modèle de génération à la demande vers un modèle de pré-stockage avec traçabilité individuelle.

## Objectifs Principaux

1. **Performance** : Réduire le temps d'ouverture de coffres de 45 secondes à moins d'1 seconde
2. **Traçabilité** : Permettre l'identification individuelle de chaque coffre et son contexte de création
3. **Extensibilité** : Créer une architecture qui supporte facilement de nouveaux types d'items
4. **Maintenabilité** : Simplifier la logique serveur et réduire la complexité du code

## Architecture Générale

### Principe Fondamental : Modèle à Pré-stockage

Le système abandonne la génération de butin à l'ouverture pour adopter un modèle où le contenu de chaque coffre est déterminé et stocké dès sa création. Cette approche garantit une ouverture instantanée et une traçabilité complète.

### Séparation des Responsabilités

- **Items.ts** : Catalogue central des "blueprints" d'objets (définitions génériques)
- **UserItems.ts** : Inventaire des objets empilables (consommables, matériaux)
- **UserInventory.ts** : Inventaire des objets uniques (coffres avec contenu pré-stocké)
- **ActiveEffects.ts** : Suivi des effets temporels actifs sur les utilisateurs

## Types d'Items Supportés

### 1. Conteneurs (Coffres)
- **Comportement** : Contiennent des récompenses prédéterminées révélées à l'ouverture
- **Utilisation** : Ouverture unique qui distribue le contenu pré-stocké
- **Exemples** : Coffres de quêtes, coffres de récompenses quotidiennes, coffres d'événements

### 2. Consommables Temporels (Boosts)
- **Comportement** : Effets temporaires avec durée définie
- **Utilisation** : Consommation qui active un effet pour une période donnée
- **Exemples** : Boosts d'XP, boosts de gains de pièces, multiplicateurs de progression

### 3. Consommables Instantanés (Actions Uniques)
- **Comportement** : Actions immédiates et uniques
- **Utilisation** : Consommation qui déclenche une action serveur spécifique
- **Exemples** : Restauration de streaks, gains instantanés de pièces, déblocage temporaire de fonctionnalités

### 4. Déverrouillages d'Accès (Entitlements)
- **Comportement** : Accès à des fonctionnalités ou droits spécifiques
- **Utilisation** : Consommation qui accorde des permissions
- **Exemples** : Accès à l'assistant IA, accès à des cours premium, fonctionnalités spéciales

## Fonctionnalités à Développer

### Phase 1 : Refonte du Modèle de Données

#### 1.1 Mise à Jour de la Collection Items.ts
- Ajouter le champ `activationMode` pour définir le comportement de chaque item
- Créer des objets de configuration spécifiques à chaque mode d'activation
- Supprimer les champs obsolètes liés à l'ancien système de coffres
- Définir les règles de validation pour chaque type d'item
- **Mettre en place une indexation stratégique :** S'assurer que les champs clés (`rarity`, `type`, `activationMode`, `isActive`) sont indexés pour des lectures rapides.

#### 1.2 Création de la Collection UserInventory.ts
- Définir la structure pour les objets uniques (principalement les coffres)
- Inclure les champs de traçabilité (contexte de création, historique)
- Prévoir les champs pour le contenu pré-stocké des coffres
- Établir les relations avec les autres collections
- **Mettre en place une indexation stratégique :** Indexer les champs `userId`, `status`, et `baseItem`.

#### 1.3 Mise à Jour de la Collection ActiveEffects.ts
- Optimiser la structure pour le suivi des effets temporels
- Ajouter les champs nécessaires pour la gestion des boosts
- Prévoir l'extension pour de futurs types d'effets
- **Mettre en place une indexation stratégique :** Indexer les champs `userId`, `effectType`, et `expiresAt`.

#### 1.4 Remplacement : Création de Collections Dédicacées pour les Modifications Spécifiques
- **Supprimer l'ajout de champs directs dans `UserInformations.ts` pour ces modifications arbitraires.**
- **Créer de nouvelles collections Payload CMS pour chaque type de donnée spécifique que ces items peuvent modifier :**
    - Ex: `src/collections/UserAiCredits.ts`
        - Champs : `userId` (relation), `balance: number`, (optionnel) `history: Array<Object>`
        - Indexation sur `userId`.
    - Ex: `src/collections/UserUnlockedCourses.ts`
        - Champs : `userId` (relation), `course: Relation` (vers `Courses.ts`), `unlockedAt: Date`
        - Indexation sur `userId` et `course`.
    - Ex: `src/collections/UserProAccess.ts`
        - Champs : `userId` (relation), `accessType: string`, `activatedAt: Date`, `expiresAt: Date`
        - Indexation sur `userId` et `expiresAt`.
    - *Pour chaque nouveau type de modification, une nouvelle collection dédiée serait créée ici.*
- Mettre à jour les types TypeScript associés pour chaque nouvelle collection.

### Phase 2 : Logique Serveur

#### 2.1 Fonction de Création de Coffres (grantIndividualChest)
- Développer la logique de génération de butin à la création (entièrement en mémoire après lecture du blueprint).
- Implémenter la sélection aléatoire basée sur les règles du coffre.
- Créer l'instance unique dans UserInventory avec le contenu pré-stocké.
- Gérer les différents contextes de création (quêtes, événements, achats).

#### 2.2 Fonction d'Ouverture de Coffres (openIndividualChest)
- Remplacer la logique actuelle de consumeItem pour les coffres.
- Implémenter la lecture du contenu pré-stocké (1 seule requête).
- Développer la distribution groupée et parallélisée des récompenses :
    - **Opérations groupées (batch) :** Mettre à jour tous les `UserItems` de l'inventaire empilable en une seule opération.
    - **Opérations groupées (batch) :** Mettre à jour les soldes de monnaie et d'XP de l'utilisateur (si non déjà atomiquement gérées par `addCurrency`/`addExperience`).
- Gérer la mise à jour du statut du coffre à `opened`.

#### 2.3 Gestion des Consommables Temporels
- Développer la logique pour les boosts d'XP et autres effets temporaires.
- Implémenter la mécanique de "Plus Forte Valeur Prioritaire, Durée Cumulative" :
    - Lors de l'activation d'un nouveau boost du même type, si sa valeur est supérieure, la valeur de l'effet actif est mise à jour avec la nouvelle valeur.
    - La durée du nouveau boost est toujours ajoutée à la durée restante de l'effet actif (même si la nouvelle valeur est inférieure ou égale).
- Créer la logique de création de nouveaux effets actifs si aucun n'est présent.
- Gérer l'expiration automatique des effets (via un nettoyage périodique plutôt qu'une suppression en temps réel).

#### 2.4 Gestion des Consommables Instantanés
- Créer le système de mapping des actions par type.
- Développer les actions spécifiques (restauration de streak, gains de pièces).
- Implémenter la logique de consommation unique.
- Prévoir l'extension pour de nouvelles actions.

#### 2.5 Gestion des Déverrouillages d'Accès et Items Passifs Permanents
- Développer la logique d'attribution de permissions et de capacités passives.
- Implémenter la gestion des usages limités.
- Créer la logique pour les accès temporaires (si distincts des boosts temporaires).
- Prévoir la vérification des droits dans les fonctionnalités concernées.
- **Assurer l'unicité des items passifs permanents :** Un item passif ne peut être acquis qu'une seule fois par utilisateur.

#### 2.Y Nouvelle Fonctionnalité : Gestion des Items à Modification Unique (`applyOneTimeModifier`)
- **Créer le fichier :** `src/core/user/actions/apply-one-time-modifier.ts` (ou un chemin similaire).
- **Développer la fonction `applyOneTimeModifier(userId: string, modifierDetails: ModifierDetails)` :**
    - Implémenter la logique de dispatch (`switch` sur `modifierDetails.type`).
    - Gérer les cas d'erreur si le `type` n'est pas reconnu ou si les `data` sont invalides.
    - (Optionnel) Si `allowMultipleUses: false` est implémenté, ajouter une vérification avant d'appeler la fonction métier pour éviter les applications multiples du même effet si l'effet n'est pas censé être cumulable.
- **Développer les fonctions métiers spécifiques :** (ex: dans `src/core/user/actions/`)
    - `addAiCredits(userId: string, amount: number)` : Interagit avec `UserAiCredits.ts` pour trouver/créer et mettre à jour le solde.
    - `unlockCourseForUser(userId: string, courseId: string)` : Interagit avec `UserUnlockedCourses.ts` pour vérifier l'existence et créer la nouvelle entrée.
    - `grantTemporaryPro(userId: string, durationDays: number)` : Interagit avec `UserProAccess.ts` pour gérer l'accès PRO (application de la logique de cumul si applicable).
    - *Ces fonctions seront responsables d'interagir avec leurs collections dédiées respectives.*

#### 2.Z Mise à Jour de la Fonction `consumeItem` (dans `src/core/gamification/inventory/index.ts`)
- Ajouter un nouveau `case` dans le `switch` principal pour `item.activationMode === 'one_time_modifier'`.
- Dans ce cas, importer et appeler `applyOneTimeModifier(userItem.userId, item.modifierDetails)`.
- Assurer une gestion d'erreur robuste si `applyOneTimeModifier` échoue.

#### 2.6 Optimisations de Performance : Mise en Cache et Tâches de Fond
- **Mise en cache agressive côté serveur :**
    - Implémenter un cache (ex: Redis ou cache Payload CMS) pour `getUserPermanentEffects` (basé sur `UserInformations`) avec un TTL élevé (données stables).
    - Implémenter un cache pour `getUserActiveEffects` (basé sur `ActiveEffects`) avec un TTL plus court (données dynamiques).
- **Tâches de fond (Cron Jobs) :**
    - Mettre en place un job de nettoyage périodique pour purger les effets expirés de `ActiveEffects.ts`.
    - Envisager un job pour archiver les coffres `opened` de `UserInventory.ts` si la collection devient trop grande.

### Phase 3 : Interface Utilisateur

#### 3.1 Mise à Jour du Composant InventorySheet
- Adapter l'affichage pour les nouveaux types d'items
- Implémenter les interactions spécifiques à chaque type
- Optimiser l'interface pour la performance
- Ajouter les indicateurs visuels pour les effets actifs

#### 3.2 Amélioration du Composant ChestOpeningDialog
- Optimiser les animations pour la nouvelle logique
- Adapter l'affichage pour les différents types de récompenses
- Améliorer l'expérience utilisateur avec des transitions plus fluides
- Ajouter des indicateurs de rareté et de valeur

#### 3.3 Nouveaux Composants d'Interface
- Créer un composant pour afficher les effets temporels actifs
- Développer un indicateur de permissions déverrouillées
- Implémenter des notifications pour les nouveaux items reçus
- Créer des tooltips informatifs pour chaque type d'item

#### 3.X Mise à Jour de l'UI pour les Nouveaux Éléments Modifiés :
- Adapter les composants du profil utilisateur, du tableau de bord, et des sections pertinentes pour afficher les nouvelles données (crédits IA, cours débloqués, statut PRO avec date d'expiration).
- **Point important :** Ces composants devront maintenant effectuer des **lectures sur plusieurs collections distinctes** pour agréger les données du profil de l'utilisateur. Utiliser `Promise.all` pour paralléliser ces lectures côté serveur/client.
- Assurer que ces affichages se rafraîchissent correctement après la consommation d'un item.
- Développer des indicateurs visuels ou des notifications pour informer l'utilisateur de l'activation réussie de ces items.

### Phase 4 : Migration et Tests

#### 4.1 Migration des Données Existantes :
- Si des données de type crédits IA, cours débloqués ou statut PRO existent déjà dans le système, développer des scripts de migration pour les extraire et les populer dans leurs nouvelles collections dédiées.
- Valider l'intégrité des données après migration.

#### 4.2 Tests de Performance
- Mesurer les temps de réponse avant et après la refonte
- Tester avec différents volumes de données
- Valider la scalabilité du nouveau système
- Optimiser les requêtes de base de données si nécessaire

#### 4.3 Tests Fonctionnels :
- Tester la consommation de chaque type d'item à modification unique.
- Valider que les données sont correctement stockées dans les **nouvelles collections dédiées**.
- Vérifier que les modifications (crédits, accès PRO) sont correctement appliquées dans le reste de l'application via les nouvelles fonctions de lecture.
- Tester les cas d'usages multiples si `allowMultipleUses` est pertinent.

## Avantages de la Nouvelle Architecture

### Performance
- Ouverture de coffres quasi-instantanée (moins d'1 seconde)
- Réduction drastique du nombre de requêtes à la base de données
- Traitement parallélisé des opérations d'écriture
- Optimisation des lectures avec collecte de données en amont

### Traçabilité
- Identification unique de chaque coffre
- Contexte de création préservé (quête, événement, achat)
- Historique complet des possessions
- Possibilité de support et de débogage avancés

### Extensibilité
- Ajout facile de nouveaux types d'items
- Configuration centralisée des comportements
- Séparation claire des responsabilités
- Architecture modulaire et maintenable

### Maintenabilité
- Code plus simple et lisible
- Logique métier centralisée
- Réduction de la complexité cyclomatique
- Tests plus faciles à écrire et maintenir

## Risques et Mitigations

### Risque : Complexité de Migration
- **Mitigation** : Développer un script de migration robuste avec validation
- **Mitigation** : Tester la migration sur un environnement de staging
- **Mitigation** : Prévoir un rollback en cas de problème

### Risque : Performance de la Création de Coffres
- **Mitigation** : Optimiser la génération de butin avec des requêtes groupées
- **Mitigation** : Implémenter un système de cache pour les objets fréquents
- **Mitigation** : Utiliser des transactions de base de données optimisées

### Risque : Compatibilité avec l'Existant
- **Mitigation** : Maintenir une API compatible pendant la transition
- **Mitigation** : Développer des adaptateurs pour l'ancien système
- **Mitigation** : Planifier une période de transition progressive

## Métriques de Succès

### Performance
- Temps d'ouverture de coffres < 1 seconde (objectif : < 500ms)
- Réduction de 90% du nombre de requêtes à la base de données
- Amélioration de 95% du temps de réponse global

### Fonctionnalité
- 100% des types d'items supportés et fonctionnels
- Traçabilité complète de tous les coffres créés
- Gestion correcte de tous les effets temporels

### Qualité
- 0 régression fonctionnelle par rapport à l'existant
- Couverture de tests > 90%
- Documentation complète et à jour

## Planning de Développement

### Semaine 1-2 : Phase 1 - Modèle de Données
- Refonte des collections Payload CMS
- Mise à jour des types TypeScript
- Validation du modèle avec des tests unitaires

### Semaine 3-4 : Phase 2 - Logique Serveur
- Développement des fonctions de création et d'ouverture
- Implémentation de la gestion des consommables
- Tests d'intégration des nouvelles fonctions

### Semaine 5-6 : Phase 3 - Interface Utilisateur
- Mise à jour des composants existants
- Développement des nouveaux composants
- Tests d'interface utilisateur

### Semaine 7-8 : Phase 4 - Migration et Tests
- Script de migration des données
- Tests de performance et fonctionnels
- Déploiement en production

## Conclusion

Cette refonte du système d'items et de coffres représente une amélioration majeure de l'architecture de l'application. En adoptant un modèle à pré-stockage avec traçabilité individuelle, nous résolvons non seulement les problèmes de performance actuels, mais nous créons également une base solide pour les développements futurs.

L'architecture proposée est à la fois performante, extensible et maintenable, garantissant que le système pourra évoluer avec les besoins de l'application sans nécessiter de refontes majeures supplémentaires.

## Découpage du Plan de Développement en Livrables Indépendants et Testables

L'objectif est que chaque livrable puisse être développé, testé (avec des tests unitaires et d'intégration limités à son périmètre) et potentiellement mergé dans la branche principale sans bloquer d'autres développements majeurs.

#### Phase 1 : Modèle de Données (Les Fondations Immuables)

Cette phase se concentre sur les définitions des collections Payload CMS. Chaque modification de schéma est un livrable en soi.

*   **Livrable 1.1 : Mise à Jour du Schéma `Items.ts`**
    *   **Contenu :** Introduction du champ `activationMode` (`container`, `temporary_effect`, `instant_action`, `passive`, `one_time_modifier`) et des structures de configuration associées (`containerRules`, `effectDetails`, `passiveEffectDetails`, `modifierDetails`). Ajout des index stratégiques.
    *   **Tests :** Tests unitaires du schéma Payload pour valider la structure des champs et les types (ex: s'assurer que `containerRules` est présent si `activationMode` est `container`).
    *   **Dépendances :** Aucune. Peut être mergé en premier.

*   **Livrable 1.2 : Création de la Collection `UserInventory.ts`**
    *   **Contenu :** Définition complète de la collection `UserInventory.ts` pour les objets uniques (coffres), incluant le contenu pré-stocké (`preStockedItems`, `preStockedCurrency`), le statut et le contexte de création. Ajout des index stratégiques.
    *   **Tests :** Tests unitaires du schéma et tests d'intégration basiques pour vérifier la création et la lecture d'un document `UserInventory` vide.
    *   **Dépendances :** `Items.ts` (pour les relations).

*   **Livrable 1.3 : Mise à Jour/Création de la Collection `ActiveEffects.ts`**
    *   **Contenu :** Définition/mise à jour de `ActiveEffects.ts` pour gérer les boosts temporaires (XP, monnaie), avec `userId`, `effectType`, `value`, `activatedAt`, `expiresAt`. Ajout des index stratégiques.
    *   **Tests :** Tests unitaires du schéma et tests d'intégration basiques pour créer et lire un effet.
    *   **Dépendances :** Aucune (sauf `Users` implicite pour `userId`).

*   **Livrable 1.4 : Création des Collections Dédicacées (Modifications Uniques)**
    *   **Contenu :** Création des collections `UserAiCredits.ts`, `UserUnlockedCourses.ts`, `UserProAccess.ts` (ou une par une, comme des sous-livrables `1.4.1`, `1.4.2`...). Inclure les champs et l'indexation stratégique pour chaque.
    *   **Tests :** Tests unitaires des schémas et tests d'intégration basiques de CRUD pour chaque nouvelle collection.
    *   **Dépendances :** `Users` (implicite pour `userId`).

#### **Phase 2 : Logique Serveur (Par Comportement d'Item)**

Cette phase se découpe par la capacité du système à *gérer* un certain type d'item de bout en bout (sur le serveur).

*   **Livrable 2.1 : Fonction de Création de Coffres (`grantIndividualChest`)**
    *   **Contenu :** Implémentation de la logique de génération du butin en mémoire et la création d'une entrée unique dans `UserInventory.ts` avec le butin pré-stocké.
    *   **Tests :** Tests unitaires pour la logique de génération aléatoire. Tests d'intégration pour vérifier qu'un appel à `grantIndividualChest` crée bien un document correct dans `UserInventory.ts`.
    *   **Dépendances :** Livrables 1.1, 1.2.

*   **Livrable 2.2 : Dispatcher `consumeItem` (Routeur Central)**
    *   **Contenu :** Refactorisation de la fonction `consumeItem` pour qu'elle identifie l'`activationMode` de l'item et dispatche vers des fonctions gestionnaires spécifiques (qui peuvent être des stubs vides au début).
    *   **Tests :** Tests unitaires pour s'assurer que `consumeItem` décrémente correctement la quantité de l'item consommé et appelle la bonne fonction en fonction de l'`activationMode`.
    *   **Dépendances :** Livrable 1.1.

*   **Livrable 2.3 : Logique d'Ouverture de Coffre (`openIndividualChest`)**
    *   **Contenu :** Implémentation complète de `openIndividualChest` : lecture de l'instance du coffre (Livrable 1.2), mise à jour de son statut, et **distribution groupée (batch write)** des récompenses (vers `UserItems` et les collections de monnaie/XP).
    *   **Tests :** Tests d'intégration de bout en bout (côté serveur) : créer un coffre (via 2.1), l'ouvrir (via 2.3), vérifier que l'inventaire de l'utilisateur est mis à jour et que le statut du coffre change. Mesures de performance initiales sur cette fonction.
    *   **Dépendances :** Livrables 1.1, 1.2, 1.3 (pour XP/coins), 2.1, 2.2.

*   **Livrable 2.4 : Logique de Consommables Temporels (Boosts)**
    *   **Contenu :** Implémentation de la logique de "Plus Forte Valeur Prioritaire, Durée Cumulative" pour les items `temporary_effect`. Mettre à jour `ActiveEffects.ts` lors de la consommation. Implémenter la fonction d'application `getUserActiveEffects`.
    *   **Tests :** Tests unitaires pour la logique de cumul des boosts. Tests d'intégration : consommer des boosts, vérifier `ActiveEffects.ts`, vérifier l'impact sur les gains (ex: `addExperience`).
    *   **Dépendances :** Livrables 1.1, 1.3, 2.2.

*   **Livrable 2.5 : Logique de Consommables Instantanés (Actions Uniques)**
    *   **Contenu :** Implémentation de `applyOneTimeModifier` (le dispatcher générique) et d'au moins une fonction métier concrète (ex: `addAiCredits`) qui interagit avec sa collection dédiée (`UserAiCredits.ts` - Livrable 1.4).
    *   **Tests :** Tests unitaires de `applyOneTimeModifier`. Tests d'intégration : consommer l'item, vérifier le changement dans la collection dédiée.
    *   **Dépendances :** Livrables 1.1, 1.4 (pour les collections cibles), 2.2. Les autres actions (`UNLOCK_COURSE`, `GRANT_TEMPORARY_PRO`) peuvent être des sous-livrables ultérieurs.

*   **Livrable 2.6 : Logique d'Items Passifs Permanents**
    *   **Contenu :** Implémentation de la logique d'acquisition unique pour les items `passive`. Mettre à jour `UserInformations.entitlements`. Implémenter la fonction d'application `getUserPermanentEffects`.
    *   **Tests :** Tests unitaires pour l'unicité. Tests d'intégration : obtenir l'item, vérifier le profil utilisateur, vérifier l'impact sur les gains.
    *   **Dépendances :** Livrable 1.1, 1.4 (si `entitlements` est géré dans `UserInformations`).

*   **Livrable 2.7 : Optimisations Serveur (Cache et Jobs de Fond)**
    *   **Contenu :** Implémentation des mécanismes de cache pour `getUserActiveEffects` et `getUserPermanentEffects`. Mise en place du cron job de nettoyage pour `ActiveEffects.ts`.
    *   **Tests :** Tests de performance et tests fonctionnels pour s'assurer que le cache ne dégrade pas la consistance des données. Tests du job de nettoyage.
    *   **Dépendances :** Livrables 2.4, 2.6.

#### **Phase 3 : Interface Utilisateur (Consommation des APIs Serveur)**

Cette phase peut démarrer dès que les APIs serveur correspondantes sont stabilisées.

*   **Livrable 3.1 : Mise à Jour Visuelle de l'Inventaire (`InventorySheet`)**
    *   **Contenu :** Adapter l'affichage de `InventorySheet.tsx` pour tous les nouveaux types d'items. Afficher les informations pertinentes (durée pour temporaires, etc.). Les boutons de consommation peuvent encore être des placeholders non fonctionnels.
    *   **Tests :** Tests visuels et d'intégration basiques pour s'assurer que l'UI affiche correctement les données reçues de l'API `getUserInventory`.
    *   **Dépendances :** APIs serveur de lecture d'inventaire stabilisées.

*   **Livrable 3.2 : Refonte du Dialogue d'Ouverture de Coffre (`ChestOpeningDialog`)**
    *   **Contenu :** Adapter `ChestOpeningDialog.tsx` pour qu'il consomme directement les données de butin pré-stocké fournies par l'API `openIndividualChest`.
    *   **Tests :** Tests fonctionnels de l'UI pour l'animation et l'affichage des récompenses.
    *   **Dépendances :** Livrable 2.3.

*   **Livrable 3.3 : Interactions de Consommation dans l'Inventaire (Connecter l'UI au Backend)**
    *   **Contenu :** Connecter les boutons "Consommer" dans `InventorySheet.tsx` aux APIs serveur appropriées (`consumeItem`). Gérer les états de chargement et les retours d'erreurs/succès avec des toasts.
    *   **Tests :** Tests d'intégration complets de l'UI au backend : cliquer, voir la consommation, voir la mise à jour de l'inventaire.
    *   **Dépendances :** Livrables 2.3, 2.4, 2.5, 2.6.

*   **Livrable 3.4 : Affichage des Effets Actifs et Capacités Permanentes**
    *   **Contenu :** Créer des composants UI dédiés pour afficher les boosts temporaires actifs (ex: une barre en haut) et les capacités passives/déverrouillées (ex: une section dans le profil).
    *   **Tests :** Tests d'intégration UI-backend pour l'affichage correct des données.
    *   **Dépendances :** Livrables 2.4, 2.6.

#### **Phase 4 : Migration et Tests Complets (Validation Finale)**

*   **Livrable 4.1 : Script de Migration des Données**
    *   **Contenu :** Développer le script pour convertir les anciens formats de données (si existants) vers les nouveaux schémas (`UserInventory`, `UserAiCredits`, etc.).
    *   **Tests :** Exécution du script sur une base de données de staging, puis validation complète de l'intégrité et de la cohérence des données migrées.
    *   **Dépendances :** Tous les schémas de la Phase 1 sont stables.

*   **Livrable 4.2 : Suite de Tests de Performance**
    *   **Contenu :** Écrire des tests de charge et de performance pour les scénarios clés : ouverture de coffres, consommation de boosts, application de gains.
    *   **Tests :** Exécuter ces tests et analyser les résultats par rapport aux métriques de succès définies.
    *   **Dépendances :** Toutes les APIs serveur sont fonctionnelles.

*   **Livrable 4.3 : Suite de Tests Fonctionnels End-to-End (E2E)**
    *   **Contenu :** Développer des tests automatisés couvrant tous les parcours utilisateur importants liés aux items.
    *   **Tests :** Exécution complète de la suite E2E pour valider le système dans son ensemble.
    *   **Dépendances :** Toutes les fonctionnalités des Phases 1, 2, 3 sont implémentées.
