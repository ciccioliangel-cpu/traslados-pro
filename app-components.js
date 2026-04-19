function FUp({label,value,onChange,accept="image/*,.pdf"}){const h=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onChange({name:f.name,data:ev.target.result,type:f.type});r.readAsDataURL(f);};return <div className="fp"><label>{label}</label><label className={`uz${value?" hf":""}`}><input type="file" accept={accept} onChange={h}/>{value?<><Ic n="chk" s={11}/> {value.name}</>:<><Ic n="up" s={11}/> Seleccionar</>}</label></div>;}
function PwI({value,onChange,placeholder="Contraseña"}){const[show,setShow]=useState(false);return <div className="pw"><input type={show?"text":"password"} value={value} onChange={onChange} placeholder={placeholder}/><button type="button" className="pe" onClick={()=>setShow(s=>!s)}><Ic n="eye" s={13}/></button></div>;}
function Tog({checked,onChange}){return <label className="tg"><input type="checkbox" checked={checked} onChange={onChange}/><span className="tgs"/></label>;}
function SI({value,onChange,placeholder="Buscar...",style={}}){return <div style={{position:"relative",...style}}><span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--mu)",pointerEvents:"none"}}><Ic n="srch" s={12}/></span><input className="fi" value={value} onChange={onChange} placeholder={placeholder} style={{paddingLeft:28,width:"100%"}}/></div>;}
// ── LOGIN ──────────────────────────────────────────────────────────────────────
function Login({users,onLogin}){
  const[mode,setMode]=useState("login");
  const[f,setF]=useState({id:"",pw:"",phone:"",email:"",confirm:""});
  const[err,setErr]=useState("");
  const sf=k=>({value:f[k],onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const norm=p=>p.replace(/\D/g,"");
  const doLogin=()=>{setErr("");const np=norm(f.id);const u=users.find(u=>(u.username===f.id||u.email===f.id||(np.length>=4&&(norm(u.phone||"")===np||norm(u.phone||"").endsWith(np))))&&u.password===f.pw);if(!u){setErr("Usuario o contraseña incorrectos.");return;}onLogin(u);};
  const doReg=()=>{
    setErr("");
    if(!f.id||!f.pw||!f.phone||!f.email){setErr("Completá todos los campos.");return;}
    if(f.pw!==f.confirm){setErr("Las contraseñas no coinciden.");return;}
    if(f.pw.length<6){setErr("Mínimo 6 caracteres.");return;}
    const inp=norm(f.phone);
    const m=users.find(u=>u.role==="driver"&&norm(u.phone||"").endsWith(inp)&&u.email.toLowerCase()===f.email.toLowerCase());
    if(!m){setErr("No encontramos un chofer con esos datos. Verificá con administración.");return;}
    if(users.find(u=>u.username===f.id&&u.id!==m.id)){setErr("Ese nombre de usuario ya está en uso.");return;}
    onLogin({...m,username:f.id,password:f.pw});
  };
  return(
    <div className="lw2"><div className="lc">
      <div className="ll">ANGELS<span style={{color:"var(--tx)"}}></span></div>
      <div className="ls">Portal de gestión — Angels Transfers</div>
      <div className="tabs">
        <button className={`tab${mode==="login"?" on":""}`} onClick={()=>{setMode("login");setErr("");}}>Iniciar sesión</button>
        <button className={`tab${mode==="register"?" on":""}`} onClick={()=>{setMode("register");setErr("");}}>Registrarse</button>
      </div>
      {mode==="login"&&<div style={{display:"flex",flexDirection:"column",gap:11}}>
        <div className="fp"><label>Usuario, email o teléfono</label><input {...sf("id")} autoComplete="username"/></div>
        <div className="fp"><label>Contraseña</label><PwI value={f.pw} onChange={e=>setF(p=>({...p,pw:e.target.value}))}/></div>
        {err&&<div style={{color:"var(--re)",fontSize:12}}>{err}</div>}
        <button className="btn bp" onClick={doLogin} style={{width:"100%",justifyContent:"center"}}><Ic n="lock" s={13}/> Entrar</button>
        <div style={{fontSize:11,color:"var(--mu)",textAlign:"center"}}>admin/admin123 · colab1/colab123</div>
      </div>}
      {mode==="register"&&<div style={{display:"flex",flexDirection:"column",gap:11}}>
        <div style={{background:"rgba(0,212,255,.07)",border:"1px solid rgba(0,212,255,.2)",borderRadius:7,padding:"8px 11px",fontSize:11.5,color:"var(--mu2)",lineHeight:1.6}}>Solo choferes registrados pueden crear cuenta. Tu teléfono y email deben coincidir con los datos del sistema.</div>
        <div className="fp"><label>Teléfono (ej: 5491141771182)</label><input {...sf("phone")} placeholder="5491141771182"/></div>
        <div className="fp"><label>Email</label><input type="email" {...sf("email")}/></div>
        <div className="fp"><label>Nombre de usuario</label><input {...sf("id")} placeholder="jose.gustavo"/></div>
        <div className="fp"><label>Contraseña</label><PwI value={f.pw} onChange={e=>setF(p=>({...p,pw:e.target.value}))}/></div>
        <div className="fp"><label>Confirmar contraseña</label><PwI value={f.confirm} onChange={e=>setF(p=>({...p,confirm:e.target.value}))} placeholder="Repetir"/></div>
        {err&&<div style={{color:"var(--re)",fontSize:12}}>{err}</div>}
        <button className="btn bp" onClick={doReg} style={{width:"100%",justifyContent:"center"}}><Ic n="shld" s={13}/> Crear cuenta</button>
      </div>}
    </div></div>
  );
}

function RecoverPass({users,onBack,onSave}){
  const[step,setStep]=useState("find"); // find | verify | reset
  const[search,setSearch]=useState("");
  const[found,setFound]=useState(null);
  const[pin,setPin]=useState("");
  const[generatedPin,setGeneratedPin]=useState("");
  const[newPw,setNewPw]=useState("");const[confirmPw,setConfirmPw]=useState("");
  const[err,setErr]=useState("");
  const norm=p=>p.replace(/\D/g,"");

  const doFind=()=>{
    setErr("");
    if(!search.trim()){setErr("Ingresá tu usuario, email o teléfono.");return;}
    const u=users.find(u=>
      u.username===search||
      u.email===search||
      (u.phone&&norm(u.phone).endsWith(norm(search)))
    );
    if(!u){setErr("No encontramos ningún usuario con esos datos.");return;}
    // Generate 6-digit PIN
    const p=String(Math.floor(100000+Math.random()*900000));
    setGeneratedPin(p);
    setFound(u);
    setStep("verify");
  };

  const maskEmail=e=>{if(!e)return"";const[a,b]=e.split("@");return a.slice(0,2)+"***@"+b;};
  const maskPhone=p=>{if(!p)return"";const d=p.replace(/\D/g,"");return "+"+d.slice(0,3)+"***"+d.slice(-3);};

  const waText=`Tu código de recuperación para ANGELS es: ${generatedPin}\n\nEste código expira en 10 minutos.`;

  const doVerify=()=>{
    setErr("");
    if(pin!==generatedPin){setErr("Código incorrecto. Verificá e intentá de nuevo.");return;}
    setStep("reset");
  };

  const doReset=()=>{
    setErr("");
    if(!newPw||newPw.length<6){setErr("La contraseña debe tener al menos 6 caracteres.");return;}
    if(newPw!==confirmPw){setErr("Las contraseñas no coinciden.");return;}
    onSave(found.id,newPw);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {step==="find"&&<>
        <div style={{background:"rgba(0,212,255,.07)",border:"1px solid rgba(0,212,255,.2)",borderRadius:7,padding:"8px 11px",fontSize:11.5,color:"var(--mu2)",lineHeight:1.6}}>
          Ingresá tu usuario, email o teléfono registrado para recuperar el acceso.
        </div>
        <div className="fp"><label>Usuario, email o teléfono</label><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="juan.perez / juan@email.com" autoFocus/></div>
        {err&&<div style={{color:"var(--re)",fontSize:12}}>{err}</div>}
        <button className="btn bp" onClick={doFind} style={{width:"100%",justifyContent:"center"}}><Ic n="srch" s={13}/> Buscar mi cuenta</button>
        <button className="btn bg2" onClick={onBack} style={{width:"100%",justifyContent:"center"}}>← Volver</button>
      </>}

      {step==="verify"&&found&&<>
        <div style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.3)",borderRadius:7,padding:"10px 12px",fontSize:12,lineHeight:1.7}}>
          <div style={{fontWeight:600,color:"var(--gr)",marginBottom:4}}>✅ Cuenta encontrada: {found.name||found.username}</div>
          <div style={{color:"var(--mu2)"}}>Para verificar tu identidad, enviá el código por WhatsApp o email y luego ingrésalo abajo.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {found.phone&&<a href={`whatsapp://send?phone=${found.phone.replace(/\D/g,"")}&text=${encodeURIComponent(waText)}`} className="btn bgr" style={{justifyContent:"center",fontSize:12}}><Ic n="wa" s={13}/> Enviar por WA<br/><span style={{fontSize:10,opacity:.7}}>{maskPhone(found.phone)}</span></a>}
          {found.email&&<a href={`mailto:${found.email}?subject=Código de recuperación ANGELS&body=${encodeURIComponent(waText)}`} className="btn bbl" style={{justifyContent:"center",fontSize:12}}><Ic n="snd" s={13}/> Enviar por Email<br/><span style={{fontSize:10,opacity:.7}}>{maskEmail(found.email)}</span></a>}
        </div>
        <div style={{background:"var(--s2)",borderRadius:7,padding:"8px 12px",fontSize:11,color:"var(--mu2)",textAlign:"center"}}>
          Tu código: <strong style={{fontFamily:"monospace",fontSize:16,color:"var(--am)",letterSpacing:4}}>{generatedPin}</strong>
          <div style={{fontSize:10,marginTop:2}}>Enviá el código a vos mismo por WA o email, luego ingrésalo abajo.</div>
        </div>
        <div className="fp"><label>Ingresá el código de 6 dígitos</label><input value={pin} onChange={e=>setPin(e.target.value)} placeholder="000000" maxLength={6} style={{fontFamily:"monospace",fontSize:20,letterSpacing:4,textAlign:"center"}}/></div>
        {err&&<div style={{color:"var(--re)",fontSize:12}}>{err}</div>}
        <button className="btn bp" onClick={doVerify} style={{width:"100%",justifyContent:"center"}}><Ic n="chk" s={13}/> Verificar código</button>
        <button className="btn bg2" onClick={()=>{setStep("find");setFound(null);setPin("");}} style={{width:"100%",justifyContent:"center"}}>← Atrás</button>
      </>}

      {step==="reset"&&<>
        <div style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.3)",borderRadius:7,padding:"8px 12px",fontSize:12,color:"var(--gr)",fontWeight:600}}>
          ✅ Identidad verificada. Ingresá tu nueva contraseña.
        </div>
        <div className="fp"><label>Nueva contraseña (mín. 6 caracteres)</label><PwI value={newPw} onChange={e=>setNewPw(e.target.value)}/></div>
        <div className="fp"><label>Confirmar contraseña</label><PwI value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} placeholder="Repetir"/></div>
        {err&&<div style={{color:"var(--re)",fontSize:12}}>{err}</div>}
        <button className="btn bp" onClick={doReset} style={{width:"100%",justifyContent:"center"}}><Ic n="lock" s={13}/> Guardar nueva contraseña</button>
      </>}
    </div>
  );
}
// ── DRIVER PORTAL ──────────────────────────────────────────────────────────────
function DPortal({session,drivers,reservations,payments,onLogout,pR}){
  const[tab,setTab]=useState("trips");
  // Find driver: by id, by name, or by username match (most reliable)
  const normUser=n=>(n||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,".").replace(/[^a-z0-9.]/g,"").slice(0,20);
  // Primary: match by driverId stored in session
  // Fallback: match by username (normalized from driver name - most stable)
  // Extract driverId from session.id (u_auto_d_2 → d_2) as final fallback
  const idFromSesId=(session.id||"").replace("u_auto_","");
  const drv=drivers.find(d=>d.id===session.driverId)||
    drivers.find(d=>normUser(d.name)===session.username)||
    drivers.find(d=>d.id===idFromSesId);
  // DEBUG: show session info at top  
  if(!drv)return(
    <div style={{padding:40,color:"var(--mu)"}}>
      <div>Chofer no encontrado. Contactá administración.</div>
      <div style={{marginTop:12,fontSize:11,background:"rgba(255,0,0,.1)",padding:8,borderRadius:6,fontFamily:"monospace"}}>
        DEBUG — session.driverId: <strong>{session.driverId}</strong><br/>
        session.username: <strong>{session.username}</strong><br/>
        session.name: <strong>{session.name}</strong><br/>
        drivers count: <strong>{drivers.length}</strong><br/>
        First 3 driver ids: <strong>{drivers.slice(0,3).map(d=>d.id).join(', ')}</strong>
      </div>
    </div>
  );
  const mine=reservations.filter(r=>r.driverId===drv.id||(r.rejectedByIds||[]).includes(drv.id));
  const upcoming=mine.filter(r=>!FIN.includes(r.status)&&r.driverId===drv.id).sort((a,b)=>`${a.date}${a.time}`>`${b.date}${b.time}`?1:-1);
  const done=mine.filter(r=>FIN.includes(r.status)||(r.rejectedByIds||[]).includes(drv.id)).sort((a,b)=>a.date<b.date?1:-1);
  const myP=payments.filter(p=>p.driverId===drv.id);
  const b=dBal(drv,mine,payments);
  return(
    <div className="por">
      <div className="ph">
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <Av id={drv.id} text={drv.avatar} size={32} fs={11}/>
          <div><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:13}}>{drv.name}</div><div style={{fontSize:10.5,color:"var(--mu2)"}}>{drv.vehicleBrand} {drv.vehicleModel} · {drv.plate}</div></div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{fontFamily:"var(--fh)",fontWeight:800,color:"var(--ac)",fontSize:13}}>${n$(b)} <span style={{fontSize:9.5,color:"var(--mu)",fontWeight:400}}>saldo</span></div>
          <button className="btn bg2 sm" onClick={onLogout}><Ic n="out" s={11}/> Salir</button>
        </div>
      </div>
      <div className="pc">
        <div className="wcard">
          <div style={{fontSize:10.5,color:"var(--mu2)",textTransform:"uppercase",letterSpacing:".6px",marginBottom:4}}>Saldo a cobrar</div>
          <div className="wbal">${n$(b)}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:9,marginTop:12}}>
            {[["Próximos",upcoming.length,"var(--ac)"],["A cobrar",`$${n$(mine.filter(r=>PAY.includes(r.status)).reduce((s,r)=>s+(r.driverPrice||0),0))}`,"var(--am)"],["Pendientes",mine.filter(r=>!FIN.includes(r.status)).length-upcoming.length>=0?mine.filter(r=>!FIN.includes(r.status)).length-upcoming.length:0,"var(--bl)"],["Cobrado",`$${n$(myP.reduce((s,p)=>s+p.amount,0))}`,"var(--gr)"]].map(([k,v,c])=>(
              <div key={k}><div style={{fontSize:9,color:"var(--mu2)",marginBottom:2}}>{k}</div><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,color:c}}>{v}</div></div>
            ))}
          </div>
        </div>
        {(()=>{
          const offered3=mine.filter(r=>(r.offeredCount||0)>0||["assigned","confirmed","offered","completed","noshow","cancelled_pay"].includes(r.status)).length||mine.filter(r=>["assigned","confirmed","completed","noshow","cancelled_pay"].includes(r.status)).length;
          const accepted3=mine.filter(r=>["assigned","confirmed","completed","noshow","cancelled_pay"].includes(r.status)).length;
          const completed3=mine.filter(r=>r.status==="completed").length;
          const noshow3=mine.filter(r=>r.status==="noshow").length;
          const rejected3=mine.filter(r=>(r.rejectedByIds||[]).includes(drv.id)).length;
          const accRate3=offered3>0?Math.round(accepted3/offered3*100):100;
          const nsRate3=(completed3+noshow3)>0?Math.round(noshow3/(completed3+noshow3)*100):0;
          const nsColor3=nsRate3>3?"var(--re)":nsRate3>=2?"var(--am)":"var(--gr)";
          const accColor3=accRate3>=95?"var(--gr)":accRate3>=80?"var(--am)":"var(--re)";
          const nsEmoji3=nsRate3>3?"🔴":nsRate3>=2?"🟡":"🟢";
          const accEmoji3=accRate3>=95?"🟢":accRate3>=80?"🟡":"🔴";
          return(<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,padding:"10px 14px",background:"var(--s2)",borderBottom:"1px solid var(--b1)"}}>
            {[[offered3,"Ofrecidos","var(--mu2)","",""],[accepted3,"Aceptados",accColor3,accEmoji3,`${accRate3}%`],[completed3,"Completados","var(--gr)","✅",""],[noshow3,"No Show",nsColor3,nsEmoji3,`${nsRate3}%`],[rejected3,"Rechazados","var(--re)","❌",""]].map(([v,label,color,emoji,rate],ki)=>(
              <div key={ki} style={{textAlign:"center",padding:"6px 4px",background:"var(--s1)",borderRadius:8,border:`1px solid ${color==="var(--mu2)"?"var(--b1)":color+"44"}`}}>
                <div style={{fontSize:16,fontWeight:800,fontFamily:"var(--fh)",color}}>{emoji} {v}</div>
                {rate&&<div style={{fontSize:10,fontWeight:700,color,marginTop:1}}>{rate}</div>}
                <div style={{fontSize:9,color:"var(--mu)",marginTop:2}}>{label}</div>
              </div>
            ))}
          </div>);
        })()}
        <div className="tabs">
          {[["trips",`Viajes (${upcoming.length})`],["done",`Historial (${done.length})`],["wallet","Billetera"],["profile","Mi perfil"]].map(([id,l])=>(
            <button key={id} className={`tab${tab===id?" on":""}`} onClick={()=>setTab(id)}>{l}</button>
          ))}
        </div>
        {tab==="trips"&&<div style={{display:"flex",flexDirection:"column",gap:9}}>
          {(()=>{
            const now2=Date.now();
            const pendResp=upcoming.filter(r=>r.status==="offered"&&r.offeredAt&&(now2-new Date(r.offeredAt).getTime())>2*60*60*1000);
            const pendResol=upcoming.filter(r=>r.status==="confirmed"&&r.date<TD);
            if(!pendResp.length&&!pendResol.length)return null;
            return(<div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:4}}>
              {pendResp.map(r=><div key={r.id+"pr"} style={{background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.4)",borderRadius:8,padding:"9px 12px",fontSize:12,color:"var(--re)",fontWeight:600}}>⏰ <strong>{r.code}</strong> — Sin respuesta hace más de 2 horas.</div>)}
              {pendResol.map(r=><div key={r.id+"rs"} style={{background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.4)",borderRadius:8,padding:"9px 12px",fontSize:12,color:"var(--re)",fontWeight:600}}>🔴 <strong>{r.code}</strong> — Viaje del {fD(r.date)} sin estado final.</div>)}
            </div>);
          })()}{upcoming.length===0&&<div className="empty">🚗 Sin viajes próximos</div>}{upcoming.map(r=><TCard key={r.id} res={r} drv={drv} onStatusChange={async(id,st,photos)=>{const now=new Date().toISOString();const updated=reservations.map(x=>x.id===id?{...x,status:st,noShowPhotos:photos||null,statusAt:now,statusBy:drv.name}:x);await pR(updated);}}/>)}</div>}
        {tab==="done"&&<div style={{display:"flex",flexDirection:"column",gap:9}}>{done.length===0&&<div className="empty">📋 Sin historial</div>}{done.map(r=><TCard key={r.id} res={r} drv={drv} done/>)}</div>}
        {tab==="wallet"&&<PWallet drv={drv} pmts={myP} trips={mine.filter(r=>r.driverId===drv.id)} b={b}/>}
        {tab==="profile"&&<PProfile drv={drv}/>}
      </div>
    </div>
  );
}
function TCard({res,drv,done,onStatusChange}){
  const[open,setOpen]=useState(false);
  const[showActions,setShowActions]=useState(false);
  const[showNoShow,setShowNoShow]=useState(false);
  const urg=!done&&hrs(res.date,res.time)<24&&hrs(res.date,res.time)>0;
  // Show "Marcar estado" only for confirmed/assigned trips that are in the past or happening now
  const canMark=!done&&(res.status==="confirmed"||res.status==="assigned");
  return(
    <>
    <div style={{background:"var(--s1)",border:`1px solid ${urg?"rgba(239,68,68,.4)":"var(--b1)"}`,borderRadius:"var(--rl)",overflow:"hidden"}}>
      <div style={{padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:9}} onClick={()=>setOpen(o=>!o)}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2}}><span className="chip">{res.code}</span><Bdg status={res.status}/>{urg&&<span style={{fontSize:9,color:"var(--re)",fontWeight:700}}>⚡&lt;24H</span>}</div>
          <div style={{fontWeight:600,fontSize:13}}>{res.passengerName} · {res.pax} pax</div>
          <div style={{fontSize:11,color:"var(--mu2)",marginTop:2}}>{fD(res.date)} · {res.time}hs</div>
        </div>
        <div style={{fontFamily:"var(--fh)",fontWeight:800,color:"var(--gr)",fontSize:13}}>${n$(res.driverPrice)}</div>
        <span style={{color:"var(--mu)",fontSize:10}}>{open?"▲":"▼"}</span>
      </div>
      {open&&<div style={{padding:"0 13px 13px",borderTop:"1px solid var(--b1)"}}>
        <div style={{marginTop:9}}>
          {/* Partial info until confirmed */}
          {(res.rejectedByIds||[]).includes(drv?.id)&&res.driverId!==drv?.id&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:7,padding:"8px 11px",fontSize:11.5,color:"var(--re)",marginBottom:8}}>❌ Rechazaste este viaje. La información del pasajero no está disponible.</div>}
          {res.status==="offered"&&<div style={{background:"rgba(139,92,246,.12)",border:"1px solid rgba(139,92,246,.35)",borderRadius:7,padding:"10px 12px",fontSize:12,color:"#a78bfa",marginBottom:8,fontWeight:600}}>📨 Viaje ofrecido — ¿Podés tomarlo?</div>}
          {res.status==="assigned"&&<div style={{background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.3)",borderRadius:7,padding:"8px 11px",fontSize:11.5,color:"var(--am)",marginBottom:8}}><strong>✋ Viaje aceptado</strong> — Los datos del pasajero se revelan cuando confirmás el viaje.</div>}
          <DR k="Fecha" v={`${fD(res.date)} · ${res.time}hs`}/>
          <DR k="Origen" v={<div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"flex-end"}}><span>{res.origin}</span><a href={waze(res.origin)} target="_blank" rel="noreferrer" className="btn bg2 sm" style={{fontSize:9.5,padding:"2px 6px"}}>Waze</a></div>}/>
          <DR k="Destino" v={<div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"flex-end"}}><span>{res.destination}</span><a href={waze(res.destination)} target="_blank" rel="noreferrer" className="btn bg2 sm" style={{fontSize:9.5,padding:"2px 6px"}}>Waze</a></div>}/>
          <DR k="Vehículo" v={<VB type={(res.vehicleType||"SEDAN").toUpperCase()}/>}/>
          <DR k="Pax" v={`${res.pax}`}/>
          {res.isArrival&&res.flightNumber&&<DR k="Vuelo" v={<div style={{display:"flex",gap:6,alignItems:"center"}}>✈️ {res.flightNumber}</div>}/>}
          {/* Full info only when confirmed or further */}
          {res.status!=="assigned"&&!(res.rejectedByIds||[]).includes(drv?.id)&&<>
            <DR k="Pasajero" v={res.passengerName}/>
            <DR k="Tel" v={<a href={`tel:${res.passengerPhone}`} style={{color:"var(--ac)"}}>{res.passengerPhone}</a>}/>
            <DR k="Cód. reserva" v={<span className="chip">{res.providerCode}</span>}/>
            {res.isArrival&&res.flightNumber&&<DR k="Estado vuelo" v={<a href={flL(res.flightNumber)} target="_blank" rel="noreferrer" className="btn bbl sm" style={{fontSize:9.5,padding:"2px 6px"}}>Ver en Flightradar</a>}/>}
            {res.driverLink&&<DR k="Driver Link" v={<a href={res.driverLink} target="_blank" rel="noreferrer" style={{color:"var(--ac)"}}>Abrir</a>}/>}
            {res.notes&&<DR k="Notas" v={res.notes}/>}
          </>}
          {res.status==="noshow"&&res.noShowPhotos&&<div style={{marginTop:10}}>
            <div style={{fontSize:10.5,color:"var(--mu2)",marginBottom:6,fontWeight:600}}>EVIDENCIA NO SHOW</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {res.noShowPhotos.map((p,i)=>p&&<div key={i}><img src={p.data} alt={p.label} style={{width:"100%",borderRadius:6,border:"1px solid var(--b1)"}}/><div style={{fontSize:10,color:"var(--mu2)",marginTop:2,textAlign:"center"}}>{p.label}</div></div>)}
            </div>
          </div>}
        </div>
        <div style={{marginTop:11,display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
          {!(res.rejectedByIds||[]).includes(drv?.id)&&<a href={wa(res.passengerPhone,`Hola ${res.passengerName}, soy ${drv.name}. Traslado ${res.code} - ${fD(res.date)} ${res.time}hs`)} className="btn bgr sm"><Ic n="wa" s={11}/> Contactar</a>}
          {res.status==="offered"&&<><button className="btn bp sm" style={{fontSize:12,padding:"6px 14px"}} onClick={e=>{e.stopPropagation();onStatusChange(res.id,"assigned",null);}}>✅ Aceptar viaje</button><button className="btn bre sm" style={{fontSize:12,padding:"6px 14px"}} onClick={e=>{e.stopPropagation();onStatusChange(res.id,"rejected",null);}}>❌ Rechazar</button></>}
          {res.status==="assigned"&&<button className="btn bp sm" onClick={e=>{e.stopPropagation();onStatusChange(res.id,"confirmed",null);}}>✅ Confirmar viaje</button>}
          {canMark&&res.status==="confirmed"&&!showActions&&<button className="btn bam sm" onClick={e=>{e.stopPropagation();setShowActions(true);}}><Ic n="chart" s={11}/> Marcar estado</button>}
          {canMark&&showActions&&<>
            <button className="btn bgr sm" onClick={()=>{onStatusChange(res.id,"completed",null);setShowActions(false);setTimeout(()=>{const msg=mReview(drv,res);window.open(`whatsapp://send?phone=${(res.passengerPhone||"").replace(/\D/g,"")}&text=${encodeURIComponent(msg)}`,'_blank');},800);}}>✅ Completado</button>
            <button className="btn bpk sm" onClick={()=>{setShowNoShow(true);setShowActions(false);}}>👻 No Show</button>
            <button className="btn bg2 sm" onClick={()=>setShowActions(false)}><Ic n="X" s={10}/></button>
          </>}
        </div>
      </div>}
    </div>
    {showNoShow&&<NoShowModal res={res} onClose={()=>setShowNoShow(false)} onConfirm={(photos)=>{onStatusChange(res.id,"noshow",photos);setShowNoShow(false);}}/>}
    </>
  );
}

