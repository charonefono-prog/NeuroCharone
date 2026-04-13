import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList, Modal, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/lib/auth-context";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  approvedAt: Date | null;
}

export default function AdminUsersScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Verificar se é admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      Alert.alert("Acesso Negado", "Você não tem permissão para acessar esta área");
      return;
    }
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // TODO: Chamar API para listar usuários
      // const response = await trpc.admin.listUsers.query();
      // setUsers(response);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      // TODO: Chamar API para aprovar usuário
      Alert.alert("Sucesso", "Usuário aprovado");
      loadUsers();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível aprovar usuário");
    }
  };

  const handleBlock = async (userId: number) => {
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      // TODO: Chamar API para bloquear usuário
      Alert.alert("Sucesso", "Usuário bloqueado");
      loadUsers();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível bloquear usuário");
    }
  };

  const handleGenerateInvite = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert("Erro", "Digite um email válido");
      return;
    }

    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      // TODO: Chamar API para gerar convite
      Alert.alert("Sucesso", "Convite gerado e enviado");
      setInviteEmail("");
      setShowInviteModal(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar convite");
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ gap: 24 }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>
              Gerenciar Profissionais
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Controle de acesso e aprovações
            </Text>
          </View>

          {/* Botão Gerar Convite */}
          <TouchableOpacity
            onPress={() => setShowInviteModal(true)}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 20 }}>📧</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>
                Gerar Convite
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
                Convide um novo profissional
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: "white" }}>›</Text>
          </TouchableOpacity>

          {/* Lista de Usuários */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
              Profissionais ({users.length})
            </Text>
            
            {users.length === 0 ? (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 24,
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 14, color: colors.muted }}>
                  Nenhum profissional cadastrado
                </Text>
              </View>
            ) : (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: 16,
                      gap: 12,
                    }}
                  >
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                        {item.fullName}
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.muted }}>
                        {item.email}
                      </Text>
                    </View>

                    {/* Status */}
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: item.isActive ? colors.success + "20" : colors.error + "20",
                          borderRadius: 8,
                          padding: 8,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: item.isActive ? colors.success : colors.error,
                          }}
                        >
                          {item.isActive ? "Ativo" : "Bloqueado"}
                        </Text>
                      </View>

                      {item.approvedAt ? (
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: colors.success + "20",
                            borderRadius: 8,
                            padding: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "600",
                              color: colors.success,
                            }}
                          >
                            Aprovado
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleApprove(item.id)}
                          style={{
                            flex: 1,
                            backgroundColor: colors.warning + "20",
                            borderRadius: 8,
                            padding: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "600",
                              color: colors.warning,
                            }}
                          >
                            Pendente
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Botões de Ação */}
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {item.isActive ? (
                        <TouchableOpacity
                          onPress={() => handleBlock(item.id)}
                          style={{
                            flex: 1,
                            backgroundColor: colors.error + "10",
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.error,
                            padding: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "600",
                              color: colors.error,
                            }}
                          >
                            Bloquear
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleApprove(item.id)}
                          style={{
                            flex: 1,
                            backgroundColor: colors.success + "10",
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.success,
                            padding: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "600",
                              color: colors.success,
                            }}
                          >
                            Desbloquear
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal Gerar Convite */}
      <Modal visible={showInviteModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
              gap: 16,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
              Gerar Convite
            </Text>

            <TextInput
              placeholder="Email do profissional"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.foreground,
              }}
              placeholderTextColor={colors.muted}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowInviteModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGenerateInvite}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>
                  Gerar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
