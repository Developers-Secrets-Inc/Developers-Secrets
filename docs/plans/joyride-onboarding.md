# Tour System Implementation Plan

## Overview
This document outlines the complete implementation plan for adding a generic tour system to the home dashboard page using an abstraction layer over React Joyride. The system is designed to be reusable across the entire platform.

## 1. Installation
```bash
npm install react-joyride @types/react-joyride
```

## 2. Architecture Overview
The implementation uses a layered architecture:
- **Core Tour Module**: Generic tour system in `/src/core/tour/`
- **Tour Components**: React components wrapping Joyride with abstraction
- **Home Integration**: Specific implementation for home dashboard
- **Persistence Layer**: Local storage and server-side state management

## 3. Component Structure

### 3.2 Home-Specific Tour Implementation
**Location:** `src/app/(frontend)/(dashboard)/(navigation)/home/components/home-tour.tsx`

**Purpose:** Specific implementation using the core tour system for the home dashboard.

**Key Features:**
- 5-step tour covering all dashboard sections
- Custom blue theme matching Tailwind's blue-500
- Persistent state management
- Skip and progress indicators
- URL parameter activation (`?onboarding=true`)

**Step Configuration:**
1. **Current Course** - Bottom placement
2. **Recommended Challenges** - Bottom placement  
3. **Suggested Courses** - Bottom placement
4. **User Profile** - Left placement
5. **Leaderboard** - Left placement

### 3.3 TourTarget Wrapper (Advanced Generic)
**Location:** `src/core/tour/components/TourTarget.tsx`

**Purpose:** Sophisticated, zero-impact wrapper that provides intelligent targeting capabilities with advanced features like conditional rendering, responsive breakpoints, and accessibility support. Designed for platform-wide usage with minimal footprint.

**Core Architecture:**
- **Zero DOM Impact**: Uses data attributes exclusively, no wrapper divs when possible
- **Smart Rendering**: Conditional rendering based on tour state and viewport
- **Accessibility**: Automatic ARIA labels and keyboard navigation hints
- **Responsive**: Built-in breakpoint system for mobile/desktop tours

**Props Interface:**
```typescript
interface TourTargetProps {
  tourId: string;                    // Tour identifier (e.g., "home-dashboard")
  stepId: string;                    // Unique step within tour (e.g., "welcome-banner")
  className?: string;                // Additional classes (merged with defaults)
  children: React.ReactNode;        // Component to target
  metadata?: {
    title?: string;                 // Step title for accessibility
    description?: string;           // Step description
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    offset?: { x: number; y: number };
    mobile?: {
      placement?: string;           // Mobile-specific placement
      hide?: boolean;              // Hide on mobile
    };
    desktop?: {
      placement?: string;           // Desktop-specific placement
      hide?: boolean;              // Hide on desktop
    };
    conditions?: {
      viewport?: { min?: number; max?: number };
      userAgent?: string[];         // Target specific browsers/devices
      featureFlags?: string[];      // Feature flag dependencies
    };
  };
  fallback?: React.ReactNode;       // Fallback when target is hidden
  priority?: number;                // Target priority (0-100, default 50)
  debug?: boolean;                  // Enable debug mode for development
}
```

**Advanced Features:**
- **Intersection Observer**: Automatic visibility detection
- **Mutation Observer**: Dynamic DOM changes handling
- **Performance Optimized**: Memoized rendering and debounced updates
- **Error Boundaries**: Graceful degradation when targets are missing
- **Analytics Hooks**: Built-in tracking for target visibility and interaction

**Usage Patterns:**
```typescript
// Basic usage
<TourTarget tourId="home-dashboard" stepId="welcome-banner">
  <WelcomeBanner />
</TourTarget>

// Advanced usage with metadata
<TourTarget 
  tourId="home-dashboard" 
  stepId="challenge-card"
  metadata={{
    title: "Start Your First Challenge",
    description: "Click here to begin your coding journey",
    placement: "bottom",
    mobile: { placement: "top", hide: false },
    conditions: { viewport: { min: 768 } }
  }}
>
  <ChallengeCard />
</TourTarget>
```

**Internal Structure:**
- **Target Registry**: Global registry for all tour targets
- **State Management**: React Context for tour state synchronization
- **DOM Utilities**: Efficient DOM querying and attribute management
- **Event System**: Custom events for tour lifecycle hooks

### 3.3 HomeClientWrapper Enhancement
**Location:** `src/app/(frontend)/(dashboard)/(navigation)/home/components/home-client-wrapper.tsx`

**Additions:**
- URL parameter detection for `?onboarding=true`
- Local state management for tour visibility
- Integration with existing subscription dialog logic

## 4. Implementation Details

### 4.1 Core Tour Integration Strategy
**Step 1: Core Module Setup**
```typescript
// Initialize core tour system
import { TourProvider } from '@/core/tour'
import { registerTour } from '@/core/tour/utils/tourRegistry'
```

**Step 2: Tour Registration**
```typescript
// Register home dashboard tour
registerTour('home-dashboard', {
  id: 'home-dashboard',
  steps: [
    { id: 'current-course', title: 'Current Course', content: '...' },
    { id: 'recommended-challenge', title: 'Challenges', content: '...' },
    { id: 'recommended-courses', title: 'Courses', content: '...' },
    { id: 'user-profile', title: 'Profile', content: '...' },
    { id: 'leaderboard', title: 'Leaderboard', content: '...' }
  ]
})
```

**Step 3: Component Wrapping**
```typescript
<TourTarget tourId="home-dashboard" stepId="current-course" className="w-full">
  <CurrentCourseCard />
</TourTarget>
```

