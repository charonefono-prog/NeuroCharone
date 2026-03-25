# Guia de Estabilidade e Manutenção do Servidor

**Versão:** 1.0  
**Data:** 24 de janeiro de 2026  
**Autor:** Manus AI

---

## Resumo Executivo

Este guia fornece um conjunto abrangente de práticas recomendadas, procedimentos de monitoramento e estratégias de troubleshooting para garantir a estabilidade contínua do servidor de desenvolvimento do projeto NeuroLaserMaps. Após a limpeza de dependências incompatíveis (Three.js, Electron) e a correção de conflitos de build, este documento serve como referência para evitar futuros problemas.

---

## 1. Validação de Integridade do Projeto

### 1.1 Verificação de Dependências

Antes de iniciar o servidor, sempre execute:

```bash
cd /home/ubuntu/neuromodulation_mapper
pnpm install --force
pnpm check
```

**O que verificar:**

| Verificação | Comando | Esperado |
|---|---|---|
| TypeScript | `pnpm check` | Sem erros (0 errors) |
| Dependências | `pnpm ls` | Sem conflitos não resolvidos |
| Build | `pnpm build` | Sucesso (exit code 0) |
| Linting | `pnpm lint` | Sem erros críticos |

### 1.2 Dependências Críticas para Expo

O projeto deve conter **apenas** as seguintes dependências principais:

**Dependências Permitidas (React Native/Expo):**
- `expo` ~54.0.29
- `react-native` 0.81.5
- `react` 19.1.0
- `expo-router` ~6.0.19
- `nativewind` ^4.2.1
- `@tanstack/react-query` ^5.90.12
- `@trpc/client`, `@trpc/react-query`, `@trpc/server`

**Dependências Proibidas (Remover Imediatamente):**
- ❌ `@react-three/drei` (Three.js - não funciona em React Native)
- ❌ `@react-three/fiber` (Three.js - não funciona em React Native)
- ❌ `three` (WebGL - não funciona em React Native)
- ❌ `electron` (Desktop - conflita com Expo)
- ❌ `electron-builder` (Desktop - conflita com Expo)
- ❌ `stl-loader` (3D - não funciona em React Native)

### 1.3 Verificação de Imports Problemáticos

Procure por imports que causem erros:

```bash
grep -r "from 'three'" /home/ubuntu/neuromodulation_mapper/lib --include="*.ts" --include="*.tsx"
grep -r "from 'electron'" /home/ubuntu/neuromodulation_mapper --include="*.ts" --include="*.tsx"
```

Se encontrar algum, remova ou substitua por alternativas compatíveis com React Native.

---

## 2. Checklist de Monitoramento Diário

Execute este checklist antes de iniciar o desenvolvimento:

### 2.1 Verificação Rápida (5 minutos)

```bash
# 1. Verificar status do servidor
curl -s http://127.0.0.1:3000/health || echo "API não respondendo"

# 2. Verificar se Metro está rodando
curl -s http://localhost:8081 || echo "Metro não respondendo"

# 3. Verificar erros de TypeScript
cd /home/ubuntu/neuromodulation_mapper && pnpm check

# 4. Verificar se há arquivos não salvos
git status
```

### 2.2 Verificação Completa (15 minutos)

```bash
# 1. Limpar cache
rm -rf /home/ubuntu/neuromodulation_mapper/node_modules/.vite
rm -rf /home/ubuntu/neuromodulation_mapper/.expo

# 2. Reinstalar dependências
pnpm install --force

# 3. Executar testes
pnpm test

# 4. Verificar build
pnpm build

# 5. Reiniciar servidor
webdev_restart_server
```

---

## 3. Problemas Comuns e Soluções

### 3.1 Servidor Não Responde

**Sintoma:** `Error: ECONNREFUSED 127.0.0.1:3000`

**Solução:**

```bash
# 1. Verificar se o processo está rodando
ps aux | grep "expo\|metro\|node"

# 2. Matar processos antigos
pkill -f "expo\|metro\|node"

# 3. Limpar cache
rm -rf /home/ubuntu/neuromodulation_mapper/.expo
rm -rf /home/ubuntu/neuromodulation_mapper/node_modules/.vite

# 4. Reinstalar e reiniciar
pnpm install --force
webdev_restart_server
```

### 3.2 Erro de Dependência Não Encontrada

**Sintoma:** `Cannot find module 'xyz' or its corresponding type declarations`

**Solução:**

```bash
# 1. Verificar se o módulo está em package.json
grep "\"xyz\"" /home/ubuntu/neuromodulation_mapper/package.json

# 2. Se não encontrar, instalar
pnpm add xyz

# 3. Se encontrar, reinstalar
pnpm remove xyz
pnpm add xyz

# 4. Limpar cache do TypeScript
rm -rf /home/ubuntu/neuromodulation_mapper/node_modules/.cache
pnpm check
```

### 3.3 Erro de Build (esbuild)

**Sintoma:** `Error: ENOENT: no such file or directory, watch '/node_modules/@esbuild/...'`

**Solução:**

```bash
# 1. Remover node_modules corrompidos
rm -rf /home/ubuntu/neuromodulation_mapper/node_modules

# 2. Limpar cache do pnpm
pnpm store prune

# 3. Reinstalar
pnpm install --force

# 4. Reiniciar
webdev_restart_server
```

### 3.4 Conflito de Porta (8081 ou 3000)

