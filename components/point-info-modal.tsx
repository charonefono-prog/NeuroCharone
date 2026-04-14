import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";
import { getPointFunction } from "@/shared/helmet-point-functions";

interface PointInfoModalProps {
  visible: boolean;
  point: string | null;
  onClose: () => void;
}

export function PointInfoModal({ visible, point, onClose }: PointInfoModalProps) {
  const colors = useColors();

  if (!point) return null;

  const pointInfo = getPointFunction(point);

  if (!pointInfo) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 16,
            width: "100%",
            maxWidth: 500,
            maxHeight: "80%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary + "20",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.primary }}>
                  {pointInfo.point}
                </Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: "600", color: colors.foreground }}>
                Ponto {pointInfo.point}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <IconSymbol name="chevron.right" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={{ padding: 20, gap: 20 }}
          >
            {/* Função Principal */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                FUNÇÃO PRINCIPAL
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground, lineHeight: 26 }}>
                {pointInfo.function}
              </Text>
            </View>

            {/* Descrição Detalhada */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                DESCRIÇÃO DETALHADA
              </Text>
              <Text style={{ fontSize: 16, color: colors.foreground, lineHeight: 24 }}>
                {pointInfo.description}
              </Text>
            </View>

            {/* Indicação Clínica */}
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
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.success }}>
                💡 DICA CLÍNICA
              </Text>
              <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
                Este ponto é especialmente eficaz para tratamentos que visam {pointInfo.function.toLowerCase()}.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View
            style={{
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#FFFFFF" }}>
                Entendi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
