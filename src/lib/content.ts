// Conteúdo do web presskit, baseado no Dossiê RASTRAK (Discovery, Identidade Visual e Estrutura).
// As hipóteses do Radar (Seção 04) e os dados de BPM são provisórios até o questionário do Raphael.

export const links = {
  instagram: "https://www.instagram.com/_rastrak.music/",
  soundcloud: "https://soundcloud.com/user-257341716",
  youtube: "https://www.youtube.com/@rastrak.music4",
};

// WhatsApp de booking do Raphael (só dígitos, com DDI e DDD).
export const whatsapp = {
  number: "5541999389304",
  message: "Olá, Raphael! Vi o presskit da RASTRAK e quero conversar sobre uma data/collab.",
};

export const waLink = (message = whatsapp.message) =>
  `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(message)}`;

/** Direct do Instagram do artista. */
export const igDirect = "https://ig.me/m/_rastrak.music";

export const cta = {
  index: "Índice 05 // CANAL DIRETO",
  headline: "Leve essa frequência para a sua pista.",
  text: "Datas, B2Bs, convites de curadoria e contato de agência direto com o Raphael, pelo WhatsApp ou pelo direct do Instagram.",
  button: "[ CHAMAR NO WHATSAPP ]",
  buttonIg: "[ DIRECT NO INSTAGRAM ]",
};

export const hero = {
  tag: "PSYTRANCE // FULL-ON UNDERGROUND",
  subtitle:
    "Arquitetura sonora para pista noturna. Full-on hipnótico, ritmado e groovado — energia que pertence à noite.",
  bpm: "145–148",
  status: "DISPONÍVEL PARA BOOKING & COLLABS",
};

export const manifesto = {
  index: "Índice 01 // IDENTIDADE & PESQUISA",
  headline: "O som como código de imersão.",
  text: "RASTRAK é o projeto de full-on underground conduzido por Raphael Ferreira. O recorte é preciso: full-on hipnótico, ritmado e groovado, com a energia enraizada no noturno. Desde 2022, a pesquisa concentra-se na interseção entre precisão rítmica, groove e leitura cirúrgica de pista — dispensando fórmulas comerciais em favor de uma narrativa contínua e hipnótica. Com formação técnica em desenvolvimento na Heostage, o projeto traduz disciplina de estúdio e curadoria rigorosa em sets desenhados para sustentar o estado de fluxo coletivo, onde cada virada reorganiza a percepção de corpo e espaço.",
  specs: [
    { k: "Recorte", v: "Full-On Hipnótico / Ritmado / Groovado" },
    { k: "DNA de Set", v: "Grooves secos, linhas de baixo firmes, progressão mental" },
    { k: "Janela Ideal", v: "Pista noturna — a energia é da noite" },
    { k: "Formação", v: "Heostage — em curso" },
  ],
};

export const transmissions = {
  index: "Índice 02 // ARQUIVO SONORO",
  headline: "Curadoria e sets selecionados.",
  description:
    "Registros de pista e sessões de pesquisa. Selecione uma transmissão para audição direta ou acesse as plataformas completas.",
  slots: [
    { id: "TRANSMISSION_01", name: "LIVE SESSION", tag: "FULL-ON HYPNOTIC", video: "/media/tx_01.mp4", poster: "/media/tx_01.jpg", href: links.soundcloud },
    { id: "TRANSMISSION_02", name: "NIGHT PROTOCOL", tag: "STUDIO MIX", video: "/media/tx_02.mp4", poster: "/media/tx_02.jpg", href: links.youtube },
    { id: "TRANSMISSION_03", name: "UNDERGROUND ARCHIVE", tag: "RESEARCH", video: "/media/tx_03.mp4", poster: "/media/tx_03.jpg", href: links.instagram },
  ],
};

export type RadarTab = {
  id: string;
  label: string;
  short: string;
  hypothesis: string;
  targets: string[];
  objective: string;
};

export const radar = {
  index: "Índice 03 // RADAR ESTRATÉGICO",
  headline: "Mapa de interesses e conexões na cena.",
  subtitle:
    "Transparência de posicionamento. Se você representa um núcleo, selo ou projeto alinhado a essa frequência, o canal está aberto.",
  tabs: [
    {
      id: "festivais",
      label: "ABA 01 — FESTIVAIS & NÚCLEOS",
      short: "FESTIVAIS & NÚCLEOS",
      hypothesis: "Festivais psicodélicos e de progressive, com pistas noturnas onde o full-on hipnótico e groovado encaixa.",
      targets: ["Universo Paralello", "Adhana", "Terra Azul", "PVTzinha (SP)", "Pistas psicodélicas", "Progressive"],
      objective: "Mostrar encaixe de horário e perfil de pista para curadores.",
    },
    {
      id: "booking",
      label: "ABA 02 — AGÊNCIAS & BOOKING",
      short: "AGÊNCIAS & BOOKING",
      hypothesis: "Gigs locais e regionais como base, construindo vitrine para chegar ao booking underground.",
      targets: ["Hipnose", "Psygroove", "Alltrip", "Elementum (PR)"],
      objective: "Alinhar estágio atual e facilitar contato direto de booking.",
    },
    {
      id: "collabs",
      label: "ABA 03 — COLLABS & B2B",
      short: "COLLABS & B2B",
      hypothesis: "Trocas conceituais, B2Bs, curadoria conjunta e colaborações de estúdio/edits no full-on noturno.",
      targets: ["B2B", "Curadoria conjunta", "Studio collabs", "Edits"],
      objective: "Mapear interesses de troca artística com outros projetos.",
    },
    {
      id: "labels",
      label: "ABA 04 — LABELS & PRODUTORAS",
      short: "LABELS & PRODUTORAS",
      hypothesis: "Alinhamento estético e sonoro com selos de full-on técnico/underground.",
      targets: ["Nano", "Sangoma", "Digital Om", "Looney Moon", "Selos nacionais"],
      objective: "Direcionar curadoria, lançamentos e parcerias.",
    },
  ] as RadarTab[],
};

export const presskit = {
  index: "Índice 04 // MATERIAL DE IMPRENSA",
  headline: "Presskit & Especificações.",
  bio: "RASTRAK é o projeto de full-on underground de Raphael Ferreira. Full-on hipnótico, ritmado e groovado, com a energia enraizada no noturno. Desde 2022, pesquisa a interseção entre precisão rítmica, groove e leitura de pista. Formação técnica em curso na Heostage.",
  rider: [
    "2x CDJ-3000 (ou 2x CDJ-2000NXS2) em rede / Pro DJ Link",
    "1x DJM-900NXS2",
    "2x monitores de retorno na cabine, volume independente",
    "Mesa estável, nivelada e livre de vibração",
  ],
  photos: ["portrait-dark", "photo-01", "photo-02", "photo-03", "photo-04", "photo-05", "photo-06"],
};
