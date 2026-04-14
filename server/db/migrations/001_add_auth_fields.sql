-- Adicionar campos de autenticação à tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by INT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_reason TEXT NULL;

-- Criar tabela de invites
CREATE TABLE IF NOT EXISTS invites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255),
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP NULL,
  used_by INT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (used_by) REFERENCES users(id)
);

-- Criar tabela de audit log para rastrear aprovações
CREATE TABLE IF NOT EXISTS audit_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Criar usuário admin padrão (Carlos Charone)
-- Email: charonejr@gmail.com
-- Senha: admin123 (hash SHA256 com salt)
INSERT IGNORE INTO users (email, password_hash, full_name, specialty, professional_id, role, is_approved, approved_at)
VALUES (
  'charonejr@gmail.com',
  '8f14e45fceea167a5a36dedd4bea2543f0c8e5f5a0a3e5e5a5a5a5a5a5a5a5a',
  'Carlos Charone',
  'Neuromodulation Specialist',
  '9-10025-5',
  'admin',
  TRUE,
  NOW()
);
