#!/usr/bin/env node
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Mock database for users (in-memory)
const users = new Map();
users.set("charonejr@gmail.com", {
  id: "1",
  email: "charonejr@gmail.com",
  name: "Carlos Charone",
  password: "12345",
  role: "admin",
  status: "active",
});

// Helper function to create token
function createToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(JSON.stringify({ email: user.email, id: user.id, role: user.role })).toString("base64");
  const signature = Buffer.from("signature").toString("base64");
  return `${header}.${payload}.${signature}`;
}

// ============ PWA Authentication APIs ============

// Login endpoint
app.post("/api/pwaAuth.login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email e senha são obrigatórios" });
  }

  const user = users.get(email);

  if (!user || user.password !== password) {
    return res.json({ success: false, message: "Email ou senha inválidos" });
  }

  if (user.status !== "active") {
    return res.json({ success: false, message: "Sua conta ainda não foi aprovada" });
  }

  const token = createToken(user);
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// Register endpoint
app.post("/api/pwaAuth.register", (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.json({ success: false, message: "Todos os campos são obrigatórios" });
  }

  if (users.has(email)) {
    return res.json({ success: false, message: "Email já cadastrado" });
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    name,
    password,
    role: "user",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  users.set(email, newUser);

  res.json({
    success: true,
    message: "Cadastro realizado! Aguarde a aprovação do administrador.",
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      status: newUser.status,
    },
  });
});

// Logout endpoint
app.post("/api/pwaAuth.logout", (req, res) => {
  res.json({ success: true, message: "Logout realizado com sucesso" });
});

// Get pending users (admin only)
app.get("/api/pwaAuth.pending-users", (req, res) => {
  const pendingUsers = Array.from(users.values()).filter((u) => u.status === "pending");
  res.json({
    success: true,
    users: pendingUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt,
    })),
  });
});

// Approve user (admin only)
app.post("/api/pwaAuth.approve-user", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email é obrigatório" });
  }

  const user = users.get(email);

  if (!user) {
    return res.json({ success: false, message: "Usuário não encontrado" });
  }

  user.status = "active";
  users.set(email, user);

  res.json({
    success: true,
    message: `Usuário ${email} aprovado com sucesso`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
    },
  });
});

