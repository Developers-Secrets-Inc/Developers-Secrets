import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
    avatarUrl: string
    initials: string
}

type UserAvatarProps = {
    user: User
    className?: string
}

export const UserAvatar = ({user, className}: UserAvatarProps) => {
    return (
        <Avatar className={className}>
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>
                {user.initials}
            </AvatarFallback>
        </Avatar>
    )
}

