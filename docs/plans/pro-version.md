# Plan de développement : Système PRO avec Polar

## Objectif
Implémenter un système d'abonnement PRO complet utilisant Polar pour la gestion des paiements, avec attribution automatique des rôles utilisateur et limitation des quotas Pearl AI basée sur le niveau d'abonnement.

## Architecture de liaison utilisateur-customer

### 1. Mapping utilisateur Polar vers utilisateur local
**Objectif**: Associer un customer Polar à un utilisateur local via external_id

**Configuration requise**:
- Utiliser le champ `external_id` de Polar pour stocker l'ID utilisateur local
- Format: `user_{userId}` (ex: `user_123`)
- Stocker le `customerId` Polar dans `UserInformations.customerId`

**Flux de liaison**:
1. Lors du checkout, inclure `customer_metadata` avec l'ID utilisateur local
2. Polar crée le customer avec `external_id = user_{userId}`
3. Stocker le `customer_id` retourné dans `UserInformations.customerId`

## Gestion des rôles et permissions basée sur l'abonnement

### 2. Types d'abonnements
**Abonnements avec rôle** (affectent le rôle global):
- **Basic Plan** (gratuit) → rôle `basic`
- **Lite Membership** → rôle `lite`
- **Pro Membership** → rôle `pro`
- **Max Membership** → rôle `max`

**Abonnements avec permission spécifique** (ajoutent des capacités sans changer le rôle):
- **Pearl Access** → permission `pearl_access` (accès à Pearl AI uniquement)
- Peut être combiné avec n'importe quel rôle
- Ne modifie pas le rôle principal de l'utilisateur

### 3. Flux de mise à jour des rôles
**Création d'abonnement**:
- Webhook: `subscription.active`
- Action: Mettre à jour `UserInformations.role` selon le produit
- Logique: Mapper le nom du produit Polar vers le rôle correspondant

**Modification d'abonnement**:
- Webhook: `subscription.updated`
- Action: Ajuster le rôle selon le nouveau plan
- Gestion des upgrades/downgrades automatiques

**Annulation d'abonnement**:
- Webhooks: `subscription.cancelled`, `subscription.expired`
- Action: Revenir systématiquement au rôle `basic`

## Intégration avec Pearl AI et quotas

### 4. Nouvelle logique de quotas Pearl
**Règles de quotas par rôle**:
```typescript
const QUOTAS_BY_ROLE = {
  basic: 10,    // 10 messages/mois
  lite: 100,    // 100 messages/mois
  pro: 1000,    // 1000 messages/mois
  max: Infinity // Illimité
};
```

**Modification de src/core/ai/quotas/credits.ts**:
- Créer `getQuotaByRole(role: UserRole): number`
- Modifier `getRemainingCredits` pour prioriser le quota rôle
- Ajouter table `user-ai-quotas` pour quotas personnalisés

### 5. Système de quotas flexible
**Priorité des quotas**:
1. Quota personnalisé (si défini dans `user-ai-quotas`)
2. Quota basé sur le rôle
3. Quota par défaut (0)

**Structure de données**:
```typescript
interface UserAIQuota {
  userId: string;
  customQuota?: number;
  resetDate: Date;
}
```

## Webhooks Polar à implémenter

### 6. Événements webhook requis
```typescript
// src/app/api/webhook/polar/route.ts
const WEBHOOK_EVENTS = {
  'subscription.active': handleSubscriptionCreated,
  'subscription.updated': handleSubscriptionUpdated,
  'subscription.cancelled': handleSubscriptionCancelled,
  'subscription.expired': handleSubscriptionExpired,
  'customer.created': handleCustomerCreated,
  'invoice.payment_failed': handlePaymentFailed
};
```

### 7. Handlers détaillés
**handleSubscriptionCreated**:
- Récupérer l'utilisateur par email
- Mapper le produit vers le rôle
- Mettre à jour `UserInformations.role`
- Associer le customer_id

**handleSubscriptionUpdated**:
- Vérifier le changement de produit
- Mettre à jour le rôle si nécessaire
- Gérer les proratas si besoin

**handleSubscriptionCancelled/Expired**:
- Réinitialiser le rôle à `basic`
- Conserver l'historique des abonnements
- Nettoyer les quotas personnalisés si nécessaire

## Sécurité et validation

### 8. Validation des webhooks
- Vérifier la signature des webhooks Polar
- Valider que l'email du customer correspond à l'utilisateur local
- Empêcher les modifications non autorisées de rôles

