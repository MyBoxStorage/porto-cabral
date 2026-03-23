// Tipos compartilhados das seções da home page

export type DishItem = {
  title_pt: string; title_en: string; title_es: string
  desc_pt:  string; desc_en:  string; desc_es:  string
  image_url?: string
}

export type DishesData = {
  section_title_pt: string; section_title_en: string; section_title_es: string
  items: DishItem[]
}

export type HistoryData = {
  title_pt: string; title_en: string; title_es: string
  p1_pt:    string; p1_en:    string; p1_es:    string
  p2_pt:    string; p2_en:    string; p2_es:    string
  quote_pt: string; quote_en: string; quote_es: string
  quote_author_pt: string; quote_author_en: string; quote_author_es: string
  image_url?: string
}

export type LocationData = {
  title_pt:  string; title_en:  string; title_es:  string
  eyebrow_pt:string; eyebrow_en:string; eyebrow_es:string
  desc_pt:   string; desc_en:   string; desc_es:   string
  maps_url:  string
}

// Fallbacks usados quando o banco não retorna dados
export const DISHES_FB: DishesData = {
  section_title_pt: 'Iguarias do Mar',
  section_title_en: 'Treasures of the Sea',
  section_title_es: 'Delicias del Mar',
  items: [
    { title_pt:'Capitão Cabral',      title_en:'Capitão Cabral',       title_es:'Capitão Cabral',      desc_pt:'Polvo à moda da casa, arroz cremoso de limão siciliano e batata sauté.',        desc_en:'Octopus in our signature style, creamy lemon risotto and sautéed potatoes.',   desc_es:'Pulpo al estilo de la casa, arroz cremoso de limón y papas salteadas.',    image_url:'' },
    { title_pt:'Paella do Porto',     title_en:'Porto Paella',         title_es:'Paella del Porto',    desc_pt:'Prato típico com arroz, marisco, lula, polvo e camarão.',                        desc_en:'Traditional dish with rice, seafood, squid, octopus and shrimp.',           desc_es:'Plato típico con arroz, marisco, calamar, pulpo y camarones.',             image_url:'' },
    { title_pt:'King Crab',           title_en:'King Crab',            title_es:'King Crab',           desc_pt:'King crab inteiro com molhos especiais. Chef indica.',                           desc_en:'Whole king crab with special sauces. Chef recommends.',                     desc_es:'King crab entero con salsas especiales. El chef recomienda.',              image_url:'' },
    { title_pt:'Tábua de Frios',      title_en:'Charcuterie Board',    title_es:'Tabla de Embutidos',  desc_pt:'Parma, presunto, salaminho, queijos, frutas, pães e geleia de pimenta.',         desc_en:'Prosciutto, ham, salami, cheeses, fruits, breads and pepper jelly.',        desc_es:'Jamón, embutidos, quesos, frutas, panes y mermelada de pimienta.',         image_url:'' },
    { title_pt:'Tartare de Atum e Salmão', title_en:'Tuna & Salmon Tartare', title_es:'Tartare de Atún y Salmón', desc_pt:'Base de abacate, cream cheese, crispy de alho-poró e chips de batata doce.', desc_en:'Avocado base, cream cheese, crispy leek and sweet potato chips.', desc_es:'Base de aguacate, queso crema, crujiente de puerro y chips de batata.', image_url:'' },
    { title_pt:'Camarão à Romana',    title_en:'Roman-style Shrimp',   title_es:'Camarones a la Romana', desc_pt:'Empanados com queijo parmesão. Uma entrada clássica do Porto.',              desc_en:'Breaded with parmesan cheese. A classic Porto starter.',                   desc_es:'Empanados con queso parmesano. Una entrada clásica del Porto.',            image_url:'' },
  ],
}

export const HISTORY_FB: HistoryData = {
  title_pt: 'Nossa História:\nO Legado dos Mares',
  title_en: 'Our Story:\nThe Legacy of the Seas',
  title_es: 'Nuestra Historia:\nEl Legado de los Mares',
  p1_pt: 'Fundado por Edson Cabral, o Porto Cabral BC nasceu de uma paixão visceral pelo mar e pela hospitalidade.',
  p1_en: 'Founded by Edson Cabral, Porto Cabral BC was born from a visceral passion for the sea.',
  p1_es: 'Fundado por Edson Cabral, Porto Cabral BC nació de una pasión visceral por el mar.',
  p2_pt: 'Cada detalhe foi pensado para proporcionar uma imersão total no luxo náutico.',
  p2_en: 'Every detail was designed to provide a total immersion in nautical luxury.',
  p2_es: 'Cada detalle fue pensado para proporcionar una inmersión total en el lujo náutico.',
  quote_pt: 'O Porto Cabral não é apenas um restaurante, é o meu convite pessoal.',
  quote_en: 'Porto Cabral is not just a restaurant, it is my personal invitation.',
  quote_es: 'Porto Cabral no es solo un restaurante, es mi invitación personal.',
  quote_author_pt: '— Edson Cabral, Fundador',
  quote_author_en: '— Edson Cabral, Founder',
  quote_author_es: '— Edson Cabral, Fundador',
}

export const LOCATION_FB: LocationData = {
  title_pt:   'Localização\nPrivilegiada',
  title_en:   'Prime\nLocation',
  title_es:   'Ubicación\nPrivilegiada',
  eyebrow_pt: 'Como nos encontrar',
  eyebrow_en: 'How to find us',
  eyebrow_es: 'Cómo encontrarnos',
  desc_pt:    'No Molhe da Barra Sul — o ponto mais exclusivo de Balneário Camboriú.',
  desc_en:    'At the Molhe da Barra Sul — the most exclusive point.',
  desc_es:    'En el Molhe da Barra Sul — el punto más exclusivo.',
  maps_url:   'https://maps.google.com/?q=-26.9982,-48.6358',
}
