useTransition
useTransition est un Hook React qui vous permet de mettre à jour l’état sans bloquer l’UI.

const [isPending, startTransition] = useTransition()
Référence
useTransition()
La fonction startTransition
Utilisation
Marquer une mise à jour d’état comme étant une Transition non bloquante
Mettre à jour le composant parent dans une Transition
Afficher une indication visuelle pendant la Transition
Empêcher les indicateurs de chargement indésirables
Construire un routeur compatible Suspense
Afficher une erreur à l’utilisateur avec un périmètre d’erreur
Dépannage
Mettre à jour un champ depuis une Transition ne fonctionne pas
React ne traite pas ma mise à jour d’état comme étant une Transition
Je veux appeler useTransition ailleurs que dans un composant
La fonction que je passe à startTransition est exécutée immédiatement
Référence 
useTransition() 
Appelez useTransition au niveau racine de votre composant pour marquer certaines mises à jour d’état comme étant des Transitions.

import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
Voir d’autres exemples ci-dessous.

Paramètres 
useTransition ne prend aucun argument.

Valeur renvoyée 
useTransition renvoie un tableau avec exactement deux éléments :

Le drapeau isPending qui vous indique si la Transition est en cours.
La fonction startTransition qui vous permet de marquer une mise à jour d’état comme Transition.
La fonction startTransition 
La fonction startTransition renvoyée par useTransition vous permet de marquer une mise à jour d’état comme étant une Transition.

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
Paramètres 
scope : une fonction qui met à jour l’état en appelant au moins une fonction set. React appelle immédiatement scope sans argument et marque toutes les mises à jour d’état demandées durant l’exécution synchrone de scope comme des Transitions. Elles seront non bloquantes et n’afficheront pas d’indicateurs de chargement indésirables.
Valeur renvoyée 
startTransition ne renvoie rien.

Limitations et points à noter 
useTransition est un Hook, il ne peut donc être appelé qu’au sein de composants ou de Hooks personnalisés.  Si vous avez besoin de démarrer une Transition à un autre endroit (par exemple, depuis une bibliothèque de gestion de données), utilisez plutôt la fonction autonome startTransition.

Vous pouvez enrober une mise à jour dans une Transition uniquement si vous avez accès à la fonction set de l’état en question.  Si vous souhaitez démarrer une Transition en réaction à une prop ou à la valeur renvoyée par un Hook personnalisé, utilisez plutôt useDeferredValue.

La fonction que vous passez à startTransition doit être synchrone.  React exécute cette fonction immédiatement, et marque toutes les mises à jour demandées lors de son exécution comme des Transitions.  Si vous essayez de faire des mises à jour d’état plus tard (par exemple avec un timer), elles ne seront pas marquées comme des Transitions.

La fonction startTransition a une identité stable, elle ne figure donc généralement pas dans les dépendances des Effets, mais l’inclure n’entraînera pas un déclenchement d’Effet superflu.  Si le linter vous permet de l’omettre sans erreurs, c’est que cette omission est sans danger. Apprenez-en davantage sur l’allègement des dépendances d’Effets

Une mise à jour d’état marquée comme une Transition pourra être interrompue par d’autres mises à jour d’état.  Par exemple, si vous mettez à jour un composant de graphe au sein d’une Transition, mais commencez alors une saisie dans un champ texte tandis que le graphe est en train de refaire son rendu, React redémarrera le rendu du composant graphe après avoir traité la mise à jour d’état du champ.

Les mises à jour en Transition ne peuvent pas être utilisées pour contrôler des champs textuels.

Si plusieurs Transitions sont en cours, React les regroupe pour le moment.  Cette limitation sera sans doute levée dans une future version.

Utilisation 
Marquer une mise à jour d’état comme étant une Transition non bloquante 
Appelez useTransition au niveau racine de votre composant pour marquer des mises à jour d’état comme étant des Transitions non bloquantes.

import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
useTransition renvoie un tableau avec exactement deux éléments :

Le drapeau isPending qui vous indique si la Transition est en cours.
La fonction startTransition qui vous permet de marquer une mise à jour d’état comme Transition.
Vous pouvez marquer une mise à jour d’état comme étant une Transition de la façon suivante :

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
Les Transitions vous permettent de conserver la réactivité des mises à jour d’interface utilisateur, même sur des appareils lents.

Avec une Transition, votre UI reste réactive pendant le rendu. Par exemple, si l’utilisateur clique sur un onglet mais ensuite change d’avis et va sur un autre onglet, il peut le faire sans devoir d’abord attendre que le premier onglet ait fini son rendu.

