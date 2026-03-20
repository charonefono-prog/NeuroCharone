#!/usr/bin/env node

/**
 * Script para adicionar usuários de teste ao users.json
 * Uso: node scripts/add-test-users.mjs
 */

import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, '../users.json');

// Usuários de teste
const testUsers = [
  {
    name: 'Edineuzasm',
    email: 'edineuzasm@hotmail.com',
    password: 'senha123',
    status: 'pending',
  },
  {
    name: 'Maria Silva',
    email: 'maria.silva@example.com',
    password: 'senha456',
    status: 'pending',
  },
  {
    name: 'João Santos',
    email: 'joao.santos@example.com',
    password: 'senha789',
    status: 'pending',
  },
  {
    name: 'Ana Costa',
    email: 'ana.costa@example.com',
    password: 'senha000',
    status: 'active',
    approvedAt: new Date().toISOString(),
  },
  {
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@example.com',
    password: 'senha111',
    status: 'rejected',
  },
];

async function addTestUsers() {
  try {
    console.log('📝 Adicionando usuários de teste...\n');

    // Carregar usuários existentes
    let users = {};
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf-8');
      users = JSON.parse(data);
      console.log(`✓ Carregados ${Object.keys(users).length} usuários existentes`);
    }

    // Adicionar usuários de teste
    for (const testUser of testUsers) {
      if (users[testUser.email]) {
        console.log(`⚠ Usuário ${testUser.email} já existe, pulando...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(testUser.password, 10);

      users[testUser.email] = {
        id: Date.now().toString() + Math.random(),
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        status: testUser.status,
        createdAt: new Date().toISOString(),
        approvedAt: testUser.approvedAt || null,
      };

      console.log(`✓ Adicionado: ${testUser.name} (${testUser.email}) - Status: ${testUser.status}`);
    }

    // Salvar usuários
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    console.log(`\n✅ Total de usuários: ${Object.keys(users).length}`);
    console.log(`📁 Arquivo: ${usersFilePath}\n`);

    // Mostrar resumo
    const pending = Object.values(users).filter((u) => u.status === 'pending');
    const active = Object.values(users).filter((u) => u.status === 'active');
    const rejected = Object.values(users).filter((u) => u.status === 'rejected');

    console.log('📊 Resumo:');
    console.log(`  Pendentes: ${pending.length}`);
    console.log(`  Ativos: ${active.length}`);
    console.log(`  Rejeitados: ${rejected.length}`);

    console.log('\n🔐 Credenciais de Teste:');
    testUsers.forEach((u) => {
      console.log(`  ${u.email} / ${u.password}`);
    });

    console.log('\n✨ Usuários de teste adicionados com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

addTestUsers();
