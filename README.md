# Portfólio João Vitor

Site estático. O `index.html` fica na raiz para o GitHub e o Netlify abrirem o site direto.

```
portfolio/
  index.html
  curriculo.html
  formulario.html
  andamento.html
  css/
  js/
  imagens/
  netlify.toml
```

## 1. Enviar para o GitHub

1. Crie um repositório vazio no GitHub, sem README.
2. No computador, abra o terminal nesta pasta e rode:

```bash
git init
git add .
git commit -m "Primeira versao do portfolio"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Troque `SEU-USUARIO` e `SEU-REPOSITORIO` pelos nomes reais.

## 2. Criar o link no Netlify

1. Acesse [app.netlify.com](https://app.netlify.com) e entre com a conta do GitHub.
2. **Add new site** > **Import an existing project**.
3. Escolha este repositório.
4. Configure o deploy:
   - **Build command:** deixe vazio
   - **Publish directory:** `.`
5. Clique em **Deploy site**.

O Netlify gera um endereço do tipo `https://nome-aleatorio.netlify.app`.

Para um nome mais curto: **Site configuration** > **Domain management** > **Change site name**. Exemplo: `https://joaovitor-portfolio.netlify.app`.

Cada `git push` na branch `main` atualiza o site sozinho.
