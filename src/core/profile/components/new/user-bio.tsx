interface UserDescriptionProps {
  description: string
}

export const UserDescription = ({ description }: UserDescriptionProps) => {
  return <p className="text-sm text-muted-foreground">{description}</p>
}