La différence entre useTransition et des mises à jour d’état classiques
1. Changer l’onglet actif au sein d’une Transition
2. Changer l’onglet actif sans Transitions


Exemple 1 sur 2 · Changer l’onglet actif au sein d’une Transition 
Dans cet exemple, l’onglet « Articles » est artificiellement ralenti pour que son rendu prenne au moins une seconde.

Cliquez sur « Articles » puis cliquez immédiatement sur « Contact ». Remarquez que ça interrompt le rendu lent d’« Articles ». L’onglet « Contact » est affiché immédiatement.  Puisque la mise à jour d’état est marquée comme une Transition, un rendu lent ne gèle pas pour autant l’interface utilisateur.

App.js
TabButton.js
AboutTab.js
PostsTab.js
ContactTab.js
Réinitialiser

Fork
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Articles (lent)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>


Voir plus
Prochain exemple
Mettre à jour le composant parent dans une Transition 
Vous pouvez tout aussi bien mettre à jour l’état du composant parent depuis un appel à useTransition.  Par exemple, le composant TabButton enrobe la logique de son onClick avec une Transition :

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
Puisque le composant parent met à jour son état au sein du gestionnaire d’événement onClick, cette mise à jour d’état sera marquée comme étant une Transition.  C’est pourquoi, comme dans l’exemple précédent, vous pouvez cliquer sur « Articles » puis immédiatement sur « Contact ».  Le changement d’onglet est marqué comme étant une Transition : il ne bloque donc pas les interactions utilisateur.

App.js
TabButton.js
AboutTab.js
PostsTab.js
ContactTab.js
Réinitialiser

Fork
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}



Voir plus
Afficher une indication visuelle pendant la Transition 
Vous pouvez utiliser la valeur booléenne isPending renvoyée par useTransition pour indiquer à l’utilisateur qu’une Transition est en cours.  Par exemple, le bouton d’onglet peut avoir un état visuel spécial « en cours » :

function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
Remarquez que le clic sur « Articles » semble désormais plus réactif parce que le bouton d’onglet lui-même se met à jour immédiatement :

App.js
TabButton.js
AboutTab.js
PostsTab.js
ContactTab.js
Réinitialiser

Fork
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}



Voir plus
Empêcher les indicateurs de chargement indésirables 
Dans cet exemple, le composant PostsTab charge des données en utilisant une source de données compatible Suspense.  Lorsque vous cliquez sur l’onglet « Articles », le composant PostsTab suspend, entraînant l’affichage du plus proche contenu de secours :

App.js
TabButton.js
Réinitialiser

Fork
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Chargement...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        À propos
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Articles
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}



Voir plus
Masquer le conteneur d’onglets dans son intégralité pour afficher un indicateur de chargement entraîne une expérience utilisateur désagréable.  Si vous ajoutez useTransition à TabButton, vous pouvez plutôt manifester l’attente en cours dans le bouton d’onglet.

Remarquez que cliquer sur « Articles » ne remplace plus l’ensemble du conteneur d’onglets avec un spinner :

App.js
TabButton.js
Réinitialiser

Fork
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}



Voir plus
Apprenez-en davantage sur l’utilisation des Transitions avec Suspense.

Remarque
Les Transitions « n’attendront » que le temps nécessaire pour éviter de masquer du contenu déjà révélé (comme le conteneur d’onglets).  Si l’onglet Articles avait un périmètre <Suspense> imbriqué, la Transition « n’attendrait » pas ce dernier.

Construire un routeur compatible Suspense 
Si vous construisez un framework React ou un routeur, nous vous recommandons de marquer toutes les navigations de pages comme étant des Transitions.

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
Nous recommandons ça pour deux raisons :

Les Transitions sont interruptibles, ce qui permet à l’utilisateur de cliquer pour aller ailleurs sans devoir attendre la fin du rendu de son premier choix.
Les Transitions évitent les indicateurs de chargement indésirables, ce qui vous évite de produire des « clignotements » désagréables lors de la navigation.
Voici un petit exemple de routeur très simplifié utilisant les Transitions pour ses navigations.

App.js
Layout.js
IndexPage.js
ArtistPage.js
Réinitialiser

Fork
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />


Voir plus
Remarque
Les routeurs compatibles Suspense sont censés enrober par défaut leurs mises à jour de navigation dans des Transitions.

