import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/types/user"

export const CommentAvatar = ({ author }: { author: User }) => {
    return (
      <Avatar>
        <AvatarImage src={author.informations.avatar} alt={author.informations.name} />
        <AvatarFallback>{author.informations.initials}</AvatarFallback>
      </Avatar>
    )
  }