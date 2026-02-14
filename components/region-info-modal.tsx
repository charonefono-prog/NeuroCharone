import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";
import { type HelmetRegion, type HelmetPoint } from "@/shared/helmet-data";

interface RegionInfoModalProps {
  visible: boolean;
  region?: HelmetRegion;
  point?: HelmetPoint;
  onClose: () => void;
}

export function RegionInfoModal({ visible, region, point, onClose }: RegionInfoModalProps) {
  const colors = useColors();

  if (!region && !point) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "85%",
          }}
        >
          <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.foreground }}>
                  {point ? point.name : region?.name}
                </Text>
                {point && (
                  <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                    {point.description}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <IconSymbol name="house.fill" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Cor da Região */}
            {region && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: colors.surface,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: region.colorHex,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                    Cor de Identificação
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                    {region.color}
                  </Text>
                </View>
              </View>
            )}

            {/* Funções */}
            {region && region.functions.length > 0 && (
              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                  Funções Cerebrais
                </Text>
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 16,
                    gap: 8,
                  }}
                >
                  {region.functions.map((func, index) => (
                    <View key={index} style={{ flexDirection: "row", gap: 8 }}>
                      <Text style={{ fontSize: 16, color: colors.primary }}>•</Text>
                      <Text style={{ flex: 1, fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
                        {func}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Redes Neurais */}
            {region && region.networks.length > 0 && (
              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                  Redes Neurais Associadas
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {region.networks.map((network, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.primary + "20",
                        borderWidth: 1,
                        borderColor: colors.primary + "40",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>
                        {network}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Aplicações Clínicas */}
            {region && region.clinicalApplications.length > 0 && (
              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                  Aplicações Clínicas
                </Text>
                <View
                  style={{
                    backgroundColor: colors.success + "10",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.success + "30",
                    padding: 16,
                    gap: 8,
                  }}
                >
                  {region.clinicalApplications.map((app, index) => (
                    <View key={index} style={{ flexDirection: "row", gap: 8 }}>
                      <Text style={{ fontSize: 16, color: colors.success }}>✓</Text>
                      <Text style={{ flex: 1, fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
                        {app}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Aplicações do Ponto Específico */}
            {point && point.applications.length > 0 && (
              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                  Aplicações Terapêuticas
                </Text>
                <View
                  style={{
                    backgroundColor: colors.success + "10",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.success + "30",
                    padding: 16,
                    gap: 8,
                  }}
                >
                  {point.applications.map((app, index) => (
                    <View key={index} style={{ flexDirection: "row", gap: 8 }}>
                      <Text style={{ fontSize: 16, color: colors.success }}>✓</Text>
                      <Text style={{ flex: 1, fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
                        {app}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Pontos da Região */}
            {region && region.points.length > 0 && (
              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                  Pontos de Estimulação
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {region.points.map((pointName, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                        {pointName}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Nota Informativa */}
            <View
              style={{
                backgroundColor: colors.warning + "10",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.warning + "30",
                padding: 16,
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.warning }}>
                ⚠️ Nota Importante
              </Text>
              <Text style={{ fontSize: 12, color: colors.foreground, lineHeight: 18 }}>
                As informações apresentadas são baseadas no Sistema Internacional 10-20 e na literatura científica sobre neuromodulação. O uso clínico deve ser sempre supervisionado por profissional qualificado.
              </Text>
            </View>

            {/* Botão Fechar */}
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.primary,
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                Entendi
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
