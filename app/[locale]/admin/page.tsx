'use client'
import { useState, useEffect, useCallback } from 'react'

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
type DishItem   = { title_pt:string; title_en:string; title_es:string; desc_pt:string; desc_en:string; desc_es:string }
type PillarItem = { title_pt:string; title_en:string; title_es:string; desc_pt:string; desc_en:string; desc_es:string }

/* ══ CONSTANTS ══════════════════════════════════════════════════ */
const STATUS_LABELS: Record<string,{label:string;color:string;bg:string}> = {
  pending:   {label:'Pendente',  color:'#92400e',bg:'#fef3c7'},
  confirmed: {label:'Confirmada',color:'#065f46',bg:'#d1fae5'},
  cancelled: {label:'Cancelada', color:'#991b1b',bg:'#fee2e2'},
  no_show:   {label:'No-show',   color:'#4b5563',bg:'#f3f4f6'},
  completed: {label:'Concluída', color:'#1e40af',bg:'#dbeafe'},
}
const TABS = [
  {id:'dashboard',label:'📊 Dashboard'},
  {id:'reservas', label:'📅 Reservas'},
  {id:'clientes', label:'👥 Clientes'},
  {id:'conteudo', label:'✏️ Conteúdo'},
  {id:'cardapio', label:'🍽️ Cardápio'},
  {id:'site',     label:'⚙️ Configurações'},
]

/* ══ SHARED STYLES ══════════════════════════════════════════════ */
const inp: React.CSSProperties = {padding:'8px 12px',borderRadius:7,border:'1px solid #d1d5db',fontSize:13,outline:'none',background:'#fff',color:'#111827',width:'100%',boxSizing:'border-box'}
const inpSm: React.CSSProperties = {...inp,padding:'6px 10px',fontSize:12}
const btnP: React.CSSProperties = {padding:'8px 18px',borderRadius:8,background:'#002451',color:'#fff',border:'none',fontWeight:700,fontSize:12,cursor:'pointer',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6}
const btnS: React.CSSProperties = {padding:'8px 18px',borderRadius:8,background:'#f3f4f6',color:'#374151',border:'1px solid #e5e7eb',fontWeight:600,fontSize:12,cursor:'pointer',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6}
const btnG: React.CSSProperties = {padding:'7px 14px',borderRadius:7,background:'#10b981',color:'#fff',border:'none',fontWeight:700,fontSize:12,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:5}
const card: React.CSSProperties = {background:'#fff',borderRadius:14,padding:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,.07)',marginBottom:'1.5rem'}

/* ══ SMALL COMPONENTS ═══════════════════════════════════════════ */
function Badge({status}:{status:string}) {
  const s = STATUS_LABELS[status] ?? {label:status,color:'#374151',bg:'#f3f4f6'}
  return <span style={{background:s.bg,color:s.color,padding:'2px 10px',borderRadius:99,fontSize:11,fontWeight:700,whiteSpace:'nowrap'}}>{s.label}</span>
}
function StatCard({label,value,sub,color}:{label:string;value:number|string;sub?:string;color?:string}) {
  return (
    <div style={{background:'#fff',borderRadius:14,padding:'1.4rem',boxShadow:'0 1px 4px rgba(0,0,0,.07)',borderLeft:`4px solid ${color??'#D4A843'}`}}>
      <p style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#6b7280',margin:'0 0 .3rem'}}>{label}</p>
      <p style={{fontSize:30,fontWeight:800,color:'#111827',margin:0,lineHeight:1}}>{value}</p>
      {sub&&<p style={{fontSize:11,color:'#9ca3af',margin:'.25rem 0 0'}}>{sub}</p>}
    </div>
  )
}
function SectionHeader({title,onSave,saving,dirty}:{title:string;onSave:()=>void;saving:boolean;dirty:boolean}) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem'}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:800,color:'#111827'}}>{title}</h3>
      <button onClick={onSave} disabled={saving||!dirty} style={{...btnG,opacity:saving||!dirty?.7:1}}>
        {saving?'Salvando…':'💾 Salvar alterações'}
      </button>
    </div>
  )
}
function LangTabs({lang,setLang}:{lang:string;setLang:(l:string)=>void}) {
  return (
    <div style={{display:'flex',gap:4,marginBottom:'1rem'}}>
      {['pt','en','es'].map(l=>(
        <button key={l} onClick={()=>setLang(l)} style={{padding:'4px 14px',borderRadius:6,border:'1px solid',fontSize:12,fontWeight:700,cursor:'pointer',
          background:lang===l?'#002451':'#fff',color:lang===l?'#fff':'#374151',borderColor:lang===l?'#002451':'#d1d5db'}}>
          {l==='pt'?'🇧🇷 PT':l==='en'?'🇺🇸 EN':'🇪🇸 ES'}
        </button>
      ))}
    </div>
  )
}
function Toast({msg,type}:{msg:string;type:'ok'|'err'}) {
  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:9999,padding:'12px 20px',borderRadius:10,
      background:type==='ok'?'#10b981':'#ef4444',color:'#fff',fontWeight:700,fontSize:13,
      boxShadow:'0 4px 20px rgba(0,0,0,.2)',animation:'slideIn .2s ease'}}>
      {type==='ok'?'✅ ':' ❌ '}{msg}
    </div>
  )
}

