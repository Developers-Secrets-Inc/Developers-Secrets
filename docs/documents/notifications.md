# Refonte du système de notifications

## Objectif
Mettre à jour le système de notifications pour qu'il soit fiable, sécurisé, scalable et maintenable, en s'appuyant sur un pattern React Context Provider côté client et des server functions robustes côté backend.

---

## 1. Constats sur l'existant
- Les notifications sont actuellement récupérées via React Query en polling, sans temps réel.
- L'historique affiche les notifications lues de tous les utilisateurs (bug de sécurité/UX).
- Pas de centralisation de la logique côté client (pas de Provider).

---

## 2. Choix techniques
- **Pas de SSE/WebSocket** : Non adapté à des millions d'utilisateurs sans infra spécialisée.
- **Pattern recommandé** : NotificationProvider (React Context) + React Query/SWR pour le polling intelligent.
- **Backend** : Server functions sécurisées, filtrage strict par userId.

---

## 3. Roadmap d'implémentation

### A. Backend (server functions)
- [ ] Corriger `getReadNotifications` pour filtrer par `userId` (historique paginé par utilisateur).
- [ ] Sécuriser `setIsRead` et `setAllNotificationsAsRead` pour ne modifier que les notifications de l'utilisateur courant.
- [ ] (Optionnel) Ajouter pagination/filtrage à `getNotifications` si besoin.
- [ ] Garder la création de notification côté serveur (`createNotification`).

### B. Frontend (NotificationProvider)
- [ ] Créer un `NotificationProvider` (React Context) qui expose :
    - notifications (liste)
    - unreadCount (badge)
    - isLoading, isError
    - markAsRead(notificationId)
    - markAllAsRead()
    - refetch()
- [ ] Utiliser React Query/SWR pour le polling (intervalle, focus, navigation).
- [ ] Rafraîchir la liste après chaque mutation (marquage comme lu, etc.).
- [ ] Remplacer les usages directs de `useNotifications` par le hook du Provider.

### C. Sécurité & UX
- [ ] Vérifier que toutes les requêtes côté backend sont bien filtrées par `userId` (jamais de fuite inter-utilisateur).
- [ ] Améliorer l'UX : badge, historique, pagination, feedback utilisateur.

---

## 4. Points discutés
- SSE/WebSocket non retenus pour des raisons de scalabilité.
- Pas de suppression de notifications ni de notifications de groupe.
- Centralisation de la logique côté client via Provider.
- Rafraîchissement automatique ou manuel selon les besoins.

---

## 5. À valider
- Besoin de pagination/filtrage avancé ?
- Rafraîchissement sur quels événements (focus, navigation, intervalle) ?
- Signature/type précis des server functions.

---

**Document rédigé suite à la discussion IA – à compléter au fil de l'implémentation.**
