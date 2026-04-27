# AlbumGuessnr — Frontend

Este projeto consiste no Projeto Integrador do curso de Sistemas para Internet na Univali.

O projeto se trata de um jogo de adivinhação de álbuns musicais integrado (atualmente apenas) ao Last.fm. O sistema segue um fluxo de puxar álbuns ouvidos pelo usuário usando seu username do Last.fm, normalizar nomes de álbuns, artistas, gêneros, tracks retirando palavras referentes a versionamento (como version, remastered, edition), salvar no banco e exibir ao usuário a capa do álbum borrada permitindo que ele adivinhe o que queira.

## Stack

- **Framework**: React
- **Linguagem**: TypeScript
- **Gerenciamento de estado**: Zustand
- **Formulários**: React Hook Form
- **Data fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios (com interceptor de refresh token)
- **Estilização**: Tailwind CSS

## Estrutura

```
src/
├── features/
│   ├── auth/
│   │   ├── components/   # Form, Label, Input reutilizáveis
│   │   ├── hooks/        # useUser
│   │   └── stores/       # useAuthStore
│   └── game/
│       └── guess/
│           ├── components/  # Guess, GuessSync, GuessContent
│           ├── hooks/       # useCompare
│           ├── stores/      # useGuessStore, useTrackStore
│           ├── types/       # GuessType, albumTypes
│           └── utils/       # shuffle
└── shared/
    ├── utils/    # Axios configurado com interceptor
    └── types/    # IUser e outros tipos compartilhados
```

## Autenticação

- JWT armazenado em HttpOnly cookie (gerenciado pelo backend)
- Axios interceptor: em caso de 401, tenta refresh token automaticamente e retenta a requisição original

## Fluxo do jogo

1. `useUser` busca o usuário autenticado
2. `GuessSync` dispara o sync via `/game` (TanStack Query)
3. Após sync concluído, busca álbuns via `/integration/albums`
4. Álbuns são embaralhados (`shuffle`) e armazenados no `useGuessStore`
5. `GuessContent` exibe o álbum atual (capa borrada) e os campos de adivinhação
6. `useCompare` compara as respostas com os dados normalizados do banco
7. Ao clicar em "Guess": revela capa, exibe resultado, avança para próximo álbum
8. Ao esgotar os álbuns: invalida a query e busca novo lote

## Stores (Zustand)

### `useGuessStore`
Estado central do jogo:
- `albums`: lista de álbuns do lote atual
- `index`: álbum atual
- `isGuessed`: se o usuário já submeteu a tentativa
- `config`: campos que o usuário quer adivinhar
- `correctAnswers`: estado das respostas do usuário

### `useTrackStore` *(em desenvolvimento)*
Estado para adivinhação iterativa de tracklist:
- `guessed`: tracks já tentadas com resultado (`{ name, isCorrect }`)
- `remaining`: número de tentativas restantes

## Comparação de respostas

Toda comparação usa os campos normalizados vindos do banco (`normalizedName`, `normalizedArtist`, `normalizedName` das tracks/gêneros). O usuário não precisa acertar capitalização, pontuação ou sufixos de edição.

## O que está feito

- [x] Tela de login e registro
- [x] Interceptor de refresh token
- [x] Fluxo de sync + busca de álbuns
- [x] Exibição do álbum com capa borrada
- [x] Adivinhação de nome do álbum e artista
- [x] Feedback visual (borda verde/vermelha nos inputs)
- [x] Revelação do resultado e avanço para próximo álbum
- [x] Embaralhamento dos álbuns
- [x] Adivinhação de gênero/tag
- [x] Adivinhação de tracklist (fluxo iterativo: digita uma track por vez, feedback imediato, "Guess" revela o restante)
- [x] Refatoração do `useGuessStore` com `config` (quais campos o usuário quer adivinhar) e `answersState` (resultado de cada campo)
- [x] Forgot/reset password
- [x] Adivinhação de ano (input numérico, desabilitado se `album.year === null`)
- [x] Timer in-game

## O que está aberto / falta fazer

- [ ] Responsividade
- [ ] Redirecionamento quando sessão expirar
- [ ] Validação com Zod
- [ ] Melhorias de UX e correção de bugs

### Até 28/04
- [x] Exibir quantas vezes o usuário adivinhou o álbum

## Decisões de design

- **Tracklist é iterativa**: ao contrário dos outros campos (submit único), tracks têm um ciclo próprio de input → verificação → limpeza → repetição, justificando store e formulário separados
- **Singles ignorados**: álbuns sem tracklist não são exibidos no jogo
- **Normalização no frontend**: comparações usam sempre os campos `normalized*` do banco, nunca os nomes originais
