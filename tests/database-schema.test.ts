import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Database Schema Validation', () => {
  const projectRoot = path.join(__dirname, '..');
  const schemaPath = path.join(projectRoot, 'drizzle', 'schema.ts');

  it('should have schema.ts file', () => {
    expect(fs.existsSync(schemaPath)).toBe(true);
  });

  it('should have valid TypeScript syntax', () => {
    const content = fs.readFileSync(schemaPath, 'utf-8');
    expect(content).toContain('mysqlTable');
    expect(content).toContain('relations');
  });

  describe('Core Tables', () => {
    const content = fs.readFileSync(schemaPath, 'utf-8');

    it('should have users table', () => {
      expect(content).toContain('export const users = mysqlTable');
    });

    it('should have patients table', () => {
      expect(content).toContain('export const patients = mysqlTable');
    });

    it('should have therapeutic_plans table', () => {
      expect(content).toContain('export const therapeuticPlans = mysqlTable');
    });

    it('should have sessions table', () => {
      expect(content).toContain('export const sessions = mysqlTable');
    });
  });

  describe('Users Table Structure', () => {
    const content = fs.readFileSync(schemaPath, 'utf-8');

    it('should have id as primary key', () => {
      expect(content).toMatch(/users.*id.*primaryKey/s);
    });

    it('should have openId field (OAuth)', () => {
      expect(content).toMatch(/users.*openId.*unique/s);
    });

    it('should have email field', () => {
      expect(content).toMatch(/users.*email/s);
    });

    it('should have name field', () => {
      expect(content).toMatch(/users.*name/s);
    });

    it('should have role field (user/admin)', () => {
      expect(content).toMatch(/users.*role.*user.*admin/s);
    });

    it('should have timestamps', () => {
      expect(content).toMatch(/users.*createdAt.*timestamp/s);
      expect(content).toMatch(/users.*updatedAt.*timestamp/s);
    });

    it('should have professional fields', () => {
      expect(content).toMatch(/users.*specialty/s);
      expect(content).toMatch(/users.*professionalId/s);
    });
  });

  describe('Patients Table Structure', () => {
    const content = fs.readFileSync(schemaPath, 'utf-8');

    it('should have userId foreign key', () => {
      expect(content).toMatch(/patients.*userId/s);
    });

    it('should have fullName field', () => {
      expect(content).toMatch(/patients.*fullName/s);
    });

    it('should have birthDate field', () => {
      expect(content).toMatch(/patients.*birthDate/s);
    });

    it('should have CPF field', () => {
      expect(content).toMatch(/patients.*cpf/s);
    });

    it('should have contact information', () => {
      expect(content).toMatch(/patients.*phone/s);
      expect(content).toMatch(/patients.*email/s);
    });

    it('should have medical information', () => {
      expect(content).toMatch(/patients.*diagnosis/s);
      expect(content).toMatch(/patients.*medicalNotes/s);
    });

    it('should have status field', () => {
      expect(content).toMatch(/patients.*status/s);
    });

    it('should have timestamps', () => {
      expect(content).toMatch(/patients.*createdAt.*timestamp/s);
      expect(content).toMatch(/patients.*updatedAt.*timestamp/s);
    });
  });

  describe('Therapeutic Plans Table Structure', () => {
    const content = fs.readFileSync(schemaPath, 'utf-8');

    it('should have patientId foreign key', () => {
      expect(content).toMatch(/therapeuticPlans.*patientId/s);
    });

    it('should have objective field', () => {
      expect(content).toMatch(/therapeuticPlans.*objective/s);
    });

    it('should have targetRegions field (JSON)', () => {
      expect(content).toMatch(/therapeuticPlans.*targetRegions/s);
    });

    it('should have targetPoints field (JSON)', () => {
      expect(content).toMatch(/therapeuticPlans.*targetPoints/s);
    });

    it('should have frequency field', () => {
      expect(content).toMatch(/therapeuticPlans.*frequency/s);
    });

    it('should have totalDuration field', () => {
      expect(content).toMatch(/therapeuticPlans.*totalDuration/s);
    });

    it('should have isActive flag', () => {
      expect(content).toMatch(/therapeuticPlans.*isActive/s);
    });

    it('should have timestamps', () => {
      expect(content).toMatch(/therapeuticPlans.*createdAt.*timestamp/s);
      expect(content).toMatch(/therapeuticPlans.*updatedAt.*timestamp/s);
    });
  });

  describe('Sessions Table Structure', () => {
    const content = fs.readFileSync(schemaPath, 'utf-8');

    it('should have patientId foreign key', () => {
      expect(content).toMatch(/sessions.*patientId/s);
    });

    it('should have planId foreign key', () => {
      expect(content).toMatch(/sessions.*planId/s);
    });

    it('should have sessionDate field', () => {
      expect(content).toMatch(/sessions.*sessionDate/s);
    });

    it('should have duration field', () => {
      expect(content).toMatch(/sessions.*duration/s);
    });

    it('should have stimulatedPoints field (JSON)', () => {
      expect(content).toMatch(/sessions.*stimulatedPoints/s);
    });

    it('should have intensity field', () => {
      expect(content).toMatch(/sessions.*intensity/s);
    });

    it('should have observations field', () => {
      expect(content).toMatch(/sessions.*observations/s);
    });

    it('should have patientReactions field', () => {
      expect(content).toMatch(/sessions.*patientReactions/s);
    });

    it('should have nextSessionDate field', () => {
      expect(content).toMatch(/sessions.*nextSessionDate/s);
    });

    it('should have timestamps', () => {
      expect(content).toMatch(/sessions.*createdAt.*timestamp/s);
      expect(content).toMatch(/sessions.*updatedAt.*timestamp/s);
    });
  });

  describe('Table Relationships', () => {
    const content = fs.readFileSync(schemaPath, 'utf-8');

    it('should have usersRelations', () => {
      expect(content).toContain('export const usersRelations = relations');
    });

    it('should have patientsRelations', () => {
      expect(content).toContain('export const patientsRelations = relations');
    });

    it('should have therapeuticPlansRelations', () => {
      expect(content).toContain('export const therapeuticPlansRelations = relations');
    });

    it('should have sessionsRelations', () => {
      expect(content).toContain('export const sessionsRelations = relations');
    });

    it('users should have many patients', () => {
      expect(content).toMatch(/usersRelations.*many.*patients/s);
    });

    it('patients should belong to user', () => {
      expect(content).toMatch(/patientsRelations.*one.*users/s);
    });

    it('patients should have many therapeutic plans', () => {
      expect(content).toMatch(/patientsRelations.*many.*therapeuticPlans/s);
    });

    it('patients should have many sessions', () => {
      expect(content).toMatch(/patientsRelations.*many.*sessions/s);
    });

    it('therapeutic plans should belong to patient', () => {
      expect(content).toMatch(/therapeuticPlansRelations.*one.*patients/s);
    });

    it('therapeutic plans should have many sessions', () => {
      expect(content).toMatch(/therapeuticPlansRelations.*many.*sessions/s);
    });

    it('sessions should belong to patient', () => {
      expect(content).toMatch(/sessionsRelations.*one.*patients/s);
    });

    it('sessions should belong to plan', () => {
      expect(content).toMatch(/sessionsRelations.*one.*therapeuticPlans/s);
    });
  });

  describe('TypeScript Type Exports', () => {
    const content = fs.readFileSync(schemaPath, 'utf-8');

    it('should export User type', () => {
      expect(content).toContain('export type User = typeof users.$inferSelect');
    });

    it('should export InsertUser type', () => {
      expect(content).toContain('export type InsertUser = typeof users.$inferInsert');
    });

    it('should export Patient type', () => {
      expect(content).toContain('export type Patient = typeof patients.$inferSelect');
    });

    it('should export InsertPatient type', () => {
      expect(content).toContain('export type InsertPatient = typeof patients.$inferInsert');
    });

    it('should export TherapeuticPlan type', () => {
      expect(content).toContain('export type TherapeuticPlan = typeof therapeuticPlans.$inferSelect');
    });

    it('should export InsertTherapeuticPlan type', () => {
      expect(content).toContain('export type InsertTherapeuticPlan = typeof therapeuticPlans.$inferInsert');
    });

    it('should export Session type', () => {
      expect(content).toContain('export type Session = typeof sessions.$inferSelect');
    });

    it('should export InsertSession type', () => {
      expect(content).toContain('export type InsertSession = typeof sessions.$inferInsert');
    });
  });

  describe('Migrations', () => {
    const migrationsDir = path.join(projectRoot, 'drizzle', 'migrations');

    it('should have migrations directory', () => {
      expect(fs.existsSync(migrationsDir)).toBe(true);
    });

    it('should have migration files', () => {
      const files = fs.readdirSync(migrationsDir);
      expect(files.length).toBeGreaterThan(0);
    });
  });
});
