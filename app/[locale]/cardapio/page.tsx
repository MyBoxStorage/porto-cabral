'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { getMenuSectionIcon } from '@/components/icons/menu-icons'
import { useSiteContent } from '@/lib/useSiteContent'

type Item = { name: string; price: string; desc?: string; tag?: 'vegano' | 'sem-lactose' | 'destaque' }
type Section = { id: string; title: string; subtitle: string; items: Item[] }

const SECTIONS: Section[] = [
  { id:'entradas-quentes', title:'Entradas Quentes', subtitle:'O começo de uma experiência flutuante', items:[
    {name:'Vieiras Canadenses',price:'199',desc:'6 un. na manteiga de ervas e pesto.'},
    {name:'Camarão à Romana',price:'162',desc:'Empanado com queijo parmesão.'},
    {name:'Camarão Soltinho',price:'142',desc:'Empanado.'},
    {name:'Camarão Alho e Óleo',price:'149',desc:'Grelhado ao alho e óleo.'},
    {name:'Ostra Gratinada',price:'99',desc:'12 unidades.'},
    {name:'Ostra ao Bafo',price:'99',desc:'12 un. com espuma de manga e limão siciliano.'},
    {name:'Mariscada à Marago',price:'89',desc:'Mariscos com leite de coco, manteiga de ervas e temperos frescos.'},
    {name:'Isca de Mignon',price:'139',desc:'Grelhadas e aceboladas.'},
    {name:'Isca de Peixe Empanadas',price:'139'},
    {name:'Lula à Milanesa',price:'119',desc:'Empanada ao gergelim.'},
    {name:'Bolinho de Camarão',price:'24',desc:'1 unidade.'},
    {name:'Bolinho de Lagosta',price:'29',desc:'1 unidade.'},
    {name:'Bolinho de Bacalhau',price:'74',desc:'6 unidades.'},
    {name:'Batata Frita',price:'42',desc:'400g.'},
    {name:'Descobridor de 7 Mares',price:'239',desc:'Camarão soltinho, isca de peixe, lula ao gergelim e batata frita.',tag:'destaque'},
    {name:'Dadinho de Bacalhau',price:'79',desc:'6 un. com vinagrete de polvo.'},
    {name:'Burrata ao Pomodoro',price:'109',desc:'Burrata empanada no panko, pães artesanais e molho pomodoro.'},
  ]},
  { id:'entradas-frias', title:'Entradas Frias', subtitle:'Frescor do oceano em cada garfada', items:[
    {name:'Tartare de Atum e Salmão',price:'99',desc:'Base de abacate, cream cheese, crispy de alho-poró e chips de batata doce.'},
    {name:'Ceviche — Salmão ou Tilápia',price:'94',desc:'Cebola roxa, maçã verde e crispy de alho poró.'},
    {name:'Bruschettas de Salmão Defumado',price:'89',desc:'Focaccia, mostarda dijon, salmão defumado e raspas de limão siciliano. 4 un.'},
    {name:'Burrata Caprese',price:'109',desc:'Burrata de tomate confit com foccaccia e presunto parma. Prato frio.'},
    {name:'Steak Tartare',price:'109',desc:'Mignon com especiarias, azeite de ervas, gema de ovo e chips de batata doce.'},
    {name:'Tábua de Frios',price:'139',desc:'Parma, presunto, salaminho, queijos, frutas, pães e geleia de pimenta. (Sob disponibilidade)'},
  ]},
  { id:'saladas', title:'Saladas', subtitle:'O jardim encontra o mar', items:[
    {name:'Salada Mediterrânea',price:'259',desc:'Folhas, caesar, manga, parmesão, lula, polvo e camarão grelhado.'},
    {name:'Salada de Camarão',price:'99',desc:'Folhas, abacate, gorgonzola, mostarda e mel, camarão panko e teryaki.'},
    {name:'Salada de Salmão Defumado',price:'99',desc:'Folhas, repolho roxo, gruyere, damasco, morango, amêndoas e mostarda e mel.'},
    {name:'Salada Mista',price:'84',desc:'Beterraba, cenoura, grão de bico, rúcula, tomate, pepino e palmito.',tag:'vegano'},
  ]},
  { id:'iguarias', title:'Iguarias do Mar', subtitle:'Todos os pratos acompanham arroz branco e pirão de peixe', items:[
    {name:'Capitão Cabral',price:'319',desc:'Polvo à moda da casa com arroz cremoso de limão siciliano, pimentões e batata sauté.',tag:'destaque'},
    {name:'A Imperatriz',price:'319',desc:'Polvo à lagareiro com alho em lascas, batatas aos murros e arroz com brócolis.'},
    {name:'Paella do Porto',price:'299',desc:'Prato típico com arroz, marisco, lula, polvo e camarão.'},
    {name:'Sol Poente',price:'309',desc:'Fritada de frutos do mar, polvo, camarão, peixe e lula com molho de camarão.'},
    {name:'Tesouros do Mar',price:'499',desc:'4 filés de lagosta, 4 camarões, 250g de congrio ou salmão, 4 bolinhos e 4 ostras gratinadas.',tag:'destaque'},
    {name:'Ohana',price:'339',desc:'Salmão grelhado, 4 ostras gratinadas, 4 bolinhos, 4 camarões à romana e arroz cremoso.'},
    {name:'Lagosta Grelhada',price:'399',desc:'Grelhada na manteiga com batatas gratinadas e molho de camarão.'},
    {name:'Lagosta a Fiorentina',price:'399',desc:'Grelhada e gratinada com espinafre e bacon, guarnecida de batata palha.'},
    {name:'Lagosta ao Champagne',price:'399',desc:'Grelhada ao molho cremoso de espumante com batata sauté.'},
    {name:'Estrela do Mar',price:'289',desc:'Moqueca de peixe e camarão com farofa de dendê e batata sauté.'},
    {name:'King Crab',price:'780/kg',desc:'King crab inteiro e molhos especiais.',tag:'destaque'},
  ]},
  { id:'peixes', title:'Peixes', subtitle:'Todos os pratos acompanham arroz branco e pirão de peixe', items:[
    {name:'Bacalhau às Natas',price:'289',desc:'Bacalhau em lascas ao molho de nata. Arroz branco e batata palha.'},
    {name:'Bacalhau à Portuguesa',price:'289',desc:'Bacalhau confitado no azeite de oliva. Arroz branco e batata ao murro.'},
    {name:'Bacalhau na Crosta de Grão de Bico',price:'289',desc:'Com arroz branco, legumes e batatas gratinadas.'},
    {name:'Congrio com Castanha e Banana',price:'269',desc:'Grelhado na cama de banana ao molho de castanha do Pará.'},
    {name:'Peixe a Pomodoro',price:'259',desc:'4 enrolados de linguado com palmito ao molho pomodoro.'},
    {name:'Belle Meunière — Congrio',price:'269',desc:'Grelhado com alcaparras, champignon e camarão.'},
    {name:'Belle Meunière — Salmão / Linguado',price:'259',desc:'Grelhado com alcaparras, champignon e camarão.'},
    {name:'Almirante do Porto — Congrio',price:'269',desc:'Com legumes, batata portuguesa, arroz com brócolis e molho de camarão.'},
    {name:'Almirante do Porto — Salmão / Linguado',price:'259',desc:'Com legumes, batata portuguesa, arroz com brócolis e molho de camarão.'},
    {name:'Peixe à Fiorentina — Congrio',price:'269',desc:'Gratinado com espinafre e bacon. Arroz branco e batata palha.'},
    {name:'Peixe à Fiorentina — Salmão / Linguado',price:'259',desc:'Gratinado com espinafre e bacon. Arroz branco e batata palha.'},
  ]},
  { id:'camaroes', title:'Camarões', subtitle:'Todos os pratos acompanham arroz branco e pirão de peixe', items:[
    {name:'Camarão Grelhado',price:'289',desc:'Grelhados com batatas gratinadas e molho de camarão.'},
    {name:'Camarão à Girassol',price:'289',desc:'Com casca, arroz cremoso, bacon e batatas sauté.'},
    {name:'Camarão à La Grega',price:'289',desc:'Empanados com queijo prato, arroz à grega e batata frita.'},
    {name:'Camarão a La Maragogi',price:'289',desc:'Cremoso com leite de coco, batata frita e legumes.'},
    {name:'Camarão a La Cordazzo',price:'289',desc:'Grelhado ao molho de nata com rúcula, tomate seco e batata sauté.'},
    {name:'Camarão a Catupiry',price:'289',desc:'Gratinado ao molho branco com catupiry e batata palha.'},
    {name:'Pérola do Porto',price:'289',desc:'Empanados com catupiry, arroz cremoso com limão, parmesão e crispy de alho poró.',tag:'destaque'},
    {name:'Costa del Mar',price:'429',desc:'4 grelhados, 4 à grega, 4 à romana e 250g gratinados com batata frita.',tag:'destaque'},
  ]},
  { id:'trattoria', title:'Trattoria', subtitle:'Sabores tradicionais com um toque autoral', items:[
    {name:'Nhoque à Zanzibar',price:'129',desc:'Ao molho de nata com queijo gorgonzola e manjericão fresco.'},
    {name:'Fettuccine de Salmão',price:'219',desc:'Ao molho de nata com tomate seco, azeitona e lascas de salmão.'},
    {name:'Filé à Duxelles',price:'219',desc:'Filé mignon ao molho de nata e cebola, massa pappardelle com cogumelos.'},
    {name:'Risoto Carret de Cordeiro',price:'259',desc:'Risoto de gorgonzola com carré de cordeiro ao molho de vinho tinto.',tag:'destaque'},
    {name:'Risoto de Camarão',price:'289'},
    {name:'Risoto de Mignon com Funghi',price:'219',desc:'Cubos de mignon e funghi.'},
  ]},
  { id:'carnes', title:'Carnes & Aves', subtitle:'Dias em que o mar não está para peixe', items:[
    {name:'Filé Mignon a Parmegiana',price:'219',desc:'Guarnecido de arroz branco e fritas.'},
    {name:'Picanha do Capitão',price:'229',desc:'4 fatias de picanha, polenta frita, aipim com bacon. Arroz com brócolis e farofa.',tag:'destaque'},
    {name:'Frango à Brasileira',price:'149',desc:'Grelhado com arroz de ovo, farofa especial, batata frita e banana a milanesa.'},
    {name:'Filé ao Molho Poivre',price:'219',desc:'Filé ao molho de pimenta do reino em grãos, conhaque, manteiga e nata.'},
    {name:'Frango na Mostarda',price:'149',desc:'Filé de frango ao molho de mostarda.'},
  ]},
  { id:'horta', title:'Da Horta ao Prato', subtitle:'Para todos os gostos e fome', items:[
    {name:'A(MAR)',price:'59',desc:'Fettucine com legumes.',tag:'vegano'},
    {name:'Mahalo',price:'59',desc:'Isca de peixe vegetal, arroz, feijão, batata frita e salada.',tag:'vegano'},
    {name:'Moqueca Vegana',price:'59',desc:'Moqueca de vegetais e legumes.',tag:'vegano'},
  ]},
  { id:'sobremesas', title:'Sobremesas', subtitle:'Seu grand finale', items:[
    {name:'Pérola Negra',price:'35',desc:'Brownie de chocolate com calda, amêndoas laminadas, sorvete de creme e morango.'},
    {name:'Pudim Tradicional',price:'35',desc:'Pudim a base de leite de ovelha.',tag:'sem-lactose'},
    {name:'Pudim de Doce de Leite',price:'35',desc:'Pudim a base de leite de ovelha com doce de leite.',tag:'sem-lactose'},
    {name:'Pudim de Pistache',price:'35',desc:'Pudim a base de leite de ovelha com pistache.',tag:'sem-lactose'},
    {name:'Crème Brûlée',price:'45',desc:'Creme de leite, açúcar, leite de ovelha, baunilha e gema de ovos.',tag:'sem-lactose'},
  ]},
  { id:'bebidas', title:'Bebidas', subtitle:'Para acompanhar cada momento', items:[
    {name:'Água',price:'8',desc:'Com ou sem gás.'},
    {name:'Água San Pellegrino',price:'38'},
    {name:'Água Acqua Panna',price:'38'},
    {name:'Água de Coco',price:'20'},
    {name:'Refrigerante',price:'9',desc:'Coca-Cola, Coca Zero, Guaraná, Sprite, Tônica e versões Zero.'},
    {name:'Sucos',price:'14',desc:'Laranja, limão, abacaxi, abacaxi com hortelã e maracujá.'},
    {name:'Suco de Uva',price:'18'},
    {name:'Limonada Suíça',price:'18',desc:'Com leite condensado e água com gás.'},
    {name:'Soda Italiana',price:'16',desc:'Maçã verde, limão siciliano ou frutas vermelhas.'},
    {name:'Chá da Casa',price:'18',desc:'Chá gelado de mate, mel, limão e gengibre.'},
    {name:'Chopp',price:'16'},
    {name:'Chopp IPA',price:'18'},
    {name:'Heineken',price:'16',desc:'Long neck.'},
    {name:'Heineken Zero',price:'16',desc:'Long neck.'},
    {name:'Corona',price:'16',desc:'Long neck.'},
    {name:'Red Bull',price:'20',desc:'Consulte os sabores.'},
  ]},
  { id:'drinks', title:'Drinks & Caipirinhas', subtitle:'Criações do Porto e clássicos de sempre', items:[
    {name:'Blue Ocean',price:'48',desc:'Malibu, vodka, sprite e curaçao azul. ✦ Autoral Porto Cabral',tag:'destaque'},
    {name:'Love on Board',price:'28',desc:'Sake, xarope de frutas vermelhas e espumante de gengibre. ✦ Autoral'},
    {name:'Relax',price:'38',desc:'Gin, chá de camomila, maracujá, hortelã, limão e bitter. ✦ Autoral'},
    {name:'Éden',price:'45',desc:'Gin, xarope de maçã verde, limão, energético tropical e espuma de gengibre.'},
    {name:'New York Sour',price:'52',desc:'Mistura clarificada e vinho.'},
    {name:'Porto Dubai',price:'69',desc:'Xarope de romã, vinho do porto, siciliano e whisky.',tag:'destaque'},
    {name:'Moscow Mule',price:'34',desc:'Vodka, limão, xarope de gengibre, hortelã e espuma de gengibre.'},
    {name:'Aperol Spritz',price:'34',desc:'Aperol, espumante brut, água com gás e laranja.'},
    {name:'Mojito',price:'32',desc:'Rum, hortelã e água com gás.'},
    {name:'Negroni',price:'38',desc:'Gin, vermouth Rosso, Campari e laranja.'},
    {name:'Gin Tônica',price:'32',desc:'Gin e água tônica com limão.'},
    {name:'Holandês Voador',price:'36',desc:'Xarope de frutas vermelhas, curaçau blue, laranja e tequila.'},
    {name:'Caipirinha Clássica',price:'30',desc:'Vodka, cachaça, vinho ou sakê. Limão, morango, abacaxi, maracujá ou kiwi.'},
    {name:'Caipira Tropical Especial',price:'42',desc:'Morango + kiwi + maracujá ou gengibre + caju + manjericão.'},
  ]},
]

