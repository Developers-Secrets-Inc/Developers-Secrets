import { Challenge as PayloadChallenge } from '@/payload-types'

interface DescriptionCommentsProps {
  challenge: PayloadChallenge
}

export const DescriptionComments = ({ challenge }: DescriptionCommentsProps) => {
  return <div>DescriptionComments</div>
}

/*

- On affiche un ensemble de commentaires
- On peut intéragir avec chaque commentaire 
    - On peut voter pour un commentaire
    - On peut répondre à un commentaire
- On peut envoyer un nouveau commentaire


- onCommentCreation
- onReplyCreation
- onCommentVote
- onCommentReply
- onCommentReport


On veut afficher les commentaires de façon statique càd aller récupérer les commentaires depuis la base de données puis les afficher bêtement. Le problème est qu'on veut aussi ajouter de l'intéractivité avec les différentes actions possibles avec les commentaires. 

Le problème aussi est qu'on a trois types de commentaires :
- les commentaires de la description du challenge
- Les commentaires de la solution officielle du challenge
- les commentaires des solutions des autres utilisateurs

On veut pouvoir les afficher tous ensemble mais être capable de gérer les modifications séparément. C'est pour ça qu'on a crée le composant DescriptionComments qui gère uniquement les commentaires de la description du challenge. Quand on ajoute un commentaire, on doit l'ajouter à ceux de la description du challenge, etc. C'est la logique des commentaires uniquement pour la description du challenge.



*/
