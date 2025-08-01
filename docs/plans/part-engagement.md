# Course Part Engagement System Migration Plan

## Overview

This document outlines the detailed development plan to migrate the course part engagement system from the current simple like/dislike fields in `CoursePartUserProgression.ts` to a new system based on the existing challenge engagement architecture.

## Current State Analysis

### Existing Challenge System Architecture
- **ChallengeEngagement.ts**: Individual user engagement (like/dislike) for challenges
- **ChallengesEngagement.ts**: Aggregated engagement statistics per challenge
- **ChallengeRating.ts**: Individual user ratings (1-5 stars) for challenges
- **ChallengeRatings.ts**: Aggregated rating statistics per challenge
- **UserChallengeProgression.ts**: User progression with engagement fields

### Current Course Part System
- **CoursePartUserProgression.ts**: Contains `engagementStatus` field (liked/disliked/none)
- **CourseParts.ts**: Contains direct `likes` and `dislikes` fields (to be removed)

## Migration Plan

### 1. Database Schema Changes

#### 1.1 Modify Existing Collections

**CoursePartUserProgression.ts**
- Remove: `engagementStatus` field
- Keep: All other progression-related fields (userId, coursePart, completionStatus, solutionUnlocked)

**CourseParts.ts**
- Remove: `likes` field
- Remove: `dislikes` field

#### 1.2 Create New Collections

**CoursePartEngagement.ts**
```typescript
// Individual user engagement for course parts
fields: {
  coursePart: relationship to CourseParts (required)
  user: relationship to Users (required)
  engagementType: select ('like' | 'dislike') (required)
}
// Unique index on [coursePart, user]
// Hooks: afterChange, afterDelete to update CoursePartsEngagement
```

**CoursePartsEngagement.ts**
```typescript
// Aggregated engagement statistics per course part
fields: {
  coursePart: relationship to CourseParts (unique, required)
  likes: number (default: 0, admin read-only)
  dislikes: number (default: 0, admin read-only)
}
// Hook: beforeChange to prevent manual editing
```

**CoursePartRating.ts**
```typescript
// Individual user ratings for course parts
fields: {
  coursePart: relationship to CourseParts (required)
  user: relationship to Users (required)
  rating: number (1-5, required)
}
// Unique index on [coursePart, user]
// Hooks: afterChange, afterDelete to update CoursePartsRatings
```

**CoursePartsRatings.ts**
```typescript
// Aggregated rating statistics per course part
fields: {
  coursePart: relationship to CourseParts (unique, required)
  totalRatingPoints: number (default: 0, admin read-only)
  totalRatings: number (default: 0, admin read-only)
  averageRating: number (computed in beforeChange hook)
}
```

### 2. API Layer Development

