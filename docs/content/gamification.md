

#### Comment fonctionne la gamification ?

Chaque utilisateur de la plateforme possède un système de gamification. Ce système est composé de niveaux et d'expérience. Quand un utilisateur crée son compte, il commence au niveau 1 avec 0 expérience.

Tout au long de son parcours sur la plateforme, l'utilisateur pourra monter de niveau en accumulant de l'expérience. Ce système est complètement autonome et découplé des autres fonctionnalités. On fourni simplement un ensemble de fonctions qui permettent de gérer les informations de gamification d'un utilisateur.


#### Instancier un utilisateur

Pour instancier un utilisateur, on doit passer par la fonction `initializeUser`. Cette fonction crée une nouvelle entrée dans la table `user-gamification` avec les informations de base. Elle demande uniquement un `userId` en paramètre.

```typescript
const initializeUser = async (userId: string): Promise<void>;
```

Cette fonction est principalement appelée lors de la création d'un utilisateur. On l'utilise donc avec l'identifiant supabase défini lors de la création d'un utilisateur.

```typescript
const supabase = await createClient();

const { data: authData, error: authError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      username,
    },
  },
});

await initializeUser(authData.user?.id);
```

**Il pourrait être intéressant de créer une fonction générale de création d'un utilisateur qui instancie toutes les informations nécessaires (dont celles directement liées à l'utilisateur).**


#### Ajouter de l'expérience à un utilisateur

On veut faire en sorte que l'ajout d'expérience soit le plus simple possible. C'est pour ça que tout est géré dans la fonction `addExperience`. Elle se charge d'ajouter de l'expérience, vérifier si l'utilisateur doit monter de niveau et si c'est le cas, de mettre à jour les informations de gamification.

```typescript
const addExperience = async (userId: string, experienceAmount: number): Promise<void>;
```

#### Récupérer les informations de gamification d'un utilisateur

On peut récupérer les informations de gamification d'un utilisateur avec les fonctions suivantes :

```typescript
const getUserExperience = async (userId: string): Promise<number>;
const getUserLevel = async (userId: string): Promise<number>;
const getUserTotalExperience = async (userId: string): Promise<number>;
const getUserNextLevelExperience = async (userId: string): Promise<number>;

const getUserGamificationInfo = async (userId: string): Promise<UserGamificationInformation>;
```








