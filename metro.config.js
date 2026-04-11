const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Fix for SHA-1 error in CI environments like Vercel
// NativeWind v4 can have issues with its cache directory
module.exports = withNativeWind(config, {
  input: "./global.css",
  // Only force write to file system in development mode
  forceWriteFileSystem: process.env.NODE_ENV === "development",
});
