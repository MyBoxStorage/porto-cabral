# PROMPT 1 — STITCH (Google) — Frontend Completo Porto Cabral

## CONTEXTO DO PROJETO

Você é um designer e desenvolvedor frontend de altíssimo nível. Seu trabalho é criar o frontend completo de um site de última geração para o **Porto Cabral BC** — o único restaurante flutuante de Balneário Camboriú, localizado literalmente sobre o mar no Molhe da Barra Sul.

Este é um projeto premium, experiencial, trilíngue e com integração a sistemas SaaS. Cada detalhe visual e técnico deve refletir luxo, sofisticação, modernidade e a essência do mar.

---

## IDENTIDADE VISUAL — SIGA RIGOROSAMENTE

**Paleta de cores principal:**
- Azul royal profundo: `#1A3A6B` (cor dominante — fundo, navbar, elementos de destaque)
- Branco puro: `#FFFFFF` (textos, elementos sobre azul)
- Dourado/âmbar náutico: `#D4A843` (acentos, títulos secundários, ícones decorativos)
- Azul claro translúcido: `rgba(26, 58, 107, 0.7)` (glassmorphism, overlays)
- Areia/creme suave: `#F5F0E8` (fundos de seções claras)

**Logo:**
- Caravela à vela desenhada em linha branca
- Texto: `•PORTO•` (pequeno, acima) + `CABRAL` (grande, fonte geométrica Art Deco com contornos internos) + `GASTRONOMIA FLUTUANTE` (pequeno, abaixo)
- Sempre branco sobre azul royal, ou azul royal sobre fundo claro
- A logo é SAGRADA — reproduza com SVG inline pixel-perfect conforme descrito

**Tipografia:**
- Títulos principais: fonte serif elegante (ex: Playfair Display ou Cormorant Garamond), peso 300–700
- Subtítulos e nomes de pratos: fonte display Art Deco geométrica (ex: Josefin Sans, peso 300)
- Corpo de texto: fonte sans-serif clean (ex: Inter ou Lato), peso 300–400
- Textos decorativos/taglines: fonte script cursiva elegante (ex: Great Vibes ou Dancing Script)

**Elementos visuais recorrentes:**
- Ilustrações náuticas douradas em linha fina: camarões, polvo, lagostas, peixes, vieiras, limões, âncoras — flutuando como elementos decorativos de fundo (semitransparentes, opacidade 0.06–0.12)
- Ondas suaves como separadores de seção
- Textura de linho/tecido náutico sutil no fundo azul (pattern CSS)
- Linhas horizontais finas douradas como divisores
- Efeito glassmorphism: `backdrop-filter: blur(20px)` com borda `1px solid rgba(212, 168, 67, 0.3)`

---

## STACK TÉCNICA

- **Framework:** Next.js 15 com App Router (TypeScript)
- **Estilização:** Tailwind CSS v4 + CSS Modules para componentes complexos
- **Animações:** Framer Motion + GSAP (ScrollTrigger) + Three.js (partículas de água no hero)
- **Internacionalização:** next-intl (PT-BR padrão, EN, ES com botão manual visível + detecção automática)
- **CMS:** Payload CMS (cardápio, depoimentos, sobre nós, blog gerenciados por painel admin)
- **Vídeo hero:** Cloudinary (autoplay loop sem som, fallback foto)
- **Mapa:** Mapbox GL JS (versão free, tema customizado azul marinho)
- **Schema.org:** LocalBusiness + Restaurant + Menu completo

---

## ARQUITETURA DE PÁGINAS

### Página Inicial `/`

**1. HERO — Impacto máximo**
- Vídeo em loop autoplay mudo fullscreen (src: variável de ambiente `NEXT_PUBLIC_HERO_VIDEO_URL` do Cloudinary)
- Overlay gradient: `linear-gradient(180deg, rgba(26,58,107,0.3) 0%, rgba(26,58,107,0.7) 100%)`
- Three.js: partículas flutuantes sutis representando gotículas/espuma do mar
- Logo centralizada com animação de entrada (GSAP: fade + slide up, delay 0.5s)
- Tagline em fonte script cursiva: *"Onde o sabor encontra o horizonte"*
- Subtítulo: "Gastronomia Flutuante · Molhe da Barra Sul · Balneário Camboriú"
- CTA principal: botão "Fazer Reserva" (dourado, hover com shimmer effect)
- CTA secundário: "Ver Cardápio" (outline branco)
- Scroll indicator animado (chevron pulsante)
- Navbar glassmorphism transparente que solidifica ao scroll

