import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

export interface BackupData {
  version: string;
  timestamp: string;
  patients: any[];
  plans: any[];
  sessions: any[];
}

/**
 * Exporta todos os dados do aplicativo para um arquivo JSON
 */
export async function exportBackup(): Promise<string | null> {
  try {
    // Buscar todos os dados do AsyncStorage
    const patientsJson = await AsyncStorage.getItem("patients");
    const plansJson = await AsyncStorage.getItem("plans");
    const sessionsJson = await AsyncStorage.getItem("sessions");

    const patients = patientsJson ? JSON.parse(patientsJson) : [];
    const plans = plansJson ? JSON.parse(plansJson) : [];
    const sessions = sessionsJson ? JSON.parse(sessionsJson) : [];

    const backupData: BackupData = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      patients,
      plans,
      sessions,
    };

    // Criar nome do arquivo com data
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const fileName = `neurolasermap_backup_${dateStr}.json`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Salvar arquivo
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2));

    return fileUri;
  } catch (error) {
    console.error("[BackupSystem] Erro ao exportar backup:", error);
    return null;
  }
}

/**
 * Compartilha o arquivo de backup
 */
export async function shareBackup(): Promise<boolean> {
  try {
    const fileUri = await exportBackup();
    
    if (!fileUri) {
      Alert.alert("Erro", "Não foi possível criar o arquivo de backup.");
      return false;
    }

    if (Platform.OS === "web") {
      // No web, fazer download do arquivo
      const content = await FileSystem.readAsStringAsync(fileUri);
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileUri.split("/").pop() || "backup.json";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // No mobile, usar expo-sharing
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Compartilhar Backup do NeuroLaserMap",
        });
      } else {
        Alert.alert("Erro", "Compartilhamento não disponível neste dispositivo.");
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("[BackupSystem] Erro ao compartilhar backup:", error);
    Alert.alert("Erro", "Não foi possível compartilhar o backup.");
    return false;
  }
}

/**
 * Importa dados de um arquivo de backup
 */
export async function importBackup(fileUri: string): Promise<boolean> {
  try {
    // Ler arquivo
    const content = await FileSystem.readAsStringAsync(fileUri);
    const backupData: BackupData = JSON.parse(content);

    // Validar estrutura do backup
    if (!backupData.version || !backupData.timestamp || !backupData.patients) {
      Alert.alert("Erro", "Arquivo de backup inválido.");
      return false;
    }

    // Confirmar restauração
    return new Promise((resolve) => {
      Alert.alert(
        "Restaurar Backup",
        `Deseja restaurar o backup de ${new Date(backupData.timestamp).toLocaleDateString()}?\n\nIsto substituirá todos os dados atuais.`,
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => resolve(false),
          },
          {
            text: "Restaurar",
            style: "destructive",
            onPress: async () => {
              try {
                // Restaurar dados
                await AsyncStorage.setItem("patients", JSON.stringify(backupData.patients));
                await AsyncStorage.setItem("plans", JSON.stringify(backupData.plans || []));
                await AsyncStorage.setItem("sessions", JSON.stringify(backupData.sessions || []));

                Alert.alert("Sucesso", "Backup restaurado com sucesso! O aplicativo será recarregado.");
                
                // Recarregar aplicativo
                if (Platform.OS === "web") {
                  window.location.reload();
                } else {
                  // No mobile, o usuário precisará fechar e reabrir o app
                  Alert.alert("Atenção", "Por favor, feche e reabra o aplicativo para aplicar as alterações.");
                }
                
                resolve(true);
              } catch (error) {
                console.error("[BackupSystem] Erro ao restaurar backup:", error);
                Alert.alert("Erro", "Não foi possível restaurar o backup.");
                resolve(false);
              }
            },
          },
        ]
      );
    });
  } catch (error) {
    console.error("[BackupSystem] Erro ao importar backup:", error);
    Alert.alert("Erro", "Não foi possível ler o arquivo de backup.");
    return false;
  }
}

/**
 * Verifica se há backup recente (últimos 7 dias)
 */
export async function hasRecentBackup(): Promise<boolean> {
  try {
    const lastBackupStr = await AsyncStorage.getItem("lastBackupDate");
    if (!lastBackupStr) return false;

    const lastBackup = new Date(lastBackupStr);
    const now = new Date();
    const daysDiff = (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24);

    return daysDiff < 7;
  } catch (error) {
    return false;
  }
}

/**
 * Registra a data do último backup
 */
export async function updateLastBackupDate(): Promise<void> {
  try {
    await AsyncStorage.setItem("lastBackupDate", new Date().toISOString());
  } catch (error) {
    console.error("[BackupSystem] Erro ao atualizar data do backup:", error);
  }
}

/**
 * Sugere fazer backup se necessário
 */
export async function suggestBackupIfNeeded(): Promise<void> {
  try {
    const hasRecent = await hasRecentBackup();
    
    if (!hasRecent) {
      Alert.alert(
        "Backup Recomendado",
        "Você não fez backup dos seus dados nos últimos 7 dias. Deseja fazer um backup agora?",
        [
          {
            text: "Mais tarde",
            style: "cancel",
          },
          {
            text: "Fazer Backup",
            onPress: async () => {
              const success = await shareBackup();
              if (success) {
                await updateLastBackupDate();
              }
            },
          },
        ]
      );
    }
  } catch (error) {
    console.error("[BackupSystem] Erro ao sugerir backup:", error);
  }
}
