# PRD: Système de Profil Utilisateur v2

## 1. Introduction et Objectifs

Ce document décrit les exigences pour la nouvelle version de la page de profil utilisateur. L'objectif principal est de moderniser le design, d'améliorer la présentation des informations et d'accroître l'interactivité.

**Objectifs Clés :**

*   Remplacer le layout actuel à deux colonnes par un **design vertical à une seule colonne**.
*   Introduire de nouveaux composants modulaires pour une meilleure organisation et réutilisabilité.
*   Afficher de manière exhaustive les informations de l'utilisateur, ses progrès, ses accomplissements et son statut social/communautaire.
*   Améliorer les interactions possibles avec le profil d'un autre utilisateur (suivi, messagerie, options).
*   Permettre une personnalisation accrue du profil par l'utilisateur (bannière, description, liens).

## 2. Layout Général

*   **Structure :** Simple colonne verticale. Le contenu s'étend sur la largeur disponible, avec un `max-width` défini pour la lisibilité sur les grands écrans (similaire au layout actuel `max-w-[1400px] mx-auto`).
*   **Responsive :** Le design doit s'adapter aux différentes tailles d'écran.

## 3. Composants et Fonctionnalités (Ordre Vertical)

### 3.1. Bannière Utilisateur (`UserProfileBanner`)

*   **Description :** Une image de couverture affichée tout en haut du profil.
*   **Fonctionnalité :** L'utilisateur doit pouvoir téléverser et modifier sa propre bannière (fonctionnalité d'édition à prévoir sur `/profile/me`).

### 3.2. Informations Principales

Cette section regroupe les informations d'identification et les actions immédiates.

*   **Photo de Profil (`UserProfilePicture`)**
    *   **Description :** Affiche l'avatar de l'utilisateur.
    *   **Positionnement :** Peut être superposée légèrement sur le bas de la bannière ou placée juste en dessous.
    *   **Fonctionnalité d'édition :** L'utilisateur doit pouvoir changer son avatar.
*   **Nom d'Utilisateur (`UserProfileName`)**
    *   **Description :** Affiche le nom complet ou pseudo de l'utilisateur.
    *   **Badge de Rôle :** Un badge/tag est affiché à côté du nom pour les rôles `lite`, `pro`, `max`, `admin`. Aucun badge n'est affiché pour le rôle `basic`.
*   **Biographie Courte (`UserProfileBio`)**
    *   **Description :** Affiche la tagline ou biographie courte de l'utilisateur.
*   **Niveau et Expérience (`UserLevelXP`)**
    *   **Description :** Affiche le niveau actuel de l'utilisateur et une barre de progression indiquant l'XP accumulée pour le niveau en cours et l'XP requise pour le prochain niveau.
*   **Localisation (`UserLocation`)**
    *   **Description :** Affiche la localisation renseignée par l'utilisateur (champ texte libre).
*   **Liens Externes (`UserExternalLinks`)**
    *   **Description :** Affiche une série d'icônes cliquables renvoyant vers les profils sociaux ou sites web de l'utilisateur (GitHub, LinkedIn, Site perso, etc.).
*   **Email (`UserEmail`)**
    *   **Description :** Affiche l'adresse email de l'utilisateur.
    *   **Visibilité :** Visible par **tous les visiteurs** (connectés ou non). Une note de confidentialité claire doit être affichée lors de la saisie/modification par l'utilisateur.
*   **Boutons d'Action**
    *   **Statut de Suivi (`FollowingStatusButton`)**
        *   **Description :** Bouton **autonome** affichant conditionnellement `<FollowButton />` ou `<UnfollowButton />`.
        *   **États :** Gère un état de chargement initial avec `<FollowingStatusSkeleton />`.
        *   **Logique :** Récupère l'état de suivi et effectue les appels API pour suivre/ne plus suivre.
        *   **Affichage :** Non affiché sur le profil de l'utilisateur connecté (`/profile/me`).
    *   **Envoyer un Message (`MessageUserButton`)**
        *   **Description :** Bouton pour initier une conversation avec l'utilisateur.
        *   **Propriétés :** Prend le `userSlug` en paramètre.
        *   **Action :** L'implémentation détaillée de l'action (redirection, modale) est reportée.
        *   **Affichage :** Non affiché sur le profil de l'utilisateur connecté (`/profile/me`).
    *   **Menu d'Options (`UserOptionsMenu`)**
        *   **Description :** Un bouton (icône "trois points") ouvrant un menu déroulant.
        *   **Options :**
            *   Signaler l'utilisateur
            *   Bloquer l'utilisateur
            *   Copier le lien du profil
        *   **Affichage :** Non affiché sur le profil de l'utilisateur connecté (`/profile/me`).