**2. NAVBAR**
- Logo à esquerda
- Links centralizados: Início / Cardápio / Experiências / Sobre / Blog / Área do Cliente
- Seletor de idioma à direita (PT 🇧🇷 / EN 🇺🇸 / ES 🇦🇷) — dropdown elegante
- Fundo: transparente no topo → `backdrop-filter: blur(20px); background: rgba(26,58,107,0.85)` ao scroll
- Borda inferior dourada fina ao solidificar
- Mobile: hamburguer menu com drawer lateral azul royal

**3. SEÇÃO "A EXPERIÊNCIA" (Logo abaixo do hero)**
- 3 cards horizontais com ícone dourado + título + descrição curta:
  - 🌊 "Sobre o Mar" — Único restaurante flutuante de BC, no Molhe da Barra Sul
  - 🌅 "Melhor Sunset" — Vista privilegiada do pôr do sol da cidade
  - 🦞 "Alta Gastronomia" — Frutos do mar premium com toque autoral
- Animação: cards entram com stagger Framer Motion ao scroll

**4. SEÇÃO "IGUARIAS DO MAR" — Preview do Cardápio**
- Título com fonte script: *"Iguarias do Mar"*
- Grid 2x3 com 6 pratos em destaque (carregados do Payload CMS):
  - Capitão Cabral (polvo), Lagosta Grelhada, Tesouros do Mar, Vieiras Canadenses, Bacalhau às Natas, Costa del Mar
- Cada card: foto full, nome do prato, descrição curta, preço, botão "Ver no Cardápio"
- Hover: zoom suave na foto + overlay com descrição completa
- Botão "Ver Cardápio Completo" → `/cardapio`

**5. SEÇÃO "NOSSA HISTÓRIA"**
- Layout split: foto do restaurante à noite/pôr do sol (lado esquerdo) + texto (lado direito)
- Título: "O Sonho que Virou Realidade"
- Texto sobre Edson Cabral, fundado em 2010, visão do restaurante flutuante
- Quote destacada em fonte script: *"O Porto Cabral é mais do que um restaurante, é um sonho que se tornou realidade."*
- Assinatura: — Edson Cabral, Fundador
- CTA: "Conheça Nossa História" → `/sobre`
- Animação: parallax no texto ao scroll (GSAP)

**6. SEÇÃO "EXPERIÊNCIAS"**
- Título: "Uma Experiência Além do Sabor"
- 4 cards em grid 2x2 com foto de fundo:
  - Jantar ao Pôr do Sol
  - Mesa à Beira d'Água
  - Rodízio de Filé Mignon
  - Música ao Vivo
- Cada card: foto overlay escuro + ícone + título + descrição + CTA "Reservar"
- Hover: overlay reduz, foto ganha vida

**7. SEÇÃO "DEPOIMENTOS"**
- Título: "O que dizem nossos clientes"
- Carrossel de reviews do Google (Google Places API, puxados automaticamente)
- Cada card: foto do reviewer, nome, nota em estrelas douradas, texto do review, data
- Autoplay suave, pausar ao hover
- Background: azul royal com textura náutica sutil

**8. SEÇÃO "ONDE ESTAMOS"**
- Mapa Mapbox customizado (tema dark azul marinho, estilo exclusivo)
- Pin customizado: ícone de caravela dourada no Molhe da Barra Sul
- Coordenadas exatas: `-26.9982, -48.6358` (Porto Cabral Flutuante, Molhe da Barra Sul)
- Sidebar com informações:
  - Endereço: Molhe da Barra Sul, Centro, Balneário Camboriú - SC, 88337-260
  - Horários de funcionamento
  - Telefone/WhatsApp com botão direto
  - "Como Chegar" com instruções
- Animação: mapa faz zoom in suave ao entrar na viewport

