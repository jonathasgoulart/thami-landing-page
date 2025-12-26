# 📝 Guia de Edição da Landing Page THAMI

Este guia mostra como editar facilmente os links, fotos e textos da sua landing page **sem precisar mexer no código HTML**!

---

## 🎯 Como Editar a Página

### Método 1: Editar o arquivo `config.json` (RECOMENDADO)

Todos os dados da página estão no arquivo **`config.json`**. Basta editar este arquivo e a página será atualizada automaticamente!

#### 📍 Localização do arquivo:
```
c:\Users\jonat\Documents\Antigravit teste\config.json
```

---

## 📋 O Que Você Pode Editar

### 1. **Perfil (Nome e Foto)**

```json
"profile": {
  "name": "THAMI",
  "subtitle": "Cantora • Compositora • Artista",
  "image": "profile.png",
  "bannerImage": "",
  "bannerImageComment": "Adicione o nome do arquivo da foto horizontal aqui (ex: 'banner.jpg'). Deixe vazio para não mostrar banner"
}
```

**Para editar:**
- `name`: Mude o nome que aparece no topo
- `subtitle`: Mude a descrição
- `image`: Nome do arquivo da foto de perfil (redonda)
- `bannerImage`: Nome do arquivo da foto de capa (horizontal) - **NOVO!**

**Para adicionar foto de capa horizontal:**
1. Coloque sua foto na pasta (ex: `banner.jpg`)
2. No `config.json`, mude `"bannerImage": ""` para `"bannerImage": "banner.jpg"`
3. A foto aparecerá como fundo no topo da página

**Dica:** Use fotos horizontais com proporção 16:9 ou 16:3 para melhor resultado!

---

### 2. **Redes Sociais**

```json
"socialMedia": [
  {
    "platform": "instagram",
    "title": "Instagram",
    "description": "@oficialthami",
    "url": "https://www.instagram.com/oficialthami",
    "icon": "fab fa-instagram"
  }
]
```

**Para editar:**
- `title`: Nome da rede social
- `description`: Texto que aparece embaixo
- `url`: Link para a rede social
- Para adicionar mais redes, copie um bloco inteiro e cole abaixo

**Ícones disponíveis:**
- Instagram: `fab fa-instagram`
- TikTok: `fab fa-tiktok`
- Twitter: `fab fa-twitter`
- Facebook: `fab fa-facebook`
- YouTube: `fab fa-youtube`
- LinkedIn: `fab fa-linkedin`
- WhatsApp: `fab fa-whatsapp`

---

### 3. **YouTube (Canal e Vídeos)**

```json
"youtube": {
  "channelUrl": "https://www.youtube.com/@oficialthami",
  "videos": [
    {
      "title": "Show Completo - Labirinto",
      "description": "Assista ao show completo",
      "url": "https://www.youtube.com/watch?v=sWi1pWUtyG4",
      "thumbnail": "https://i.ytimg.com/vi/sWi1pWUtyG4/hqdefault.jpg"
    }
  ]
}
```

**Para editar:**
- `channelUrl`: Link do seu canal
- `title`: Título do vídeo
- `url`: Link do vídeo
- `thumbnail`: Imagem do vídeo (use: `https://i.ytimg.com/vi/ID_DO_VIDEO/hqdefault.jpg`)

**Como pegar o ID do vídeo:**
- URL: `https://www.youtube.com/watch?v=sWi1pWUtyG4`
- ID: `sWi1pWUtyG4` (parte depois do `v=`)

---

### 4. **Plataformas de Música**

```json
"musicPlatforms": [
  {
    "platform": "spotify",
    "title": "Spotify",
    "description": "Perfil do Artista",
    "url": "https://open.spotify.com/...",
    "icon": "fab fa-spotify"
  }
]
```

**Para editar:**
- `title`: Nome do link
- `description`: Descrição
- `url`: Link da plataforma
- Para adicionar mais links, copie e cole um bloco

**Ícones de plataformas:**
- Spotify: `fab fa-spotify`
- Deezer: `fab fa-deezer`
- Apple Music: `fab fa-apple`
- SoundCloud: `fab fa-soundcloud`
- Amazon Music: `fab fa-amazon`
- Ingressos: `fas fa-ticket`

---

## 🖼️ Como Trocar a Foto de Perfil

### Opção 1: Substituir o arquivo
1. Pegue sua foto
2. Renomeie para `profile.png`
3. Substitua o arquivo na pasta `Antigravit teste`

### Opção 2: Usar outra foto
1. Coloque sua foto na pasta (ex: `minha-foto.jpg`)
2. No `config.json`, mude:
```json
"image": "minha-foto.jpg"
```

---

## ➕ Como Adicionar Novos Links

### Exemplo: Adicionar WhatsApp

1. Abra `config.json`
2. Na seção `socialMedia`, adicione:

```json
{
  "platform": "whatsapp",
  "title": "WhatsApp",
  "description": "Fale comigo",
  "url": "https://wa.me/5511999999999",
  "icon": "fab fa-whatsapp"
}
```

3. Salve o arquivo
4. Recarregue a página (F5)

---

## 🔧 Ferramentas para Editar

### Opção 1: Notepad (Windows)
1. Clique com botão direito em `config.json`
2. Abrir com → Bloco de Notas
3. Edite e salve (Ctrl+S)

### Opção 2: Visual Studio Code (Recomendado)
1. Baixe grátis: [code.visualstudio.com](https://code.visualstudio.com)
2. Abra a pasta `Antigravit teste`
3. Edite `config.json`
4. Salve (Ctrl+S)

---

## ⚠️ Dicas Importantes

### ✅ Faça:
- Sempre use aspas duplas `"` (não simples `'`)
- Mantenha as vírgulas entre os itens
- Teste depois de editar (F5 no navegador)
- Faça backup antes de grandes mudanças

### ❌ Não faça:
- Não remova vírgulas ou chaves `{}`
- Não use acentos em nomes de arquivos
- Não esqueça de fechar aspas

---

## 🐛 Resolução de Problemas

### A página não atualiza?
1. Limpe o cache: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
2. Verifique se salvou o `config.json`
3. Abra o Console (F12) e veja se há erros

### Deu erro no JSON?
1. Use um validador: [jsonlint.com](https://jsonlint.com)
2. Cole seu JSON e veja onde está o erro
3. Geralmente é vírgula faltando ou sobrando

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas, me chame! Posso:
- Adicionar novos links para você
- Corrigir erros no JSON
- Adicionar novas funcionalidades

---

## 🎨 Personalizações Avançadas (Opcional)

Quer mudar cores, fontes ou layout? Me avise que posso ajustar!

**Exemplos do que posso fazer:**
- Mudar cores do tema
- Adicionar mais seções
- Mudar fontes
- Adicionar animações diferentes
