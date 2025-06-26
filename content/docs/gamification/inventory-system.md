---
title: Inventory System (Items & Chests)
---

# Inventory System – Items & Chests

## Overview

The inventory system manages user-owned items, including consumables, passive boosts, and chests. It supports adding items, consuming/using items, and opening chests with randomized rewards.

## Usage

- Users acquire items via the marketplace, achievements, or quest rewards.
- The inventory tracks all items owned by a user, including quantity and item details.
- Consumable items can be used (e.g., XP potions, chests). Passive items are always active and cannot be consumed.
- Opening a chest grants randomized rewards (coins, XP, and/or items of various rarities).

## API / Main Functions

### `getUserInventory(userId)`
Returns all items owned by the user, with item details populated.

### `addItemToInventory(userId, itemId, quantity?)`
Adds a specified quantity of an item to the user's inventory. If the item already exists, increments the quantity.

### `consumeItem(userItemId)`
Consumes (uses) an item from the user's inventory. Handles logic for:
- Chests: opens and grants random rewards (coins, XP, items)
- Consumable duration: applies a timed effect (e.g., XP boost)
- Consumable instant: applies an instant effect (e.g., streak restore)
- Passive items: cannot be consumed
Returns `{ success, error?, rewards? }` (rewards only for chests)

### `getUserItem(userId, itemId)`
Fetches a specific item from the user's inventory.

### `updateUserItem(userItemId, quantity)`
Updates the quantity of a specific user item.

## Types

```typescript
type UserItem = {
  id: number;
  userId: string;
  item: number | Item;
  quantity: number;
  // ...other fields
}

type RewardSummary = {
  coins: number;
  xp: number;
  items: {
    common: Item[];
    rare: Item[];
    epic: Item[];
    legendary: Item[];
  };
}
```

## UI Components

### `InventorySheet`
- Displays the user's inventory in a sidebar/sheet.
- Allows consuming items (with loading state and error handling).
- Shows a dialog (`ChestOpeningDialog`) when a chest is opened, displaying each reward step-by-step.

### `ChestOpeningDialog`
- Modal dialog that animates and displays each reward from a chest (coins, XP, items by rarity).
- Supports keyboard navigation and responsive design.

## Best Practices
- Always check item quantity before allowing consumption.
- For chests, avoid granting duplicate passive items if the user already owns them.
- Use UI feedback (toasts, dialogs) to clearly communicate rewards and errors.
- Keep inventory data in sync after any mutation (refresh after consume/add).

## References
- [UserItem Type](../../../payload-types.ts)
- [Item Type](../../../payload-types.ts)
- [Effects System](./effects-system.md)
- [Marketplace System](../marketplace/index.md)