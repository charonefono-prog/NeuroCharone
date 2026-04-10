/**
 * Sistema de Fila para AsyncStorage
 * 
 * Garante que operações de leitura/escrita sejam processadas sequencialmente
 * para evitar perda de dados em operações concorrentes.
 */

type QueuedOperation<T> = () => Promise<T>;

class StorageQueue {
  private queue: Array<QueuedOperation<any>> = [];
  private isProcessing = false;

  /**
   * Adiciona uma operação à fila e aguarda sua execução
   */
  async enqueue<T>(operation: QueuedOperation<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });

      this.process();
    });
  }

  /**
   * Processa a fila sequencialmente
   */
  private async process(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        const operation = this.queue.shift();
        if (operation) {
          await operation();
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Retorna o tamanho atual da fila
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Verifica se está processando
   */
  isProcessingNow(): boolean {
    return this.isProcessing;
  }

  /**
   * Limpa a fila (usar com cuidado!)
   */
  clear(): void {
    this.queue = [];
  }
}

// Exportar instância singleton
export const storageQueue = new StorageQueue();