**9. SEÇÃO "RESERVA RÁPIDA"**
- Background: foto do restaurante com overlay azul
- Título: "Reserve sua Mesa"
- Formulário inline (sem redirecionamento): Nome, Email, WhatsApp, Data, Horário, Nº de pessoas, Ocasião especial (dropdown), Observações/Alergias
- Checkbox LGPD: consentimento explícito para compartilhamento com parceiros
- Botão submit com loading state e animação de sucesso
- WhatsApp como alternativa: "Prefere falar diretamente?" + ícone WhatsApp

**10. FOOTER**
- Logo branca
- 4 colunas: Navegação / Cardápio (categorias) / Contato / Redes Sociais
- Instagram embed ou link para `@portocabralbc`
- Direitos autorais + links de política de privacidade
- Fundo: azul royal profundo `#0F2347`

---

### Página Cardápio `/cardapio`

**Experiência de Flipbook Imersivo — Conceito Central**

O cardápio deve ser uma experiência imersiva única, inspirada em um cardápio físico náutico de bordo. Quando o usuário abre `/cardapio`, é como abrir um diário de bordo do capitão.

**Design do Flipbook:**
- Fundo da página: textura de madeira de convés de barco ou lona náutica
- O "livro" fica centralizado, com sombras que o fazem parecer físico
- Capa do livro: azul royal com a caravela dourada + título "Menu Porto Cabral" em fonte cursiva
- Animação de virar páginas: efeito CSS 3D transform com `perspective` e `rotateY`
- Som opcional ao virar página (som de papel — toggle no/off)
- Navegação por categorias no topo: Entradas / Iguarias do Mar / Camarões & Peixes / Trattoria / Carnes & Aves / Sobremesas / Bebidas / Drinks

**Cada página do flipbook contém:**
- Título da categoria em fonte decorativa dourada + ilustração náutica relevante
- Lista de pratos com: nome em negrito, descrição em italic, preço à direita
- Foto do prato (quando disponível via CMS) em moldura com borda dourada
- Indicadores: vegano 🌱, sem lactose, para 2 pessoas
- Elementos decorativos: ilustrações douradas de frutos do mar na borda

**Pratos a incluir (dados completos do cardápio oficial):**

ENTRADAS QUENTES:
- Vieiras Canadenses R$199 — 6 unidades na manteiga de ervas e pesto
- Camarão à Romana R$162 — Empanado com queijo parmesão
- Camarão Soltinho R$142 — Empanado
- Camarão Alho e Óleo R$149 — Grelhado ao alho e óleo
- Ostra Gratinada R$99 — 12 unidades
- Ostra ao Bafo R$99 — 12 unidades com espuma de manga e raspas de limão siciliano
- Mariscada à Marago R$89 — Mariscos cozidos com leite de coco, manteiga de ervas e temperos frescos
- Isca de Mignon R$139 — Grelhadas e aceboladas
- Isca de Peixe Empanadas R$139
- Lula à Milanesa R$119 — Empanada ao gergelim
- Bolinho de Camarão R$24 (1 un) / Bolinho de Lagosta R$29 (1 un) / Bolinho de Bacalhau R$74 (6 un)
- Batata Frita R$42 (400g)
- Descobridor de 7 Mares R$239 — Camarão soltinho, isca de peixe, lula empanada ao gergelim e batata frita
- Dadinho de Bacalhau R$79 — 6 unidades com vinagrete de polvo
- Burrata ao Pomodoro R$109 — Empanada no panko com pães artesanais e molho pomodoro

ENTRADAS FRIAS:
- Tartare de Atum e Salmão R$99 — Base de abacate, atum e salmão com especiarias, cream cheese, crispy de alho-poró e chips de batata doce
- Ceviche Salmão ou Tilápia R$94 — Cebola roxa, pedacinhos de maçã verde e crispy de alho-poró
- Bruschettas de Salmão Defumado R$89 — Focaccia, mostarda dijon, salmão defumado e raspas de limão-siciliano (4 un)
- Steak Tartare R$109 — Mignon com especiarias, azeite de ervas, finalizado com gema de ovo e chips de batata doce
- Burrata Caprese R$109 — Tomate confit com focaccia, presunto parma (Prato Frio)
- Tábua de Frios R$139 — Parma, presunto, salaminho, peito peru, gruyere, golda, provolone, parmesão, tomate cereja, pães da casa, ovo codorna, azeitona, morango, nozes, uva, geleia de pimenta, molho tártaro (Solicitar disponibilidade)

