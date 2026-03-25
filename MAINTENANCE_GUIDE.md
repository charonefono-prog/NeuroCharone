# Guia de Manutenção - NeuroLaserMap

**Versão:** 1.0.0  
**Objetivo:** Manter o aplicativo funcionando 24/7 com máxima confiabilidade

---

## 📋 Checklist de Manutenção

### ✅ Diário (5 minutos)

```bash
# 1. Verificar se servidor está online
curl -s http://localhost:3000/api/health | jq .

# 2. Verificar espaço em disco
df -h | grep -E "^/dev"

# 3. Verificar memória
free -h

# 4. Verificar processos Node.js
ps aux | grep node
```

### ✅ Semanal (30 minutos)

```bash
# 1. Fazer backup do banco
mysqldump -u root -p neuromodulation_mapper > backup_$(date +%Y%m%d).sql

# 2. Verificar tamanho do banco
mysql -u root -p -e "SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb FROM information_schema.tables WHERE table_schema = 'neuromodulation_mapper';"

# 3. Verificar queries lentas
mysql -u root -p -e "SHOW PROCESSLIST;" neuromodulation_mapper

# 4. Limpar logs antigos
find /var/log/neuromodulation_mapper -name "*.log" -mtime +30 -delete

# 5. Testar restauração de backup
# (em ambiente de teste)
mysql -u root -p neuromodulation_mapper_test < backup_$(date +%Y%m%d).sql
```

### ✅ Mensal (1 hora)

```bash
# 1. Atualizar dependências
pnpm update

# 2. Executar testes
pnpm test

# 3. Verificar segurança
pnpm audit

# 4. Revisar logs
tail -n 1000 /var/log/neuromodulation_mapper/app.log | grep -i error

# 5. Fazer backup completo
tar -czf backup_completo_$(date +%Y%m%d).tar.gz \
  /home/ubuntu/neuromodulation_mapper \
  backup_$(date +%Y%m%d).sql

# 6. Testar atualização em staging
# Deploy em ambiente de teste
```

---

## 🚀 Procedimentos Operacionais

### Iniciar Servidor

```bash
cd /home/ubuntu/neuromodulation_mapper

# Desenvolvimento
pnpm dev

# Produção (com PM2)
pm2 start "pnpm start" --name "neuromodulation_mapper"
pm2 save
```

### Parar Servidor

```bash
# Desenvolvimento
Ctrl+C

# Produção (PM2)
pm2 stop neuromodulation_mapper
```

### Reiniciar Servidor

```bash
# Desenvolvimento
# Parar e iniciar novamente

# Produção (PM2)
pm2 restart neuromodulation_mapper

# Verificar status
pm2 status
```

### Fazer Deploy de Atualização

```bash
# 1. Fazer backup
mysqldump -u root -p neuromodulation_mapper > backup_pre_deploy.sql

# 2. Atualizar código
git pull origin main

# 3. Instalar dependências
pnpm install

# 4. Executar migrações (se houver)
pnpm db:push

# 5. Executar testes
pnpm test

# 6. Reiniciar servidor
pm2 restart neuromodulation_mapper

# 7. Verificar se está funcionando
curl http://localhost:3000/api/health
```

---

## 🔍 Monitoramento

### Logs

#### Visualizar Logs em Tempo Real

```bash
# Desenvolvimento
# Aparecem no console

# Produção
pm2 logs neuromodulation_mapper

# Com filtro
pm2 logs neuromodulation_mapper | grep -i error
```

#### Salvar Logs

```bash
# Criar arquivo de log
pm2 logs neuromodulation_mapper > app.log

# Rotacionar logs
pm2 install pm2-logrotate
```

### Banco de Dados

#### Verificar Saúde do Banco

```bash
# Conectar
mysql -u root -p neuromodulation_mapper

# Verificar tabelas
SHOW TABLES;

# Verificar integridade
CHECK TABLE patients;
CHECK TABLE therapeutic_plans;
CHECK TABLE sessions;

# Sair
EXIT;
```

#### Otimizar Banco

```bash
# Otimizar tabelas
mysql -u root -p -e "OPTIMIZE TABLE patients, therapeutic_plans, sessions;" neuromodulation_mapper

# Reparar se necessário
mysql -u root -p -e "REPAIR TABLE patients;" neuromodulation_mapper
```

### Performance

#### Monitorar CPU e Memória