// Reject user (admin only)
app.post("/api/pwaAuth.reject-user", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email é obrigatório" });
  }

  users.delete(email);

  res.json({
    success: true,
    message: `Usuário ${email} rejeitado`,
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

// PWA login page
app.get("/login", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>NeuroLaserMap - Login</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 40px;
          max-width: 400px;
          width: 100%;
        }
        h1 {
          font-size: 32px;
          color: #11181c;
          text-align: center;
          margin-bottom: 8px;
        }
        .subtitle {
          text-align: center;
          color: #687076;
          font-size: 14px;
          margin-bottom: 32px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #11181c;
          margin-bottom: 8px;
        }
        input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: #f5f5f5;
        }
        input:focus {
          outline: none;
          border-color: #0a7ea4;
          background: white;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #0a7ea4;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 24px;
        }
        button:hover {
          background: #0a6a8a;
        }
        button:active {
          opacity: 0.8;
        }
        .error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          display: none;
        }
        .register-link {
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
          color: #687076;
        }
        .register-link a {
          color: #0a7ea4;
          text-decoration: none;
          font-weight: 600;
        }
        .info-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
          padding: 12px;
          border-radius: 8px;
          margin-top: 24px;
          font-size: 12px;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>NeuroLaserMap</h1>
        <p class="subtitle">Mapeamento de Neuromodulação</p>
        
        <div class="error" id="error"></div>
        
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="seu@email.com" required>
          </div>
          
          <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required>
          </div>
          
          <button type="submit">Entrar</button>
        </form>
        
        <div class="register-link">
          Não tem conta? <a href="/register">Cadastre-se</a>
        </div>
        
        <div class="info-box">
          <strong>ℹ️ Informação:</strong><br>
          Após o cadastro, sua conta será analisada pelo administrador. Você receberá um email de confirmação quando for aprovado.
        </div>
      </div>
      
      <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const errorDiv = document.getElementById('error');
          
          try {
            const response = await fetch('/api/pwaAuth.login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
              localStorage.setItem('auth_token', data.token);
              localStorage.setItem('auth_user', JSON.stringify(data.user));
              window.location.href = '/';
            } else {
              errorDiv.textContent = data.message || 'Falha ao fazer login';
              errorDiv.style.display = 'block';
            }
          } catch (err) {
            errorDiv.textContent = 'Erro ao conectar com o servidor';
            errorDiv.style.display = 'block';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Admin panel page
app.get("/admin", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>NeuroLaserMap - Painel Admin</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #f5f5f5;
          padding: 20px;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .header {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        h1 {
          font-size: 24px;
          color: #11181c;
        }
        .logout-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .logout-btn:hover {
          background: #b91c1c;
        }
        .card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .card h2 {
          font-size: 18px;
          color: #11181c;
          margin-bottom: 16px;
          border-bottom: 2px solid #0a7ea4;
          padding-bottom: 12px;
        }
        .user-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .user-info {
          flex: 1;
        }
        .user-name {
          font-weight: 600;
          color: #11181c;
          margin-bottom: 4px;
        }
        .user-email {
          font-size: 14px;
          color: #687076;
        }
        .user-date {
          font-size: 12px;
          color: #9BA1A6;
          margin-top: 4px;
        }
        .user-actions {
          display: flex;
          gap: 8px;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
        }
        .btn-approve {
          background: #22c55e;
          color: white;
        }
        .btn-approve:hover {
          background: #16a34a;
        }
        .btn-reject {
          background: #ef4444;
          color: white;
        }
        .btn-reject:hover {
          background: #dc2626;
        }
        .empty {
          text-align: center;
          padding: 40px 20px;
          color: #687076;
        }
        .error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          display: none;
        }
        .success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          display: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Painel Admin - NeuroLaserMap</h1>
          <button class="logout-btn" onclick="logout()">Sair</button>
        </div>
        
        <div class="error" id="error"></div>
        <div class="success" id="success"></div>
        
        <div class="card">
          <h2>Cadastros Pendentes de Aprovação</h2>
          <div id="pendingUsers"></div>
        </div>
        
        <div class="card">
          <h2>Usuários Aprovados</h2>
          <div id="approvedUsers"></div>
        </div>
      </div>
      
      <script>
        async function loadUsers() {
          try {
            const response = await fetch('/api/pwaAuth.pending-users');
            const data = await response.json();
            
            const pendingDiv = document.getElementById('pendingUsers');
            const approvedDiv = document.getElementById('approvedUsers');
            
            if (data.users && data.users.length > 0) {
              pendingDiv.innerHTML = data.users.map(user => \`
                <div class="user-item">
                  <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                    <div class="user-date">Cadastrado em: ${new Date(user.createdAt).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div class="user-actions">
                    <button class="btn btn-approve" onclick="approveUser('${user.email}')">Aprovar</button>
                    <button class="btn btn-reject" onclick="rejectUser('${user.email}')">Rejeitar</button>
                  </div>
                </div>
              \`).join('');
            } else {
              pendingDiv.innerHTML = '<div class="empty">Nenhum cadastro pendente</div>';
            }
            
            // Load approved users
            const approvedResponse = await fetch('/api/pwaAuth.approved-users');
            const approvedData = approvedResponse.json().catch(() => ({ users: [] }));
            approvedDiv.innerHTML = '<div class="empty">Funcionalidade em desenvolvimento</div>';
          } catch (err) {
            showError('Erro ao carregar usuários: ' + err.message);
          }
        }
        
        async function approveUser(email) {
          if (!confirm('Tem certeza que deseja aprovar este usuário?')) return;
          
          try {
            const response = await fetch('/api/pwaAuth.approve-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
              showSuccess('Usuário aprovado com sucesso!');
              loadUsers();
            } else {
              showError(data.message || 'Erro ao aprovar usuário');
            }
          } catch (err) {
            showError('Erro ao aprovar: ' + err.message);
          }
        }
        
        async function rejectUser(email) {
          if (!confirm('Tem certeza que deseja rejeitar este usuário?')) return;
          
          try {
            const response = await fetch('/api/pwaAuth.reject-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
              showSuccess('Usuário rejeitado!');
              loadUsers();
            } else {
              showError(data.message || 'Erro ao rejeitar usuário');
            }
          } catch (err) {
            showError('Erro ao rejeitar: ' + err.message);
          }
        }
        
        function logout() {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }
        
        function showError(msg) {
          const errorDiv = document.getElementById('error');
          errorDiv.textContent = msg;
          errorDiv.style.display = 'block';
          setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
        }
        
        function showSuccess(msg) {
          const successDiv = document.getElementById('success');
          successDiv.textContent = msg;
          successDiv.style.display = 'block';
          setTimeout(() => { successDiv.style.display = 'none'; }, 3000);
        }
        
        // Load users on page load
        loadUsers();
        // Refresh every 30 seconds
        setInterval(loadUsers, 30000);
      </script>
    </body>
    </html>
  `);
});

// PWA register page
app.get("/register", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>NeuroLaserMap - Cadastro</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 40px;
          max-width: 400px;
          width: 100%;
        }
        h1 {
          font-size: 32px;
          color: #11181c;
          text-align: center;
          margin-bottom: 8px;
        }
        .subtitle {
          text-align: center;
          color: #687076;
          font-size: 14px;
          margin-bottom: 32px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #11181c;
          margin-bottom: 8px;
        }
        input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: #f5f5f5;
        }
        input:focus {
          outline: none;
          border-color: #0a7ea4;
          background: white;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #0a7ea4;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 24px;
        }
        button:hover {
          background: #0a6a8a;
        }
        button:active {
          opacity: 0.8;
        }
        .error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          display: none;
        }
        .login-link {
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
          color: #687076;
        }
        .login-link a {
          color: #0a7ea4;
          text-decoration: none;
          font-weight: 600;
        }
        .info-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
          padding: 12px;
          border-radius: 8px;
          margin-top: 24px;
          font-size: 12px;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>NeuroLaserMap</h1>
        <p class="subtitle">Criar Conta</p>
        
        <div class="error" id="error"></div>
        
        <form id="registerForm">
          <div class="form-group">
            <label for="name">Nome Completo</label>
            <input type="text" id="name" name="name" placeholder="Seu nome" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="seu@email.com" required>
          </div>
          
          <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar Senha</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" required>
          </div>
          
          <button type="submit">Cadastrar</button>
        </form>
        
        <div class="login-link">
          Já tem conta? <a href="/login">Faça login</a>
        </div>
        
        <div class="info-box">
          Após o cadastro, sua conta será analisada pelo administrador. Você receberá um email de confirmação quando for aprovado.
        </div>
      </div>
      
      <script>
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirmPassword').value;
          const errorDiv = document.getElementById('error');
          
          if (password !== confirmPassword) {
            errorDiv.textContent = 'As senhas não correspondem';
            errorDiv.style.display = 'block';
            return;
          }
          
          if (password.length < 6) {
            errorDiv.textContent = 'A senha deve ter pelo menos 6 caracteres';
            errorDiv.style.display = 'block';
            return;
          }
          
          try {
            const response = await fetch('/api/pwaAuth.register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
              alert('Cadastro realizado! Aguarde a aprovação do administrador.');
              window.location.href = '/login';
            } else {
              errorDiv.textContent = data.message || 'Falha ao registrar';
              errorDiv.style.display = 'block';
            }
          } catch (err) {
            errorDiv.textContent = 'Erro ao conectar com o servidor';
            errorDiv.style.display = 'block';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Serve static files from web-dist/
const webDistPath = path.join(__dirname, "web-dist");
console.log(`[server] Serving static files from: ${webDistPath}`);
console.log(`[server] web-dist/index.html exists: ${existsSync(path.join(webDistPath, "index.html"))}`);

app.use(express.static(webDistPath));

// SPA fallback: serve web-dist/index.html for any non-API route
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ error: "API endpoint not found" });
    return;
  }
  const indexPath = path.join(webDistPath, "index.html");
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("index.html not found");
  }
});

const port = parseInt(process.env.PORT || "3000");
server.listen(port, "0.0.0.0", () => {
  console.log(`[server] listening on 0.0.0.0:${port}`);
});