function NoShowModal({res,onClose,onConfirm}){
  const PHOTO_SLOTS=[
    {key:"calls",label:"Capturas de llamadas/mensajes durante la espera",hint:"Screenshot de llamadas realizadas, mensajes o WhatsApp"},
    {key:"geo",label:"Foto de geolocalización en el lugar de recogida",hint:"Con fecha y hora visible, a tiempo con llegada del vuelo u hora de reserva"},
    {key:"sign",label:"Foto del cartel con nombre del pasajero",hint:"Idealmente frente al monitor de llegadas o frente del domicilio al vencer el tiempo de espera"},
    {key:"extra",label:"Foto adicional de evidencia",hint:"Cualquier otra evidencia relevante del No Show"},
  ];
  const[photos,setPhotos]=useState({calls:null,geo:null,sign:null,extra:null});
  const[step,setStep]=useState("confirm"); // confirm | upload | done
  const[uploading,setUploading]=useState(false);
  const allRequired=photos.calls&&photos.geo&&photos.sign&&photos.extra;
  const uploadPhoto=(key,file)=>{
    if(!file)return;
    const reader=new FileReader();
    reader.onload=e=>setPhotos(p=>({...p,[key]:{data:e.target.result,label:PHOTO_SLOTS.find(s=>s.key===key)?.label||key,name:file.name}}));
    reader.readAsDataURL(file);
  };
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mc">
        {step==="confirm"&&<>
          <div className="mh">
            <div>
              <div className="mt">Registrar No Show</div>
              <div style={{fontSize:11.5,color:"var(--mu2)",marginTop:2}}><span className="chip">{res.code}</span> · {res.passengerName}</div>
            </div>
            <button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button>
          </div>
          <div className="mb">
            <div style={{background:"rgba(236,72,153,.1)",border:"1px solid rgba(236,72,153,.3)",borderRadius:"var(--r)",padding:"14px 16px",marginBottom:14}}>
              <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14,color:"var(--pk)",marginBottom:6}}>👻 El pasajero no se presentó</div>
              <div style={{fontSize:12.5,color:"var(--mu2)",lineHeight:1.7}}>
                Para registrar el No Show necesitás subir <strong style={{color:"var(--tx)"}}>4 fotos de evidencia</strong> que documenten la espera y la ausencia del pasajero.
              </div>
            </div>
            <div style={{fontSize:12.5,color:"var(--mu2)",lineHeight:2}}>
              {PHOTO_SLOTS.map((s,i)=><div key={s.key} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{background:"var(--s2)",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"var(--pk)",flexShrink:0,marginTop:2}}>{i+1}</span>
                <div><div style={{fontSize:12.5,color:"var(--tx)",fontWeight:500}}>{s.hint}</div></div>
              </div>)}
            </div>
          </div>
          <div className="mf">
            <button className="btn bg2" onClick={onClose}>Cancelar</button>
            <button className="btn bpk" onClick={()=>setStep("upload")}><Ic n="up" s={12}/> Continuar y subir fotos</button>
          </div>
        </>}
        {step==="upload"&&<>
          <div className="mh">
            <div>
              <div className="mt">Subir evidencia — No Show</div>
              <div style={{fontSize:11,color:"var(--mu2)",marginTop:2}}>Las 4 fotos son obligatorias</div>
            </div>
            <button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button>
          </div>
          <div className="mb">
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {PHOTO_SLOTS.map((slot,i)=>(
                <div key={slot.key} style={{background:"var(--s2)",borderRadius:"var(--r)",padding:12}}>
                  <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                    <span style={{background:photos[slot.key]?"var(--gr)":"var(--pk)",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",flexShrink:0}}>{photos[slot.key]?"✓":i+1}</span>
                    <div>
                      <div style={{fontSize:12.5,fontWeight:600,color:"var(--tx)"}}>{slot.label}</div>
                      <div style={{fontSize:11,color:"var(--mu2)",marginTop:2}}>{slot.hint}</div>
                    </div>
                  </div>
                  {photos[slot.key]?(
                    <div style={{position:"relative"}}>
                      <img src={photos[slot.key].data} alt={slot.label} style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:7,border:"1px solid rgba(16,185,129,.3)"}}/>
                      <button className="btn bre sm" style={{position:"absolute",top:5,right:5,padding:"3px 7px",fontSize:10}} onClick={()=>setPhotos(p=>({...p,[slot.key]:null}))}>Cambiar</button>
                    </div>
                  ):(
                    <label style={{display:"flex",alignItems:"center",gap:8,background:"var(--bg)",border:"2px dashed rgba(236,72,153,.4)",borderRadius:8,padding:"10px 14px",cursor:"pointer",color:"var(--pk)",fontSize:12.5,fontWeight:500}}>
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>uploadPhoto(slot.key,e.target.files[0])}/>
                      <Ic n="up" s={14}/> Seleccionar foto
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mf">
            <button className="btn bg2" onClick={()=>setStep("confirm")}>← Atrás</button>
            <button className="btn bpk" disabled={!allRequired} onClick={()=>{setUploading(true);onConfirm(Object.values(photos));setUploading(false);}}>
              {uploading?<div className="spin" style={{width:13,height:13,borderWidth:2}}/>:<><Ic n="chk" s={12}/> Confirmar No Show</>}
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}
function PWallet({drv,pmts,trips,b}){
  const[from,setFrom]=useState(TD);const[to,setTo]=useState(TD);
  const ft=trips.filter(r=>r.date>=from&&r.date<=to);;
  const summ=mReport(drv,ft,from,to);
  const[showS,setShowS]=useState(false);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
        {[["Saldo",`$${n$(b)}`,"var(--ac)"],["A cobrar",`$${n$(trips.filter(r=>PAY.includes(r.status)).reduce((s,r)=>s+(r.driverPrice||0),0))}`,"var(--am)"],["Pendientes",trips.filter(r=>!FIN.includes(r.status)).length,"var(--bl)"],["Cobrado",`$${n$(pmts.reduce((s,p)=>s+p.amount,0))}`,"var(--gr)"]].map(([k,v,c])=>(
          <div key={k} style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"11px 13px"}}><div style={{fontSize:10,color:"var(--mu2)",marginBottom:3}}>{k}</div><div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:16,color:c}}>{v}</div></div>
        ))}
      </div>
      <div style={{background:"var(--s2)",borderRadius:"var(--r)",padding:11,marginBottom:13}}>
        <div style={{fontSize:10.5,color:"var(--mu2)",marginBottom:7,fontWeight:600}}>RESUMEN DE SERVICIOS</div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div className="fp"><label>Desde</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={{fontSize:12}}/></div>
          <div className="fp"><label>Hasta</label><input type="date" value={to} onChange={e=>setTo(e.target.value)} style={{fontSize:12}}/></div>
          <button className="btn bbl sm" style={{marginBottom:1}} onClick={()=>setShowS(s=>!s)}><Ic n="rpt" s={11}/> {showS?"Ocultar":"Ver resumen"}</button>
        </div>
        {showS&&<div style={{marginTop:9}}>
          <div className="sbox">{summ}</div>
          <div style={{display:"flex",gap:6,marginTop:7}}>
            <a href={wa(drv.phone,summ)} className="btn bgr sm"><Ic n="wa" s={11}/> Enviar WA</a>
            <button className="btn bg2 sm" onClick={()=>navigator.clipboard?.writeText(summ)}><Ic n="cpy" s={11}/> Copiar</button>
            {drv.email&&<a href={`mailto:${drv.email}?subject=Resumen servicios&body=${encodeURIComponent(summ)}`} className="btn bbl sm"><Ic n="snd" s={11}/> Email</a>}
          </div>
        </div>}
      </div>
      <div style={{background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",overflow:"hidden"}}>
        {[...trips.map(r=>({type:"t",date:r.date,label:`${r.code} · ${r.passengerName}`,sub:SM[r.status]?.l,amt:r.driverPrice||0,pos:false})),...pmts.map(p=>({type:"p",date:p.date,label:p.note||"Pago",sub:"",amt:p.amount,pos:true}))].sort((a,b)=>a.date<b.date?1:-1).map((m,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderBottom:"1px solid var(--b1)"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:m.pos?"rgba(16,185,129,.15)":"rgba(0,212,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",color:m.pos?"var(--gr)":"var(--ac)",flexShrink:0,fontSize:10}}>{m.pos?"$":"🚗"}</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{m.label}</div>{m.sub&&<div style={{fontSize:10,color:"var(--mu2)"}}>{fD(m.date)} · {m.sub}</div>}</div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,color:m.pos?"var(--gr)":"var(--am)",fontSize:12}}>{m.pos?"+":""}${n$(m.amt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function PProfile({drv}){const ls=licS(drv);return(
  <div>
    <div style={{display:"flex",gap:13,alignItems:"center",background:"var(--s2)",borderRadius:"var(--rl)",padding:16,marginBottom:16}}>
      <Av id={drv.id} text={drv.avatar} size={46} fs={15}/>
      <div><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:15}}>{drv.name}</div><div style={{color:"var(--mu2)",fontSize:12}}>{drv.vehicleBrand} {drv.vehicleModel} · {drv.plate}</div></div>
    </div>
    {[["Email",drv.email||"—"],["Teléfono",drv.phone],["Vehículo",<VB type={(drv.vehicleType||"SEDAN").toUpperCase()}/>],["GNC",drv.gnc?"✅":"❌"],["Licencia",<span style={{color:ls.c,fontWeight:700}}>{ls.l}</span>],["CBU/CVU",drv.cbu||"—"],["Alias",drv.alias||"—"]].map(([k,v])=><DR key={k} k={k} v={v}/>)}
  </div>
);}
// ── ADMIN APP ──────────────────────────────────────────────────────────────────
function Admin({session,drivers,reservations,payments,users,routePrices,providers,provPayments,pR,pD,pP,pU,pRT,pPV,pPP,onLogout,toast}){
  const role=session.role;
  const[page,setPage]=useState("res");
  const[mNR,setMNR]=useState(false);const[mND,setMND]=useState(false);
  const[mDet,setMDet]=useState(null);const[mAss,setMAss]=useState(null);const[mReA,setMReA]=useState(null);
  const[mWA,setMWA]=useState(null);const[mWal,setMWal]=useState(null);const[mDD,setMDD]=useState(null);
  const[mRpt,setMRpt]=useState(null);const[mSum,setMSum]=useState(null);
  const[fd,setFd]=useState("");const[fd2,setFd2]=useState("");const[fst,setFst]=useState("");
  const[fc,setFc]=useState("");const[fco,setFco]=useState("");const[fn,setFn]=useState("");
  const[fv,setFv]=useState("");const[fdr,setFdr]=useState("");
  const[fOri,setFOri]=useState([]);
  const[fDst,setFDst]=useState([]);
  const[srt,setSrt]=useState("date");
  const[srtDir,setSrtDir]=useState(1);
  const dups=getDups(reservations);
  const gd=id=>drivers.find(d=>d.id===id);
  const gpv=id=>providers.find(p=>p.id===id);
  const urg=reservations.filter(isUrg);
  const dAlerts=drivers.flatMap(d=>{const a=[];if(d.licenseExpiry){const days=Math.round((new Date(d.licenseExpiry)-new Date())/864e5);if(days>=0&&days<=5)a.push({drv:d,doc:"Licencia",days});}return a;});
  const filtered=reservations.filter(r=>{
    if(fd&&r.date<fd)return false;if(fd2&&r.date>fd2)return false;
    if(fst&&r.status!==fst)return false;if(fc){const fcPv=(providers||[]).find(p=>p.code===fc);if(fcPv&&r.company!==fcPv.name)return false;else if(!fcPv&&!r.company?.toLowerCase().includes(fc.toLowerCase()))return false;}
    if(fco&&!r.code?.toLowerCase().includes(fco.toLowerCase())&&!r.providerCode?.toLowerCase().includes(fco.toLowerCase()))return false;
    if(fn&&!r.passengerName?.toLowerCase().includes(fn.toLowerCase()))return false;
    if(fv&&r.vehicleType!==fv)return false;
    if(fdr){if(fdr==="__no__"&&r.driverId)return false;else if(fdr!=="__no__"&&r.driverId!==fdr)return false;}
    if(fOri.length>0){
      const matchLoc=(loc,q)=>{
        const ql=q.toLowerCase().trim();
        const ll=(loc||"").toLowerCase();
        // Short alias matching: AEP, EZE, CABA, CLX, BQB, PQM
        const aliases={aep:["aep","aeroparque","newbery"],eze:["eze","ezeiza","pistarini"],
          caba:["caba","buenos aires","autónoma","autonoma"],
          clx:["clx","colonia express"],bqb:["bqb","buque bus"],pqm:["pqm","quinquela"]};
        for(const[key,terms] of Object.entries(aliases)){
          if(ql===key)return terms.some(t=>ll.includes(t));
        }
        return ll.includes(ql);
      };
      if(!fOri.some(o=>matchLoc(r.origin,o)))return false;
    }
    if(fDst.length>0){
      const matchLoc2=(loc,q)=>{
        const ql=q.toLowerCase().trim();const ll=(loc||"").toLowerCase();
        const aliases={aep:["aep","aeroparque","newbery"],eze:["eze","ezeiza","pistarini"],
          caba:["caba","buenos aires","autónoma","autonoma"],
          clx:["clx","colonia express"],bqb:["bqb","buque bus"],pqm:["pqm","quinquela"]};
        for(const[key,terms] of Object.entries(aliases)){
          if(ql===key)return terms.some(t=>ll.includes(t));
        }
        return ll.includes(ql);
      };
      if(!fDst.some(d=>matchLoc2(r.destination,d)))return false;
    }
    return true;
  });
  const sorted=[...filtered].sort((a,b)=>{
    let r=0;
    if(srt==="date")r=(a.date+a.time).localeCompare(b.date+b.time);
    else if(srt==="driver"){
      const da=drivers.find(d=>d.id===a.driverId)?.name||"zzz";
      const db=drivers.find(d=>d.id===b.driverId)?.name||"zzz";
      r=da.localeCompare(db);
    }else r=(a[srt]||"").localeCompare(b[srt]||"");
    return r*srtDir;
  });
  const recalc=async(nr,np)=>{const rr=nr||reservations,pp=np||payments;const upd=drivers.map(d=>{const e=rr.filter(r=>r.driverId===d.id&&PAY.includes(r.status)).reduce((s,r)=>s+(r.driverPrice||0),0);const p=pp.filter(p=>p.driverId===d.id).reduce((s,p)=>s+p.amount,0);return{...d,walletBalance:e-p};});await pD(upd);};
  const doAss=async(rid,did,force=false)=>{
    const drv=gd(did);
    const res=reservations.find(r=>r.id===rid);
    // Check 30-min conflict unless SPRINTER
    if(!force&&(res?.vehicleType||"SEDAN").toUpperCase()!=="SPRINTER"){
      const resTs=new Date(`${res.date}T${res.time}:00`).getTime();
      const conflict=reservations.find(r=>
        r.id!==rid&&r.driverId===did&&!FIN.includes(r.status)&&
        Math.abs(new Date(`${r.date}T${r.time}:00`).getTime()-resTs)<30*60*1000
      );
      if(conflict){
        const ok=window.confirm(`⚠️ CONFLICTO DE HORARIO\n\n${drv.name} ya tiene el servicio ${conflict.code} el ${fD(conflict.date)} a las ${conflict.time}hs, a menos de 30 minutos de diferencia.\n\n¿Querés asignar igual?`);
        if(!ok)return;
      }
    }
    const now=new Date().toISOString();
    const prev=reservations.find(r=>r.id===rid);
    const offCount=(prev?.offeredCount||0)+1;
    const list=reservations.map(r=>r.id===rid?{...r,driverId:did,status:"offered",assignedAt:now,assignedBy:session.username||session.name||"admin",offeredAt:now,offeredCount:offCount,rejectedCount:r.rejectedCount||0}:r);
    await pR(list);setMAss(null);setMReA(null);setMWA({res:list.find(r=>r.id===rid),drv,mode:"alert"});toast(`Viaje ofrecido a ${drv.name} 📨`);
  };
  const doCnf=async rid=>{const now=new Date().toISOString();const list=reservations.map(r=>r.id===rid?{...r,status:"confirmed",confirmedAt:now,confirmedBy:session.username||session.name||"admin"}:r);await pR(list);const res=list.find(r=>r.id===rid);setMDet(null);setMWA({res,drv:gd(res.driverId),mode:"drv"});toast("Confirmado ✅");};
  const doSt=async(rid,st)=>{
    const now=new Date().toISOString();
    const res=reservations.find(r=>r.id===rid);
    const list=reservations.map(r=>r.id===rid?{...r,status:st,statusAt:now,statusBy:session.username||session.name||"admin"}:r);
    await pR(list);await recalc(list,null);setMDet(null);
    // If cancellation and driver assigned → show WA alert
    if((st==="cancelled_nopay"||st==="cancelled_pay")&&res?.driverId){
      const drv=gd(res.driverId);
      if(drv){
        const msg=`⚠️ SERVICIO CANCELADO

Codigo: ${res.code}
Pasajero: ${res.passengerName}
Fecha: ${fD(res.date)} ${res.time}hs
Origen: ${res.origin}
Destino: ${res.destination}

Este servicio fue cancelado. Ya no debés presentarte.
Gracias!`;
        setMWA({res:{...res,status:st},drv,mode:"cancel_notif",cancelMsg:msg});
      }
    }
    toast({completed:"Completado ✅",cancelled_nopay:"Cancel. sin pago",cancelled_pay:"Cancel. con pago",noshow:"No Show"}[st]||st);
  };
  const doDel=async rid=>{const res=reservations.find(r=>r.id===rid);if(res&&FIN.includes(res.status)){toast("No se puede eliminar un servicio finalizado","⚠️");return;}await pR(reservations.filter(r=>r.id!==rid));setMDet(null);toast("Eliminado","🗑️");};
  const doPay=async(did,amt,note)=>{const pmt={id:"p"+Date.now(),driverId:did,amount:parseFloat(amt),note,date:TD};const np=[...payments,pmt];await pP(np);await recalc(null,np);toast("Pago acreditado ✅");};
  const doEPay=async(pid,amt,note,did)=>{const np=payments.map(p=>p.id===pid?{...p,amount:parseFloat(amt),note}:p);await pP(np);await recalc(null,np);toast("Pago actualizado ✅");};

  const navItems=[
    {id:"res",n:"cal",l:"Reservas",b:urg.length,roles:["admin","colaborador"]},
    {id:"drv",n:"car",l:"Choferes",roles:["admin","colaborador"]},
    {id:"bil",n:"wal",l:"Billetera",roles:["admin"]},
    {id:"rut",n:"map",l:"Tarifas",roles:["admin","colaborador"]},
    {id:"pvd",n:"bldg",l:"Proveedores",roles:["admin"]},
    {id:"imp",n:"file",l:"Importar",roles:["admin","colaborador"]},
    {id:"usr",n:"shld",l:"Usuarios",roles:["admin"]},
  ];
  const pageTitle={res:"Reservas",drv:"Choferes",bil:"Billetera",rut:"Tarifas de Rutas",pvd:"Proveedores",imp:"Importar Reservas",usr:"Usuarios"};
  return(
    <div className="app">
      <aside className="sb">
        <div className="logo">ANGELS<br/><span>TRANSFERS</span><small>{role==="admin"?"ADMINISTRADOR":role==="colaborador"?"COLABORADOR":"—"}</small></div>
        {navItems.filter(x=>x.roles.includes(role)).map(x=>(
          <button key={x.id} className={`ni${page===x.id?" on":""}`} onClick={()=>setPage(x.id)}><Ic n={x.n} s={13}/>{x.l}{x.b>0&&<div className="nd"/>}</button>
        ))}
        <div className="dv"/>
        {role==="admin"&&<button className="ni" onClick={()=>setMRpt({})}><Ic n="rpt" s={13}/> Reportes WA</button>}
        <button className="ni" onClick={onLogout}><Ic n="out" s={13}/> Salir</button>
      </aside>
      <div className="mn">
        <div className="tb">
          <div className="tt">{pageTitle[page]}</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:11,color:"var(--mu2)"}}>{session.username}</span>
            {page==="res"&&<button className="btn bp" onClick={()=>setMNR(true)}><Ic n="plus" s={12}/> Nueva</button>}
            {page==="drv"&&role!=="driver"&&<button className="btn bp" onClick={()=>setMND(true)}><Ic n="plus" s={12}/> Nuevo</button>}
          </div>
        </div>
        <div className="cnt">
          {page==="res"&&<ResPage reservations={reservations} drivers={drivers} filtered={sorted} urg={urg} dAlerts={dAlerts} fd={fd} setFd={setFd} fd2={fd2} setFd2={setFd2} fst={fst} setFst={setFst} fc={fc} setFc={setFc} fco={fco} setFco={setFco} fn={fn} setFn={setFn} fv={fv} setFv={setFv} fdr={fdr} setFdr={setFdr} fOri={fOri} setFOri={setFOri} fDst={fDst} setFDst={setFDst} srt={srt} setSrt={setSrt} srtDir={srtDir} setSrtDir={setSrtDir} dups={dups} providers={providers} onDet={setMDet} onAss={setMAss} onReA={setMReA} onWA={setMWA}/>}
          {page==="drv"&&<DrvPage drivers={drivers} reservations={reservations} payments={payments} pD={pD} mND={mND} setMND={setMND} toast={toast} onWal={d=>setMWal(d)} onDet={d=>setMDD(d)} onSum={d=>setMSum(d)} role={role} users={users} pU={pU}/>}
          {page==="bil"&&role==="admin"&&<BilPage drivers={drivers} reservations={reservations} payments={payments} onPay={doPay} onEPay={doEPay} toast={toast}/>}
          {page==="rut"&&<RutPage routePrices={routePrices} pRT={pRT} toast={toast} role={role}/>}
          {page==="pvd"&&role==="admin"&&<PvdPage providers={providers} provPayments={provPayments} reservations={reservations} pPV={pPV} pPP={pPP} pR={pR} toast={toast} role={role}/>}
          {page==="imp"&&<ImpPage reservations={reservations} pR={pR} toast={toast} routePrices={routePrices} providers={providers}/>}
          {page==="usr"&&role==="admin"&&<UsrPage users={users} drivers={drivers} pU={pU} toast={toast}/>}
        </div>
      </div>
      {mDet&&<DetModal res={mDet} drv={gd(mDet.driverId)} rt={routePrices} role={role} onClose={()=>setMDet(null)} onCnf={doCnf} onSt={doSt} onDel={doDel} onAss={()=>{setMDet(null);setMAss(mDet);}} onReA={()=>{setMDet(null);setMReA(mDet);}} onSv={async u=>{
        const prev=reservations.find(r=>r.id===u.id);
        const list=reservations.map(r=>r.id===u.id?u:r);
        await pR(list);await recalc(list,null);setMDet(u);toast("Guardado");
        // Notify driver if key fields changed
        if(prev&&u.driverId){
          const changed=[];
          if(prev.date!==u.date)changed.push(`📅 Fecha: ${fD(prev.date)} → ${fD(u.date)}`);
          if(prev.time!==u.time)changed.push(`🕐 Hora: ${prev.time} → ${u.time}hs`);
          if(prev.origin!==u.origin)changed.push(`📍 Origen: ${prev.origin} → ${u.origin}`);
          if(prev.destination!==u.destination)changed.push(`🏁 Destino: ${prev.destination} → ${u.destination}`);
          if(changed.length>0){const drv=gd(u.driverId);if(drv){const msg=`⚠️ CAMBIO EN RESERVA\n\nCódigo: ${u.code}\nPasajero: ${u.passengerName}\n\nCAMBIOS:\n${changed.join("\n")}\n\nFecha actual: ${fD(u.date)} ${u.time}hs\nOrigen: ${u.origin}\nDestino: ${u.destination}`;setMWA({res:u,drv,mode:"alert",cancelMsg:msg});}}
        }
      }}/>}
      {(mAss||mReA)&&<AssModal res={mAss||mReA} drivers={drivers} onClose={()=>{setMAss(null);setMReA(null);}} onAss={doAss} isR={!!mReA}/>}
      {mWA&&<WAMod {...mWA} onClose={()=>setMWA(null)}/>}
      {mNR&&<NRMod onClose={()=>setMNR(false)} reservations={reservations} rt={routePrices} providers={providers} onSv={async r=>{await pR([...reservations,r]);setMNR(false);toast("Reserva creada ✅");}}/>}
      {mND&&<NDMod onClose={()=>setMND(false)} onSv={async(d,drvId)=>{await pD([...drivers,d]);const uname=d.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,".").replace(/[^a-z0-9.]/g,"");const newUser={id:"u_auto_"+drvId,role:"driver",username:uname,password:"ang2506",name:d.name,phone:d.phone,email:d.email,driverId:drvId};await pU([...users,newUser]);setMND(false);toast(`Chofer y usuario ${uname} creados ✅`);}}/>}
      {mWal&&<WalMod drv={mWal} pmts={payments.filter(p=>p.driverId===mWal.id)} trips={reservations.filter(r=>r.driverId===mWal.id)} onClose={()=>setMWal(null)} onAdd={doPay} onEd={doEPay}/>}
      {mDD&&<DDMod drv={mDD} onClose={()=>setMDD(null)} onSv={async d=>{const l=drivers.map(x=>x.id===d.id?d:x);await pD(l);setMDD(d);toast("Actualizado ✅");}} onDel={async id=>{await pD(drivers.filter(d=>d.id!==id));setMDD(null);toast("Eliminado","🗑️");}} role={role}/>}
      {mRpt&&<RptMod drivers={drivers} reservations={reservations} onClose={()=>setMRpt(null)}/>}
      {mSum&&<SumMod drv={mSum} trips={reservations.filter(r=>r.driverId===mSum.id)} pmts={payments.filter(p=>p.driverId===mSum.id)} onClose={()=>setMSum(null)}/>}
    </div>
  );
}
// ── RESERVATIONS PAGE ──────────────────────────────────────────────────────────
function ResPage({reservations,drivers,filtered,urg,dAlerts,fd,setFd,fd2,setFd2,fst,setFst,fc,setFc,fco,setFco,fn,setFn,fv,setFv,fdr,setFdr,fOri,setFOri,fDst,setFDst,srt,setSrt,srtDir,setSrtDir,dups,providers,onDet,onAss,onReA,onWA}){
  const gd=id=>drivers.find(d=>d.id===id);
  return(<>
    <div className="sts">
      {[["Hoy",reservations.filter(r=>r.date===TD&&r.status!=="cancelled_nopay").length,"var(--ac)","servicios"],["Pendientes",reservations.filter(r=>r.status==="pending").length,"var(--am)","sin chofer"],["Confirmados",reservations.filter(r=>r.status==="confirmed").length,"var(--gr)","activos"],["No Show",reservations.filter(r=>r.status==="noshow").length,"var(--pk)","total"]].map(([l,v,c,sub])=>(
        <div key={l} className="sc"><div className="sl">{l}</div><div className="sv" style={{color:c}}>{v}</div><div className="ssub">{sub}</div></div>
      ))}
    </div>
    {urg.length>0&&<div className="ab" onClick={()=>setFst("pending")}><Ic n="warn" s={14}/><strong>Atención!</strong> {urg.length} reserva{urg.length>1?"s":""} &lt;24hs SIN chofer.<span className="abd">{urg.length} URGENTE{urg.length>1?"S":""}</span></div>}
    {dAlerts.map((a,i)=><div key={i} className="da"><Ic n="bell" s={13}/><strong>{a.drv.name}</strong> — {a.doc} vence en {a.days} día{a.days===1?"":"s"}.<a href={wa(a.drv.phone,mDoc(a.drv,a.doc,a.days))} className="btn bam sm" style={{marginLeft:"auto",fontSize:10.5}}>Avisar</a></div>)}
    <div className="flt">
      <Ic n="filt" s={12}/>
      <input className="fi" type="date" value={fd} onChange={e=>setFd(e.target.value)} style={{width:115}} title="Desde"/>
      <input className="fi" type="date" value={fd2} onChange={e=>setFd2(e.target.value)} style={{width:115}} title="Hasta"/>
      <select className="fs" value={fst} onChange={e=>setFst(e.target.value)}><option value="">Estado</option>{Object.entries(SM).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select>
      <select className="fs" value={fv} onChange={e=>setFv(e.target.value)}><option value="">Vehículo</option>{VT.map(v=><option key={v}>{v}</option>)}</select>
      <select className="fs" value={fdr} onChange={e=>setFdr(e.target.value)} style={{maxWidth:140}}><option value="">Chofer</option><option value="__no__">Sin asignar</option>{drivers.map(d=><option key={d.id} value={d.id}>{d.name.split(" ").slice(0,2).join(" ")}</option>)}</select>
    </div>
    <div className="flt" style={{marginBottom:12}}>
      <input className="fi" placeholder="Código…" value={fco} onChange={e=>setFco(e.target.value)} style={{width:120}}/>
      <input className="fi" placeholder="Pasajero…" value={fn} onChange={e=>setFn(e.target.value)} style={{width:140}}/>
      <select className="fs" value={fc} onChange={e=>setFc(e.target.value)} style={{maxWidth:160}}>
        <option value="">Empresa</option>
        {(providers||[]).map(p=><option key={p.id} value={p.code}>{p.code} – {p.name}</option>)}
      </select>
    </div>
    <div className="flt" style={{marginBottom:6,gap:6,flexWrap:"wrap"}}>
      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
        <span style={{fontSize:10.5,color:"var(--mu)",minWidth:46,fontWeight:600}}>Origen:</span>
        <span key="AEP" onClick={()=>setFOri(p=>p.includes("AEP")?p.filter(x=>x!=="AEP"):[...p,"AEP"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fOri||[]).includes("AEP")?"var(--ac)":"var(--s2)",color:(fOri||[]).includes("AEP")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fOri||[]).includes("AEP")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>AEP</span>
        <span key="EZE" onClick={()=>setFOri(p=>p.includes("EZE")?p.filter(x=>x!=="EZE"):[...p,"EZE"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fOri||[]).includes("EZE")?"var(--ac)":"var(--s2)",color:(fOri||[]).includes("EZE")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fOri||[]).includes("EZE")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>EZE</span>
        <span key="CABA" onClick={()=>setFOri(p=>p.includes("CABA")?p.filter(x=>x!=="CABA"):[...p,"CABA"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fOri||[]).includes("CABA")?"var(--ac)":"var(--s2)",color:(fOri||[]).includes("CABA")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fOri||[]).includes("CABA")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>CABA</span>
        <span key="CLX" onClick={()=>setFOri(p=>p.includes("CLX")?p.filter(x=>x!=="CLX"):[...p,"CLX"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fOri||[]).includes("CLX")?"var(--ac)":"var(--s2)",color:(fOri||[]).includes("CLX")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fOri||[]).includes("CLX")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>CLX</span>
        <span key="BQB" onClick={()=>setFOri(p=>p.includes("BQB")?p.filter(x=>x!=="BQB"):[...p,"BQB"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fOri||[]).includes("BQB")?"var(--ac)":"var(--s2)",color:(fOri||[]).includes("BQB")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fOri||[]).includes("BQB")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>BQB</span>
        <span key="PQM" onClick={()=>setFOri(p=>p.includes("PQM")?p.filter(x=>x!=="PQM"):[...p,"PQM"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fOri||[]).includes("PQM")?"var(--ac)":"var(--s2)",color:(fOri||[]).includes("PQM")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fOri||[]).includes("PQM")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>PQM</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
        <span style={{fontSize:10.5,color:"var(--mu)",minWidth:46,fontWeight:600}}>Destino:</span>
        <span key="AEP" onClick={()=>setFDst(p=>p.includes("AEP")?p.filter(x=>x!=="AEP"):[...p,"AEP"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fDst||[]).includes("AEP")?"var(--ac)":"var(--s2)",color:(fDst||[]).includes("AEP")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fDst||[]).includes("AEP")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>AEP</span>
        <span key="EZE" onClick={()=>setFDst(p=>p.includes("EZE")?p.filter(x=>x!=="EZE"):[...p,"EZE"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fDst||[]).includes("EZE")?"var(--ac)":"var(--s2)",color:(fDst||[]).includes("EZE")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fDst||[]).includes("EZE")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>EZE</span>
        <span key="CABA" onClick={()=>setFDst(p=>p.includes("CABA")?p.filter(x=>x!=="CABA"):[...p,"CABA"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fDst||[]).includes("CABA")?"var(--ac)":"var(--s2)",color:(fDst||[]).includes("CABA")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fDst||[]).includes("CABA")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>CABA</span>
        <span key="CLX" onClick={()=>setFDst(p=>p.includes("CLX")?p.filter(x=>x!=="CLX"):[...p,"CLX"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fDst||[]).includes("CLX")?"var(--ac)":"var(--s2)",color:(fDst||[]).includes("CLX")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fDst||[]).includes("CLX")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>CLX</span>
        <span key="BQB" onClick={()=>setFDst(p=>p.includes("BQB")?p.filter(x=>x!=="BQB"):[...p,"BQB"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fDst||[]).includes("BQB")?"var(--ac)":"var(--s2)",color:(fDst||[]).includes("BQB")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fDst||[]).includes("BQB")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>BQB</span>
        <span key="PQM" onClick={()=>setFDst(p=>p.includes("PQM")?p.filter(x=>x!=="PQM"):[...p,"PQM"])} style={{cursor:"pointer",padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:(fDst||[]).includes("PQM")?"var(--ac)":"var(--s2)",color:(fDst||[]).includes("PQM")?"var(--bg)":"var(--mu2)",border:"1px solid "+((fDst||[]).includes("PQM")?"var(--ac)":"var(--b2)"),transition:"all .12s",userSelect:"none"}}>PQM</span>
      </div>
            {(fd||fd2||fst||fc||fco||fn||fv||fdr||fOri?.length||fDst?.length)&&<button className="btn bg2 sm" onClick={()=>{setFd("");setFd2("");setFst("");setFc("");setFco("");setFn("");setFv("");setFdr("");setFOri([]);setFDst([]);}}>✕ Limpiar</button>}
      <button className="btn bg2 sm" onClick={()=>{
        const hdr=["Código","Empresa","Pasajero","Teléfono","Fecha","Hora","Origen","Destino","Veh.","Pax","Estado","Precio Prov","Precio Chofer","Chofer","Vuelo"];
        const rows=filtered.map(r=>{const d=drivers.find(x=>x.id===r.driverId);return[r.code||"",r.company||"",r.passengerName||"",r.passengerPhone||"",r.date||"",r.time||"",r.origin||"",r.destination||"",(r.vehicleType||"").toUpperCase(),r.pax||1,r.status||"",r.price||0,r.driverPrice||0,d?.name||"",r.flightNumber||""];});
        const csv=[hdr,...rows].map(row=>row.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\n");
        const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="reservas_filtradas.csv";a.click();
      }} title="Exportar CSV con filtros aplicados"><Ic n="file" s={11}/> CSV</button>
      <button className={`btn sm${srt==="date"?" bp":" bg2"}`} onClick={()=>{srt==="date"?setSrtDir(d=>d*-1):setSrt("date");}} title="Ordenar por fecha">{srt==="date"&&srtDir<0?"↓":"↑"} Fecha</button>
      <button className={`btn sm${srt==="driver"?" bp":" bg2"}`} onClick={()=>{srt==="driver"?setSrtDir(d=>d*-1):setSrt("driver");}} title="Ordenar por chofer">{srt==="driver"&&srtDir<0?"↓":"↑"} Chofer</button>
      <span style={{marginLeft:"auto",fontSize:11,color:"var(--mu)"}}>{filtered.length} resultado(s)</span>
    </div>
    <div className="tw"><table>
      <thead><tr><th>Código</th><th>Empresa</th><th>Pasajero</th><th>Fecha/Hora</th><th>Ruta</th><th>Veh.</th><th>Chofer</th><th>Estado</th><th></th></tr></thead>
      <tbody>
        {filtered.length===0&&<tr><td colSpan={9}><div className="empty">📭 Sin resultados</div></td></tr>}
        {filtered.map(res=>{
          const drv=gd(res.driverId);const urg2=isUrg(res);const fin=FIN.includes(res.status);
          return(<tr key={res.id} className={`${urg2?"ug":""}${fin?" fin":""}`} onClick={()=>onDet(res)} style={{cursor:"pointer"}}>
            <td><span className="chip" style={{fontSize:10}}>{res.code}</span>{dups?.has(res.providerCode)&&<span title="Código de proveedor duplicado" style={{background:"rgba(239,68,11,.2)",color:"#f87171",fontSize:8.5,padding:"1px 4px",borderRadius:3,display:"block",marginTop:1}}>DUP</span>}<div style={{fontSize:9,color:"var(--mu2)"}}>{res.providerCode}</div>{urg2&&<div style={{fontSize:8.5,color:"var(--re)",fontWeight:700}}>⚡&lt;24h</div>}</td>
            <td style={{fontWeight:600,fontSize:12}}>{res.company}</td>
            <td><div style={{fontWeight:500,fontSize:12}}>{res.passengerName}</div><div style={{fontSize:10.5,color:"var(--mu)"}}>{res.pax}pax</div></td>
            <td><div style={{fontWeight:600,fontSize:12}}>{fD(res.date)}</div><div style={{fontSize:11,color:"var(--ac)"}}>{res.time}hs</div></td>
            <td style={{maxWidth:140}}><div style={{fontSize:10.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📍 {res.origin}</div><div style={{fontSize:10.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--mu2)"}}>🏁 {res.destination}</div></td>
            <td><VB type={(res.vehicleType||"SEDAN").toUpperCase()}/></td>
            <td>{drv?(<div style={{display:"flex",alignItems:"center",gap:5}}><Av id={drv.id} text={drv.avatar} size={22} fs={8}/><div><div style={{fontSize:11.5,fontWeight:600}}>{drv.name.split(" ")[0]}</div><div style={{fontSize:9.5,color:"var(--mu2)"}}>{drv.plate}</div></div></div>):!fin?<button className="btn bam sm" style={{fontSize:10,padding:"3px 6px"}} onClick={()=>onAss(res)}>Asignar</button>:<span style={{color:"var(--mu)",fontSize:10.5}}>—</span>}</td>
            <td><Bdg status={res.status}/></td>
            <td><div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
              {!fin&&<button className="btn bam sm" style={{fontSize:9.5,padding:"2px 5px"}} onClick={()=>onAss(res)}>{res.driverId?"Reasig.":"Asig."}</button>}
              {res.driverId&&!fin&&<button className="btn bgr sm" onClick={()=>onWA({res,drv:drv||gd(res.driverId),mode:"alert"})}><Ic n="wa" s={10}/></button>}
              <button className="btn bg2 sm" onClick={()=>onDet(res)}><Ic n="edit" s={10}/></button>
              {res.driverId&&!fin&&<button className="btn bg2 sm" onClick={()=>onReA(res)}><Ic n="swap" s={10}/></button>}
            </div></td>
          </tr>);
        })}
      </tbody>
    </table></div>
  </>);
}
// ── RUTAS PAGE ─────────────────────────────────────────────────────────────────
function RutPage({routePrices,pRT,toast,role}){
  const[ed,setEd]=useState(null);const[ev,setEv]=useState({});
  const[pct,setPct]=useState("");const[showPct,setShowPct]=useState(false);
  const[showCSV,setShowCSV]=useState(false);
  const[pctRound,setPctRound]=useState("none"); // none | round | floor0
  const[pctTrail,setPctTrail]=useState("0"); // trailing zeros count
  const locs=["AEP","EZE","CABA","PQM","BQB","CLX"];
  const gR=(f,t)=>routePrices.find(r=>r.from===f&&r.to===t);
  const save=async(f,t)=>{const ex=gR(f,t);const nr=ex?routePrices.map(r=>(r.from===f&&r.to===t)?{...r,...ev}:r):[...routePrices,{from:f,to:t,...ev}];await pRT(nr);setEd(null);setEv({});toast("Tarifa actualizada ✅");};
  const applyPct=async()=>{
    const p=parseFloat(pct)/100;if(isNaN(p))return;
    const round=(v)=>{
      const raw=v*(1+p);
      if(pctRound==="round")return Math.round(raw);
      if(pctRound==="floor0"){
        // Round to nearest 10, 100, etc based on trailing zeros
        const factor=Math.pow(10,parseInt(pctTrail)||0);
        return Math.round(raw/factor)*factor;
      }
      return Math.round(raw*100)/100;
    };
    const nr=routePrices.map(r=>{const u={...r};VT.forEach(v=>{if(r[v])u[v]=round(r[v]);});return u;});
    await pRT(nr);setPct("");setShowPct(false);
    toast(`Tarifas actualizadas ${pct>0?"+":""}${pct}% ✅`);
  };
  const importCSV=async(text)=>{
    // CSV format: from,to,SEDAN,VAN,HIACE,SPRINTER
    const lines=text.trim().split(/\r?\n/).filter(l=>l.trim());
    const locs=["AEP","EZE","CABA","PQM","BQB","CLX"];
    let updated=0;
    const newPrices=[...routePrices];
    lines.forEach(line=>{
      const cols=line.split(/[;,\t]/).map(c=>c.trim().replace(/"/g,"").toUpperCase());
      if(cols.length<3)return;
      const[from,to,...prices]=cols;
      if(!locs.includes(from)||!locs.includes(to)||from===to)return;
      const sedan=parseFloat(prices[0])||0;const van=parseFloat(prices[1])||0;
      const hiace=parseFloat(prices[2])||van;const sprinter=parseFloat(prices[3])||van;
      const idx=newPrices.findIndex(r=>r.from===from&&r.to===to);
      const entry={from,to,SEDAN:sedan,VAN:van,HIACE:hiace,SPRINTER:sprinter};
      if(idx>=0)newPrices[idx]=entry;else newPrices.push(entry);
      updated++;
    });
    await pRT(newPrices);setShowCSV(false);
    toast(`${updated} rutas actualizadas ✅`);
  };
  return(
    <div>
      <div style={{marginBottom:12,padding:11,background:"rgba(0,212,255,.06)",border:"1px solid rgba(0,212,255,.15)",borderRadius:"var(--r)",fontSize:12,color:"var(--mu2)"}}>
        <strong style={{color:"var(--ac)"}}>Tarifas pagadas al chofer</strong> — Clic en una celda para editar ruta por ruta.
        <div style={{fontSize:10.5,marginTop:3}}>AEP=Aeroparque · EZE=Ezeiza · CABA=Ciudad · PQM=Quinquela Martín · BQB=Buque Bus · CLX=Colonia Express</div>
      </div>
      {role==="admin"&&<div style={{marginBottom:12,display:"flex",gap:8,alignItems:"center"}}>
        <button className="btn bg2 sm" onClick={()=>setShowPct(s=>!s)}><Ic n="chart" s={11}/> Ajuste global (%)</button>
        {showPct&&<div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",background:"var(--s2)",padding:"8px 12px",borderRadius:"var(--r)",border:"1px solid var(--b2)"}}>
          <input className="fi" type="number" value={pct} onChange={e=>setPct(e.target.value)} placeholder="ej: 10 o -5" style={{width:90}}/>
          <select className="fs" value={pctRound} onChange={e=>setPctRound(e.target.value)} style={{fontSize:11.5}}>
            <option value="none">Sin redondeo</option>
            <option value="round">Número entero (sin centavos)</option>
            <option value="floor0">Redondear a múltiplo de 10/100...</option>
          </select>
          {pctRound==="floor0"&&<select className="fs" value={pctTrail} onChange={e=>setPctTrail(e.target.value)} style={{fontSize:11.5}}>
            <option value="1">Múltiplo de 10</option>
            <option value="2">Múltiplo de 100</option>
            <option value="3">Múltiplo de 1000</option>
          </select>}
          <button className="btn bp sm" onClick={applyPct}>Aplicar</button>
          <button className="btn bg2 sm" onClick={()=>setShowPct(false)}><Ic n="X" s={10}/></button>
        </div>}
        <button className="btn bg2 sm" onClick={()=>setShowCSV(s=>!s)}><Ic n="file" s={11}/> Importar CSV</button>
        {showCSV&&<div style={{background:"var(--s2)",padding:"10px 12px",borderRadius:"var(--r)",border:"1px solid var(--b2)"}}>
          <div style={{fontSize:11,color:"var(--mu2)",marginBottom:6}}>Formato CSV: <code>FROM,TO,SEDAN,VAN,HIACE,SPRINTER</code><br/>Ejemplo: <code>AEP,CABA,13000,17500,17500,35000</code></div>
          <label className="dz" style={{padding:"10px 14px",cursor:"pointer"}}>
            <input type="file" accept=".csv,.txt" style={{display:"none"}} onChange={async e=>{const f=e.target.files[0];if(f){await importCSV(await f.text());e.target.value="";}}}/>
            <span style={{fontSize:12}}>📂 Subir CSV de tarifas</span>
          </label>
        </div>}
      </div>}
      <div style={{overflowX:"auto"}}>
        <table><thead><tr><th>Origen → Destino</th>{VT.map(v=><th key={v}><VB type={v}/></th>)}<th></th></tr></thead>
          <tbody>{locs.flatMap(f=>locs.filter(t=>t!==f).map(t=>{const r=gR(f,t);const k=`${f}-${t}`;const isE=ed===k;return(
            <tr key={k}>
              <td style={{fontWeight:600,fontSize:12}}>{f} → {t}</td>
              {VT.map(vt=><td key={vt}>{isE&&role==="admin"?<input type="number" value={ev[vt]??r?.[vt]??""} onChange={e=>setEv(p=>({...p,[vt]:parseFloat(e.target.value)}))} style={{width:85,fontSize:12,padding:"3px 7px"}}/>:<span style={{fontSize:12,color:r?.[vt]?"var(--tx)":"var(--mu)"}}>{r?.[vt]?`$${n$(r[vt])}`:"—"}</span>}</td>)}
              <td>{role==="admin"&&(isE?<div style={{display:"flex",gap:3}}><button className="btn bgr sm" onClick={()=>save(f,t)}><Ic n="chk" s={10}/></button><button className="btn bg2 sm" onClick={()=>{setEd(null);setEv({});}}><Ic n="X" s={10}/></button></div>:<button className="btn bg2 sm" onClick={()=>{setEd(k);setEv(r?{...r}:{});}}><Ic n="edit" s={10}/></button>)}</td>
            </tr>
          );}))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// ── BILLETERA PAGE ─────────────────────────────────────────────────────────────
function BilPage({drivers,reservations,payments,onPay,onEPay,toast}){
  const[sel,setSel]=useState(null);const[srch,setSrch]=useState("");
  const[amt,setAmt]=useState("");const[note,setNote]=useState("");const[ep,setEp]=useState(null);
  const fd=drivers.filter(d=>d.active&&(!srch||d.name.toLowerCase().includes(srch.toLowerCase())||d.plate?.toLowerCase().includes(srch.toLowerCase())));
  const sd=drivers.find(d=>d.id===sel);
  const myT=reservations.filter(r=>r.driverId===sel).sort((a,b)=>a.date<b.date?1:-1);
  const myP=payments.filter(p=>p.driverId===sel);
  const earned=myT.filter(r=>PAY.includes(r.status)).reduce((s,r)=>s+(r.driverPrice||0),0);
  const paid=myP.reduce((s,p)=>s+p.amount,0);
  const b=earned-paid;
  return(
    <div style={{display:"grid",gridTemplateColumns:sel?"260px 1fr":"1fr",gap:16}}>
      <div>
        <SI value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar chofer..." style={{marginBottom:9}}/>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {fd.map(d=>{const t=reservations.filter(r=>r.driverId===d.id);const e2=t.filter(r=>PAY.includes(r.status)).reduce((s,r)=>s+(r.driverPrice||0),0);const p2=payments.filter(p=>p.driverId===d.id).reduce((s,p)=>s+p.amount,0);const b2=e2-p2;return(
            <div key={d.id} onClick={()=>setSel(sel===d.id?null:d.id)} style={{background:"var(--s1)",border:`1px solid ${sel===d.id?"var(--ac)":"var(--b1)"}`,borderRadius:"var(--r)",padding:"10px 12px",cursor:"pointer",transition:"all .15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Av id={d.id} text={d.avatar} size={30} fs={10}/>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12}}>{d.name}</div><div style={{fontSize:10.5,color:"var(--mu2)"}}>{d.vehicleBrand} {d.vehicleModel}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:12,color:b2>0?"var(--am)":"var(--gr)"}}>${n$(b2)}</div><div style={{fontSize:9,color:"var(--mu2)"}}>saldo</div></div>
              </div>
            </div>
          );})}
        </div>
      </div>
      {sd&&<div>
        <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:13,marginBottom:11}}>{sd.name}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
          {[["Ganado",`$${n$(earned)}`,"var(--gr)"],["Cobrado",`$${n$(paid)}`,"var(--bl)"],["Saldo",`$${n$(b)}`,b>0?"var(--am)":"var(--gr)"]].map(([k,v,c])=>(
            <div key={k} style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"10px 12px"}}><div style={{fontSize:10,color:"var(--mu2)",marginBottom:3}}>{k}</div><div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:15,color:c}}>{v}</div></div>
          ))}
        </div>
        <div style={{background:"var(--s2)",borderRadius:"var(--r)",padding:11,marginBottom:11}}>
          <div style={{fontSize:10,color:"var(--mu2)",marginBottom:6,fontWeight:600}}>ACREDITAR PAGO</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <input className="fi" type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Monto $" style={{width:110}}/>
            <input className="fi" value={note} onChange={e=>setNote(e.target.value)} placeholder="Concepto..." style={{flex:1,minWidth:120}}/>
            <button className="btn bgr" onClick={async()=>{await onPay(sel,amt,note);setAmt("");setNote("");}} disabled={!amt}><Ic n="plus" s={12}/> Acreditar</button>
          </div>
        </div>
        <div style={{fontSize:10,color:"var(--mu2)",marginBottom:6,fontWeight:600}}>SERVICIOS</div>
        <div style={{background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",overflow:"hidden",marginBottom:11}}>
          {myT.length===0&&<div style={{padding:10,color:"var(--mu)",fontSize:11.5,textAlign:"center"}}>Sin servicios</div>}
          {myT.map(r=><div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 11px",borderBottom:"1px solid var(--b1)"}}>
            <div style={{flex:1}}><span className="chip" style={{fontSize:9}}>{r.code}</span>{dups?.has(r.providerCode)&&<span style={{background:"rgba(239,68,11,.15)",color:"var(--re)",fontSize:9,padding:"1px 5px",borderRadius:3,marginLeft:3}}>DUP</span>} <span style={{fontSize:11}}>{fD(r.date)} · {r.passengerName}</span><div style={{marginTop:1}}><Bdg status={r.status}/></div></div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,color:PAY.includes(r.status)?"var(--gr)":r.status==="cancelled_nopay"?"var(--mu)":"var(--am)",fontSize:11.5}}>{PAY.includes(r.status)||!FIN.includes(r.status)?`$${n$(r.driverPrice)}`:"$0"}</div>
          </div>)}
        </div>
        <div style={{fontSize:10,color:"var(--mu2)",marginBottom:6,fontWeight:600}}>PAGOS</div>
        <div style={{background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",overflow:"hidden"}}>
          {myP.length===0&&<div style={{padding:10,color:"var(--mu)",fontSize:11.5,textAlign:"center"}}>Sin pagos</div>}
          {myP.map(pm=><div key={pm.id} style={{padding:"6px 11px",borderBottom:"1px solid var(--b1)"}}>
            {ep===pm.id?(
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <input className="fi" type="number" defaultValue={pm.amount} id={`a_${pm.id}`} style={{width:80,fontSize:11.5,padding:"3px 6px"}}/>
                <input className="fi" defaultValue={pm.note} id={`n_${pm.id}`} style={{flex:1,fontSize:11.5,padding:"3px 6px"}}/>
                <button className="btn bgr sm" onClick={()=>{const a=document.getElementById(`a_${pm.id}`)?.value;const n=document.getElementById(`n_${pm.id}`)?.value;onEPay(pm.id,a,n,sel);setEp(null);}}><Ic n="chk" s={10}/></button>
                <button className="btn bg2 sm" onClick={()=>setEp(null)}><Ic n="X" s={10}/></button>
              </div>
            ):(
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{flex:1}}><div style={{fontSize:11.5}}>{pm.note||"Pago"}</div><div style={{fontSize:9.5,color:"var(--mu2)"}}>{fD(pm.date)}</div></div>
                <div style={{fontFamily:"var(--fh)",fontWeight:700,color:"var(--bl)",fontSize:11.5}}>+${n$(pm.amount)}</div>
                <button className="btn bg2 sm" onClick={()=>setEp(pm.id)}><Ic n="edit" s={10}/></button>
              </div>
            )}
          </div>)}
        </div>
      </div>}
    </div>
  );
}
// ── PROVIDERS PAGE ─────────────────────────────────────────────────────────────
function PvdEditMod({pv,onClose,onSv,onDel}){
  const[f,setF]=useState({...pv});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc"><div className="mh"><div className="mt">Editar proveedor — {pv.name}</div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
    <div className="mb"><div className="fg">
      <div className="fp"><label>Código (3 letras)</label><input {...sf("code")} maxLength={3} style={{textTransform:"uppercase"}}/></div>
      <div className="fp"><label>Nombre</label><input {...sf("name")}/></div>
      <div className="fp"><label>Responsable</label><input {...sf("manager")}/></div>
      <div className="fp"><label>Email</label><input type="email" {...sf("email")}/></div>
      <div className="fp"><label>Teléfono</label><input {...sf("phone")}/></div>
      <div className="fp" style={{display:"flex",alignItems:"center",gap:9,flexWrap:"wrap"}}>
        <label style={{marginBottom:0,minWidth:80}}>Contrato firmado</label>
        <input type="checkbox" checked={!!f.hasContract} onChange={e=>setF(p=>({...p,hasContract:e.target.checked}))} style={{width:15,height:15}}/>
      </div>
      <div className="fp full"><label>Notas</label><textarea {...sf("notes")} rows={2}/></div>
      <div className="fp full"><FUp label="Subir contrato (PDF/DOC)" value={f.contractDoc} onChange={v=>setF(p=>({...p,contractDoc:v}))} accept=".pdf,.doc,.docx,image/*"/></div>
      {f.contractDoc&&<div className="fp full" style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.25)",borderRadius:7,padding:"7px 11px",fontSize:11.5,color:"var(--gr)"}}>
        📄 {typeof f.contractDoc==="object"?f.contractDoc.name:"Contrato cargado"}
        {typeof f.contractDoc==="object"&&f.contractDoc.data&&<a href={f.contractDoc.data} download={f.contractDoc.name} style={{marginLeft:8,color:"var(--ac)",fontSize:11}}>Descargar</a>}
      </div>}
    </div></div>
    <div className="mf" style={{justifyContent:"space-between"}}>
      <button className="btn re sm" onClick={()=>{if(window.confirm(`¿Eliminar ${pv.name}?`))onDel(pv.id);}}>Eliminar</button>
      <div style={{display:"flex",gap:6}}><button className="btn bg2" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>onSv({...f,code:(f.code||"").toUpperCase()})} disabled={!f.code||!f.name}><Ic n="chk" s={12}/> Guardar</button></div>
    </div>
    </div></div>);
}

function NPvdMod({onClose,onSv}){
  const[f,setF]=useState({code:"",name:"",hasContract:false,manager:"",email:"",phone:"",notes:"",contractDoc:null});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc"><div className="mh"><div className="mt">Nuevo proveedor</div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
    <div className="mb"><div className="fg">
      <div className="fp"><label>Código (3 letras) *</label><input {...sf("code")} maxLength={3} style={{textTransform:"uppercase"}}/></div>
      <div className="fp"><label>Nombre *</label><input {...sf("name")}/></div>
      <div className="fp"><label>Responsable</label><input {...sf("manager")}/></div>
      <div className="fp"><label>Email</label><input type="email" {...sf("email")}/></div>
      <div className="fp"><label>Teléfono</label><input {...sf("phone")}/></div>
      <div className="fp" style={{display:"flex",alignItems:"center",gap:9}}>
        <label style={{marginBottom:0}}>Contrato firmado</label>
        <input type="checkbox" checked={!!f.hasContract} onChange={e=>setF(p=>({...p,hasContract:e.target.checked}))} style={{width:15,height:15}}/>
      </div>
      <div className="fp full"><label>Notas</label><textarea {...sf("notes")} rows={2}/></div>
      <div className="fp full"><FUp label="Subir contrato (PDF/DOC)" value={f.contractDoc} onChange={v=>setF(p=>({...p,contractDoc:v}))} accept=".pdf,.doc,.docx,image/*"/></div>
    </div></div>
    <div className="mf"><button className="btn bg2" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>onSv({...f,code:(f.code||"").toUpperCase(),id:"pv"+Date.now(),createdAt:new Date().toISOString()})} disabled={!f.code.trim()||!f.name.trim()}><Ic n="chk" s={12}/> Crear</button></div>
    </div></div>);
}

function PvdPage({providers,provPayments,reservations,pPV,pPP,pR,toast,role}){
  const[tab,setTab]=useState("list");
  const[sel,setSel]=useState(null);
  const[mNP,setMNP]=useState(false);
  const[mDet,setMDet]=useState(null);
  const sp=providers.find(p=>p.id===sel);
  const pvRes=id=>reservations.filter(r=>r.providerId===id||r.company===providers.find(p=>p.id===id)?.name||r.company===providers.find(p=>p.id===id)?.code);
  return(
    <div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14}}>
        <div className="tabs" style={{flex:1,marginBottom:0}}>
          <button className={`tab${tab==="list"?" on":""}`} onClick={()=>setTab("list")}>Lista</button>
          {sel&&<button className={`tab${tab==="detail"?" on":""}`} onClick={()=>setTab("detail")}>{sp?.name||"Detalle"}</button>}
        </div>
        <button className="btn bp sm" onClick={()=>setMNP(true)}><Ic n="plus" s={11}/> Nuevo</button>
      </div>
      {tab==="list"&&<ProvList providers={providers} reservations={reservations} provPayments={provPayments} onSelect={id=>{setSel(id);setTab("detail");}} onDet={setMDet}/>}
      {tab==="detail"&&sp&&<ProvDetail pv={sp} allReservations={pvRes(sp.id)} provPayments={provPayments.filter(p=>p.providerId===sp.id)} pPP={async newList=>{const others=provPayments.filter(p=>p.providerId!==sp.id);await pPP([...others,...newList]);}} pR={pR} reservations={reservations} toast={toast} role={role}/>}
      {mNP&&<NPvdMod onClose={()=>setMNP(false)} onSv={async p=>{await pPV([...providers,p]);setMNP(false);toast("Proveedor creado ✅");}}/>}
      {mDet&&<PvdEditMod pv={mDet} onClose={()=>setMDet(null)} onSv={async p=>{await pPV(providers.map(x=>x.id===p.id?p:x));setMDet(null);toast("Actualizado ✅");}} onDel={async id=>{await pPV(providers.filter(p=>p.id!==id));setMDet(null);toast("Eliminado","🗑️");}}/>}
    </div>
  );
}

function ProvList({providers,reservations,provPayments,onSelect,onDet}){
  const[srch,setSrch]=useState("");
  const fd=providers.filter(p=>!srch||p.name.toLowerCase().includes(srch.toLowerCase())||p.code.toLowerCase().includes(srch.toLowerCase()));
  return(<div>
    <SI value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar proveedor..." style={{marginBottom:11,maxWidth:280}}/>
    <div className="tw"><table>
      <thead><tr><th>Código</th><th>Empresa</th><th>Contrato</th><th>Manager</th><th>Reservas</th><th>Facturado</th><th>Cobrado</th><th>Saldo</th><th></th></tr></thead>
      <tbody>
        {fd.length===0&&<tr><td colSpan={9}><div className="empty">Sin proveedores</div></td></tr>}
        {fd.map(pv=>{
          const rs=reservations.filter(r=>r.providerId===pv.id||r.company===pv.name||r.company===pv.code);
          const billed=provBilled(rs);
          const collected=provPayments.filter(p=>p.providerId===pv.id).reduce((s,p)=>s+p.amount,0);
          const bal=billed-collected;
          return(<tr key={pv.id}>
            <td><span className="rtag">{pv.code}</span></td>
            <td style={{fontWeight:600,fontSize:12.5}}>{pv.name}</td>
            <td><span style={{fontSize:11,color:pv.hasContract?"var(--gr)":"var(--mu)"}}>{pv.hasContract?"✅":"❌"}</span></td>
            <td style={{fontSize:11.5}}>{pv.manager||"—"}</td>
            <td style={{fontWeight:600,textAlign:"center"}}>{rs.length}</td>
            <td style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,color:"var(--ac)"}}>${n$(billed)}</td>
            <td style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,color:"var(--gr)"}}>${n$(collected)}</td>
            <td style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,color:bal>0?"var(--re)":"var(--gr)"}}>${n$(bal)}</td>
            <td><div style={{display:"flex",gap:3}}>
              <button className="btn bbl sm" onClick={()=>onSelect(pv.id)}><Ic n="rpt" s={10}/> Ver</button>
              <button className="btn bg2 sm" onClick={()=>onDet(pv)}><Ic n="edit" s={10}/></button>
            </div></td>
          </tr>);
        })}
      </tbody>
    </table></div>
  </div>);
}

function ProvDetail({pv,allReservations,provPayments,pPP,pR,reservations,toast,role}){
  const[from,setFrom]=useState(new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().split("T")[0]);
  const[to,setTo]=useState(TD);
  const[fst,setFst]=useState("");
  const[amt,setAmt]=useState("");const[note,setNote]=useState("");const[ref,setRef]=useState("");
  const[editPmt,setEditPmt]=useState(null);
  const[editRes,setEditRes]=useState(null);

  // Filter reservations by period and status
  const ft=allReservations.filter(r=>{
    if(r.date<from||r.date>to)return false;
    if(fst&&r.status!==fst)return false;
    return true;
  }).sort((a,b)=>a.date>b.date?1:-1);

  // Billing logic: completed + cancelled_pay + noshow = facturado; cancelled_nopay = $0
  const periodBilled=ft.filter(r=>PROV_PAY.includes(r.status)).reduce((s,r)=>s+(r.price||0),0);
  const totalBilled=provBilled(allReservations);
  const totalCollected=provPayments.reduce((s,p)=>s+p.amount,0);
  const totalBal=totalBilled-totalCollected;

  const addPayment=async()=>{
    if(!amt)return;
    const p={id:"pp"+Date.now(),providerId:pv.id,amount:parseFloat(amt),note,ref,date:TD};
    await pPP([...provPayments,p]);
    setAmt("");setNote("");setRef("");toast("Cobro registrado ✅");
  };
  const editPayment=async(id,newAmt,newNote)=>{
    await pPP(provPayments.map(p=>p.id===id?{...p,amount:parseFloat(newAmt),note:newNote}:p));
    setEditPmt(null);toast("Pago actualizado ✅");
  };
  const deletePayment=async(id)=>{
    await pPP(provPayments.filter(p=>p.id!==id));
    toast("Pago eliminado","🗑️");
  };

  // Export to CSV/Excel
  const exportCSV=()=>{
    const rows=[["Fecha","Hora","Código","Cód. Proveedor","Pasajero","Pax","Vehículo","Origen","Destino","Estado","Precio"]];
    ft.forEach(r=>rows.push([fD(r.date),r.time,r.code,r.providerCode||"",r.passengerName,r.pax,(r.vehicleType||"").toUpperCase(),r.origin,r.destination,SM[r.status]?.l||r.status,PROV_PAY.includes(r.status)?r.price:0]));
    rows.push([]);
    rows.push(["","","","","","","","","","FACTURADO PERIODO","$"+n$(periodBilled)]);
    rows.push(["","","","","","","","","","COBRADO TOTAL","$"+n$(totalCollected)]);
    rows.push(["","","","","","","","","","SALDO PENDIENTE","$"+n$(totalBal)]);
    const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const uri="data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(csv);
    const a=document.createElement("a");a.href=uri;a.download=`${pv.code}_${fD(from)}_${fD(to)}.csv`;document.body.appendChild(a);a.click();document.body.removeChild(a);
  };

  // Export to PDF via print
  const exportPDF=()=>{
    const rowsHtml=ft.map(r=>`<tr><td>${fD(r.date)}</td><td>${r.time}hs</td><td>${r.code}</td><td>${r.providerCode||""}</td><td>${r.passengerName}</td><td>${(r.vehicleType||"").toUpperCase()}</td><td style="max-width:120px;overflow:hidden">${r.origin}</td><td style="max-width:120px;overflow:hidden">${r.destination}</td><td>${SM[r.status]?.l||r.status}</td><td><b>$${n$(PROV_PAY.includes(r.status)?r.price:0)}</b></td></tr>`).join("");
    const pmtHtml=provPayments.sort((a,b)=>a.date<b.date?1:-1).map(p=>`<tr><td>${fD(p.date)}</td><td>${p.ref||"-"}</td><td>${p.note||"Cobro"}</td><td><b>$${n$(p.amount)}</b></td></tr>`).join("");
    const content=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cuenta ${pv.name}</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:10px;padding:16px;color:#111}h2{font-size:14px;margin:0 0 2px}p{margin:0 0 10px;color:#555;font-size:10px}table{width:100%;border-collapse:collapse;margin-bottom:10px;font-size:9.5px}th{background:#eee;border:1px solid #ccc;padding:4px 6px;text-align:left}td{border:1px solid #ddd;padding:3px 6px}.sum{background:#f5f5f5;font-weight:bold}.bal{color:${totalBal>0?"#c00":"#080"};font-size:13px;font-weight:bold}</style></head><body><h2>Resumen de cuenta: ${pv.name} (${pv.code})</h2><p>Período: ${fD(from)} al ${fD(to)} | Generado: ${fD(TD)}</p><table><thead><tr><th>Fecha</th><th>Hora</th><th>Código</th><th>Ref.</th><th>Pasajero</th><th>Vehículo</th><th>Origen</th><th>Destino</th><th>Estado</th><th>Precio</th></tr></thead><tbody>${rowsHtml}<tr class="sum"><td colspan="9">Facturado período</td><td>$${n$(periodBilled)}</td></tr></tbody></table><table><thead><tr><th>Fecha cobro</th><th>Ref.</th><th>Concepto</th><th>Monto</th></tr></thead><tbody>${pmtHtml}<tr class="sum"><td colspan="3">Total cobrado</td><td>$${n$(totalCollected)}</td></tr></tbody></table><p class="bal">Saldo pendiente: $${n$(totalBal)}</p></body></html>`;
    const uri="data:text/html;charset=utf-8,"+encodeURIComponent(content);
    const a=document.createElement("a");a.href=uri;a.download=`Cuenta_${pv.code}_${fD(from)}_${fD(to)}.html`;document.body.appendChild(a);a.click();document.body.removeChild(a);
  };

  const summ=mProvReport(pv,ft,from,to,totalCollected);

  return(
    <div>
      {/* Summary cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        {[["Facturado total",`$${n$(totalBilled)}`,"var(--ac)"],["Cobrado total",`$${n$(totalCollected)}`,"var(--gr)"],["Saldo pendiente",`$${n$(totalBal)}`,totalBal>0?"var(--re)":"var(--gr)"],["Reservas",allReservations.length,"var(--bl)"]].map(([k,v,c])=>(
          <div key={k} style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"11px 13px"}}><div style={{fontSize:10,color:"var(--mu2)",marginBottom:3}}>{k}</div><div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:15,color:c}}>{v}</div></div>
        ))}
      </div>

      {/* Register payment */}
      <div style={{background:"var(--s2)",borderRadius:"var(--r)",padding:12,marginBottom:12}}>
        <div style={{fontSize:10.5,color:"var(--mu2)",marginBottom:7,fontWeight:600}}>REGISTRAR COBRO</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <input className="fi" type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Monto $" style={{width:110}}/>
          <input className="fi" value={ref} onChange={e=>setRef(e.target.value)} placeholder="N° ref / factura..." style={{width:140}}/>
          <input className="fi" value={note} onChange={e=>setNote(e.target.value)} placeholder="Concepto..." style={{flex:1,minWidth:120}}/>
          <button className="btn bgr" onClick={addPayment} disabled={!amt}><Ic n="plus" s={12}/> Registrar</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"flex-end",flexWrap:"wrap"}}>
        <div className="fp"><label>Desde</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div>
        <div className="fp"><label>Hasta</label><input type="date" value={to} onChange={e=>setTo(e.target.value)}/></div>
        <div className="fp"><label>Estado</label>
          <select className="fs" value={fst} onChange={e=>setFst(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(SM).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}
          </select>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"flex-end",paddingBottom:1}}>
          <span style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:12,color:"var(--ac)",background:"rgba(0,212,255,.08)",padding:"4px 10px",borderRadius:6,border:"1px solid rgba(0,212,255,.2)"}}>
            📅 Período: <strong>${n$(periodBilled)}</strong>
            <span style={{fontSize:10,color:"var(--mu2)",fontWeight:400,marginLeft:6}}>({ft.length} viajes)</span>
          </span>
          <button className="btn bg2 sm" onClick={exportCSV} title="Exportar Excel/CSV"><Ic n="file" s={11}/> CSV</button>
          <button className="btn bg2 sm" onClick={exportPDF} title="Exportar PDF"><Ic n="pdf" s={11}/> PDF</button>
          <button className="btn bg2 sm" onClick={()=>{if(navigator.clipboard){navigator.clipboard.writeText(summ).catch(()=>alert("No se pudo copiar"));}else{const ta=document.createElement("textarea");ta.value=summ;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);}}}><Ic n="cpy" s={11}/> Copiar</button>
          {pv.email&&<a href={`mailto:${pv.email}?subject=Resumen de cuenta&body=${encodeURIComponent(summ)}`} className="btn bbl sm"><Ic n="snd" s={11}/> Email</a>}
        </div>
      </div>

      {/* Reservations table */}
      <div className="tw" style={{marginBottom:14}}><table>
        <thead><tr><th>Fecha</th><th>Hora</th><th>Código</th><th>Cód. Prov.</th><th>Pasajero</th><th>Veh.</th><th>Origen</th><th>Destino</th><th>Estado</th><th>Precio</th>{role==="admin"&&<th></th>}</tr></thead>
        <tbody>
          {ft.length===0&&<tr><td colSpan={role==="admin"?11:10}><div className="empty">Sin reservas en el período</div></td></tr>}
          {ft.map(r=>{
            const bills=PROV_PAY.includes(r.status);
            const isNopay=r.status==="cancelled_nopay";
            return(<tr key={r.id} style={{opacity:isNopay?.6:1,cursor:'pointer'}} onClick={()=>setEditRes(r)}>
              <td style={{fontSize:12,fontWeight:600}}>{fD(r.date)}</td>
              <td style={{fontSize:11.5,color:"var(--ac)"}}>{r.time}hs</td>
              <td><span className="chip" style={{fontSize:9.5}}>{r.code}</span></td>
              <td style={{fontSize:11,color:"var(--mu2)"}}>{r.providerCode}</td>
              <td style={{fontSize:12}}>{r.passengerName} <span style={{color:"var(--mu)",fontSize:10.5}}>{r.pax}pax</span></td>
              <td><VB type={(r.vehicleType||"SEDAN").toUpperCase()}/></td>
              <td style={{fontSize:10.5,maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.origin}</td>
              <td style={{fontSize:10.5,maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.destination}</td>
              <td><Bdg status={r.status}/></td>
              <td style={{fontFamily:"var(--fh)",fontWeight:700,color:bills?"var(--ac)":"var(--mu)",fontSize:12}}>{bills?`$${n$(r.price)}`:"$0"}</td>
              {role==="admin"&&<td>
                <button className="btn bg2 sm" onClick={()=>setEditRes(r)}><Ic n="edit" s={10}/></button>
              </td>}
            </tr>);
          })}
        </tbody>
      </table></div>

      {/* Payments history */}
      <div style={{fontSize:10.5,color:"var(--mu2)",marginBottom:7,fontWeight:600}}>COBROS REGISTRADOS</div>
      <div style={{background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",overflow:"hidden",marginBottom:12}}>
        {provPayments.length===0&&<div style={{padding:10,color:"var(--mu)",fontSize:11.5,textAlign:"center"}}>Sin cobros registrados</div>}
        {provPayments.sort((a,b)=>a.date<b.date?1:-1).map(pm=><div key={pm.id} style={{padding:"7px 12px",borderBottom:"1px solid var(--b1)"}}>
          {editPmt===pm.id?(
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <input className="fi" type="number" defaultValue={pm.amount} id={`pp_a_${pm.id}`} style={{width:90,fontSize:11.5,padding:"3px 7px"}}/>
              <input className="fi" defaultValue={pm.note} id={`pp_n_${pm.id}`} style={{flex:1,fontSize:11.5,padding:"3px 7px"}}/>
              <button className="btn bgr sm" onClick={()=>{const a=document.getElementById(`pp_a_${pm.id}`)?.value;const n=document.getElementById(`pp_n_${pm.id}`)?.value;editPayment(pm.id,a,n);}}><Ic n="chk" s={10}/></button>
              <button className="btn bg2 sm" onClick={()=>setEditPmt(null)}><Ic n="X" s={10}/></button>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12}}>{pm.note||"Cobro"}{pm.ref&&<span style={{fontSize:10,color:"var(--mu2)",marginLeft:6}}>Ref: {pm.ref}</span>}</div>
                <div style={{fontSize:10,color:"var(--mu2)"}}>{fD(pm.date)}</div>
              </div>
              <div style={{fontFamily:"var(--fh)",fontWeight:700,color:"var(--gr)",fontSize:12}}>+${n$(pm.amount)}</div>
              <button className="btn bg2 sm" onClick={()=>setEditPmt(pm.id)}><Ic n="edit" s={10}/></button>
              <button className="btn bg2 sm" style={{color:"var(--re)"}} onClick={()=>deletePayment(pm.id)}><Ic n="trash" s={10}/></button>
            </div>
          )}
        </div>)}
      </div>

      {/* Edit reservation modal */}
      {editRes&&<EditResModal res={editRes} role={role} drv={null} onClose={()=>setEditRes(null)} onSv={async r=>{await pR(reservations.map(x=>x.id===r.id?r:x));setEditRes(null);toast("Reserva actualizada ✅");}}/>}
    </div>
  );
}

