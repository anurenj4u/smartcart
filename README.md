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
