interface UserNameProps {
  name: string
}

export const UserName = ({ name }: UserNameProps) => {
  return <h1 className="text-3xl font-semibold">{name}</h1>
}