### 9. Protection contre les abus
- Rate limiting sur les webhooks
- Validation des changements de rôle
- Log détaillé de toutes les modifications
- Audit trail pour les changements d'abonnement
- Sécuriser les codes de réduction contre l'abus
- Limiter un code de réduction par utilisateur

## Configuration Polar

### 10. Produits à configurer
**Pro Membership**:
- Product name: "Pro Membership"
- Price: À définir (mensuel/annuel)
- Metadata: `{ role: 'pro' }`

**Max Membership**:
- Product name: "Max Membership"
- Price: À définir (mensuel/annuel)
- Metadata: `{ role: 'max' }`

**Lite Membership**:
- Product name: "Lite Membership"
- Price: À définir (mensuel/annuel)
- Metadata: `{ role: 'lite' }`

**Pearl Access**:
- Product name: "Pearl Access"
- Price: À définir (mensuel/annuel)
- Metadata: `{ permission: 'pearl_access' }`

### 10.1 Système de réductions
**Réduction automatique pour niveau 3**:
- **Condition**: Utilisateur atteint le niveau 3
- **Offre**: 70% de réduction sur l'abonnement Lite
- **Durée**: Temporaire (ex: 30 jours)
- **Mécanisme**:
  1. Détecter l'atteinte du niveau 3 via le système de progression
  2. Créer un discount code via l'API Polar (`POST /api/v1/discounts`)
  3. Envoyer l'email avec le code promo à l'utilisateur
  4. L'utilisateur applique le code lors du checkout
  5. Le discount expire automatiquement après la période définie

