import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Helmet3DViewer } from "@/components/helmet-3d-viewer";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Point {
  id: string;
  name: string;
  position: [number, number, number];
  area: "broca" | "wernicke" | "linguagem" | "motora" | "other";
  system10_20: string;
  description: string;
}

const AREA_LABELS = {
  broca: "Área de Broca",
  wernicke: "Área de Wernicke",
  linguagem: "Linguagem",
  motora: "Motora",
  other: "Outro",
};

const AREA_COLORS = {
  broca: "#ff6b6b",
  wernicke: "#4ecdc4",
  linguagem: "#ffe66d",
  motora: "#95e1d3",
  other: "#c7ceea",
};

export default function Helmet3DScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handlePointSelected = (point: Point) => {
    setSelectedPoint(point);
    setShowInfo(true);
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.primary,
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol
              name="chevron.left.forwardslash.chevron.right"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#FFFFFF",
              flex: 1,
            }}
          >
            Mapeamento 3D do Capacete
          </Text>
          <TouchableOpacity onPress={() => setShowInfo(false)}>
            <IconSymbol name="xmark" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 3D Viewer */}
        <View style={{ flex: 1 }}>
          <Helmet3DViewer
            onPointSelected={handlePointSelected}
            selectedPointId={selectedPoint?.id}
            showSidebar={!showInfo}
          />
        </View>

        {/* Info Modal */}
        <Modal
          visible={showInfo && !!selectedPoint}
          transparent
          animationType="slide"
        >
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
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                paddingTop: 16,
                paddingHorizontal: 16,
                paddingBottom: 24,
                maxHeight: "80%",
              }}
            >
              {/* Close button */}
              <TouchableOpacity
                onPress={() => setShowInfo(false)}
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 12,
                }}
              >
                <IconSymbol name="xmark" size={24} color={colors.foreground} />
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedPoint && (
                  <>
                    {/* Point name */}
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        color: colors.foreground,
                        marginBottom: 12,
                      }}
                    >
                      {selectedPoint.name}
                    </Text>

                    {/* Area badge */}
                    <View
                      style={{
                        backgroundColor:
                          AREA_COLORS[
                            selectedPoint.area as keyof typeof AREA_COLORS
                          ],
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        alignSelf: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: "#fff",
                        }}
                      >
                        {
                          AREA_LABELS[
                            selectedPoint.area as keyof typeof AREA_LABELS
                          ]
                        }
                      </Text>
                    </View>

                    {/* Description */}
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.foreground,
                        lineHeight: 22,
                        marginBottom: 16,
                      }}
                    >
                      {selectedPoint.description}
                    </Text>

                    {/* System 10-20 */}
                    <View
                      style={{
                        backgroundColor: colors.surface,
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.muted,
                          marginBottom: 4,
                        }}
                      >
                        Sistema 10-20
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: colors.foreground,
                        }}
                      >
                        {selectedPoint.system10_20}
                      </Text>
                    </View>

                    {/* Coordinates */}
                    <View
                      style={{
                        backgroundColor: colors.surface,
                        padding: 12,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.muted,
                          marginBottom: 4,
                        }}
                      >
                        Coordenadas 3D
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "monospace",
                          color: colors.foreground,
                        }}
                      >
                        X: {selectedPoint.position[0].toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "monospace",
                          color: colors.foreground,
                        }}
                      >
                        Y: {selectedPoint.position[1].toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "monospace",
                          color: colors.foreground,
                        }}
                      >
                        Z: {selectedPoint.position[2].toFixed(2)}
                      </Text>
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
