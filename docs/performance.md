# Performance notes

This covers what was done to keep rendering cheap, how it was measured, and what's still worth improving.

All measurements were taken with React DevTools on an Android emulator (API 34) running a debug build. Debug builds are much slower than release builds, so the render times below are only useful for comparing one case against another. The component counts are the more reliable part.

## Preventing unnecessary re-renders

**Memoized components.** The components that appear many times in a list are wrapped in `React.memo`, so they only render again when their own props change. This covers `ProductCard`, `ProductPrice`, `ProductRating`, `CartItemRow`, `CartSummary`, `WishlistCard` and `OrderCard`, plus `ImageGallery`, `SimilarProducts` and `ProductReviews` on the details screen.

**Stable props.** `React.memo` only helps if the props stay the same between renders. List callbacks like `renderItem` and `onPress` are wrapped in `useCallback`, and the main lists define `keyExtractor` outside the component.

**Small store subscriptions.** Components read only the values they need from Zustand. For example, `WishlistButton` subscribes to whether its own product is saved, and a cart row subscribes to its own quantity. Changing one item doesn't wake up the rest of the list.

**Derived values.** Cart totals are calculated with `useMemo`, and similar products are ranked inside `useMemo`, so they aren't recalculated on unrelated renders.

## FlatList settings

The product list is a two-column `FlatList` with these settings:

| Setting | Value | Why |
|---|---|---|
| `initialNumToRender` | 6 | Enough to fill the first screen |
| `maxToRenderPerBatch` | 6 | Renders new rows in small batches while scrolling |
| `windowSize` | 7 | Keeps fewer off-screen rows mounted than the default of 21 |
| `removeClippedSubviews` | on | Detaches off-screen views on Android |
| `onEndReachedThreshold` | 0.5 | Starts loading the next page half a screen before the end |

Products load 20 at a time. While new search or filter results load, the previous results stay on screen instead of being replaced by a loading state.

The product list doesn't use `getItemLayout`. Card heights change depending on whether a product name takes one or two lines, and wrong heights would break scrolling. The image gallery on the details screen does use it, because every image has the same width.

## Profiler results

Each case below was recorded on its own. The screenshots show the Profiler's ranked view, which lists only the components that rendered during that commit.

| Action | What rendered | Evidence |
|---|---|---|
| Tap one wishlist heart | 9 components, all inside that one button, in 10.4 ms. No product cards rendered. | [Screenshot](profiler/wishlist-toggle.png), [recording](profiler/wishlist.profile.json) |
| Tap **+** on one of two cart items | Only the changed row out of 2, plus the totals. | [Screenshot](profiler/cart-quantity.png), [recording](profiler/cart.profile.json) |
| Type 3 letters into search | None of the 18 product cards in the list rendered. | [Screenshot](profiler/search-typing.png), [recording](profiler/search.profile.json) |
| Scroll the list (4 swipes) | 22 product cards rendered, and all of them were new cards coming into view. Cards already on screen didn't render again. | [Screenshot](profiler/scroll-list.png), [recording](profiler/scroll.profile.json) |

To open a recording, go to the **Profiler** tab in React DevTools, click the **Load profile** (up arrow) button and choose one of the `.profile.json` files.

## Before and after

These numbers come from the two performance commits, `01ad7ee` (product list rendering) and `b3bf667` (cart and product screens). They were measured on the same emulator with React's `<Profiler>` API and a render counter on each card.

| Action | Card renders, before → after | Render time, before → after |
|---|---|---|
| Scroll the product list (8 swipes) | 306 → 68 | 8,100 ms → 4,627 ms |
| Type 5 letters into search | 200 → 20 | 3,345 ms → 1,565 ms |

The wishlist heart and cart quantity cases were already efficient before these commits, so their numbers didn't change.

## APK size

Release builds use R8 to shrink and optimize the code, plus resource shrinking. The build can also produce one APK per CPU architecture instead of a single APK containing all four.

| Build | Size |
|---|---|
| Original universal APK | about 78 MB |
| Single APK for ARM phones (64-bit and 32-bit) | 35.6 MB |
| Per-architecture APKs | 18–25 MB each |

The README explains how to build each one.

## What could be better

**The category bar re-renders while typing.** Every keystroke in the search box re-renders the category bar and all 25 category buttons, which shows up as the most expensive part of those commits. Wrapping `CategoryBar` in `React.memo` with a stable `onSelect` callback would remove this.

**Cart changes re-render the tab bar.** Changing a quantity also re-renders the bottom tab navigator, because the cart tab shows an item count badge. It's cheap compared with the rest of the screen, but the badge could be moved into its own small component so only it updates.
