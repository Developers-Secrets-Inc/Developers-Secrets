
type WithChildren = {
  children: React.ReactNode
}

export const CoursePartFooterContainer: React.FC<WithChildren> = ({ children }) => {
  return (
    <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] rounded-b-md relative z-50">
      {children}
    </div>
  )
}

export const CoursePartFooterLeftPart: React.FC<WithChildren> = ({ children }) => {
  return <div className="flex items-center justify-between gap-3 mb-3">{children}</div>
}

export const CoursePartDescriptionLayout = {
    FooterContainer: CoursePartFooterContainer,
    FooterLeftPart: CoursePartFooterLeftPart
}