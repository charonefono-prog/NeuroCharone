-- Inserir usuário admin
-- Senha: admin123
-- Hash SHA256: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
INSERT INTO users (
  email, 
  password, 
  name, 
  role, 
  isActive, 
  approvedAt, 
  approvedBy, 
  loginMethod, 
  createdAt, 
  updatedAt, 
  lastSignedIn
) VALUES (
  'charonejr@gmail.com',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'Admin',
  'admin',
  true,
  NOW(),
  'system',
  'email',
  NOW(),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = 'Admin',
  role = 'admin',
  isActive = true,
  approvedAt = NOW(),
  password = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  updatedAt = NOW();
