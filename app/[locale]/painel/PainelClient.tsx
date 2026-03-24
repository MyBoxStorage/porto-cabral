'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

/* ══ TYPES ══════════════════════════════════════════════════════ */
type Reservation = {
  id: string; name: string; email: string; whatsapp: string
  reservation_date: string; reservation_time: string; party_size: number
  occasion_type: string | null; observations: string | null; allergies: string | null
  status: string; optin_accepted: boolean; bc_connect_sent: boolean
  confirmation_email_sent: boolean; created_at: string
}
type Customer = {
  id: string; name: string; email: string; whatsapp: string | null
  city_of_origin: string | null; optin_accepted: boolean; created_at: string
}
type Stats = {
  total_reservations: number; today_reservations: number
  pending_reservations: number; confirmed_reservations: number
  total_customers: number; optin_customers: number
  by_status: { status: string; total: number }[]
  recent_reservations: Reservation[]
}
type DishItem   = { title_pt:string; title_en:string; title_es:string; desc_pt:string; desc_en:string; desc_es:string; image_url?:string }

/* ══ DESIGN TOKENS ═══════════════════════════════════════════════ */
const NAVY   = '#002451'
const NAVY2  = '#0d2040'
const GOLD   = '#D4A843'
const GOLD2  = '#FECE65'
const CREAM  = '#fef9f1'

const STATUS_CFG: Record<string,{label:string;dot:string;bg:string;text:string}> = {
  pending:   {label:'Pendente',  dot:'#f59e0b',bg:'#fffbeb',text:'#92400e'},
  confirmed: {label:'Confirmada',dot:'#10b981',bg:'#ecfdf5',text:'#065f46'},
  cancelled: {label:'Cancelada', dot:'#ef4444',bg:'#fef2f2',text:'#991b1b'},
  no_show:   {label:'No-show',   dot:'#6b7280',bg:'#f9fafb',text:'#374151'},
  completed: {label:'Concluída', dot:'#3b82f6',bg:'#eff6ff',text:'#1e40af'},
}

const TABS = [
  {id:'dashboard',label:'Dashboard'},
  {id:'reservas', icon:'◷',label:'Reservas'},
  {id:'clientes', icon:'◉',label:'Clientes'},
  {id:'conteudo', icon:'◎',label:'Conteúdo'},
  {id:'videos',   icon:'▶',label:'Vídeos'},
  {id:'cardapio', icon:'◆',label:'Cardápio'},
  {id:'site',     icon:'◈',label:'Configurações'},
]

/* ══ GLOBAL CSS ══════════════════════════════════════════════════ */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Josefin+Sans:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${CREAM};font-family:'Inter',sans-serif}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:${NAVY2}}
  ::-webkit-scrollbar-thumb{background:${GOLD};border-radius:2px}
  input,textarea,select{font-family:'Inter',sans-serif}
  @keyframes shimmer{to{background-position:200% center}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  .pc-shimmer{
    background:linear-gradient(90deg,${GOLD} 0%,${GOLD2} 50%,${GOLD} 100%);
    background-size:200% auto;animation:shimmer 2.5s linear infinite;
  }
  .pc-row:hover{background:rgba(212,168,67,0.04)!important}
  .pc-tab-btn:hover{background:rgba(212,168,67,0.07)!important;color:${GOLD}!important}
  .pc-input:focus{border-color:${GOLD}!important;box-shadow:0 0 0 3px rgba(212,168,67,.12)!important}
  .pc-card{animation:fadeIn .3s ease}
  .pc-dot{width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0}
`

/* ══ SORTABLE LIST ══════════════════════════════════════════════════ */
function SortableList<T>({ items, onReorder, renderItem }: {
  items: T[]
  onReorder: (newItems: T[]) => void
  renderItem: (item: T, index: number, handle: React.ReactNode) => React.ReactNode
}) {
  const dragIdx  = useRef<number | null>(null)
  const overIdx  = useRef<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [over,     setOver]     = useState<number | null>(null)

  function onDragStart(i: number) { dragIdx.current = i; setDragging(i) }
  function onDragEnter(i: number) { overIdx.current = i; setOver(i) }
  function onDragEnd() {
    const from = dragIdx.current
    const to   = overIdx.current
    if (from !== null && to !== null && from !== to) {
      const next = [...items]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      onReorder(next)
    }
    dragIdx.current = null; overIdx.current = null
    setDragging(null); setOver(null)
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {items.map((item, i) => {
        const isDragging = dragging === i
        const isOver     = over === i && dragging !== null && dragging !== i
        const handle = (
          <div
            draggable
            onDragStart={e => { e.stopPropagation(); onDragStart(i) }}
            onDragEnd={e => { e.stopPropagation(); onDragEnd() }}
            style={{
              cursor:'grab', padding:'4px 8px', color:'rgba(212,168,67,0.5)',
              fontSize:16, lineHeight:1, flexShrink:0, userSelect:'none',
              transition:'color .15s',
            }}
            title="Arrastar para reordenar"
          >⠿</div>
        )
        return (
          <div
            key={i}
            onDragOver={e => { e.preventDefault(); onDragEnter(i) }}
            style={{
              opacity: isDragging ? 0.4 : 1,
              outline: isOver ? `2px dashed ${GOLD}` : 'none',
              borderRadius: 10,
              transition: 'opacity .2s, outline .15s',
            }}
          >
            {renderItem(item, i, handle)}
          </div>
        )
      })}
    </div>
  )
}

/* ══ SHARED STYLES ════════════════════════════════════════════════ */
const inp: React.CSSProperties = {
  width:'100%',padding:'10px 14px',borderRadius:8,
  border:`1px solid rgba(212,168,67,0.25)`,
  background:'rgba(255,255,255,0.7)',color:NAVY,fontSize:13,
  outline:'none',transition:'border .2s,box-shadow .2s',
}
const labelSt: React.CSSProperties = {
  display:'block',fontFamily:"'Josefin Sans',sans-serif",
  fontSize:10,fontWeight:700,letterSpacing:'.15em',
  textTransform:'uppercase',color:'#8a7040',marginBottom:6,
}
const goldBtn: React.CSSProperties = {
  padding:'9px 20px',borderRadius:8,border:'none',cursor:'pointer',
  fontFamily:"'Josefin Sans',sans-serif",fontWeight:700,fontSize:11,
  letterSpacing:'.12em',textTransform:'uppercase',
  background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})`,
  backgroundSize:'200% auto',color:NAVY,transition:'all .2s',
  display:'inline-flex',alignItems:'center',gap:7,textDecoration:'none',
}
const ghostBtn: React.CSSProperties = {
  padding:'9px 20px',borderRadius:8,cursor:'pointer',
  fontFamily:"'Josefin Sans',sans-serif",fontWeight:600,fontSize:11,
  letterSpacing:'.12em',textTransform:'uppercase',
  background:'transparent',color:NAVY,
  border:`1px solid rgba(0,36,81,0.25)`,
  display:'inline-flex',alignItems:'center',gap:7,textDecoration:'none',
}

/* ══ SMALL COMPONENTS ════════════════════════════════════════════ */
function GoldRule() {
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,margin:'6px 0'}}>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`}}/>
      <span style={{color:GOLD,fontSize:10}}>✦</span>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${GOLD},transparent)`}}/>
    </div>
  )
}

function Badge({status}:{status:string}) {
  const s = STATUS_CFG[status] ?? {label:status,dot:'#6b7280',bg:'#f9fafb',text:'#374151'}
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:5,background:s.bg,color:s.text,
      padding:'4px 12px',borderRadius:99,fontSize:10,fontWeight:700,
      fontFamily:"'Josefin Sans',sans-serif",letterSpacing:'.06em',textTransform:'uppercase',whiteSpace:'nowrap'}}>
      <span className="pc-dot" style={{background:s.dot}}/>
      {s.label}
    </span>
  )
}

function StatCard({label,value,sub,color}:{label:string;value:number|string;sub?:string;color?:string}) {
  return (
    <div className="pc-card" style={{
      background:`linear-gradient(135deg,${NAVY} 0%,${NAVY2} 100%)`,
      borderRadius:16,padding:'1.5rem',position:'relative',overflow:'hidden',
      border:`1px solid rgba(212,168,67,0.15)`,
    }}>
      <div style={{position:'absolute',inset:0,opacity:.04,
        backgroundImage:`radial-gradient(${GOLD} 1px,transparent 1px)`,backgroundSize:'18px 18px',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,left:0,width:3,bottom:0,background:`linear-gradient(180deg,transparent,${color??GOLD},transparent)`,borderRadius:'16px 0 0 16px'}}/>
      <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.18em',
        textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 .5rem',position:'relative'}}>
        {label}
      </p>
      <p style={{fontFamily:"'Playfair Display',serif",fontSize:38,fontWeight:600,color:GOLD,
        margin:0,lineHeight:1,position:'relative'}}>
        {value}
      </p>
      {sub&&<p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:10,color:'rgba(255,255,255,.35)',
        margin:'.4rem 0 0',letterSpacing:'.05em',position:'relative'}}>{sub}</p>}
    </div>
  )
}

function SectionTitle({children}:{children:React.ReactNode}) {
  return (
    <div style={{marginBottom:'1.5rem'}}>
      <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.22em',
        textTransform:'uppercase',color:`rgba(212,168,67,0.7)`,marginBottom:6}}>Porto Cabral BC</p>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:400,
        fontStyle:'italic',color:NAVY,lineHeight:1.2}}>{children}</h2>
      <GoldRule/>
    </div>
  )
}