**Configuration discount Polar**:
- Type: `percentage`
- Value: `70`
- Duration: `once` (s'applique une fois)
- Product limitation: Lite Membership uniquement
- Code unique par utilisateur

### 11. Configuration checkout
```typescript
// Configuration du checkout avec external_id
{
  customer_email: user.email,
  customer_metadata: {
    external_id: `user_${user.id}`,
    user_id: user.id
  },
  success_url: `${BASE_URL}/confirmation`,
  cancel_url: `${BASE_URL}/pricing`
}
```

## API et Server Actions

### 13. Package Client - API et fonctions
**Fonctions principales**:

**Roles**:
- `getUserRole(userId)`: Retourne le rôle actuel
- `hasRole(userId, role)`: Vérifie si l'utilisateur a un rôle spécifique
- `isPro(userId)`: Vérifie si l'utilisateur est pro ou plus
- `isMax(userId)`: Vérifie si l'utilisateur est max
- `updateUserRole(userId, newRole)`: Met à jour le rôle

**Permissions**:
- `hasPearlAccess(userId)`: Vérifie l'accès à Pearl
- `hasPermission(userId, permission)`: Vérifie une permission spécifique
- `addPermission(userId, permission)`: Ajoute une permission
- `removePermission(userId, permission)`: Retire une permission

**Subscriptions**:
- `getUserSubscriptionStatus(userId)`: Statut complet de l'abonnement
- `isSubscriptionActive(userId)`: Vérifie si l'abonnement est actif
- `getSubscriptionEndDate(userId)`: Date d'expiration

**AI Quotas**:
- `getUserAIQuota(userId)`: Quota Pearl complet
- `canUsePearl(userId)`: Vérifie si l'utilisateur peut utiliser Pearl
- `incrementPearlUsage(userId)`: Incrémente l'utilisation

**Discounts**:
- `createDiscountForLevel3(userId)`: Crée code réduction niveau 3
- `applyDiscountCode(userId, discountCode)`: Applique réduction
- `validateDiscountCode(code)`: Valide un code

### 14. API Backend mise à jour
**Endpoints**:
- `GET /api/client/role/:userId` - Obtenir rôle
- `POST /api/client/role` - Mettre à jour rôle
- `GET /api/client/permissions/:userId` - Obtenir permissions
- `POST /api/client/permissions` - Modifier permissions
- `GET /api/client/subscription/:userId` - Statut abonnement
- `GET /api/client/quota/:userId` - Quota Pearl
- `POST /api/client/quota/increment` - Incrémenter utilisation

### 13. Customer Portal
**Configuration**:
- Lien vers le customer portal Polar
- Gestion des abonnements côté Polar
- Synchronisation automatique via webhooks

## Tests et validation

### 14. Scénarios de test
**Tests du package client**:
- **Test 0: Package Client**
  1. Tester toutes les fonctions du package client isolément
  2. Vérifier le cache local et la synchronisation
  3. Tester les validations de rôles et permissions
  4. Tester la cohérence avec les données Polar

**Tests fonctionnels**:
- **Test 1: Création d'abonnement**
  1. User clique sur "Pro Membership"
  2. Checkout réussi
  3. Webhook reçu
  4. Package client met à jour le rôle à 'pro'
  5. Quota Pearl mis à jour via package client

**Test 2: Upgrade d'abonnement**
1. User passe de Lite à Pro
2. Webhook subscription.updated reçu
3. Package client change le rôle de 'lite' à 'pro'
4. Cache du package client mis à jour
5. Quota augmenté via package client

**Test 3: Annulation d'abonnement**
1. User annule abonnement
2. Webhook subscription.cancelled reçu
3. Package client réinitialise le rôle à 'basic'
4. Cache invalidé et quota réinitialisé

**Test 4: Limite Pearl AI**
1. User avec rôle 'lite' atteint 100 messages
2. Package client bloque via `canUsePearl()`
3. Système bloque les nouveaux messages
4. Message explicite via package client

**Test 5: Permissions Pearl Access**
1. User achète Pearl Access uniquement
2. Package client ajoute la permission
3. `hasPearlAccess()` retourne true sans changer le rôle
4. Quota Pearl activé selon rôle principal + permission

### 15. Monitoring et alerting
- Monitoring des webhooks échoués
- Alertes sur les changements de rôle non planifiés
- Dashboard de suivi des abonnements
- Logs détaillés pour le support client

## Structure des fichiers

### Package Client pour gestion des rôles et permissions
```
src/core/client/
├── index.ts              # Export principal
├── types.ts              # Types TypeScript
├── roles/
│   ├── index.ts          # Fonctions de rôle
│   ├── validators.ts     # Validation des rôles
│   └── mutations.ts      # Mise à jour des rôles
├── permissions/
│   ├── index.ts          # Fonctions de permission
│   ├── pearl.ts          # Accès Pearl spécifique
│   └── validators.ts     # Validation des permissions
├── subscriptions/
│   ├── index.ts          # État des abonnements
│   └── status.ts         # Vérification du statut
└── utils/
    ├── cache.ts          # Cache local
    └── helpers.ts        # Utilitaires
```

### Structure backend
```
src/core/payments/
├── polar/
│   ├── webhooks/
│   │   ├── handlers.ts
│   │   └── validation.ts
│   └── config.ts

src/core/ai/quotas/
├── credits.ts (modifié)
├── quotas-by-role.ts (nouveau)
└── user-quotas.ts (nouveau)

src/app/api/webhook/polar/
└── route.ts (complet)

src/app/api/discounts/
├── level3/route.ts (nouveau)
└── apply/route.ts (nouveau)

src/app/api/permissions/
└── check/route.ts (nouveau)

src/actions/
├── subscriptions.ts (nouveau)
├── user-role.ts (nouveau)
└── user-permissions.ts (nouveau)

src/lib/polar/
└── discounts.ts (nouveau)

src/core/user/
└── progression/level3-trigger.ts (nouveau)

src/lib/email/
└── discount-codes.ts (nouveau)
```

## Séquence d'implémentation

### Phase 1: Configuration Polar
1. Créer les produits dans Polar
2. Configurer les webhooks
3. Tester les webhooks en sandbox

### Phase 2: Package Client
1. Créer la structure `src/core/client/`
2. Implémenter les fonctions de rôles et permissions
3. Créer le système de cache local
4. Tests unitaires du package client

### Phase 3: Backend
1. Implémenter tous les handlers webhook
2. Créer les API endpoints pour le package client
3. Modifier la logique de quotas Pearl
4. Tests unitaires backend

### Phase 4: Frontend
1. Intégrer le package client dans le frontend
2. Activer les boutons de pricing
3. Intégrer le customer portal
4. Afficher les limites Pearl AI
5. Messages d'upgrade

### Phase 5: Tests et déploiement
1. Tests d'intégration complets (package client inclus)
2. Tests en production limitée
3. Monitoring et ajustements
4. Documentation utilisateur et développeurs

## Points de décision

### Questions à valider
1. **Prix des abonnements**: Montants pour chaque niveau
2. **Période d'essai**: Offrir des essais gratuits?
3. **Proratas**: Gérer les remboursements proratisés?
4. **Emails**: Templates d'emails pour les changements d'abonnement
5. **Support**: Processus de support pour les problèmes de facturation

### Configuration technique
- **Environment**: Sandbox vs Production
- **Webhook URL**: URL de production pour les webhooks
- **Retry policy**: Stratégie de retry pour les webhooks échoués
- **Rate limiting**: Limites sur les API endpoints

Ce plan couvre l'intégration complète de Polar avec gestion des rôles et quotas Pearl AI, prêt pour implémentation progressive.