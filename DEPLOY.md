# 🚀 Guia de Deploy - Zattar Dashboard

## 📋 Pré-requisitos
- VPS com Portainer configurado
- Acesso SSH à VPS
- Git instalado na VPS

## 🏗️ 1. Setup Inicial no Portainer

### Método 1: Via Git Repository (Recomendado)

1. **Criar repositório no GitHub/GitLab:**
   - Suba este projeto para um repositório Git
   - Certifique-se que os arquivos Docker estão incluídos

2. **No Portainer:**
   - Vá em **Stacks** → **Add Stack**
   - Escolha **Repository**
   - URL do repositório: `https://github.com/seu-usuario/zattar-dashboard`
   - Compose file path: `docker-compose.yml`
   - **Advanced Options** → Environment Variables:
     ```
     NODE_ENV=production
     ```

3. **Deploy:**
   - Clique em **Deploy the stack**

### Método 2: Via Compose Manual

1. **No Portainer:**
   - Vá em **Stacks** → **Add Stack**
   - Escolha **Web editor**
   - Cole o conteúdo do `docker-compose.yml`

2. **Configurar Environment:**
   ```yaml
   version: '3.8'
   
   services:
     zattar-dashboard:
       build: .
       container_name: zattar-dashboard
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       restart: unless-stopped
   ```

## 🔄 2. Processo de Atualização

### Para Repositório Git:

1. **Fazer alterações locais:**
   ```bash
   # Suas alterações no código...
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```

2. **Atualizar no Portainer:**
   - Vá na sua **Stack** existente
   - Clique em **Editor**
   - Clique em **Pull and redeploy**
   - OU clique **Update the stack** se mudou o compose

3. **Automático com Webhooks (Opcional):**
   - Configure webhook no GitHub/GitLab
   - URL: `http://sua-vps:9000/api/webhooks/webhook-id`

### Para Deploy Manual:

1. **SSH na VPS:**
   ```bash
   cd /caminho/para/projeto
   git pull
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 🔧 3. Scripts Úteis

Crie esses scripts na sua VPS:

**deploy.sh:**
```bash
#!/bin/bash
cd /home/zattar-dashboard
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
echo "✅ Deploy concluído!"
```

**update.sh:**
```bash
#!/bin/bash
docker-compose down
docker-compose up -d --build
echo "✅ Aplicação atualizada!"
```

## 📊 4. Monitoramento

**Verificar logs:**
```bash
docker logs zattar-dashboard -f
```

**Status do container:**
```bash
docker ps | grep zattar
```

## 🌐 5. Configuração de Domínio

Se usar proxy reverso (Nginx/Traefik):

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name zattar.seudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔐 6. Variáveis de Ambiente

Crie arquivo `.env` na VPS:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://whjdikwbgbjfjtzcqrvr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

## ⚡ 7. Workflow Recomendado

1. **Desenvolvimento local**: `npm run dev`
2. **Commit changes**: `git add . && git commit -m "..."`
3. **Push to repo**: `git push`
4. **Update Portainer**: Click "Pull and redeploy"
5. **Verificar**: Acesse sua aplicação

## 🆘 8. Troubleshooting

**Se der erro de build:**
```bash
docker system prune -a
docker-compose build --no-cache
```

**Se não conectar no Supabase:**
- Verificar variáveis de ambiente
- Verificar regras de firewall
- Verificar logs do container

**Port já em uso:**
- Alterar porta no `docker-compose.yml`: `"3001:3000"`