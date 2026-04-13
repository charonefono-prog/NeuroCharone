-- Inserir usuário admin
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
  '8d969eef6ecad3c29a3a873fba2d9f7f3c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d',
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
  updatedAt = NOW();
