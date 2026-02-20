import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'charone_neurolasermap_secret_2026';

export interface User {
  id: string;
  email: string;
  password?: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  isActive: boolean;
}

export interface AuthToken {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Comparar senha
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Gerar token JWT
export function generateToken(user: User): string {
  const payload: AuthToken = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 horas
  };

  return jwt.sign(payload, JWT_SECRET);
}

// Verificar token JWT
export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch (error) {
    return null;
  }
}

// Usuários de teste (em produção, usar banco de dados)
export const TEST_USERS: User[] = [
  {
    id: 'admin-001',
    email: 'charonejr@gmail.com',
    password: '442266', // será hasheado
    name: 'Carlos Charone',
    role: 'admin',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: 'user-001',
    email: 'teste1@email.com',
    password: 'senha123',
    name: 'Usuário Teste 1',
    role: 'user',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: 'user-002',
    email: 'teste2@email.com',
    password: 'senha123',
    name: 'Usuário Teste 2',
    role: 'user',
    createdAt: new Date(),
    isActive: true,
  },
];
