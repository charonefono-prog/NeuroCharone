import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, ActivityIndicator } from 'react-native';
import { cn } from '@/lib/utils';

interface UpdateNotification {
  version: string;
  releaseDate?: string;
  releaseNotes?: string;
}

interface UpdateProgress {
  percent: number;
  bytesPerSecond: number;
  total: number;
  transferred: number;
}

export function UpdateNotificationComponent() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateNotification | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<UpdateProgress | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Verificar se estamos em Electron
  const isElectron = typeof window !== 'undefined' && (window as any).updater;

  useEffect(() => {
    if (!isElectron) return;

    const updater = (window as any).updater;

    // Listener para atualização disponível
    updater.onUpdateAvailable((data: UpdateNotification) => {
      setUpdateInfo(data);
      setUpdateAvailable(true);
      setShowModal(true);
    });

    // Listener para atualização baixada
    updater.onUpdateDownloaded((data: UpdateNotification) => {
      setUpdateDownloaded(true);
      setIsDownloading(false);
      setUpdateInfo(data);
    });

    // Listener para progresso do download
    updater.onUpdateProgress((data: UpdateProgress) => {
      setDownloadProgress(data);
    });

    // Listener para erro
    updater.onUpdateError((data: { message: string }) => {
      console.error('Erro ao atualizar:', data.message);
      setIsDownloading(false);
    });

    // Verificar atualizações ao iniciar
    checkForUpdates();

    // Verificar atualizações a cada 1 hora
    const interval = setInterval(checkForUpdates, 3600000);
    return () => clearInterval(interval);
  }, [isElectron]);

  const checkForUpdates = async () => {
    if (!isElectron) return;

    try {
      const updater = (window as any).updater;
      const result = await updater.checkForUpdates();

      if (result.success && result.updateAvailable) {
        setUpdateInfo({
          version: result.version,
        });
        setUpdateAvailable(true);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    }
  };

  const handleDownload = async () => {
    if (!isElectron) return;

    try {
      setIsDownloading(true);
      const updater = (window as any).updater;
      const result = await updater.downloadUpdate();

      if (!result.success) {
        console.error('Erro ao baixar atualização:', result.error);
        setIsDownloading(false);
      }
    } catch (error) {
      console.error('Erro ao baixar atualização:', error);
      setIsDownloading(false);
    }
  };

  const handleInstall = async () => {
    if (!isElectron) return;

    try {
      const updater = (window as any).updater;
      await updater.installUpdate();
    } catch (error) {
      console.error('Erro ao instalar atualização:', error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setUpdateAvailable(false);
    setUpdateDownloaded(false);
    setIsDownloading(false);
    setDownloadProgress(null);
  };

  if (!isElectron) return null;

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-background rounded-2xl p-6 w-full max-w-sm shadow-lg">
          {/* Header */}
          <Text className="text-2xl font-bold text-foreground mb-2">
            {updateDownloaded ? 'Atualização Pronta' : 'Atualização Disponível'}
          </Text>

          <Text className="text-sm text-muted mb-4">
            Versão {updateInfo?.version || 'desconhecida'}
          </Text>

          {/* Progresso do Download */}
          {isDownloading && downloadProgress && (
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-muted">Baixando...</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {downloadProgress.percent}%
                </Text>
              </View>

              <View className="h-2 bg-surface rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary"
                  style={{ width: `${downloadProgress.percent}%` }}
                />
              </View>

              <Text className="text-xs text-muted mt-2">
                {(downloadProgress.bytesPerSecond / 1024 / 1024).toFixed(2)} MB/s
              </Text>
            </View>
          )}

          {/* Descrição */}
          {updateInfo?.releaseNotes && (
            <View className="mb-4 p-3 bg-surface rounded-lg max-h-32">
              <Text className="text-xs text-muted">
                {updateInfo.releaseNotes}
              </Text>
            </View>
          )}

          {/* Botões */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleCancel}
              className="flex-1"
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View className="border border-border rounded-lg py-3 items-center">
                <Text className="text-foreground font-semibold">
                  {updateDownloaded ? 'Depois' : 'Cancelar'}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={updateDownloaded ? handleInstall : handleDownload}
              disabled={isDownloading}
              className="flex-1"
              style={({ pressed }) => [
                {
                  opacity: pressed && !isDownloading ? 0.9 : 1,
                },
              ]}
            >
              <View className="bg-primary rounded-lg py-3 items-center flex-row justify-center gap-2">
                {isDownloading && <ActivityIndicator color="white" size="small" />}
                <Text className="text-background font-semibold">
                  {updateDownloaded ? 'Instalar Agora' : 'Baixar'}
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Rodapé */}
          <Text className="text-xs text-muted text-center mt-4">
            {isDownloading
              ? 'Não feche o aplicativo durante o download'
              : updateDownloaded
                ? 'A atualização será instalada ao reiniciar'
                : 'Você será notificado quando estiver pronto'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
