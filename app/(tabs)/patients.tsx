import { ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function PatientsScreen() {
  const colors = useColors();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "completed">("all");

  const { data: user } = trpc.auth.me.useQuery();
  const { data: patients, isLoading } = trpc.patients.list.useQuery(
    { search, status: statusFilter },
    { enabled: !!user }
  );

  if (!user) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Faça login para acessar</Text>
      </ScreenContainer>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return colors.success;
      case "paused":
        return colors.warning;
      case "completed":
        return colors.muted;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "paused":
        return "Pausado";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Pacientes</Text>
            <Text className="text-base text-muted">
              Gerencie seus pacientes e tratamentos
            </Text>
          </View>

          {/* Busca */}
          <View className="bg-surface rounded-xl p-3 flex-row items-center gap-2 border border-border">
            <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
            <TextInput
              className="flex-1 text-base text-foreground"
              placeholder="Buscar paciente..."
              placeholderTextColor={colors.muted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filtros */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setStatusFilter("all")}
              activeOpacity={0.7}
              className={`px-4 py-2 rounded-full ${
                statusFilter === "all" ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text className={statusFilter === "all" ? "text-white font-semibold" : "text-muted"}>
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStatusFilter("active")}
              activeOpacity={0.7}
              className={`px-4 py-2 rounded-full ${
                statusFilter === "active" ? "bg-success" : "bg-surface border border-border"
              }`}
            >
              <Text className={statusFilter === "active" ? "text-white font-semibold" : "text-muted"}>
                Ativos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStatusFilter("paused")}
              activeOpacity={0.7}
              className={`px-4 py-2 rounded-full ${
                statusFilter === "paused" ? "bg-warning" : "bg-surface border border-border"
              }`}
            >
              <Text className={statusFilter === "paused" ? "text-white font-semibold" : "text-muted"}>
                Pausados
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Pacientes */}
          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : patients && patients.length > 0 ? (
            <View className="gap-3">
              {patients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  activeOpacity={0.7}
                  className="bg-surface rounded-xl p-4 border border-border"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">
                        {patient.fullName}
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        {new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} anos
                      </Text>
                      {patient.diagnosis && (
                        <Text className="text-sm text-muted mt-1" numberOfLines={1}>
                          {patient.diagnosis}
                        </Text>
                      )}
                    </View>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: getStatusColor(patient.status) + "20" }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: getStatusColor(patient.status) }}
                      >
                        {getStatusLabel(patient.status)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="items-center py-12">
              <IconSymbol name="person.2.fill" size={64} color={colors.muted} />
              <Text className="text-lg text-muted mt-4 text-center">
                Nenhum paciente encontrado
              </Text>
              <Text className="text-sm text-muted mt-2 text-center">
                Adicione seu primeiro paciente para começar
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