function EditResModal({res,onClose,onSv,role,drv}){
  const[edit,setEdit]=useState(false);
  const[f,setF]=useState({...res});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  if(!edit)return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh">
        <div>
          <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3}}><span className="chip">{res.code}</span><span style={{fontSize:11.5,color:"var(--mu2)"}}>{res.providerCode}</span></div>
          <div className="mt">{res.passengerName}</div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <Bdg status={res.status}/>
          {role==="admin"&&<button className="btn bg2 sm" onClick={()=>setEdit(true)}><Ic n="edit" s={11}/> Editar</button>}
          <button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button>
        </div>
      </div>
      <div className="mb"><ResDetailView res={res} drv={drv}/></div>
      <div className="mf"><button className="btn bg2" onClick={onClose}>Cerrar</button></div>
    </div></div>
  );
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh"><div><span className="chip">{res.code}</span> <span className="mt">{res.passengerName} — Editando</span></div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      <div className="mb"><div className="fg">
        <div className="fp"><label>Empresa</label><input {...sf("company")}/></div>
        <div className="fp"><label>Cód. proveedor</label><input {...sf("providerCode")}/></div>
        <div className="fp"><label>Pasajero</label><input {...sf("passengerName")}/></div>
        <div className="fp"><label>Teléfono</label><input {...sf("passengerPhone")}/></div>
        <div className="fp"><label>Fecha (DD-MM-AAAA)</label><input value={fD(f.date)} onChange={e=>setF(p=>({...p,date:tI(e.target.value)}))} placeholder="dd-mm-aaaa"/></div>
        <div className="fp"><label>Hora (HH:MM)</label><input type="time" {...sf("time")}/></div>
        <div className="fp"><label>Pax</label><input type="number" {...sf("pax")}/></div>
        <div className="fp"><label>Equipaje</label><input type="number" {...sf("luggage")}/></div>
        <div className="fp full"><label>Origen</label><input {...sf("origin")}/></div>
        <div className="fp full"><label>Destino</label><input {...sf("destination")}/></div>
        <div className="fp"><label>Vehículo</label><select value={f.vehicleType} onChange={e=>setF(p=>({...p,vehicleType:e.target.value}))}>{VT.map(v=><option key={v}>{v}</option>)}</select></div>
        <div className="fp"><label>Estado</label><select value={f.status} onChange={e=>setF(p=>({...p,status:e.target.value}))}>{Object.entries(SM).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select></div>
        <div className="fp"><label>Precio cliente ($)</label><input type="number" {...sf("price")}/></div>
        <div className="fp"><label>Valor chofer ($)</label><input type="number" {...sf("driverPrice")}/></div>
        <div className="fp full" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><label style={{fontSize:12.5,color:"var(--tx)"}}>Arribo con vuelo</label><Tog checked={!!f.isArrival} onChange={e=>setF(p=>({...p,isArrival:e.target.checked}))}/></div>
        {f.isArrival&&<div className="fp"><label>Nro. vuelo</label><input {...sf("flightNumber")}/></div>}
        <div className="fp full"><label>Notas</label><textarea {...sf("notes")} rows={2}/></div>
        <div className="fp full"><FUp label="Contrato (PDF/DOC)" value={f.contractDoc} onChange={v=>setF(p=>({...p,contractDoc:v}))} accept=".pdf,.doc,.docx,image/*"/></div>
        {f.contractDoc&&<div className="fp full" style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.3)",borderRadius:7,padding:"7px 11px",fontSize:11.5,color:"var(--gr)"}}>✅ Contrato: {f.contractDoc.name}</div>}
      </div></div>
      <div className="mf"><button className="btn bg2" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>onSv(f)}><Ic n="chk" s={12}/> Guardar cambios</button></div>
    </div></div>);
}


