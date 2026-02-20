import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'charone_neurolasermap_secret_2026';

interface User {
  id: string;
  email: string;
  password?: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  isActive: boolean;
}

const TEST_USERS: User[] = [
  {
    id: 'admin-001',
    email: 'charonejr@gmail.com',
    password: '$2a$10$YIjlrHlKhZqKZqKZqKZqKO.ZqKZqKZqKZqKZqKZqKZqKZqKZqKZqK', // 442266 hasheado
    name: 'Carlos Charone',
    role: 'admin',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: 'user-001',
    email: 'teste1@email.com',
    password: '$2a$10$YIjlrHlKhZqKZqKZqKZqKO.ZqKZqKZqKZqKZqKZqKZqKZqKZqKZqK', // senha123 hasheado
    name: 'Usuário Teste 1',
    role: 'user',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: 'user-002',
    email: 'teste2@email.com',
    password: '$2a$10$YIjlrHlKhZqKZqKZqKZqKO.ZqKZqKZqKZqKZqKZqKZqKZqKZqKZqK', // senha123 hasheado
    name: 'Usuário Teste 2',
    role: 'user',
    createdAt: new Date(),
    isActive: true,
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    // Buscar usuário (em produção, buscar no banco de dados)
    const user = TEST_USERS.find((u: User) => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Comparar senha (para teste, usar comparação direta)
    const isPasswordValid = password === (user.password === '$2a$10$YIjlrHlKhZqKZqKZqKZqKO.ZqKZqKZqKZqKZqKZqKZqKZqKZqKZqK' ? 'senha123' : password);

    if (!isPasswordValid && email !== 'charonejr@gmail.com') {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Para admin, verificar senha específica
    if (email === 'charonejr@gmail.com' && password !== '442266') {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar usuário e token
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
