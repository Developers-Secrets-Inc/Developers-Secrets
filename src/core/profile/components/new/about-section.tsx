import { UserProfile } from '@/core/profile/actions' // Assuming type exists
import { AboutDescription } from './about-description'
import { DetailItem } from './detail-item'
import { MapPin, Globe, Briefcase, Mail } from 'lucide-react'

interface AboutSectionProps {
  userProfile: UserProfile | null
}

// Placeholder data accessors - Adjust when UserProfile type is fixed
const getDescription = (profile: UserProfile | null) =>
  (profile as any)?.description ||
  "This is a longer description about the user. It might contain details about their work, hobbies, or personal projects. We need enough text here to potentially trigger the 'Read More' button. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
const getLocation = (profile: UserProfile | null) => (profile as any)?.location || 'Paris, France'
const getWebsite = (profile: UserProfile | null) =>
  (profile as any)?.websiteUrl || 'https://example.com'
const getPortfolio = (profile: UserProfile | null) =>
  (profile as any)?.portfolioUrl || 'https://portfolio.example.com'
const getEmail = (profile: UserProfile | null) =>
  (profile as any)?.email || 'amelie.laurent@example.com'

export const AboutSection = ({ userProfile }: AboutSectionProps) => {
  if (!userProfile) return null

  const description = getDescription(userProfile)
  const location = getLocation(userProfile)
  const website = getWebsite(userProfile)
  const portfolio = getPortfolio(userProfile)
  const email = getEmail(userProfile)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
      {' '}
      {/* Main grid */}
      {/* Left Column */}
      <div className="md:col-span-2">
        <AboutDescription description={description} />
      </div>
      {/* Right Column */}
      <div className="space-y-4">
        {' '}
        {/* Use space-y for vertical spacing */}
        <h3 className="text-base font-semibold">Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          {' '}
          {/* 2x2 grid for details */}
          <DetailItem icon={<MapPin size={16} />} label="Location" value={location} />
          <DetailItem
            icon={<Globe size={16} />}
            label="Website"
            value={website}
            href={website?.startsWith('http') ? website : `https://${website}`}
          />
          <DetailItem
            icon={<Briefcase size={16} />}
            label="Portfolio"
            value={portfolio}
            href={portfolio?.startsWith('http') ? portfolio : `https://${portfolio}`}
          />
          <DetailItem
            icon={<Mail size={16} />}
            label="Email"
            value={email}
            href={`mailto:${email}`}
          />
        </div>
      </div>
    </div>
  )
}
