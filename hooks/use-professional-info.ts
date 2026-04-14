import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ProfessionalInfo {
  title: "Dr" | "Dra";
  firstName: string;
  lastName: string;
  registrationNumber: string;
  councilNumber: string;
  specialty: string;
  email?: string;
  phone?: string;
  photoUri?: string;
  electronicSignature?: string;
  signatureDate?: string;
}

const DEFAULT_PROFESSIONAL: ProfessionalInfo = {
  title: "Dr",
  firstName: "",
  lastName: "",
  registrationNumber: "",
  councilNumber: "",
  specialty: "",
  email: "",
  phone: "",
};

/**
 * CHAVE ÚNICA de armazenamento do profissional.
 * Antes existiam duas chaves ("@professional_info" e "professionalProfile")
 * que causavam conflito. Agora tudo usa "professionalProfile" (a mesma do Perfil).
 */
const STORAGE_KEY = "professionalProfile";

/**
 * Chave legada que era usada pela tela de Configurações.
 * Na primeira carga, migramos dados dela para a chave principal se necessário.
 */
const LEGACY_STORAGE_KEY = "@professional_info";

export function useProfessionalInfo() {
  const [professional, setProfessional] = useState<ProfessionalInfo>(DEFAULT_PROFESSIONAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfessionalInfo();
  }, []);

  const loadProfessionalInfo = async () => {
    try {
      // 1. Tentar carregar da chave principal (Perfil)
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfessional({ ...DEFAULT_PROFESSIONAL, ...parsed });
      } else {
        // 2. Se não existe, tentar migrar da chave legada (Configurações)
        const legacy = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          // Migrar para a chave principal
          const migrated: ProfessionalInfo = {
            ...DEFAULT_PROFESSIONAL,
            ...parsed,
          };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          // Remover chave legada para evitar confusão futura
          await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
          setProfessional(migrated);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do profissional:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfessionalInfo = useCallback(async (info: ProfessionalInfo) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(info));
      setProfessional(info);
      // Garantir que a chave legada seja removida
      await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Erro ao salvar dados do profissional:", error);
      return false;
    }
  }, []);

  /**
   * Recarregar dados do storage (útil quando outra tela salva)
   */
  const reloadProfessionalInfo = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfessional({ ...DEFAULT_PROFESSIONAL, ...parsed });
      }
    } catch (error) {
      console.error("Erro ao recarregar dados do profissional:", error);
    }
  }, []);

  return {
    professional,
    loading,
    saveProfessionalInfo,
    reloadProfessionalInfo,
  };
}