function SectionHeader({title,onSave,saving,dirty}:{title:string;onSave:()=>void;saving:boolean;dirty:boolean}) {
  return (
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1.5rem',gap:16}}>
      <div>
        <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.2em',
          textTransform:'uppercase',color:`rgba(212,168,67,0.7)`,margin:'0 0 4px'}}>Editor</p>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontStyle:'italic',color:NAVY,margin:0}}>{title}</h3>
      </div>
      <button onClick={onSave} disabled={saving||!dirty} className={dirty&&!saving?'pc-shimmer':''}
        style={{...goldBtn,opacity:(saving||!dirty)?0.45:1,animation:dirty&&!saving?'shimmer 2.5s linear infinite':'none',
          background:dirty&&!saving?undefined:NAVY,color:dirty&&!saving?NAVY:'rgba(212,168,67,0.4)',
          backgroundSize:'200% auto'}}>
        {saving?'Salvando…':'✦ Salvar'}
      </button>
    </div>
  )
}

function LangTabs({lang,setLang}:{lang:string;setLang:(l:string)=>void}) {
  return (
    <div style={{display:'flex',gap:6,marginBottom:'1.25rem',padding:'4px',
      background:'rgba(0,36,81,0.06)',borderRadius:10,width:'fit-content'}}>
      {[['pt','🇧🇷 Português'],['en','🇺🇸 English'],['es','🇪🇸 Español']].map(([l,label])=>(
        <button key={l} onClick={()=>setLang(l)} style={{
          padding:'6px 16px',borderRadius:7,border:'none',fontSize:11,fontWeight:700,cursor:'pointer',
          fontFamily:"'Josefin Sans',sans-serif",letterSpacing:'.06em',transition:'all .15s',
          background:lang===l?NAVY:'transparent',color:lang===l?GOLD:'#6b7280',
          boxShadow:lang===l?'0 2px 8px rgba(0,36,81,0.2)':'none',
        }}>
          {label}
        </button>
      ))}
    </div>
  )
}

function Toast({msg,type,onClose}:{msg:string;type:'ok'|'err';onClose:()=>void}) {
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t)},[onClose])
  return (
    <div style={{position:'fixed',bottom:28,right:28,zIndex:9999,
      background:type==='ok'?`linear-gradient(135deg,${NAVY},${NAVY2})`:'linear-gradient(135deg,#7f1d1d,#991b1b)',
      color:type==='ok'?GOLD:'#fca5a5',padding:'14px 22px',borderRadius:12,
      border:`1px solid ${type==='ok'?'rgba(212,168,67,0.3)':'rgba(239,68,68,0.3)'}`,
      fontFamily:"'Josefin Sans',sans-serif",fontSize:12,fontWeight:700,letterSpacing:'.06em',
      boxShadow:'0 8px 32px rgba(0,0,0,0.3)',animation:'fadeIn .25s ease',
      display:'flex',alignItems:'center',gap:10}}>
      <span>{type==='ok'?'✦':'✕'}</span>
      <span>{msg}</span>
    </div>
  )
}

