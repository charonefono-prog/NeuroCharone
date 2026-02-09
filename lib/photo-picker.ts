import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

/**
 * Solicita permissão para acessar a galeria
 */
export async function requestPhotoPermission(): Promise<boolean> {
  if (Platform.OS === "web") {
    return true;
  }

  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Erro ao solicitar permissão:", error);
    return false;
  }
}

/**
 * Abre o seletor de imagens
 */
export async function pickImage(): Promise<string | null> {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error("Erro ao selecionar imagem:", error);
    return null;
  }
}

/**
 * Abre a câmera para tirar foto
 */
export async function takePhoto(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error("Erro ao tirar foto:", error);
    return null;
  }
}

/**
 * Salva a imagem no armazenamento local
 */
export async function saveProfilePhoto(imageUri: string): Promise<string | null> {
  try {
    const fileName = `profile_${Date.now()}.jpg`;
    const targetPath = `${FileSystem.documentDirectory}${fileName}`;

    // Copia a imagem para o diretório de documentos
    await FileSystem.copyAsync({
      from: imageUri,
      to: targetPath,
    });

    return targetPath;
  } catch (error) {
    console.error("Erro ao salvar foto:", error);
    return null;
  }
}

/**
 * Deleta a foto de perfil
 */
export async function deleteProfilePhoto(photoUri: string): Promise<boolean> {
  try {
    if (photoUri && photoUri.startsWith(FileSystem.documentDirectory || "")) {
      await FileSystem.deleteAsync(photoUri);
      return true;
    }
    return true;
  } catch (error) {
    console.error("Erro ao deletar foto:", error);
    return false;
  }
}

/**
 * Converte imagem para base64
 */
export async function imageToBase64(imageUri: string): Promise<string | null> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Erro ao converter para base64:", error);
    return null;
  }
}