SALADAS:
- Salada Mediterrânea R$259 — Mix de folhas verdes, molho caesar, manga, queijo parmesão, lula, polvo e camarão grelhado
- Salada de Camarão R$99 — Mix de folhas verdes, abacate, queijo gorgonzola, molho de mostarda e mel, camarão empanado no panko e molho teryaki
- Salada de Salmão Defumado R$99 — Mix de folhas verdes, repolho roxo, queijo gruyere, damasco, morango, amêndoas laminadas e molho de mostarda e mel
- Salada Mista R$84 — Beterraba, cenoura ralada e cozida, grão de bico, rúcula, tomate, pepino, couve flor, palmito e mix de folhas

IGUARIAS DO MAR (Para Compartilhar — acompanham arroz branco e pirão de peixe):
- Capitão Cabral R$319 — Polvo à moda da casa com arroz cremoso de limão siciliano, pimentões e batata sauté
- A Imperatriz R$319 — Polvo à lagareiro com alho em lascas, batatas aos murros e arroz com brócolis
- Paella do Porto R$299 — Prato típico a base de arroz com marisco, lula, polvo e camarão
- Sol Poente R$309 — Fritada de frutos do mar, polvo, camarão, peixe e lula, acompanhado de molho de camarão
- Tesouros do Mar R$499 — 4 filés de lagosta, 4 camarões, 250g de congrio ou salmão, 4 bolinhos de camarão, 4 ostras gratinadas, fritas e molho de camarão
- Ohana R$339 — Salmão grelhado ao molho de camarão, 4 ostras gratinadas, 4 bolinhos de camarão, 4 camarões à romana com arroz cremoso de manjericão
- Lagosta Grelhada R$399 — Grelhada na manteiga, guarnecida de batatas gratinadas e molho de camarão
- Lagosta a Fiorentina R$399 — Grelhada e gratinada com espinafre e bacon, guarnecida de batata palha
- Lagosta ao Champagne R$399 — Grelhada e regada ao molho cremoso de espumante guarnecido de batata sauté
- Estrela do Mar R$289 — Moqueca de peixe e camarão guarnecida de farofa de dendê e batata sauté
- King Crab R$780/KG — King crab inteiro e molhos especiais

PEIXES (acompanham arroz branco e pirão de peixe):
- Bacalhau às Natas R$289
- Bacalhau à Portuguesa R$289
- Bacalhau na Crosta de Grão de Bico R$289
- Congrio com Castanha e Banana R$269
- Peixe a Pomodoro R$259
- Peixe à Belle Meunière (Congrio R$269 / Salmão | Linguado R$259)
- Peixe Almirante do Porto (Congrio R$269 / Salmão | Linguado R$259)
- Peixe à Fiorentina (Congrio R$269 / Salmão | Linguado R$259)

CAMARÕES (acompanham arroz branco e pirão de peixe):
- Camarão Grelhado R$289
- Camarão à Girassol R$289
- Camarão à La Grega R$289
- Camarão a La Maragogi R$289
- Camarão a La Cordazzo R$289
- Camarão a Catupiry R$289
- Pérola do Porto R$289
- Costa del Mar R$429

TRATTORIA:
- Nhoque à Zanzibar R$129
- Fettuccine de Salmão R$219
- Filé à Duxelles R$219
- Risoto Carret de Cordeiro R$259
- Risoto de Camarão R$289
- Risoto de Mignon com Funghi R$219
- Filé ao Molho Poivre R$219

CARNES E AVES:
- Filé Mignon à Parmegiana R$219
- Picanha do Capitão R$229
- Frango à Brasileira R$149
- Frango na Mostarda R$149

DA HORTA AO PRATO (Veganos/Vegetarianos):
- A(mar) R$59 — Fettucine com legumes
- Mahalo R$59 — Isca de peixe vegetal, arroz branco, feijão, batata frita e salada
- Moqueca Vegana R$59

