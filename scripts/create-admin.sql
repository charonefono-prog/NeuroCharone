-- Inserir usuário admin
INSERT INTO users (openId, email, name, role, loginMethod, lastSignedIn, createdAt, updatedAt)
VALUES (
  'admin-charone-12345',
  'charonejr@gmail.com',
  'Admin',
  'admin',
  'email',
  NOW(),
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = 'Admin',
  role = 'admin',
  updatedAt = NOW();
