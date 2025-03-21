

#### Comprendre parfaitement la fonctionnalité 


Quand on ajoutes une nouvelle fonctionnalité, la première étape est de définir toutes ses sous-fonctionnalités dans le but de créer un plan de développement de cette fonctionnalité. 
1. On commence par comprendre ce que l'on veut réellement de cette fonctionnalité, quel est son but et comment elle va s'intégrer aux autres fonctionnalités. Généralement, un document sera fourni par le Product Analyst comme support.
2. Le but de la seconde étape est de décomposer au niveau atomique chaque sous-fonctionnalité et cas secondaires de la fonctionnalité globale. C'est ici qu'on veut comprendre tous les petits détails.
3. Le but de la dernière étape est de définir l'architecture de cette fonctionnalité. On doit comprendre comment l'intégrer au système global sans aucun problème. 

Quand on développes ce document, tu dois me poser des questions tant qu'il y a encore quelque chose à développer. On doit vraiment gérer tous les cas et ne rien oublier. Tu ne dois rien assumer et laisser à plus tard, le but de ce document est d'avoir un plan détaillé qui permet à lui seul de développer la fonctionnalité. 

On doit comprendre quelles sont les nouvelles collections qu'on va devoir développer. On doit comprendre quelles sont les fonctions backend à créer pour manipuler ces collections. On doit comprendre toutes les pages qu'on va devoir créer. Surtout, on doit savoir absolument tous les composants qu'on va créer. Rien ne doit être oublié.

#### Comment créer un code lisible 

Quand on développe une fonctionnalité, on veut faire en sorte que le code ait un niveau de lisibilité quasi-parfait. 
- Chaque fonction doit avoir un nom simple et clair qui explique spécifiquement quel est son rôle, c'est-à-dire la raison de son existence. Quand on développe des fonctions, on doit les décomposer à un niveau atomique. Chaque fonction doit uniquement avoir une responsabilité et faire des actions en rapport avec son niveau d'abstraction, les niveaux d'abstractions plus faibles sont gérés par une autre fonction. Les fonctions avec le plus bas niveau d'abstraction sont au début du fichier et augmentent en abstraction en descendant.
- Chaque composant doit représenter une entité unique ayant sa propre conscience et comportement. Généralement, on extrait chaque composant dans un fichier externe, sauf que ce sont des composants locaux, sinon ça créerait trop de fichiers. Absolument tous les comportements doivent représenter un comportement. On ne doit jamais être implicite sur les composants. Idem, les composants avec un niveau d'abstraction le plus faible sont au début du fichier. 

Toutes les fonctions créées doivent être des arrow functions. 

#### Comment créer un code maintenable 

- Aucun composant ne doit gérer directement des comportements, on doit toujours, dans la limite du raisonnable, passer par des `hooks` personnalisés.
- Les composants clients ne doivent jamais gérer de comportements serveurs. On ne doit avoir aucun `useEffect` dans le code. Tout doit être géré par un passage de fonctions en props sous le format `onAction` où `Action` représente le comportement en question (il n'a pas forcément ce nom précis, c'est pour une illustration).


#### Comment créer un code sécurisé 

- Quand on développe des fonctions backend, on doit gérer absolument tous les cas d'erreurs possibles. Il est complètement interdit de renvoyer `null` ou `undefined` quand une donnée n'est pas trouvée, on renvoie une erreur personnalisée. Le but d'une erreur est de faciliter la compréhension de sa raison et faciliter sa résolution.
	- On a deux types d'erreurs, les erreurs qui démontrent un comportement anormal dans le développement anormal dans la fonctionnalité et nécessite une intervention des développeurs comme `DatabaseTimeoutError`. Le second type sont les erreurs attendues qui arrivent lorsque l'utilisateur effectue un comportement qui amène à cette erreur comme `NoCoursesFound`. 
	- Le premier type doit renvoyer une message à l'utilisateur pour dire qu'il y a une erreur mais que c'est de notre faute. Le second doit renvoyer un composant correspondant. Si on ne trouve pas de cours, on affiche un composant spécifique qui montre qu'il n'y a pas de cours.

Pendant le développement du document, on doit aussi gérer tous les cas d'erreurs qui existent. Aucun ne doit échapper. 