SOBREMESAS:
- Pérola Negra R$35 — Brownie com calda, amêndoas, sorvete de creme e morango
- Pudim Tradicional R$35 (sem lactose)
- Pudim de Doce de Leite R$35 (sem lactose)
- Pudim de Pistache R$35 (sem lactose)
- Crème Brûlée R$45 (sem lactose)

BEBIDAS — Soft Drinks:
- Água R$8 / San Pellegrino R$38 / Acqua Panna R$38 / Água de Coco R$20
- Refrigerante R$9 / Suco de Uva R$18 / Sucos R$14 / Limonada Suíça R$18 / Soda Italiana R$16 / Red Bull R$20
- Chá da Casa R$18 / Chá Preto R$18

CERVEJAS:
- Chopp R$16 / Chopp IPA R$18 / Heineken R$16 / Heineken Zero R$16 / Corona R$16

DRINKS TRADICIONAIS:
- Moscow Mule R$34 / Aperol Spritz R$34 / Mojito R$32 / Carajillo R$34
- Cosmopolitan R$32 / Margarita Tradicional R$34 / Negroni R$38 / Gin Tônica R$32 / Gin Tropical R$36

DRINKS AUTORAIS PORTO CABRAL:
- Blue Ocean R$48 — Malibu, vodka, sprite e curaçao azul
- Love on Board R$28 — Sake, xarope de frutas vermelhas e espumante de gengibre
- Relax R$38 — Gin, chá de camomila, suco de maracujá, hortelã, suco de limão e bitter
- Holandês Voador R$36 / Fada Verde R$36 / Éden R$45 / Tropicália R$36 / New York Sour R$52
- Porto Dubai R$69 — Xarope de romã, vinho do porto, siciliano e whisky

CAIPIRINHAS — Vodka/Cachaça/Vinho/Sakê R$30 | Steinhager R$32 | Absolut R$34 | Jagermaister R$34
- Caipira Tropical Especial R$42

DOSES: Gin R$28 / Vodka Nacional R$25 / Vodka Premium R$30 / Whisky Jack Daniels R$30 / Cachaça Premium R$28 / José Cuervo R$28-30 / Martini R$25 / Campari R$25 / Licor 43 R$30 / Jagermeister R$28 / Cointreau R$28

---

### Página Sobre `/sobre`

- **Hero:** Foto aérea do restaurante flutuante ou foto panorâmica do molhe ao pôr do sol
- **Seção "Nasce um Sonho":** Timeline visual de 2009 (idealização) → 2010 (inauguração) → hoje
- **Foto do fundador Edson Cabral** com quote em destaque
- **Texto narrativo completo:** A visão de criar algo único na cidade, a escolha do Molhe da Barra Sul, a sensação de "estar a bordo", a brisa do mar, o melhor sunset da cidade
- **"Por que Flutuante?":** Seção especial com 3 pilares visuais: Vista Privilegiada / Sensação de Bordo / Sunset Único
- **Equipe:** Grid com fotos da equipe (dados do CMS)
- **Valores e Filosofia**

---

### Página Blog `/blog`

- Grid de posts (Payload CMS)
- Cards com foto, título, data, categoria, preview do texto
- Página interna de post com rich text, fotos, breadcrumb
- SEO completo por post

---

### Área do Cliente `/cliente`

**Autenticação (NextAuth.js v5):**
- Tela de login/cadastro elegante com fundo vídeo ou foto
- Email/senha + opção OAuth (Google)
- Verificação de email

**Dashboard do Cliente (após login):**
- Saudação personalizada com nome
- Tabs: Minhas Reservas / Meu Perfil / Preferências / Quiz / Pedidos

**Minhas Reservas:**
- Histórico de reservas com status (confirmada, pendente, concluída)
- Botão para nova reserva
- Detalhes de cada reserva

**Meu Perfil:**
- Edição de dados pessoais: nome, email, WhatsApp, data de nascimento, cidade de origem
- Campo de alergias e intolerâncias alimentares (muito visível, com ícone de alerta)
- Campo de observações especiais padrão