/* ══ HOOK: useContent ════════════════════════════════════════════ */
function useContent<T>(key:string) {
  const [data,setData]    = useState<T|null>(null)
  const [dirty,setDirty]  = useState(false)
  const [saving,setSaving]= useState(false)
  const [toast,setToast]  = useState<{msg:string;type:'ok'|'err'}|null>(null)
  useEffect(()=>{
    fetch(`/api/admin/content/${key}`)
      .then(r => r.ok ? r.json() : { value: null })
      .then(d => { setData(d.value ?? ({} as T)) })
      .catch(() => { setData({} as T) })
  },[key])
  function update(fn:(prev:T)=>T){setData(p=>{const n=fn(p as T);setDirty(true);return n})}
  async function save(){
    if(!data) return; setSaving(true)
    const r=await fetch(`/api/admin/content/${key}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:data})})
    setSaving(false)
    if(r.ok){ setToast({msg:'Conteúdo salvo com sucesso',type:'ok'}); setDirty(false) }
    else setToast({msg:'Erro ao salvar',type:'err'})
  }
  return {data,update,save,saving,dirty,toast,clearToast:()=>setToast(null)}
}

/* ══ TAB: DASHBOARD ══════════════════════════════════════════════ */
function TabDashboard({stats,loading}:{stats:Stats|null;loading:boolean}) {
  if(loading) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'6rem',gap:16}}>
      <div style={{width:40,height:40,border:`3px solid rgba(212,168,67,0.2)`,borderTopColor:GOLD,borderRadius:'50%',animation:'shimmer 1s linear infinite'}}/>
      <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.15em',color:'rgba(212,168,67,0.5)',textTransform:'uppercase'}}>Navegando nos dados…</p>
    </div>
  )
  if(!stats) return null
  return (
    <div>
      <SectionTitle>Visão Geral do Porto</SectionTitle>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(175px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
        <StatCard label="Total Reservas"  value={stats.total_reservations}  color={GOLD}/>
        <StatCard label="Hoje"            value={stats.today_reservations}   color="#10b981" sub="reservas para hoje"/>
        <StatCard label="Pendentes"       value={stats.pending_reservations}  color="#f59e0b" sub="aguardando confirmação"/>
        <StatCard label="Confirmadas"     value={stats.confirmed_reservations}color="#3b82f6"/>
        <StatCard label="Clientes"        value={stats.total_customers}       color="#8b5cf6"/>
        <StatCard label="Opt-in LGPD"     value={stats.optin_customers}       color="#ec4899" sub="marketing aceito"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
        <div style={{background:`linear-gradient(135deg,${NAVY} 0%,${NAVY2} 100%)`,borderRadius:16,padding:'1.5rem',
          border:'1px solid rgba(212,168,67,0.15)',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,opacity:.03,backgroundImage:`radial-gradient(${GOLD} 1px,transparent 1px)`,backgroundSize:'18px 18px',pointerEvents:'none'}}/>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 .5rem'}}>Por Status</p>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontStyle:'italic',color:GOLD,margin:'0 0 1rem'}}>Reservas</h3>
          {(stats.by_status??[]).map(s=>(
            <div key={s.status} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.55rem 0',borderBottom:'1px solid rgba(212,168,67,0.08)'}}>
              <Badge status={s.status}/>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:GOLD,fontWeight:600}}>{Number(s.total)}</span>
            </div>
          ))}
        </div>
        <div style={{background:`linear-gradient(135deg,${NAVY} 0%,${NAVY2} 100%)`,borderRadius:16,padding:'1.5rem',
          border:'1px solid rgba(212,168,67,0.15)',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,opacity:.03,backgroundImage:`radial-gradient(${GOLD} 1px,transparent 1px)`,backgroundSize:'18px 18px',pointerEvents:'none'}}/>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 .5rem'}}>Últimas</p>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontStyle:'italic',color:GOLD,margin:'0 0 1rem'}}>Reservas Recentes</h3>
          {(stats.recent_reservations??[]).map(r=>(
            <div key={r.id} style={{padding:'.55rem 0',borderBottom:'1px solid rgba(212,168,67,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
              <div style={{minWidth:0}}>
                <p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:14,color:GOLD,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</p>
                <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:10,color:'rgba(255,255,255,.35)',letterSpacing:'.05em',margin:'.2rem 0 0'}}>{r.reservation_date} · {r.reservation_time} · {r.party_size} pax</p>
              </div>
              <Badge status={r.status}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══ TAB: RESERVAS ══════════════════════════════════════════════ */
function TabReservas() {
  const [rows,setRows]         = useState<Reservation[]>([])
  const [loading,setLoading]   = useState(true)
  const [search,setSearch]     = useState('')
  const [status,setStatus]     = useState('all')
  const [date,setDate]         = useState('')
  const [selected,setSelected] = useState<Reservation|null>(null)
  const [saving,setSaving]     = useState(false)

  const load = useCallback(async()=>{
    setLoading(true)
    const p=new URLSearchParams()
    if(status!=='all') p.set('status',status)
    if(search) p.set('search',search)
    if(date)   p.set('date',date)
    const r=await fetch(`/api/admin/reservas?${p}`)
    const d=await r.json()
    setRows(d.reservations??[]); setLoading(false)
  },[search,status,date])

  useEffect(()=>{load()},[load])

  async function updateStatus(id:string,s:string){
    setSaving(true)
    await fetch(`/api/admin/reservas/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:s})})
    setSaving(false); setSelected(null); load()
  }

  const thSt: React.CSSProperties = {padding:'11px 16px',textAlign:'left',
    fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,
    letterSpacing:'.15em',textTransform:'uppercase',color:'rgba(212,168,67,0.7)',
    borderBottom:`1px solid rgba(212,168,67,0.12)`}

  return (
    <div>
      <SectionTitle>Gestão de Reservas</SectionTitle>
      <div style={{display:'flex',gap:10,marginBottom:'1.5rem',flexWrap:'wrap',alignItems:'center'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar por nome…"
          className="pc-input" style={{...inp,maxWidth:220}}/>
        <select value={status} onChange={e=>setStatus(e.target.value)}
          className="pc-input" style={{...inp,maxWidth:180}}>
          <option value="all">Todos os status</option>
          {Object.entries(STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          className="pc-input" style={{...inp,maxWidth:165}}/>
        <button onClick={()=>{setSearch('');setStatus('all');setDate('')}}
          style={{...ghostBtn,padding:'9px 16px'}}>Limpar</button>
        <span style={{marginLeft:'auto',fontFamily:"'Josefin Sans',sans-serif",fontSize:10,fontWeight:700,
          letterSpacing:'.1em',color:GOLD,padding:'7px 16px',background:'rgba(212,168,67,0.08)',
          borderRadius:99,border:'1px solid rgba(212,168,67,0.2)'}}>
          {rows.length} {rows.length===1?'reserva':'reservas'}
        </span>
      </div>

      {loading?(
        <div style={{textAlign:'center',padding:'4rem',color:'rgba(212,168,67,0.4)',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.15em'}}>Navegando…</div>
      ):(
        <div style={{background:`linear-gradient(135deg,${NAVY} 0%,${NAVY2} 100%)`,borderRadius:16,overflow:'hidden',border:'1px solid rgba(212,168,67,0.12)'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Hóspede','Data','Hora','Pax','Status','Contato',''].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id} className="pc-row" style={{borderBottom:'1px solid rgba(212,168,67,0.06)',cursor:'pointer',transition:'background .15s'}} onClick={()=>setSelected(r)}>
                  <td style={{padding:'12px 16px',fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:14,color:GOLD}}>{r.name}</td>
                  <td style={{padding:'12px 16px',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,color:'rgba(255,255,255,.7)',letterSpacing:'.04em'}}>{r.reservation_date}</td>
                  <td style={{padding:'12px 16px',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,color:'rgba(255,255,255,.7)',letterSpacing:'.04em'}}>{r.reservation_time}</td>
                  <td style={{padding:'12px 16px',textAlign:'center',fontFamily:"'Playfair Display',serif",fontSize:16,color:GOLD}}>{r.party_size}</td>
                  <td style={{padding:'12px 16px'}}><Badge status={r.status}/></td>
                  <td style={{padding:'12px 16px',fontSize:11,color:'rgba(255,255,255,.4)',fontFamily:"'Josefin Sans',sans-serif"}}>
                    <div style={{letterSpacing:'.02em'}}>{r.email}</div>
                    <div style={{letterSpacing:'.02em'}}>{r.whatsapp}</div>
                  </td>
                  <td style={{padding:'12px 16px'}}>
                    <a href={`https://wa.me/55${r.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener"
                       onClick={e=>e.stopPropagation()} style={{...goldBtn,padding:'6px 12px',fontSize:10}}>
                      WA
                    </a>
                  </td>
                </tr>
              ))}
              {rows.length===0&&<tr><td colSpan={7} style={{textAlign:'center',padding:'4rem',color:'rgba(212,168,67,0.35)',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.15em'}}>Nenhuma reserva encontrada</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {selected&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,10,30,0.85)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16,backdropFilter:'blur(4px)'}} onClick={()=>setSelected(null)}>
          <div style={{background:`linear-gradient(160deg,${NAVY} 0%,${NAVY2} 100%)`,borderRadius:20,padding:'2rem',
            width:'100%',maxWidth:560,boxShadow:'0 32px 80px rgba(0,0,0,0.6)',border:'1px solid rgba(212,168,67,0.2)',
            maxHeight:'90vh',overflowY:'auto',animation:'fadeIn .2s ease'}} onClick={e=>e.stopPropagation()}>
            <div style={{position:'absolute',inset:0,opacity:.03,backgroundImage:`radial-gradient(${GOLD} 1px,transparent 1px)`,backgroundSize:'18px 18px',pointerEvents:'none',borderRadius:20}}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem',position:'relative'}}>
              <div>
                <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(212,168,67,0.55)',letterSpacing:'.18em',textTransform:'uppercase',margin:'0 0 4px'}}>Reserva</p>
                <h2 style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:22,color:GOLD,margin:0}}>{selected.name}</h2>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:'rgba(212,168,67,0.1)',border:'1px solid rgba(212,168,67,0.2)',borderRadius:8,color:GOLD,width:36,height:36,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
            </div>
            <GoldRule/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',margin:'1.25rem 0',position:'relative'}}>
              {[['Data',selected.reservation_date],['Horário',selected.reservation_time],
                ['Pessoas',String(selected.party_size)],['Ocasião',selected.occasion_type??'—'],
                ['Email',selected.email],['WhatsApp',selected.whatsapp],
                ['Opt-in LGPD',selected.optin_accepted?'✅ Aceito':'❌ Não'],
                ['Email confirmação',selected.confirmation_email_sent?'✅ Enviado':'⏳ Pendente'],
              ].map(([k,v])=>(
                <div key={k as string}>
                  <p style={{...labelSt,color:'rgba(212,168,67,0.45)'}}>{k}</p>
                  <p style={{fontFamily:"'Josefin Sans',sans-serif",fontWeight:600,color:'rgba(255,255,255,.85)',fontSize:13,wordBreak:'break-all'}}>{v}</p>
                </div>
              ))}
            </div>
            {selected.observations&&<div style={{background:'rgba(212,168,67,0.06)',border:'1px solid rgba(212,168,67,0.15)',borderRadius:10,padding:'1rem',marginBottom:'1rem',fontSize:12,color:'rgba(255,255,255,.65)',fontFamily:"'Josefin Sans',sans-serif",letterSpacing:'.03em',position:'relative'}}><span style={{color:GOLD,fontWeight:700}}>Obs: </span>{selected.observations}</div>}
            {selected.allergies&&<div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'1rem',marginBottom:'1rem',fontSize:12,color:'#fca5a5',fontFamily:"'Josefin Sans',sans-serif",letterSpacing:'.03em',position:'relative'}}><span style={{fontWeight:700}}>⚠️ Alergias: </span>{selected.allergies}</div>}
            <GoldRule/>
            <p style={{...labelSt,color:'rgba(212,168,67,0.45)',marginTop:'1rem'}}>Alterar Status</p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1.25rem'}}>
              {Object.entries(STATUS_CFG).map(([k,v])=>(
                <button key={k} disabled={saving} onClick={()=>updateStatus(selected.id,k)}
                  style={{padding:'7px 15px',borderRadius:99,border:`1px solid ${selected.status===k?v.dot:'rgba(212,168,67,0.15)'}`,
                    background:selected.status===k?v.bg:'transparent',color:selected.status===k?v.text:GOLD,
                    fontFamily:"'Josefin Sans',sans-serif",fontWeight:700,fontSize:10,letterSpacing:'.06em',
                    cursor:'pointer',opacity:saving?.5:1,transition:'all .15s'}}>
                  {v.label}
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:10}}>
              <a href={`https://wa.me/55${selected.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener" style={{...goldBtn,textDecoration:'none'}}>📲 WhatsApp</a>
              <a href={`mailto:${selected.email}`} style={{...ghostBtn,color:GOLD,borderColor:'rgba(212,168,67,0.25)',textDecoration:'none'}}>✉️ Email</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ══ TAB: CLIENTES ══════════════════════════════════════════════ */
function TabClientes() {
  const [rows,setRows]       = useState<Customer[]>([])
  const [loading,setLoading] = useState(true)
  const [search,setSearch]   = useState('')

  useEffect(()=>{
    fetch('/api/admin/clientes').then(r=>r.json()).then(d=>{setRows(d.customers??[]);setLoading(false)})
  },[])

  const filtered = rows.filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase())||c.email.toLowerCase().includes(search.toLowerCase()))

  const thSt: React.CSSProperties = {padding:'11px 16px',textAlign:'left',
    fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,
    letterSpacing:'.15em',textTransform:'uppercase',color:'rgba(212,168,67,0.7)',
    borderBottom:'1px solid rgba(212,168,67,0.12)'}

  return (
    <div>
      <SectionTitle>Tripulantes Cadastrados</SectionTitle>
      <div style={{display:'flex',gap:12,marginBottom:'1.5rem',alignItems:'center'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Nome ou email…"
          className="pc-input" style={{...inp,maxWidth:300}}/>
        <span style={{marginLeft:'auto',fontFamily:"'Josefin Sans',sans-serif",fontSize:10,fontWeight:700,
          letterSpacing:'.1em',color:GOLD,padding:'7px 16px',background:'rgba(212,168,67,0.08)',
          borderRadius:99,border:'1px solid rgba(212,168,67,0.2)'}}>
          {filtered.length} {filtered.length===1?'cliente':'clientes'}
        </span>
      </div>
      {loading?(
        <div style={{textAlign:'center',padding:'4rem',color:'rgba(212,168,67,0.4)',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.15em'}}>Navegando…</div>
      ):(
        <div style={{background:`linear-gradient(135deg,${NAVY} 0%,${NAVY2} 100%)`,borderRadius:16,overflow:'hidden',border:'1px solid rgba(212,168,67,0.12)'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Nome','Email','WhatsApp','Cidade','Opt-in','Cadastro'].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id} className="pc-row" style={{borderBottom:'1px solid rgba(212,168,67,0.06)',transition:'background .15s'}}>
                  <td style={{padding:'12px 16px',fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:14,color:GOLD}}>{c.name}</td>
                  <td style={{padding:'12px 16px',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,color:'rgba(255,255,255,.65)',letterSpacing:'.02em'}}>{c.email}</td>
                  <td style={{padding:'12px 16px',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,color:'rgba(255,255,255,.55)'}}>{c.whatsapp??'—'}</td>
                  <td style={{padding:'12px 16px',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,color:'rgba(255,255,255,.45)'}}>{c.city_of_origin??'—'}</td>
                  <td style={{padding:'12px 16px',textAlign:'center',fontSize:14}}>{c.optin_accepted?'✅':'❌'}</td>
                  <td style={{padding:'12px 16px',fontFamily:"'Josefin Sans',sans-serif",fontSize:10,color:'rgba(212,168,67,0.45)',letterSpacing:'.05em'}}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={6} style={{textAlign:'center',padding:'4rem',color:'rgba(212,168,67,0.35)',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.15em'}}>Nenhum cliente encontrado</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ══ TAB: CONTEÚDO ══════════════════════════════════════════════ */
function TabConteudo() {
  const [section,setSection] = useState<'hero'|'dishes'|'history'|'videos'|'location'|'reserva'|'sobre'|'banners'>('hero')
  const sections: {id:typeof section;label:string;icon:string}[] = [
    {id:'hero',    label:'Hero Banner',      icon:'▶'},
    {id:'dishes',  label:'Pratos Destaque',  icon:'◆'},
    {id:'history', label:'Nossa História',   icon:'◎'},
    {id:'videos',  label:'Film Strip',       icon:'🎬'},
    {id:'location',label:'Localização',      icon:'◉'},
    {id:'reserva', label:'Fundo Reserva',    icon:'📷'},
    {id:'sobre',   label:'Página Sobre',     icon:'⚓'},
    {id:'banners', label:'Banners Páginas',  icon:'🖼️'},
  ]
  return (
    <div>
      <SectionTitle>Editor de Conteúdo</SectionTitle>
      <div style={{display:'flex',gap:'1.5rem'}}>
        <aside style={{width:180,flexShrink:0}}>
          <div style={{background:`linear-gradient(135deg,${NAVY},${NAVY2})`,borderRadius:14,overflow:'hidden',border:'1px solid rgba(212,168,67,0.15)'}}>
            {sections.map(s=>(
              <button key={s.id} onClick={()=>setSection(s.id)} className="pc-tab-btn" style={{
                display:'block',width:'100%',textAlign:'left',padding:'12px 16px',border:'none',cursor:'pointer',
                fontFamily:"'Josefin Sans',sans-serif",fontSize:11,fontWeight:section===s.id?700:400,letterSpacing:'.06em',
                background:section===s.id?'rgba(212,168,67,0.12)':'transparent',
                color:section===s.id?GOLD:'rgba(255,255,255,.55)',
                borderLeft:`3px solid ${section===s.id?GOLD:'transparent'}`,transition:'all .15s',
              }}>
                <span style={{marginRight:8,opacity:.7}}>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </aside>
        <div style={{flex:1,minWidth:0}}>
          {section==='hero'     && <EditHero/>}
          {section==='dishes'   && <EditDishes/>}
          {section==='history'  && <EditHistory/>}
          {section==='videos'   && <EditVideos/>}
          {section==='location' && <EditLocation/>}
          {section==='reserva'  && <EditReserva/>}
          {section==='sobre'    && <EditSobre/>}
          {section==='banners'  && <EditPageBanners/>}
        </div>
      </div>
    </div>
  )
}

/* Card base para editors */
function EdCard({children,toast,onClearToast}:{children:React.ReactNode;toast:{msg:string;type:'ok'|'err'}|null;onClearToast:()=>void}) {
  return (
    <div style={{background:`linear-gradient(135deg,${NAVY} 0%,${NAVY2} 100%)`,borderRadius:16,padding:'1.75rem',
      border:'1px solid rgba(212,168,67,0.15)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,opacity:.03,backgroundImage:`radial-gradient(${GOLD} 1px,transparent 1px)`,backgroundSize:'18px 18px',pointerEvents:'none'}}/>
      <div style={{position:'relative'}}>
        {children}
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={onClearToast}/>}
    </div>
  )
}

/* ─── Hero ─────────────────────────── */
function EditHero() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<Record<string,string>>('hero')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'rgba(212,168,67,0.4)',padding:'2rem',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.1em'}}>Carregando…</div>
  return (
    <EdCard toast={toast} onClearToast={clearToast}>
      <SectionHeader title="Hero Banner" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{display:'grid',gap:'1.25rem'}}>
        <div>
          <label style={labelSt}>Eyebrow — linha pequena acima do título</label>
          <input className="pc-input" style={inp} value={data[`eyebrow_${lang}`]??''} onChange={e=>update(p=>({...p,[`eyebrow_${lang}`]:e.target.value}))}/>
        </div>
        <div>
          <label style={labelSt}>Tagline principal (use \n para quebra de linha)</label>
          <textarea className="pc-input" rows={3} style={{...inp,resize:'vertical'}} value={data[`tagline_${lang}`]??''} onChange={e=>update(p=>({...p,[`tagline_${lang}`]:e.target.value}))}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div><label style={labelSt}>Botão principal — Reserva</label><input className="pc-input" style={inp} value={data[`cta_reserva_${lang}`]??''} onChange={e=>update(p=>({...p,[`cta_reserva_${lang}`]:e.target.value}))}/></div>
          <div><label style={labelSt}>Botão secundário — Cardápio</label><input className="pc-input" style={inp} value={data[`cta_cardapio_${lang}`]??''} onChange={e=>update(p=>({...p,[`cta_cardapio_${lang}`]:e.target.value}))}/></div>
        </div>
        <div style={{borderTop:'1px solid rgba(212,168,67,0.12)',paddingTop:'1.25rem',marginTop:'.25rem'}}>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 1rem'}}>Vídeos do Hero</p>
          <div style={{background:'rgba(212,168,67,0.05)',border:'1px solid rgba(212,168,67,0.12)',borderRadius:8,padding:'0.75rem 1rem',marginBottom:'1.25rem'}}>
            <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:'.05em',margin:0,lineHeight:1.7}}>
              🖥 <strong style={{color:GOLD}}>Desktop:</strong> 3 vídeos em formato portrait lado a lado · 📱 <strong style={{color:GOLD}}>Mobile:</strong> 1 vídeo otimizado
            </p>
          </div>
          <div style={{display:'grid',gap:'1rem'}}>
            <div><label style={labelSt}>🖥 Desktop — Vídeo 1 (URL Cloudinary .mp4)</label><input className="pc-input" style={{...inp,fontFamily:'monospace',fontSize:11}} value={data.video_desktop_1??''} placeholder="https://res.cloudinary.com/..." onChange={e=>update(p=>({...p,video_desktop_1:e.target.value}))}/></div>
            <div><label style={labelSt}>🖥 Desktop — Vídeo 2 (URL Cloudinary .mp4)</label><input className="pc-input" style={{...inp,fontFamily:'monospace',fontSize:11}} value={data.video_desktop_2??''} placeholder="https://res.cloudinary.com/..." onChange={e=>update(p=>({...p,video_desktop_2:e.target.value}))}/></div>
            <div><label style={labelSt}>🖥 Desktop — Vídeo 3 (URL Cloudinary .mp4)</label><input className="pc-input" style={{...inp,fontFamily:'monospace',fontSize:11}} value={data.video_desktop_3??''} placeholder="https://res.cloudinary.com/..." onChange={e=>update(p=>({...p,video_desktop_3:e.target.value}))}/></div>
            <div><label style={labelSt}>📱 Mobile — Vídeo 1 (URL Cloudinary .mp4)</label><input className="pc-input" style={{...inp,fontFamily:'monospace',fontSize:11}} value={data.video_mobile??''} placeholder="https://res.cloudinary.com/..." onChange={e=>update(p=>({...p,video_mobile:e.target.value}))}/></div>
            <div>
              <label style={labelSt}>📱 Mobile — Vídeo 2 (opcional — ativa split screen)</label>
              <input className="pc-input" style={{...inp,fontFamily:'monospace',fontSize:11}} value={data.video_mobile_2??''} placeholder="Deixe vazio para tela cheia · Preencha para split screen" onChange={e=>update(p=>({...p,video_mobile_2:e.target.value}))}/>
              <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(255,255,255,0.3)',letterSpacing:'.04em',marginTop:6,lineHeight:1.5}}>
                {data.video_mobile_2 ? '✔ Split screen ativo — 2 vídeos lado a lado no mobile' : 'Vazio = 1 vídeo em tela cheia no mobile'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </EdCard>
  )
}

/* ─── Image Uploader ──────────────── */
function ImageUploader({value,onChange,label}:{value:string;onChange:(url:string)=>void;label:string}) {
  const [uploading,setUploading] = useState(false)
  const [err,setErr] = useState('')
  const [preview,setPreview] = useState(value)

  async function handleFile(e:React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if(!file) return
    if(file.size > 2*1024*1024) { setErr('Imagem muito grande. Máx 2MB.'); return }
    setUploading(true); setErr('')
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUri = reader.result as string
      setPreview(dataUri)
      try {
        const res = await fetch('/api/admin/upload',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({data:dataUri, filename:file.name}),
        })
        const json = await res.json()
        if(!res.ok) throw new Error(json.error ?? 'Erro no upload')
        onChange(json.url)
      } catch(ex:unknown) {
        setErr(ex instanceof Error ? ex.message : 'Erro no upload')
        setPreview(value)
      } finally { setUploading(false) }
    }
    reader.readAsDataURL(file)
  }

  const displayUrl = preview || value

  return (
    <div>
      <label style={labelSt}>{label}</label>
      <div style={{display:'flex',gap:12,alignItems:'flex-start',flexWrap:'wrap'}}>
        <div style={{width:90,height:90,borderRadius:10,overflow:'hidden',flexShrink:0,
          border:`2px ${displayUrl?'solid rgba(212,168,67,0.4)':'dashed rgba(212,168,67,0.2)'}`,
          background:'rgba(0,0,0,0.2)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
          {displayUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displayUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              <button onClick={()=>{onChange('');setPreview('')}}
                style={{position:'absolute',top:3,right:3,background:'rgba(0,0,0,0.75)',
                  border:'none',color:'#fff',borderRadius:4,width:18,height:18,
                  cursor:'pointer',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
                ✕
              </button>
            </>
          ) : (
            <span style={{color:'rgba(212,168,67,0.25)',fontSize:28,lineHeight:1}}>+</span>
          )}
        </div>
        <div style={{flex:1,minWidth:160,display:'flex',flexDirection:'column',gap:6,justifyContent:'center'}}>
          <label style={{
            display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            padding:'10px 16px',borderRadius:8,cursor:uploading?'wait':'pointer',
            border:'1px solid rgba(212,168,67,0.3)',background:'rgba(212,168,67,0.08)',
            color:GOLD,fontFamily:"'Josefin Sans',sans-serif",fontSize:10,
            fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
            opacity:uploading?0.6:1,transition:'all .15s',
          }}>
            <span style={{fontSize:14}}>{uploading?'⏳':'↑'}</span>
            {uploading?'Salvando no banco…':'Fazer Upload da Foto'}
            <input type="file" accept="image/jpeg,image/png,image/webp" style={{display:'none'}}
              onChange={handleFile} disabled={uploading}/>
          </label>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(255,255,255,0.25)',
            letterSpacing:'.06em',margin:0}}>JPG, PNG ou WEBP · Máx 2MB · Salvo no banco</p>
          {value && !err && <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,
            color:'rgba(212,168,67,0.5)',margin:0,letterSpacing:'.04em',wordBreak:'break-all'}}>
            ✔ {value}
          </p>}
          {err && <p style={{color:'#fca5a5',fontSize:10,margin:0,fontFamily:"'Josefin Sans',sans-serif"}}>⚠️ {err}</p>}
        </div>
      </div>
    </div>
  )
}

/* ─── Dishes ───────────────────────── */
type DishesContent = {section_title_pt:string;section_title_en:string;section_title_es:string;items:DishItem[]}
function EditDishes() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<DishesContent>('dishes')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'rgba(212,168,67,0.4)',padding:'2rem',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.1em'}}>Carregando…</div>
  return (
    <EdCard toast={toast} onClearToast={clearToast}>
      <SectionHeader title="Pratos em Destaque" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{marginBottom:'1.5rem'}}>
        <label style={labelSt}>Título da Seção ({lang.toUpperCase()})</label>
        <input className="pc-input" style={inp} value={(data as Record<string,unknown>)[`section_title_${lang}`] as string??''} onChange={e=>update(p=>({...p,[`section_title_${lang}`]:e.target.value}))}/>
      </div>
      <SortableList
        items={data.items??[]}
        onReorder={newItems=>update(p=>({...p,items:newItems}))}
        renderItem={(item,i,handle)=>(
          <div style={{border:'1px solid rgba(212,168,67,0.12)',borderRadius:10,padding:'1rem',background:'rgba(255,255,255,0.03)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.75rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:4}}>
                {handle}
                <span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:14,color:GOLD}}>Prato {i+1} — {(item as Record<string,unknown>)[`title_pt`] as string}</span>
              </div>
              <button onClick={()=>update(p=>({...p,items:p.items.filter((_,j)=>j!==i)}))}
                style={{padding:'4px 12px',borderRadius:6,border:'1px solid rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.08)',color:'#fca5a5',fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:"'Josefin Sans',sans-serif",letterSpacing:'.06em'}}>
                ✕ Remover
              </button>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <ImageUploader
                label="Foto do Prato (aparece no card da home)"
                value={item.image_url??''}
                onChange={url=>update(p=>({...p,items:p.items.map((it,j)=>j===i?{...it,image_url:url}:it)}))}
              />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              <div><label style={labelSt}>Título ({lang.toUpperCase()})</label><input className="pc-input" style={inp} value={(item as Record<string,unknown>)[`title_${lang}`] as string??''} onChange={e=>update(p=>({...p,items:p.items.map((it,j)=>j===i?{...it,[`title_${lang}`]:e.target.value}:it)}))}/></div>
              <div><label style={labelSt}>Descrição ({lang.toUpperCase()})</label><input className="pc-input" style={inp} value={(item as Record<string,unknown>)[`desc_${lang}`] as string??''} onChange={e=>update(p=>({...p,items:p.items.map((it,j)=>j===i?{...it,[`desc_${lang}`]:e.target.value}:it)}))}/></div>
            </div>
          </div>
        )}
      />
      <button onClick={()=>update(p=>({...p,items:[...p.items,{title_pt:'',title_en:'',title_es:'',desc_pt:'',desc_en:'',desc_es:''}]}))}
        style={{...ghostBtn,width:'100%',justifyContent:'center',marginTop:8,color:GOLD,borderColor:'rgba(212,168,67,0.2)'}}>
        ✦ Adicionar Prato
      </button>
    </EdCard>
  )
}

/* ─── History ──────────────────────── */
function EditHistory() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<Record<string,string>>('history')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'rgba(212,168,67,0.4)',padding:'2rem',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.1em'}}>Carregando…</div>
  const F=(key:string,label:string,rows=1)=>(
    <div key={key}>
      <label style={labelSt}>{label}</label>
      {rows>1?<textarea className="pc-input" rows={rows} style={{...inp,resize:'vertical'}} value={data[`${key}_${lang}`]??''} onChange={e=>update(p=>({...p,[`${key}_${lang}`]:e.target.value}))}/>
             :<input className="pc-input" style={inp} value={data[`${key}_${lang}`]??''} onChange={e=>update(p=>({...p,[`${key}_${lang}`]:e.target.value}))}/> }
    </div>
  )
  return (
    <EdCard toast={toast} onClearToast={clearToast}>
      <SectionHeader title="Nossa História" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{display:'grid',gap:'1.25rem'}}>
        <ImageUploader
          label="Foto da Seção Nossa História (lado esquerdo)"
          value={data.image_url??''}
          onChange={url=>update(p=>({...p,image_url:url}))}
        />
        {F('title','Título (\\n = quebra de linha)',2)}
        {F('p1','Parágrafo 1',3)}
        {F('p2','Parágrafo 2',3)}
        {F('quote','Citação do Fundador (sem aspas)',3)}
        {F('quote_author','Assinatura da Citação')}
      </div>
    </EdCard>
  )
}

/* ─── Videos (Film Strip) ─────────── */
type VideoItem = { url:string; label_pt?:string }
type VideosContent = { eyebrow_pt:string; eyebrow_en:string; eyebrow_es:string; title_pt:string; title_en:string; title_es:string; items:VideoItem[] }
function EditVideos() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<VideosContent>('videos')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'rgba(212,168,67,0.4)',padding:'2rem',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.1em'}}>Carregando…</div>
  const items = data.items ?? []
  return (
    <EdCard toast={toast} onClearToast={clearToast}>
      <SectionHeader title="Film Strip — Vídeos" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.5rem'}}>
        <div><label style={labelSt}>Eyebrow ({lang.toUpperCase()})</label><input className="pc-input" style={inp} value={(data as unknown as Record<string,string>)[`eyebrow_${lang}`]??''} onChange={e=>update(p=>({...p,[`eyebrow_${lang}`]:e.target.value}))}/></div>
        <div><label style={labelSt}>Título ({lang.toUpperCase()})</label><input className="pc-input" style={inp} value={(data as unknown as Record<string,string>)[`title_${lang}`]??''} onChange={e=>update(p=>({...p,[`title_${lang}`]:e.target.value}))}/></div>
      </div>
      <div style={{background:'rgba(212,168,67,0.06)',border:'1px solid rgba(212,168,67,0.15)',borderRadius:10,padding:'1rem',marginBottom:'1.5rem',display:'flex',gap:12,alignItems:'flex-start'}}>
        <span style={{fontSize:18,flexShrink:0}}>🎬</span>
        <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:10,color:'rgba(255,255,255,0.5)',letterSpacing:'.05em',lineHeight:1.7,margin:0}}>
          Cole o link direto do vídeo no Cloudinary (ex: <strong style={{color:GOLD}}>https://res.cloudinary.com/.../video.mp4</strong>). Cada vídeo adicionado aparece automaticamente no carrossel da home.
        </p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:'1rem'}}>
        {items.map((item,i)=>(
          <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(212,168,67,0.1)',borderRadius:10,padding:'1rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.75rem'}}>
              <span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:13,color:GOLD}}>Vídeo {i+1}</span>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                {i>0&&<button onClick={()=>{const a=[...items];[a[i-1],a[i]]=[a[i],a[i-1]];update(p=>({...p,items:a}))}}
                  style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(212,168,67,0.2)',background:'transparent',color:GOLD,fontSize:11,cursor:'pointer'}}>↑</button>}
                {i<items.length-1&&<button onClick={()=>{const a=[...items];[a[i],a[i+1]]=[a[i+1],a[i]];update(p=>({...p,items:a}))}}
                  style={{padding:'3px 8px',borderRadius:5,border:'1px solid rgba(212,168,67,0.2)',background:'transparent',color:GOLD,fontSize:11,cursor:'pointer'}}>↓</button>}
                <button onClick={()=>update(p=>({...p,items:p.items.filter((_,j)=>j!==i)}))}
                  style={{padding:'4px 10px',borderRadius:6,border:'1px solid rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.08)',color:'#fca5a5',fontSize:10,cursor:'pointer'}}>✕</button>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'0.75rem'}}>
              <div>
                <label style={labelSt}>URL do Vídeo (Cloudinary .mp4)</label>
                <input className="pc-input" style={{...inp,fontFamily:'monospace',fontSize:11}}
                  value={item.url??''} placeholder="https://res.cloudinary.com/..."
                  onChange={e=>update(p=>({...p,items:p.items.map((it,j)=>j===i?{...it,url:e.target.value}:it)}))}/>
              </div>
              <div>
                <label style={labelSt}>Label (opcional)</label>
                <input className="pc-input" style={inp} value={item.label_pt??''} placeholder="ex: Ambiente, Pratos..."
                  onChange={e=>update(p=>({...p,items:p.items.map((it,j)=>j===i?{...it,label_pt:e.target.value}:it)}))}/>
              </div>
            </div>
            {item.url&&(
              <div style={{marginTop:'.75rem',display:'flex',alignItems:'center',gap:10}}>
                <video src={item.url} muted playsInline preload="metadata"
                  style={{width:72,height:72,objectFit:'cover',borderRadius:8,border:'1px solid rgba(212,168,67,0.2)',flexShrink:0}}/>
                <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(212,168,67,0.45)',letterSpacing:'.06em',margin:0,wordBreak:'break-all'}}>✔ URL configurada</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={()=>update(p=>({...p,items:[...(p.items??[]),{url:'',label_pt:''}]}))}
        style={{...ghostBtn,width:'100%',justifyContent:'center',color:GOLD,borderColor:'rgba(212,168,67,0.25)',fontSize:11}}>
        + Adicionar Vídeo
      </button>
    </EdCard>
  )
}

/* ─── Location ─────────────────────── */
function EditLocation() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<Record<string,string>>('location')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'rgba(212,168,67,0.4)',padding:'2rem',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.1em'}}>Carregando…</div>
  return (
    <EdCard toast={toast} onClearToast={clearToast}>
      <SectionHeader title="Localização" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{display:'grid',gap:'1.25rem'}}>
        <div><label style={labelSt}>Eyebrow</label><input className="pc-input" style={inp} value={data[`eyebrow_${lang}`]??''} onChange={e=>update(p=>({...p,[`eyebrow_${lang}`]:e.target.value}))}/></div>
        <div><label style={labelSt}>Título (\\n = quebra)</label><textarea className="pc-input" rows={2} style={{...inp,resize:'vertical'}} value={data[`title_${lang}`]??''} onChange={e=>update(p=>({...p,[`title_${lang}`]:e.target.value}))}/></div>
        <div><label style={labelSt}>Descrição</label><textarea className="pc-input" rows={3} style={{...inp,resize:'vertical'}} value={data[`desc_${lang}`]??''} onChange={e=>update(p=>({...p,[`desc_${lang}`]:e.target.value}))}/></div>
        <div>
          <label style={labelSt}>URL Google Maps</label>
          <input className="pc-input" style={inp} value={data.maps_url??''} onChange={e=>update(p=>({...p,maps_url:e.target.value}))}/>
          {data.maps_url&&<a href={data.maps_url} target="_blank" rel="noopener" style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:10,color:GOLD,letterSpacing:'.08em',marginTop:6,display:'inline-block'}}>✦ Testar link →</a>}
        </div>
      </div>
    </EdCard>
  )
}

/* ─── Fundo Seção Reserva ────────────── */
function EditReserva() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<Record<string,string>>('reserva')
  if(!data) return <div style={{color:'rgba(212,168,67,0.4)',padding:'2rem',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.1em'}}>Carregando…</div>
  return (
    <EdCard toast={toast} onClearToast={clearToast}>
      <SectionHeader title="Fundo — Seção Reserva" onSave={save} saving={saving} dirty={dirty}/>
      {/* Descrição */}
      <div style={{background:'rgba(212,168,67,0.05)',border:'1px solid rgba(212,168,67,0.12)',borderRadius:10,padding:'1rem',marginBottom:'1.5rem',display:'flex',gap:12,alignItems:'flex-start'}}>
        <span style={{fontSize:20,flexShrink:0}}>📷</span>
        <div>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:10,color:'rgba(255,255,255,0.6)',letterSpacing:'.05em',lineHeight:1.7,margin:'0 0 4px'}}>
            Esta foto cobre <strong style={{color:GOLD}}>toda a seção &ldquo;Garanta seu Lugar&rdquo;</strong> da home page como background.
          </p>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(255,255,255,0.35)',letterSpacing:'.04em',lineHeight:1.6,margin:0}}>
            Recomendado: foto em formato portrait (vertical) · Alta resolução · JPG ou WEBP · Máx 2MB
          </p>
        </div>
      </div>
      {/* Preview grande da foto atual */}
      {data.bg_image_url && (
        <div style={{marginBottom:'1.5rem',borderRadius:12,overflow:'hidden',position:'relative',height:200}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.bg_image_url} alt="Fundo reserva" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 60%,rgba(0,0,0,0.6) 100%)'}}/>
          <div style={{position:'absolute',bottom:12,left:12,right:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(255,255,255,0.7)',letterSpacing:'.08em',margin:0}}>✔ Foto configurada — aparece na seção Reservas da home</p>
            <button onClick={()=>update(p=>({...p,bg_image_url:''}))}
              style={{background:'rgba(0,0,0,0.7)',border:'1px solid rgba(255,255,255,0.2)',color:'#fff',borderRadius:6,padding:'5px 12px',cursor:'pointer',fontSize:10,fontFamily:"'Josefin Sans',sans-serif",whiteSpace:'nowrap'}}>
              ✕ Remover
            </button>
          </div>
        </div>
      )}
      {/* Uploader */}
      <ImageUploader
        label="Foto de fundo da Seção Reserva (portrait recomendado)"
        value={data.bg_image_url??''}
        onChange={url=>update(p=>({...p,bg_image_url:url}))}
      />
    </EdCard>
  )
}

/* ─── Sobre ──────────────────────── */
type SobreContent = {
  hero_eyebrow:string; hero_title:string; section_title:string
  p1:string; p2:string; p3:string
  quote:string; quote_author:string; image_url:string
  feat_1_title:string; feat_1_desc:string
  feat_2_title:string; feat_2_desc:string
  feat_3_title:string; feat_3_desc:string
}
function EditSobre() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<SobreContent>('sobre')
  if(!data) return <div style={{color:'rgba(212,168,67,0.4)',padding:'2rem',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.1em'}}>Carregando…</div>
  const F=(key:keyof SobreContent,label:string,rows=1)=>(
    <div key={key}>
      <label style={labelSt}>{label}</label>
      {rows>1
        ?<textarea className="pc-input" rows={rows} style={{...inp,resize:'vertical'}} value={data[key]??''} onChange={e=>update(p=>({...p,[key]:e.target.value}))}/>
        :<input className="pc-input" style={inp} value={data[key]??''} onChange={e=>update(p=>({...p,[key]:e.target.value}))}/>}
    </div>
  )
  return (
    <EdCard toast={toast} onClearToast={clearToast}>
      <SectionHeader title="Página Sobre" onSave={save} saving={saving} dirty={dirty}/>
      <div style={{display:'grid',gap:'1.25rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          {F('hero_eyebrow','Eyebrow do Hero (ex: Since 1998)')}
          {F('hero_title','Título do Hero')}
        </div>
        {F('section_title','Título da Seção Principal')}
        {F('p1','Parágrafo 1',3)}
        {F('p2','Parágrafo 2',3)}
        {F('p3','Parágrafo 3',3)}
        {F('quote','Citação do Fundador',3)}
        {F('quote_author','Autor da Citação (ex: — Edson Cabral, Fundador)')}
        <ImageUploader
          label="Foto Principal da Página Sobre"
          value={data.image_url??''}
          onChange={url=>update(p=>({...p,image_url:url}))}
        />
        <div style={{borderTop:'1px solid rgba(212,168,67,0.12)',paddingTop:'1.25rem'}}>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 1rem'}}>Cards de Destaque</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            {F('feat_1_title','Card 1 — Título')}
            {F('feat_1_desc','Card 1 — Descrição')}
            {F('feat_2_title','Card 2 — Título')}
            {F('feat_2_desc','Card 2 — Descrição')}
            {F('feat_3_title','Card 3 — Título')}
            {F('feat_3_desc','Card 3 — Descrição')}
          </div>
        </div>
      </div>
    </EdCard>
  )
}

/* ─── Banners das Páginas ────────────── */
type PageBannersContent = { cardapio:string; sobre:string; blog:string; cliente_video:string }
function EditPageBanners() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<PageBannersContent>('page_banners')
  if(!data) return <div style={{color:'rgba(212,168,67,0.4)',padding:'2rem',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.1em'}}>Carregando…</div>
  return (
    <EdCard toast={toast} onClearToast={clearToast}>
      <SectionHeader title="Banners das Páginas" onSave={save} saving={saving} dirty={dirty}/>
      <div style={{background:'rgba(212,168,67,0.05)',border:'1px solid rgba(212,168,67,0.12)',borderRadius:8,padding:'0.75rem 1rem',marginBottom:'1.5rem'}}>
        <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(255,255,255,0.45)',letterSpacing:'.05em',margin:0,lineHeight:1.7}}>
          Banners das páginas: fotos para headers e vídeo de fundo da Área do Cliente.
        </p>
      </div>
      <div style={{display:'grid',gap:'2rem'}}>
        <div>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 .5rem'}}>🎬 Área do Cliente — Vídeo de Fundo</p>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(255,255,255,0.35)',letterSpacing:'.04em',margin:'0 0 1rem',lineHeight:1.6}}>
            URL Cloudinary .mp4 que roda em autoplay e loop no fundo da Cabine do Comandante.
          </p>
          <div>
            <label style={labelSt}>URL do Vídeo (.mp4 Cloudinary)</label>
            <input className="pc-input" style={{...inp,fontFamily:'monospace',fontSize:11}}
              value={data.cliente_video??''}
              placeholder="https://res.cloudinary.com/.../video.mp4"
              onChange={e=>update(p=>({...p,cliente_video:e.target.value}))}/>
          </div>
          {data.cliente_video&&(
            <div style={{marginTop:'0.75rem',display:'flex',alignItems:'center',gap:10}}>
              <video src={data.cliente_video} muted playsInline preload="metadata"
                style={{width:120,height:72,objectFit:'cover',borderRadius:8,border:'1px solid rgba(212,168,67,0.2)',flexShrink:0}}/>
              <div>
                <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(212,168,67,0.6)',letterSpacing:'.06em',margin:0}}>✔ Vídeo configurado</p>
                <button onClick={()=>update(p=>({...p,cliente_video:''}))} style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'#fca5a5',background:'none',border:'none',cursor:'pointer',padding:0,marginTop:4,letterSpacing:'.06em'}}>✕ Remover</button>
              </div>
            </div>
          )}
        </div>
        <div>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 1rem'}}>Página Cardápio</p>
          {data.cardapio&&(
            <div style={{marginBottom:'1rem',borderRadius:10,overflow:'hidden',position:'relative',height:140}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.cardapio} alt="Banner cardápio" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(0,0,0,0.5),transparent)'}} />
              <button onClick={()=>update(p=>({...p,cardapio:''}))} style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.7)',border:'none',color:'#fff',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:10,fontFamily:"'Josefin Sans',sans-serif"}}>✕ Remover</button>
            </div>
          )}
          <ImageUploader label="Foto de fundo do banner Cardápio" value={data.cardapio??''} onChange={url=>update(p=>({...p,cardapio:url}))}/>
        </div>
        <div style={{borderTop:'1px solid rgba(212,168,67,0.1)',paddingTop:'1.5rem'}}>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 1rem'}}>Página Sobre</p>
          {data.sobre&&(
            <div style={{marginBottom:'1rem',borderRadius:10,overflow:'hidden',position:'relative',height:140}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.sobre} alt="Banner sobre" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(0,0,0,0.5),transparent)'}} />
              <button onClick={()=>update(p=>({...p,sobre:''}))} style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.7)',border:'none',color:'#fff',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:10,fontFamily:"'Josefin Sans',sans-serif"}}>✕ Remover</button>
            </div>
          )}
          <ImageUploader label="Foto de fundo do banner Sobre" value={data.sobre??''} onChange={url=>update(p=>({...p,sobre:url}))}/>
        </div>
        <div style={{borderTop:'1px solid rgba(212,168,67,0.1)',paddingTop:'1.5rem'}}>
          <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(212,168,67,0.55)',margin:'0 0 1rem'}}>Página Blog</p>
          {data.blog&&(
            <div style={{marginBottom:'1rem',borderRadius:10,overflow:'hidden',position:'relative',height:140}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.blog} alt="Banner blog" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(0,0,0,0.5),transparent)'}} />
              <button onClick={()=>update(p=>({...p,blog:''}))} style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.7)',border:'none',color:'#fff',borderRadius:6,padding:'4px 10px',cursor:'pointer',fontSize:10,fontFamily:"'Josefin Sans',sans-serif"}}>✕ Remover</button>
            </div>
          )}
          <ImageUploader label="Foto de fundo do banner Blog" value={data.blog??''} onChange={url=>update(p=>({...p,blog:url}))}/>
        </div>
      </div>
    </EdCard>
  )
}

/* ══ TAB: CARDÁPIO ══════════════════════════════════════════════ */
type MenuItem = {name:string;price:string;desc?:string;tag?:string}
type MenuSection = {id:string;title:string;subtitle:string;items:MenuItem[]}
type MenuData = {sections: MenuSection[]}

function TabCardapio() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<MenuData>('menu_full')
  const [openSection,setOpenSection] = useState<string|null>(null)

  if(!data) return (
    <div style={{textAlign:'center',padding:'4rem',color:'rgba(212,168,67,0.4)',
      fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.15em'}}>
      Carregando cardápio…
    </div>
  )

  const sec = data.sections ?? []

  return (
    <div>
      <SectionTitle>Cardápio — Logbook do Capitão</SectionTitle>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={clearToast}/>}

      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'1.5rem'}}>
        <button onClick={save} disabled={saving||!dirty} className={dirty&&!saving?'pc-shimmer':''}
          style={{...goldBtn,opacity:(saving||!dirty)?0.4:1,
            background:dirty&&!saving?undefined:NAVY,color:dirty&&!saving?NAVY:'rgba(212,168,67,0.4)',
            backgroundSize:'200% auto',animation:dirty&&!saving?'shimmer 2.5s linear infinite':'none'}}>
          {saving?'Salvando…':'✦ Salvar Cardápio'}
        </button>
      </div>

      <SortableList
        items={sec}
        onReorder={newSecs=>update(p=>({...p,sections:newSecs}))}
        renderItem={(section,si,secHandle)=>(
          <div style={{background:`linear-gradient(135deg,${NAVY},${NAVY2})`,
            borderRadius:14,border:`1px solid ${openSection===section.id?'rgba(212,168,67,0.35)':'rgba(212,168,67,0.1)'}`,
            overflow:'hidden',transition:'border .2s'}}>
            <div style={{display:'flex',alignItems:'center'}}>
              <div style={{paddingLeft:'0.75rem'}}>{secHandle}</div>
              <button onClick={()=>setOpenSection(openSection===section.id?null:section.id)}
                style={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'1rem 1.25rem',background:'transparent',border:'none',cursor:'pointer'}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:16,color:GOLD}}>{section.title}</span>
                  <span style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:9,color:'rgba(255,255,255,.3)',
                    letterSpacing:'.12em',textTransform:'uppercase',background:'rgba(212,168,67,0.06)',
                    padding:'3px 10px',borderRadius:99,border:'1px solid rgba(212,168,67,0.1)'}}>
                    {section.items?.length??0} itens
                  </span>
                </div>
                <span style={{color:GOLD,fontSize:12,fontFamily:"'Josefin Sans',sans-serif",letterSpacing:'.08em'}}>
                  {openSection===section.id?'▲ Fechar':'▼ Expandir'}
                </span>
              </button>
            </div>

            {openSection===section.id&&(
              <div style={{padding:'0 1.25rem 1.25rem',borderTop:'1px solid rgba(212,168,67,0.08)'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',margin:'1rem 0 1.25rem'}}>
                  <div>
                    <label style={labelSt}>Título da Seção</label>
                    <input className="pc-input" style={inp} value={section.title}
                      onChange={e=>update(p=>({...p,sections:p.sections.map((s,i)=>i===si?{...s,title:e.target.value}:s)}))}/>
                  </div>
                  <div>
                    <label style={labelSt}>Subtítulo</label>
                    <input className="pc-input" style={inp} value={section.subtitle??''}
                      onChange={e=>update(p=>({...p,sections:p.sections.map((s,i)=>i===si?{...s,subtitle:e.target.value}:s)}))}/>
                  </div>
                </div>

                <p style={{...labelSt,marginBottom:'0.75rem'}}>Itens do Cardápio</p>
                <SortableList
                  items={section.items??[]}
                  onReorder={newItems=>update(p=>({...p,sections:p.sections.map((s,i)=>i===si?{...s,items:newItems}:s)}))}
                  renderItem={(item,ii,handle)=>(
                    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:10,
                      padding:'1rem',border:'1px solid rgba(212,168,67,0.08)'}}>
                      <div style={{display:'grid',gridTemplateColumns:'auto 2fr 1fr 2fr auto',gap:'0.75rem',alignItems:'start'}}>
                        <div style={{paddingTop:18}}>{handle}</div>
                        <div>
                          <label style={{...labelSt,fontSize:9}}>Nome</label>
                          <input className="pc-input" style={{...inp,fontSize:12}} value={item.name}
                            onChange={e=>update(p=>({...p,sections:p.sections.map((s,si2)=>si2===si?{...s,items:s.items.map((it,j)=>j===ii?{...it,name:e.target.value}:it)}:s)}))}/>
                        </div>
                        <div>
                          <label style={{...labelSt,fontSize:9}}>Preço (R$)</label>
                          <input className="pc-input" style={{...inp,fontSize:12}} value={item.price}
                            onChange={e=>update(p=>({...p,sections:p.sections.map((s,si2)=>si2===si?{...s,items:s.items.map((it,j)=>j===ii?{...it,price:e.target.value}:it)}:s)}))}/>
                        </div>
                        <div>
                          <label style={{...labelSt,fontSize:9}}>Descrição</label>
                          <input className="pc-input" style={{...inp,fontSize:12}} value={item.desc??''}
                            onChange={e=>update(p=>({...p,sections:p.sections.map((s,si2)=>si2===si?{...s,items:s.items.map((it,j)=>j===ii?{...it,desc:e.target.value}:it)}:s)}))}/>
                        </div>
                        <div style={{paddingTop:18}}>
                          <button onClick={()=>update(p=>({...p,sections:p.sections.map((s,si2)=>si2===si?{...s,items:s.items.filter((_,j)=>j!==ii)}:s)}))}
                            style={{padding:'6px 10px',borderRadius:6,border:'1px solid rgba(239,68,68,0.3)',
                              background:'rgba(239,68,68,0.08)',color:'#fca5a5',fontSize:11,cursor:'pointer'}}>✕</button>
                        </div>
                      </div>
                    </div>
                  )}
                />
                <button onClick={()=>update(p=>({...p,sections:p.sections.map((s,i)=>i===si?{...s,items:[...(s.items??[]),{name:'',price:'',desc:''}]}:s)}))}
                  style={{...ghostBtn,width:'100%',justifyContent:'center',marginTop:10,
                    color:GOLD,borderColor:'rgba(212,168,67,0.2)',fontSize:11}}>
                  + Adicionar Item
                </button>
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}

/* ══ TAB: CONFIGURAÇÕES ══════════════════════════════════════════ */
type SiteInfoContent = {phone:string;whatsapp:string;address:string;hours_lunch:string;hours_dinner:string;instagram:string;instagram_url:string;facebook_url:string;maps_url:string;email_contact:string;founded_year:string}
function TabSite() {
  const {data,update,save,saving,dirty,toast,clearToast} = useContent<SiteInfoContent>('site_info')
  if(!data) return <div style={{color:'rgba(212,168,67,0.4)',padding:'2rem',fontFamily:"'Josefin Sans',sans-serif",fontSize:11,letterSpacing:'.1em'}}>Carregando…</div>
  const F=(key:keyof SiteInfoContent,label:string,ph='')=>(
    <div key={key}>
      <label style={labelSt}>{label}</label>
      <input className="pc-input" style={inp} value={data[key]??''} placeholder={ph} onChange={e=>update(p=>({...p,[key]:e.target.value}))}/>
    </div>
  )
  return (
    <div>
      <SectionTitle>Configurações do Porto</SectionTitle>
      <div style={{background:`linear-gradient(135deg,${NAVY},${NAVY2})`,borderRadius:16,padding:'1.75rem',
        border:'1px solid rgba(212,168,67,0.15)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:.03,backgroundImage:`radial-gradient(${GOLD} 1px,transparent 1px)`,backgroundSize:'18px 18px',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <SectionHeader title="Informações do Restaurante" onSave={save} saving={saving} dirty={dirty}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
            {F('phone','Telefone','(47) 9 9999-9999')}
            {F('whatsapp','WhatsApp (apenas números)','4799999999')}
            {F('address','Endereço Completo')}
            {F('email_contact','Email de Contato')}
            {F('hours_lunch','Horário Almoço','12h–16h')}
            {F('hours_dinner','Horário Jantar','18h–23h')}
            {F('instagram','Instagram @handle','@portocabralbc')}
            {F('instagram_url','Instagram URL')}
            {F('facebook_url','Facebook URL')}
            {F('maps_url','Google Maps URL')}
            {F('founded_year','Ano de Fundação','1998')}
          </div>
          <div style={{marginTop:'1.5rem',padding:'1rem 1.25rem',background:'rgba(212,168,67,0.06)',border:'1px solid rgba(212,168,67,0.12)',borderRadius:10}}>
            <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:10,color:'rgba(212,168,67,0.7)',letterSpacing:'.08em',margin:0}}>
              ✦ Após salvar, as configurações são aplicadas no próximo carregamento da página em todo o site.
            </p>
          </div>
        </div>
        {toast&&<Toast msg={toast.msg} type={toast.type} onClose={clearToast}/>}
      </div>
    </div>
  )
}

/* ══ PÁGINA PRINCIPAL ════════════════════════════════════════════ */
export function PainelClient() {
  const [tab,setTab]         = useState('dashboard')
  const [stats,setStats]     = useState<Stats|null>(null)
  const [statsLoading,setSL] = useState(true)

  useEffect(()=>{
    fetch('/api/admin/stats').then(r=>r.json()).then(d=>{setStats(d);setSL(false)})
  },[])

  return (
    <div style={{minHeight:'100vh',background:CREAM,fontFamily:"'Inter',sans-serif"}}>
      <style>{G}</style>

      <header style={{
        background:`linear-gradient(90deg,${NAVY} 0%,${NAVY2} 100%)`,
        borderBottom:'1px solid rgba(212,168,67,0.15)',
        padding:'0 2rem',height:64,position:'sticky',top:0,zIndex:50,
        display:'flex',alignItems:'center',justifyContent:'space-between',
        boxShadow:'0 4px 24px rgba(0,10,30,0.4)',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:38,height:38,borderRadius:10,background:'rgba(212,168,67,0.12)',border:'1px solid rgba(212,168,67,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>⚓</div>
          <div>
            <p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:18,color:GOLD,lineHeight:1,margin:0}}>Porto Cabral</p>
            <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:8,letterSpacing:'.25em',textTransform:'uppercase',color:'rgba(212,168,67,0.45)',margin:0}}>Painel Administrativo</p>
          </div>
        </div>
        <div style={{display:'flex',gap:20,alignItems:'center'}}>
          {stats&&(
            <>
              <div style={{display:'flex',alignItems:'center',gap:7,fontFamily:"'Josefin Sans',sans-serif",fontSize:11,color:'rgba(255,255,255,.55)'}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:'#f59e0b',display:'inline-block',animation:'pulse 2s infinite'}}/>
                <b style={{color:'#fbbf24'}}>{stats.pending_reservations}</b> pendentes
              </div>
              <div style={{display:'flex',alignItems:'center',gap:7,fontFamily:"'Josefin Sans',sans-serif",fontSize:11,color:'rgba(255,255,255,.55)'}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:'#10b981',display:'inline-block'}}/>
                <b style={{color:'#34d399'}}>{stats.today_reservations}</b> hoje
              </div>
            </>
          )}
          <div style={{width:1,height:28,background:'rgba(212,168,67,0.15)'}}/>
          <a href="/pt" target="_blank" style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(212,168,67,0.5)',textDecoration:'none',display:'flex',alignItems:'center',gap:6,transition:'color .2s'}}>
            ← Ir ao site
          </a>
        </div>
      </header>

      <div style={{display:'flex',minHeight:'calc(100vh - 64px)'}}>
        <aside style={{
          width:220,background:`linear-gradient(180deg,${NAVY} 0%,${NAVY2} 100%)`,
          borderRight:'1px solid rgba(212,168,67,0.1)',
          padding:'1.5rem 0',flexShrink:0,
          position:'sticky',top:64,height:'calc(100vh - 64px)',overflowY:'auto',
        }}>
          <div style={{padding:'0 1.25rem 1.25rem',borderBottom:'1px solid rgba(212,168,67,0.08)',marginBottom:'0.75rem'}}>
            <div style={{height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,marginBottom:'1rem'}}/>
            <p style={{fontFamily:"'Josefin Sans',sans-serif",fontSize:8,fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'rgba(212,168,67,0.35)',textAlign:'center'}}>Navegação</p>
          </div>
          <nav>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} className="pc-tab-btn" style={{
                display:'flex',alignItems:'center',gap:10,width:'100%',textAlign:'left',
                padding:'11px 20px',border:'none',cursor:'pointer',
                fontFamily:"'Josefin Sans',sans-serif",fontSize:11,fontWeight:tab===t.id?700:400,
                letterSpacing:'.06em',textTransform:'uppercase',
                background:tab===t.id?'rgba(212,168,67,0.1)':'transparent',
                color:tab===t.id?GOLD:'rgba(255,255,255,.4)',
                borderLeft:`3px solid ${tab===t.id?GOLD:'transparent'}`,
                transition:'all .15s',
              }}>
                <span style={{opacity:.8,fontSize:9}}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
          <div style={{padding:'1.5rem 1.25rem 1rem',borderTop:'1px solid rgba(212,168,67,0.08)',marginTop:'1rem',display:'flex',flexDirection:'column',gap:8}}>
            <a href="/pt/payload/admin" target="_blank" style={{
              ...goldBtn,justifyContent:'center',fontSize:10,padding:'9px 14px',textDecoration:'none',
            }} onClick={e=>{if(!confirm('O Payload CMS requer configuração adicional. Deseja continuar?'))e.preventDefault()}}>⚓ Payload CMS</a>
            <a href="/pt/cardapio" target="_blank" style={{
              ...ghostBtn,justifyContent:'center',fontSize:10,padding:'9px 14px',textDecoration:'none',
              color:GOLD,borderColor:'rgba(212,168,67,0.2)',
            }}>📖 Ver Cardápio</a>
          </div>
        </aside>

        <main style={{flex:1,padding:'2.5rem',overflowX:'auto',minWidth:0,background:CREAM}}>
          {tab==='dashboard' && <TabDashboard stats={stats} loading={statsLoading}/>}
          {tab==='reservas'  && <TabReservas/>}
          {tab==='clientes'  && <TabClientes/>}
          {tab==='conteudo'  && <TabConteudo/>}
          {tab==='cardapio'  && <TabCardapio/>}
          {tab==='site'      && <TabSite/>}
        </main>
      </div>
    </div>
  )
}
