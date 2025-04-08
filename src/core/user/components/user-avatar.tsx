import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
    avatarUrl: string
    initials: string
}

type UserAvatarProps = {
    user: User
}

export const UserAvatar = ({user}: UserAvatarProps) => {
    return (
        <Avatar>
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>
                {user.initials}
            </AvatarFallback>
        </Avatar>
    )
}