/* ─────────────────────────────────────────────────────────────────────────────
   DESKTOP — funções de HTML do page-flip (sem alteração)
───────────────────────────────────────────────────────────────────────────── */

function coverHTML(s: Section, i: number, total: number) {
  const iconSvg = getMenuSectionIcon(i, '#c9a84c', 44)
  return `<div class="ci">
    <div class="cc tl"></div><div class="cc tr"></div>
    <div class="cc bl"></div><div class="cc br"></div>
    <div class="cb">
      <p class="cf">Logbook N.º ${String(i+1).padStart(2,'0')} · ${String(total).padStart(2,'0')}</p>
      <div class="ci-icon">${iconSvg}</div>
      <h2 class="ct">${s.title}</h2>
      <div class="cd"></div>
      <p class="cs">${s.subtitle}</p>
      <p class="cl">Balneário Camboriú · SC</p>
    </div>
  </div>`
}

function contentHTML(s: Section) {
  const rows = s.items.map(item => {
    const tagClass = item.tag === 'vegano' ? 'tv'
      : item.tag === 'sem-lactose' ? 'tl'
      : item.tag === 'destaque' ? 'td'
      : ''
    const tagLabel = item.tag === 'vegano' ? 'Vegano'
      : item.tag === 'sem-lactose' ? 'Sem lactose'
      : item.tag === 'destaque' ? 'Chef indica'
      : ''
    const tag = tagClass
      ? `<span class="mt ${tagClass}">${tagLabel}</span>`
      : ''
    const desc = item.desc ? `<div class="md">${item.desc}</div>` : ''
    const isHighlight = item.tag === 'destaque'
    return `<div class="mi${isHighlight ? ' mh' : ''}">
      <div class="mr">
        <span class="mn">${item.name}</span>${tag}
        <span class="mdots"></span>
        <span class="mp">R$\u00A0${item.price}</span>
      </div>${desc}
    </div>`
  }).join('')

  const hasNote = s.subtitle.includes('acompanham')
  const noteHtml = hasNote
    ? `<div class="pnote">Os pratos acompanham arroz branco e pirão de peixe</div>`
    : ''

  return `<div class="pi">
    <div class="ph">
      <p class="pe">${s.subtitle}</p>
      <h2 class="pt">${s.title}</h2>
      <div class="pr"><div class="prl"></div><span class="prs">✦</span><div class="prl"></div></div>
    </div>
    ${noteHtml}
    <div class="plist">${rows}</div>
    <div class="pf"><p class="pft">Os pratos servem 2 pessoas · Taxa de serviço 10% · Couvert artístico</p></div>
    <div class="curl"></div>
  </div>`
}

