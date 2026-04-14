import { type Patient, type TherapeuticPlan, type Session } from "./local-storage";
import { type AdvancedFilters } from "@/components/advanced-filters-modal";

export interface PatientWithData {
  patient: Patient;
  plans: TherapeuticPlan[];
  sessions: Session[];
}

/**
 * Filtra pacientes com base nos critérios avançados
 */
export function filterPatients(
  patientsWithData: PatientWithData[],
  filters: AdvancedFilters
): PatientWithData[] {
  return patientsWithData.filter((item) => {
    const { patient, plans, sessions } = item;

    // Filtro por diagnóstico
    if (filters.diagnosis && filters.diagnosis.trim().length > 0) {
      const diagnosisLower = filters.diagnosis.toLowerCase().trim();
      const patientDiagnosis = (patient.diagnosis || "").toLowerCase();
      
      if (!patientDiagnosis.includes(diagnosisLower)) {
        return false;
      }
    }

    // Filtro por status
    if (filters.status && filters.status !== "all") {
      if (patient.status !== filters.status) {
        return false;
      }
    }

    // Filtro por período de tratamento (data de criação do paciente)
    if (filters.startDateFrom || filters.startDateTo) {
      const patientDate = new Date(patient.createdAt);
      
      if (filters.startDateFrom) {
        const fromDate = parseDateString(filters.startDateFrom);
        if (fromDate && patientDate < fromDate) {
          return false;
        }
      }
      
      if (filters.startDateTo) {
        const toDate = parseDateString(filters.startDateTo);
        if (toDate) {
          // Adicionar 1 dia para incluir o dia completo
          toDate.setDate(toDate.getDate() + 1);
          if (patientDate >= toDate) {
            return false;
          }
        }
      }
    }

    // Filtro por regiões cerebrais estimuladas
    if (filters.regions && filters.regions.length > 0) {
      // Coletar todas as regiões estimuladas nos planos do paciente
      const patientRegions = new Set<string>();
      
      plans.forEach((plan) => {
        plan.targetRegions.forEach((region) => {
          patientRegions.add(region);
        });
      });

      // Verificar se pelo menos uma das regiões filtradas está presente
      const hasMatchingRegion = filters.regions.some((filterRegion) =>
        patientRegions.has(filterRegion)
      );

      if (!hasMatchingRegion) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Converte string de data DD/MM/AAAA para objeto Date
 */
function parseDateString(dateStr: string): Date | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexed
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31) return null;
  if (month < 0 || month > 11) return null;
  if (year < 1900 || year > 2100) return null;

  return new Date(year, month, day);
}

/**
 * Conta quantos filtros estão ativos
 */
export function countActiveFilters(filters: AdvancedFilters): number {
  return [
    filters.diagnosis && filters.diagnosis.length > 0,
    filters.status && filters.status !== "all",
    filters.startDateFrom && filters.startDateFrom.length > 0,
    filters.startDateTo && filters.startDateTo.length > 0,
    filters.regions && filters.regions.length > 0,
  ].filter(Boolean).length;
}

/**
 * Verifica se há algum filtro ativo
 */
export function hasActiveFilters(filters: AdvancedFilters): boolean {
  return countActiveFilters(filters) > 0;
}

/**
 * Retorna filtros vazios/padrão
 */
export function getDefaultFilters(): AdvancedFilters {
  return {
    diagnosis: "",
    status: "all",
    startDateFrom: "",
    startDateTo: "",
    regions: [],
  };
}
