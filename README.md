# RASTRAK — Web Presskit (MVP)

Site imersivo do projeto RASTRAK (Raphael Ferreira), baseado no *Dossiê RASTRAK — Discovery, Identidade Visual e Estrutura do Web Presskit*.

Stack: Next.js (App Router) · GSAP + ScrollTrigger/SplitText/ScrambleText · Three.js (WebGL) · Lenis.

## Rodar

```bash
npm install
npm run dev
```

## Estrutura

- `src/lib/content.ts` — todo o texto do site (dossiê). Hipóteses do Radar e BPM ficam aqui para trocar quando o Raphael responder o questionário.
- `src/components/` — uma seção por arquivo (Preloader 00, Hero 01, Sequence, Manifesto 02, Transmissions 03, Radar 04, Presskit 05, Contact 06, Footer).
- `src/lib/director.ts` — direção da cabeça WebGL ao longo do scroll.
- `public/frames` — sequência de frames (scroll) extraída de "Rastrak 02.mp4".
- `public/data/head.bin` — nuvem de pontos da cabeça codificada (gerada a partir da logo completa).
- `public/media` — trecho de áudio (min 3:10 da faixa) e loops das transmissões.
- `public/presskit` — zips de logos e fotos oficiais.

## Formulário de booking

`/api/contact` envia e-mail via Resend se estas variáveis estiverem configuradas na Vercel:

- `RESEND_API_KEY`
- `CONTACT_TO` (e-mail que recebe as propostas)
- `CONTACT_FROM` (opcional, remetente verificado no Resend)

Sem elas, as mensagens só aparecem no log da função.