```bash
# Usar top
top -p $(pgrep -f "node.*neuromodulation_mapper")

# Ou usar htop
htop -p $(pgrep -f "node.*neuromodulation_mapper")
```

#### Verificar Conexões de Banco

```bash
mysql -u root -p -e "SHOW PROCESSLIST;" neuromodulation_mapper
```

---

## 🔧 Troubleshooting

### Servidor não inicia

```bash
# Verificar porta em uso
lsof -i :3000

# Matar processo
kill -9 <PID>

# Verificar logs de erro
pm2 logs neuromodulation_mapper
```

### Banco de dados lento

```bash
# Verificar queries lentas
mysql -u root -p -e "SHOW PROCESSLIST;" neuromodulation_mapper

# Matar query lenta
mysql -u root -p -e "KILL <ID>;" neuromodulation_mapper

# Otimizar
OPTIMIZE TABLE patients;
```

### Memória cheia

```bash
# Verificar uso
free -h

# Limpar cache
sync; echo 3 > /proc/sys/vm/drop_caches

# Reiniciar servidor
pm2 restart neuromodulation_mapper
```

### Disco cheio

```bash
# Verificar uso
du -sh /*

# Limpar logs antigos
find /var/log -name "*.log" -mtime +30 -delete

# Limpar cache npm
pnpm store prune
```

---

## 📊 Relatórios

### Relatório Semanal

```bash
#!/bin/bash

echo "=== RELATÓRIO SEMANAL - NeuroLaserMap ==="
echo "Data: $(date)"
echo ""

echo "1. Status do Servidor:"
curl -s http://localhost:3000/api/health | jq .

echo ""
echo "2. Uso de Recursos:"
free -h
df -h | grep -E "^/dev"

echo ""
echo "3. Banco de Dados:"
mysql -u root -p -e "SELECT COUNT(*) as total_users FROM users; SELECT COUNT(*) as total_patients FROM patients; SELECT COUNT(*) as total_sessions FROM sessions;" neuromodulation_mapper

echo ""
echo "4. Erros Recentes:"
pm2 logs neuromodulation_mapper | grep -i error | tail -10

echo ""
echo "=== FIM DO RELATÓRIO ==="
```

Salvar como `weekly_report.sh` e executar:

```bash
chmod +x weekly_report.sh
./weekly_report.sh > weekly_report_$(date +%Y%m%d).txt
```

---

## 🔐 Segurança

### Backup e Recuperação

#### Backup Automático com Cron

```bash
# Editar crontab
crontab -e

# Adicionar linha
0 2 * * * mysqldump -u root -p'senha' neuromodulation_mapper > /backups/db_$(date +\%Y\%m\%d).sql

# Verificar
crontab -l
```

#### Restaurar Backup

```bash
# Restaurar
mysql -u root -p neuromodulation_mapper < backup_20260214.sql

# Verificar
mysql -u root -p -e "SELECT COUNT(*) FROM patients;" neuromodulation_mapper
```

### Atualizações de Segurança

```bash
# Verificar vulnerabilidades
pnpm audit

# Corrigir automaticamente
pnpm audit --fix

# Atualizar dependências
pnpm update
```

---

## 📞 Contatos de Emergência

| Situação | Ação |
|----------|------|
| Servidor offline | Reiniciar: `pm2 restart neuromodulation_mapper` |
| Banco offline | Verificar MySQL: `systemctl status mysql` |
| Dados corrompidos | Restaurar backup: `mysql < backup.sql` |
| Performance ruim | Otimizar banco: `OPTIMIZE TABLE ...` |
| Erro desconhecido | Verificar logs: `pm2 logs` |

---

## 📚 Recursos Úteis

### Comandos Úteis

```bash
# Status geral
pm2 status

# Logs em tempo real
pm2 logs

# Reiniciar tudo
pm2 restart all

# Salvar configuração
pm2 save

# Restaurar configuração
pm2 resurrect

# Monitorar
pm2 monit
```

### Documentação

- [Node.js](https://nodejs.org/docs/)
- [Express](https://expressjs.com/)
- [MySQL](https://dev.mysql.com/doc/)
- [Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/docs/getting-started)

---

## ✅ Checklist de Implementação

- [ ] Instalar PM2: `npm install -g pm2`
- [ ] Configurar cron para backup
- [ ] Configurar monitoramento
- [ ] Testar restauração de backup
- [ ] Documentar procedimentos
- [ ] Treinar equipe
- [ ] Criar alertas

---

**Última atualização:** 14 de Fevereiro de 2026