/* ══ HOOK: useContent ════════════════════════════════════════════ */
function useContent<T>(key:string) {
  const [data, setData]   = useState<T|null>(null)
  const [dirty,setDirty]  = useState(false)
  const [saving,setSaving]= useState(false)
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)

  useEffect(()=>{
    fetch(`/api/admin/content/${key}`).then(r=>r.json()).then(d=>{ if(d.value) setData(d.value) })
  },[key])

  function update(fn:(prev:T)=>T) { setData(p=>{ const n=fn(p as T); setDirty(true); return n }) }

  async function save() {
    if(!data) return
    setSaving(true)
    const r = await fetch(`/api/admin/content/${key}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:data})})
    setSaving(false)
    if(r.ok){ setDirty(false); showToast('Salvo com sucesso!','ok') }
    else showToast('Erro ao salvar','err')
  }
  function showToast(msg:string,type:'ok'|'err') {
    setToast({msg,type}); setTimeout(()=>setToast(null),3000)
  }
  return {data,update,save,saving,dirty,toast}
}

/* ══ TAB: DASHBOARD ═════════════════════════════════════════════ */
function TabDashboard({stats,loading}:{stats:Stats|null;loading:boolean}) {
  if(loading) return <div style={{textAlign:'center',padding:'4rem',color:'#9ca3af'}}>Carregando…</div>
  if(!stats) return null
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
        <StatCard label="Total Reservas" value={stats.total_reservations} color="#D4A843"/>
        <StatCard label="Hoje"           value={stats.today_reservations} color="#10b981" sub="para hoje"/>
        <StatCard label="Pendentes"      value={stats.pending_reservations} color="#f59e0b" sub="aguardando"/>
        <StatCard label="Confirmadas"    value={stats.confirmed_reservations} color="#3b82f6"/>
        <StatCard label="Clientes"       value={stats.total_customers} color="#8b5cf6"/>
        <StatCard label="Opt-in LGPD"    value={stats.optin_customers} color="#ec4899" sub="marketing aceito"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
        <div style={card}>
          <h3 style={{margin:'0 0 1rem',fontSize:14,fontWeight:700,color:'#374151'}}>Reservas por Status</h3>
          {stats.by_status.map(s=>(
            <div key={s.status} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.45rem 0',borderBottom:'1px solid #f3f4f6'}}>
              <Badge status={s.status}/><span style={{fontWeight:700,color:'#111827'}}>{Number(s.total)}</span>
            </div>
          ))}
        </div>
        <div style={card}>
          <h3 style={{margin:'0 0 1rem',fontSize:14,fontWeight:700,color:'#374151'}}>Reservas Recentes</h3>
          {stats.recent_reservations.map(r=>(
            <div key={r.id} style={{padding:'.45rem 0',borderBottom:'1px solid #f3f4f6',display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
              <div style={{minWidth:0}}>
                <p style={{margin:0,fontWeight:600,fontSize:13,color:'#111827',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</p>
                <p style={{margin:0,fontSize:11,color:'#9ca3af'}}>{r.reservation_date} {r.reservation_time} · {r.party_size} pax</p>
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
  const [rows,setRows]       = useState<Reservation[]>([])
  const [loading,setLoading] = useState(true)
  const [search,setSearch]   = useState('')
  const [status,setStatus]   = useState('all')
  const [date,setDate]       = useState('')
  const [selected,setSelected] = useState<Reservation|null>(null)
  const [saving,setSaving]   = useState(false)

  const load = useCallback(async()=>{
    setLoading(true)
    const p = new URLSearchParams()
    if(status!=='all') p.set('status',status)
    if(search) p.set('search',search)
    if(date)   p.set('date',date)
    const r = await fetch(`/api/admin/reservas?${p}`)
    const d = await r.json()
    setRows(d.reservations??[]); setLoading(false)
  },[search,status,date])

  useEffect(()=>{load()},[load])

  async function updateStatus(id:string,s:string) {
    setSaving(true)
    await fetch(`/api/admin/reservas/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:s})})
    setSaving(false); setSelected(null); load()
  }

  return (
    <div>
      <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Nome…" style={{...inp,maxWidth:200}}/>
        <select value={status} onChange={e=>setStatus(e.target.value)} style={{...inp,maxWidth:180}}>
          <option value="all">Todos os status</option>
          {Object.entries(STATUS_LABELS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{...inp,maxWidth:160}}/>
        <button onClick={()=>{setSearch('');setStatus('all');setDate('')}} style={btnS}>Limpar</button>
        <span style={{marginLeft:'auto',padding:'8px 14px',background:'#f0fdf4',borderRadius:99,fontSize:12,fontWeight:600,color:'#065f46',border:'1px solid #bbf7d0'}}>{rows.length} reservas</span>
      </div>
      {loading?<div style={{textAlign:'center',padding:'3rem',color:'#9ca3af'}}>Carregando…</div>:(
        <div style={{background:'#fff',borderRadius:14,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.07)'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{background:'#f9fafb',borderBottom:'2px solid #e5e7eb'}}>
              {['Nome','Data','Hora','Pax','Status','Contato','Ação'].map(h=>(
                <th key={h} style={{padding:'9px 13px',textAlign:'left',fontSize:10,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'#6b7280'}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id} style={{borderBottom:'1px solid #f3f4f6',cursor:'pointer'}} onClick={()=>setSelected(r)}
                  onMouseEnter={e=>(e.currentTarget.style.background='#f9fafb')} onMouseLeave={e=>(e.currentTarget.style.background='')}>
                  <td style={{padding:'9px 13px',fontWeight:600,color:'#111827'}}>{r.name}</td>
                  <td style={{padding:'9px 13px',color:'#374151'}}>{r.reservation_date}</td>
                  <td style={{padding:'9px 13px',color:'#374151'}}>{r.reservation_time}</td>
                  <td style={{padding:'9px 13px',textAlign:'center'}}>{r.party_size}</td>
                  <td style={{padding:'9px 13px'}}><Badge status={r.status}/></td>
                  <td style={{padding:'9px 13px',fontSize:11,color:'#6b7280'}}><div>{r.email}</div><div>{r.whatsapp}</div></td>
                  <td style={{padding:'9px 13px'}}>
                    <a href={`https://wa.me/55${r.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener"
                       onClick={e=>e.stopPropagation()} style={{...btnG,fontSize:11,padding:'5px 10px',textDecoration:'none'}}>
                      📲 WA
                    </a>
                  </td>
                </tr>
              ))}
              {rows.length===0&&<tr><td colSpan={7} style={{textAlign:'center',padding:'3rem',color:'#9ca3af'}}>Nenhuma reserva encontrada</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {selected&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={()=>setSelected(null)}>
          <div style={{background:'#fff',borderRadius:18,padding:'2rem',width:'100%',maxWidth:540,boxShadow:'0 20px 60px rgba(0,0,0,.25)',maxHeight:'90vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <h2 style={{margin:0,fontSize:18,fontWeight:800,color:'#111827'}}>📋 {selected.name}</h2>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:'#9ca3af'}}>✕</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.5rem'}}>
              {[['Data',selected.reservation_date],['Horário',selected.reservation_time],
                ['Pessoas',String(selected.party_size)],['Ocasião',selected.occasion_type??'—'],
                ['Email',selected.email],['WhatsApp',selected.whatsapp],
                ['Opt-in',selected.optin_accepted?'✅ Sim':'❌ Não'],
                ['BC Connect',selected.bc_connect_sent?'✅ Enviado':'⏳ Pendente'],
                ['Email conf.',selected.confirmation_email_sent?'✅ Enviado':'⏳ Pendente'],
                ['Cadastro',new Date(selected.created_at).toLocaleString('pt-BR')],
              ].map(([k,v])=>(
                <div key={k as string}><p style={{margin:0,fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#9ca3af'}}>{k}</p><p style={{margin:0,fontWeight:600,color:'#111827',fontSize:13,wordBreak:'break-all'}}>{v}</p></div>
              ))}
            </div>
            {selected.observations&&<div style={{background:'#f9fafb',borderRadius:8,padding:'1rem',marginBottom:'1rem',fontSize:13,color:'#374151'}}><b>Obs:</b> {selected.observations}</div>}
            {selected.allergies&&<div style={{background:'#fef2f2',borderRadius:8,padding:'1rem',marginBottom:'1rem',fontSize:13,color:'#991b1b'}}><b>Alergias:</b> {selected.allergies}</div>}
            <p style={{margin:'0 0 .5rem',fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#9ca3af'}}>Alterar Status</p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1rem'}}>
              {Object.entries(STATUS_LABELS).map(([k,v])=>(
                <button key={k} disabled={saving} onClick={()=>updateStatus(selected.id,k)}
                  style={{padding:'6px 14px',borderRadius:99,border:`2px solid ${v.bg}`,background:selected.status===k?v.bg:'#fff',color:v.color,fontWeight:700,fontSize:12,cursor:'pointer',opacity:saving?.5:1}}>
                  {v.label}
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:8}}>
              <a href={`https://wa.me/55${selected.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener" style={{...btnG,textDecoration:'none'}}>📲 WhatsApp</a>
              <a href={`mailto:${selected.email}`} style={{...btnS,textDecoration:'none'}}>✉️ Email</a>
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

  return (
    <div>
      <div style={{display:'flex',gap:10,marginBottom:18,alignItems:'center'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Nome ou email…" style={{...inp,maxWidth:280}}/>
        <span style={{marginLeft:'auto',padding:'7px 14px',background:'#f0fdf4',borderRadius:99,fontSize:12,fontWeight:600,color:'#065f46',border:'1px solid #bbf7d0'}}>{filtered.length} clientes</span>
      </div>
      {loading?<div style={{textAlign:'center',padding:'3rem',color:'#9ca3af'}}>Carregando…</div>:(
        <div style={{background:'#fff',borderRadius:14,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.07)'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{background:'#f9fafb',borderBottom:'2px solid #e5e7eb'}}>
              {['Nome','Email','WhatsApp','Cidade','Opt-in','Cadastro'].map(h=>(
                <th key={h} style={{padding:'9px 13px',textAlign:'left',fontSize:10,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'#6b7280'}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id} style={{borderBottom:'1px solid #f3f4f6'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='#f9fafb')} onMouseLeave={e=>(e.currentTarget.style.background='')}>
                  <td style={{padding:'9px 13px',fontWeight:600,color:'#111827'}}>{c.name}</td>
                  <td style={{padding:'9px 13px',color:'#374151'}}>{c.email}</td>
                  <td style={{padding:'9px 13px',color:'#374151'}}>{c.whatsapp??'—'}</td>
                  <td style={{padding:'9px 13px',color:'#6b7280'}}>{c.city_of_origin??'—'}</td>
                  <td style={{padding:'9px 13px',textAlign:'center'}}>{c.optin_accepted?'✅':'❌'}</td>
                  <td style={{padding:'9px 13px',color:'#9ca3af',fontSize:11}}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={6} style={{textAlign:'center',padding:'3rem',color:'#9ca3af'}}>Nenhum cliente</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ══ TAB: CONTEÚDO — editor completo conectado ao banco ══════════ */
function TabConteudo() {
  const [section, setSection] = useState<'hero'|'dishes'|'history'|'pillars'|'location'>('hero')
  return (
    <div style={{display:'flex',gap:'1.5rem'}}>
      {/* sub-nav */}
      <aside style={{width:160,flexShrink:0}}>
        {(['hero','dishes','history','pillars','location'] as const).map(s=>(
          <button key={s} onClick={()=>setSection(s)} style={{display:'block',width:'100%',textAlign:'left',padding:'9px 14px',border:'none',cursor:'pointer',fontSize:13,borderRadius:8,marginBottom:4,
            background:section===s?'#002451':'transparent',color:section===s?'#fff':'#374151',fontWeight:section===s?700:500}}>
            {s==='hero'?'🎬 Hero':s==='dishes'?'🍽️ Pratos em Destaque':s==='history'?'📖 Nossa História':s==='pillars'?'🏛️ 3 Pilares':'📍 Localização'}
          </button>
        ))}
      </aside>
      <div style={{flex:1}}>
        {section==='hero'     && <EditHero/>}
        {section==='dishes'   && <EditDishes/>}
        {section==='history'  && <EditHistory/>}
        {section==='pillars'  && <EditPillars/>}
        {section==='location' && <EditLocation/>}
      </div>
    </div>
  )
}

/* ─── Hero Editor ─────────────────────────────────── */
function EditHero() {
  const {data,update,save,saving,dirty,toast} = useContent<Record<string,string>>('hero')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'#9ca3af',padding:'2rem'}}>Carregando…</div>
  return (
    <div style={card}>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <SectionHeader title="🎬 Hero Banner" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{display:'grid',gap:'1rem'}}>
        <div>
          <label style={labelSt}>Eyebrow (linha pequena acima do título)</label>
          <input style={inp} value={data[`eyebrow_${lang}`]??''} onChange={e=>update(p=>({...p,[`eyebrow_${lang}`]:e.target.value}))}/>
        </div>
        <div>
          <label style={labelSt}>Tagline (título principal — use \n para quebra de linha)</label>
          <textarea rows={3} style={{...inp,resize:'vertical'}} value={data[`tagline_${lang}`]??''} onChange={e=>update(p=>({...p,[`tagline_${lang}`]:e.target.value}))}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div>
            <label style={labelSt}>Botão Reserva</label>
            <input style={inp} value={data[`cta_reserva_${lang}`]??''} onChange={e=>update(p=>({...p,[`cta_reserva_${lang}`]:e.target.value}))}/>
          </div>
          <div>
            <label style={labelSt}>Botão Cardápio</label>
            <input style={inp} value={data[`cta_cardapio_${lang}`]??''} onChange={e=>update(p=>({...p,[`cta_cardapio_${lang}`]:e.target.value}))}/>
          </div>
        </div>
      </div>
    </div>
  )
}
const labelSt: React.CSSProperties = {display:'block',fontSize:11,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',color:'#6b7280',marginBottom:5}

/* ─── Dishes Editor ───────────────────────────────── */
type DishesContent = {section_title_pt:string;section_title_en:string;section_title_es:string;items:DishItem[]}
function EditDishes() {
  const {data,update,save,saving,dirty,toast} = useContent<DishesContent>('dishes')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'#9ca3af',padding:'2rem'}}>Carregando…</div>
  return (
    <div style={card}>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <SectionHeader title="🍽️ Pratos em Destaque" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{marginBottom:'1rem'}}>
        <label style={labelSt}>Título da Seção</label>
        <input style={inp} value={(data as Record<string,unknown>)[`section_title_${lang}`] as string??''} onChange={e=>update(p=>({...p,[`section_title_${lang}`]:e.target.value}))}/>
      </div>
      <p style={{fontSize:12,fontWeight:700,color:'#374151',margin:'1.5rem 0 .75rem'}}>Pratos ({data.items?.length??0})</p>
      {data.items?.map((item,i)=>(
        <div key={i} style={{border:'1px solid #e5e7eb',borderRadius:10,padding:'1rem',marginBottom:'1rem',background:'#fafafa'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.75rem'}}>
            <span style={{fontWeight:700,fontSize:13,color:'#002451'}}>Prato {i+1}</span>
            <button onClick={()=>update(p=>({...p,items:p.items.filter((_,j)=>j!==i)}))}
              style={{padding:'3px 10px',borderRadius:6,border:'1px solid #fee2e2',background:'#fee2e2',color:'#991b1b',fontSize:11,fontWeight:700,cursor:'pointer'}}>
              ✕ Remover
            </button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div>
              <label style={labelSt}>Título ({lang.toUpperCase()})</label>
              <input style={inpSm} value={(item as Record<string,unknown>)[`title_${lang}`] as string??''} onChange={e=>update(p=>({...p,items:p.items.map((it,j)=>j===i?{...it,[`title_${lang}`]:e.target.value}:it)}))}/>
            </div>
            <div>
              <label style={labelSt}>Descrição ({lang.toUpperCase()})</label>
              <input style={inpSm} value={(item as Record<string,unknown>)[`desc_${lang}`] as string??''} onChange={e=>update(p=>({...p,items:p.items.map((it,j)=>j===i?{...it,[`desc_${lang}`]:e.target.value}:it)}))}/>
            </div>
          </div>
        </div>
      ))}
      <button onClick={()=>update(p=>({...p,items:[...p.items,{title_pt:'',title_en:'',title_es:'',desc_pt:'',desc_en:'',desc_es:''}]}))}
        style={{...btnS,width:'100%',justifyContent:'center',marginTop:4}}>
        + Adicionar Prato
      </button>
    </div>
  )
}

/* ─── History Editor ──────────────────────────────── */
type HistoryContent = Record<string,string>
function EditHistory() {
  const {data,update,save,saving,dirty,toast} = useContent<HistoryContent>('history')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'#9ca3af',padding:'2rem'}}>Carregando…</div>
  const F = (key:string, label:string, rows=1) => (
    <div key={key}>
      <label style={labelSt}>{label}</label>
      {rows>1
        ? <textarea rows={rows} style={{...inp,resize:'vertical'}} value={data[`${key}_${lang}`]??''} onChange={e=>update(p=>({...p,[`${key}_${lang}`]:e.target.value}))}/>
        : <input style={inp} value={data[`${key}_${lang}`]??''} onChange={e=>update(p=>({...p,[`${key}_${lang}`]:e.target.value}))}/>
      }
    </div>
  )
  return (
    <div style={card}>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <SectionHeader title="📖 Nossa História" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{display:'grid',gap:'1rem'}}>
        {F('title','Título (use \\n para quebra)',2)}
        {F('p1','Parágrafo 1',3)}
        {F('p2','Parágrafo 2',3)}
        {F('quote','Citação (sem aspas)',3)}
        {F('quote_author','Autor da Citação')}
      </div>
    </div>
  )
}

/* ─── Pillars Editor ──────────────────────────────── */
type PillarsContent = {title_pt:string;title_en:string;title_es:string;eyebrow_pt:string;eyebrow_en:string;eyebrow_es:string;items:PillarItem[]}
function EditPillars() {
  const {data,update,save,saving,dirty,toast} = useContent<PillarsContent>('pillars')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'#9ca3af',padding:'2rem'}}>Carregando…</div>
  return (
    <div style={card}>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <SectionHeader title="🏛️ 3 Pilares" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.5rem'}}>
        <div>
          <label style={labelSt}>Eyebrow</label>
          <input style={inp} value={(data as Record<string,unknown>)[`eyebrow_${lang}`] as string??''} onChange={e=>update(p=>({...p,[`eyebrow_${lang}`]:e.target.value}))}/>
        </div>
        <div>
          <label style={labelSt}>Título da Seção</label>
          <input style={inp} value={(data as Record<string,unknown>)[`title_${lang}`] as string??''} onChange={e=>update(p=>({...p,[`title_${lang}`]:e.target.value}))}/>
        </div>
      </div>
      <p style={{fontSize:12,fontWeight:700,color:'#374151',margin:'.5rem 0 .75rem'}}>Pilares</p>
      {data.items?.map((item,i)=>(
        <div key={i} style={{border:'1px solid #e5e7eb',borderRadius:10,padding:'1rem',marginBottom:'1rem',background:'#fafafa'}}>
          <p style={{margin:'0 0 .75rem',fontWeight:700,fontSize:13,color:'#002451'}}>Pilar {i+1}</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div>
              <label style={labelSt}>Título ({lang.toUpperCase()})</label>
              <input style={inpSm} value={(item as Record<string,unknown>)[`title_${lang}`] as string??''} onChange={e=>update(p=>({...p,items:p.items.map((it,j)=>j===i?{...it,[`title_${lang}`]:e.target.value}:it)}))}/>
            </div>
            <div>
              <label style={labelSt}>Descrição ({lang.toUpperCase()})</label>
              <input style={inpSm} value={(item as Record<string,unknown>)[`desc_${lang}`] as string??''} onChange={e=>update(p=>({...p,items:p.items.map((it,j)=>j===i?{...it,[`desc_${lang}`]:e.target.value}:it)}))}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Location Editor ─────────────────────────────── */
type LocationContent = Record<string,string>
function EditLocation() {
  const {data,update,save,saving,dirty,toast} = useContent<LocationContent>('location')
  const [lang,setLang] = useState('pt')
  if(!data) return <div style={{color:'#9ca3af',padding:'2rem'}}>Carregando…</div>
  return (
    <div style={card}>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <SectionHeader title="📍 Localização" onSave={save} saving={saving} dirty={dirty}/>
      <LangTabs lang={lang} setLang={setLang}/>
      <div style={{display:'grid',gap:'1rem'}}>
        <div>
          <label style={labelSt}>Eyebrow</label>
          <input style={inp} value={data[`eyebrow_${lang}`]??''} onChange={e=>update(p=>({...p,[`eyebrow_${lang}`]:e.target.value}))}/>
        </div>
        <div>
          <label style={labelSt}>Título (use \n para quebra)</label>
          <textarea rows={2} style={{...inp,resize:'vertical'}} value={data[`title_${lang}`]??''} onChange={e=>update(p=>({...p,[`title_${lang}`]:e.target.value}))}/>
        </div>
        <div>
          <label style={labelSt}>Descrição</label>
          <textarea rows={3} style={{...inp,resize:'vertical'}} value={data[`desc_${lang}`]??''} onChange={e=>update(p=>({...p,[`desc_${lang}`]:e.target.value}))}/>
        </div>
        <div>
          <label style={labelSt}>URL Google Maps</label>
          <input style={inp} value={data.maps_url??''} onChange={e=>update(p=>({...p,maps_url:e.target.value}))}/>
          {data.maps_url&&<a href={data.maps_url} target="_blank" rel="noopener" style={{fontSize:11,color:'#2563eb',marginTop:4,display:'inline-block'}}>🗺️ Testar link →</a>}
        </div>
      </div>
    </div>
  )
}

/* ══ TAB: CARDÁPIO ══════════════════════════════════════════════ */
const MENU_SECTIONS: Record<string,string> = {
  'entradas-quentes':'Entradas Quentes','entradas-frias':'Entradas Frias','saladas':'Saladas',
  'iguarias':'Iguarias do Mar','peixes':'Peixes','camaroes':'Camarões','trattoria':'Trattoria',
  'carnes':'Carnes & Aves','horta':'Da Horta ao Prato','sobremesas':'Sobremesas',
  'bebidas':'Bebidas','drinks':'Drinks & Caipirinhas'
}
function TabCardapio() {
  return (
    <div>
      <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:12,padding:'1rem 1.5rem',marginBottom:'1.5rem',display:'flex',gap:12}}>
        <span style={{fontSize:20}}>ℹ️</span>
        <div>
          <p style={{margin:0,fontWeight:700,color:'#92400e',fontSize:14}}>Cardápio Completo</p>
          <p style={{margin:'4px 0 0',fontSize:12,color:'#92400e'}}>
            Edite preços e itens detalhados via <strong>Payload CMS → menu-items</strong>.
            As 12 seções do flipbook são geridas lá.
          </p>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:12}}>
        {Object.entries(MENU_SECTIONS).map(([id,label])=>(
          <div key={id} style={{background:'#fff',borderRadius:12,padding:'1.1rem',boxShadow:'0 1px 4px rgba(0,0,0,.07)',border:'1px solid #e5e7eb'}}>
            <p style={{margin:0,fontWeight:700,fontSize:13,color:'#111827'}}>{label}</p>
            <p style={{margin:'4px 0 10px',fontSize:11,color:'#9ca3af'}}>ID: {id}</p>
            <a href="/pt/payload/admin/collections/menu-items" target="_blank"
              style={{...btnP,fontSize:11,padding:'5px 12px',textDecoration:'none'}}>
              ✏️ Editar no CMS
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══ TAB: CONFIGURAÇÕES DO SITE ═════════════════════════════════ */
type SiteInfoContent = {phone:string;whatsapp:string;address:string;hours_lunch:string;hours_dinner:string;instagram:string;instagram_url:string;facebook_url:string;maps_url:string;email_contact:string;founded_year:string}
function TabSite() {
  const {data,update,save,saving,dirty,toast} = useContent<SiteInfoContent>('site_info')
  if(!data) return <div style={{color:'#9ca3af',padding:'2rem'}}>Carregando…</div>
  const F = (key: keyof SiteInfoContent, label: string, placeholder='') => (
    <div key={key}>
      <label style={labelSt}>{label}</label>
      <input style={inp} value={data[key]??''} placeholder={placeholder}
        onChange={e=>update(p=>({...p,[key]:e.target.value}))}/>
    </div>
  )
  return (
    <div style={card}>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      <SectionHeader title="⚙️ Configurações do Site" onSave={save} saving={saving} dirty={dirty}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        {F('phone','Telefone','(47) 9 9999-9999')}
        {F('whatsapp','WhatsApp (só números)','4799999999')}
        {F('address','Endereço Completo')}
        {F('email_contact','Email de Contato')}
        {F('hours_lunch','Horário Almoço','12h–16h')}
        {F('hours_dinner','Horário Jantar','18h–23h')}
        {F('instagram','Instagram handle','@portocabralbc')}
        {F('instagram_url','Instagram URL')}
        {F('facebook_url','Facebook URL')}
        {F('maps_url','Google Maps URL')}
        {F('founded_year','Ano de Fundação','1998')}
      </div>
      <div style={{marginTop:'1.5rem',padding:'1rem',background:'#f0fdf4',borderRadius:8,fontSize:12,color:'#065f46'}}>
        💡 Após salvar, as informações atualizam no site imediatamente (próximo carregamento de página).
      </div>
    </div>
  )
}

/* ══ PÁGINA PRINCIPAL ═══════════════════════════════════════════ */
export default function AdminPage() {
  const [tab,setTab]             = useState('dashboard')
  const [stats,setStats]         = useState<Stats|null>(null)
  const [statsLoading,setStatsL] = useState(true)

  useEffect(()=>{
    fetch('/api/admin/stats').then(r=>r.json()).then(d=>{setStats(d);setStatsL(false)})
  },[])

  return (
    <div style={{minHeight:'100vh',background:'#f3f4f6',fontFamily:'Inter,system-ui,sans-serif'}}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        textarea,input,select{font-family:inherit}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px}
      `}</style>

      {/* ── TOPBAR ─────────────────────────────────────── */}
      <div style={{background:'#002451',padding:'0 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',height:58,position:'sticky',top:0,zIndex:50,boxShadow:'0 2px 12px rgba(0,0,0,.2)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:20}}>⚓</span>
          <span style={{fontWeight:800,fontSize:15,color:'#D4A843',letterSpacing:'.04em'}}>Porto Cabral</span>
          <span style={{fontSize:10,fontWeight:600,color:'rgba(212,168,67,.45)',letterSpacing:'.18em',textTransform:'uppercase'}}>ADMIN</span>
        </div>
        <div style={{display:'flex',gap:20,alignItems:'center'}}>
          {stats&&(
            <>
              <span style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>🔔 <b style={{color:'#fbbf24'}}>{stats.pending_reservations}</b> pendentes</span>
              <span style={{fontSize:12,color:'rgba(255,255,255,.6)'}}>📅 <b style={{color:'#34d399'}}>{stats.today_reservations}</b> hoje</span>
            </>
          )}
          <a href="/pt" target="_blank" style={{fontSize:12,color:'rgba(255,255,255,.5)',textDecoration:'none'}}>← Ir ao site</a>
        </div>
      </div>

      <div style={{display:'flex',minHeight:'calc(100vh - 58px)'}}>
        {/* ── SIDEBAR ──────────────────────────────────── */}
        <aside style={{width:215,background:'#fff',borderRight:'1px solid #e5e7eb',padding:'1.25rem 0',flexShrink:0,position:'sticky',top:58,height:'calc(100vh - 58px)',overflowY:'auto'}}>
          <nav>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{display:'block',width:'100%',textAlign:'left',padding:'10px 18px',border:'none',cursor:'pointer',fontSize:13,
                fontWeight:tab===t.id?700:500,background:tab===t.id?'#f0f7ff':'transparent',
                color:tab===t.id?'#002451':'#4b5563',
                borderLeft:tab===t.id?'3px solid #D4A843':'3px solid transparent',transition:'all .12s'}}>
                {t.label}
              </button>
            ))}
          </nav>
          <div style={{padding:'1.5rem 18px 1rem',borderTop:'1px solid #f3f4f6',marginTop:'1rem'}}>
            <a href="/pt/payload/admin" target="_blank"
              style={{display:'block',padding:'8px 12px',background:'#fef3c7',borderRadius:8,fontSize:11,fontWeight:700,color:'#92400e',textDecoration:'none',textAlign:'center',marginBottom:8}}>
              🛠️ Payload CMS
            </a>
            <a href="/pt/cardapio" target="_blank"
              style={{display:'block',padding:'8px 12px',background:'#eff6ff',borderRadius:8,fontSize:11,fontWeight:700,color:'#1e40af',textDecoration:'none',textAlign:'center'}}>
              📖 Ver Cardápio
            </a>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────── */}
        <main style={{flex:1,padding:'2rem',overflowX:'auto',minWidth:0}}>
          <h1 style={{margin:'0 0 1.5rem',fontSize:20,fontWeight:800,color:'#111827'}}>
            {TABS.find(t=>t.id===tab)?.label}
          </h1>
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