### 3.3. Description Avancée ("À Propos") (`UserAboutSection`)

*   **Description :** Une section dédiée affichant une description plus longue et détaillée renseignée par l'utilisateur. Format texte riche (Markdown ou similaire) pourrait être envisagé.

### 3.4. Statut de Gamification

*   **Carte Division (`ProfileDivisionCard`)**
    *   **Description :** Affiche la division actuelle de l'utilisateur et potentiellement son classement ou statut au sein de la division.
    *   **Layout :** Adapté pour occuper la pleine largeur disponible.
*   **Carte Guilde (`ProfileGuildCard`)**
    *   **Description :** Affiche la guilde à laquelle l'utilisateur appartient, avec potentiellement un lien vers la page de la guilde.
    *   **Layout :** Adapté pour occuper la pleine largeur disponible.

### 3.5. Compétences (`ProfileSkillsCard`)

*   **Description :** Affiche les compétences de l'utilisateur.
*   **Layout :** Adapté pour occuper la pleine largeur disponible. La présentation exacte (liste, tags, etc.) peut être revue.

### 3.6. Activité et Accomplissements

*   **Section Cours (`CoursesSection`)**
    *   **Contenu :** Affiche un aperçu des 3 à 5 cours les plus récents (terminés ou en cours d'activité).
    *   **Carte Cours :** Chaque carte doit montrer : Miniature/Icône, Titre, Statut (Terminé + date/coche OU Barre de progression + %).
    *   **Lien "Voir Tout" :** Un lien clair ("Voir tous les cours") menant vers une page dédiée (`/profile/[user_slug]/courses`) listant tous les cours avec filtres/tri potentiels.
*   **Section Succès (`AchievementsSection`)**
    *   **Contenu :** Affiche un aperçu des succès les plus récents ou les plus significatifs.
    *   **Lien "Voir Tout" :** Un lien clair ("Voir tous les succès") menant vers une page dédiée (`/profile/[user_slug]/achievements`) ou une vue étendue.

## 4. Données Requises

Le backend (via `getUserProfileBySlug`, `getUserProfile` et potentiellement de nouvelles fonctions) doit fournir :

*   ID Utilisateur, Slug, Nom, Email, Rôle (`basic`, `lite`, `pro`, `max`, `admin`).
*   URLs Avatar et Bannière.
*   Bio courte et Description longue.
*   Niveau actuel, XP actuelle, XP requise pour le prochain niveau.
*   Localisation (texte).
*   Liste des liens externes (type/label + URL).
*   Informations de Division (nom, icône, etc.).
*   Informations de Guilde (nom, ID/slug, etc.).
*   Liste des Compétences.
*   Liste des Cours (ID, titre, miniature, statut, progression, date de complétion/dernière activité).
*   Liste des Succès (ID, nom, icône, date d'obtention).
*   Pour les profils autres que le sien : état de suivi (`isFollowing`).

Des actions serveur sont nécessaires pour : Suivre, Ne plus suivre, Signaler, Bloquer.

## 5. Points Ouverts / Prochaines Étapes

*   Définir l'action exacte du `MessageUserButton`.
*   Concevoir et implémenter l'interface d'édition du profil pour l'utilisateur connecté (`/profile/me`).
*   Détailler le design et le style spécifiques de chaque composant.
*   Concevoir les pages dédiées "Tous les Cours" et "Tous les Succès".
*   Considérer l'ajout de statistiques (followers/following) si pertinent.
*   Réévaluer la politique de visibilité de l'email si des préoccupations de confidentialité émergent.
*   Implémenter la logique de signalement et de blocage.