/* ─────────────────────────────────────────────────────────────────────────────
   CSS — desktop (page-flip) + mobile (carrossel nativo)
───────────────────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Josefin+Sans:wght@200;300;400;600&display=swap');

/* ── BASE ── */
.pf-wrap *{box-sizing:border-box}

/* visibilidade: carrossel mobile oculto por padrão, deck visível por padrão */
.pf-mobile-carousel { display: none; }

/* ── HERO HEADER ── */
.pf-hero{
  background:linear-gradient(170deg,#005fa3 0%,#0074bf 45%,#0087d9 80%,#006ab3 100%);
  padding:7rem 1.5rem 5rem;
  text-align:center;
  position:relative;
  overflow:hidden;
}
/* Imagem de fundo do hero quando configurada no painel */
.pf-hero-bg{
  position:absolute;inset:0;z-index:0;
  background-size:cover;background-position:center;background-repeat:no-repeat;
  transition:opacity .4s ease;
}
.pf-hero-bg-overlay{
  position:absolute;inset:0;z-index:1;
  background:linear-gradient(170deg,rgba(0,36,81,0.72) 0%,rgba(0,60,120,0.55) 45%,rgba(0,80,140,0.6) 80%,rgba(0,36,81,0.75) 100%);
}
/* Pontos dourados de fundo */
.pf-hero::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background-image:
    radial-gradient(circle at 15% 50%,rgba(201,168,76,.07) 0%,transparent 50%),
    radial-gradient(circle at 85% 50%,rgba(201,168,76,.07) 0%,transparent 50%),
    radial-gradient(circle at 50% 0%,rgba(0,40,90,.3) 0%,transparent 60%),
    radial-gradient(circle,rgba(255,255,255,.025) 1px,transparent 1px);
  background-size:auto,auto,auto,28px 28px;
}
/* Linha dourada na base do hero fazendo transição com as tabs navy */
.pf-hero::after{
  content:'';position:absolute;bottom:0;left:0;right:0;
  height:1px;
  background:linear-gradient(90deg,transparent 0%,rgba(201,168,76,.6) 30%,rgba(201,168,76,.9) 50%,rgba(201,168,76,.6) 70%,transparent 100%);
}
.pf-hero-inner{position:relative;z-index:1}
.pf-hero-eyebrow{
  font-family:'Josefin Sans',sans-serif;
  font-size:.52rem;letter-spacing:.6em;text-transform:uppercase;
  color:rgba(201,168,76,.9);
  font-weight:700;
  margin:0 0 1.8rem;
  display:flex;align-items:center;justify-content:center;gap:1.2rem;
}
.pf-hero-eyebrow::before,.pf-hero-eyebrow::after{
  content:'';display:block;height:1px;width:3.5rem;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,.8));
}
.pf-hero-eyebrow::after{
  background:linear-gradient(90deg,rgba(201,168,76,.8),transparent);
}
.pf-hero-title{
  font-family:'Playfair Display',serif;
  font-size:clamp(4rem,10vw,7.5rem);
  font-style:italic;font-weight:400;
  color:#c9a84c;
  line-height:.95;letter-spacing:-.02em;
  margin:0 0 1.6rem;
  text-shadow:0 4px 40px rgba(201,168,76,.15);
}
.pf-hero-rule{
  display:flex;align-items:center;justify-content:center;gap:1rem;
  max-width:320px;margin:0 auto 1.4rem;
}
.pf-hero-rule-line{
  flex:1;height:1px;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,.5));
}
.pf-hero-rule-line:last-child{
  background:linear-gradient(270deg,transparent,rgba(201,168,76,.5));
}
.pf-hero-rule-glyph{
  font-family:'Cormorant Garamond',serif;
  color:rgba(201,168,76,.75);font-size:1rem;letter-spacing:.15em;
}
.pf-hero-sub{
  font-family:'Cormorant Garamond',serif;
  font-size:1.15rem;font-style:italic;
  color:rgba(255,255,255,.65);
  font-weight:600;
  letter-spacing:.03em;
}
/* Seta scroll-down */
.pf-hero-scroll{
  margin-top:2.5rem;
  display:flex;flex-direction:column;align-items:center;gap:.5rem;
}
.pf-hero-scroll-line{
  width:1px;height:2.5rem;
  background:linear-gradient(180deg,rgba(201,168,76,.5),transparent);
}
.pf-hero-scroll-dot{
  width:5px;height:5px;border-radius:50%;
  background:rgba(201,168,76,.55);
}