### 4.2 Styling Configuration
**Joyride Custom Styles:**
- Primary color: `#3b82f6` (Tailwind blue-500)
- Border radius: `8px`
- Z-index: `10000` (above all content)
- Tooltip styling matches Tailwind design system

### 4.3 Persistent Storage (Multi-layer)
**Local Storage:**
- Key: `tour-state-{userId}`
- Stores: completed tours, last step, preferences
- TTL: 30 days

**Server Storage:**
- Collection: `user-tour-progress`
- Fields: userId, tourId, completedSteps, lastSeen, preferences
- Enables cross-device synchronization

**Configuration:**
```typescript
const persistenceConfig = {
  local: { enabled: true, ttl: 30 * 24 * 60 * 60 * 1000 },
  server: { enabled: true, sync: true },
  urlOverride: { param: 'tour', force: true }
}
```

## 5. Page Modifications

### 5.1 Global Setup
**Root Layout Enhancement:**
```typescript
// In root layout or _app.tsx
import { TourProvider } from '@/core/tour'

<TourProvider config={tourConfig}>
  {children}
</TourProvider>
```

### 5.2 Home Page Integration
**HomeClientWrapper Enhancement:**
```typescript
import { useTour } from '@/core/tour/hooks/useTour'
import { TourTarget } from '@/core/tour/components/TourTarget'

// Register tour on mount
useEffect(() => {
  registerTour('home-dashboard', homeTourConfig)
}, [])
```

**Component Wrapping:**
```typescript
// HomeLeftColumn
<TourTarget tourId="home-dashboard" stepId="current-course" className="w-full">
  <CurrentCourseCard />
</TourTarget>

<TourTarget tourId="home-dashboard" stepId="recommended-challenge" className="w-full">
  <RecommendedChallenge userId={user.id} isPro={user.informations.role !== 'basic'} />
</TourTarget>

<TourTarget tourId="home-dashboard" stepId="recommended-courses" className="w-full">
  <RecommendedCourses />
</TourTarget>

// HomeRightColumn
<TourTarget tourId="home-dashboard" stepId="user-profile" className="w-full">
  <UserProfile user={user} />
</TourTarget>

<TourTarget tourId="home-dashboard" stepId="leaderboard" className="w-full">
  <DivisionLeaderboardCard />
</TourTarget>
```

## 6. Testing Strategy

### 6.1 Manual Testing
- Access: `http://localhost:3000/home?onboarding=true`
- Verify all 5 steps display correctly
- Test skip functionality
- Test completion flow
- Verify no layout shifts

### 6.2 Edge Cases
- Mobile responsiveness
- Different screen sizes
- Component loading states
- User authentication states

## 7. Deployment Considerations

### 7.1 Performance Impact
- Minimal bundle size increase (~50KB)
- Lazy loading of Joyride component
- No impact on existing component performance

### 7.2 Accessibility
- Keyboard navigation support
- Screen reader compatibility
- Focus management during tour

## 8. Future Enhancements

### 8.1 Platform-wide Reusability
- **Tour Library**: Reusable tour configurations for different pages
- **Role-based Tours**: Different tours for basic/pro/enterprise users
- **Feature-specific Tours**: Tours for new features, updates, or complex workflows

### 8.2 Advanced Analytics
- **Engagement Metrics**: Completion rates, skip rates, time per step
- **User Segmentation**: Track by user type, experience level, device
- **A/B Testing**: Test different tour flows and content

### 8.3 Dynamic Tour Generation
- **Context-aware Tours**: Based on user actions, page context, or feature flags
- **Progressive Disclosure**: Tours that adapt based on user progress
- **Localization**: Multi-language tour content

### 8.4 Integration Examples
```typescript
// Challenge page tour
registerTour('challenge-first-visit', challengeTourConfig)

// Settings tour for new features
registerTour('settings-new-feature', settingsTourConfig)

// Pro features tour
registerTour('pro-features', proTourConfig)
```

## 9. Rollback Plan
- All changes are additive and non-breaking
- Can be disabled by removing URL parameter detection
- Components remain fully functional without wrappers
- No database schema changes required

## 10. Development Checklist

### 10.1 Prerequisites
- [ ] React Joyride installed
- [ ] TypeScript types available
- [ ] Development environment running

### 10.2 Core Module Development
1. [ ] Create `/src/core/tour/` directory structure
2. [ ] Implement core types and interfaces
3. [ ] Build TourProvider component
4. [ ] Create TourTarget wrapper
5. [ ] Implement useTour hook
6. [ ] Add tourRegistry utility
7. [ ] Create server-side actions
8. [ ] Write unit tests for core module

### 10.3 Home Dashboard Integration
1. [ ] Create home-specific tour configuration
2. [ ] Update HomeClientWrapper with tour logic
3. [ ] Wrap all target components with TourTarget
4. [ ] Test tour flow with URL parameter
5. [ ] Verify responsive behavior
6. [ ] Test persistence across sessions
7. [ ] Validate server-side sync
8. [ ] Performance testing

### 10.4 Platform Integration
1. [ ] Add TourProvider to root layout
2. [ ] Create tour configuration templates
3. [ ] Document API for other developers
4. [ ] Create example implementations
5. [ ] Set up analytics tracking
6. [ ] Deploy to staging environment
7. [ ] Production deployment
8. [ ] Monitor initial usage metrics

### 10.3 Post-Deployment
- [ ] Monitor user engagement
- [ ] Collect feedback
- [ ] Adjust tour content based on usage
- [ ] Document any issues for future improvements