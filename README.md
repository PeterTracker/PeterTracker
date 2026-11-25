# Peter Tracker

> Sempre um passo à frente.

App feito como trabalho em grupo da disciplina **Interface Humano-Computador** do **Centro Universitário da Serra Gaúcha (FSG)**.

Ele parte de um cenário fictício: Mary Jane (MJ) acompanha Peter Parker pela cidade. Pelo app ela vê onde ele está e como está, conversa com ele e, numa emergência, aciona as autoridades. O foco do trabalho é a interface: fluxo de navegação, hierarquia visual, feedback ao usuário e prevenção de erros, como o botão de emergência que precisa ficar pressionado por 3 segundos.

## Como rodar (100% offline, sem Expo Go)

O projeto foi migrado para gerar um **arquivo único autocontido (`peter-tracker.html`)** que funciona em qualquer computador ou celular (Windows, macOS, Linux, Android e iOS), **sem precisar de Expo Go, Node.js, servidor ou conexão com a internet**.

1. Basta abrir o arquivo **[`peter-tracker.html`](./peter-tracker.html)** com duplo clique (ou rodar `start.bat` no Windows).
2. No celular, basta copiar `peter-tracker.html` e abrir em qualquer navegador (Chrome, Safari, Edge, Firefox).

**Login de demonstração:** usuário `mj`, senha `peter123`

> No computador, o app exibe automaticamente uma moldura de celular com botões discretos no canto inferior direito para alternar para **Tela cheia** e **Simular** cenários da apresentação (como alerta de >5 min sem atualização e troca do humor de Peter).

## Funcionalidades

| Tela | O que faz |
|------|-----------|
| **Login** | Usuário e senha, opção "Lembrar senha" (`localStorage`) e aviso de erro com contador de tentativas (máximo de 5) |
| **Mapa** | Mapa vetorial interativo 100% offline de Forest Hills (Queens) com localização de Peter em tempo real, trilha recente, zoom, arraste e botão para recentralizar |
| **Dashboard** | Humor de Peter, mini mapa offline, última localização e horário da última atualização |
| **Chat** | Conversa com Peter, indicador de digitação, envio da sua localização e atalho para ligar |
| **Chamada** | Tela de ligação. Se Peter não atender ou a chamada for encerrada, o app pergunta se ele está em perigo |
| **Autoridades** | Escolhe para onde enviar o alerta (911 ou delegacia) e confirma segurando o botão por 3s |
| **Confirmado** | Mostra o protocolo, o horário de envio e o status do atendimento |

Se a localização de Peter ficar mais de 5 minutos sem atualizar, o Mapa e o Dashboard mostram um alerta.

> Os dados são **simulados** (`peter-tracker/src/services/api.ts`). Não existe backend nem dependência de API externa: Peter "se move" a cada 15s e responde às mensagens automaticamente.

## Tecnologias

- [React](https://react.dev) 19 + TypeScript + [Vite](https://vite.dev)
- `vite-plugin-singlefile` para empacotar JS, CSS, fontes e ícones em um único HTML offline
- Zustand para estado global e navegação em memória (compatível com `file://`)
- Mapa vetorial interativo offline (SVG + gestos de arraste/zoom)
- Fontes Barlow e Barlow Condensed embutidas localmente (`@fontsource`)

## Como editar e gerar um novo arquivo único

Se o grupo quiser alterar telas ou textos, basta ter o [Node.js](https://nodejs.org) 20+ instalado:

```bash
cd peter-tracker
npm install
npm run dev     # desenvolvimento com hot reload
npm run build   # recompila e atualiza ../peter-tracker.html automaticamente
```

## Estrutura

```
PeterTracker-main/
├── peter-tracker.html             # arquivo único pronto para abrir offline em qualquer dispositivo
├── start.bat                      # atalho no Windows para abrir peter-tracker.html
└── peter-tracker/                 # código-fonte React + TypeScript + Vite
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── App.tsx                # shell principal, abas e controles de demonstração
        ├── screens/               # Login, Mapa, Dashboard, Chat, Chamada, Emergência, Confirmado
        ├── components/            # OfflineMap, Icons SVG, ui, DangerSheet, HoldToConfirmButton
        ├── services/api.ts        # API simulada offline
        ├── store/                 # estado global (auth, Peter, chat, navegação)
        └── theme/tokens.ts        # cores, espaçamentos e feedback háptico
```

## Equipe

| Nome |
|------|
| Giovanny Custodio Baratieri |
| Matheus Andrighetti Borella |
| Natália Bortolosso |
| Patrick de Aguiar Pereira |
| Tomás Winkler Angeli |
| Vinicius Toigo de Freitas |

**Professor(a):** Giovanni Guizzo Da Rocha

---

Projeto acadêmico, sem fins comerciais. Peter Parker, Mary Jane e Homem-Aranha são marcas da Marvel.
