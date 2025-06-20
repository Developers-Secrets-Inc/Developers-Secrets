### Plan de Refactoring du Système de Soumission

**Objectif Principal :** Améliorer la robustesse, la maintenabilité et la sécurité des types du système de soumission des défis.

---

#### **1. Centraliser les Types et Interfaces de Soumission**

*   **État Actuel :** Les types liés aux soumissions sont dispersés entre `index.client.ts`, `actions.ts` (pour les données Payload) et `use-submissions.ts` (pour les données React Query), ce qui entraîne des incohérences potentielles et de la redondance.
*   **Changement Proposé :** Créer un nouveau fichier `src/core/challenges/submissions/types.ts` pour regrouper toutes les interfaces et types TypeScript fondamentaux liés aux soumissions.
    *   Définir une interface de base `ISubmission`.
    *   Définir des interfaces spécifiques pour chaque type de soumission (`IAcceptedSubmission`, `IRunTimeErrorSubmission`, `IWrongAnswerSubmission`, `ITimeLimitExceededSubmission`) étendant `ISubmission`.
    *   Définir `IPayloadSubmissionData` pour la collection Payload CMS, en s'assurant qu'elle peut accueillir tous les types de soumission spécifiques.
    *   Définir `IClientSubmission` pour le hook React Query, qui pourrait être une version simplifiée de `IPayloadSubmissionData`.
*   **Impact :** Amélioration de la cohérence des types, réduction de la redondance et maintenance facilitée des structures de données de soumission à travers l'application.

---

#### **2. Améliorer la Gestion des Erreurs et la Sécurité des Types dans `use-submissions.ts`**

*   **État Actuel :** Le callback `onSuccess` dans le hook `useSubmissions` présente des erreurs TypeScript (`'serverSubmission' is possibly 'undefined'`) car le type de retour de `handleSubmission` ne garantit pas explicitement la présence de `data` en cas de succès.
*   **Changement Proposé :**
    *   Affiner le type de retour de `handleSubmission` (dans `client-actions.ts` et `actions.ts`) pour définir explicitement la forme des réponses de succès et d'erreur. Utiliser une union discriminée ou un modèle de type `Result` (similaire à `src/core/user/result.ts`) pour indiquer clairement quand `data` est présent.
    *   Mettre à jour le callback `onSuccess` dans `use-submissions.ts` pour accéder en toute sécurité aux propriétés de `serverSubmission`, potentiellement en vérifiant `result.success` ou en affinant le type.
    *   S'assurer que `addSubmission.mutationFn` lève correctement une erreur si `result.success` est faux.
*   **Impact :** Élimine les erreurs TypeScript, rend la gestion des erreurs plus explicite et améliore la fiabilité des mises à jour optimistes.

---

#### **3. Rationaliser la Logique de `submitCode` dans `index.client.ts`**

*   **État Actuel :** La fonction `submitCode` est monolithique, gérant la compilation du code, l'exécution des tests et la détermination du type de soumission final.
*   **Changement Proposé :** Refactoriser `submitCode` en fonctions plus petites et plus ciblées pour améliorer la modularité, la lisibilité et la testabilité :
    *   **Introduire un Type `TestResultErrorDetails` :** Créer un nouveau type pour encapsuler les détails d'un test échoué, incluant `input`, `expectedOutput`, `actualOutput` (optionnel), `error` (optionnel) et `type` (`runtimeError`, `wrongAnswer`, `timeLimitExceeded`). Cela fournira une manière structurée de retourner les informations d'erreur.
    *   **Créer une Fonction Utilitaire `runAllTests` :** Extraire la boucle principale d'exécution des tests dans une nouvelle fonction asynchrone, par exemple `runAllTests(code: CodeSubmission, tests: Test[]): Promise<{ passed: number; failedTest?: TestResultErrorDetails }>`. Cette fonction sera responsable de l'exécution séquentielle de tous les tests, de la gestion des erreurs de compilation, des sorties incorrectes et des dépassements de temps. Elle renverra le nombre de tests réussis et, si un test échoue, les `TestResultErrorDetails` de cet échec.
    *   **Simplifier `submitCode` :** La fonction `submitCode` deviendra alors beaucoup plus simple. Elle appellera `runAllTests` et, en fonction de son résultat (tous les tests réussis ou un test spécifique échoué), elle construira et retournera le type de soumission approprié (`AcceptedSubmission`, `WrongAnswerSubmission`, `RunTimeErrorSubmission` ou `TimeLimitExceededSubmission`).
*   **Impact :** Améliore la lisibilité, la modularité et la testabilité de la logique de soumission principale en séparant clairement les préoccupations.

---

#### **4. Revoir `client-actions.ts` pour Simplification**

*   **État Actuel :** `client-actions.ts` agit comme un mince wrapper autour de l'action serveur `handleSubmission`, principalement pour la journalisation des erreurs côté client.
*   **Changement Proposé :** Conserver la structure actuelle pour l'instant, car elle offre une séparation claire et un point unique pour l'interception des erreurs côté client. S'assurer que la journalisation des erreurs est complète. Revoir cette décision si les appels directs aux actions serveur deviennent un modèle plus courant ou si le wrapper n'ajoute pas de valeur significative.
*   **Impact :** Maintient la séparation claire actuelle tout en reconnaissant une simplification potentielle future.

---

#### **5. Implicite : Alignement du Schéma de la Collection Payload**

*   **État Actuel :** Le type `SubmissionData` dans `actions.ts` est conçu pour correspondre à la collection Payload `challenge-submissions`.
*   **Action Proposée :** (Vérification) S'assurer que le schéma réel de la collection Payload défini dans `src/collections/ChallengeSubmissions.ts` est entièrement aligné avec le type `IPayloadSubmissionData` affiné de `types.ts` (après l'étape 1). Ceci est crucial pour une persistance réussie des données.
*   **Impact :** Garantit l'intégrité des données et prévient les incohérences de schéma entre l'application et le CMS.

---

Ce plan fournit une approche structurée pour refactoriser le système de soumission, en se concentrant sur la sécurité des types, la modularité et la maintenabilité.
