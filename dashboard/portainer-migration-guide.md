# Migração para o Portainer

Siga estes passos para que o Portainer assuma o controle total da stack `hykesaas`.

### 1. Limpeza via Terminal
Abra o terminal na sua máquina local ou SSH na VPS e rode:
```bash
ssh root@72.62.137.73 "docker stack rm hykesaas"
```

### 2. Criação da Stack no Portainer
- Vá em **Stacks** -> **Add stack**.
- Nome: `hykesaas`.
- No **Web editor**, cole o conteúdo do seu `docker-compose.stack.yml`.
- Adicione as variáveis de ambiente (env vars) do seu arquivo `.env`.
- Clique em **Deploy the stack**.

### 3. Verificação
Após o deploy, a stack aparecerá no Portainer com a etiqueta **"Total control"**. Agora você poderá reiniciar e editar pelo painel.