**Quiz de Preferências (6 passos interativos — estilo onboarding premium):**
- Passo 1: "Qual a sua ocasião?" — Jantar romântico / Comemoração / Reunião de negócios / Passeio em família / Quero explorar
- Passo 2: "Com que frequência nos visita?" — Primeira vez / Algumas vezes / Visitante frequente
- Passo 3: "Suas preferências gastronômicas?" — Frutos do mar / Carnes / Massas e risotos / Tudo um pouco
- Passo 4: "Suas bebidas favoritas?" — Vinhos / Drinks autorais / Cervejas / Não consumo álcool
- Passo 5: "Tamanho do grupo habitual?" — Só eu / Casal / 3 a 4 pessoas / 5 ou mais
- Passo 6: "Como conheceu o Porto Cabral?" — Instagram / Indicação / Google / Passei pelo molhe
- Barra de progresso visual + animações suaves entre passos
- Ao finalizar: mensagem de agradecimento personalizada

**Pedidos à Cozinha (futuro):**
- Placeholder elegante com "Em breve" e descrição da funcionalidade

---

### Painel Admin `/admin` (Payload CMS)

Gerenciado pelo Payload CMS com as seguintes coleções editáveis por leigos:

1. **Cardápio:** nome, categoria, descrição, preço, foto, destaque (sim/não), disponível (sim/não), vegano, sem lactose, serve quantas pessoas
2. **Pratos em Destaque:** seleção dos 6 pratos que aparecem na home
3. **Experiências:** título, descrição, foto de fundo, CTA
4. **Nossa História:** texto, fotos, timeline
5. **Equipe:** nome, cargo, foto, bio
6. **Blog:** título, conteúdo rich text, foto de capa, categoria, autor, publicado
7. **Configurações do Site:** horários, WhatsApp, endereço, links de redes sociais
8. **Depoimentos manuais:** fallback caso Google Reviews falhe

---

## COMPONENTES ESPECIAIS

**1. Seletor de Idioma (PT/EN/ES)**
- Dropdown compacto no navbar
- Bandeirinha + código do idioma
- Troca conteúdo sem recarregar (next-intl)
- Detecta idioma do navegador automaticamente na primeira visita

**2. Formulário de Reserva**
- Campos: nome completo, email, WhatsApp (máscara), data (date picker premium), horário (select com slots), nº pessoas (stepper), ocasião especial, observações, alergias
- Checkbox LGPD obrigatório: "Concordo com o compartilhamento dos meus dados com parceiros premium de Balneário Camboriú para fins de ofertas exclusivas"
- Validação em tempo real com feedback visual
- Loading state com animação náutica
- Sucesso: animação de confetes em azul e dourado + mensagem

**3. Navbar com Glassmorphism**
```css
.navbar-scrolled {
  backdrop-filter: blur(20px);
  background: rgba(26, 58, 107, 0.85);
  border-bottom: 1px solid rgba(212, 168, 67, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}
```

**4. Flipbook do Cardápio**
- Implementado com CSS 3D transforms
- Estado: página atual, direção do flip, animação em andamento
- Touch/swipe support para mobile
- Thumbnail de categorias para navegação rápida

**5. Mapa Mapbox**
- Style: mapa dark customizado com cores azul marinho e dourado
- Pin: SVG de caravela dourada
- Popup ao clicar: nome do restaurante, endereço, horário, botão "Como Chegar"
- Zoom inicial: 15, centrado no pin do Porto Cabral

**6. WhatsApp Integration**
- Botão na seção de reservas: "Reserve pelo WhatsApp"
- Link: `https://wa.me/55NÚMERO?text=Olá!%20Gostaria%20de%20fazer%20uma%20reserva%20no%20Porto%20Cabral`
- Seção de contato no footer: ícone + número

---

## ANIMAÇÕES E MICROINTERAÇÕES

**GSAP ScrollTrigger:**
- Títulos de seção: split text animado letra por letra ao entrar na viewport
- Cards: entrada com stagger (0.15s entre cada)
- Parallax suave em fotos de fundo (movimento 20% do scroll)
- Número de mesas/anos/clientes: counter animado

