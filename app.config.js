export default {
  expo: {
    name: "tripin",
    slug: "tripin",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["location"],
        NSLocationWhenInUseUsageDescription: "This app needs your location to track your trips while you're using the app.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "This app needs your location to track your trips even when the app is in the background.",
        NSLocationAlwaysUsageDescription: "This app needs your location to track your trips.",
        ITSAppUsesNonExemptEncryption: false
      },
      bundleIdentifier: "com.anonymous.tripin"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.anonymous.tripin",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_BACKGROUND_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_LOCATION"
      ]
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-secure-store",
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.EXPO_MAPBOX_DOWNLOAD_TOKEN
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to track your trips.",
          locationAlwaysPermission: "Allow $(PRODUCT_NAME) to track your trips in the background.",
          locationWhenInUsePermission: "Allow $(PRODUCT_NAME) to track your trips while using the app.",
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true
        }
      ],
      "expo-sqlite"
    ],
    extra: {
      eas: {
        projectId: "2e3446d3-9978-4cea-8294-a1166b269f3f"
      },
      mapboxToken: process.env.EXPO_MAPBOX_PUBLIC_TOKEN,
    }
  }
}