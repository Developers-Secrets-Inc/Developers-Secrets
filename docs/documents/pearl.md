# Pearl - Assistant Éducatif pour Développeurs

## 🎯 Objectif
Créer un assistant IA spécialisé dans l'éducation informatique, capable d'expliquer des concepts techniques et de générer des défis personnalisés pour les développeurs de tous niveaux.

## 🎯 Public Cible
- Développeurs de tous niveaux (débutant à expert)
- Apprenants en programmation
- Professionnels cherchant à approfondir leurs compétences

## ✨ Fonctionnalités Clés

### 1. Assistant Pédagogique
- Explications claires et adaptées au niveau de l'utilisateur
- Support de multiples langages de programmation
- Exemples de code commentés
- Références aux bonnes pratiques et design patterns

### 2. Générateur de Défis
- Création de défis personnalisés en fonction du niveau et des compétences visées
- Variété de formats (algorithmes, débogage, architecture, etc.)
- Difficulté progressive
- Thèmes adaptés aux intérêts de l'utilisateur

### 3. Intégration du Système de Compétences
- Suivi de la progression des compétences
- Récompenses et badges pour les défis complétés
- Recommandations personnalisées basées sur les compétences acquises
- Tableau de bord de progression

## 🔒 Modèle d'Accès et Abonnements

### Niveaux d'Accès

1. **Visiteur Non Connecté**
   - Accès limité aux fonctionnalités de base
   - Pas d'historique des conversations
   - Nombre limité de requêtes quotidiennes
   - Accès aux défis d'introduction uniquement

2. **Utilisateur Connecté (Free Tier)**
   - Historique des conversations illimité
   - Crédits quotidiens limités
   - Accès aux défis de base
   - Suivi de progression basique

3. **Abonnement Payant**
   - Historique illimité
   - Crédits mensuels selon la formule
   - Accès aux défis avancés et exclusifs
   - Statistiques détaillées
   - Support prioritaire

### Gestion des Crédits
- Système de crédits pour les requêtes IA
- Recharge automatique mensuelle pour les abonnés
- Achat de crédits supplémentaires possible
- Notification lorsque le seuil bas est atteint

## 🔧 Architecture Technique (À Détailler)

### Backend
- API REST/GraphQL sur la route `/pearl`
- Système d'authentification JWT
- Gestion des quotas et limitations
- Système de suivi des compétences existant
- Base de données pour stocker :
  - Défis et solutions
  - Historique des conversations
  - Profils utilisateurs et abonnements
  - Suivi des crédits

### Frontend
- Interface utilisateur réactive
- Éditeur de code intégré
- Visualisation des compétences
- Tableau de bord de progression

## 📅 Prochaines Étapes
1. [ ] Définir la stack technique précise
2. [ ] Modéliser la structure de données pour les défis
3. [ ] Concevoir l'API d'interaction avec l'IA
4. [ ] Développer le générateur de défis
5. [ ] Intégrer le système de compétences existant
6. [ ] Créer l'interface utilisateur
7. [ ] Mise en place des tests
8. [ ] Déploiement et collecte de feedback

## ❓ Questions en Suspens
- Quels sont les langages de programmation à prioriser ?
- Faut-il intégrer des environnements d'exécution de code ?
- Comment gérer la validation automatisée des défis ?
- Quelles métriques suivre pour évaluer l'efficacité pédagogique ?

---
*Document créé le 06/06/2025 - À mettre à jour régulièrement*