**Framer Motion:**
- Page transitions: fade + slide suave entre páginas
- Modal do prato: scale up + fade in
- Quiz steps: slide horizontal + fade
- Cards do cardápio: hover com lift + shadow

**Three.js (Hero):**
- Partículas flutuantes representando espuma do mar
- ~200 partículas brancas/azul claro, tamanho 1-3px
- Movimento ondulatório suave
- Interatividade: partículas afastam levemente do cursor do mouse

**CSS Animations:**
- Shimmer no botão CTA dourado
- Ondas SVG animadas como separadores de seção
- Pulse suave em ícones de contato
- Scanline sutil na logo ao hover

---

## SEO E PERFORMANCE

**Schema.org completo:**
```json
{
  "@type": "Restaurant",
  "name": "Porto Cabral BC",
  "description": "Único restaurante flutuante de Balneário Camboriú, localizado no Molhe da Barra Sul",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Molhe da Barra Sul",
    "addressLocality": "Balneário Camboriú",
    "addressRegion": "SC",
    "postalCode": "88337-260",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -26.9982,
    "longitude": -48.6358
  },
  "servesCuisine": ["Frutos do Mar", "Brasileira Contemporânea"],
  "priceRange": "R$150-R$200 por pessoa",
  "hasMap": "https://maps.google.com/...",
  "sameAs": ["https://www.instagram.com/portocabralbc/"]
}
```

**Meta tags:**
- Open Graph completo (foto do restaurante ao pôr do sol)
- Twitter Card
- Canonical URLs por idioma (hreflang PT/EN/ES)
- Sitemap.xml automático (next-sitemap)

**Performance:**
- Imagens: Next.js Image component com lazy loading + WebP
- Fontes: next/font com preload
- Vídeo hero: lazy load com poster frame

---

## CONTEÚDO TRILÍNGUE (next-intl)

Arquivos de tradução em `/messages/pt.json`, `/messages/en.json`, `/messages/es.json` com todas as strings:
- Navbar, footer, CTAs
- Seções da home
- Formulário de reserva (labels, placeholders, mensagens de erro/sucesso)
- Cardápio (nomes e descrições dos pratos nos 3 idiomas)
- Quiz (perguntas e opções)
- Páginas sobre e blog

---

## ESTRUTURA DE ARQUIVOS ESPERADA

```
porto-cabral/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx (home)
│   │   ├── cardapio/page.tsx
│   │   ├── sobre/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── cliente/
│   │   │   ├── page.tsx (dashboard)
│   │   │   ├── login/page.tsx
│   │   │   └── perfil/page.tsx
│   │   └── layout.tsx
│   └── api/
│       ├── reserva/route.ts
│       ├── auth/[...nextauth]/route.ts
│       └── reviews/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── ExperienceCards.tsx
│   │   ├── MenuPreview.tsx
│   │   ├── OurStory.tsx
│   │   ├── Experiences.tsx
│   │   ├── Testimonials.tsx
│   │   └── ReservationForm.tsx
│   ├── cardapio/
│   │   └── Flipbook.tsx
│   ├── mapa/
│   │   └── MapboxMap.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── LanguageSelector.tsx
│       └── Logo.tsx
├── messages/
│   ├── pt.json
│   ├── en.json
│   └── es.json
├── lib/
│   ├── bcconnect.ts (integração BC Connect)
│   └── mapbox.ts
└── public/
    └── images/
```

---

## OBSERVAÇÕES FINAIS PARA O STITCH

1. **A logo deve ser reproduzida como SVG inline** — caravela em linha branca, texto "·PORTO·" acima, "CABRAL" em Art Deco geométrico, "GASTRONOMIA FLUTUANTE" abaixo
2. **Nenhum evento separado** — remover completamente seção de eventos
3. **Sem botão WhatsApp flutuante** — integrar elegantemente nas seções de reserva e contato
4. **Cada prato no flipbook** deve ter espaço para foto (placeholder dourado quando sem foto)
5. **LGPD:** checkbox de consentimento em TODOS os formulários que coletam dados
6. **Mobile-first** — todo layout responsivo desde 320px
7. **Dark mode** não necessário — o site é sempre azul royal + dourado
8. **Acessibilidade:** ARIA labels, contraste adequado, keyboard navigation
