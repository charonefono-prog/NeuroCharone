import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function PendingApprovalScreen() {
  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Stack.Screen options={{ title: "Aprovação Pendente" }} />
      <Text className="text-2xl font-bold mb-4">Sua conta está aguardando aprovação.</Text>
      <Text className="text-gray-600 text-center">Por favor, aguarde a aprovação de um administrador para acessar o aplicativo.</Text>
    </View>
  );
}
