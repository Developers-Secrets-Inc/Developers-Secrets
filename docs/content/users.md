

#### Récupération d'un utilisateur

On a deux fonctions principales pour récupérer un utilisateur :
- `getUser` : Récupère les informations de l'utilisateur actuel en fonction de la session.
- `getUserById` : Récupère les informations d'un utilisateur en fonction de son id. Cette fonction est utilisée pour récupérer les informations d'un utilisateur quelconque.


Quand on veut récupérer un utilisateur, on doit obligatoirement passer par ces deux fonctions.

#### Les informations de connexion d'un utilisateur

Chaque utilisateur est associé à un ensemble d'informations liées à ses connexions à la plateforme. Actuellement, les informations sont les suivantes :
- `totalConnectionDays` : le nombre de jours de connexion cumulés de l'utilisateur.
- `currentStreak` : le nombre de jours de connexion consécutifs de l'utilisateur.
- `maxStreak` : le nombre de jours de connexion consécutifs de l'utilisateur.
- `lastConnectionDate` : la date de la dernière connexion de l'utilisateur.


- *On doit développer une fonction `connectUser` qui met à jour les informations de connexion d'un utilisateur. Cette fonction sera appelée à chaque visite fois que l'utilisateur vient sur le site.*

#### Rôle d'un utilisateur

Chaque utilisateur est associé à un rôle qui représente son niveau d'abonnement. Les rôles sont les suivants :
- `basic` : Utilisateur standard.
- `pro` : Utilisateur pro.
- `max` : Utilisateur max. 

Ce système suit un raisonnement très simple. On peut modifier sa valeur avec les fonctions :
- `upgradeToPro` : Permet de passer à la version pro.
- `upgradeToMax` : Permet de passer à la version max.
- `downgradeToBasic` : Permet de passer à la version basic.
- `downgradeToPro` : Permet de passer à la version pro.

On peut ensuite récupérer le rôle d'un utilisateur avec la fonction `getUserRole`. Le rôle d'un utilisateur est utilisé principalement pour savoir si l'utilisateur peut accéder à une fonctionnalité.


- *On doit développer les fonctions `isUserPro` et `isUserMax` qui permettent de savoir si un utilisateur est pro ou max.*


#### Permissions d'un utilisateur

**Le système de permissions est en cours de développement. Son but sera de gérer plus précisément ce que peuvent faire les utilisateurs ou non.**


#### Préférences d'un utilisateur

Chaque utilisateur possède un ensemble de préférences qui permettent de personnaliser son expérience sur la plateforme. Les préférences sont les suivantes :
- `notifications` : Les notifications que l'utilisateur souhaite recevoir. Ce sont des notifications internes à la plateforme.
- `emails` : Les emails que l'utilisateur souhaite recevoir. Ce sont des emails liés à son abonnement ou à la plateforme.
- `theme` : Le thème de l'utilisateur. 

**Ce système est encore principalement en cours de développement. La majorité des fonctionnalités ne sont pas encore implémentées.**


#### Comment sont utilisés les utilisateurs ?

On veut faire en sorte que le couplage avec le système d'utilisateurs soit le plus faible possible. C'est pour ça qu'on a uniquement la table `User` qui est directement liée à `SupabaseUser`.

Dans toutes les autres tables, on ne stocke que les `id` des utilisateurs. Cet identifiant est un UUID (Universally Unique Identifier) qui est généré par Supabase lors de la création d'un utilisateur. C'est donc une chaîne de caractères.

Quand on veut récupérer un utilisateur depuis une autre table, on doit obligatoirement passer par la fonction `getUserById` avec l'identifiant de l'utilisateur. Généralement, c'est la logique backend de la fonctionnalité qui doit faire ce travail.


Toutes les informations liées au système d'utilisateurs peuvent être retrouvées dans les fichiers :
- `src/types/user.ts` : Définition des types de données liées aux utilisateurs.
- `src/core/user/index.ts` : Fonctions de gestion des utilisateurs.
- `src/collections/UserInformations.ts` : Collection liée aux informations d'un utilisateur.
