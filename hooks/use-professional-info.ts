import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ProfessionalInfo {
  title: "Dr" | "Dra";
  firstName: string;
  lastName: string;
  registrationNumber: string;
  specialty: string;
  email?: string;
  phone?: string;
  councilNumber?: string;
  electronicSignature?: string;
  signatureDate?: string;
}

const DEFAULT_PROFESSIONAL: ProfessionalInfo = {
  title: "Dr",
  firstName: "Profissional",
  lastName: "de Saúde",
  registrationNumber: "N/A",
  specialty: "Terapia",
};

const STORAGE_KEY = "@professional_info";
const PROFILE_KEY = "professionalProfile";

export function useProfessionalInfo() {
  const [professional, setProfessional] = useState<ProfessionalInfo>(DEFAULT_PROFESSIONAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfessionalInfo();
  }, []);

  const loadProfessionalInfo = async () => {
    try {
      // Tenta carregar de ambas as chaves e mescla os dados
      const storedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);

      let merged: ProfessionalInfo = { ...DEFAULT_PROFESSIONAL };

      // Dados de Settings (chave antiga)
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        merged = { ...merged, ...parsed };
      }

      // Dados de Profile (chave nova) - sobrescreve se existir
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        merged = { ...merged, ...parsed };
      }

      setProfessional(merged);
    } catch (error) {
      console.error("Erro ao carregar dados do profissional:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfessionalInfo = async (info: ProfessionalInfo) => {
    try {
      // Salva em ambas as chaves para manter compatibilidade
      const data = JSON.stringify(info);
      await AsyncStorage.setItem(STORAGE_KEY, data);
      await AsyncStorage.setItem(PROFILE_KEY, data);
      setProfessional(info);
      return true;
    } catch (error) {
      console.error("Erro ao salvar dados do profissional:", error);
      return false;
    }
  };

  return {
    professional,
    loading,
    saveProfessionalInfo,
  };
}
