# SaaS Validator

> O seu terapeuta de startups brutalmente honesto.

## 🎯 O que é isso?

Você tem uma ideia de SaaS que vai revolucionar o mercado e te deixar milionário? Provavelmente não. Mas na dúvida, pergunte para esta IA.

O **SaaS Validator** foi criado para te dar aquele choque de realidade que seus amigos e familiares, por pena ou desconhecimento, não conseguem te proporcionar. Descreva seu plano infalível e receba um feedback ácido, sarcástico e desmotivador.

## 🏗️ A Gloriosa (e Preguiçosa) Jornada Tecnológica

Este projeto nasceu puro, inocente e cheio de esperança, como um `npm create vite@latest` em uma tarde de domingo. A ideia era simples: um front-end em React, um campo de texto e uma chamada de API. Lindo.

Foi então que o único neurônio funcional do meu cérebro disparou um alerta de pânico:
**"Onde exatamente você vai colocar a API key da OpenAI, gênio?"**

Injetar o token direto no front-end seria o equivalente digital a deixar a chave de casa debaixo do tapete com um letreiro em neon apontando para ela. Um desastre anunciado.

A solução óbvia seria criar um back-end separado, um proxy simples em Express, talvez? Mas isso significaria... *dois deploys*. Dois repositórios. Lidar com CORS. A fadiga só de pensar.

Então, em uma manobra de eficiência estratégica (leia-se: preguiça monumental), o projeto foi sumariamente assassinado e ressuscitado.

**Bem-vindo ao SaaS Validator, a versão Next.js!**

Agora temos um belo e conveniente endpoint serverless (`/api/openai`) que esconde minhas chaves e minha vergonha. Um deploy só, zero dor de cabeça e a mesma capacidade de destruir sonhos. Eficiência que chama, né?

## 🚀 Como Rodar Essa Maravilha Localmente

Quer ver o circo pegar fogo na sua própria máquina?

### Pré-requisitos
- Node.js (versão 16 ou superior)
- Uma conta na OpenAI com créditos disponíveis
- Paciência para lidar com feedback brutal

### Instalação

1. **Clone este repositório.** Não espere muito dele.
   ```bash
   git clone https://github.com/lacerdaaa/saas-validator.git
   cd saas-validator
   ```

2. **Instale as dependências.**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente.** Crie um arquivo `.env.local` na raiz do projeto. Sim, no lugar certo desta vez.
   ```bash
   touch .env.local
   ```

4. **Adicione sua chave da OpenAI** no arquivo `.env.local`:
   ```env
   OPENAI_API_TOKEN="sk-sua-chave-que-voce-prometeu-nao-vazar-no-front-end"
   ```

5. **Inicie o servidor de desenvolvimento.**
   ```bash
   npm run dev
   ```

6. **Abra seu navegador** em `http://localhost:3000` e prepare seu ego para o impacto.

## 🛠️ Stack Tecnológica

- **Next.js** - Framework React com API routes (salvou nossa preguiça)
- **React** - Para a interface que vai destruir seus sonhos
- **OpenAI API** - A mente por trás da brutalidade
- **Tailwind CSS** - Porque CSS puro é coisa do passado

## 📁 Estrutura do Projeto

```
saas-validator/
├── app
│   ├── api
│   │   └── openai
│   │       └── route.ts // endpoint que faz chamada a openai
│   ├── constants.ts // para os metadados do next
│   ├── globals.css // alguém tem que importar o tailwind né?
│   ├── layout.tsx 
│   └── page.tsx // aqui é onde a mágica acontece
├── eslint.config.js
├── index.html
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
│   └── favicon.png
├── README.md // você está aqui
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.node.json

```

## 🚀 Deploy

### Vercel (Recomendado)
1. Faça push do código para o GitHub
2. Conecte o repositório na Vercel
3. Configure a variável `OPENAI_API_TOKEN` nas configurações do projeto
4. Deploy automático!

### Outras opções
- Netlify
- Railway
- Heroku (se ainda existir quando você ler isso)

## 🎮 Como Usar

1. Acesse a aplicação
2. Digite sua "revolucionária" ideia de SaaS
3. Clique em "Validar"
4. Prepare-se para a realidade
5. Chore (opcional)
6. Repense sua vida (recomendado)

## 🤝 Contribuindo

Quer tornar este projeto ainda mais brutal? Contribuições são bem-vindas! 

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/mais-crueldade`)
3. Commit suas mudanças (`git commit -m 'Adiciona mais sarcasmo'`)
4. Push para a branch (`git push origin feature/mais-crueldade`)
5. Abra um Pull Request

## ⚠️ Aviso Legal

Este projeto é uma **piada**. Não nos responsabilizamos por:
- Ideias abandonadas
- Lágrimas derramadas  
- Crises existenciais
- Mudanças de carreira para agricultura
- Terapia necessária após uso

Se a sua startup for destruída por uma IA sarcástica, talvez o problema nunca tenha sido a IA.

## 📄 Licença

MIT License - Porque até código que destrói sonhos deve ser livre.

## 🙋‍♂️ Suporte

Precisa de ajuda? Ótimo, junte-se ao clube. Abra uma issue e torça para que alguém com mais paciência que eu responda.

---

**Lembre-se:** Nem toda ideia precisa virar startup. Algumas ideias são felizes sendo apenas... ideias.

*Feito com 🔥 e muito sarcasmo*
