

- Comment fonctionne un challenge ? 
  - Comment gérer les tests d'un challenge ?
  - Comment gérer la réussite d'un challenge ?
  - Comment gérer l'ajout d'expérience lié à un challenge ?
  - Comment gérer l'amélioration des compétences lié à un challenge ?
- Comment fonctionnent les commentaires de challenges ? 



Les challenges ont une des fonctionnalités principales de la plateforme. Ce sont des exercices qui permettent aux utilisateurs de pratiquer leurs compétences. Quand ils réussissent un challenge, ils gagnent de l'expérience et des compétences. 


#### Comment sont structurés les challenges ? 

Chaque challenge possède un ensemble d'informations de base. Il possède :
- Un `title` qui représente simplement le nom du challenge. Il a aussi un `slug` qui est une version du titre simplifiée et optimisée pour les URL.
- Un `difficulty` qui représente la difficulté du challenge. On peut définir la difficulté en fonction des valeurs littérales : `easy`, `medium`, `hard`, `horrible`.
- Un `baseExperience` qui représente la quantité d'expérience que l'utilisateur gagne en réussissant le challenge. Cette valeur est calculée automatiquement en fonction de la difficulté du challenge. La formule est la suivante : `baseExperience = difficulty * 50`.


#### Les notations d'un challenge


#### Les concepts d'un challenge

Chaque challenge est associé à un ensemble de concepts. Ces concepts sont des objets de la collection `Concepts` qu'on a développé dans la documentation `/docs/content/skills.md`.

Chaque concept est associé à une valeur numérique qui représente le niveau de développement du concept lorsque l'utilisateur réussit le challenge. Cette valeur sera ensuite ajoutée à la valeur de développement du concept de l'utilisateur.

#### Les engagements d'un challenge

Chaque challenge possède un ensemble de likes et dislikes. Ces données d'engagement permettent de savoir si le challenge est apprécié ou non par la communauté. 

#### La description d'un challenge

La description d'un challenge représente son énoncé et les informations associées. On a donc les informations suivantes :
- Un `statement` qui représente l'énoncé du challenge.
- Un `submissionStats` qui représente les statistiques associées aux soumissions de tous les utilisateurs. Le champ `acceptedSolutions` représente le nombre de solutions acceptées, le champ `failedSolutions` représente le nombre de solutions qui ont échoué et le champ `totalSubmissions` représente le nombre total de soumissions. On calcule ensuite le taux de réussite d'un challenge avec la formule suivante : `acceptanceRate = (acceptedSolutions / totalSubmissions) * 100`.
- Un `hints` qui représente les indications associées au challenge. Ce sont simplement des indices qui permettent d'aider l'utilisateur à résoudre le challenge.
- Un `similarChallenges` qui représente les challenges similaires.


Les informations `statement`, `hints` et `similarChallenges` sont définies dans l'interface d'administration.


### Les commentaires d'un challenge

Les commentaires sont gérés par la collection `Comments`.


- Chaque commentaire possède un `content` qui représente le contenu du commentaire. Il possède aussi un `authorId` qui représente l'identifiant de l'utilisateur qui a créé le commentaire. 
- Chaque commentaire peut être défini comme une réponse à un autre commentaire. Quand ce n'est pas une réponse, on affiche un champ qui représente l'ensemble des réponses à ce commentaire.



- On doit pouvoir créer de nouveaux commentaires. Quand un commentaire est créé, on doit le lier automatiquement au challenge.
- On doit pouvoir modifier un commentaire.
- On doit pouvoir supprimer un commentaire.
- On doit pouvoir voter sur un commentaire.
- On doit pouvoir répondre à un commentaire.




