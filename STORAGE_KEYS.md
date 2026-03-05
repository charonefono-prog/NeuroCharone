# Complete AsyncStorage Keys Inventory

| Key | Source File | Data Type |
|-----|------------|-----------|
| `@neuromap:patients` | lib/local-storage.ts | Patient[] |
| `@neuromap:plans` | lib/local-storage.ts | TherapeuticPlan[] |
| `@neuromap:sessions` | lib/local-storage.ts | Session[] |
| `clinical_scales_responses` | lib/scale-storage.ts | ScaleResponse[] |
| `professionalProfile` | hooks/use-professional-info.ts, app/profile.tsx | ProfessionalInfo |
| `@neurolasermap:plan_templates` | lib/plan-templates.ts | PlanTemplate[] |
| `therapeutic_cycles` | app/cycles.tsx | TherapeuticCycle[] |
| `@neurolasermap:audit_logs` | lib/audit-log.ts | AuditLog[] |
| `@neuromap:scheduled_notifications` | lib/notification-service.ts | Notification[] |
| `@neurolasermap:notifications` | lib/notifications.ts | Notification[] |
| `@neurolasermap:reminder_advance` | lib/notifications.ts | string (minutes) |
| `@neuromap:progress_goals` | lib/progress-goals.ts | ProgressGoal[] |
| `@neuromap:progress_alerts` | lib/progress-goals.ts | ProgressAlert[] |
| `@neurolasermap/search_history` | lib/search-history.ts | SearchEntry[] |
| `patient_auth` | hooks/use-patient-auth.ts | PatientAuth |
| `lastBackupDate` | lib/backup-system.ts | string (ISO date) |

## Legacy keys (old backup-system.ts uses wrong keys):
| `patients` | lib/backup-system.ts | WRONG - should be @neuromap:patients |
| `plans` | lib/backup-system.ts | WRONG - should be @neuromap:plans |
| `sessions` | lib/backup-system.ts | WRONG - should be @neuromap:sessions |
