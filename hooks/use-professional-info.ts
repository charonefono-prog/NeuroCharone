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
}

const DEFAULT_PROFESSIONAL: ProfessionalInfo = {
  title: "Dr",
  firstName: "Profissional",
  lastName: "de Saúde",
  registrationNumber: "N/A",
  specialty: "Terapia",
};

const STORAGE_KEY = "@professional_info";

export function useProfessionalInfo() {
  const [professional, setProfessional] = useState<ProfessionalInfo>(DEFAULT_PROFESSIONAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfessionalInfo();
  }, []);

  const loadProfessionalInfo = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfessional(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do profissional:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfessionalInfo = async (info: ProfessionalInfo) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(info));
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
