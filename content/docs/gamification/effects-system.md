---
title: Effects System (Active & Passive Boosts)
---

# Effects System – Active & Passive Boosts

## Overview

The effects system manages temporary (active) and permanent (passive) boosts for users. Effects can increase XP gain, currency gain, or provide other benefits. Active effects are time-limited, while passive boosts are granted by owning specific items.

## Usage

- **Active effects** are created when a user consumes a consumable item (e.g., XP potion).
- **Passive boosts** are granted automatically if the user owns a passive item (e.g., permanent XP boost).
- Both types of boosts are combined when calculating rewards (e.g., XP gain).

## API / Main Functions

### `createActiveEffect(userId, effectType, multiplier, expiresAt)`
Creates a new active effect for a user with a given type, multiplier, and expiration date.

### `getActiveEffects(userId)`
Returns all currently active (not expired) effects for a user.

### `getActiveXPBoost(userId)`
Returns the highest XP boost multiplier from all active effects for the user (default: 1).

### `findExistingActiveEffect(userId, effectType)`
Returns the current active effect of a given type for the user, or null if none.

### `hasPassiveXPBoost(userId)`
Returns true if the user owns at least one passive XP boost item.

### `getPassiveXPBoostMultiplier(userId)`
Returns the multiplier of the user's passive XP boost (default: 1).

### `getPassiveBoostMultiplierByType(userId, effectType)`
Returns the multiplier of a passive item of a specific type owned by the user (default: 1).

## Types

```typescript
interface ActiveEffect {
  id: number;
  userId: string;
  effectType: 'xpBoost' | 'currencyBoost' | 'streakRestore' | 'unlockFeature';
  multiplier: number;
  expiresAt: string;
  activatedAt: string;
  isActive: boolean;
  // ...other fields
}
```

## UI Components

### `ActiveEffectDisplay`
- Shows the current active effect, its type, bonus percentage, and time left.
- Combines both active and passive multipliers for display.

### `PassiveBoostDisplay`
- Shows the passive boost (if any) as a permanent effect.
- Displays the bonus percentage and an infinity icon.

## Best Practices
- Always combine both active and passive multipliers when calculating rewards.
- Expired effects should be filtered out (handled by API functions).
- Use the UI components to clearly communicate effect duration and stacking to users.

## References
- [ActiveEffect Type](../../../payload-types.ts)
- [Inventory System](../inventory/index.md)
- [Items System](../items/index.md)