#### 2.1 Course Part Engagement API
**src/api/courses/parts/engagement/**

**engagement.ts**
```typescript
// Functions to implement:
- findUserCoursePartEngagement(userId: string, coursePartId: string)
- createCoursePartEngagement(userId: string, coursePartId: string, type: 'like' | 'dislike')
- updateCoursePartEngagement(userId: string, coursePartId: string, type: 'like' | 'dislike')
- deleteCoursePartEngagement(userId: string, coursePartId: string)
```

**rating.ts**
```typescript
// Functions to implement:
- findUserCoursePartRating(userId: string, coursePartId: string)
- createCoursePartRating(userId: string, coursePartId: string, rating: number)
- updateCoursePartRating(userId: string, coursePartId: string, rating: number)
- upsertCoursePartRating(userId: string, coursePartId: string, rating: number)
```

#### 2.2 Query Functions
**src/api/courses/parts/queries.ts**
```typescript
// Add new query functions:
- getCoursePartEngagementStats(coursePartId: string)
- getCoursePartRatingStats(coursePartId: string)
- getUserCoursePartEngagement(userId: string, coursePartId: string)
- getUserCoursePartRating(userId: string, coursePartId: string)
```

### 3. React Hooks Development

#### 3.1 Engagement Hook
**src/core/courses/parts/hooks/use-course-part-engagement.ts**
```typescript
// Based on use-challenge-engagement.ts pattern:
- useQuery for current user engagement state
- useMutation for create/update/delete engagement
- Optimistic updates for immediate UI feedback
- Error handling and rollback
```

#### 3.2 Rating Hook
**src/core/courses/parts/hooks/use-course-part-rating.ts**
```typescript
// Based on challenge rating pattern:
- useQuery for current user rating
- useMutation for upsert rating
- Optimistic updates
- Integration with rating statistics
```

### 4. Component Updates

#### 4.1 Engagement Buttons Component
**src/components/courses/parts/engagement-buttons.tsx**
- Replace direct CoursePartUserProgression engagement logic
- Integrate with new `use-course-part-engagement` hook
- Maintain existing UI/UX patterns
- Add loading states and error handling

#### 4.2 Rating Dialog Component
**src/components/courses/parts/rating-dialog.tsx**
- Create new component based on challenge rating dialog
- Integrate with `use-course-part-rating` hook
- Implement 1-5 star rating interface
- Show aggregated rating statistics

### 5. Data Migration

#### 5.1 Migration Script
**scripts/migrate-course-part-engagement.ts**
```typescript
// Migration tasks:
1. Extract existing engagement data from CoursePartUserProgression
2. Create CoursePartEngagement records for users with liked/disliked status
3. Calculate and create CoursePartsEngagement aggregates
4. Remove engagementStatus field from CoursePartUserProgression
5. Remove likes/dislikes fields from CourseParts
6. Verify data integrity
```

### 6. Type System Updates

#### 6.1 Payload Types
- Regenerate `src/payload-types.ts` after collection changes
- Update existing type references

#### 6.2 Custom Types
**src/types/course.ts**
```typescript
// Add new types:
- CoursePartEngagementType
- CoursePartEngagementStats
- CoursePartRatingStats
- UserCoursePartEngagement
- UserCoursePartRating
```

### 7. Testing Strategy

#### 7.1 Unit Tests
- API functions for engagement and rating
- React hooks with mock data
- Component rendering and interactions

#### 7.2 Integration Tests
- End-to-end engagement flow
- Rating submission and aggregation
- Data consistency checks

#### 7.3 Migration Tests
- Data migration script validation
- Before/after data integrity
- Performance impact assessment

## Implementation Order

### Phase 1: Foundation (Database & API)
1. Create new collection files
2. Implement API functions
3. Create database migrations
4. Generate updated types

### Phase 2: React Layer
1. Develop React hooks
2. Update engagement-buttons component
3. Create rating-dialog component
4. Add error boundaries and loading states

### Phase 3: Integration & Migration
1. Integrate components with new hooks
2. Create and test data migration script
3. Update related components and pages
4. Performance optimization

### Phase 4: Testing & Deployment
1. Comprehensive testing
2. User acceptance testing
3. Gradual rollout
4. Monitor and optimize

## Risk Mitigation

### Data Loss Prevention
- Backup existing engagement data before migration
- Implement rollback procedures
- Gradual migration with validation steps

### Performance Considerations
- Index optimization for new collections
- Efficient aggregation queries
- Caching strategies for frequently accessed data

### User Experience
- Maintain existing UI patterns
- Smooth transition with no feature loss
- Clear error messages and loading states

## Success Criteria

1. **Functional**: All engagement and rating features work as expected
2. **Performance**: No degradation in page load times
3. **Data Integrity**: All existing engagement data preserved and migrated
4. **User Experience**: Seamless transition with improved functionality
5. **Maintainability**: Clean, consistent architecture aligned with challenge system

## Post-Migration Cleanup

1. Remove deprecated fields from collections
2. Clean up unused API endpoints
3. Update documentation
4. Archive old engagement-related code
5. Monitor system performance and user feedback

This migration will provide a robust, scalable engagement system for course parts while maintaining consistency with the existing challenge architecture.