// ── MODALS ─────────────────────────────────────────────────────────────────────
function SumMod({drv,trips,pmts,onClose}){
  const[from,setFrom]=useState(TD);const[to,setTo]=useState(TD);
  const ft=trips.filter(r=>r.date>=from&&r.date<=to);
  const summ=mReport(drv,ft,from,to);
  const comp=ft.filter(r=>PAY.includes(r.status)).reduce((s,r)=>s+(r.driverPrice||0),0);
  const pend=ft.filter(r=>!FIN.includes(r.status)).reduce((s,r)=>s+(r.driverPrice||0),0);
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh"><div className="mt">Resumen — {drv.name}</div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      <div className="mb">
        <div style={{display:"flex",gap:8,marginBottom:13,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div className="fp"><label>Desde</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div>
          <div className="fp"><label>Hasta</label><input type="date" value={to} onChange={e=>setTo(e.target.value)}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginLeft:"auto"}}>
            {[["Cobrable",`$${n$(comp)}`,"var(--gr)"],["Pendientes",`$${n$(pend)}`,"var(--am)"],["Total",`$${n$(comp+pend)}`,"var(--ac)"]].map(([k,v,c])=>(
              <div key={k} style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"7px 9px",textAlign:"center"}}><div style={{fontSize:9.5,color:"var(--mu2)"}}>{k}</div><div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:12,color:c}}>{v}</div></div>
            ))}
          </div>
        </div>
        <div className="sbox">{summ}</div>
      </div>
      <div className="mf">
        <button className="btn bg2" onClick={onClose}>Cerrar</button>
        <button className="btn bg2" onClick={()=>navigator.clipboard?.writeText(summ)}><Ic n="cpy" s={12}/> Copiar</button>
        {drv.email&&<a href={`mailto:${drv.email}?subject=Resumen servicios&body=${encodeURIComponent(summ)}`} className="btn bbl"><Ic n="snd" s={12}/> Email</a>}
        <a href={wa(drv.phone,summ)} className="btn bgr"><Ic n="wa" s={12}/> Enviar WA</a>
      </div>
    </div></div>);
}
function RptMod({drivers,reservations,onClose}){
  const[from,setFrom]=useState(TD);const[to,setTo]=useState(TD);const[srch,setSrch]=useState("");
  const gT=did=>reservations.filter(r=>r.driverId===did&&r.date>=from&&r.date<=to&&FIN.includes(r.status));
  const fd=drivers.filter(d=>!srch||d.name.toLowerCase().includes(srch.toLowerCase()));
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh"><div className="mt">Reportes por WhatsApp</div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      <div className="mb">
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div className="fp"><label>Desde</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div>
          <div className="fp"><label>Hasta</label><input type="date" value={to} onChange={e=>setTo(e.target.value)}/></div>
        </div>
        <SI value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar chofer..." style={{marginBottom:9}}/>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {fd.map(d=>{const t=gT(d.id);const total=t.reduce((s,r)=>s+(r.driverPrice||0),0);return(
            <div key={d.id} style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"10px 12px",display:"flex",alignItems:"center",gap:9}}>
              <Av id={d.id} text={d.avatar} size={30} fs={10}/>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12.5}}>{d.name}</div><div style={{fontSize:10.5,color:"var(--mu2)"}}>{t.length} servicio(s) · ${n$(total)}</div></div>
              {t.length>0?<a href={wa(d.phone,mReport(d,t,from,to))} className="btn bgr sm"><Ic n="wa" s={11}/> Enviar</a>:<span style={{fontSize:10.5,color:"var(--mu)"}}>Sin servicios</span>}
            </div>
          );})}
        </div>
      </div>
      <div className="mf"><button className="btn bg2" onClick={onClose}>Cerrar</button></div>
    </div></div>);
}
function AssModal({res,drivers,onClose,onAss,isR}){
  const[sel,setSel]=useState(res.driverId||null);const[srch,setSrch]=useState("");
  const rv=(res.vehicleType||"SEDAN").toUpperCase();
  const fd=drivers.filter(d=>d.active&&(!srch||d.name.toLowerCase().includes(srch.toLowerCase())||d.plate?.toLowerCase().includes(srch.toLowerCase())));
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh"><div><div className="mt">{isR?"Reasignar":"Asignar"} chofer</div><div style={{fontSize:11,color:"var(--mu2)",marginTop:2}}><span className="chip">{res.code}</span> · {res.passengerName} · {fD(res.date)} {res.time}hs · <VB type={rv}/></div></div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      <div className="mb">
        <SI value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar por nombre o patente..." style={{marginBottom:9}}/>
        <div className="dcg">
          {fd.map(d=>{const exp=licE(d);const ls=licS(d);const ok=canDo(d,res);const blocked=exp||!ok;const isCur=d.id===res.driverId;const dv=(d.vehicleType||"SEDAN").toUpperCase();
            return(<div key={d.id} className={`dcc${sel===d.id?" sel":""}${blocked?" inc":""}`} onClick={()=>!blocked&&setSel(d.id)}>
              <div style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:4}}>
                <Av id={d.id} text={d.avatar} size={24} fs={8}/>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:11}}>{d.name}</div><VB type={dv}/><div style={{fontSize:10,color:"var(--mu2)"}}>{d.plate}</div></div>
                {sel===d.id&&<Ic n="chk" s={12}/>}
              </div>
              <div className="rat"><Ic n="star" s={9}/> {d.rating}</div>
              <div style={{fontSize:9.5,marginTop:2,color:ls.c}}>{ls.l}</div>
              {!ok&&!exp&&<div style={{fontSize:9.5,color:"var(--re)"}}>Vehículo incompatible</div>}
              {exp&&<div style={{fontSize:9.5,color:"var(--re)"}}>Licencia vencida</div>}
              {isCur&&<div style={{fontSize:9.5,color:"var(--ac)"}}>Actual</div>}
            </div>);
          })}
          {fd.length===0&&<div style={{gridColumn:"1/-1",color:"var(--mu)",textAlign:"center",padding:16,fontSize:12}}>Sin resultados</div>}
        </div>
      </div>
      <div className="mf"><button className="btn bg2" onClick={onClose}>Cancelar</button><button className="btn bp" disabled={!sel||sel===res.driverId} onClick={()=>onAss(res.id,sel)}><Ic n="chk" s={12}/> {isR?"Reasignar":"Asignar"} y notificar</button></div>
    </div></div>);
}
function WAMod({res,drv,mode,onClose,cancelMsg}){
  const[am,setAm]=useState(mode);
  const msg=am==="alert"?mAlert(res):am==="drv"?mDrv(res,drv):am==="cancel_notif"?(props.cancelMsg||`Servicio ${res.code} cancelado`):mPax(res,drv);
  const phone=am==="pax"?res.passengerPhone:drv?.phone;
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh"><div style={{display:"flex",gap:6,alignItems:"center"}}><Ic n="wa" s={15}/><div className="mt">Mensajes WhatsApp</div></div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      <div className="mb">
        <div className="tabs" style={{marginBottom:11}}>
          {mode!=="cancel_notif"&&<button className={`tab${am==="alert"?" on":""}`} onClick={()=>setAm("alert")}>Alerta chofer</button>}
          {mode!=="cancel_notif"&&<button className={`tab${am==="drv"?" on":""}`} onClick={()=>setAm("drv")}>Info chofer</button>}
          {mode!=="cancel_notif"&&<button className={`tab${am==="pax"?" on":""}`} onClick={()=>setAm("pax")}>Pasajero</button>}
          {mode==="cancel_notif"&&<div style={{fontSize:12,color:"var(--re)",fontWeight:600}}>⚠️ Avisar al chofer que el servicio fue cancelado</div>}
        </div>
        <div style={{fontSize:11,color:"var(--mu)",marginBottom:7}}>Para: <strong style={{color:"var(--tx)"}}>{am==="pax"?res.passengerName:drv?.name}</strong> · {phone}</div>
        <div className="wp">{msg}</div>
      </div>
      <div className="mf"><button className="btn bg2" onClick={onClose}>Cerrar</button><a href={wa(phone||"",msg)} className="btn bgr"><Ic n="wa" s={12}/> Abrir WhatsApp</a></div>
    </div></div>);
}
// ── DETAIL MODAL ───────────────────────────────────────────────────────────────
// ── RICH RESERVATION DETAIL VIEW ─────────────────────────────────────────────
function ResDetailView({res,drv}){
  const fmtTs=ts=>{if(!ts)return null;try{const d=new Date(ts);return`${fD(d.toISOString().split("T")[0])} a las ${d.toTimeString().slice(0,5)}hs`;}catch{return ts;}};
  return(
    <div>
      {/* Status timeline */}
      <div style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"12px 14px",marginBottom:14}}>
        <div style={{fontSize:10.5,color:"var(--mu2)",marginBottom:9,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px"}}>Estado actual</div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:res.assignedAt||res.confirmedAt||res.statusAt?10:0}}>
          <Bdg status={res.status}/>
          {res.statusAt&&<span style={{fontSize:11,color:"var(--mu2)"}}>{fmtTs(res.statusAt)}{res.statusBy?` · por ${res.statusBy}`:""}</span>}
        </div>
        {/* Timeline */}
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {res.createdAt&&<div style={{display:"flex",gap:8,alignItems:"center",fontSize:11}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"var(--bl)",flexShrink:0}}/>
            <span style={{color:"var(--mu2)"}}>Creado</span>
            <span style={{color:"var(--mu)"}}>{fmtTs(res.createdAt)}</span>
          </div>}
          {res.assignedAt&&<div style={{display:"flex",gap:8,alignItems:"center",fontSize:11}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"var(--am)",flexShrink:0}}/>
            <span style={{color:"var(--mu2)"}}>Asignado</span>
            <span style={{color:"var(--mu)"}}>{fmtTs(res.assignedAt)}{res.assignedBy?` · por ${res.assignedBy}`:""}</span>
          </div>}
          {res.confirmedAt&&<div style={{display:"flex",gap:8,alignItems:"center",fontSize:11}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"var(--gr)",flexShrink:0}}/>
            <span style={{color:"var(--mu2)"}}>Confirmado</span>
            <span style={{color:"var(--mu)"}}>{fmtTs(res.confirmedAt)}{res.confirmedBy?` · por ${res.confirmedBy}`:""}</span>
          </div>}
          {res.statusAt&&FIN.includes(res.status)&&<div style={{display:"flex",gap:8,alignItems:"center",fontSize:11}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:SM[res.status]?.c||"var(--mu)",flexShrink:0}}/>
            <span style={{color:"var(--mu2)"}}>{SM[res.status]?.l||res.status}</span>
            <span style={{color:"var(--mu)"}}>{fmtTs(res.statusAt)}{res.statusBy?` · por ${res.statusBy}`:""}</span>
          </div>}
          {res.rejectedAt&&<div style={{display:"flex",gap:8,alignItems:"center",fontSize:11}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"var(--re)",flexShrink:0}}/>
            <span style={{color:"var(--re)",fontWeight:600}}>Rechazado</span>
            <span style={{color:"var(--mu)"}}>{fmtTs(res.rejectedAt)}{res.rejectedBy?` · por ${res.rejectedBy}`:""}</span>
          </div>}
        </div>
      </div>

      {/* Assigned driver */}
      {drv&&<div style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"12px 14px",marginBottom:14}}>
        <div style={{fontSize:10.5,color:"var(--mu2)",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px"}}>Chofer asignado</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <Av id={drv.id} text={drv.avatar} size={38} fs={12}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:13}}>{drv.name}</div>
            <div style={{fontSize:11.5,color:"var(--mu2)"}}>{drv.vehicleBrand} {drv.vehicleModel} · <strong>{drv.plate}</strong></div>
            <div style={{fontSize:11.5,color:"var(--mu2)"}}>{drv.phone}</div>
          </div>
          <VB type={(drv.vehicleType||"SEDAN").toUpperCase()}/>
        </div>
      </div>}

      {/* Trip details */}
      <div style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"12px 14px",marginBottom:res.status==="noshow"&&res.noShowPhotos?14:0}}>
        <div style={{fontSize:10.5,color:"var(--mu2)",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px"}}>Detalle del servicio</div>
        {[["Empresa",res.company],["Cód. proveedor",res.providerCode],["Pasajero",res.passengerName],["Teléfono",res.passengerPhone],["Email",res.passengerEmail||"—"],["Fecha",fD(res.date)],["Hora",res.time+"hs"],["Pax",`${res.pax} · ${res.luggage||0} bultos`],["Vehículo",<VB type={(res.vehicleType||"SEDAN").toUpperCase()}/>],["Tarifa cliente",`$${n$(res.price)}`],["Valor chofer",`$${n$(res.driverPrice)}`],["Origen",res.origin],["Destino",res.destination],...(res.isArrival&&res.flightNumber?[["Vuelo",<span>✈️ {res.flightNumber} <a href={flL(res.flightNumber)} target="_blank" rel="noreferrer" className="btn bbl sm" style={{fontSize:10,padding:"2px 6px",marginLeft:4}}>Estado</a></span>]]:[]),...(res.driverLink?[["Driver Link",<a href={res.driverLink} target="_blank" rel="noreferrer" style={{color:"var(--ac)",fontSize:12}}>{res.driverLink.slice(0,40)}</a>]]:[]),["Notas",res.notes||"—"]].map(([k,v])=><DR key={k} k={k} v={v}/>)}
      </div>

      {/* No Show evidence */}
      {res.status==="noshow"&&res.noShowPhotos&&<div style={{background:"rgba(236,72,153,.08)",border:"1px solid rgba(236,72,153,.3)",borderRadius:"var(--r)",padding:"12px 14px"}}>
        <div style={{fontSize:11,color:"var(--pk)",fontWeight:700,marginBottom:10}}>👻 EVIDENCIA NO SHOW — {res.noShowPhotos.length} fotos</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {res.noShowPhotos.map((p,i)=>p&&(
            <div key={i}>
              <img src={p.data} alt={p.label||""} style={{width:"100%",borderRadius:7,border:"1px solid rgba(236,72,153,.3)",cursor:"pointer"}} onClick={()=>{const w=window.open();w.document.write(`<img src="${p.data}" style="max-width:100%;height:auto"/><p style="font-family:sans-serif;font-size:12px">${p.label||""}</p>`);}}/>
              <div style={{fontSize:9.5,color:"var(--mu2)",marginTop:3,textAlign:"center",lineHeight:1.3}}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}

function DetModal({res,drv,rt,role,onClose,onCnf,onSt,onDel,onAss,onReA,onSv}){
  const[tab,setTab]=useState("info");const[edit,setEdit]=useState(false);const[f,setF]=useState({...res});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const fin=FIN.includes(res.status);const[cdel,setCdel]=useState(false);const[cst,setCst]=useState(false);
  const ap=gPx(f.origin,f.destination,f.vehicleType,rt);const noR=!ap&&f.origin&&f.destination;
  const canEdit=role!=="driver";
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh">
        <div><div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2}}><span className="chip">{res.code}</span><span style={{fontSize:10.5,color:"var(--mu2)"}}>{res.providerCode}</span></div><div className="mt">{res.passengerName}</div></div>
        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
          {!cdel&&!cst&&!edit&&canEdit&&<>
            {!fin&&!res.driverId&&<button className="btn bam sm" onClick={onAss}><Ic n="user" s={10}/> Asignar</button>}
            {!fin&&res.status==="assigned"&&drv&&<button className="btn bp sm" onClick={()=>onCnf(res.id)}><Ic n="chk" s={10}/> Confirmar</button>}
            {!fin&&<button className="btn bg2 sm" style={{borderColor:"rgba(239,68,68,.4)",color:"var(--re)"}} onClick={()=>setCst(true)}><Ic n="chart" s={10}/> Estado</button>}
            <button className="btn bg2 sm" onClick={()=>setEdit(true)}><Ic n="edit" s={10}/> Editar</button>
          </>}
          <Bdg status={res.status}/><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      </div>
      <div className="mb">
        <div className="tabs">{["info","drv","msg"].map(t=><button key={t} className={`tab${tab===t?" on":""}`} onClick={()=>{setTab(t);setEdit(false);}}>{t==="info"?"Información":t==="drv"?"Chofer":"Mensajes WA"}</button>)}</div>
        {tab==="info"&&(edit&&canEdit?(
          <div className="fg">
            <div className="fp"><label>Empresa</label><input {...sf("company")}/></div>
            <div className="fp"><label>Cód. proveedor</label><input {...sf("providerCode")}/></div>
            <div className="fp"><label>Pasajero</label><input {...sf("passengerName")}/></div>
            <div className="fp"><label>Teléfono</label><input {...sf("passengerPhone")}/></div>
            <div className="fp"><label>Fecha (DD-MM-AAAA)</label><input value={fD(f.date)} onChange={e=>setF(p=>({...p,date:tI(e.target.value)}))} placeholder="dd-mm-aaaa"/></div>
            <div className="fp"><label>Hora (HH:MM)</label><input type="time" {...sf("time")}/></div>
            <div className="fp"><label>Pax</label><input type="number" {...sf("pax")}/></div>
            <div className="fp"><label>Equipaje</label><input type="number" {...sf("luggage")}/></div>
            <div className="fp full"><label>Origen</label><input {...sf("origin")}/></div>
            <div className="fp full"><label>Destino</label><input {...sf("destination")}/></div>
            <div className="fp"><label>Vehículo</label><select value={f.vehicleType} onChange={e=>setF(p=>({...p,vehicleType:e.target.value}))}>{VT.map(v=><option key={v}>{v}</option>)}</select></div>
            <div className="fp"><label>Tarifa cliente ($)</label><input type="number" {...sf("price")}/></div>
            {noR&&<div className="pw2 full"><Ic n="warn" s={12}/> Ruta fuera de tarifario. Ingresá el valor manualmente.</div>}
            <div className="fp"><label>Valor chofer ($){ap?` — sug: $${n$(ap)}`:""}</label><input type="number" value={f.driverPrice||""} onChange={e=>setF(p=>({...p,driverPrice:parseFloat(e.target.value)}))} placeholder={ap?String(ap):"0"}/></div>
            <div className="fp full" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><label style={{fontSize:12.5,color:"var(--tx)"}}>Arribo con vuelo</label><Tog checked={!!f.isArrival} onChange={e=>setF(p=>({...p,isArrival:e.target.checked}))}/></div>
            {f.isArrival&&<div className="fp"><label>Nro. vuelo</label><input {...sf("flightNumber")}/></div>}
            <div className="fp full"><label>Driver Link</label><input {...sf("driverLink")}/></div>
            <div className="fp full"><label>Notas</label><textarea {...sf("notes")} rows={2}/></div>
            <div className="fp full" style={{flexDirection:"row",gap:6}}>
              <button className="btn bp" onClick={()=>{onSv(f);setEdit(false);}}><Ic n="chk" s={12}/> Guardar</button>
              <button className="btn bg2" onClick={()=>{setF({...res});setEdit(false);}}>Cancelar</button>
            </div>
          </div>
        ):(
          <ResDetailView res={res} drv={drv}/>
        ))}
        {tab==="drv"&&(drv?(
          <div>
            <div style={{display:"flex",gap:11,alignItems:"center",background:"var(--s2)",borderRadius:"var(--r)",padding:12,marginBottom:11}}>
              <Av id={drv.id} text={drv.avatar} size={38} fs={12}/>
              <div><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14}}>{drv.name}</div><div style={{color:"var(--mu2)",fontSize:12}}>{drv.vehicleBrand} {drv.vehicleModel} · {drv.plate}</div><div style={{color:"var(--mu2)",fontSize:12}}>{drv.phone}</div></div>
            </div>
            {!fin&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <a href={wa(drv.phone,mAlert(res))} className="btn bgr"><Ic n="wa" s={12}/> Alerta</a>
              {canEdit&&<button className="btn bg2" onClick={onReA}><Ic n="swap" s={12}/> Reasignar</button>}
              {canEdit&&res.status==="assigned"&&<button className="btn bp" onClick={()=>onCnf(res.id)}><Ic n="chk" s={12}/> Confirmar</button>}
            </div>}
          </div>
        ):<div className="empty">👨‍✈️ Sin chofer{canEdit&&<><br/><button className="btn bam" style={{marginTop:9}} onClick={onAss}><Ic n="plus" s={12}/> Asignar</button></>}</div>)}
        {tab==="msg"&&(
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            {drv?(<>
              <div><div style={{fontSize:11,color:"var(--mu2)",marginBottom:5}}>Alerta al chofer — sin datos del pasajero</div><div className="wp">{mAlert(res)}</div><a href={wa(drv.phone,mAlert(res))} className="btn bgr" style={{marginTop:6,display:"inline-flex"}}><Ic n="wa" s={12}/> Enviar a {drv.name.split(" ")[0]}</a></div>
              <div><div style={{fontSize:11,color:"var(--mu2)",marginBottom:5}}>Info completa al chofer</div><div className="wp">{mDrv(res,drv)}</div><a href={wa(drv.phone,mDrv(res,drv))} className="btn bgr" style={{marginTop:6,display:"inline-flex"}}><Ic n="wa" s={12}/> Enviar info completa</a></div>
              <div><div style={{fontSize:11,color:"var(--mu2)",marginBottom:5}}>Confirmación al pasajero</div><div className="wp">{mPax(res,drv)}</div><a href={wa(res.passengerPhone,mPax(res,drv))} className="btn bp" style={{marginTop:6,display:"inline-flex"}}><Ic n="wa" s={12}/> Enviar a pasajero</a></div>
            </>):<div className="empty">Asigná un chofer para ver los mensajes</div>}
          </div>
        )}
      </div>
      <div className="mf">
        {!cdel&&!cst&&<>
          {!edit&&canEdit&&<button className="btn bg2" onClick={()=>setEdit(true)}><Ic n="edit" s={12}/> Editar</button>}
          {!fin&&!res.driverId&&canEdit&&<button className="btn bam" onClick={onAss}><Ic n="user" s={12}/> Asignar</button>}
          {!fin&&canEdit&&res.status==="assigned"&&drv&&<button className="btn bp" onClick={()=>onCnf(res.id)}><Ic n="chk" s={12}/> Confirmar</button>}
          {!fin&&canEdit&&<button className="btn bg2" style={{borderColor:"rgba(239,68,68,.4)",color:"var(--re)"}} onClick={()=>setCst(true)}><Ic n="chart" s={12}/> Estado</button>}
          {canEdit&&<button className="btn bg2" style={{color:"var(--re)"}} onClick={()=>setCdel(true)}><Ic n="trash" s={11}/></button>}
        </>}
        {cst&&<div style={{display:"flex",gap:5,flexWrap:"wrap",flex:1}}>
          <button className="btn bgr sm" onClick={()=>{onSt(res.id,"completed");setCst(false);}}>✅ Completado</button>
          <button className="btn bam sm" onClick={()=>{onSt(res.id,"cancelled_pay");setCst(false);}}>Cancel. con pago</button>
          <button className="btn bre sm" onClick={()=>{onSt(res.id,"cancelled_nopay");setCst(false);}}>Cancel. sin pago</button>
          <button className="btn bpk sm" onClick={()=>{onSt(res.id,"noshow");setCst(false);}}>No Show</button>
          <button className="btn bg2 sm" onClick={()=>setCst(false)}><Ic n="X" s={10}/></button>
        </div>}
        {cdel&&<div style={{display:"flex",gap:6,alignItems:"center",flex:1}}>
          <span style={{fontSize:12,color:"var(--re)"}}>¿Eliminar?</span>
          <button className="btn bre sm" onClick={()=>{onDel(res.id);setCdel(false);}}>Sí</button>
          <button className="btn bg2 sm" onClick={()=>setCdel(false)}>No</button>
        </div>}
      </div>
    </div></div>);
}
// ── IMPORT PAGE ────────────────────────────────────────────────────────────────
function ImpPage({reservations,pR,toast,routePrices,providers}){
  const[mode,setMode]=useState("gmail"); // gmail | file | paste
  const[loading,setLoading]=useState(false);
  const[gmailStep,setGmailStep]=useState("idle"); // idle | fetching | parsing | done
  const[emails,setEmails]=useState([]); // raw email list from gmail
  const[parsing,setParsing]=useState(false);
  const[parseIdx,setParseIdx]=useState(0);
  const[prev,setPrev]=useState(null);
  const[saved,setSaved]=useState(0);
  const[err,setErr]=useState("");
  const[days,setDays]=useState("3");
  const[selEmails,setSelEmails]=useState(new Set());
  const[fileProv,setFileProv]=useState("");

  // Provider patterns to identify and skip non-booking emails
  const PROV_SENDERS={
    "civitatis.com":{id:"pv2",name:"Civitatis",skip:/(cancelad|reembolso|modificad|pedido|recordatorio|factur|pago|informe)/i},
    "mistertransfer.com":{id:"pv7",name:"Mister Transfer",skip:/(CANCELADA|CANCELLED|reminder|MODIFICATION)/i},
    "transferz.com":{id:"pv3",name:"Transfer Z",skip:/(cancelled|updated|changes)/i},
    "mozio.com":{id:"pv5",name:"Mozio",skip:/(cancelled|cancel)/i},
    "mytransfers.com":{id:"pv6",name:"My Transfers",skip:/(claim|no show|did not show|cancel)/i},
    "ineedtours.com":{id:"pv10",name:"I Need Tours",skip:/(informe semanal|confirmar lectura|URGENTE)/i},
    "travelthru.com":{id:"pv4",name:"Travel Thru",skip:/(incident|closed|cancel)/i},
    "drivado.com":{id:"pv9",name:"Drivado",skip:/(cancel)/i},
  };

  const getSender=from=>{
    for(const[domain,info] of Object.entries(PROV_SENDERS)){
      if(from.toLowerCase().includes(domain))return{domain,...info};
    }
    return null;
  };

  const fetchEmails=async()=>{
    setGmailStep("fetching");setErr("");setEmails([]);setPrev(null);setSaved(0);
    try{
      const q=`from:(civitatis.com OR mistertransfer.com OR transferz.com OR mozio.com OR mytransfers.com OR ineedtours.com OR travelthru.com OR drivado.com) newer_than:${days}d`;
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:8000,
          system:`Sos un asistente que lee emails de reservas de traslados en Buenos Aires.
Tu tarea: analizar emails de proveedores y extraer reservas nuevas.

PROVEEDORES CONOCIDOS Y SUS FORMATOS:
- CIVITATIS: "Nuevo traslado" en asunto. Extrae: NÚMERO DE RESERVA (= providerCode), TRASLADO (origen→destino), FECHA, HORA, NOMBRE+APELLIDOS (= pasajero), TIPO DE VEHÍCULO (Turismo 3 plazas=SEDAN, Minivan=VAN), NÚMERO DE VIAJEROS (=pax), PRECIO NETO en USD (=price), AEROLÍNEA Y NÚMERO DE VUELO (=flightNumber), HOTEL O PUNTO DE RECOGIDA (=origin si es salida, destination si es llegada). company="Civitatis"
- TRANSFER Z: "Journey XXXX has been directly assigned". Extrae: Journey code (=providerCode), Pickup date, From, To, Travellers(=pax), Suitcases(=luggage), Vehicle category, "You will receive"(=price en USD), Driver link, Phone number(=passengerPhone), Name(=passengerName). company="Transfer Z". IGNORAR emails "has been cancelled" o "have been updated"
- MISTER TRANSFER: "B2B - MisterTransfer - Booking:XXXX CONFIRMED". Extrae: Reservation Reference Number(=providerCode), Pickup date and time(=date+time), Pickup point(=origin), Drop off(=destination), Main passenger(=passengerName), Main passenger phone(=passengerPhone), Vehicle type(stdcar3=SEDAN,stdvan7=VAN,stdminibus=HIACE), Passengers adults(=pax), Amount(=price en USD), Flight number. company="Mister Transfer". IGNORAR emails CANCELADA, MODIFICATION, reminder
- MOZIO: "reservation on ANGELS has been booked". Para emails con IDA Y VUELTA: crear DOS reservas separadas (trip y return trip), cada una con su propio código (Confirmation Number y Return Confirmation Number). Extrae: Confirmation Number(=providerCode), fecha y hora del pickup, Pickup(=origin), Dropoff(=destination), passenger Name, Phone Number, Flight Number, Airline, You will be paid(=price). company="Mozio". IMPORTANTE: dividir el pago en 2 si hay round trip
- MY TRANSFERS: "Booking number: XXXX". Extrae: Booking number(=providerCode), Lead passenger(=passengerName), Mobile number(=passengerPhone), From(=origin), Pickup date and time, Flight number, To(=destination), Occupants adults(=pax), Luggage included(=luggage), You will be paid(=price en USD), Private Sedan=SEDAN, Private Van=VAN. company="My Transfers"
- I NEED TOURS: "Confirmación de Reserva". Extrae: Localizador(=providerCode), Fecha de Servicio, Pasajero. El cuerpo del email tiene poca info, el PDF tiene más - usar lo que haya. company="I Need Tours"
- TRAVEL THRU: "New Booking Received". Extrae: Booking ID(=providerCode), Date, Car type, From(=origin), To(=destination), Passenger, Phone, Adults(=pax), Flight number, Total Price(=price en USD). company="Travel Thru". IGNORAR emails "Incident closed"
- DRIVADO: "BOOKING DETAILS". Extrae: Booking ID(=providerCode), Journey Date and Time, Pickup(=origin), Drop Off(=destination), Name(=passengerName), Mobile(=passengerPhone), No. of Pax, Price en USD, Vehicle Type. company="Drivado"

MAPEO DE ORIGEN/DESTINO:
- Si contiene "Ezeiza" o "Ministro Pistarini" o "EZE" → "Aeropuerto Ezeiza Ministro Pistarini (EZE)"
- Si contiene "Aeroparque" o "Jorge Newbery" o "AEP" → "Aeroparque Jorge Newbery (AEP)"
- Si contiene "Buque Bus" o "BQB" → "Buque Bus (BQB)"
- Si contiene "Colonia Express" o "CLX" → "Colonia Express (CLX)"
- Si contiene "Quinquela" o "PQM" → "Terminal Cruceros Quinquela Martín (PQM)"
- Para hoteles/direcciones en Buenos Aires → usar la dirección COMPLETA tal cual aparece en el email, incluyendo nombre del hotel/edificio, calle, número, código postal. Ejemplo: "Minibait II Estudio en Palermo Soho, Gurruchaga 2271, C1425FEG Buenos Aires (CABA)". NUNCA simplificar a solo "Ciudad Autónoma de Buenos Aires (CABA)"
- Si la dirección está FUERA de CABA (por ejemplo en GBA, Provincia de Buenos Aires, Ezeiza ciudad, etc.) mantenerla completa y añadir nota: "⚠️ Fuera de CABA"

TIPO DE VEHICULO: SEDAN=Sedan/stdcar3/BUSINESS_SEDAN/Turismo 3 plazas/standard (1-3 pax), VAN=Van/Minivan SUV (4-7 pax), HIACE=MINIVAN/Minibus/stdvan7/Minivan grande (8-13 pax), SPRINTER=Sprinter/stdminibus (14+ pax)
isArrival=true cuando el origen es un aeropuerto/puerto/terminal

RESPONDE SOLO CON UN ARRAY JSON. Formato exacto por reserva:
{"providerCode":"","company":"","passengerName":"","passengerPhone":"","passengerEmail":"","date":"YYYY-MM-DD","time":"HH:MM","origin":"","destination":"","vehicleType":"SEDAN","pax":1,"luggage":0,"price":0,"currency":"USD","isArrival":false,"flightNumber":"","driverLink":"","notes":"","cancelled":false,"emailId":""}

Si el email es una CANCELACIÓN: pon cancelled:true y el providerCode correcto.
Si el email no contiene reservas válidas: devolvé [].
EMPIEZA SIEMPRE CON [`,
          mcp_servers:[{type:"url",url:"https://gmail.mcp.claude.com/mcp",name:"gmail"}],
          messages:[{role:"user",content:`Lee los emails de reservas de los últimos ${days} días del inbox de reservas@angelstt.com y extrae todas las reservas nuevas.

Usa la herramienta gmail_search_messages con query: "${q}" maxResults:50
Luego lee el cuerpo de cada email relevante con gmail_read_message.
Procesa SOLO emails de reservas nuevas (no cancelaciones, no modificaciones, no recordatorios, no informes).
Incluye el messageId del email en el campo "emailId" de cada reserva.
Devuelve el array JSON con todas las reservas encontradas.`}]
        })
      });
      if(!resp.ok){const e=await resp.json();throw new Error(e.error?.message||"Error "+resp.status);}
      const data=await resp.json();
      const txt=data.content.map(i=>i.type==="text"?i.text:i.type==="mcp_tool_result"?(Array.isArray(i.content)?i.content.filter(c=>c.type==="text").map(c=>c.text).join(""):String(i.content||"")):"").filter(Boolean).join("\n");
      const start=txt.indexOf("[");const end=txt.lastIndexOf("]");
      if(start===-1||end<=start)throw new Error("La IA no encontró reservas en los emails.");
      let arr;
      try{arr=JSON.parse(txt.slice(start,end+1));}catch(pe){throw new Error("Error parseando respuesta: "+pe.message);}
      if(!Array.isArray(arr))throw new Error("Respuesta inválida");
      // Enrich with provider IDs and driver prices
      const enriched=arr.map(r=>{
        // Use the selected file provider if available, otherwise match by name/code
        const pv=fp||providers.find(p=>p.name===r.company||p.code===r.company||p.name.toLowerCase()===r.company?.toLowerCase());
        // Check if already imported (same providerCode)
        const dup=reservations.find(x=>x.providerCode===r.providerCode&&!r.cancelled);
        return{...r,origin:normLoc(r.origin)||r.origin,destination:normLoc(r.destination)||r.destination,providerId:pv?.id||null,company:pv?.name||r.company,
          driverPrice:gPx(r.origin,r.destination,r.vehicleType,routePrices)||0,
          _dup:!!dup,_dupId:dup?.id};
      });
      setPrev(enriched);setGmailStep("done");
      const newCount=enriched.filter(r=>!r.cancelled&&!r._dup).length;
      const cancelCount=enriched.filter(r=>r.cancelled).length;
      toast(`📧 ${enriched.length} reservas en emails: ${newCount} nuevas, ${cancelCount} cancelaciones`);
    }catch(e){setErr("Error: "+e.message);setGmailStep("idle");}
  };

  const saveAll=async()=>{
    const ex=reservations.map(r=>r.code);
    let updated=[...reservations];
    let imported=0,cancelled=0;
    for(const r of(prev||[])){
      if(r.cancelled){
        // Mark existing reservation as cancelled
        const existing=updated.find(x=>x.providerCode===r.providerCode);
        if(existing&&!FIN.includes(existing.status)){
          updated=updated.map(x=>x.id===existing.id?{...x,status:"cancelled_nopay",statusAt:new Date().toISOString(),statusBy:"Gmail Auto"}:x);
          cancelled++;
        }
      }else if(!r._dup){
        const code=gc(ex);ex.push(code);
        updated.push({...r,id:"r"+Date.now()+Math.random().toString(36).slice(2),code,status:"pending",driverId:null,createdAt:new Date().toISOString()});
        imported++;
      }
    }
    await pR(updated);setPrev(null);setSaved(imported);
    toast(`✅ ${imported} importadas · ${cancelled} canceladas`);
  };

  
  // ── PDF file reading via Claude API (base64 document) ─────────────────────
  const parsePDF=async(file,fpId)=>{
    setLoading(true);setErr("");setPrev(null);setSaved(0);
    const fp=providers.find(p=>p.id===(fpId||fileProv));
    try{
      // Read file as base64
      const base64=await new Promise((res,rej)=>{
        const reader=new FileReader();
        reader.onload=()=>res(reader.result.split(",")[1]);
        reader.onerror=()=>rej(new Error("Error leyendo el archivo"));
        reader.readAsDataURL(file);
      });
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:4000,
          system:`Sos un parser de reservas de traslados.${fp?` El proveedor es: ${fp.name} (${fp.code}).`:""} Extrae TODAS las reservas del PDF y devolvé ÚNICAMENTE un array JSON válido comenzando con [ y terminando con ].

FORMATO DE SALIDA — un objeto por reserva:
{
  "providerCode": "ID numérico o alfanumérico de la reserva (ej: 2314423, VC3ISO, T2931371)",
  "passengerName": "nombre completo",
  "passengerPhone": "teléfono con código país sin espacios (ej: +51969571000)",
  "passengerEmail": "email o vacío",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "origin": "dirección completa de origen TAL COMO ESTÁ en el PDF",
  "destination": "dirección completa de destino TAL COMO ESTÁ en el PDF",
  "vehicleType": "SEDAN para Sedan/stdcar3, VAN para SUV/Minivan/Van, HIACE para Minibus/Minivan grande, SPRINTER para Sprinter/Bus",
  "pax": número_entero,
  "luggage": 0,
  "price": número,
  "currency": "USD",
  "flightNumber": "código de vuelo si hay (ej: LA2369, AR1340, United 818)",
  "notes": "comentarios para el chofer",
  "cancelled": false
}

REGLAS IMPORTANTES:
- providerCode = el ID/número de reserva del proveedor, NUNCA la sigla de la empresa
- Para Mozio: si hay "Return Confirmation Number" → crear DOS reservas separadas. La primera con Confirmation Number, la segunda con Return Confirmation Number. El precio "You will be paid: US$XX" se divide entre las dos. La segunda reserva tiene origen y destino invertidos.
- Para My Transfers: columnas son Pickup date | ID | Customer name | Customer phone | From | Arrival info | To | Departure info | Passengers | Transport name | Extras | Comments | Price
  - "Arrival info" es el vuelo cuando FROM es aeropuerto
  - "Departure info" es el vuelo cuando TO es aeropuerto
  - "Private Sedan (1-3)" → SEDAN, "Private SUV (1-4)" → VAN, "Private Minivan" → HIACE
  - Teléfono viene como "(+51) 969571000" → limpiar a "+51969571000"
- Para I Need Tours: el PDF adjunto tiene Localizador, Pasajero, Fecha, Hora, Origen, Destino
- Para Travel Thru: ID numérico, Local Time tiene fecha+hora juntos "DD/M/YY HH:MM"
- Normalizar: "Aeroparque"/"AEP"/"Jorge Newbery" → mantener dirección completa tal cual
- NO simplificar direcciones con hotel/calle a solo "CABA"

CASO ESPECIAL MOZIO ROUND-TRIP: Cuando un email Mozio tiene viaje de ida Y vuelta:
- Crea DOS objetos separados
- El primero: providerCode=Confirmation Number, date/time del Trip Details
- El segundo: providerCode=Return Confirmation Number, date/time del Return Trip Details, origen y destino invertidos
- O bien: en el PRIMER objeto agrega campos extra: returnProviderCode, returnDate (YYYY-MM-DD), returnTime (HH:MM), returnFlightNumber
- El precio total (US$34) se divide por 2 para cada reserva si son iguales; si dicen precios distintos usar cada uno

EMPIEZA DIRECTAMENTE CON [`,
          messages:[{role:"user",content:[
            {type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}},
            {type:"text",text:`${fp?`PROVEEDOR: ${fp.name} (${fp.code})\n\n`:""}Extraé TODAS las reservas de este PDF. Devolvé solo el JSON array comenzando con [.`}
          ]}]
        })
      });
      if(!resp.ok){const e=await resp.json();throw new Error(e.error?.message||"API "+resp.status);}
      const data=await resp.json();
      // Extract text from all content blocks (text or tool results)
      const txt=data.content.map(i=>
        i.type==="text"?i.text:
        i.type==="tool_result"?(Array.isArray(i.content)?i.content.map(c=>c.text||"").join(""):String(i.content||""))
        :""
      ).filter(Boolean).join("\n");
      if(!txt.trim())throw new Error("La API no devolvió respuesta. Verificá el PDF.");
      // Find JSON array in response
      let clean=txt.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
      const start=clean.indexOf("[");const end=clean.lastIndexOf("]");
      if(start===-1||end<=start){
        // Try to show what came back for debugging
        const preview=txt.slice(0,200);
        throw new Error("No se encontró JSON válido. Respuesta: "+preview);
      }
      clean=clean.slice(start,end+1);
      const arr=JSON.parse(clean);
      if(!Array.isArray(arr)||arr.length===0)throw new Error("No se encontraron reservas en el PDF.");
      const enriched=arr.map(r=>{
        const pv=fp||providers.find(p=>p.name===r.company||p.code===r.company);
        const orig2=normLoc(r.origin)||r.origin;
        const dest2=normLoc(r.destination)||r.destination;
        const dup=reservations.find(x=>x.providerCode===r.providerCode&&!r.cancelled);
        return{...r,
          origin:orig2,
          destination:dest2,
          providerId:pv?.id||fp?.id||null,
          company:pv?.name||fp?.name||r.company||"",
          driverPrice:gPx(orig2,dest2,r.vehicleType,routePrices)||0,
          isDup:!!dup,
          status:dup?"dup":(r.cancelled?"cancelled_nopay":r.status||"pending")
        };
      });
      if(enriched.length===0)throw new Error("El PDF no contenía reservas reconocibles.");
      setPrev(enriched);
    }catch(e){
      const msg=e.message||"Error desconocido";
      setErr("❌ "+msg);
      console.error("parsePDF error:",e);
    }
    setLoading(false);
  };

