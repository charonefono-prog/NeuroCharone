import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Solicitar permissões de notificação
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

// Agendar lembrete de sessão
export async function scheduleSessionReminder(
  patientName: string,
  sessionDate: Date,
  advanceMinutes: number = 60
): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log("Permissão de notificação não concedida");
      return null;
    }

    const reminderDate = new Date(sessionDate.getTime() - advanceMinutes * 60 * 1000);
    const now = new Date();

    if (reminderDate <= now) {
      console.log("Data do lembrete já passou");
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Sessão",
        body: `Sessão com ${patientName} em ${advanceMinutes} minutos`,
        data: { patientName, sessionDate: sessionDate.toISOString() },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });

    // Salvar ID da notificação
    await saveNotificationId(notificationId, sessionDate.toISOString());

    return notificationId;
  } catch (error) {
    console.error("Erro ao agendar lembrete:", error);
    return null;
  }
}

// Cancelar lembrete
export async function cancelSessionReminder(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    await removeNotificationId(notificationId);
  } catch (error) {
    console.error("Erro ao cancelar lembrete:", error);
  }
}

// Cancelar todos os lembretes
export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem("@neurolasermap:notifications");
  } catch (error) {
    console.error("Erro ao cancelar todos os lembretes:", error);
  }
}

// Obter lembretes agendados
export async function getScheduledReminders(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Erro ao obter lembretes:", error);
    return [];
  }
}

// Salvar ID de notificação
async function saveNotificationId(notificationId: string, sessionDate: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem("@neurolasermap:notifications");
    const notifications = stored ? JSON.parse(stored) : {};
    notifications[sessionDate] = notificationId;
    await AsyncStorage.setItem("@neurolasermap:notifications", JSON.stringify(notifications));
  } catch (error) {
    console.error("Erro ao salvar ID de notificação:", error);
  }
}

// Remover ID de notificação
async function removeNotificationId(notificationId: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem("@neurolasermap:notifications");
    if (!stored) return;

    const notifications = JSON.parse(stored);
    const sessionDate = Object.keys(notifications).find(
      (key) => notifications[key] === notificationId
    );

    if (sessionDate) {
      delete notifications[sessionDate];
      await AsyncStorage.setItem("@neurolasermap:notifications", JSON.stringify(notifications));
    }
  } catch (error) {
    console.error("Erro ao remover ID de notificação:", error);
  }
}

// Obter configuração de antecedência padrão
export async function getReminderAdvance(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem("@neurolasermap:reminder_advance");
    return stored ? parseInt(stored, 10) : 60; // Padrão: 60 minutos
  } catch (error) {
    console.error("Erro ao obter antecedência do lembrete:", error);
    return 60;
  }
}

// Salvar configuração de antecedência
export async function setReminderAdvance(minutes: number): Promise<void> {
  try {
    await AsyncStorage.setItem("@neurolasermap:reminder_advance", minutes.toString());
  } catch (error) {
    console.error("Erro ao salvar antecedência do lembrete:", error);
  }
}
