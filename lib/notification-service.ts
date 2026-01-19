/**
 * Serviço de Notificações de Sessão
 * Gerencia alertas automáticos para próximas sessões agendadas
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScheduledNotification {
  id: string;
  sessionId: string;
  patientName: string;
  scheduledDate: string;
  protocol: string;
  notificationId?: string;
  enabled: boolean;
  createdAt: string;
}

const NOTIFICATIONS_KEY = '@neuromap:scheduled_notifications';

// Configurar o comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  } as any),
});

/**
 * Agendar notificação para uma sessão
 */
export async function scheduleSessionNotification(
  sessionId: string,
  patientName: string,
  scheduledDate: Date,
  protocol: string,
  minutesBefore: number = 60 // Notificar 1 hora antes por padrão
): Promise<ScheduledNotification | null> {
  try {
    const notificationDate = new Date(scheduledDate);
    notificationDate.setMinutes(notificationDate.getMinutes() - minutesBefore);

    // Verificar se a data é no futuro
    if (notificationDate < new Date()) {
      console.warn('Data de notificação já passou');
      return null;
    }

    // Agendar a notificação
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📅 Sessão de Neuromodulação',
        body: `${patientName} - ${protocol}`,
        subtitle: `Sessão em ${minutesBefore} minutos`,
        data: {
          sessionId,
          patientName,
          protocol,
          type: 'session_reminder',
        },
      },
      trigger: {
        type: 'date',
        date: notificationDate,
      } as any,
    });

    // Salvar registro da notificação
    const notification: ScheduledNotification = {
      id: `notif_${Date.now()}`,
      sessionId,
      patientName,
      scheduledDate: scheduledDate.toISOString(),
      protocol,
      notificationId,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    const notifications = await getScheduledNotifications();
    notifications.push(notification);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

    return notification;
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    return null;
  }
}

/**
 * Cancelar notificação agendada
 */
export async function cancelSessionNotification(sessionId: string): Promise<boolean> {
  try {
    const notifications = await getScheduledNotifications();
    const notification = notifications.find(n => n.sessionId === sessionId);

    if (notification?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notification.notificationId);
    }

    // Remover do armazenamento
    const updated = notifications.filter(n => n.sessionId !== sessionId);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));

    return true;
  } catch (error) {
    console.error('Erro ao cancelar notificação:', error);
    return false;
  }
}

/**
 * Obter todas as notificações agendadas
 */
export async function getScheduledNotifications(): Promise<ScheduledNotification[]> {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao obter notificações:', error);
    return [];
  }
}

/**
 * Obter notificações ativas (habilitadas)
 */
export async function getActiveNotifications(): Promise<ScheduledNotification[]> {
  const notifications = await getScheduledNotifications();
  return notifications.filter(n => n.enabled);
}

/**
 * Ativar/desativar notificação
 */
export async function toggleNotification(notificationId: string, enabled: boolean): Promise<boolean> {
  try {
    const notifications = await getScheduledNotifications();
    const notification = notifications.find(n => n.id === notificationId);

    if (notification) {
      notification.enabled = enabled;

      if (!enabled && notification.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notification.notificationId);
      }

      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao alternar notificação:', error);
    return false;
  }
}

/**
 * Limpar notificações expiradas
 */
export async function cleanupExpiredNotifications(): Promise<number> {
  try {
    const notifications = await getScheduledNotifications();
    const now = new Date();
    const expired = notifications.filter(n => new Date(n.scheduledDate) < now);

    for (const notification of expired) {
      if (notification.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notification.notificationId);
      }
    }

    const updated = notifications.filter(n => new Date(n.scheduledDate) >= now);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));

    return expired.length;
  } catch (error) {
    console.error('Erro ao limpar notificações:', error);
    return 0;
  }
}

/**
 * Obter próxima sessão agendada
 */
export async function getNextScheduledSession(): Promise<ScheduledNotification | null> {
  try {
    const notifications = await getActiveNotifications();
    if (notifications.length === 0) return null;

    const sorted = notifications.sort((a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );

    return sorted[0] || null;
  } catch (error) {
    console.error('Erro ao obter próxima sessão:', error);
    return null;
  }
}

/**
 * Obter notificações para um paciente específico
 */
export async function getPatientNotifications(patientName: string): Promise<ScheduledNotification[]> {
  try {
    const notifications = await getScheduledNotifications();
    return notifications.filter(n => n.patientName === patientName);
  } catch (error) {
    console.error('Erro ao obter notificações do paciente:', error);
    return [];
  }
}

/**
 * Solicitar permissão de notificações
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissão:', error);
    return false;
  }
}

/**
 * Verificar se notificações estão habilitadas
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return false;
  }
}
