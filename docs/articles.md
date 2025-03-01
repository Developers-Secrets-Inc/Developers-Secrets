
## Navigation des articles 

- Quand on va dans `/tutorials/[tutorial-slug]`, on est redirigé vers `/tutorials/[tutorial-slug]/[article-slug]` où `[article-slug]` est le premier article du tutoriel.
- Quand on est sur `/tutorials/[tutorial-slug]/examples`, on est redirigé vers `/tutorials/[tutorial-slug]/[article-slug]` où `[article-slug]` est le premier article d'exemple du tutoriel.
- Quand on est sur `/tutorials/[tutorial-slug]/references`, on est redirigé vers `/tutorials/[tutorial-slug]/[article-slug]` où `[article-slug]` est le premier article de référence du tutoriel.


## Affichage en Markdown 

Le contenu des articles est stocké sous le format Markdown. On doit donc développer un parser qui permet de convertir le format Markdown en un composant React. 
- On a un composant `Markdown` qui encapsule toute la logique de conversion.
- On a fichier `parser.ts` dans un dossier `core/markdown` qui contient la logique de conversion. Pour le moment, on ne doit pas s'occuper de la conversion et uniquement renvoyer le contenu en Markdown comme chaîne de caractères.


## Layout des articles 

```jsx
<SidebarProvider>
  <ArticlesSidebar articles={...}/> // Les articles dépendent de classiques, exemples ou références
  <SidebarInset>
    <TutorialHeader />
    <TutorialContent>
      <div>
        <Markdown>{content}</Markdown>
        <RecommandedArticles />
      </div>
      <ArticleOutline/>
    </TutorialContent>
  </SidebarInset>
</SidebarProvider>
```

On se chargera du design dans le futur. S'il y a déjà des design présents, on doit les préserver, ça veut dire que l'équipe de design a déjà commencé à travailler sur le design des articles. On doit simplement reformater le code mais garder le design existant.


## Articles individuels 


- A la fin de chaque article, on a des boutons pour demander l'avis de l'utilisateur sur l'article (1 à 5 étoiles).
- A la fin de chaque article, on a quatre cartes qui affichent les recommandations d'articles.


- On doit savoir quels sont tous les articles du tutoriel `getTutorialArticles`
- On doit pouvoir récupérer le contenu d'un article en particulier `getArticle`
- On doit pouvoir récupérer la outline d'un article en particulier `getArticleOutline`. Cette outline se fait elle aussi avec un parsing du contenu de l'article. Les titres h2, h3, h4, etc. sont les parties de l'outline. Cette fonction sera donc elle aussi dans le fichier `parser.ts`. (On attends avant de l'implémenter).
- On doit pouvoir récupérer les articles similaires `getSimilarArticles`. Idem, on attends avant de l'implémenter.



### Recommandations d'articles 

On veut implémenter un système de recommandations d'articles en utilisant du machine learning.
- On veut pouvoir recommander des articles en fonction des articles que l'utilisateur a déjà lu. Ca implique qu'on doit stocker les articles lus par l'utilisateur. 
  - C'est pour cela qu'on va créer un type qui va stocker les informations des utilisateurs non connectés. Ce type ira récupérer toutes les informations qui sont stockés dans le local-storage.
    - On doit donc stocker tous les articles qu'il a visité (uniquement les slugs) ainsi que leur date de visite. On doit aussi stocker le temps qu'il a passé sur chaque article, ses réactions, etc.
- Dans le cas où l'utilisateur est connecté, on doit pouvoir lui recommander des articles en fonction de ses goûts. **On développera cette fonctionnalité plus tard.**
- On veut aussi pouvoir recommander des articles en fonction de ses statistiques (popularité, etc.). Toutes ces informations seront stockées dans la collection `Article`.


- Chaque article possède un ensemble de tags. Chaque article est aussi lié à d'autres articles qui sont des articles similaires, des articles prérequis et des articles de prochaine étape.
- On recommande à l'utilisateur deux articles en fonction de leurs statistiques. On recommande deux articles en fonction des recommandations personnalisées de l'utilisateur.
  - Pour les articles statistiques, on va utiliser un score de hotness `(score = engagement / (heure de publication + 2)^alpha)`. Stocker les métriques des articles (engagement=nombre de vues, temps moyen, etc.). Calculer un score de popularité toutes les X heures. Recommander les 2 articles les mieux classés.
  - Pour les recommandations personnalisées, on peut trouver des articles avec des tags similaires à ceux qu’il a déjà lus puis mesurer la similarité textuelle (TF-IDF, Word2Vec, BERT). Utiliser les relations "articles similaires", "pré-requis" et "prochaine étape" et parcourir le graphe pour recommander les articles logiquement liés à sa lecture.


## Articles d'exemple 

Ces articles sont des articles qui montrent comment utiliser un concept en pratique. Par exemple, dans un tutoriel de Python, on pourrait avoir un article qui montre comment créer une fonction `somme`.

Ils suivent exactement le même layout que les autres articles. On doit pouvoir récupérer tous les articles d'exemple d'un tutoriel `getTutorialExamples`. On doit pouvoir récupérer un article d'exemple en particulier `getExample`. On doit pouvoir récupérer la outline d'un article d'exemple en particulier `getExampleOutline`.

## Articles de référence à la documentation 

Ces articles sont des articles qui expliquent chaque concept de la documentation du concept associé au tutoriel. Dans un tutoriel comme Python, il y aura un article qui explique la fonction `print` et un autre qui explique la fonction `input`. On aurait aussi des articles pour explique chaque méthodes des objets natifs de Python.

Ils suivent exactement le même layout que les autres articles. On doit pouvoir récupérer tous les articles de référence d'un tutoriel `getTutorialReferences`. On doit pouvoir récupérer un article de référence en particulier `getReference`. On doit pouvoir récupérer la outline d'un article de référence en particulier `getReferenceOutline`.

## Points à développer 

- Comment gérer les CTA 
- Comment gérer les traductions
- On souhaite ajouter un challenge à la fin de chaque article.
