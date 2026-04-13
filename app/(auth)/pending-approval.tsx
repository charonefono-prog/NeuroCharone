import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function PendingApprovalScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="flex items-center justify-center p-6">
      <View className="gap-6 items-center">
        <View className="w-16 h-16 rounded-full bg-warning/20 items-center justify-center">
          <Text className="text-4xl">⏳</Text>
        </View>
        
        <View className="gap-2 items-center">
          <Text className="text-2xl font-bold text-foreground text-center">
            Aguardando Aprovação
          </Text>
          <Text className="text-base text-muted text-center">
            Seu cadastro foi recebido! Um administrador revisará sua solicitação em breve.
          </Text>
        </View>

        <View className="bg-surface rounded-lg p-4 w-full gap-2">
          <Text className="font-semibold text-foreground">O que acontece agora?</Text>
          <Text className="text-sm text-muted">
            • Você receberá um email quando sua conta for aprovada{"\n"}
            • Isso geralmente leva 24-48 horas{"\n"}
            • Você poderá fazer login assim que for aprovado
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="bg-primary rounded-lg px-6 py-3 w-full items-center"
        >
          <Text className="text-white font-semibold">Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