// ── Per-provider CSV/file parsers ─────────────────────────────────────────────
const PROV_PARSERS={
  // Transfer Z: semicolon-delimited, columns: JOURNEY CODE, REFERENCE, STATUS,
  // PICKUP DATE (YYYY-MM-DD HH:MM), VEHICLE CATEGORY, FROM, TO,
  // PASSENGER FIRST NAME, PASSENGER LAST NAME, PASSENGER EMAIL, PASSENGER PHONE NUMBER,
  // FLIGHT NUMBER, PASSENGERS, LUGGAGE, COMMENTS FOR DRIVER
  pv3:(rows,pv)=>rows.map(r=>{
    const pickup=(r["PICKUP DATE"]||r["Pickup Date"]||"").trim();
    const date=pickup.slice(0,10);
    const time=pickup.length>10?pickup.slice(11,16):"";
    const vtRaw=(r["VEHICLE CATEGORY"]||r["Vehicle Category"]||"SEDAN").toUpperCase();
    const vt={SEDAN:"SEDAN",BUSINESS_SEDAN:"SEDAN",VAN:"VAN",SUV:"VAN",MINIVAN:"HIACE",SPRINTER:"SPRINTER"}[vtRaw]||"SEDAN";
    const st=(r["STATUS"]||r["Status"]||"").toUpperCase()==="CANCELLED"?"cancelled_nopay":"pending";
    const orig=normLoc(r["FROM"]||r["From"]||"");
    const dest=normLoc(r["TO"]||r["To"]||"");
    const phone=(r["PASSENGER PHONE NUMBER"]||r["Passenger Phone Number"]||"").replace(/\s/g,"");
    const notes=[r["COMMENTS FOR DRIVER"]||r["Comments For Driver"]||"",
                 r["BABY SEATS"]?`Baby seats: ${r["BABY SEATS"]}`:"",
                 r["CHILD SEATS"]?`Child seats: ${r["CHILD SEATS"]}`:"",
                 r["PETS"]?`Pets: ${r["PETS"]}`:""].filter(Boolean).join(" | ");
    return{providerCode:r["JOURNEY CODE"]||r["Journey Code"]||"",
      passengerName:((r["PASSENGER FIRST NAME"]||r["Passenger First Name"]||"")+" "+(r["PASSENGER LAST NAME"]||r["Passenger Last Name"]||"")).trim(),
      passengerPhone:phone,passengerEmail:r["PASSENGER EMAIL"]||r["Passenger Email"]||"",
      date,time,origin:orig,destination:dest,vehicleType:vt,
      pax:parseInt(r["PASSENGERS"]||r["Passengers"]||1)||1,
      luggage:parseInt(r["LUGGAGE"]||r["Luggage"]||0)||0,
      flightNumber:r["FLIGHT NUMBER"]||r["Flight Number"]||"",
      notes,status:st,cancelled:st!=="pending"};
  }),

  // Civitatis: semicolon-delimited
  // Columns: Reserva, Fecha(DD/MM/YYYY), Hora, País, Nombre, Apellidos, Origen, Destino,
  //          Pax, Vuelo, Precio neto, Tipo vehículo
  pv2:(rows,pv)=>rows.map(r=>{
    const rawDate=(r["Fecha"]||r["fecha"]||"").trim();
    let date="";
    if(rawDate.includes("/")){
      const parts=rawDate.split("/");
      const[d,m,y]=parts;
      const year=y&&y.length===2?`20${y}`:y||"2026";
      date=`${year}-${String(parseInt(m)).padStart(2,"0")}-${String(parseInt(d)).padStart(2,"0")}`;
    }else date=rawDate.slice(0,10);
    const vtRaw=(r["Tipo vehículo"]||r["Tipo Vehículo"]||r["tipo_vehiculo"]||"SEDAN").toLowerCase();
    const vt=vtRaw.includes("mini")||vtRaw.includes("van")||vtRaw.includes("hiace")?"VAN":vtRaw.includes("sprinter")?"SPRINTER":"SEDAN";
    const orig=normLoc(r["Origen"]||r["origen"]||"");
    const dest=normLoc(r["Destino"]||r["destino"]||"");
    const nombre=(r["Nombre"]||r["nombre"]||"")+" "+(r["Apellidos"]||r["apellidos"]||"");
    return{providerCode:r["Reserva"]||r["reserva"]||r["ID"]||"",
      passengerName:nombre.trim(),passengerPhone:r["Teléfono"]||r["telefono"]||"",
      passengerEmail:r["Email"]||r["email"]||"",
      date,time:(r["Hora"]||r["hora"]||"").slice(0,5),
      origin:orig,destination:dest,vehicleType:vt,
      pax:parseInt(r["Pax"]||r["pax"]||r["Viajeros"]||1)||1,luggage:0,
      flightNumber:r["Vuelo"]||r["vuelo"]||r["Nro. vuelo"]||"",
      notes:r["Notas"]||r["notas"]||r["Observaciones"]||"",
      status:"pending",cancelled:false};
  }),

  // Mozio: comma or semicolon
  // Columns: Confirmation Number, Passenger Name, Phone, Email, Pickup Date, Pickup Time,
  //          From, To, Passengers, Vehicle Type, Flight Number, Price
  pv5:(rows,pv)=>{
    const out=[];
    rows.forEach(r=>{
      const vtRaw=(r["Vehicle Type"]||r["vehicle_type"]||"Sedan").toLowerCase();
      const vt=vtRaw.includes("suv")||vtRaw.includes("van")||vtRaw.includes("minivan")?"VAN":vtRaw.includes("bus")||vtRaw.includes("mini")?"HIACE":"SEDAN";
      const phone=(r["Phone"]||r["phone"]||r["Phone Number"]||"").replace(/\s/g,"");
      const name=r["Passenger Name"]||r["passenger_name"]||r["Name"]||"";
      const email=r["Email"]||r["email"]||"";
      const notes=r["Special Instructions"]||r["notes"]||r["Comments"]||"";
      const pax=parseInt(r["Passengers"]||r["passengers"]||1)||1;
      const totalPrice=parseFloat((r["Price"]||r["price"]||"0").replace(",","."))||0;
      const retCode=r["Return Confirmation Number"]||r["return_confirmation_number"]||"";
      const hasReturn=!!retCode;
      const price=hasReturn?Math.round((totalPrice/2)*100)/100:totalPrice;
      const pd=s=>{if(!s)return"";const d=s.slice(0,10);return d.includes("/")?d.split("/").reverse().join("-"):d;};
      const rawDate=r["Pickup Date"]||r["pickup_date"]||r["Date"]||"";
      const rawOrig=normLoc(r["Pickup Location"]||r["From"]||r["from"]||r["origin"]||"");
      const rawDest=normLoc(r["Dropoff Location"]||r["To"]||r["to"]||r["destination"]||"");
      // Main trip
      out.push({providerCode:r["Confirmation Number"]||r["confirmation_number"]||r["Booking ID"]||"",
        passengerName:name,passengerPhone:phone,passengerEmail:email,
        date:pd(rawDate),time:(r["Pickup Time"]||r["pickup_time"]||r["Time"]||"").slice(0,5),
        origin:rawOrig,destination:rawDest,vehicleType:vt,pax,luggage:0,price,currency:"USD",
        flightNumber:r["Flight Number"]||r["flight_number"]||"",notes,status:"pending",cancelled:false});
      // Return trip
      if(hasReturn){
        const retDateRaw=r["Return Pickup Date"]||r["return_pickup_date"]||r["Return Date"]||"";
        const retTime=(r["Return Pickup Time"]||r["return_pickup_time"]||r["Return Time"]||"").slice(0,5);
        out.push({providerCode:retCode,passengerName:name,passengerPhone:phone,passengerEmail:email,
          date:pd(retDateRaw),time:retTime,
          origin:rawDest,destination:rawOrig,// swapped
          vehicleType:vt,pax,luggage:0,price,currency:"USD",
          flightNumber:r["Return Flight Number"]||r["return_flight_number"]||"",
          notes,status:"pending",cancelled:false});
      }
    });
    return out;
  },
  pv7:(rows,pv)=>{
    const MIT_VT={stdcar3:"SEDAN",stdcar2:"SEDAN",stdmvan4:"VAN",mbus12:"SPRINTER",
      minivan:"VAN",van:"VAN",suv:"VAN",sedan:"SEDAN",sprinter:"SPRINTER"};
    const parseMitDate=s=>{
      const p=(s||"").trim().split(" ");
      const dp=(p[0]||"").split("/");
      if(dp.length!==3)return{date:"",time:""};
      const[d,m,y]=dp;
      return{date:`${y}-${String(parseInt(m)).padStart(2,"0")}-${String(parseInt(d)).padStart(2,"0")}`,
             time:(p[1]||"").slice(0,5)};
    };
    const resolveLoc=(raw,flight)=>{
      const r2=(raw||"").trim();
      if(/^AIRPORT:/i.test(r2)){
        // Detect EZE vs AEP: international flights → EZE, domestic AR/LA/FO/WJ → AEP
        const fl=(flight||"").toUpperCase();
        const isDomestic=!fl||/^(AR|LA|FO|WJ|JA)\d/.test(fl.replace(/\s/g,""));
        return isDomestic?"Aeroparque Jorge Newbery (AEP)":"Aeropuerto Ezeiza Ministro Pistarini (EZE)";
      }
      const clean=r2.replace(/^(ZONE|PORT|STATION|HOTEL):\s*/i,"").trim();
      return normLoc(clean)||clean;
    };
    return rows.map(r=>{
      const dt=parseMitDate(r["Pickup Date"]||r["pickup_date"]||"");
      const flight=(r["Number"]||r["number"]||r["Flight Number"]||"").trim();
      const flightClean=flight.toLowerCase()==="no flight"?"":flight;
      const vtKey=(r["Car Type"]||r["car_type"]||"stdcar3").toLowerCase().trim();
      const vt=MIT_VT[vtKey]||(vtKey.includes("car")||vtKey.includes("sedan")?"SEDAN":vtKey.includes("van")?"VAN":vtKey.includes("bus")||vtKey.includes("sprinter")?"SPRINTER":"SEDAN");
      const orig=resolveLoc(r["Pickup"]||r["pickup"]||"",flightClean);
      const dest=resolveLoc(r["Dropoff"]||r["dropoff"]||"",flightClean);
      const phone=(r["Customer Phone"]||r["customer_phone"]||r["Phone"]||"").replace(/\s/g,"");
      const price=parseFloat((r["Price"]||"0").replace(",","."))||0;
      return{
        providerCode:r["Locator"]||r["locator"]||r["ID"]||"",
        passengerName:(r["Customer Name"]||r["customer_name"]||r["Name"]||"").trim(),
        passengerPhone:phone,passengerEmail:r["Email"]||r["email"]||"",
        date:dt.date,time:dt.time,
        origin:orig,destination:dest||"Ciudad Autónoma de Buenos Aires (CABA)",
        vehicleType:vt,pax:parseInt(r["Passengers"]||r["pax"]||1)||1,luggage:0,
        price,currency:r["Currency"]||r["currency"]||"USD",
        flightNumber:flightClean,
        notes:r["Extras"]||r["extras"]||r["Notes"]||"",
        status:"pending",cancelled:false
      };
    });
  },

  // Travel Thru: semicolon-delimited
  // Columns: ID, Ext ID, Created GMT, Local Time (DD/M/YY HH:MM = date+time together),
  //          GMT Time, Source, Total, Total after rebate, Currency,
  //          From, To, Distance Km, Car Class, Client, Company,
  //          First Name, Last Name, Email, Phone, Status, Flight Number, Extras
  pv4:(rows,pv)=>{
    const parseDate=s=>{
      const p=(s||"").trim().split(" ");
      const dp=(p[0]||"").split("/");
      if(dp.length!==3)return{date:"",time:""};
      const[d,m,y]=dp;const year=y.length===2?`20${y}`:y;
      return{date:`${year}-${String(parseInt(m)).padStart(2,"0")}-${String(parseInt(d)).padStart(2,"0")}`,
             time:(p[1]||"").slice(0,5)};
    };
    return rows.map(r=>{
      const dt=parseDate(r["Local Time"]||r["local_time"]||"");
      const carRaw=(r["Car Class"]||r["car_class"]||"").toLowerCase();
      const vt=carRaw.includes("van")||carRaw.includes("minivan")?"VAN":carRaw.includes("bus")?"HIACE":carRaw.includes("sprinter")?"SPRINTER":"SEDAN";
      const st=(r["Status"]||"").toLowerCase().includes("cancel")?"cancelled_nopay":"pending";
      const name=((r["First Name"]||r["first_name"]||"")+" "+(r["Last Name"]||r["last_name"]||"")).trim()||r["Client"]||r["client"]||"";
      const extras=r["Extras"]||r["extras"]||"";
      const notes=[r["Internal Notes"]||"",extras?"Extras: "+extras:""].filter(Boolean).join(" | ");
      return{
        providerCode:r["ID"]||r["id"]||r["Ext ID"]||"",
        passengerName:name,
        passengerPhone:(r["Phone"]||r["phone"]||"").replace(/\s/g,""),
        passengerEmail:r["Email"]||r["email"]||"",
        date:dt.date,time:dt.time,
        origin:normLoc(r["From"]||r["from"]||""),
        destination:normLoc(r["To"]||r["to"]||""),
        vehicleType:vt,
        pax:parseInt(r["Passengers"]||r["pax"]||1)||1,
        luggage:0,
        price:parseFloat((r["Total after rebate"]||r["Total"]||"0").replace(",","."))||0,
        currency:"USD",
        flightNumber:r["Flight Number"]||r["flight_number"]||r["Flight"]||"",
        notes,status:st,cancelled:st!=="pending"
      };
    });
  },
  // I Need Tours (NED): semicolon-delimited
  // Columns: Res. no;Supplier;Name;Type;Lead passenger;Pax(AD);Pax(CH);
  //          Start date(DD/MM/YYYY);Pick up time(HH:MM);
  //          Departure location;Arrival location;...;Currency;Net;Passenger telephone number
  // Vehicle: "Comfort Car 1-2 Pax"→SEDAN, "Comfort XL"→VAN, "Sprinter/Minibus"→SPRINTER
  pv10:(rows,pv)=>{
    const parseNEDDate=s=>{
      const p=(s||"").trim().split("/");
      if(p.length!==3)return"";
      const[d,m,y]=p;
      return`${y}-${String(parseInt(m)).padStart(2,"0")}-${String(parseInt(d)).padStart(2,"0")}`;
    };
    const nedVT=t=>{
      const tl=(t||"").toLowerCase();
      if(tl.includes("sprinter")||tl.includes("minibus")||tl.includes("bus"))return"SPRINTER";
      if(tl.includes("van")||tl.includes("xl"))return"VAN";
      return"SEDAN";
    };
    return rows.map(r=>{
      const paxAd=parseInt(r["Pax(AD)"]||r["pax(ad)"]||1)||1;
      const paxCh=parseInt(r["Pax(CH)"]||r["pax(ch)"]||0)||0;
      const price=parseFloat((r["Net"]||r["net"]||"0").replace(",","."))||0;
      const st=(r["Service status"]||r["service_status"]||"").toLowerCase();
      const cancelled=st.includes("cancel");
      return{
        providerCode:r["Res. no"]||r["res_no"]||r["ID"]||"",
        passengerName:(r["Lead passenger"]||r["lead_passenger"]||"").trim(),
        passengerPhone:(r["Passenger telephone number"]||r["passenger_telephone_number"]||"").replace(/\s/g,""),
        passengerEmail:"",
        date:parseNEDDate(r["Start date"]||r["start_date"]||""),
        time:(r["Pick up time"]||r["pick_up_time"]||"").slice(0,5),
        origin:normLoc((r["Departure location"]||r["departure_location"]||"").trim()),
        destination:normLoc((r["Arrival location"]||r["arrival_location"]||"").trim()),
        vehicleType:nedVT(r["Type"]||r["type"]||""),
        pax:paxAd+paxCh,luggage:0,price,
        currency:r["Currency"]||r["currency"]||"USD",
        flightNumber:(r["Transport details"]||r["transport_details"]||r["Transport Details"]||"").trim(),
        notes:(r["Additional comments"]||r["additional_comments"]||"").trim(),
        status:cancelled?"cancelled_nopay":"pending",cancelled
      };
    });
  },
  // Bespoke (BPK): semicolon, 6 header rows
  // Col1=PU Date(MM/DD/YYYY), Col2=PU Time, Col4=Conf#, Col6=PU Location,
  // Col9=DO Location, Col12=Passenger(s), Col15=Vehicle Type, Col16=Trip Total
  pv11:(rows,pv)=>{
    const parseBPKDate=s=>{const p=(s||"").trim().split("/");if(p.length!==3)return"";const[m,d,y]=p;return`${y}-${String(parseInt(m)).padStart(2,"0")}-${String(parseInt(d)).padStart(2,"0")}`;};
    const bpkVT=t=>{const tl=(t||"").toLowerCase();if(tl.includes("sprinter")||tl.includes("bus"))return"SPRINTER";if(tl.includes("suv")||tl.includes("van"))return"VAN";return"SEDAN";};
    const extractFlight=s=>{const m=(s||"").match(/Flt#\s*([\w]+)/i);return m?m[1]:"";};
    const cleanLoc=s=>{const t=(s||"").trim();if(/aeropuerto.*ezeiza|pistarini/i.test(t))return"Aeropuerto Ezeiza Ministro Pistarini (EZE)";if(/aeroparque|newbery/i.test(t))return"Aeroparque Jorge Newbery (AEP)";return normLoc(t.replace(/^EZE\s*-\s*/,"").replace(/^AEP\s*-\s*/,"").trim());};
    return rows.map(r=>{
      const vals=Object.values(r);
      const col=(name,idx)=>r[name]||vals[idx-1]||"";
      const pu=col("PU Location",6);const doL=col("DO Location",9);
      const flight=extractFlight(doL)||extractFlight(pu);
      const vtRaw=col("Vehicle Type",15);
      const priceRaw=col("Trip Total",16);
      const price=parseFloat(priceRaw.replace(",","."))||0;
      return{providerCode:col("Conf#",4),passengerName:(col("Passenger(s)",12)).trim().replace(/\s{2,}/g," "),
        passengerPhone:(col("Pass Phone(s)#",13)).replace(/N\/A/i,"").trim(),passengerEmail:"",
        date:parseBPKDate(col("PU Date",1)),time:(col("PU Time",2)).slice(0,5),
        origin:cleanLoc(pu),destination:cleanLoc(doL),vehicleType:bpkVT(vtRaw),
        pax:1,luggage:0,price,currency:"USD",flightNumber:flight,
        notes:(col("TripNotes",11)||col("PU Route Notes",7)).trim(),
        status:"pending",cancelled:false};
    });
  },
};

// Parse CSV/TSV text into array of objects
const parseCSV=(text,skipRows=0)=>{
  let lines=text.trim().split(/\r?\n/);if(skipRows>0)lines=lines.slice(skipRows);
  if(lines.length<2)return[];
  // Auto-detect delimiter: semicolon, comma, or tab
  const firstLine=lines[0];
  const delim=firstLine.split(";").length>firstLine.split(",").length?";":
               firstLine.split("\t").length>firstLine.split(",").length?"\t":","
  const parseRow=line=>{
    const result=[];let cur="";let inQ=false;
    for(let i=0;i<line.length;i++){
      if(line[i]==='"'&&!inQ&&(i===0||line[i-1]===delim)){inQ=true;}
      else if(line[i]==='"'&&inQ&&(i===line.length-1||line[i+1]===delim)){inQ=false;}
      else if(line[i]===delim&&!inQ){result.push(cur.trim());cur="";}
      else cur+=line[i];
    }
    result.push(cur.trim());
    return result;
  };
  const headers=parseRow(lines[0]).map(h=>h.replace(/^\uFEFF/,"").trim());
  return lines.slice(1).filter(l=>l.trim()).map(line=>{
    const vals=parseRow(line);
    const obj={};
    headers.forEach((h,i)=>{obj[h]=vals[i]||"";});
    return obj;
  });
};

  // ── Mozio text email parser (handles round-trips, splits price) ───────────
  const parseMozioText=(text)=>{
    const fp=providers.find(p=>p.id===fileProv||p.id==="pv5");
    // Normalize text - add line breaks at known field separators
    // IMPORTANT: replace longer patterns FIRST to avoid substring conflicts
    // e.g. "Return Confirmation Number:" must be replaced before "Confirmation Number:"
    // Use regex alternation for safe splitting (longest patterns first, avoids substring conflicts)
    const t=text.replace(
      /(Return Confirmation Number:|Return Flight Departure Time:|Return Flight Number:|Return Airline:|Return Trip Details:|Confirmation Number:|Flight Arrival Time:|Flight Number:|Number of Passengers:|Maximum number of bags:|Special Instructions:|Payment Details:|Trip Details:|Phone Number:|Dropoff At:|Email:|Airline:|Name:|Type:|Pickup:|At:|On:|You will be paid:)/g,
      '\n$1'
    );
    const g=(pattern,fallback="")=>{const m=t.match(pattern);return m?m[1].trim():fallback;};
    const parseDate=s=>{
      if(!s)return"";
      const months={january:"01",february:"02",march:"03",april:"04",may:"05",june:"06",
        july:"07",august:"08",september:"09",october:"10",november:"11",december:"12"};
      const m=s.toLowerCase().match(/([a-z]+)\s+(\d{1,2})\s+(\d{4})/);
      if(!m)return"";
      return`${m[3]}-${months[m[1]]||"01"}-${String(parseInt(m[2])).padStart(2,"0")}`;
    };
    const parseTime=s=>{
      if(!s)return"";
      const m=s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if(!m)return"";
      let h=parseInt(m[1]),mi=parseInt(m[2]);
      if(m[3].toUpperCase()==="PM"&&h<12)h+=12;
      if(m[3].toUpperCase()==="AM"&&h===12)h=0;
      return`${String(h).padStart(2,"0")}:${String(mi).padStart(2,"0")}`;
    };
    const code1=g(/\nConfirmation Number:\s*(MOZ[A-Z0-9]+)/i);
    const code2=g(/Return Confirmation Number:\s*(MOZ[A-Z0-9]+)/i);
    const name=g(/Name:\s*([^\n]+?)(?:\nType:|\nPhone)/);
    const phone=g(/Phone Number:\s*([^\n]+)/).replace(/\s/g,"");
    const email=g(/Email:\s*([^\n@]+@[^\n\s]+)/);
    const flight1=g(/\nFlight Number:\s*([^\n(]+)/).trim();
    const flight2=g(/Return Flight Number:\s*([^\n(]+)/).trim();
    const pax=parseInt(g(/Number of Passengers:\s*(\d+)/,"1"))||1;
    const totalPrice=(()=>{const s=g(/You will be paid:\s*US\$\s*([\d,.]+)/,"0");const c=s.includes(",")&&!s.includes(".")?s.replace(",","."):s.replace(/,(\d{2})$/,".$1");return parseFloat(c)||0;})()||
                     parseFloat(g(/US\$\s*([\d,.]+)/,"0").replace(",","."))||0;
    const vtRaw=g(/Type:\s*([^\n]+)/,"SUV");
    const vt=vtRaw.toLowerCase().includes("sedan")?"SEDAN":"VAN";
    const hasReturn=!!code2;
    const price=hasReturn?Math.round((totalPrice/2)*100)/100:totalPrice;
    // Parse trip sections
    const tripSec=t.match(/Trip Details:([\s\S]+?)(?:\nReturn Trip Details:|\nPayment|$)/i);
    const retSec=t.match(/Return Trip Details:([\s\S]+?)(?:\nPayment|CLICK|$)/i);
    const tripT=tripSec?tripSec[1]:"";const retT=retSec?retSec[1]:"";
    const tripDate=parseDate(g.call({match:s=>tripT.match(s)},/On:\s*([^\n]+)/)||"");
    const tripTime=parseTime(tripT.match(/At:\s*([\d:]+\s*[AP]M)/i)?.[1]||"");
    const tripPickup=normLoc(((tripT.match(/Pickup:\s*([\s\S]+?)\nOn:/)||[])[1]||"").trim());
    const tripDrop=normLoc(((tripT.match(/Dropoff At:\s*([^\n]+)/)||[])[1]||"").replace(/View the approximate.*/i,"").trim());
    const retDate=parseDate((retT.match(/On:\s*([^\n]+)/)||[])[1]||"");
    const retTime=parseTime(retT.match(/At:\s*([\d:]+\s*[AP]M)/i)?.[1]||"");
    const retPickup=normLoc(((retT.match(/Pickup:\s*([\s\S]+?)\nOn:/)||[])[1]||"").trim());
    const retDrop=normLoc(((retT.match(/Dropoff At:\s*([^\n]+)/)||[])[1]||"").replace(/View the approximate.*/i,"").trim());
    const notes=g(/Special Instructions:\s*([\s\S]+?)(?:\nTrip Details:|$)/i,"").slice(0,300);
    const results=[];
    if(code1){results.push({providerCode:code1,passengerName:name,passengerPhone:phone,passengerEmail:email,
      date:tripDate,time:tripTime,origin:tripPickup||"Aeroparque Jorge Newbery (AEP)",
      destination:tripDrop||"Ciudad Autónoma de Buenos Aires (CABA)",
      vehicleType:vt,pax,luggage:4,price,currency:"USD",flightNumber:flight1,notes,
      status:"pending",cancelled:false,providerId:fp?.id||"pv5",company:fp?.name||"Mozio"});}
    if(hasReturn&&code2){results.push({providerCode:code2,passengerName:name,passengerPhone:phone,passengerEmail:email,
      date:retDate,time:retTime,origin:retPickup||tripDrop||"Ciudad Autónoma de Buenos Aires (CABA)",
      destination:retDrop||tripPickup||"Aeroparque Jorge Newbery (AEP)",
      vehicleType:vt,pax,luggage:4,price,currency:"USD",flightNumber:flight2,notes,
      status:"pending",cancelled:false,providerId:fp?.id||"pv5",company:fp?.name||"Mozio"});}
    return results;
  };

  const parseText=async(text,fpId)=>{
    setLoading(true);setErr("");setPrev(null);setSaved(0);
    const fp=providers.find(p=>p.id===(fpId||fileProv));
    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,system:`Sos un parser de reservas de traslados. IMPORTANTE: tu respuesta debe ser ÚNICAMENTE un array JSON válido, comenzando con [ y terminando con ]. NUNCA escribas texto, explicaciones ni markdown.${fp?` El proveedor de TODAS estas reservas es: ${fp.name} (code: ${fp.code}).`:""} 

CAMPOS DEL JSON (uno por reserva):
- providerCode: EL NÚMERO O CÓDIGO DE RESERVA DEL PROVEEDOR tal como aparece en el archivo (ej: T2931371, TGPWW7-1, E5TJ638, MOZ8710677, etc.). NUNCA uses la sigla de la empresa. Es el identificador único de esa reserva.
- company: nombre del proveedor${fp?` = "${fp.name}"`:` (Civitatis, Transfer Z, Mister Transfer, Mozio, etc.)`}
- passengerName: nombre completo del pasajero
- passengerPhone: teléfono con código de país
- passengerEmail: email del pasajero
- date: fecha en formato YYYY-MM-DD
- time: hora en formato HH:MM
- origin: dirección completa de origen tal cual aparece
- destination: dirección completa de destino tal cual aparece
- vehicleType: SEDAN (=Sedan/stdcar3/BUSINESS_SEDAN/Turismo/standard/1-3pax), VAN (=Van/SUV/Minivan pequeña/4-7pax), HIACE (=MINIVAN/Minibus/stdvan7/8-13pax), SPRINTER (=Sprinter/stdminibus/14+pax)
- pax: número de pasajeros (entero)
- luggage: número de maletas (entero)
- price: precio en la moneda indicada (número)
- currency: USD o ARS
- isArrival: true si el origen es un aeropuerto/terminal, false si el destino lo es
- flightNumber: número de vuelo si aplica
- driverLink: link del chofer si aplica
- notes: notas adicionales
- cancelled: true solo si la reserva está cancelada

Para los campos origin y destination, usa los nombres EXACTOS:
- "Aeroparque Jorge Newbery (AEP)" para Aeroparque / AEP / Jorge Newbery
- "Aeropuerto Ezeiza Ministro Pistarini (EZE)" para Ezeiza / EZE / aeropuerto de Ezeiza
- "Colonia Express (CLX)" para Colonia Express
- "Buque Bus (BQB)" para Buque Bus
- Para cualquier dirección en Buenos Aires / Centro / CABA → usa la dirección completa tal cual aparece (NO simplifiques a "CABA")

EMPIEZA DIRECTAMENTE CON [`,messages:[{role:"user",content:`${fp?`PROVEEDOR: ${fp.name} (${fp.code})\n\nIMPORTANTE: el campo providerCode debe ser el número/código de reserva del archivo (ej: T2931371), NO la sigla del proveedor (no CIV, no TFZ, etc.)\n\n`:""}`+`Datos a parsear:\n\n${text.slice(0,10000)}`}]})});
      if(!resp.ok){const e=await resp.json();throw new Error(e.error?.message||"API "+resp.status);}
      const data=await resp.json();
      const txt=data.content.map(i=>i.type==="text"?i.text:i.type==="mcp_tool_result"?(Array.isArray(i.content)?i.content.filter(c=>c.type==="text").map(c=>c.text).join(""):String(i.content||"")):"").filter(Boolean).join("\n");
      let clean=txt.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
      const start=clean.indexOf("[");const end=clean.lastIndexOf("]");
      if(start===-1||end<=start)throw new Error("No se encontró JSON válido.");
      clean=clean.slice(start,end+1);
      const arr=JSON.parse(clean);
      if(!Array.isArray(arr))throw new Error("No es array");
      const enriched=arr.map(r=>{const pv=providers.find(p=>p.code===r.company||p.name===r.company);return{...r,origin:normLoc(r.origin)||r.origin,destination:normLoc(r.destination)||r.destination,providerId:pv?.id||null,company:pv?.name||r.company,driverPrice:gPx(r.origin,r.destination,r.vehicleType,routePrices)||0};});
      setPrev(enriched);
    }catch(e){setErr("Error: "+e.message);}
    setLoading(false);
  };

  return(
    <div style={{maxWidth:860}}>
      {/* Mode tabs */}
      <div className="tabs" style={{marginBottom:16}}>
        <button className={`tab${mode==="gmail"?" on":""}`} onClick={()=>{setMode("gmail");setPrev(null);setErr("");}}>📧 Leer Gmail</button>
        <button className={`tab${mode==="file"?" on":""}`} onClick={()=>{setMode("file");setPrev(null);setErr("");}}>📂 Subir archivo</button>
        <button className={`tab${mode==="paste"?" on":""}`} onClick={()=>{setMode("paste");setPrev(null);setErr("");}}>📋 Pegar texto</button>
      </div>

      {/* ── GMAIL MODE ── */}
      {mode==="gmail"&&<div>
        <div style={{background:"rgba(0,212,255,.06)",border:"1px solid rgba(0,212,255,.2)",borderRadius:"var(--r)",padding:"12px 14px",marginBottom:14,fontSize:12,color:"var(--mu2)",lineHeight:1.7}}>
          <strong style={{color:"var(--ac)"}}>📧 Importación automática desde Gmail</strong> — Lee los emails de todos los proveedores, extrae las reservas nuevas y detecta cancelaciones automáticamente.<br/>
          <span style={{fontSize:11}}>Proveedores: Civitatis · Transfer Z · Mister Transfer · Mozio · My Transfers · I Need Tours · Travel Thru · Drivado</span>
        </div>
        <div style={{display:"flex",gap:9,alignItems:"flex-end",marginBottom:14}}>
          <div className="fp">
            <label>Buscar emails de los últimos</label>
            <select className="fs" value={days} onChange={e=>setDays(e.target.value)}>
              <option value="1">1 día</option>
              <option value="2">2 días</option>
              <option value="3">3 días</option>
              <option value="7">7 días</option>
              <option value="14">14 días</option>
              <option value="30">30 días</option>
            </select>
          </div>
          <button className="btn bp" onClick={fetchEmails} disabled={gmailStep==="fetching"||gmailStep==="parsing"} style={{marginBottom:1}}>
            {gmailStep==="fetching"||gmailStep==="parsing"
              ?<><div className="spin" style={{width:13,height:13,borderWidth:2}}/> Leyendo emails...</>
              :<><Ic n="bell" s={13}/> Leer emails ahora</>}
          </button>
          {prev&&<button className="btn bg2" onClick={()=>{setPrev(null);setGmailStep("idle");setErr("");}}>Limpiar</button>}
        </div>
        {err&&<div style={{marginBottom:11,color:"var(--re)",fontSize:12,padding:"9px 12px",background:"rgba(239,68,68,.1)",borderRadius:7,border:"1px solid rgba(239,68,68,.3)"}}>{err}</div>}
        {gmailStep==="fetching"&&<div style={{padding:"24px 0",textAlign:"center"}}>
          <div className="spin" style={{margin:"0 auto 10px"}}/>
          <div style={{fontSize:12,color:"var(--mu2)"}}>Leyendo inbox y procesando emails con IA...<br/><span style={{fontSize:11}}>Esto puede tomar 30-60 segundos</span></div>
        </div>}
      </div>}

      {/* ── FILE MODE ── */}
      {mode==="file"&&<div>
        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:12,color:"var(--mu2)",marginBottom:5,fontWeight:600}}>
            Proveedor <span style={{color:"var(--re)"}}>*</span>
          </label>
          <select value={fileProv} onChange={e=>setFileProv(e.target.value)} style={{width:"100%",background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:"var(--r)",padding:"8px 12px",color:"var(--tx)",fontSize:13}}>
            <option value="">— Seleccionar proveedor —</option>
            {providers.map(p=><option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
          </select>
          {!fileProv&&<div style={{marginTop:5,fontSize:11,color:"var(--am)"}}>⚠️ Selecciona el proveedor antes de subir</div>}
          {fileProv&&["pv6","pv10"].includes(fileProv)&&<div style={{marginTop:5,fontSize:11,color:"rgba(0,212,255,.8)",background:"rgba(0,212,255,.08)",padding:"4px 8px",borderRadius:5}}>📄 Este proveedor exporta en PDF — subí el archivo PDF directamente</div>}
          {fileProv&&!["pv6","pv10"].includes(fileProv)&&<div style={{marginTop:5,fontSize:11,color:"rgba(16,185,129,.8)",background:"rgba(16,185,129,.08)",padding:"4px 8px",borderRadius:5}}>📊 Este proveedor tiene parser nativo para CSV/Excel — sin IA, más rápido</div>}
        </div>
        <label className="dz" onDrop={async e=>{e.preventDefault();e.currentTarget.style.borderColor="";const f=e.dataTransfer.files[0];if(!f)return;if(!fileProv){setErr("⚠️ Selecciona el proveedor primero");return;}if(f.name.toLowerCase().endsWith(".pdf")){await parsePDF(f);return;}const txt=await f.text();const parser=PROV_PARSERS[fileProv];if(parser){const skipR=fileProv==='pv7'?3:fileProv==='pv11'?6:0;const rows=parseCSV(txt,skipR);if(rows.length>0){const fp=providers.find(p=>p.id===fileProv);const parsed=parser(rows,fp);const enriched=parsed.map(r=>{const pv=fp||providers.find(p=>p.name===r.company||p.code===r.company);const dup=reservations.find(x=>x.providerCode===r.providerCode&&!r.cancelled);return{...r,origin:normLoc(r.origin)||r.origin,destination:normLoc(r.destination)||r.destination,providerId:pv?.id||null,company:pv?.name||r.company,driverPrice:gPx(r.origin,r.destination,r.vehicleType,routePrices)||0,isDup:!!dup,status:dup?"dup":r.status};});setPrev(enriched);setLoading(false);return;}}await parseText(txt);}} onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="var(--ac)";}}>
          <input type="file" accept=".xlsx,.xls,.csv,.txt,.pdf" onChange={async e=>{const f=e.target.files[0];if(!f)return;if(!fileProv){setErr("⚠️ Selecciona el proveedor primero");return;}if(f.name.toLowerCase().endsWith(".pdf")){await parsePDF(f);e.target.value="";return;}const txt=await f.text();const parser=PROV_PARSERS[fileProv];if(parser){const skipR=fileProv==='pv7'?3:fileProv==='pv11'?6:0;const rows=parseCSV(txt,skipR);if(rows.length>0){const fp=providers.find(p=>p.id===fileProv);const parsed=parser(rows,fp);const enriched=parsed.map(r=>{const pv=fp||providers.find(p=>p.name===r.company||p.code===r.company);const dup=reservations.find(x=>x.providerCode===r.providerCode&&!r.cancelled);return{...r,origin:normLoc(r.origin)||r.origin,destination:normLoc(r.destination)||r.destination,providerId:pv?.id||null,company:pv?.name||r.company,driverPrice:gPx(r.origin,r.destination,r.vehicleType,routePrices)||0,isDup:!!dup,status:dup?"dup":r.status};});setPrev(enriched);setLoading(false);e.target.value="";return;}}await parseText(txt);e.target.value="";}}/>
          <div style={{fontSize:26,marginBottom:7}}>📂</div>
          <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:13,marginBottom:2}}>Arrastrá el archivo aquí</div>
          <div style={{fontSize:11,color:"var(--mu2)"}}>CSV, Excel, TXT o PDF · click para seleccionar</div>
          {loading&&<div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center",marginTop:11}}><div className="spin"/><span style={{fontSize:11.5,color:"var(--mu2)"}}>Procesando...</span></div>}
        </label>
        {err&&<div style={{marginTop:8,color:"var(--re)",fontSize:12,padding:"8px 11px",background:"rgba(239,68,68,.1)",borderRadius:7,border:"1px solid rgba(239,68,68,.3)"}}>{err}</div>}
      </div>}

      {/* ── PASTE MODE ── */}
      {mode==="paste"&&<div>
        <div style={{marginBottom:12}}><label style={{display:"block",fontSize:12,color:"var(--mu2)",marginBottom:5,fontWeight:600}}>Proveedor <span style={{color:"var(--re)"}}>*</span></label><select value={fileProv} onChange={e=>setFileProv(e.target.value)} style={{width:"100%",background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:"var(--r)",padding:"8px 12px",color:"var(--tx)",fontSize:13}}><option value="">— Seleccionar proveedor —</option>{providers.map(p=><option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}</select>{!fileProv&&<div style={{marginTop:5,fontSize:11,color:"var(--am)"}}>⚠️ Selecciona el proveedor antes de pegar</div>}</div>
        <PasteBox onPaste={async t=>{
            if(!fileProv){setErr("⚠️ Selecciona el proveedor primero");return;}
            // Mozio pasted text: use native parser
            if(fileProv==="pv5"&&t.includes("Confirmation Number:")){
              setLoading(true);setErr("");setPrev(null);setSaved(0);
              const parsed=parseMozioText(t);
              if(parsed.length>0){
                const fp=providers.find(p=>p.id==="pv5");
                const enriched=parsed.map(r=>{
                  const dup=reservations.find(x=>x.providerCode===r.providerCode&&!r.cancelled);
                  return{...r,driverPrice:gPx(r.origin,r.destination,r.vehicleType,routePrices)||0,isDup:!!dup,status:dup?"dup":r.status};
                });
                setPrev(enriched);setLoading(false);return;
              }
            }
            parseText(t);
          }} loading={loading}/>
        {err&&<div style={{marginTop:8,color:"var(--re)",fontSize:12,padding:"8px 11px",background:"rgba(239,68,68,.1)",borderRadius:7,border:"1px solid rgba(239,68,68,.3)"}}>{err}</div>}
      </div>}

      {/* ── RESULTS ── */}
      {saved>0&&<div style={{marginTop:11,color:"var(--gr)",fontSize:12,padding:"9px 12px",background:"rgba(16,185,129,.1)",borderRadius:7,border:"1px solid rgba(16,185,129,.3)"}}>✅ {saved} reservas importadas correctamente</div>}

      {prev&&prev.length>0&&<div style={{marginTop:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9,flexWrap:"wrap",gap:7}}>
          <div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:13}}>{prev.filter(r=>!r.cancelled&&!r._dup).length} nuevas · {prev.filter(r=>r.cancelled).length} cancelaciones · {prev.filter(r=>r._dup&&!r.cancelled).length} duplicadas</div>
            <div style={{fontSize:11,color:"var(--mu2)",marginTop:2}}>Las duplicadas ya están en el sistema y no se volverán a importar.</div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button className="btn bg2" onClick={()=>setPrev(null)}><Ic n="X" s={12}/> Descartar</button>
            <button className="btn bp" onClick={saveAll} disabled={!prev.some(r=>(!r.cancelled&&!r._dup)||r.cancelled)}><Ic n="chk" s={12}/> Importar todo</button>
          </div>
        </div>
        <div className="tw"><table>
          <thead><tr><th>Estado</th><th>Empresa</th><th>Código</th><th>Pasajero</th><th>Fecha/Hora</th><th>Origen → Destino</th><th>Veh.</th><th>Precio</th><th>Chofer $</th></tr></thead>
          <tbody>
            {prev.map((r,i)=>{
              const isNew=!r.cancelled&&!r._dup;
              const isDup=r._dup&&!r.cancelled;
              const isCan=r.cancelled;
              return(<tr key={i} style={{opacity:isDup?.5:1,background:isCan?"rgba(239,68,68,.04)":isNew?"rgba(16,185,129,.03)":"transparent"}}>
                <td><span className="badge" style={isCan?{color:"var(--re)",background:"rgba(239,68,68,.12)"}:isDup?{color:"var(--mu)",background:"var(--s2)"}:{color:"var(--gr)",background:"rgba(16,185,129,.12)"}}>{isCan?"🚫 Cancela":isDup?"↩ Ya existe":"✅ Nueva"}</span></td>
                <td style={{fontSize:11}}><span className="rtag">{providers.find(p=>p.name===r.company)?.code||r.company?.slice(0,3)}</span></td>
                <td><span className="chip" style={{fontSize:9.5}}>{r.providerCode}</span></td>
                <td style={{fontSize:12}}>{r.passengerName}</td>
                <td><div style={{fontWeight:600,fontSize:12}}>{fD(r.date)}</div><div style={{fontSize:10.5,color:"var(--ac)"}}>{r.time}hs</div></td>
                <td style={{fontSize:10.5,maxWidth:160}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.origin}</div><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--mu2)"}}>{r.destination}</div></td>
                <td><VB type={(r.vehicleType||"SEDAN").toUpperCase()}/></td>
                <td style={{fontSize:11.5,color:"var(--mu2)"}}>{r.price?`$${r.price} ${r.currency||"USD"}`:"—"}</td>
                <td style={{fontFamily:"var(--fh)",fontWeight:700,color:r.driverPrice?"var(--gr)":"var(--re)",fontSize:11.5}}>{r.driverPrice?`$${n$(r.driverPrice)}`:"⚠️ Manual"}</td>
              </tr>);
            })}
          </tbody>
        </table></div>
      </div>}
    </div>
  );
}
function PasteBox({onPaste,loading}){const[t,setT]=useState("");return <div><textarea value={t} onChange={e=>setT(e.target.value)} placeholder="Pegá aquí el contenido del email o CSV..." style={{width:"100%",minHeight:100,background:"var(--s2)",border:"1px solid var(--b2)",color:"var(--mu2)",borderRadius:"var(--r)",padding:10,fontSize:12.5,fontFamily:"var(--fb)",resize:"vertical"}}/><button className="btn bp" style={{marginTop:6}} onClick={()=>t.trim()&&onPaste(t)} disabled={loading||!t.trim()}>{loading?<div className="spin" style={{width:13,height:13,borderWidth:2}}/>:<Ic n="bell" s={12}/>} Procesar con IA</button></div>;}

