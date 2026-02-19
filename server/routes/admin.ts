import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { getDb } from '../db';
import { sql } from 'drizzle-orm';

const router = Router();

// Middleware para verificar autenticação admin
async function verifyAdminToken(req: Request, res: Response, next: any) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: 'Token expirado' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ message: 'Erro ao conectar ao banco' });
    }

    const result = await db.execute(sql`
      SELECT id, email FROM auth_users WHERE id = ${payload.userId} AND email = 'charonejr@gmail.com'
    `);

    if (!result || (result as any).length === 0) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    (req as any).user = (result as any)[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

router.use(verifyAdminToken);

// GET /admin/users - Listar todos os usuários
router.get('/users', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ message: 'Erro ao conectar ao banco' });
    }

    const result = await db.execute(sql`
      SELECT id, email, full_name, is_blocked, expires_at, last_login, login_count
      FROM auth_users
      ORDER BY created_at DESC
    `);

    return res.status(200).json(result || []);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro ao listar usuários' });
  }
});

// POST /admin/users - Adicionar novo usuário
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, full_name, days } = req.body;

    if (!email || !full_name) {
      return res.status(400).json({ message: 'Email e nome são obrigatórios' });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ message: 'Erro ao conectar ao banco' });
    }

    // Gerar senha padrão
    const defaultPassword = 'senha123';
    const passwordHash = crypto.createHash('sha256').update(defaultPassword).digest('hex');

    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (days || 30));

    await db.execute(sql`
      INSERT INTO auth_users (email, password_hash, full_name, expires_at)
      VALUES (${email}, ${passwordHash}, ${full_name}, ${expiresAt.toISOString()})
    `);

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      email,
      password: defaultPassword,
    });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    if (error.message?.includes('Duplicate')) {
      return res.status(400).json({ message: 'Email já existe' });
    }
    return res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

// POST /admin/users/:id/block - Bloquear/desbloquear usuário
router.post('/users/:id/block', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_blocked } = req.body;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ message: 'Erro ao conectar ao banco' });
    }

    await db.execute(sql`
      UPDATE auth_users
      SET is_blocked = ${is_blocked}
      WHERE id = ${parseInt(id)}
    `);

    return res.status(200).json({
      message: is_blocked ? 'Usuário bloqueado' : 'Usuário desbloqueado',
    });
  } catch (error) {
    console.error('Erro ao bloquear usuário:', error);
    return res.status(500).json({ message: 'Erro ao bloquear usuário' });
  }
});

// DELETE /admin/users/:id - Deletar usuário
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ message: 'Erro ao conectar ao banco' });
    }

    await db.execute(sql`
      DELETE FROM auth_users WHERE id = ${parseInt(id)}
    `);

    return res.status(200).json({ message: 'Usuário deletado' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
});

// GET /admin/logs - Ver logs de acesso
router.get('/logs', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ message: 'Erro ao conectar ao banco' });
    }

    const result = await db.execute(sql`
      SELECT l.id, l.user_id, u.email, l.login_time, l.ip_address, l.success
      FROM login_logs l
      JOIN auth_users u ON l.user_id = u.id
      ORDER BY l.login_time DESC
      LIMIT 100
    `);

    return res.status(200).json(result || []);
  } catch (error) {
    console.error('Erro ao listar logs:', error);
    return res.status(500).json({ message: 'Erro ao listar logs' });
  }
});

export { router as adminRouter };