Afficher une erreur à l’utilisateur avec un périmètre d’erreur 
Canary (fonctionnalité expérimentale)
Les périmètres d’erreurs pour useTransition ne sont actuellement disponibles que sur les canaux de livraison Canary et Expérimental de React. Apprenez-en davantage sur les canaux de livraison React.

Si une fonction passée à startTransition lève une erreur, vous pouvez afficher l’erreur à votre utilisateur au moyen d’un périmètre d’erreur. Pour utiliser un périmètre d’erreur, enrobez le composant qui appelle useTransition avec ce périmètre. Lorsque la fonction passée à startTransition lèvera une erreur, le contenu de secours du périmètre d’erreur sera affiché.


AddCommentContainer.js
Réinitialiser

Fork
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️ Ça sent le pâté…</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // Pour les besoins de la démonstration uniquement
  if(comment == null) {
    throw Error('Example Error: An error thrown to trigger error boundary')
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // On ne passe volontairement pas de commentaire
          // afin d’entraîner une erreur.
          addComment();
        });
      }}
    >
      Ajouter un commentaire
    </button>
  );
}



Voir plus
Dépannage 
Mettre à jour un champ depuis une Transition ne fonctionne pas 
Vous ne pouvez pas utiliser une Transition pour mettre à jour une variable d’état qui contrôle un champ :

const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Les Transitions ne peuvent enrober des mises à jour d'état qui contrôlent des champs
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
C’est parce que les Transitions sont non bloquantes, alors que la mise à jour d’un champ en réaction à un événement de modification doit survenir de façon synchrone.  Si vous souhaitez exécuter une Transition en réponse à une saisie, vous avez deux options :

Vous pouvez déclarer deux variables d’état distinctes : une pour l’état du champ (qui sera toujours mise à jour de façon synchrone), et une que vous mettrez à jour au sein d’une Transition. Ça vous permet de contrôler le champ avec l’état synchrone, tout en passant la variable d’état en Transition (qui est susceptible de « retarder » par rapport à la saisie) au reste de votre logique de rendu.
Sinon, vous pouvez n’avoir qu’une variable d’état et utiliser useDeferredValue qui vous permettra d’être « en retard » sur la véritable valeur. Ça déclenchera automatiquement des rendus non bloquants pour « rattraper » la nouvelle valeur.
React ne traite pas ma mise à jour d’état comme étant une Transition 
Lorsque vous enrobez une mise à jour d’état dans une Transition, assurez-vous qu’elle survient effectivement pendant l’appel à startTransition :

startTransition(() => {
  // ✅ L’état est mis à jour *pendant* l’appel à startTransition
  setPage('/about');
});
La fonction que vous passez à startTransition doit être synchrone.

Vous ne pouvez pas marquer une mise à jour comme étant une Transition avec ce genre de code :

startTransition(() => {
  // ❌ L’état est mis à jour *après* l’appel à startTransition
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
Faites plutôt ceci :

setTimeout(() => {
  startTransition(() => {
    // ✅ L’état est mis à jour *pendant* l’appel à startTransition
    setPage('/about');
  });
}, 1000);
Dans le même esprit, vous ne pouvez pas marquer une mise à jour comme étant une Transition avec du code ressemblant à ça :

startTransition(async () => {
  await someAsyncFunction();
  // ❌ L’état est mis à jour *après* l’appel à startTransition
  setPage('/about');
});
En revanche, ce type de code fonctionne :

await someAsyncFunction();
startTransition(() => {
  // ✅ L’état est mis à jour *pendant* l’appel à startTransition
  setPage('/about');
});
Je veux appeler useTransition ailleurs que dans un composant 
Vous ne pouvez pas appeler useTransition hors d’un composant parce que c’est un Hook.  Pour ce type de besoin, préférez la fonction autonome startTransition.   Son fonctionnement est identique, à ceci près qu’elle ne fournit pas l’indicateur isPending.

La fonction que je passe à startTransition est exécutée immédiatement 
Si vous exécutez ce code, ça affichera 1, 2, 3 :

console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
C’est censé afficher 1, 2, 3.  La fonction que vous passez à startTransition ne doit pas être différée.  Contrairement au setTimeout du navigateur, la fonction de rappel n’est pas appelée plus tard.  React exécute votre fonction immédiatement, mais les mises à jour d’état que vous y demandez pendant son exécution sont marquées comme étant des Transitions.  Vous pouvez vous imaginer le fonctionnement suivant :

// Version simplifiée du fonctionnement de React

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... planifie une mise à jour d’état en tant que Transition ...
  } else {
    // ... planifie une mise à jour d’état urgente ...
  }
}