/* ── TABS ── */
.pf-tabs{
  background:linear-gradient(180deg,#071628 0%,#0a1f3a 100%);
  border-bottom:1px solid rgba(201,168,76,.2);
  overflow-x:auto;
  position:sticky;top:0;z-index:40;
  scrollbar-width:none;
  box-shadow:0 4px 24px rgba(0,0,0,.45);
  display:flex;
  justify-content:center;
  position:relative;
}
.pf-tabs::before{
  content:'';
  position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(201,168,76,.35),transparent);
  pointer-events:none;
}
.pf-tabs::-webkit-scrollbar{display:none}
.pf-ti{
  display:flex;min-width:max-content;
  padding:0 2rem;
  gap:.25rem;
  /* centraliza as tabs no container */
  margin:0 auto;
}
.pf-tab{
  padding:1.1rem 1.35rem;
  border:none;background:transparent;
  font-family:'Josefin Sans',sans-serif;
  font-size:.56rem;letter-spacing:.22em;text-transform:uppercase;
  font-weight:700;
  color:rgba(201,168,76,.6);
  cursor:pointer;
  border-bottom:2px solid transparent;
  white-space:nowrap;
  transition:color .2s,border-color .2s,background .2s;
  min-height:52px;display:flex;align-items:center;
  position:relative;
}
.pf-tab:hover{
  color:rgba(201,168,76,.8);
  background:rgba(201,168,76,.05);
}
.pf-tab.on{
  color:#c9a84c;
  font-weight:800;
  border-bottom-color:#c9a84c;
  background:rgba(201,168,76,.07);
}
/* separador vertical entre tabs */
.pf-tab+.pf-tab::before{
  content:'';
  position:absolute;left:0;top:30%;bottom:30%;
  width:1px;
  background:rgba(201,168,76,.1);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DESKTOP — page-flip (sem alteração)
═══════════════════════════════════════════════════════════════════════════ */
@media (min-width: 768px) {
  .pf-deck{
    background:#130b02;
    background-image:
      repeating-linear-gradient(90deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 118px,rgba(255,255,255,.018) 119px,rgba(255,255,255,.018) 120px),
      repeating-linear-gradient(0deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 118px,rgba(255,255,255,.012) 119px,rgba(255,255,255,.012) 120px);
    padding:3.5rem 1rem 5rem;
    display:flex;flex-direction:column;align-items:center;
  }
  .pf-book-wrap{width:100%;max-width:940px;position:relative}
  .pf-book-wrap::after{
    content:'';position:absolute;
    bottom:-22px;left:6%;right:6%;height:44px;
    background:radial-gradient(ellipse,rgba(0,0,0,.7) 0%,transparent 70%);
    pointer-events:none;
  }
  .page{background:#f4e8ca;overflow:hidden}
  .page-cover{background:#071628!important}

  .ci{
    width:100%;height:100%;
    display:flex;align-items:center;justify-content:center;
    padding:2rem;position:relative;overflow:hidden;
  }
  .ci::before{
    content:'';position:absolute;inset:0;
    background:radial-gradient(circle,rgba(201,168,76,.055) 1px,transparent 1px);
    background-size:22px 22px;
  }
  .cc{position:absolute;width:60px;height:60px}
  .cc.tl{top:0;left:0;
    background:linear-gradient(135deg,rgba(201,168,76,.25) 0%,rgba(201,168,76,.08) 60%,transparent 100%);
    clip-path:polygon(0 0,100% 0,0 100%)}
  .cc.tr{top:0;right:0;
    background:linear-gradient(225deg,rgba(201,168,76,.25) 0%,rgba(201,168,76,.08) 60%,transparent 100%);
    clip-path:polygon(0 0,100% 0,100% 100%)}
  .cc.bl{bottom:0;left:0;
    background:linear-gradient(45deg,rgba(201,168,76,.25) 0%,rgba(201,168,76,.08) 60%,transparent 100%);
    clip-path:polygon(0 0,0 100%,100% 100%)}
  .cc.br{bottom:0;right:0;
    background:linear-gradient(315deg,rgba(201,168,76,.25) 0%,rgba(201,168,76,.08) 60%,transparent 100%);
    clip-path:polygon(100% 0,100% 100%,0 100%)}

  .cb{
    position:relative;z-index:1;
    border:1px solid rgba(201,168,76,.3);
    padding:2.2rem 2rem;text-align:center;
    background:rgba(0,0,0,.22);width:100%;
  }
  .cb::before{
    content:'';position:absolute;
    top:6px;left:6px;right:6px;bottom:6px;
    border:1px solid rgba(201,168,76,.1);
    pointer-events:none;
  }
  .cf{
    font-family:'Josefin Sans',sans-serif;
    font-size:.5rem;letter-spacing:.44em;text-transform:uppercase;
    color:rgba(201,168,76,.45);margin:0 0 1rem;
  }
  .ci-icon{margin:0 0 1rem;display:flex;justify-content:center;align-items:center}
  .ct{
    font-family:'Playfair Display',serif;
    font-size:clamp(1.15rem,3.2vw,1.7rem);
    font-style:italic;font-weight:400;
    color:#c9a84c;margin:0 0 .55rem;line-height:1.2;
  }
  .cd{
    height:1px;margin:.85rem auto;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,.7),transparent);
    max-width:160px;
  }
  .cs{
    font-family:'Cormorant Garamond',serif;
    font-size:.82rem;font-style:italic;
    color:rgba(255,255,255,.4);margin:0 0 1.3rem;line-height:1.55;
  }
  .cl{
    font-family:'Josefin Sans',sans-serif;
    font-size:.46rem;letter-spacing:.3em;text-transform:uppercase;
    color:rgba(201,168,76,.32);
  }

  .pi{
    width:100%;height:100%;
    display:flex;flex-direction:column;
    padding:2.2rem 2rem 1.4rem;
    position:relative;overflow:hidden;
  }
  .pi::before{
    content:'';position:absolute;inset:0;pointer-events:none;
    background:
      radial-gradient(ellipse at 10% 14%,rgba(255,255,255,.58) 0%,transparent 38%),
      radial-gradient(ellipse at 90% 86%,rgba(150,110,50,.06) 0%,transparent 38%),
      repeating-linear-gradient(180deg,transparent,transparent 27px,rgba(150,100,25,.055) 28px);
  }
  .pi::after{
    content:'';position:absolute;top:0;left:0;bottom:0;width:14px;pointer-events:none;
    background:linear-gradient(90deg,rgba(0,0,0,.1) 0%,rgba(0,0,0,.03) 55%,transparent 100%);
  }

  .ph{flex-shrink:0;text-align:center;margin-bottom:1.3rem;position:relative;z-index:1}
  .pe{
    font-family:'Josefin Sans',sans-serif;
    font-size:.5rem;letter-spacing:.3em;text-transform:uppercase;
    color:rgba(110,72,14,.48);margin:0 0 .28rem;
  }
  .pt{
    font-family:'Playfair Display',serif;
    font-size:clamp(1.35rem,3.8vw,2rem);
    font-style:italic;font-weight:400;
    color:#18100a;margin:0 0 .5rem;line-height:1.1;
  }
  .pr{display:flex;align-items:center;justify-content:center;gap:.55rem}
  .prl{height:1px;width:2.2rem;background:rgba(140,90,22,.22)}
  .prs{color:rgba(140,90,22,.38);font-size:.65rem;line-height:1}

  .pnote{
    flex-shrink:0;
    font-family:'Josefin Sans',sans-serif;
    font-size:.47rem;letter-spacing:.16em;text-transform:uppercase;
    color:rgba(110,72,14,.4);
    text-align:center;
    border-top:1px solid rgba(130,85,18,.12);
    border-bottom:1px solid rgba(130,85,18,.12);
    padding:.38rem 0;margin:0 0 .95rem;
    position:relative;z-index:1;
  }

  .plist{
    flex:1;overflow-y:auto;
    position:relative;z-index:1;
    scrollbar-width:thin;
    scrollbar-color:rgba(180,130,40,.3) transparent;
  }
  .plist::-webkit-scrollbar{width:3px}
  .plist::-webkit-scrollbar-thumb{background:rgba(180,130,40,.3);border-radius:2px}

  .mi{padding:.52rem 0;border-bottom:1px solid rgba(130,85,18,.09)}
  .mi:last-child{border-bottom:none}
  .mh{
    background:linear-gradient(90deg,rgba(201,168,76,.08),transparent);
    margin:0 -.2rem;padding:.52rem .2rem;border-radius:2px;
  }
  .mr{display:flex;align-items:baseline;width:100%;gap:4px}
  .mn{
    font-family:'Playfair Display',serif;
    font-size:clamp(.8rem,1.9vw,.9rem);
    font-weight:700;color:#18100a;flex-shrink:0;line-height:1.3;
  }
  .mt{
    font-family:'Josefin Sans',sans-serif;
    font-size:.44rem;letter-spacing:.05em;text-transform:uppercase;
    padding:2px 6px;border-radius:10px;flex-shrink:0;
  }
  .tv{background:#d4edda;color:#1d5e2a}
  .tl{background:#d1ecf1;color:#0c5460}
  .td{background:rgba(201,168,76,.18);color:#7a4500;border:1px solid rgba(201,168,76,.32)}
  .mdots{
    flex:1;border-bottom:1.5px dotted rgba(110,72,14,.22);
    margin:0 6px;position:relative;top:-3px;min-width:10px;
  }
  .mp{
    font-family:'Josefin Sans',sans-serif;
    font-size:clamp(.74rem,1.8vw,.84rem);
    font-weight:600;color:#7a4500;flex-shrink:0;letter-spacing:.01em;
  }
  .md{
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(.84rem,1.9vw,.97rem);
    font-style:italic;color:rgba(52,32,6,.56);
    margin:.09rem 0 0;line-height:1.4;padding-right:.4rem;
  }

  .pf{
    flex-shrink:0;
    padding-top:.65rem;
    border-top:1px solid rgba(130,85,18,.1);
    margin-top:.4rem;text-align:center;
    position:relative;z-index:1;
  }
  .pft{
    font-family:'Josefin Sans',sans-serif;
    font-size:.44rem;letter-spacing:.18em;text-transform:uppercase;
    color:rgba(100,65,10,.38);
  }
  .curl{
    position:absolute;bottom:0;right:0;z-index:2;pointer-events:none;
    width:0;height:0;border-style:solid;
    border-width:0 0 44px 44px;
    border-color:transparent transparent #ddc99e transparent;
    filter:drop-shadow(-2px -2px 3px rgba(0,0,0,.14));
  }

  .pf-nav{
    display:flex;align-items:center;justify-content:center;
    gap:1.6rem;margin-top:2rem;
  }
  .pf-btn{
    width:3rem;height:3rem;border-radius:50%;
    background:rgba(201,168,76,.1);
    border:1px solid rgba(201,168,76,.4);
    color:#c9a84c;font-size:1.45rem;
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;transition:all .2s;font-family:serif;line-height:1;
  }
  .pf-btn:hover:not(:disabled){background:rgba(201,168,76,.2);transform:scale(1.08)}
  .pf-btn:disabled{opacity:.18;cursor:default}
  .pf-nav-center{display:flex;flex-direction:column;align-items:center;gap:.55rem}
  .pf-dots{display:flex;gap:2px;align-items:center;flex-wrap:wrap;justify-content:center}
  .pf-dot{
    width:44px;height:44px;
    display:flex;align-items:center;justify-content:center;
    border:none;cursor:pointer;background:transparent;padding:0;
  }
  .pf-dot-inner{
    width:5px;height:5px;border-radius:50%;
    background:rgba(201,168,76,.28);
    transition:all .24s;
  }
  .pf-dot.on .pf-dot-inner{width:20px;border-radius:3px;background:#c9a84c}

  @keyframes hint-slide {
    0%   { transform: translateX(0);    opacity: .9; }
    40%  { transform: translateX(28px); opacity: .5; }
    70%  { transform: translateX(-8px); opacity: .8; }
    100% { transform: translateX(0);    opacity: .9; }
  }
  .pf-hint {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,0,0,.55);
    border: 1px solid rgba(201,168,76,.3);
    backdrop-filter: blur(8px);
    border-radius: 100px;
    padding: 7px 16px;
    pointer-events: none;
    z-index: 20;
    animation: hint-slide 1.6s ease-in-out infinite;
  }
  .pf-hint-icon { font-size: 1rem; line-height: 1; }
  .pf-hint-text {
    font-family: 'Josefin Sans', sans-serif;
    font-size: .5rem;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: rgba(201,168,76,.8);
    white-space: nowrap;
  }
  .pf-folio{
    font-family:'Cormorant Garamond',serif;
    font-style:italic;font-size:.86rem;
    color:rgba(201,168,76,.62);text-align:center;margin:0;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE — carrossel nativo com scroll-snap
   Filosofia: zero page-flip, zero conflito de touch, scroll nativo do browser.
   Visual: cards com efeito de profundidade (scale + opacity) nas laterais.
═══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 767px) {
  /* mostra carrossel, oculta page-flip */
  .pf-mobile-carousel { display: block; }
  .pf-deck { display: none !important; }

  /* Hero mobile */
  .pf-hero { padding: 5rem 1.2rem 3.5rem; }
  .pf-hero-title { font-size: clamp(3.2rem,14vw,5rem); }
  .pf-hero-scroll { margin-top: 1.8rem; }

  /* Tabs mobile — menores mas ainda legíveis */
  .pf-ti { padding: 0 1rem; gap: 0; }
  .pf-tab {
    padding: .9rem .85rem;
    font-size: .5rem;
    letter-spacing: .16em;
    min-height: 46px;
  }

  /* ── WRAPPER DO CARROSSEL ── */
  .mc-wrap {
    background: #0a1020;
    padding: 1.5rem 0 2.5rem;
    position: relative;
  }

  /* ── TRILHO DE SCROLL (scroll-snap container) ── */
  .mc-track {
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 0;
    padding: 1rem calc((100vw - 82vw) / 2);
  }
  .mc-track::-webkit-scrollbar { display: none; }

  /* ── CARD ── */
  .mc-card {
    flex: 0 0 82vw;
    scroll-snap-align: center;
    scroll-snap-stop: always;
    margin: 0 2vw;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    /* altura fixa padronizada — garante cards do mesmo tamanho independente do numero de itens */
    height: 78vh;
    display: flex;
    flex-direction: column;
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                opacity 0.35s ease;
    transform: scale(0.92);
    opacity: 0.55;
    will-change: transform, opacity;
    box-shadow: 0 8px 40px rgba(0,0,0,.55);
  }
  .mc-card.mc-active {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 12px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(201,168,76,.15);
  }

  /* ── HEADER DO CARD ── */
  .mc-header {
    background: linear-gradient(180deg, #071628 0%, #0a1f3a 100%);
    padding: 1.4rem 1.4rem 1.1rem;
    position: relative;
    border-bottom: 1px solid rgba(201,168,76,.18);
    /* flex-shrink: 0 garante que o header nunca encolhe */
    flex-shrink: 0;
  }
  .mc-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(201,168,76,.04) 1px, transparent 1px);
    background-size: 18px 18px;
    pointer-events: none;
  }
  .mc-header::after {
    content: '';
    position: absolute;
    top: 8px; left: 8px; right: 8px; bottom: 0;
    border-top: 1px solid rgba(201,168,76,.12);
    border-left: 1px solid rgba(201,168,76,.08);
    border-right: 1px solid rgba(201,168,76,.08);
    border-radius: 8px 8px 0 0;
    pointer-events: none;
  }
  .mc-logbook {
    font-family: 'Josefin Sans', sans-serif;
    font-size: .46rem;
    letter-spacing: .44em;
    text-transform: uppercase;
    color: rgba(201,168,76,.4);
    margin: 0 0 .7rem;
    position: relative;
    z-index: 1;
  }
  .mc-icon-row {
    display: flex;
    align-items: center;
    gap: .8rem;
    position: relative;
    z-index: 1;
  }
  .mc-icon-wrap {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mc-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-style: italic;
    font-weight: 400;
    color: #c9a84c;
    line-height: 1.2;
    margin: 0;
  }
  .mc-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: .8rem;
    font-style: italic;
    color: rgba(255,255,255,.32);
    margin: .55rem 0 0;
    line-height: 1.45;
    position: relative;
    z-index: 1;
  }
  .mc-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,.5), transparent);
    margin: .9rem 0 0;
    position: relative;
    z-index: 1;
  }

  /* ── CORPO DO CARD ── */
  .mc-body {
    background: #f4e8ca;
    padding: 1rem 1.1rem 1rem;
    /* flex: 1 preenche o espaco restante apos o header; overflow-y permite scroll nos itens */
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    /* scrollbar fina e discreta no tom da marca */
    scrollbar-width: thin;
    scrollbar-color: rgba(180,130,40,.35) transparent;
  }
  .mc-body::-webkit-scrollbar { width: 3px; }
  .mc-body::-webkit-scrollbar-thumb {
    background: rgba(180,130,40,.35);
    border-radius: 2px;
  }
  .mc-note {
    font-family: 'Josefin Sans', sans-serif;
    font-size: .44rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(110,72,14,.42);
    text-align: center;
    border-top: 1px solid rgba(130,85,18,.1);
    border-bottom: 1px solid rgba(130,85,18,.1);
    padding: .38rem 0;
    margin: 0 0 .85rem;
  }
  .mc-item {
    padding: .55rem 0;
    border-bottom: 1px solid rgba(130,85,18,.08);
  }
  .mc-item:last-child { border-bottom: none; }
  .mc-item-hl {
    background: linear-gradient(90deg, rgba(201,168,76,.07), transparent);
    margin: 0 -.2rem;
    padding: .55rem .2rem;
    border-radius: 3px;
  }
  .mc-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
    width: 100%;
  }
  .mc-name {
    font-family: 'Playfair Display', serif;
    font-size: .88rem;
    font-weight: 700;
    color: #18100a;
    flex-shrink: 0;
    line-height: 1.3;
  }
  .mc-tag {
    font-family: 'Josefin Sans', sans-serif;
    font-size: .42rem;
    letter-spacing: .04em;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 10px;
    flex-shrink: 0;
  }
  .mc-tv { background: #d4edda; color: #1d5e2a; }
  .mc-tl { background: #d1ecf1; color: #0c5460; }
  .mc-td { background: rgba(201,168,76,.18); color: #7a4500; border: 1px solid rgba(201,168,76,.32); }
  .mc-dots {
    flex: 1;
    border-bottom: 1.5px dotted rgba(110,72,14,.2);
    margin: 0 5px;
    position: relative;
    top: -3px;
    min-width: 8px;
  }
  .mc-price {
    font-family: 'Josefin Sans', sans-serif;
    font-size: .82rem;
    font-weight: 600;
    color: #7a4500;
    flex-shrink: 0;
    letter-spacing: .01em;
  }
  .mc-desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: .92rem;
    font-style: italic;
    color: rgba(52,32,6,.52);
    margin: .1rem 0 0;
    line-height: 1.4;
  }

  /* ── RODAPÉ DO CARD ── */
  .mc-footer {
    background: #f4e8ca;
    padding: .65rem 1.1rem .9rem;
    border-top: 1px solid rgba(130,85,18,.1);
    text-align: center;
    /* flex-shrink: 0 garante que o rodape nunca encolhe, sempre visivel */
    flex-shrink: 0;
  }
  .mc-footer-text {
    font-family: 'Josefin Sans', sans-serif;
    font-size: .42rem;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: rgba(100,65,10,.35);
  }

  /* ── PIPS DE PROGRESSO ── */
  .mc-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 1.4rem;
    padding: 0 1rem;
  }
  .mc-pip-btn {
    padding: 8px 0;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .mc-pip {
    height: 3px;
    border-radius: 2px;
    background: rgba(201,168,76,.22);
    transition: all 0.3s ease;
  }
  .mc-pip.mc-pip-active {
    background: #c9a84c;
    width: 24px !important;
  }

  /* ── LABEL DA SEÇÃO ATIVA ── */
  .mc-section-label {
    text-align: center;
    margin-top: .7rem;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: .9rem;
    color: rgba(201,168,76,.6);
    letter-spacing: .04em;
  }
}
`

/* ─────────────────────────────────────────────────────────────────────────────
   TIPOS internos do PageFlip
───────────────────────────────────────────────────────────────────────────── */
type PF = {
  loadFromHTML: (p: HTMLDivElement[]) => void
  on: (e: string, cb: (e: { data: number }) => void) => void
  destroy?: () => void
  turnToPage: (p: number) => void
  flipPrev: (corner?: string) => void
  flipNext: (corner?: string) => void
  getPageCount: () => number
  getCurrentPageIndex: () => number
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTE MOBILE — card de seção
───────────────────────────────────────────────────────────────────────────── */
function MobileCard({ section, index, isActive, total }: { section: Section; index: number; isActive: boolean; total: number }) {
  const iconSvg = getMenuSectionIcon(index, '#c9a84c', 36)
  const hasNote = section.subtitle.includes('acompanham')

  return (
    <div className={`mc-card${isActive ? ' mc-active' : ''}`}>
      <div className="mc-header">
        <p className="mc-logbook">
          Logbook N.º {String(index + 1).padStart(2, '0')} · {String(total).padStart(2, '0')}
        </p>
        <div className="mc-icon-row">
          <div className="mc-icon-wrap" dangerouslySetInnerHTML={{ __html: iconSvg }} />
          <h2 className="mc-title">{section.title}</h2>
        </div>
        <p className="mc-subtitle">{section.subtitle}</p>
        <div className="mc-divider" />
      </div>

      <div className="mc-body">
        {hasNote && (
          <div className="mc-note">
            Os pratos acompanham arroz branco e pirão de peixe
          </div>
        )}
        {section.items.map((item, j) => {
          const tagClass = item.tag === 'vegano' ? 'mc-tv'
            : item.tag === 'sem-lactose' ? 'mc-tl'
            : item.tag === 'destaque' ? 'mc-td'
            : ''
          const tagLabel = item.tag === 'vegano' ? 'Vegano'
            : item.tag === 'sem-lactose' ? 'Sem lactose'
            : item.tag === 'destaque' ? 'Chef indica'
            : ''
          return (
            <div key={j} className={`mc-item${item.tag === 'destaque' ? ' mc-item-hl' : ''}`}>
              <div className="mc-row">
                <span className="mc-name">{item.name}</span>
                {tagClass && <span className={`mc-tag ${tagClass}`}>{tagLabel}</span>}
                <span className="mc-dots" />
                <span className="mc-price">R$&nbsp;{item.price}</span>
              </div>
              {item.desc && <div className="mc-desc">{item.desc}</div>}
            </div>
          )
        })}
      </div>

      <div className="mc-footer">
        <p className="mc-footer-text">
          Os pratos servem 2 pessoas · Taxa de serviço 10% · Couvert artístico
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTE MOBILE — carrossel completo
───────────────────────────────────────────────────────────────────────────── */
function MobileCarousel({ cur, onChangeCur, sections }: { cur: number; onChangeCur: (i: number) => void; sections: Section[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const total = sections.length

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[index] as HTMLElement
    if (!card) return
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let rafId: number
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect()
        const centerX = trackRect.left + trackRect.width / 2
        let closest = 0
        let closestDist = Infinity
        Array.from(track.children).forEach((child, i) => {
          const rect = (child as HTMLElement).getBoundingClientRect()
          const cardCenter = rect.left + rect.width / 2
          const dist = Math.abs(cardCenter - centerX)
          if (dist < closestDist) { closestDist = dist; closest = i }
        })
        if (closest !== cur) onChangeCur(closest)
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [cur, onChangeCur])

  useEffect(() => {
    scrollTo(cur)
  }, [cur, scrollTo])

  return (
    <div className="mc-wrap">
      <div className="mc-track" ref={trackRef}>
        {sections.map((s, i) => (
          <MobileCard key={s.id} section={s} index={i} isActive={i === cur} total={total} />
        ))}
      </div>
      <div className="mc-progress">
        {sections.map((_, i) => (
          <button
            key={i}
            className="mc-pip-btn"
            onClick={() => { onChangeCur(i); scrollTo(i) }}
            aria-label={`Ir para ${sections[i].title}`}
          >
            <span
              className={`mc-pip${i === cur ? ' mc-pip-active' : ''}`}
              style={{ width: i === cur ? 24 : 6 }}
            />
          </button>
        ))}
      </div>
      <p className="mc-section-label">
        {sections[cur]?.title} · {cur + 1}/{total}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   PÁGINA PRINCIPAL
───────────────────────────────────────────────────────────────────────────── */
export default function CardapioPage() {
  const bookRef    = useRef<HTMLDivElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const flipRef    = useRef<PF | null>(null)
  const [cur, setCur]     = useState(0)
  const [ready, setReady] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  // Banner da pagina — carregado do banco
  type BannersData = { cardapio?: string; sobre?: string; blog?: string }
  const bannersData = useSiteContent<BannersData>('page_banners', {})
  const cardapioBanner = bannersData?.cardapio || ''

  // Carrega do banco — inicia com null para saber quando os dados reais chegaram
  const menuData = useSiteContent<{ sections: Section[] } | null>('menu_full', null)
  // Enquanto nao carregou do banco, usa SECTIONS hardcoded SEM iniciar o PageFlip
  const sections: Section[] = menuData?.sections?.length ? menuData.sections : SECTIONS
  const total = sections.length
  // So inicia o PageFlip quando os dados definitivos estiverem prontos
  const dataReady = menuData !== null

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return
    // Aguarda os dados do banco chegarem antes de inicializar o PageFlip
    if (!dataReady) return
    let pf: PF | null = null
    let cancelled = false
    async function init() {
      if (!bookRef.current) return
      // Limpa paginas antigas antes de reinicializar
      bookRef.current.innerHTML = ''
      try {
        const { PageFlip } = await import('page-flip')
        const el = bookRef.current
        pf = new PageFlip(el, {
          width: 430, height: 610,
          size: 'stretch',
          minWidth: 260, maxWidth: 460,
          minHeight: 380, maxHeight: 700,
          maxShadowOpacity: 0.7,
          showCover: false,
          mobileScrollSupport: false,
          flippingTime: 650,
          usePortrait: true,
          autoSize: true,
          clickEventForward: false,
          swipeDistance: 30,
          useMouseEvents: true,
        }) as unknown as PF

        const pages: HTMLDivElement[] = []
        sections.forEach((s, i) => {
          const cover = document.createElement('div')
          cover.className = 'page page-cover'
          cover.innerHTML = coverHTML(s, i, total)
          pages.push(cover)
          const content = document.createElement('div')
          content.className = 'page'
          content.innerHTML = contentHTML(s)
          pages.push(content)
        })
        pf.loadFromHTML(pages)
        pf.on('flip', (e) => { setCur(Math.floor(e.data / 2)); setShowHint(false) })
        if (cancelled) { try { pf.destroy?.() } catch {}; return }
        flipRef.current = pf
        setReady(true)
      } catch (err) { console.error('PageFlip:', err) }
    }
    init()
    return () => { cancelled = true; try { flipRef.current?.destroy?.() } catch {} }
  }, [isMobile, dataReady, sections, total])

  function goTo(i: number) {
    setCur(i)
    if (!isMobile) flipRef.current?.turnToPage(i * 2)
  }
  function prev() { if (!isMobile) flipRef.current?.flipPrev() }
  function next() { if (!isMobile) flipRef.current?.flipNext() }

  return (
    <div className="pf-wrap pt-[72px]">
      <style>{CSS}</style>

      <header className="pf-hero">
        {/* Imagem de fundo dinamica — definida no painel admin */}
        {cardapioBanner && (
          <>
            <div className="pf-hero-bg" style={{backgroundImage:`url(${cardapioBanner})`}} />
            <div className="pf-hero-bg-overlay" />
          </>
        )}
        <div className="pf-hero-inner" style={{position:'relative',zIndex:2}}>
          <p className="pf-hero-eyebrow">Porto Cabral BC · Gastronomia Flutuante</p>
          <h1 className="pf-hero-title">Cardápio</h1>
          <div className="pf-hero-rule">
            <span className="pf-hero-rule-line" />
            <span className="pf-hero-rule-glyph">✦ ⚓ ✦</span>
            <span className="pf-hero-rule-line" />
          </div>
          <p className="pf-hero-sub">Relatos de Mar e Sal — Balneário Camboriú</p>
          <div className="pf-hero-scroll">
            <div className="pf-hero-scroll-line" />
            <div className="pf-hero-scroll-dot" />
          </div>
        </div>
      </header>

      <nav className="pf-tabs" aria-label="Seções do cardápio">
        <div className="pf-ti">
          {sections.map((s, i) => (
            <button key={s.id} className={`pf-tab${i === cur ? ' on' : ''}`} onClick={() => goTo(i)}>
              {s.title}
            </button>
          ))}
        </div>
      </nav>

      {/* MOBILE: carrossel nativo */}
      <div className="pf-mobile-carousel">
        <MobileCarousel cur={cur} onChangeCur={setCur} sections={sections} />
      </div>

      {/* DESKTOP: page-flip */}
      <div className="pf-deck">
        {!ready && (
          <div style={{ color:'rgba(201,168,76,.55)', fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:'1.1rem', padding:'5rem', textAlign:'center' }}>
            Abrindo o logbook...
          </div>
        )}
        <div ref={wrapRef} className="pf-book-wrap" style={{ opacity: ready ? 1 : 0, transition: 'opacity .5s' }}>
          <div ref={bookRef} />
          {showHint && (
            <div className="pf-hint">
              <span className="pf-hint-icon">👆</span>
              <span className="pf-hint-text">Arraste para virar</span>
            </div>
          )}
        </div>
        <div className="pf-nav">
          <button className="pf-btn" onClick={prev} disabled={cur === 0} aria-label="Anterior">‹</button>
          <div className="pf-nav-center">
            <p className="pf-folio">{sections[cur]?.title} · Folio {cur + 1} de {total}</p>
            <div className="pf-dots">
              {sections.map((_, i) => (
                <button key={i} className={`pf-dot${i === cur ? ' on' : ''}`} onClick={() => goTo(i)} aria-label={`Ir para ${sections[i].title}`}>
                  <span className="pf-dot-inner" />
                </button>
              ))}
            </div>
          </div>
          <button className="pf-btn" onClick={next} disabled={cur === total - 1} aria-label="Próximo">›</button>
        </div>
      </div>
    </div>
  )
}
