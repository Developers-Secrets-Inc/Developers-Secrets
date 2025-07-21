import Image from 'next/image'

export const ProfileBanner = () => {
  return (
    <div className="relative h-48 w-full overflow-hidden bg-muted rounded-lg">
      <Image
        src="https://avatar.vercel.sh/aliben"
        alt="User banner"
        layout="fill"
        sizes="100vw"
        className="object-cover"
        priority
      />
    </div>
  )
}
