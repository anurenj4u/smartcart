# SmartCart

SmartCart is a shopping app built with React Native. It uses the [DummyJSON](https://dummyjson.com/docs) API for product data and is set up for Android.

You can browse and search products, filter by category, price and rating, save items to a wishlist, and go through a simulated checkout. The cart, wishlist and orders are saved on the device, the catalog stays available offline, and the app sends a reminder if you leave something in your cart.

## Setup

You'll need:

- Node.js 22.11 or newer
- JDK 17
- Android Studio with Android SDK Platform 37 and Build Tools 37.0.0
- NDK 27.1.12297006
- An emulator or phone running Android 7.0 (API 24) or newer

Make sure `ANDROID_HOME` points to your Android SDK, then install the dependencies:

```bash
npm install
```

## Running the app

Start an emulator or connect a phone, then start Metro:

```bash
npm start
```

In a second terminal, build and install the app:

```bash
npm run android
```

The first build compiles native code for every architecture, so it can take 15 minutes or more. If you're only using an emulator, you can build just its architecture, which is much quicker:

```bash
npm run android -- --active-arch-only
```

## Building a release APK

On macOS or Linux:

```bash
cd android
./gradlew assembleRelease
```

On Windows:

```bash
cd android
gradlew.bat assembleRelease
```

The APK ends up in `android/app/build/outputs/apk/release/app-release.apk`. Release builds include the JavaScript bundle, so they run without Metro. It's signed with the debug key, so it's only meant for local testing.

## Useful commands

```bash
npm test          # run the tests
npm run lint      # run ESLint
npx tsc --noEmit  # check types
```

## Troubleshooting

**Red screen saying `Can't find ViewManager`**

The installed app is older than your native dependencies. Run `npm run android` again to rebuild and reinstall it.

**Stuck on "Loading from Metro" or a `Compiling JS failed` error**

This usually means the machine is short on memory, often because a Gradle build is running at the same time. Let the build finish or stop it with `gradlew --stop` from the `android` folder, then restart Metro and reload the app.

**The app can't connect to Metro on a real phone**

Connect over USB and run:

```bash
adb reverse tcp:8081 tcp:8081
```

## Project structure

The code is organized by feature, so everything for the cart, for example, lives in one place.

```text
src/
  app/        App entry, navigation and providers
  features/
    products/       Product list, details and similar products
    catalog/        Categories, search, sorting and filters
    cart/           Cart store, totals and cart screen
    wishlist/       Saved products
    checkout/       Shipping form, placing orders and confirmation
    orders/         Order history
    notifications/  Abandoned cart reminders
  shared/     API client, storage, theme and reusable UI
```

Dependencies only go one way, so there are no import cycles between features:

```text
app -> features -> shared

products      -> catalog, cart, wishlist
wishlist      -> cart
checkout      -> cart, orders
notifications -> cart
```

Features import each other through their `index.ts` file, and `shared` never imports from a feature or from `app`. ESLint checks both rules.

## State management

State is split by where the data comes from.

| State | Managed by |
|---|---|
| Products and categories | TanStack Query |
| Cart, wishlist and orders | Zustand, saved with MMKV |
| Search text and filters | Local React state |

I chose Zustand over Redux Toolkit because TanStack Query already handles caching, loading states and retries for server data. That leaves only a few small client stores, and Redux would add more structure than they need.

Zustand also fits this app well in a few specific ways:

- Components subscribe to just the values they use, so tapping a wishlist heart only re-renders that heart.
- The `persist` middleware saves a store with very little code.
- Stores can be used outside React, which the reminder logic relies on.

MMKV reads synchronously, so the saved cart is ready as soon as the app opens.

## How it works

**Search and filters.** DummyJSON can't combine search with a category, and it has no price or rating filters. Simple requests go to the server with normal pagination. Anything more complex filters the full catalog on the device instead, and both paths return the same page format, so the list doesn't need to know the difference. Price sorting always runs on the device, because the server sorts by list price while the app shows the discounted price. Search waits 400ms after the last keystroke before running.

**Prices.** Money is calculated in integer cents to avoid floating point errors.

**Similar products.** There's no API for this, so the app fetches the product's category and ranks the results. Shared tags count the most, followed by brand, price closeness and rating. Sold-out products are moved down the list.

**Offline.** Product data is cached with MMKV and restored on launch, and the full catalog is loaded in the background so search and filters still work offline. A banner shows when there's no connection, and anything that isn't saved yet loads automatically after reconnecting. Placing an order offline shows an error and keeps the cart. Failed requests are retried on network and server errors, but not on other client errors.

**Reminders.** Changing the cart schedules a reminder, using one fixed notification ID so that a new reminder replaces the old one. Clearing the cart or completing a purchase cancels it, and tapping the notification opens the cart. The delay is 2 hours in release builds and 1 minute in debug builds, which makes it easy to test.