// ── DRIVERS PAGE + MODALS ──────────────────────────────────────────────────────
// ── DRIVER TRIPS MODAL ────────────────────────────────────────────────────────
function DrvTripsModal({drv,reservations,onClose,onDetRes}){
  const[tab,setTab]=useState("assigned");
  const now=TD;
  const myTrips=reservations.filter(r=>r.driverId===drv.id).sort((a,b)=>a.date>b.date?1:-1);
  const upcoming=myTrips.filter(r=>!["completed","cancelled_nopay","cancelled_pay","noshow"].includes(r.status)&&r.date>=now);
  const history=myTrips.filter(r=>["completed","cancelled_nopay","cancelled_pay","noshow"].includes(r.status)||r.date<now);
  const pendingAll=reservations.filter(r=>!r.driverId&&r.status==="pending"&&r.date>=now).sort((a,b)=>a.date>b.date?1:-1);
  const tabs=[{k:"assigned",label:`Asignados (${upcoming.length})`},{k:"pending",label:`Sin asignar (${pendingAll.length})`},{k:"all",label:`Historial (${history.length})`}];
  const rows=tab==="assigned"?upcoming:tab==="pending"?pendingAll:history;
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh">
        <div style={{display:"flex",alignItems:"center",gap:9}}><Av id={drv.id} text={drv.avatar} size={30} fs={10}/><div><div className="mt">{drv.name}</div><div style={{fontSize:10.5,color:"var(--mu2)"}}>{drv.vehicleBrand} {drv.vehicleModel} · {drv.plate}</div></div></div>
        <button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button>
      </div>
      <div className="mb">
        <div className="tabs" style={{marginBottom:12}}>{tabs.map(t=><button key={t.k} className={`tab${tab===t.k?" on":""}`} onClick={()=>setTab(t.k)}>{t.label}</button>)}</div>
        {rows.length===0&&<div className="empty">📭 Sin viajes en esta categoría</div>}
        {rows.length>0&&<div className="tw"><table>
          <thead><tr><th>Fecha</th><th>Hora</th><th>Código</th><th>Empresa</th><th>Pasajero</th><th>Ruta</th><th>Veh.</th><th>Estado</th><th>WA</th></tr></thead>
          <tbody>{rows.map(r=><tr key={r.id} style={{cursor:"pointer"}} onClick={()=>onDetRes&&onDetRes(r)}>
            <td style={{whiteSpace:"nowrap",fontSize:11.5}}>{fD(r.date)}</td>
            <td style={{fontSize:11.5,color:"var(--ac)"}}>{r.time}hs</td>
            <td><span className="chip" style={{fontSize:9.5}}>{r.code}</span></td>
            <td style={{fontSize:11}}>{r.company}</td>
            <td style={{fontSize:11.5,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.passengerName}</td>
            <td style={{fontSize:10.5,maxWidth:150}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--mu2)"}}>📍{r.origin}</div><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>🏁{r.destination}</div></td>
            <td><VB type={(r.vehicleType||"SEDAN").toUpperCase()}/></td>
            <td><Bdg status={r.status}/></td>
            <td onClick={e=>e.stopPropagation()}><a href={wa(tab==="pending"?r.passengerPhone:drv.phone,`Hola! Servicio ${r.code} ${fD(r.date)} ${r.time}hs`)} target="_blank" rel="noopener noreferrer" className="btn bgr sm" style={{fontSize:9.5,padding:"2px 6px"}}><Ic n="wa" s={9}/></a></td>
          </tr>)}</tbody>
        </table></div>}
      </div>
      <div className="mf"><div style={{fontSize:11,color:"var(--mu2)"}}>Asignados: <strong>{myTrips.length}</strong> · Completados: <strong style={{color:"var(--gr)"}}>{myTrips.filter(r=>r.status==="completed").length}</strong></div><button className="btn bg2" onClick={onClose}>Cerrar</button></div>
    </div>
  </div>);
}

