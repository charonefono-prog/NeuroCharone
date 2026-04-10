import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PatientCredentials {
  patientId: string;
  accessCode: string;
}

export interface PatientAuthState {
  isAuthenticated: boolean;
  patientId: string | null;
  patientName: string | null;
  loading: boolean;
}

const PATIENT_AUTH_KEY = "patient_auth";

/**
 * Hook para gerenciar autenticação de pacientes
 * Permite que pacientes visualizem seu próprio histórico de escalas
 */
export function usePatientAuth() {
  const [authState, setAuthState] = useState<PatientAuthState>({
    isAuthenticated: false,
    patientId: null,
    patientName: null,
    loading: true,
  });

  // Carregar autenticação ao montar
  useEffect(() => {
    loadPatientAuth();
  }, []);

  /**
   * Carrega dados de autenticação do paciente do AsyncStorage
   */
  const loadPatientAuth = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(PATIENT_AUTH_KEY);
      if (storedAuth) {
        const auth = JSON.parse(storedAuth);
        setAuthState({
          isAuthenticated: true,
          patientId: auth.patientId,
          patientName: auth.patientName,
          loading: false,
        });
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Erro ao carregar autenticação do paciente:", error);
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  /**
   * Autentica um paciente com ID e código de acesso
   */
  const loginPatient = async (
    patientId: string,
    patientName: string,
    accessCode: string
  ): Promise<boolean> => {
    try {
      // Validar código de acesso (formato simples: últimos 4 dígitos da data de nascimento)
      // Em produção, isso seria validado com o servidor
      if (!patientId || !accessCode || accessCode.length < 4) {
        return false;
      }

      const authData = {
        patientId,
        patientName,
        accessCode,
        loginDate: new Date().toISOString(),
      };

      await AsyncStorage.setItem(PATIENT_AUTH_KEY, JSON.stringify(authData));

      setAuthState({
        isAuthenticated: true,
        patientId,
        patientName,
        loading: false,
      });

      return true;
    } catch (error) {
      console.error("Erro ao fazer login do paciente:", error);
      return false;
    }
  };

  /**
   * Faz logout do paciente
   */
  const logoutPatient = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(PATIENT_AUTH_KEY);
      setAuthState({
        isAuthenticated: false,
        patientId: null,
        patientName: null,
        loading: false,
      });
    } catch (error) {
      console.error("Erro ao fazer logout do paciente:", error);
    }
  };

  return {
    ...authState,
    loginPatient,
    logoutPatient,
  };
}
