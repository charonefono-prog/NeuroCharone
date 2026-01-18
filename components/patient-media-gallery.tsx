import { View, Text, TouchableOpacity, Image, Modal, ScrollView, Alert, Platform } from "react-native";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "./ui/icon-symbol";
import * as ImagePicker from "expo-image-picker";
import { VideoView, useVideoPlayer } from "expo-video";
import type { MediaItem } from "@/lib/local-storage";
import * as Haptics from "expo-haptics";

interface PatientMediaGalleryProps {
  media: MediaItem[];
  onAddMedia: (newMedia: MediaItem) => void;
  onDeleteMedia: (mediaId: string) => void;
}

export function PatientMediaGallery({ media = [], onAddMedia, onDeleteMedia }: PatientMediaGalleryProps) {
  const colors = useColors();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão Negada", "É necessário permitir acesso à galeria para adicionar fotos e vídeos.");
      return false;
    }
    return true;
  };

  const handlePickMedia = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 0.8,
        videoMaxDuration: 60, // Máximo 60 segundos
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMedia: MediaItem = {
          id: Date.now().toString(),
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "photo",
          createdAt: new Date().toISOString(),
        };

        onAddMedia(newMedia);

        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error("Error picking media:", error);
      Alert.alert("Erro", "Não foi possível selecionar a mídia.");
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão Negada", "É necessário permitir acesso à câmera para tirar fotos.");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMedia: MediaItem = {
          id: Date.now().toString(),
          uri: asset.uri,
          type: "photo",
          createdAt: new Date().toISOString(),
        };

        onAddMedia(newMedia);

        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Erro", "Não foi possível tirar a foto.");
    }
  };

  const handleViewMedia = (item: MediaItem) => {
    setSelectedMedia(item);
    setShowViewer(true);
  };

  const handleDeleteMedia = (mediaId: string) => {
    Alert.alert("Excluir Mídia", "Tem certeza que deseja excluir esta foto/vídeo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          onDeleteMedia(mediaId);
          setShowViewer(false);
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ gap: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
            Fotos e Vídeos
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
            {media.length} {media.length === 1 ? "arquivo" : "arquivos"}
          </Text>
        </View>

        {/* Botões de Adicionar */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          {Platform.OS !== "web" && (
            <TouchableOpacity
              onPress={handleTakePhoto}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IconSymbol name="camera.fill" size={18} color="#FFFFFF" />
              <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>Câmera</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handlePickMedia}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <IconSymbol name="photo.fill" size={18} color="#FFFFFF" />
            <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>Galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid de Mídia */}
      {media.length === 0 ? (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 32,
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.border,
            borderStyle: "dashed",
          }}
        >
          <IconSymbol name="photo.fill" size={48} color={colors.muted} />
          <Text style={{ color: colors.muted, marginTop: 12, textAlign: "center" }}>
            Nenhuma foto ou vídeo adicionado
          </Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4, textAlign: "center" }}>
            Toque em "Câmera" ou "Galeria" para adicionar
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {media.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleViewMedia(item)}
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {item.type === "photo" ? (
                <Image source={{ uri: item.uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              ) : (
                <View style={{ width: "100%", height: "100%", backgroundColor: colors.surface, justifyContent: "center", alignItems: "center" }}>
                  <IconSymbol name="play.fill" size={32} color={colors.primary} />
                  <Text style={{ color: colors.muted, fontSize: 10, marginTop: 4 }}>Vídeo</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Visualizador de Mídia */}
      <Modal visible={showViewer} transparent animationType="fade" onRequestClose={() => setShowViewer(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)" }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              paddingTop: 48,
            }}
          >
            <TouchableOpacity onPress={() => setShowViewer(false)} style={{ padding: 8 }}>
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {selectedMedia && (
              <TouchableOpacity
                onPress={() => handleDeleteMedia(selectedMedia.id)}
                style={{ padding: 8 }}
              >
                <IconSymbol name="trash" size={24} color="#FF4444" />
              </TouchableOpacity>
            )}
          </View>

          {/* Conteúdo */}
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
            {selectedMedia && (
              <>
                {selectedMedia.type === "photo" ? (
                  <Image
                    source={{ uri: selectedMedia.uri }}
                    style={{ width: "100%", height: "80%", borderRadius: 8 }}
                    resizeMode="contain"
                  />
                ) : (
                  <VideoView
                    player={useVideoPlayer(selectedMedia.uri, (player) => {
                      player.play();
                    })}
                    style={{ width: "100%", height: "80%", borderRadius: 8 }}
                    nativeControls
                    contentFit="contain"
                  />
                )}

                {/* Info */}
                <View style={{ marginTop: 16, alignItems: "center" }}>
                  <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
                    {new Date(selectedMedia.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
