---
title: Marketplace System (Currency & Item Purchasing)
---

# Marketplace System – Currency & Item Purchasing

## Overview

The marketplace system allows users to purchase items using in-game currency (coins). It manages item availability, purchase validation, and user currency balances. Currency can be earned through achievements, quests, or other rewards.

## Usage

- Users browse available items in the marketplace UI.
- To purchase an item, the system checks if the user has enough currency and (for passive items) if they already own a similar item.
- On successful purchase, the item is added to the user's inventory and the currency balance is updated.
- Currency can be earned via various game actions and is tracked per user.

## API / Main Functions

### `getMarketplaceItems()`
Returns all available items in the marketplace, with item details populated.

### `buyItem(itemId, price)`
Attempts to purchase an item for the current user. Checks for sufficient currency and passive item ownership. On success, deducts currency, adds the item to inventory, and increments the item's purchase count.
Returns `{ success, error? }`.

### `getUserCurrency(userId)`
Returns the user's current currency (coin) balance.

### `setUserCurrency(userId, currency)`
Sets the user's currency balance to a specific value.

### `addCurrency(userId, amount, description)`
Adds a specified amount of currency to the user's balance and records the transaction (with description).
Returns `{ success, newBalance?, error? }`.

## Types

```typescript
type MarketplaceItem = {
  id: number;
  item: number | Item;
  price: number;
  isAvailable: boolean;
  purchaseCount: number;
  // ...other fields
}

// Currency is tracked as a number (coins)
```

## Best Practices
- Always check for sufficient currency before allowing a purchase.
- Prevent duplicate purchases of passive items (e.g., permanent boosts).
- Use transaction history for auditing and user feedback.
- Keep user inventory and currency in sync after any purchase or reward.

## References
- [MarketplaceItem Type](../../../payload-types.ts)
- [User Currency Type](../../../payload-types.ts)
- [Inventory System](./inventory-system.md)