function DrvPage({drivers,reservations,payments,pD,mND,setMND,toast,onWal,onDet,onSum,role,users,pU}){
  const[srch,setSrch]=useState("");
  const fd=drivers.filter(d=>!srch||d.name.toLowerCase().includes(srch.toLowerCase())||d.plate?.toLowerCase().includes(srch.toLowerCase()));
  const tog=async id=>{await pD(drivers.map(d=>d.id===id?{...d,active:!d.active}:d));toast("Estado actualizado");};
  return(<>
    <div style={{marginBottom:11,display:"flex",gap:8}}>
      <SI value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar por nombre o patente…" style={{width:220}}/>
      <span style={{fontSize:11,color:"var(--mu)",marginLeft:"auto",alignSelf:"center"}}>{fd.length} chofer(es)</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:12}}>
      {fd.map(d=>{
        const ls=licS(d);const exp=licE(d);const dv=(d.vehicleType||"SEDAN").toUpperCase();
        const trips=reservations.filter(r=>r.driverId===d.id);
        const b=role==="admin"?dBal(d,trips,payments):null;
        return(<div key={d.id} style={{background:"var(--s1)",border:`1px solid ${exp?"rgba(239,68,68,.4)":"var(--b1)"}`,borderRadius:"var(--rl)",padding:15}}>
          {exp&&<div style={{display:"flex",gap:4,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.2)",borderRadius:6,padding:"4px 8px",marginBottom:9,fontSize:10.5,color:"var(--re)",alignItems:"center"}}><Ic n="warn" s={10}/> Licencia vencida</div>}
          <div style={{display:"flex",gap:10,marginBottom:9}}>
            <Av id={d.id} text={d.avatar} size={40} fs={12}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:13}}>{d.name}</div>
              <div style={{display:"flex",gap:3,alignItems:"center",marginTop:2}}><VB type={dv}/></div>
              <div style={{fontSize:10.5,color:"var(--mu2)",marginTop:1}}>{d.vehicleBrand} {d.vehicleModel} · {d.plate}{d.gnc?" · GNC":""}</div>
            </div>
            <span className="badge" style={d.active?{color:"var(--gr)",background:"rgba(16,185,129,.12)"}:{color:"var(--mu)",background:"rgba(107,114,128,.12)"}}><span className="bd" style={{background:d.active?"var(--gr)":"var(--mu)"}}/>{d.active?"Activo":"Inact."}</span>
          </div>
          <div style={{display:"flex",gap:4,fontSize:10.5,marginBottom:8,alignItems:"center",color:"var(--mu2)"}}><Ic n="id" s={10}/>Lic: <span style={{color:ls.c,fontWeight:600}}>{ls.l}</span></div>
          <div style={{display:"grid",gridTemplateColumns:b!==null?"1fr 1fr 1fr":"1fr 1fr",gap:7,marginBottom:8}}>
            {[[`${trips.length}`,""],[`${trips.filter(r=>r.status==="completed").length}`,""],[b!==null?`$${n$(b)}`:null,""]].filter(([v])=>v!==null).map(([v],ki)=>(
              <div key={ki} style={{background:"var(--s2)",borderRadius:7,padding:"6px 8px",textAlign:"center"}}><div style={{fontSize:12,fontWeight:800,fontFamily:"var(--fh)"}}>{v}</div><div style={{fontSize:8.5,color:"var(--mu)"}}>{ki===0?"Servicios":ki===1?"Compl.":"Saldo"}</div></div>
            ))}
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button className="btn bg2 sm" onClick={()=>onDet(d)}><Ic n="eye" s={10}/> Ficha</button>
            {role==="admin"&&<><button className="btn bbl sm" onClick={()=>onWal(d)}><Ic n="wal" s={10}/> Billetera</button><button className="btn bg2 sm" onClick={()=>onSum(d)}><Ic n="rpt" s={10}/> Resumen</button></>}
            <a href={wa(d.phone,`Hola ${d.name.split(" ")[0]}!`)} className="btn bgr sm"><Ic n="wa" s={10}/> WA</a>
            {role!=="driver"&&<button className="btn bg2 sm" style={{color:d.active?"var(--am)":"var(--gr)"}} onClick={()=>tog(d.id)}>{d.active?"Desact.":"Activar"}</button>}
          </div>
        </div>);
      })}
    </div>
    {mND&&<NDMod onClose={()=>setMND(false)} onSv={async(d,drvId)=>{await pD([...drivers,d]);const uname=d.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,".").replace(/[^a-z0-9.]/g,"");const newUser={id:"u_auto_"+drvId,role:"driver",username:uname,password:"ang2506",name:d.name,phone:d.phone,email:d.email,driverId:drvId};await pU([...users,newUser]);setMND(false);toast(`Chofer y usuario ${uname} creados ✅`);}}/>}
  </>);
}
function WalMod({drv,pmts,trips,onClose,onAdd,onEd}){
  const[amt,setAmt]=useState("");const[note,setNote]=useState("");const[ep,setEp]=useState(null);
  const myT=[...(trips||[])].filter(r=>r.driverId===drv.id).sort((a,b)=>a.date<b.date?1:-1);
  const e=myT.filter(r=>PAY.includes(r.status)).reduce((s,r)=>s+(r.driverPrice||0),0);
  const p=pmts.reduce((s,pm)=>s+pm.amount,0);
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh"><div><div className="mt">Billetera — {drv.name}</div><div style={{fontSize:11,color:"var(--mu2)",marginTop:1}}>Saldo: <strong style={{color:"var(--ac)"}}>${n$(e-p)}</strong></div></div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      <div className="mb">
        <div style={{display:"flex",gap:7,marginBottom:13,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div className="fp" style={{flex:1,minWidth:95}}><label>Monto ($)</label><input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0"/></div>
          <div className="fp" style={{flex:2,minWidth:120}}><label>Concepto</label><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Pago quincenal..."/></div>
          <button className="btn bgr" onClick={async()=>{await onAdd(drv.id,amt,note);setAmt("");setNote("");}} disabled={!amt}><Ic n="plus" s={12}/> Acreditar</button>
        </div>
        {[["SERVICIOS",myT,r=>{const isPay=PAY.includes(r.status);const isNopay=r.status==="cancelled_nopay";const isPending=!FIN.includes(r.status);return <div key={r.id} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 10px",borderBottom:"1px solid var(--b1)"}}><div style={{flex:1}}><span className="chip" style={{fontSize:9}}>{r.code}</span>{dups?.has(r.providerCode)&&<span style={{background:"rgba(239,68,11,.15)",color:"var(--re)",fontSize:9,padding:"1px 5px",borderRadius:3,marginLeft:3}}>DUP</span>} <span style={{fontSize:11}}>{fD(r.date)} · {r.passengerName}</span><div style={{marginTop:1}}><Bdg status={r.status}/></div></div><div style={{fontFamily:"var(--fh)",fontWeight:700,color:isPay?"var(--gr)":isNopay?"var(--mu)":"var(--am)",fontSize:11}}>{isPay?"+":isNopay?"":"+"}{isPay||isPending?`$${n$(r.driverPrice)}`:"$0"}</div></div>;}],["PAGOS",pmts,pm=><div key={pm.id} style={{padding:"5px 10px",borderBottom:"1px solid var(--b1)"}}>{ep===pm.id?(<div style={{display:"flex",gap:5,alignItems:"center"}}><input className="fi" type="number" defaultValue={pm.amount} id={`a_${pm.id}`} style={{width:80,fontSize:11,padding:"2px 6px"}}/><input className="fi" defaultValue={pm.note} id={`n_${pm.id}`} style={{flex:1,fontSize:11,padding:"2px 6px"}}/><button className="btn bgr sm" onClick={()=>{const a=document.getElementById(`a_${pm.id}`)?.value;const n=document.getElementById(`n_${pm.id}`)?.value;onEd(pm.id,a,n,drv.id);setEp(null);}}><Ic n="chk" s={10}/></button><button className="btn bg2 sm" onClick={()=>setEp(null)}><Ic n="X" s={10}/></button></div>):(<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1}}><div style={{fontSize:11.5}}>{pm.note||"Pago"}</div><div style={{fontSize:9.5,color:"var(--mu2)"}}>{fD(pm.date)}</div></div><div style={{fontFamily:"var(--fh)",fontWeight:700,color:"var(--bl)",fontSize:11.5}}>+${n$(pm.amount)}</div><button className="btn bg2 sm" onClick={()=>setEp(pm.id)}><Ic n="edit" s={10}/></button></div>)}</div>]].map(([title,items,renderFn])=>(
          <div key={title} style={{marginBottom:11}}>
            <div style={{fontSize:10,color:"var(--mu2)",marginBottom:6,fontWeight:600}}>{title}</div>
            <div style={{background:"var(--s2)",borderRadius:"var(--r)",overflow:"hidden"}}>
              {items.length===0&&<div style={{padding:9,color:"var(--mu)",fontSize:11.5,textAlign:"center"}}>Sin {title.toLowerCase()}</div>}
              {items.map(renderFn)}
            </div>
          </div>
        ))}
      </div>
      <div className="mf"><button className="btn bg2" onClick={onClose}>Cerrar</button></div>
    </div></div>);
}
function DDMod({drv,onClose,onSv,onDel,role}){
  const[tab,setTab]=useState("p");const[edit,setEdit]=useState(false);const[f,setF]=useState({...drv});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const ls=licS(f);const canEdit=role!=="driver";
  const JSIZES=["XS","S","M","L","XL","2XL","3XL","4XL"];
  const BTYPES=["Caja de Ahorro ARS","Caja de Ahorro USD","Cuenta Corriente","Cuenta Virtual"];
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh">
        <div style={{display:"flex",alignItems:"center",gap:10}}><Av id={drv.id} text={drv.avatar} size={36} fs={12}/><div><div className="mt">{drv.name}</div><div style={{fontSize:10.5,color:"var(--mu2)"}}>{drv.vehicleBrand} {drv.vehicleModel} · {drv.plate}</div></div></div>
        <div style={{display:"flex",gap:5}}>{canEdit&&!edit&&<button className="btn bg2 sm" onClick={()=>setEdit(true)}><Ic n="edit" s={11}/></button>}<button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      </div>
      <div className="mb">
        <div className="tabs">{[["p","Personal"],["v","Vehículo"],["d","Docs"],["b","Banco"]].map(([id,l])=><button key={id} className={`tab${tab===id?" on":""}`} onClick={()=>{setTab(id);setEdit(false);}}>{l}</button>)}</div>
        {tab==="p"&&(edit?(<div className="fg">
          <div className="fp full"><label>Nombre</label><input {...sf("name")}/></div>
          <div className="fp"><label>WhatsApp</label><input {...sf("phone")}/></div>
          <div className="fp"><label>Email</label><input {...sf("email")}/></div>
          <div className="fp"><label>F. nacimiento</label><input type="date" {...sf("dob")}/></div>
          <div className="fp"><label>Talle</label><select value={f.jacketSize||""} onChange={e=>setF(p=>({...p,jacketSize:e.target.value}))}><option value="">—</option>{JSIZES.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="fp"><label>Rating</label><input type="number" step="0.1" min="1" max="5" {...sf("rating")}/></div>
        </div>):[["Nombre",drv.name],["Email",drv.email||"—"],["WhatsApp",drv.phone],["F. nacimiento",drv.dob?fD(drv.dob):"—"],["Talle",drv.jacketSize||"—"],["Rating",`⭐ ${drv.rating}`]].map(([k,v])=><DR key={k} k={k} v={v}/>))}
        {tab==="v"&&(edit?(<div className="fg">
          <div className="fp"><label>Tipo</label><select value={f.vehicleType||"SEDAN"} onChange={e=>setF(p=>({...p,vehicleType:e.target.value}))}>{VT.map(v=><option key={v}>{v}</option>)}</select></div>
          <div className="fp"><label>Marca</label><input {...sf("vehicleBrand")}/></div>
          <div className="fp"><label>Modelo</label><input {...sf("vehicleModel")}/></div>
          <div className="fp"><label>Año</label><input {...sf("vehicleYear")}/></div>
          <div className="fp"><label>Color</label><input {...sf("vehicleColor")}/></div>
          <div className="fp"><label>Patente</label><input {...sf("plate")}/></div>
          <div className="fp full" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:4}}><label style={{fontSize:12.5,color:"var(--tx)"}}>GNC</label><Tog checked={!!f.gnc} onChange={e=>setF(p=>({...p,gnc:e.target.checked}))}/></div>
        </div>):[["Tipo",<VB type={(drv.vehicleType||"SEDAN").toUpperCase()}/>],["Marca",drv.vehicleBrand||"—"],["Modelo",drv.vehicleModel||"—"],["Año",drv.vehicleYear||"—"],["Color",drv.vehicleColor||"—"],["Patente",drv.plate||"—"],["GNC",drv.gnc?"✅":"❌"]].map(([k,v])=><DR key={k} k={k} v={v}/>))}
        {tab==="d"&&(edit?(<div className="fg">
          <div className="fp full"><label>Vencimiento licencia</label><input type="date" {...sf("licenseExpiry")}/></div>
          {ls.s==="exp"&&<div className="lw"><Ic n="warn" s={12}/> Licencia VENCIDA</div>}
          <FUp label="Licencia — Frente" value={f.licenseFront} onChange={v=>setF(p=>({...p,licenseFront:v}))}/>
          <FUp label="Licencia — Dorso" value={f.licenseBack} onChange={v=>setF(p=>({...p,licenseBack:v}))}/>
          <div className="fp full"><FUp label="Seguro" value={f.insuranceDoc} onChange={v=>setF(p=>({...p,insuranceDoc:v}))} accept=".pdf,image/*"/></div>
        </div>):(<>{[["Vto. licencia",<span style={{color:licS(drv).c,fontWeight:700}}>{licS(drv).l}</span>],["Lic. frente",drv.licenseFront?"✅":"-"],["Lic. dorso",drv.licenseBack?"✅":"-"],["Seguro",drv.insuranceDoc?"✅":"-"]].map(([k,v])=><DR key={k} k={k} v={v}/>)}{drv.licenseFront?.data&&drv.licenseFront.type?.startsWith("image")&&<img src={drv.licenseFront.data} alt="" style={{width:"100%",borderRadius:7,marginTop:8}}/>}</>))}
        {tab==="b"&&(edit?(<div className="fg">
          <div className="fp"><label>Banco</label><input {...sf("bank")}/></div>
          <div className="fp"><label>Tipo cuenta</label><select value={f.bankAccountType||""} onChange={e=>setF(p=>({...p,bankAccountType:e.target.value}))}><option value="">—</option>{BTYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="fp"><label>N° cuenta</label><input {...sf("bankAccount")}/></div>
          <div className="fp"><label>CUIT/CUIL</label><input {...sf("cuitCuil")}/></div>
          <div className="fp full"><label>CBU/CVU</label><input {...sf("cbu")} maxLength={22} style={{fontFamily:"monospace"}}/></div>
          <div className="fp full"><label>Alias</label><input {...sf("alias")}/></div>
        </div>):[["Banco",drv.bank||"—"],["Tipo",drv.bankAccountType||"—"],["CBU/CVU",drv.cbu||"—"],["Alias",drv.alias||"—"],["CUIT/CUIL",drv.cuitCuil||"—"]].map(([k,v])=><DR key={k} k={k} v={v}/>))}
      </div>
      <div className="mf">
        {canEdit&&<button className="btn bg2 sm" style={{color:"var(--re)",marginRight:"auto"}} onClick={()=>onDel(drv.id)}><Ic n="trash" s={10}/></button>}
        {edit?<><button className="btn bg2" onClick={()=>{setF({...drv});setEdit(false);}}>Cancelar</button><button className="btn bp" onClick={()=>{onSv(f);setEdit(false);}}><Ic n="chk" s={12}/> Guardar</button></>:<button className="btn bg2" onClick={()=>setEdit(true)}><Ic n="edit" s={12}/> Editar</button>}
      </div>
    </div></div>);
}
function NDMod({onClose,onSv}){
  const[step,setStep]=useState(0);
  const[f,setF]=useState({name:"",phone:"",email:"",dob:"",vehicleType:"SEDAN",vehicleBrand:"",vehicleModel:"",vehicleYear:"",vehicleColor:"",plate:"",gnc:false,licenseExpiry:"",licenseFront:null,licenseBack:null,insuranceDoc:null,jacketSize:"",bank:"",bankAccountType:"",bankAccount:"",cbu:"",alias:"",cuitCuil:"",rating:5.0,walletBalance:0});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const ls=licS(f);const steps=["Personal","Vehículo","Docs","Banco"];
  const JSIZES=["XS","S","M","L","XL","2XL","3XL","4XL"];
  const BTYPES=["Caja de Ahorro ARS","Caja de Ahorro USD","Cuenta Corriente","Cuenta Virtual"];
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh"><div><div className="mt">Nuevo chofer</div><div style={{fontSize:10.5,color:"var(--mu2)",marginTop:1}}>Paso {step+1}/{steps.length} — {steps[step]}</div></div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      <div style={{padding:"7px 20px 0",display:"flex",gap:5}}>{steps.map((s,i)=><div key={s} className="sb3" style={{flex:1,background:i<=step?"var(--ac)":"var(--b2)",cursor:i<step?"pointer":"default"}} onClick={()=>i<step&&setStep(i)}/>)}</div>
      <div className="mb">
        {step===0&&<div className="fg">
          <div className="fp full"><label>Nombre completo *</label><input {...sf("name")}/></div>
          <div className="fp"><label>WhatsApp (con + y cód. país)</label><input {...sf("phone")} placeholder="+5491155443322"/></div>
          <div className="fp"><label>Email</label><input type="email" {...sf("email")}/></div>
          <div className="fp"><label>F. nacimiento</label><input type="date" {...sf("dob")}/></div>
          <div className="fp"><label>Talle campera</label><select value={f.jacketSize} onChange={e=>setF(p=>({...p,jacketSize:e.target.value}))}><option value="">—</option>{JSIZES.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="fp"><label>Rating</label><input type="number" step="0.1" min="1" max="5" {...sf("rating")}/></div>
        </div>}
        {step===1&&<div className="fg">
          <div className="fp full"><label>Tipo de vehículo *</label><select value={f.vehicleType} onChange={e=>setF(p=>({...p,vehicleType:e.target.value}))}>{VT.map(v=><option key={v}>{v}</option>)}</select><div style={{fontSize:10.5,color:"var(--mu2)",marginTop:3}}>SEDAN≤3 · VAN≤4 · HIACE≤7 · SPRINTER≤14 pax</div></div>
          <div className="fp"><label>Marca *</label><input {...sf("vehicleBrand")}/></div>
          <div className="fp"><label>Modelo *</label><input {...sf("vehicleModel")}/></div>
          <div className="fp"><label>Año</label><input {...sf("vehicleYear")}/></div>
          <div className="fp"><label>Color</label><input {...sf("vehicleColor")}/></div>
          <div className="fp"><label>Patente *</label><input {...sf("plate")}/></div>
          <div className="fp full" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:5}}><label style={{fontSize:12.5,color:"var(--tx)"}}>GNC</label><Tog checked={!!f.gnc} onChange={e=>setF(p=>({...p,gnc:e.target.checked}))}/></div>
        </div>}
        {step===2&&<div className="fg">
          <div className="fp full"><label>Vencimiento licencia</label><input type="date" {...sf("licenseExpiry")}/></div>
          {ls.s==="exp"&&<div className="lw"><Ic n="warn" s={12}/> Licencia VENCIDA</div>}
          <FUp label="Licencia — Frente" value={f.licenseFront} onChange={v=>setF(p=>({...p,licenseFront:v}))} accept="image/*,.pdf"/>
          <FUp label="Licencia — Dorso" value={f.licenseBack} onChange={v=>setF(p=>({...p,licenseBack:v}))} accept="image/*,.pdf"/>
          <div className="fp full"><FUp label="Seguro del vehículo" value={f.insuranceDoc} onChange={v=>setF(p=>({...p,insuranceDoc:v}))} accept=".pdf,image/*"/></div>
        </div>}
        {step===3&&<div className="fg">
          <div className="fp"><label>Banco</label><input {...sf("bank")}/></div>
          <div className="fp"><label>Tipo de cuenta</label><select value={f.bankAccountType} onChange={e=>setF(p=>({...p,bankAccountType:e.target.value}))}><option value="">—</option>{BTYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="fp"><label>N° de cuenta</label><input {...sf("bankAccount")}/></div>
          <div className="fp"><label>CUIT/CUIL</label><input {...sf("cuitCuil")}/></div>
          <div className="fp full"><label>CBU/CVU</label><input {...sf("cbu")} maxLength={22} style={{fontFamily:"monospace"}}/></div>
          <div className="fp full"><label>Alias</label><input {...sf("alias")}/></div>
        </div>}
      </div>
      <div className="mf">
        <button className="btn bg2" onClick={step===0?onClose:()=>setStep(s=>s-1)}>{step===0?"Cancelar":"← Atrás"}</button>
        {step<3?<button className="btn bp" onClick={()=>setStep(s=>s+1)} disabled={step===0&&!f.name.trim()}>Siguiente →</button>
        :<button className="btn bp" onClick={()=>{const pts=f.name.trim().split(" ");const av=(pts[0]?.[0]||"?").toUpperCase()+(pts[1]?.[0]||"").toUpperCase();const drvId="d"+Date.now();onSv({...f,id:drvId,avatar:av,active:true},drvId);}} disabled={!f.name.trim()||!f.phone.trim()}><Ic n="chk" s={12}/> Guardar chofer</button>}
      </div>
    </div></div>);
}
// ── NEW RESERVATION MODAL ──────────────────────────────────────────────────────
function NRMod({onClose,onSv,reservations,rt,providers}){
  const[f,setF]=useState({company:"",providerCode:"",providerId:"",passengerName:"",passengerPhone:"",passengerEmail:"",date:"",time:"",origin:"",destination:"",vehicleType:"SEDAN",pax:1,luggage:0,price:0,driverPrice:0,currency:"$",isArrival:false,flightNumber:"",driverLink:"",notes:""});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const ap=gPx(f.origin,f.destination,f.vehicleType,rt);const noR=!ap&&f.origin&&f.destination;
  const go=()=>onSv({...f,date:tI(f.date)||f.date,driverPrice:f.driverPrice||ap||0,id:"r"+Date.now(),code:gc(reservations.map(r=>r.code)),status:"pending",driverId:null,rawEmail:"",createdAt:TD});
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc mlg">
      <div className="mh"><div className="mt">Nueva reserva</div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      <div className="mb"><div className="fg">
        <div className="fp"><label>Empresa</label><select value={f.providerId} onChange={e=>{const pv=providers.find(p=>p.id===e.target.value);setF(p=>({...p,providerId:e.target.value,company:pv?.name||p.company}));}}><option value="">Seleccionar o escribir</option>{providers.map(p=><option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}</select></div>
        <div className="fp"><label>Nombre empresa (si no está)</label><input {...sf("company")}/></div>
        <div className="fp"><label>Cód. proveedor</label><input {...sf("providerCode")}/></div>
        <div className="fp"><label>Pasajero *</label><input {...sf("passengerName")}/></div>
        <div className="fp"><label>Teléfono</label><input {...sf("passengerPhone")}/></div>
        <div className="fp"><label>Email</label><input {...sf("passengerEmail")}/></div>
        <div className="fp"><label>Fecha (DD-MM-AAAA) *</label><input {...sf("date")} placeholder="dd-mm-aaaa"/></div>
        <div className="fp"><label>Hora (24hs, ej: 14:30) *</label><input type="time" {...sf("time")} placeholder="14:30"/></div>
        <div className="fp full"><label>Origen *</label><input {...sf("origin")} placeholder="AEP / EZE / CABA / hotel..."/></div>
        <div className="fp full"><label>Destino *</label><input {...sf("destination")} placeholder="AEP / EZE / hotel..."/></div>
        <div className="fp"><label>Vehículo</label><select value={f.vehicleType} onChange={e=>setF(p=>({...p,vehicleType:e.target.value,driverPrice:gPx(f.origin,f.destination,e.target.value,rt)||0}))}>{VT.map(v=><option key={v}>{v}</option>)}</select></div>
        <div className="fp"><label>Pax</label><input type="number" min="1" {...sf("pax")}/></div>
        <div className="fp"><label>Equipaje</label><input type="number" min="0" {...sf("luggage")}/></div>
        <div className="fp"><label>Tarifa cliente ($)</label><input type="number" {...sf("price")}/></div>
        {noR&&<div className="pw2 full"><Ic n="warn" s={12}/> Ruta fuera de tarifario — ingresá el valor para el chofer.</div>}
        <div className="fp"><label>Valor chofer ($){ap?` — sug: $${n$(ap)}`:""}</label><input type="number" value={f.driverPrice||ap||""} onChange={e=>setF(p=>({...p,driverPrice:parseFloat(e.target.value)}))} placeholder={ap?String(ap):"0"}/></div>
        <div className="fp full" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><label style={{fontSize:12.5,color:"var(--tx)"}}>Arribo con vuelo</label><Tog checked={!!f.isArrival} onChange={e=>setF(p=>({...p,isArrival:e.target.checked}))}/></div>
        {f.isArrival&&<div className="fp"><label>Nro. vuelo</label><input {...sf("flightNumber")}/></div>}
        <div className="fp full"><label>Driver Link</label><input {...sf("driverLink")}/></div>
        <div className="fp full"><label>Notas</label><textarea {...sf("notes")} rows={2}/></div>
        <div className="fp full"><FUp label="Contrato (PDF/DOC)" value={f.contractDoc} onChange={v=>setF(p=>({...p,contractDoc:v}))} accept=".pdf,.doc,.docx,image/*"/></div>
        {f.contractDoc&&<div className="fp full" style={{background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.3)",borderRadius:7,padding:"7px 11px",fontSize:11.5,color:"var(--gr)"}}>✅ Contrato: {f.contractDoc.name}</div>}
      </div></div>
      <div className="mf"><button className="btn bg2" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={go}><Ic n="chk" s={12}/> Crear reserva</button></div>
    </div></div>);
}
// ── USERS PAGE ─────────────────────────────────────────────────────────────────
function ChgPwBtn({uid,users,pU,toast}){
  const[show,setShow]=useState(false);
  const u=users.find(x=>x.id===uid);
  const[f,setF]=useState({pw:"",phone:"",email:""});
  const[err,setErr]=useState("");
  const doSave=async()=>{
    if(f.pw&&f.pw.length<6){setErr("Contraseña: mín. 6 caracteres");return;}
    const upd={...u};
    if(f.pw)upd.password=f.pw;
    if(f.phone.trim())upd.phone=f.phone.trim();
    if(f.email.trim())upd.email=f.email.trim();
    await pU(users.map(x=>x.id===uid?upd:x));
    setF({pw:"",phone:"",email:""});setErr("");setShow(false);toast("Usuario actualizado ✅");
  };
  if(!show)return <button className="btn bg2 sm" onClick={()=>{setF({pw:"",phone:u?.phone||"",email:u?.email||""});setShow(true);}} title="Editar usuario"><Ic n="edit" s={10}/></button>;
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&setShow(false)}>
    <div className="mc"><div className="mh"><div className="mt">Editar usuario — {u?.username}</div><button className="btn bg2 sm" onClick={()=>setShow(false)}><Ic n="X" s={12}/></button></div>
    <div className="mb"><div className="fg">
      <div className="fp full"><label>Teléfono</label><input value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))} placeholder="+5491155443322"/></div>
      <div className="fp full"><label>Email</label><input type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/></div>
      <div className="fp full"><label>Nueva contraseña (dejar vacío para no cambiar)</label><PwI value={f.pw} onChange={e=>setF(p=>({...p,pw:e.target.value}))} placeholder="Nueva contraseña..."/></div>
      {err&&<div className="fp full" style={{color:"var(--re)",fontSize:12}}>{err}</div>}
    </div></div>
    <div className="mf"><button className="btn bg2" onClick={()=>setShow(false)}>Cancelar</button><button className="btn bp" onClick={doSave}><Ic n="chk" s={12}/> Guardar</button></div>
    </div></div>);
}

