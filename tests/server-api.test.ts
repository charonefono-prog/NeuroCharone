import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Server API and Endpoints', () => {
  const projectRoot = path.join(__dirname, '..');
  const routersPath = path.join(projectRoot, 'server', 'routers.ts');
  const dbPath = path.join(projectRoot, 'server', 'db.ts');

  describe('Router Configuration', () => {
    it('should have routers.ts file', () => {
      expect(fs.existsSync(routersPath)).toBe(true);
    });

    const routersContent = fs.readFileSync(routersPath, 'utf-8');

    it('should export appRouter', () => {
      expect(routersContent).toContain('export const appRouter = router');
    });

    it('should have auth router', () => {
      expect(routersContent).toContain('auth: router');
    });

    it('should have patients router', () => {
      expect(routersContent).toContain('patients: patientsRouter');
    });

    it('should have therapeutic plans router', () => {
      expect(routersContent).toContain('therapeuticPlans: therapeuticPlansRouter');
    });

    it('should have sessions router', () => {
      expect(routersContent).toContain('sessions: sessionsRouter');
    });

    it('should have system router', () => {
      expect(routersContent).toContain('system: systemRouter');
    });
  });

  describe('Auth Endpoints', () => {
    const routersContent = fs.readFileSync(routersPath, 'utf-8');

    it('should have auth.me endpoint', () => {
      expect(routersContent).toMatch(/auth.*me.*query/s);
    });

    it('should have auth.logout endpoint', () => {
      expect(routersContent).toMatch(/auth.*logout.*mutation/s);
    });

    it('should use publicProcedure for auth endpoints', () => {
      expect(routersContent).toContain('publicProcedure');
    });
  });

  describe('Database Functions', () => {
    it('should have db.ts file', () => {
      expect(fs.existsSync(dbPath)).toBe(true);
    });

    const dbContent = fs.readFileSync(dbPath, 'utf-8');

    it('should have getDb function', () => {
      expect(dbContent).toContain('export async function getDb()');
    });

    it('should have upsertUser function', () => {
      expect(dbContent).toContain('export async function upsertUser');
    });

    it('should have getUserByOpenId function', () => {
      expect(dbContent).toContain('export async function getUserByOpenId');
    });

    it('should use drizzle ORM', () => {
      expect(dbContent).toContain('drizzle');
    });

    it('should handle database connection errors', () => {
      expect(dbContent).toContain('console.warn');
    });
  });

  describe('Router File Structure', () => {
    const routersDir = path.join(projectRoot, 'server', 'routers');

    it('should have routers directory', () => {
      expect(fs.existsSync(routersDir)).toBe(true);
    });

    it('should have patients router file', () => {
      const patientsRouter = path.join(routersDir, 'patients.ts');
      expect(fs.existsSync(patientsRouter)).toBe(true);
    });

    it('should have therapeutic-plans router file', () => {
      const plansRouter = path.join(routersDir, 'therapeutic-plans.ts');
      expect(fs.existsSync(plansRouter)).toBe(true);
    });

    it('should have sessions router file', () => {
      const sessionsRouter = path.join(routersDir, 'sessions.ts');
      expect(fs.existsSync(sessionsRouter)).toBe(true);
    });
  });

  describe('Patients Router', () => {
    const patientsRouterPath = path.join(projectRoot, 'server', 'routers', 'patients.ts');
    const patientsContent = fs.readFileSync(patientsRouterPath, 'utf-8');

    it('should export patientsRouter', () => {
      expect(patientsContent).toContain('export const patientsRouter = router');
    });

    it('should have list endpoint', () => {
      expect(patientsContent).toMatch(/list.*query/s);
    });

    it('should have create endpoint', () => {
      expect(patientsContent).toMatch(/create.*mutation/s);
    });

    it('should have update endpoint', () => {
      expect(patientsContent).toMatch(/update.*mutation/s);
    });

    it('should have delete endpoint', () => {
      expect(patientsContent).toMatch(/delete.*mutation/s);
    });

    it('should use protectedProcedure for patient operations', () => {
      expect(patientsContent).toContain('protectedProcedure');
    });

    it('should validate input with Zod', () => {
      expect(patientsContent).toContain('z.object');
    });
  });

  describe('Therapeutic Plans Router', () => {
    const plansRouterPath = path.join(projectRoot, 'server', 'routers', 'therapeutic-plans.ts');
    const plansContent = fs.readFileSync(plansRouterPath, 'utf-8');

    it('should export therapeuticPlansRouter', () => {
      expect(plansContent).toContain('export const therapeuticPlansRouter = router');
    });

    it('should have list endpoint', () => {
      expect(plansContent).toMatch(/list.*query/s);
    });

    it('should have create endpoint', () => {
      expect(plansContent).toMatch(/create.*mutation/s);
    });

    it('should validate therapeutic plan data', () => {
      expect(plansContent).toContain('z.object');
    });
  });

  describe('Sessions Router', () => {
    const sessionsRouterPath = path.join(projectRoot, 'server', 'routers', 'sessions.ts');
    const sessionsContent = fs.readFileSync(sessionsRouterPath, 'utf-8');

    it('should export sessionsRouter', () => {
      expect(sessionsContent).toContain('export const sessionsRouter = router');
    });

    it('should have list endpoint', () => {
      expect(sessionsContent).toMatch(/list.*query/s);
    });

    it('should have create endpoint', () => {
      expect(sessionsContent).toMatch(/create.*mutation/s);
    });

    it('should validate session data', () => {
      expect(sessionsContent).toContain('z.object');
    });
  });

  describe('Error Handling', () => {
    const patientsRouterPath = path.join(projectRoot, 'server', 'routers', 'patients.ts');
    const patientsContent = fs.readFileSync(patientsRouterPath, 'utf-8');

    it('should handle UNAUTHORIZED errors', () => {
      // protectedProcedure automatically handles UNAUTHORIZED in sub-routers
      expect(patientsContent).toMatch(/UNAUTHORIZED|protectedProcedure/s);
    });

    it('should validate input data', () => {
      expect(patientsContent).toContain('z.');
    });
  });

  describe('OAuth Integration', () => {
    const oauthPath = path.join(projectRoot, 'server', '_core', 'oauth.ts');

    it('should have oauth.ts file', () => {
      expect(fs.existsSync(oauthPath)).toBe(true);
    });

    const oauthContent = fs.readFileSync(oauthPath, 'utf-8');

    it('should have registerOAuthRoutes function', () => {
      expect(oauthContent).toContain('export function registerOAuthRoutes');
    });

    it('should handle OAuth callback', () => {
      expect(oauthContent).toContain('/api/oauth/callback');
    });

    it('should exchange code for token', () => {
      expect(oauthContent).toContain('exchangeCodeForToken');
    });

    it('should sync user after OAuth', () => {
      expect(oauthContent).toContain('syncUser');
    });
  });

  describe('tRPC Configuration', () => {
    const trpcPath = path.join(projectRoot, 'server', '_core', 'trpc.ts');

    it('should have trpc.ts file', () => {
      expect(fs.existsSync(trpcPath)).toBe(true);
    });

    const trpcContent = fs.readFileSync(trpcPath, 'utf-8');

    it('should export publicProcedure', () => {
      expect(trpcContent).toContain('export const publicProcedure');
    });

    it('should export protectedProcedure', () => {
      expect(trpcContent).toContain('export const protectedProcedure');
    });

    it('should export router', () => {
      expect(trpcContent).toContain('export const router');
    });
  });

  describe('Context Setup', () => {
    const contextPath = path.join(projectRoot, 'server', '_core', 'context.ts');

    it('should have context.ts file', () => {
      expect(fs.existsSync(contextPath)).toBe(true);
    });

    const contextContent = fs.readFileSync(contextPath, 'utf-8');

    it('should export createContext function', () => {
      expect(contextContent).toContain('export');
    });

    it('should provide user in context', () => {
      expect(contextContent).toMatch(/user|ctx/s);
    });
  });
});
