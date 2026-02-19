import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { getDb } from '../db';
import { sql } from 'drizzle-orm';

const router = Router();

// Hash password
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate JWT token (simplified)
function generateToken(userId: number): string {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Query database using raw SQL
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ message: 'Erro ao conectar ao banco de dados' });
    }

    const result = await db.execute(sql`
      SELECT id, email, full_name, is_blocked, expires_at, password_hash
      FROM auth_users
      WHERE email = ${email}
    `);

    if (!result || ((result as any).length === 0)) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const user = result[0] as any;

    // Check if blocked
    if (user.is_blocked) {
      return res.status(403).json({ message: 'Sua conta foi bloqueada' });
    }

    // Check if expired
    const now = new Date();
    if (new Date(user.expires_at) < now) {
      return res.status(403).json({ message: 'Seu período de teste expirou' });
    }

    // Verify password
    const passwordHash = hashPassword(password);
    if (user.password_hash !== passwordHash) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Update last login
    const db2 = await getDb();
    if (db2) {
      await db2.execute(sql`
        UPDATE auth_users 
        SET last_login = NOW(), login_count = login_count + 1 
        WHERE id = ${user.id}
      `);
    }

    // Generate token
    const token = generateToken(user.id);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Verify token endpoint
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Decode token
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: 'Token expirado' });
    }

    // Get user from database
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ message: 'Erro ao conectar ao banco de dados' });
    }

    const result = await db.execute(sql`
      SELECT id, email, full_name, is_blocked 
      FROM auth_users 
      WHERE id = ${payload.userId}
    `);

    if (!result || ((result as any).length === 0)) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const user = result[0] as any;

    if (user.is_blocked) {
      return res.status(403).json({ message: 'Conta bloqueada' });
    }

    return res.status(200).json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
});

// Export router
export { router as authRouter };