function UsrPage({users,drivers,pU,toast}){
  const[mN,setMN]=useState(false);
  const[srchU,setSrchU]=useState("");
  const roleColors={admin:{color:"var(--ac)",bg:"rgba(0,212,255,.1)"},colaborador:{color:"var(--am)",bg:"rgba(245,158,11,.1)"},driver:{color:"var(--gr)",bg:"rgba(16,185,129,.1)"}};
  return(<div>
    <div style={{marginBottom:11,display:"flex",gap:8,alignItems:"center"}}>
      <SI value={srchU} onChange={e=>setSrchU(e.target.value)} placeholder="Buscar usuario, nombre, email..." style={{flex:1}}/>
      <button className="btn bp" onClick={()=>setMN(true)}><Ic n="plus" s={12}/> Crear usuario</button>
    </div>
    <div style={{marginBottom:14,background:"var(--s2)",borderRadius:"var(--r)",padding:"10px 14px",fontSize:12,color:"var(--mu2)"}}>
      <strong style={{color:"var(--tx)"}}>Roles:</strong> Admin — acceso total · Colaborador — todo excepto financiero · Chofer — sus viajes y billetera (solo lectura)
    </div>
    <div className="tw"><table><thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Chofer</th><th>Email</th><th>Teléfono</th><th></th></tr></thead>
      <tbody>{users.filter(u=>!srchU||[u.username,u.name,u.email,u.phone].some(f=>(f||"").toLowerCase().includes(srchU.toLowerCase()))).map(u=>{const drv=drivers.find(d=>d.id===u.driverId);const rc=roleColors[u.role]||{color:"var(--mu)",bg:"var(--s2)"};return(<tr key={u.id}>
        <td style={{fontWeight:600,fontSize:12.5}}>{u.username}</td>
        <td style={{fontSize:12}}>{u.name||"—"}</td>
        <td><span className="badge" style={{color:rc.color,background:rc.bg}}>{u.role}</span></td>
        <td>{drv?<div style={{display:"flex",alignItems:"center",gap:5}}><Av id={drv.id} text={drv.avatar} size={20} fs={7}/>{drv.name}</div>:"—"}</td>
        <td style={{color:"var(--mu2)",fontSize:11.5}}>{u.email}</td>
        <td style={{fontSize:11.5,color:"var(--mu2)"}}>{u.phone||"—"}</td>
        <td><ChgPwBtn uid={u.id} users={users} pU={pU} toast={toast}/><button className="btn bg2 sm" style={{color:"var(--re)"}} onClick={async()=>{if(u.id==="u0"){toast("No podés eliminar el admin principal","⚠️");return;}await pU(users.filter(x=>x.id!==u.id));toast("Eliminado","🗑️");}}><Ic n="trash" s={10}/></button></td>
      </tr>);})}
      </tbody></table></div>
    {mN&&<NUMod drivers={drivers} users={users} onClose={()=>setMN(false)} onSv={async u=>{await pU([...users,u]);setMN(false);toast("Usuario creado ✅");}}/>}
  </div>);
}
function NUMod({drivers,users,onClose,onSv}){
  const[f,setF]=useState({username:"",password:"",name:"",email:"",phone:"",role:"colaborador",driverId:""});
  const[err,setErr]=useState("");
  const sf=k=>({value:f[k],onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const doCreate=()=>{
    setErr("");
    if(!f.username.trim()||!f.name.trim()||!f.email.trim()||!f.phone.trim()||!f.password){setErr("Todos los campos son obligatorios.");return;}
    if(f.password.length<6){setErr("La contraseña debe tener al menos 6 caracteres.");return;}
    if(users.find(u=>u.username===f.username)){setErr("Ese nombre de usuario ya existe.");return;}
    if(f.role==="driver"&&!f.driverId){setErr("Debés vincular un chofer.");return;}
    onSv({...f,id:"u"+Date.now()});
  };
  return(<div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="mc"><div className="mh"><div className="mt">Crear usuario</div><button className="btn bg2 sm" onClick={onClose}><Ic n="X" s={12}/></button></div>
      <div className="mb">
        <div style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"10px 12px",marginBottom:14,fontSize:11.5,color:"var(--mu2)"}}>
          <strong style={{color:"var(--tx)"}}>Roles:</strong> Admin — acceso total · Colaborador — sin acceso financiero · Chofer — solo sus viajes<br/><strong style={{color:"var(--am)"}}>Contraseña por defecto choferes:</strong> ang2506
        </div>
        <div className="fg">
          <div className="fp full"><label>Nombre de usuario *</label><input {...sf("username")} placeholder="juan.perez"/></div>
          <div className="fp full"><label>Nombre completo *</label><input {...sf("name")}/></div>
          <div className="fp"><label>Email *</label><input type="email" {...sf("email")}/></div>
          <div className="fp"><label>Teléfono * (con + y cód. país)</label><input {...sf("phone")} placeholder="+5491155443322"/></div>
          <div className="fp"><label>Contraseña * (mín. 6 chars)</label><PwI value={f.password} onChange={e=>setF(p=>({...p,password:e.target.value}))}/></div>
          <div className="fp"><label>Rol *</label><select value={f.role} onChange={e=>setF(p=>({...p,role:e.target.value,driverId:""}))}>
            <option value="colaborador">Colaborador</option>
            <option value="admin">Administrador</option>
            <option value="driver">Chofer</option>
          </select></div>
          {f.role==="driver"&&<div className="fp full"><label>Chofer vinculado *</label><select value={f.driverId} onChange={e=>setF(p=>({...p,driverId:e.target.value}))}><option value="">Seleccionar</option>{drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>}
          {err&&<div className="fp full" style={{color:"var(--re)",fontSize:12}}>{err}</div>}
        </div>
      </div>
      <div className="mf"><button className="btn bg2" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={doCreate}><Ic n="chk" s={12}/> Crear usuario</button></div>
    </div></div>);
}
// ── ROOT APP ───────────────────────────────────────────────────────────────────
function App(){
  const[res,setRes]=useState([]);const[drv,setDrv]=useState([]);const[usr,setUsr]=useState([]);
  const[pmt,setPmt]=useState([]);const[ses,setSes]=useState(null);const[rt,setRt]=useState([]);
  const[pvd,setPvd]=useState([]);const[pvp,setPvp]=useState([]);
  const[loading,setLoading]=useState(true);const[toastData,setToastData]=useState(null);
  const toast=useCallback((msg,icon="✅")=>{setToastData({msg,icon});setTimeout(()=>setToastData(null),3200);},[]);
  useEffect(()=>{
    (async()=>{
      setLoading(true);
      let r=await ldWithMigration(K.r,"r"),d=await ldWithMigration(K.d,"d"),u=await ldWithMigration(K.u,"u"),p=await ldWithMigration(K.p,"p"),s=await ldWithMigration(K.s,"s"),rt2=await ldWithMigration(K.rt,"rt"),pv2=await ldWithMigration(K.pv,"pv"),pp2=await ldWithMigration(K.pp,"pp");
      if(!r){r=SR;await sv(K.r,r);}
      if(!d){d=SD;await sv(K.d,d);}
      if(!u){u=SU;await sv(K.u,u);}
      // ALWAYS rebuild driver users from current SD to guarantee correct driverIds
      // Keep non-driver users (admin/colaborador) but regenerate ALL driver users
      {
        const normN=n=>(n||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,".").replace(/[^a-z0-9.]/g,"").slice(0,20);
        const nonDriverUsers=(u||SU).filter(x=>x.role!=="driver");
        const driverUsers=(d||SD).map((dr,i)=>{
          // Preserve existing password if user already exists (by username or driverId)
          const existing=(u||SU).find(x=>x.role==="driver"&&(x.driverId===dr.id||normN(x.name)===normN(dr.name)||x.username===normN(dr.name)));
          return {
            id:`u_auto_${dr.id}`,
            role:"driver",
            username:normN(dr.name)||`chofer${i+1}`,
            password:existing?.password||"ang2506",
            phone:dr.phone,
            email:dr.email,
            driverId:dr.id,
            name:dr.name
          };
        });
        u=[...nonDriverUsers,...driverUsers];
        await sv(K.u,u);
      }
      if(!p){p=[];await sv(K.p,p);}
      if(!rt2){rt2=RSD;await sv(K.rt,rt2);}
      if(!pv2){pv2=PV_SEED;await sv(K.pv,pv2);}
      if(!pp2){pp2=[];await sv(K.pp,pp2);}
      // Restore session from storage (simple: just use what was saved)
      const storedSes=await ld(K.s);
      if(storedSes&&storedSes.role==="driver"){
        // Find the correct user from the freshly-rebuilt user list (guaranteed correct driverId)
        // Try multiple matching strategies for stored session
        const idFromStored=(storedSes.id||"").replace("u_auto_","");
        const freshUser=u.find(x=>x.role==="driver"&&x.username===storedSes.username)||
          u.find(x=>x.role==="driver"&&x.driverId===storedSes.driverId)||
          u.find(x=>x.role==="driver"&&x.id===storedSes.id)||
          (idFromStored ? u.find(x=>x.role==="driver"&&x.driverId===idFromStored) : null);
        if(freshUser){
          // Use the fresh user data (correct driverId from SD) but keep it as session
          const fixedSes={...storedSes,driverId:freshUser.driverId,name:freshUser.name};
          await sv(K.s,fixedSes);
          setSes(fixedSes);
        }else{
          await sv(K.s,null); // can't find driver - force re-login
        }
      }else if(storedSes){setSes(storedSes);}
      setRes(r);setDrv(d);setUsr(u);setPmt(p);setRt(rt2);setPvd(pv2);setPvp(pp2);
      setLoading(false);
    })();
  },[]);
  const pR=async l=>{setRes(l);await sv(K.r,l);};
  const pD=async l=>{setDrv(l);await sv(K.d,l);};
  const pU=async l=>{setUsr(l);await sv(K.u,l);};
  const pP=async l=>{setPmt(l);await sv(K.p,l);};
  const pRT=async l=>{setRt(l);await sv(K.rt,l);};
  const pPV=async l=>{setPvd(l);await sv(K.pv,l);};
  const pPP=async l=>{setPvp(l);await sv(K.pp,l);};
  const handleLogin=async u=>{
    // Derive driverId directly from user.id (u_auto_d_2 → d_2) - 100% reliable
    let sessionUser={...u};
    if(u.role==="driver"){
      // Method 1: extract from id
      const fromId=(u.id||"").replace("u_auto_","");
      const dFromId=drv.find(d=>d.id===fromId);
      // Method 2: by existing driverId
      const dFromDid=drv.find(d=>d.id===u.driverId);
      // Method 3: by username (normalized name)
      const normN=n=>(n||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,".").replace(/[^a-z0-9.]/g,"").slice(0,20);
      const dFromUname=drv.find(d=>normN(d.name)===u.username);
      const matched=dFromId||dFromDid||dFromUname;
      if(matched)sessionUser={...u,driverId:matched.id,name:matched.name};
    }
    setSes(sessionUser);
    await sv(K.s,sessionUser);
  };
  const handleLogout=async()=>{setSes(null);await sv(K.s,null);};
  if(loading)return(<><style>{css}</style><div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0A0C10"}}><div style={{textAlign:"center"}}><div className="spin" style={{margin:"0 auto 14px"}}/><div style={{color:"var(--mu)",fontSize:12.5}}>Cargando...</div></div></div></>);
  return(
    <>
      <style>{css}</style>
      {!ses&&<Login users={usr} onLogin={handleLogin}/>}
      {ses?.role==="driver"&&<DPortal session={ses} drivers={drv} reservations={res} payments={pmt} onLogout={handleLogout} pR={pR}/>}
      {(ses?.role==="admin"||ses?.role==="colaborador")&&<Admin session={ses} drivers={drv} reservations={res} payments={pmt} users={usr} routePrices={rt} providers={pvd} provPayments={pvp} pR={pR} pD={pD} pP={pP} pU={pU} pRT={pRT} pPV={pPV} pPP={pPP} onLogout={handleLogout} toast={toast}/>}
      {toastData&&<div className="toast"><span>{toastData.icon}</span><span>{toastData.msg}</span></div>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
