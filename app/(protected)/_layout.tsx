import { Stack } from "expo-router";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { isLoading } = useProtectedRoute();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