**Sintoma:** `Error: listen EADDRINUSE :::8081`

**Solução:**

```bash
# 1. Encontrar processo usando a porta
lsof -i :8081
lsof -i :3000

# 2. Matar o processo
kill -9 <PID>

# 3. Reiniciar servidor
webdev_restart_server
```

### 3.5 Erro de TypeScript

**Sintoma:** `error TS2307: Cannot find module...`

**Solução:**

```bash
# 1. Verificar arquivo de tipos
ls -la /home/ubuntu/neuromodulation_mapper/lib/

# 2. Reconstruir tipos
pnpm check

# 3. Se persistir, limpar cache
rm -rf /home/ubuntu/neuromodulation_mapper/node_modules/.cache
pnpm install --force
```

---

## 4. Testes Automatizados

### 4.1 Executar Testes

```bash
# Testes unitários
pnpm test

# Testes com cobertura
pnpm test -- --coverage

# Testes em modo watch
pnpm test -- --watch
```

### 4.2 Criar Teste de Saúde do Servidor

Crie um arquivo `tests/server-health.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

describe('Server Health', () => {
  it('should have valid package.json', () => {
    const pkg = require('../package.json');
    expect(pkg.name).toBeDefined();
    expect(pkg.version).toBeDefined();
  });

  it('should not have incompatible dependencies', () => {
    const pkg = require('../package.json');
    const incompatible = [
      '@react-three/drei',
      '@react-three/fiber',
      'three',
      'electron',
      'stl-loader'
    ];
    
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    incompatible.forEach(dep => {
      expect(deps[dep]).toBeUndefined();
    });
  });

  it('should have required dependencies', () => {
    const pkg = require('../package.json');
    const required = ['expo', 'react-native', 'nativewind'];
    
    required.forEach(dep => {
      expect(pkg.dependencies[dep]).toBeDefined();
    });
  });
});
```

Execute com: `pnpm test`

---

## 5. Procedimento de Reinicialização

Quando o servidor parar de responder:

### Passo 1: Diagnóstico (2 minutos)

```bash
# Verificar status
ps aux | grep -E "expo|metro|node" | grep -v grep

# Verificar logs
tail -50 /home/ubuntu/neuromodulation_mapper/.manus-logs/*
```

### Passo 2: Limpeza (3 minutos)

```bash
# Matar processos
pkill -f "expo\|metro\|node"

# Limpar caches
rm -rf /home/ubuntu/neuromodulation_mapper/.expo
rm -rf /home/ubuntu/neuromodulation_mapper/node_modules/.vite
rm -rf /home/ubuntu/neuromodulation_mapper/node_modules/.cache
```

### Passo 3: Reinicialização (2 minutos)

```bash
# Usar webdev_restart_server
webdev_restart_server

# Ou manualmente
cd /home/ubuntu/neuromodulation_mapper
pnpm dev
```

### Passo 4: Verificação (1 minuto)

```bash
# Verificar se Metro está respondendo
curl -s http://localhost:8081 && echo "✅ Metro OK"

# Verificar se API está respondendo
curl -s http://127.0.0.1:3000/health && echo "✅ API OK"
```

---

## 6. Documentação de Mudanças Recentes

### 6.1 Mudanças Realizadas (24 de janeiro de 2026)

| Mudança | Motivo | Status |
|---|---|---|
| Removidas dependências Three.js | Incompatível com React Native | ✅ Completo |
| Removidas dependências Electron | Conflita com Expo | ✅ Completo |
| Restaurada dependência `xlsx` | Necessária para export de dados | ✅ Completo |
| Limpeza de `node_modules` | Resolver conflitos de build | ✅ Completo |

### 6.2 Versões Críticas

```json
{
  "expo": "~54.0.29",
  "react-native": "0.81.5",
  "react": "19.1.0",
  "nativewind": "^4.2.1",
  "typescript": "~5.9.3"
}
```

**Nunca atualize estas versões sem testar completamente!**

---

## 7. Backup e Recuperação

### 7.1 Criar Checkpoint

Antes de fazer mudanças importantes:

```bash
webdev_save_checkpoint "Descrição da mudança"
```

### 7.2 Restaurar Checkpoint

Se algo der errado:

```bash
webdev_rollback_checkpoint "<version_id>"
```

### 7.3 Listar Checkpoints

```bash
git log --oneline | head -10
```

---

## 8. Contato e Suporte

Se encontrar problemas não listados aqui:

1. **Verificar logs:** `tail -100 /home/ubuntu/neuromodulation_mapper/.manus-logs/*`
2. **Limpar tudo:** `pnpm install --force && webdev_restart_server`
3. **Restaurar checkpoint:** `webdev_rollback_checkpoint "<version_id>"`
4. **Contatar suporte:** https://help.manus.im

---

## 9. Checklist de Publicação

Antes de publicar na Play Store:

- [ ] Todos os testes passam (`pnpm test`)
- [ ] Sem erros de TypeScript (`pnpm check`)
- [ ] Build bem-sucedido (`pnpm build`)
- [ ] Sem dependências incompatíveis
- [ ] Checkpoint criado (`webdev_save_checkpoint`)
- [ ] Versão incrementada em `app.config.ts`
- [ ] Changelog atualizado
- [ ] Testado em dispositivo real

---

**Última atualização:** 24 de janeiro de 2026  
**Próxima revisão:** 31 de janeiro de 2026
