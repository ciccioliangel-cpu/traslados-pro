import { useState, useEffect, useCallback } from "react";

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const K = { res:"tp4:res", drv:"tp4:drv", usr:"tp4:usr", pmt:"tp4:pmt", ses:"tp4:ses" };
const load = async k => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const save = async (k,v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };

// ─── CODE GEN ─────────────────────────────────────────────────────────────────
const genCode = (existing=[]) => {
  const C="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c; do { c="TR-"; for(let i=0;i<8;i++) c+=C[Math.floor(Math.random()*C.length)]; } while(existing.includes(c));
  return c;
};

// ─── DATES ───────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0];
const TOMORROW = new Date(Date.now()+86400000).toISOString().split("T")[0];
const IN2 = new Date(Date.now()+2*86400000).toISOString().split("T")[0];
const IN20D = new Date(Date.now()+20*3600000).toISOString().split("T")[0];
const IN20T = new Date(Date.now()+20*3600000).toTimeString().slice(0,5);

// ─── SEEDS ───────────────────────────────────────────────────────────────────
const SD = [
  {id:"d1",name:"Carlos Méndez",phone:"5491155443322",email:"carlos@email.com",dob:"1985-03-12",vehicleType:"Van",vehicleBrand:"Mercedes",vehicleModel:"Vito",vehicleYear:"2020",vehicleColor:"Negro",plate:"AB 123 CD",gnc:false,licenseExpiry:"2026-08-15",licenseFront:null,licenseBack:null,insuranceDoc:null,jacketSize:"L",bank:"Banco Galicia",bankAccountType:"Caja de Ahorro ARS",bankAccount:"0123456789",cbu:"0070123420000001234560",alias:"carlos.mendez.traslados",cuitCuil:"20-12345678-9",rating:4.9,active:true,avatar:"CM",walletBalance:0},
  {id:"d2",name:"Roberto Silva",phone:"5491144332211",email:"roberto@email.com",dob:"1979-07-22",vehicleType:"Sedan",vehicleBrand:"Ford",vehicleModel:"Galaxy",vehicleYear:"2019",vehicleColor:"Plata",plate:"EF 456 GH",gnc:true,licenseExpiry:"2025-02-10",licenseFront:null,licenseBack:null,insuranceDoc:null,jacketSize:"XL",bank:"Banco Santander",bankAccountType:"Cuenta Corriente",bankAccount:"9876543210",cbu:"0720000088000005678900",alias:"roberto.silva.chofer",cuitCuil:"20-98765432-1",rating:4.7,active:true,avatar:"RS",walletBalance:150},
  {id:"d3",name:"Ana González",phone:"5491166554433",email:"ana@email.com",dob:"1990-11-05",vehicleType:"Mini Bus",vehicleBrand:"VW",vehicleModel:"Transporter",vehicleYear:"2022",vehicleColor:"Blanco",plate:"IJ 789 KL",gnc:false,licenseExpiry:"2027-05-30",licenseFront:null,licenseBack:null,insuranceDoc:null,jacketSize:"M",bank:"Banco Nación",bankAccountType:"Caja de Ahorro ARS",bankAccount:"1122334455",cbu:"0110123430012345678900",alias:"ana.gonzalez.vip",cuitCuil:"27-11223344-5",rating:4.8,active:true,avatar:"AG",walletBalance:320},
];
const SU = [
  {id:"u0",role:"admin",username:"admin",password:"admin123",phone:"5491100000000",email:"admin@traslados.com",driverId:null},
  {id:"u1",role:"driver",username:"carlos.mendez",password:"chofer123",phone:"5491155443322",email:"carlos@email.com",driverId:"d1"},
  {id:"u2",role:"driver",username:"roberto.silva",password:"chofer456",phone:"5491144332211",email:"roberto@email.com",driverId:"d2"},
  {id:"u3",role:"driver",username:"ana.gonzalez",password:"chofer789",phone:"5491166554433",email:"ana@email.com",driverId:"d3"},
];
const SR = [
  {id:"r1",code:"TR-A1B2C3D4",providerCode:"BK-9912",company:"Booking.com",passengerName:"John Smith",passengerPhone:"+1 555 0101",passengerEmail:"john.smith@email.com",date:TOMORROW,time:"08:30",origin:"Aeropuerto Ezeiza (EZE)",destination:"Hotel Alvear, Recoleta",vehicleType:"Van",pax:3,luggage:2,price:85,currency:"USD",status:"pending",driverId:null,isArrival:true,flightNumber:"AA1234",driverLink:"",rawEmail:"",notes:"",createdAt:TODAY},
  {id:"r2",code:"TR-E5F6G7H8",providerCode:"SOL-4455",company:"Agencia Viajes Sol",passengerName:"María García",passengerPhone:"+54 11 5566 7788",passengerEmail:"mgarcia@email.com",date:TOMORROW,time:"14:00",origin:"Aeroparque Jorge Newbery (AEP)",destination:"Sheraton Buenos Aires",vehicleType:"Sedan",pax:1,luggage:1,price:45,currency:"USD",status:"confirmed",driverId:"d1",isArrival:false,flightNumber:"",driverLink:"",rawEmail:"",notes:"Pasajera VIP",createdAt:TODAY},
  {id:"r3",code:"TR-I9J0K1L2",providerCode:"WEB-0071",company:"Formulario Web",passengerName:"Pierre Dupont",passengerPhone:"+33 6 12 34 56 78",passengerEmail:"pierre@mail.fr",date:IN2,time:"10:15",origin:"Hotel Madero, Puerto Madero",destination:"Aeropuerto Ezeiza (EZE)",vehicleType:"SUV",pax:2,luggage:4,price:70,currency:"USD",status:"confirmed",driverId:"d2",isArrival:false,flightNumber:"",driverLink:"",rawEmail:"",notes:"",createdAt:TODAY},
  {id:"r4",code:"TR-M3N4O5P6",providerCode:"BK-1047",company:"Booking.com",passengerName:"Emma Wilson",passengerPhone:"+44 7911 123456",passengerEmail:"emma.w@email.co.uk",date:IN20D,time:IN20T,origin:"Aeropuerto Ezeiza (EZE)",destination:"Palacio Duhau Park Hyatt",vehicleType:"Van",pax:4,luggage:6,price:95,currency:"USD",status:"pending",driverId:null,isArrival:true,flightNumber:"BA246",driverLink:"",rawEmail:"",notes:"",createdAt:TODAY},
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const VTYPES=["Sedan","SUV","Van","Minibus","Bus"];
const DVTYPES=["Sedan","Monovolumen","Van","Mini Van","Mini Bus"];
const JSIZES=["XS","S","M","L","XL","XXL","XXXL"];
const BTYPES=["Caja de Ahorro ARS","Caja de Ahorro USD","Cuenta Corriente","Cuenta Virtual"];
const SM={
  pending:{label:"Pendiente",color:"#F59E0B",bg:"rgba(245,158,11,0.12)"},
  assigned:{label:"Asignado",color:"#3B82F6",bg:"rgba(59,130,246,0.12)"},
  confirmed:{label:"Confirmado",color:"#10B981",bg:"rgba(16,185,129,0.12)"},
  rejected:{label:"Rechazado",color:"#EF4444",bg:"rgba(239,68,68,0.12)"},
  completed:{label:"Completado",color:"#6B7280",bg:"rgba(107,114,128,0.12)"},
};
const AVC=[["#7C3AFF","#4C1D95"],["#00D4FF","#0C4A6E"],["#10B981","#064E3B"],["#F59E0B","#78350F"],["#EF4444","#7F1D1D"],["#EC4899","#831843"]];
const avc=id=>AVC[(id||"x").charCodeAt((id||"x").length-1)%AVC.length];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const waLink=(p,t)=>`https://wa.me/${(p||"").replace(/\D/g,"")}?text=${encodeURIComponent(t)}`;
const maps=p=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p)}`;
const waze=p=>`https://waze.com/ul?q=${encodeURIComponent(p)}&navigate=yes`;
const licExp=d=>d?.licenseExpiry&&new Date(d.licenseExpiry)<new Date();
const licSt=d=>{
  if(!d?.licenseExpiry)return{s:"x",l:"Sin fecha",c:"var(--mu)"};
  const days=Math.round((new Date(d.licenseExpiry)-new Date())/86400000);
  if(days<0)return{s:"exp",l:"VENCIDA",c:"var(--re)"};
  if(days<30)return{s:"soon",l:`Vence en ${days}d`,c:"var(--am)"};
  return{s:"ok",l:`OK · ${d.licenseExpiry}`,c:"var(--gr)"};
};
const hrs=(date,time)=>(new Date(`${date}T${time}:00`)-new Date())/3600000;
const isUrg=r=>!r.driverId&&hrs(r.date,r.time)>0&&hrs(r.date,r.time)<24;

// ─── WA MESSAGES ──────────────────────────────────────────────────────────────
const msgAlert=(r,d)=>`🚗 *TRASLADO OFRECIDO — ${r.code}*

Hola ${d?.name?.split(" ")[0]||""}! Tenés un traslado disponible:

📋 *Código:* ${r.code}
🏢 *Cód. proveedor:* ${r.providerCode}
📅 *Fecha:* ${r.date} · ${r.time}hs
👤 *Pasajero:* ${r.passengerName}
📱 *Tel:* ${r.passengerPhone}
👥 *Pax:* ${r.pax}${r.isArrival&&r.flightNumber?`\n✈️ *Vuelo arribo:* ${r.flightNumber}`:""}

📍 *ORIGEN:* ${r.origin}
🗺 Maps: ${maps(r.origin)}
Waze: ${waze(r.origin)}

🏁 *DESTINO:* ${r.destination}
🗺 Maps: ${maps(r.destination)}
Waze: ${waze(r.destination)}${r.driverLink?`\n\n🔗 Driver link: ${r.driverLink}`:""}${r.notes?`\n📝 ${r.notes}`:""}

¿Podés aceptar?
✅ *ACEPTO* o ❌ *RECHAZO*`;

const msgConfirmDrv=(r,d)=>`✅ *TRASLADO CONFIRMADO — ${r.code}*

¡Es tuyo ${d?.name?.split(" ")[0]||""}!

📋 *Código:* ${r.code}
🏢 *Proveedor:* ${r.providerCode}
👤 *Pasajero:* ${r.passengerName}
📱 *Tel:* ${r.passengerPhone}
📅 ${r.date} · ${r.time}hs
👥 ${r.pax} pax · 🧳 ${r.luggage||0} bultos${r.isArrival&&r.flightNumber?`\n✈️ Vuelo arribo: ${r.flightNumber}`:""}

📍 *ORIGEN:* ${r.origin}
🗺 Maps: ${maps(r.origin)}
Waze: ${waze(r.origin)}

🏁 *DESTINO:* ${r.destination}
🗺 Maps: ${maps(r.destination)}
Waze: ${waze(r.destination)}${r.driverLink?`\n\n🔗 Driver link: ${r.driverLink}`:""}${r.notes?`\n📝 ${r.notes}`:""}

¡Buen viaje! 🙌`;

const msgPax=(r,d)=>`✈️ *CONFIRMACIÓN DE TRASLADO*

Estimado/a *${r.passengerName}*,

Su traslado está confirmado ✅

━━━━━━━━━━━━━━━━
📋 *Código:* ${r.code}
🏢 *Referencia:* ${r.providerCode}
📅 *Fecha:* ${r.date} · ${r.time}hs
📍 *Origen:* ${r.origin}
🏁 *Destino:* ${r.destination}
👥 *Pasajeros:* ${r.pax}${r.isArrival&&r.flightNumber?`\n✈️ *Vuelo arribo:* ${r.flightNumber}`:""}${r.notes?`\n📝 ${r.notes}`:""}

━━━━━━━━━━━━━━━━
👨‍✈️ *SU CHOFER:*
*${d?.name}*
🚗 ${d?.vehicleBrand||""} ${d?.vehicleModel||""} ${d?.vehicleYear||""} · ${d?.vehicleColor||""}
🔖 Patente: *${d?.plate}*
📞 *${d?.phone}*

Busque al chofer con cartel con su nombre.
Ante cualquier inconveniente llame al número indicado.

¡Gracias por elegirnos! ✨`;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0A0C10;--s1:#111318;--s2:#181C24;--b1:rgba(255,255,255,0.07);--b2:rgba(255,255,255,0.13);--ac:#00D4FF;--gr:#10B981;--am:#F59E0B;--re:#EF4444;--bl:#3B82F6;--tx:#F0F2F5;--mu:#6B7280;--mu2:#9CA3AF;--fh:'Syne',sans-serif;--fb:'DM Sans',sans-serif;--r:12px;--rl:16px}
body{background:var(--bg);color:var(--tx);font-family:var(--fb);min-height:100vh}
.app{display:flex;height:100vh;overflow:hidden}
.sb{width:220px;min-width:220px;background:var(--s1);border-right:1px solid var(--b1);display:flex;flex-direction:column;padding:20px 12px;gap:4px;overflow-y:auto}
.logo{font-family:var(--fh);font-size:15px;font-weight:800;color:var(--ac);padding:8px 12px 20px;line-height:1.3}.logo span{color:var(--tx)}
.ni{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;font-size:13.5px;font-weight:500;color:var(--mu2);cursor:pointer;transition:all .15s;border:none;background:none;width:100%;text-align:left}
.ni:hover{color:var(--tx);background:var(--s2)}.ni.on{color:var(--ac);background:rgba(0,212,255,0.08)}
.dv{height:1px;background:var(--b1);margin:8px 0}
.mn{flex:1;display:flex;flex-direction:column;overflow:hidden}
.tb{height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;border-bottom:1px solid var(--b1);background:var(--s1);flex-shrink:0}
.tt{font-family:var(--fh);font-size:17px;font-weight:700}
.cnt{flex:1;overflow-y:auto;padding:24px}
.sts{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
.sc{background:var(--s1);border:1px solid var(--b1);border-radius:var(--rl);padding:18px 20px}
.sl{font-size:11.5px;color:var(--mu);text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px}
.sv{font-family:var(--fh);font-size:28px;font-weight:800}
.sb2{font-size:11px;color:var(--mu);margin-top:4px}
.ab{display:flex;align-items:center;gap:10px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:var(--r);padding:12px 16px;margin-bottom:16px;font-size:13px;color:var(--re);cursor:pointer}
.ab:hover{background:rgba(239,68,68,0.17)}
.abd{background:var(--re);color:#fff;font-size:11px;font-weight:800;font-family:var(--fh);padding:2px 8px;border-radius:20px;margin-left:auto}
.flt{display:flex;gap:10px;align-items:center;margin-bottom:16px;flex-wrap:wrap}
.fi{background:var(--s1);border:1px solid var(--b2);color:var(--tx);border-radius:8px;padding:8px 12px;font-size:13px;font-family:var(--fb);outline:none;transition:border-color .15s}.fi:focus{border-color:var(--ac)}
.fs{background:var(--s1);border:1px solid var(--b2);color:var(--mu2);border-radius:8px;padding:8px 12px;font-size:13px;font-family:var(--fb);cursor:pointer;outline:none}.fs option{background:#1a1e28}
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:none;font-size:13px;font-weight:500;font-family:var(--fb);cursor:pointer;transition:all .15s;white-space:nowrap;text-decoration:none}
.bp{background:var(--ac);color:#000}.bp:hover{background:#00b8d9}
.bg2{background:transparent;color:var(--mu2);border:1px solid var(--b2)}.bg2:hover{color:var(--tx);background:var(--s2)}
.bgr{background:rgba(16,185,129,.15);color:var(--gr);border:1px solid rgba(16,185,129,.3)}.bgr:hover{background:rgba(16,185,129,.25)}
.bam{background:rgba(245,158,11,.12);color:var(--am);border:1px solid rgba(245,158,11,.3)}
.bre{background:rgba(239,68,68,.12);color:var(--re);border:1px solid rgba(239,68,68,.3)}
.bbl{background:rgba(59,130,246,.15);color:var(--bl);border:1px solid rgba(59,130,246,.3)}
.sm{padding:6px 10px;font-size:12px}
.btn:disabled{opacity:.4;cursor:not-allowed}
.tw{background:var(--s1);border:1px solid var(--b1);border-radius:var(--rl);overflow:hidden}
table{width:100%;border-collapse:collapse}
thead tr{background:var(--s2)}
th{padding:12px 16px;text-align:left;font-size:11px;color:var(--mu);text-transform:uppercase;letter-spacing:.6px;font-weight:600;white-space:nowrap}
td{padding:12px 16px;font-size:13.5px;border-top:1px solid var(--b1);vertical-align:middle}
tbody tr{transition:background .1s}tbody tr:hover{background:rgba(255,255,255,0.025)}
tbody tr.ug{background:rgba(239,68,68,0.04)}tbody tr.ug:hover{background:rgba(239,68,68,0.09)}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11.5px;font-weight:600}
.bd{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-weight:800;flex-shrink:0}
.mo{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;backdrop-filter:blur(4px);animation:fi .15s ease}
@keyframes fi{from{opacity:0}to{opacity:1}}
.mc{background:var(--s1);border:1px solid var(--b2);border-radius:var(--rl);width:100%;max-width:640px;max-height:90vh;overflow-y:auto;animation:su .2s ease}
.mlg{max-width:780px}
@keyframes su{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
.mh{padding:20px 24px 16px;border-bottom:1px solid var(--b1);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.mt{font-family:var(--fh);font-size:16px;font-weight:700}
.mb{padding:20px 24px}
.mf{padding:16px 24px;border-top:1px solid var(--b1);display:flex;gap:8px;justify-content:flex-end}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.fp{display:flex;flex-direction:column;gap:6px}
.fp.full{grid-column:1/-1}
label{font-size:12px;color:var(--mu2);font-weight:500}
input,select,textarea{background:var(--s2);border:1px solid var(--b2);color:var(--tx);border-radius:8px;padding:9px 12px;font-size:13.5px;font-family:var(--fb);outline:none;transition:border-color .15s}
input:focus,select:focus,textarea:focus{border-color:var(--ac)}
select option{background:#1a1e28}
textarea{resize:vertical;min-height:80px}
.sec{font-family:var(--fh);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--ac);margin:20px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(0,212,255,0.15);grid-column:1/-1}
.dr{display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--b1);font-size:13.5px}
.dr:last-child{border-bottom:none}
.dk{color:var(--mu2);font-size:12px;flex-shrink:0;margin-right:12px}
.dv2{font-weight:500;text-align:right;max-width:65%}
.tabs{display:flex;gap:4px;background:var(--s2);border-radius:10px;padding:4px;margin-bottom:20px}
.tab{flex:1;padding:8px;text-align:center;font-size:13px;font-weight:500;border-radius:7px;cursor:pointer;color:var(--mu2);border:none;background:none;font-family:var(--fb);transition:all .15s}
.tab.on{background:var(--s1);color:var(--tx)}
.dcg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.dcc{background:var(--s2);border:2px solid var(--b1);border-radius:var(--r);padding:16px;cursor:pointer;transition:all .15s}
.dcc:hover{border-color:var(--ac);background:rgba(0,212,255,0.05)}.dcc.sel{border-color:var(--ac);background:rgba(0,212,255,0.08)}
.rat{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--am);font-weight:600}
.uz{border:2px dashed var(--b2);border-radius:8px;padding:16px;text-align:center;cursor:pointer;transition:all .15s;background:var(--s2);font-size:12.5px;color:var(--mu2)}
.uz:hover{border-color:var(--ac);color:var(--ac)}.uz.hf{border-color:var(--gr);color:var(--gr);background:rgba(16,185,129,0.05)}
.uz input[type=file]{display:none}
.tg{position:relative;width:40px;height:22px}
.tg input{opacity:0;width:0;height:0}
.tgs{position:absolute;inset:0;background:var(--s2);border:1px solid var(--b2);border-radius:22px;cursor:pointer;transition:.2s}
.tgs:before{content:'';position:absolute;width:16px;height:16px;background:var(--mu);border-radius:50%;top:2px;left:2px;transition:.2s}
.tg input:checked+.tgs{background:rgba(16,185,129,.2);border-color:var(--gr)}
.tg input:checked+.tgs:before{transform:translateX(18px);background:var(--gr)}
.lw{display:flex;align-items:center;gap:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:10px 14px;font-size:12.5px;color:var(--re);grid-column:1/-1}
.wp{background:#1a2a1e;border:1px solid rgba(16,185,129,.25);border-radius:var(--r);padding:14px;font-size:12.5px;line-height:1.65;color:#d1fae5;white-space:pre-wrap;font-family:var(--fb);max-height:320px;overflow-y:auto}
.toast{position:fixed;bottom:24px;right:24px;background:var(--s2);border:1px solid var(--b2);border-radius:var(--r);padding:12px 18px;font-size:13.5px;color:var(--tx);z-index:9999;animation:su .2s ease;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
.nd{width:7px;height:7px;border-radius:50%;background:var(--re);margin-left:auto;flex-shrink:0}
.spin{width:18px;height:18px;border:2px solid rgba(0,212,255,0.3);border-top-color:var(--ac);border-radius:50%;animation:sp .6s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:60px 20px;color:var(--mu)}
.wcard{background:linear-gradient(135deg,rgba(0,212,255,0.12),rgba(124,58,255,0.12));border:1px solid rgba(0,212,255,0.25);border-radius:var(--rl);padding:24px;margin-bottom:20px}
.wbal{font-family:var(--fh);font-size:40px;font-weight:800;color:var(--ac)}
.lw2{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:20px}
.lc{background:var(--s1);border:1px solid var(--b2);border-radius:var(--rl);padding:40px;width:100%;max-width:420px}
.ll{font-family:var(--fh);font-size:22px;font-weight:800;color:var(--ac);margin-bottom:6px}
.ls{font-size:13px;color:var(--mu2);margin-bottom:32px}
.por{min-height:100vh;background:var(--bg);display:flex;flex-direction:column}
.ph{background:var(--s1);border-bottom:1px solid var(--b1);padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between}
.pc{flex:1;padding:20px;max-width:800px;margin:0 auto;width:100%}
.chip{font-family:monospace;font-size:12px;background:rgba(0,212,255,0.1);color:var(--ac);padding:2px 8px;border-radius:6px;letter-spacing:.5px;border:1px solid rgba(0,212,255,0.2)}
.pw{position:relative}.pw input{width:100%;padding-right:40px}
.pe{position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--mu2);background:none;border:none;padding:0}.pe:hover{color:var(--tx)}
.sb3{height:3px;border-radius:2px;transition:background .2s}
@media(max-width:768px){.sb{display:none}.sts{grid-template-columns:1fr 1fr}.dcg{grid-template-columns:1fr}.fg{grid-template-columns:1fr}.mlg{max-width:100%}}
`;

// ─── ICON COMPONENT ───────────────────────────────────────────────────────────
const Ic=({n,s=16})=>{
  const paths={
    car:"M5 17H3v-5l2-5h14l2 5v5h-2M5 17h14M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0",
    user:"M12 8m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0M4 20c0-4 3.6-7 8-7s8 3 8 7",
    cal:"M3 4h18v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4zM16 2v4M8 2v4M3 10h18",
    plus:"M12 5v14M5 12h14",check:"M20 6L9 17l-5-5",x:"M18 6L6 18M6 6l12 12",
    edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z",
    upload:"M16 16l-4-4-4 4M12 12v9M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3",
    arr:"M5 12h14M12 5l7 7-7 7",dollar:"M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    brain:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14",
    trash:"M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2",
    id:"M2 5h20v14H2zM8 12m-2 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0M14 9h4M14 12h4M14 15h2",
    bank:"M3 10h18M3 14h18M5 6l7-3 7 3M5 18v-4M19 18v-4M9 18v-4M15 18v-4M3 18h18",
    warn:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
    eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
    lock:"M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
    out:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    wal:"M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z",
    search:"M21 21l-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0",
    shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    map:"M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z",
    filter:"M22 3H2l8 9.46V19l4 2V12.46z",
  };
  const sp={
    wa:<svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.552 4.1 1.512 5.828L.057 23.405a.5.5 0 0 0 .609.61l5.699-1.494A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.956 9.956 0 0 1-5.058-1.374l-.362-.214-3.742.981.998-3.648-.235-.374A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>,
    star:<svg width={s} height={s} fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    clock:<svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  };
  if(sp[n])return sp[n];
  return <svg width={s} height={s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d={paths[n]||""}/></svg>;
};

// ─── SMALL SHARED COMPONENTS ──────────────────────────────────────────────────
const Av=({id,text,size=32,fs=11})=><div className="av" style={{width:size,height:size,fontSize:fs,background:avc(id)[0]}}>{text}</div>;
const Bdg=({status})=>{const m=SM[status];return <span className="badge" style={{color:m.color,background:m.bg}}><span className="bd" style={{background:m.color}}/>{m.label}</span>;};
const DR=({k,v})=><div className="dr"><div className="dk">{k}</div><div className="dv2">{v}</div></div>;

function FileUp({label,value,onChange,accept="image/*,.pdf"}){
  const h=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onChange({name:f.name,data:ev.target.result,type:f.type});r.readAsDataURL(f);};
  return <div className="fp"><label>{label}</label><label className={`uz${value?" hf":""}`}><input type="file" accept={accept} onChange={h}/>{value?<><Ic n="check" s={13}/> {value.name}</>:<><Ic n="upload" s={13}/> Seleccionar</>}</label></div>;
}

function PwIn({value,onChange,placeholder="Contraseña"}){
  const[show,setShow]=useState(false);
  return <div className="pw"><input type={show?"text":"password"} value={value} onChange={onChange} placeholder={placeholder}/><button type="button" className="pe" onClick={()=>setShow(s=>!s)}><Ic n="eye" s={15}/></button></div>;
}

function Toggle({checked,onChange}){
  return <label className="tg"><input type="checkbox" checked={checked} onChange={onChange}/><span className="tgs"/></label>;
}

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═════════════════════════════════════════════════════════════════════════════
function Login({users,onLogin}){
  const[mode,setMode]=useState("login");
  const[f,setF]=useState({id:"",pw:"",phone:"",email:"",confirm:""});
  const[err,setErr]=useState("");
  const sf=k=>({value:f[k],onChange:e=>setF(p=>({...p,[k]:e.target.value}))});

  const doLogin=()=>{
    setErr("");
    const u=users.find(u=>(u.username===f.id||u.email===f.id||u.phone===f.id)&&u.password===f.pw);
    if(!u){setErr("Usuario o contraseña incorrectos.");return;}
    onLogin(u);
  };

  const doReg=()=>{
    setErr("");
    if(!f.id||!f.pw||!f.phone||!f.email){setErr("Completá todos los campos.");return;}
    if(f.pw!==f.confirm){setErr("Las contraseñas no coinciden.");return;}
    if(f.pw.length<6){setErr("Contraseña mínimo 6 caracteres.");return;}
    const m=users.find(u=>u.role==="driver"&&u.phone===f.phone&&u.email===f.email);
    if(!m){setErr("No encontramos un chofer con esos datos. Verificá con administración.");return;}
    if(users.find(u=>u.username===f.id&&u.id!==m.id)){setErr("Ese nombre de usuario ya está en uso.");return;}
    onLogin({...m,username:f.id,password:f.pw});
  };

  return(
    <div className="lw2">
      <div className="lc">
        <div className="ll">TRASLADOS<span style={{color:"var(--tx)"}}>PRO</span></div>
        <div className="ls">Portal de acceso — Choferes y Administración</div>
        <div className="tabs">
          <button className={`tab${mode==="login"?" on":""}`} onClick={()=>{setMode("login");setErr("");}}>Iniciar sesión</button>
          <button className={`tab${mode==="register"?" on":""}`} onClick={()=>{setMode("register");setErr("");}}>Registrarse</button>
        </div>
        {mode==="login"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="fp"><label>Usuario, email o teléfono</label><input {...sf("id")} autoComplete="username"/></div>
            <div className="fp"><label>Contraseña</label><PwIn value={f.pw} onChange={e=>setF(p=>({...p,pw:e.target.value}))}/></div>
            {err&&<div style={{color:"var(--re)",fontSize:13}}>{err}</div>}
            <button className="btn bp" onClick={doLogin} style={{width:"100%",justifyContent:"center"}}><Ic n="lock" s={14}/> Entrar</button>
            <div style={{fontSize:12,color:"var(--mu)",textAlign:"center",lineHeight:1.6}}>Demo admin: <strong>admin</strong> / admin123<br/>Demo chofer: <strong>carlos.mendez</strong> / chofer123</div>
          </div>
        )}
        {mode==="register"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:"rgba(0,212,255,0.07)",border:"1px solid rgba(0,212,255,0.2)",borderRadius:8,padding:"10px 14px",fontSize:12.5,color:"var(--mu2)",lineHeight:1.6}}>
              Solo choferes registrados en el sistema pueden crear cuenta. Tu <strong>teléfono</strong> y <strong>email</strong> deben coincidir con los datos cargados por el administrador.
            </div>
            <div className="fp"><label>Teléfono (verificación) *</label><input {...sf("phone")} placeholder="5491155443322"/></div>
            <div className="fp"><label>Email (verificación) *</label><input type="email" {...sf("email")}/></div>
            <div className="fp"><label>Nombre de usuario deseado *</label><input {...sf("id")} placeholder="juan.perez"/></div>
            <div className="fp"><label>Contraseña *</label><PwIn value={f.pw} onChange={e=>setF(p=>({...p,pw:e.target.value}))}/></div>
            <div className="fp"><label>Confirmar contraseña *</label><PwIn value={f.confirm} onChange={e=>setF(p=>({...p,confirm:e.target.value}))} placeholder="Repetir contraseña"/></div>
            {err&&<div style={{color:"var(--re)",fontSize:13}}>{err}</div>}
            <button className="btn bp" onClick={doReg} style={{width:"100%",justifyContent:"center"}}><Ic n="shield" s={14}/> Crear cuenta</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DRIVER PORTAL
// ═════════════════════════════════════════════════════════════════════════════
function DriverPortal({session,drivers,reservations,payments,onLogout}){
  const[tab,setTab]=useState("trips");
  const driver=drivers.find(d=>d.id===session.driverId);
  if(!driver)return <div style={{padding:40,color:"var(--mu)"}}>Chofer no encontrado.</div>;
  const mine=reservations.filter(r=>r.driverId===driver.id);
  const upcoming=mine.filter(r=>r.status!=="completed"&&r.status!=="rejected"&&new Date(`${r.date}T${r.time}`)>new Date()).sort((a,b)=>`${a.date}${a.time}`>`${b.date}${b.time}`?1:-1);
  const done=mine.filter(r=>r.status==="completed").sort((a,b)=>`${a.date}${a.time}`<`${b.date}${b.time}`?1:-1);
  const myP=payments.filter(p=>p.driverId===driver.id);
  const[c]=avc(driver.id);
  return(
    <div className="por">
      <div className="ph">
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Av id={driver.id} text={driver.avatar} size={36} fs={13}/>
          <div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:14}}>{driver.name}</div>
            <div style={{fontSize:11.5,color:"var(--mu2)"}}>{driver.vehicleBrand} {driver.vehicleModel} · {driver.plate}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{fontFamily:"var(--fh)",fontWeight:800,color:"var(--ac)",fontSize:15}}>
            USD {(driver.walletBalance||0).toFixed(2)} <span style={{fontSize:11,color:"var(--mu)",fontWeight:400}}>saldo</span>
          </div>
          <button className="btn bg2 sm" onClick={onLogout}><Ic n="out" s={13}/> Salir</button>
        </div>
      </div>
      <div className="pc">
        <div className="wcard">
          <div style={{fontSize:12,color:"var(--mu2)",textTransform:"uppercase",letterSpacing:".6px",marginBottom:6}}>Saldo disponible</div>
          <div className="wbal">USD {(driver.walletBalance||0).toFixed(2)}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginTop:16}}>
            {[["Próximos viajes",upcoming.length],["Completados",done.length],["Cobrado",`USD ${myP.reduce((s,p)=>s+p.amount,0)}`]].map(([k,v])=>(
              <div key={k}><div style={{fontSize:11,color:"var(--mu2)",marginBottom:3}}>{k}</div><div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:16}}>{v}</div></div>
            ))}
          </div>
        </div>
        <div className="tabs">
          {[["trips",`Viajes (${upcoming.length})`],["done",`Historial (${done.length})`],["wallet","Billetera"],["profile","Mi perfil"]].map(([id,l])=>(
            <button key={id} className={`tab${tab===id?" on":""}`} onClick={()=>setTab(id)}>{l}</button>
          ))}
        </div>
        {tab==="trips"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>{upcoming.length===0&&<div className="empty"><div style={{fontSize:32,marginBottom:10}}>🚗</div>Sin viajes próximos asignados</div>}{upcoming.map(r=><TripCard key={r.id} res={r} driver={driver}/>)}</div>}
        {tab==="done"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>{done.length===0&&<div className="empty"><div style={{fontSize:32,marginBottom:10}}>📋</div>Sin viajes completados aún</div>}{done.map(r=><TripCard key={r.id} res={r} driver={driver} done/>)}</div>}
        {tab==="wallet"&&<PortalWallet driver={driver} payments={myP} trips={mine}/>}
        {tab==="profile"&&<PortalProfile driver={driver}/>}
      </div>
    </div>
  );
}

function TripCard({res,driver,done}){
  const[open,setOpen]=useState(false);
  const urg=!done&&hrs(res.date,res.time)<24&&hrs(res.date,res.time)>0;
  return(
    <div style={{background:"var(--s1)",border:`1px solid ${urg?"rgba(239,68,68,0.4)":"var(--b1)"}`,borderRadius:"var(--rl)",overflow:"hidden"}}>
      <div style={{padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>setOpen(o=>!o)}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
            <span className="chip">{res.code}</span>
            <Bdg status={res.status}/>
            {urg&&<span style={{fontSize:11,color:"var(--re)",fontWeight:700}}>⚡ &lt;24H</span>}
          </div>
          <div style={{fontWeight:600,fontSize:14}}>{res.passengerName} · {res.pax} pax</div>
          <div style={{fontSize:12,color:"var(--mu2)",marginTop:3}}>{res.date} · {res.time}hs</div>
        </div>
        <div style={{fontFamily:"var(--fh)",fontWeight:800,color:"var(--gr)",fontSize:16}}>{res.currency} {res.price}</div>
        <span style={{color:"var(--mu)",fontSize:12}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{padding:"0 16px 16px",borderTop:"1px solid var(--b1)"}}>
          <div style={{marginTop:12}}>
            <DR k="Código proveedor" v={<span className="chip">{res.providerCode}</span>}/>
            <DR k="Pasajero" v={res.passengerName}/>
            <DR k="Teléfono" v={<a href={`tel:${res.passengerPhone}`} style={{color:"var(--ac)"}}>{res.passengerPhone}</a>}/>
            {res.isArrival&&res.flightNumber&&<DR k="Vuelo (arribo)" v={`✈️ ${res.flightNumber}`}/>}
            <DR k="Origen" v={<div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}><span>{res.origin}</span><div style={{display:"flex",gap:6}}><a href={maps(res.origin)} target="_blank" rel="noreferrer" className="btn bbl sm" style={{fontSize:11,padding:"3px 8px"}}>Maps</a><a href={waze(res.origin)} target="_blank" rel="noreferrer" className="btn bg2 sm" style={{fontSize:11,padding:"3px 8px"}}>Waze</a></div></div>}/>
            <DR k="Destino" v={<div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}><span>{res.destination}</span><div style={{display:"flex",gap:6}}><a href={maps(res.destination)} target="_blank" rel="noreferrer" className="btn bbl sm" style={{fontSize:11,padding:"3px 8px"}}>Maps</a><a href={waze(res.destination)} target="_blank" rel="noreferrer" className="btn bg2 sm" style={{fontSize:11,padding:"3px 8px"}}>Waze</a></div></div>}/>
            {res.driverLink&&<DR k="Driver Link" v={<a href={res.driverLink} target="_blank" rel="noreferrer" style={{color:"var(--ac)"}}>Abrir enlace</a>}/>}
            {res.notes&&<DR k="Notas" v={res.notes}/>}
          </div>
          <div style={{marginTop:14}}>
            <a href={waLink(res.passengerPhone,`Hola ${res.passengerName}, soy ${driver.name} su chofer para el traslado del ${res.date} a las ${res.time}hs. Código: ${res.code}`)} target="_blank" rel="noreferrer" className="btn bgr sm"><Ic n="wa" s={13}/> Contactar pasajero</a>
          </div>
        </div>
      )}
    </div>
  );
}

function PortalWallet({driver,payments,trips}){
  const earned=trips.filter(r=>r.status==="confirmed"||r.status==="assigned").reduce((s,r)=>s+r.price,0);
  const all=[
    ...trips.map(r=>({type:"trip",date:r.date,label:`Viaje — ${r.passengerName}`,code:r.code,amount:r.price,currency:r.currency})),
    ...payments.map(p=>({type:"pay",date:p.date,label:p.note||"Pago del administrador",code:"",amount:p.amount,currency:"USD"})),
  ].sort((a,b)=>a.date<b.date?1:-1);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {[["Saldo actual",`USD ${(driver.walletBalance||0).toFixed(2)}`,"var(--ac)"],["Por cobrar",`USD ${earned}`,"var(--am)"],["Completados",trips.filter(r=>r.status==="completed").length,"var(--gr)"],["Pagos recibidos",`USD ${payments.reduce((s,p)=>s+p.amount,0)}`,"var(--bl)"]].map(([k,v,c])=>(
          <div key={k} style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"14px 16px"}}>
            <div style={{fontSize:11,color:"var(--mu2)",marginBottom:4}}>{k}</div>
            <div style={{fontFamily:"var(--fh)",fontWeight:800,fontSize:20,color:c}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:12,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".6px",marginBottom:10}}>Movimientos</div>
      <div style={{background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",overflow:"hidden"}}>
        {all.length===0&&<div style={{padding:24,color:"var(--mu)",textAlign:"center",fontSize:13}}>Sin movimientos</div>}
        {all.map((m,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid var(--b1)"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:m.type==="pay"?"rgba(16,185,129,.15)":"rgba(0,212,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",color:m.type==="pay"?"var(--gr)":"var(--ac)",flexShrink:0}}>
              {m.type==="pay"?<Ic n="wal" s={15}/>:<Ic n="car" s={15}/>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13.5,fontWeight:500}}>{m.label}</div>
              <div style={{fontSize:11.5,color:"var(--mu2)"}}>{m.date}{m.code&&` · ${m.code}`}</div>
            </div>
            <div style={{fontFamily:"var(--fh)",fontWeight:700,color:m.type==="pay"?"var(--gr)":"var(--am)",fontSize:14}}>{m.type==="pay"?"+":""}{m.currency} {m.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortalProfile({driver}){
  const ls=licSt(driver);
  return(
    <div>
      <div style={{display:"flex",gap:16,alignItems:"center",background:"var(--s2)",borderRadius:"var(--rl)",padding:20,marginBottom:20}}>
        <Av id={driver.id} text={driver.avatar} size={56} fs={18}/>
        <div>
          <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:18}}>{driver.name}</div>
          <div style={{color:"var(--mu2)",fontSize:13}}>{driver.vehicleBrand} {driver.vehicleModel} {driver.vehicleYear} · {driver.plate}</div>
          <div style={{color:"var(--am)",fontSize:13,marginTop:4}}>⭐ {driver.rating}</div>
        </div>
      </div>
      {[["Email",driver.email||"—"],["Teléfono",driver.phone],["Vehículo",`${driver.vehicleType}${driver.gnc?" · GNC ⛽":""}`],["Licencia",<span style={{color:ls.c,fontWeight:700}}>{ls.l}</span>],["Banco",driver.bank||"—"],["CBU/CVU",driver.cbu||"—"],["Alias",driver.alias||"—"]].map(([k,v])=><DR key={k} k={k} v={v}/>)}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN APP
// ═════════════════════════════════════════════════════════════════════════════
function Admin({session,drivers,reservations,payments,users,pRes,pDrv,pPmt,pUsr,onLogout,toast}){
  const[page,setPage]=useState("reservations");
  const[mNewR,setMNewR]=useState(false);
  const[mNewD,setMNewD]=useState(false);
  const[mDetail,setMDetail]=useState(null);
  const[mAssign,setMAssign]=useState(null);
  const[mWA,setMWA]=useState(null);
  const[mWallet,setMWallet]=useState(null);
  const[mDrvD,setMDrvD]=useState(null);
  const[fd,setFd]=useState(""); const[fd2,setFd2]=useState(""); const[fst,setFst]=useState(""); const[fc,setFc]=useState(""); const[fco,setFco]=useState("");

  const gd=id=>drivers.find(d=>d.id===id);
  const urgent=reservations.filter(isUrg);

  const filtered=reservations.filter(r=>{
    if(fd&&r.date<fd)return false;
    if(fd2&&r.date>fd2)return false;
    if(fst&&r.status!==fst)return false;
    if(fc&&!r.company?.toLowerCase().includes(fc.toLowerCase()))return false;
    if(fco&&!r.code?.toLowerCase().includes(fco.toLowerCase())&&!r.providerCode?.toLowerCase().includes(fco.toLowerCase()))return false;
    return true;
  });

  const doAssign=async(resId,drvId)=>{
    const drv=gd(drvId);
    const list=reservations.map(r=>r.id===resId?{...r,driverId:drvId,status:"assigned"}:r);
    await pRes(list);
    setMAssign(null);
    setMWA({res:list.find(r=>r.id===resId),driver:drv,mode:"alert"});
    toast(`Chofer ${drv.name} asignado`);
  };

  const doConfirm=async resId=>{
    const list=reservations.map(r=>r.id===resId?{...r,status:"confirmed"}:r);
    await pRes(list);
    const res=list.find(r=>r.id===resId);
    setMDetail(null);
    setMWA({res,driver:gd(res.driverId),mode:"confirm_driver"});
    toast("Reserva confirmada ✅");
  };

  const doComplete=async resId=>{
    await pRes(reservations.map(r=>r.id===resId?{...r,status:"completed"}:r));
    setMDetail(null); toast("Viaje completado ✅");
  };

  const doDel=async resId=>{await pRes(reservations.filter(r=>r.id!==resId));toast("Eliminado","🗑️");};

  const doPayment=async(drvId,amount,note)=>{
    const pmt={id:"p"+Date.now(),driverId:drvId,amount:parseFloat(amount),note,date:TODAY};
    await pPmt([...payments,pmt]);
    await pDrv(drivers.map(d=>d.id===drvId?{...d,walletBalance:(d.walletBalance||0)+parseFloat(amount)}:d));
    toast("Pago acreditado ✅");
  };

  const titles={reservations:"Reservas de Traslados",drivers:"Base de Choferes",parse:"Importar Email (IA)",users:"Usuarios del sistema"};

  return(
    <div className="app">
      <aside className="sb">
        <div className="logo">TRASLADOS<br/><span>PRO</span></div>
        {[{id:"reservations",n:"cal",l:"Reservas",badge:urgent.length},{id:"drivers",n:"car",l:"Choferes"},{id:"parse",n:"brain",l:"Importar Email"},{id:"users",n:"shield",l:"Usuarios"}].map(item=>(
          <button key={item.id} className={`ni${page===item.id?" on":""}`} onClick={()=>setPage(item.id)}>
            <Ic n={item.n} s={15}/>{item.l}
            {item.badge>0&&<div className="nd"/>}
          </button>
        ))}
        <div className="dv"/>
        <button className="ni" onClick={onLogout}><Ic n="out" s={15}/> Salir</button>
      </aside>

      <div className="mn">
        <div className="tb">
          <div className="tt">{titles[page]}</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:12,color:"var(--mu2)"}}>admin</span>
            {page==="reservations"&&<button className="btn bp" onClick={()=>setMNewR(true)}><Ic n="plus" s={14}/> Nueva reserva</button>}
            {page==="drivers"&&<button className="btn bp" onClick={()=>setMNewD(true)}><Ic n="plus" s={14}/> Nuevo chofer</button>}
          </div>
        </div>

        <div className="cnt">
          {page==="reservations"&&(
            <>
              <div className="sts">
                {[["Hoy",reservations.filter(r=>r.date===TODAY).length,"var(--ac)","traslados"],["Pendientes",reservations.filter(r=>r.status==="pending").length,"var(--am)","sin chofer"],["Confirmados",reservations.filter(r=>r.status==="confirmed"||r.status==="completed").length,"var(--gr)","este mes"],["Ingresos",`USD ${reservations.filter(r=>r.status!=="rejected").reduce((s,r)=>s+r.price,0)}`,"var(--tx)","acumulado"]].map(([l,v,c,sub])=>(
                  <div key={l} className="sc"><div className="sl">{l}</div><div className="sv" style={{color:c}}>{v}</div><div className="sb2">{sub}</div></div>
                ))}
              </div>

              {urgent.length>0&&(
                <div className="ab" onClick={()=>setFst("pending")}>
                  <Ic n="warn" s={16}/>
                  <strong>¡Atención!</strong> {urgent.length} reserva{urgent.length>1?"s":""} con menos de 24 horas SIN chofer asignado.
                  <span className="abd">{urgent.length} URGENTE{urgent.length>1?"S":""}</span>
                </div>
              )}

              <div className="flt">
                <Ic n="filter" s={14}/>
                <input className="fi" type="date" value={fd} onChange={e=>setFd(e.target.value)} title="Desde"/>
                <input className="fi" type="date" value={fd2} onChange={e=>setFd2(e.target.value)} title="Hasta"/>
                <select className="fs" value={fst} onChange={e=>setFst(e.target.value)}>
                  <option value="">Todos los estados</option>
                  {Object.entries(SM).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
                <input className="fi" placeholder="Empresa…" value={fc} onChange={e=>setFc(e.target.value)} style={{width:120}}/>
                <input className="fi" placeholder="Código TR- o proveedor…" value={fco} onChange={e=>setFco(e.target.value)} style={{width:190}}/>
                {(fd||fd2||fst||fc||fco)&&<button className="btn bg2 sm" onClick={()=>{setFd("");setFd2("");setFst("");setFc("");setFco("")}}><Ic n="x" s={12}/> Limpiar</button>}
                <span style={{marginLeft:"auto",fontSize:12,color:"var(--mu)"}}>{filtered.length} resultado(s)</span>
              </div>

              <div className="tw">
                <table>
                  <thead><tr><th>Código</th><th>Empresa</th><th>Pasajero</th><th>Fecha/Hora</th><th>Ruta</th><th>Vehículo</th><th>Tarifa</th><th>Chofer asignado</th><th>Estado</th><th></th></tr></thead>
                  <tbody>
                    {filtered.length===0&&<tr><td colSpan={10}><div className="empty">📭 Sin resultados</div></td></tr>}
                    {filtered.sort((a,b)=>`${a.date}${a.time}`>`${b.date}${b.time}`?1:-1).map(res=>{
                      const drv=gd(res.driverId);
                      const urg=isUrg(res);
                      const m=SM[res.status];
                      return(
                        <tr key={res.id} className={urg?"ug":""}>
                          <td>
                            <span className="chip">{res.code}</span>
                            <div style={{fontSize:11,color:"var(--mu2)",marginTop:2}}>{res.providerCode}</div>
                            {urg&&<div style={{fontSize:10,color:"var(--re)",fontWeight:700,marginTop:2}}>⚡ &lt;24h SIN CHOFER</div>}
                          </td>
                          <td><div style={{fontWeight:600,fontSize:13}}>{res.company}</div></td>
                          <td>
                            <div style={{fontWeight:500}}>{res.passengerName}</div>
                            <div style={{fontSize:11.5,color:"var(--mu)"}}>{res.pax} pax · {res.luggage||0} bultos</div>
                          </td>
                          <td>
                            <div style={{fontWeight:600}}>{res.date}</div>
                            <div style={{fontSize:12,color:"var(--ac)"}}>{res.time}hs</div>
                          </td>
                          <td style={{maxWidth:180}}>
                            <div style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📍 {res.origin}</div>
                            <div style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--mu2)"}}>🏁 {res.destination}</div>
                          </td>
                          <td style={{fontSize:13}}>{res.vehicleType}</td>
                          <td><span style={{fontWeight:700,color:"var(--gr)"}}>{res.currency} {res.price}</span></td>
                          <td>
                            {drv?(
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <Av id={drv.id} text={drv.avatar} size={28} fs={10}/>
                                <div>
                                  <div style={{fontSize:12.5,fontWeight:600}}>{drv.name.split(" ")[0]}</div>
                                  <div style={{fontSize:11,color:"var(--mu2)"}}>{drv.plate}</div>
                                </div>
                              </div>
                            ):(
                              <button className="btn bam sm" onClick={()=>setMAssign(res)}>Asignar</button>
                            )}
                          </td>
                          <td><span className="badge" style={{color:m.color,background:m.bg}}><span className="bd" style={{background:m.color}}/>{m.label}</span></td>
                          <td>
                            <div style={{display:"flex",gap:4}}>
                              <button className="btn bg2 sm" onClick={()=>setMDetail(res)}><Ic n="edit" s={13}/></button>
                              {res.driverId&&<button className="btn bgr sm" onClick={()=>setMWA({res,driver:gd(res.driverId),mode:"alert"})}><Ic n="wa" s={13}/></button>}
                              <button className="btn bg2 sm" style={{color:"var(--re)"}} onClick={()=>doDel(res.id)}><Ic n="trash" s={13}/></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {page==="drivers"&&<DriversPage drivers={drivers} reservations={reservations} payments={payments} pDrv={pDrv} mNewD={mNewD} setMNewD={setMNewD} toast={toast} onWallet={d=>setMWallet(d)} onDetail={d=>setMDrvD(d)}/>}
          {page==="parse"&&<ParsePage reservations={reservations} pRes={pRes} toast={toast}/>}
          {page==="users"&&<UsersPage users={users} drivers={drivers} pUsr={pUsr} toast={toast}/>}
        </div>
      </div>

      {mDetail&&<DetailModal res={mDetail} driver={gd(mDetail.driverId)} onClose={()=>setMDetail(null)} onConfirm={doConfirm} onComplete={doComplete} onAssign={()=>{setMDetail(null);setMAssign(mDetail);}} onWA={mode=>setMWA({res:mDetail,driver:gd(mDetail.driverId),mode})} onSave={async u=>{const l=reservations.map(r=>r.id===u.id?u:r);await pRes(l);setMDetail(u);toast("Guardado");}}/>}
      {mAssign&&<AssignModal res={mAssign} drivers={drivers} onClose={()=>setMAssign(null)} onAssign={doAssign}/>}
      {mWA&&<WAModal {...mWA} onClose={()=>setMWA(null)}/>}
      {mNewR&&<NewResModal onClose={()=>setMNewR(false)} reservations={reservations} onSave={async r=>{await pRes([...reservations,r]);setMNewR(false);toast("Reserva creada ✅");}}/>}
      {mNewD&&<NewDrvModal onClose={()=>setMNewD(false)} onSave={async d=>{await pDrv([...drivers,d]);setMNewD(false);toast("Chofer agregado ✅");}}/>}
      {mWallet&&<WalletModal driver={mWallet} payments={payments.filter(p=>p.driverId===mWallet.id)} onClose={()=>setMWallet(null)} onAdd={doPayment}/>}
      {mDrvD&&<DrvDetailModal driver={mDrvD} onClose={()=>setMDrvD(null)} onSave={async d=>{const l=drivers.map(x=>x.id===d.id?d:x);await pDrv(l);setMDrvD(d);toast("Actualizado ✅");}} onDel={async id=>{await pDrv(drivers.filter(d=>d.id!==id));setMDrvD(null);toast("Eliminado","🗑️");}}/>}
    </div>
  );
}

// ─── DRIVERS PAGE ─────────────────────────────────────────────────────────────
function DriversPage({drivers,reservations,payments,pDrv,mNewD,setMNewD,toast,onWallet,onDetail}){
  const st=id=>({total:reservations.filter(r=>r.driverId===id).length,done:reservations.filter(r=>r.driverId===id&&(r.status==="confirmed"||r.status==="completed")).length,rev:reservations.filter(r=>r.driverId===id&&r.status!=="rejected").reduce((s,r)=>s+r.price,0)});
  const tog=async id=>{await pDrv(drivers.map(d=>d.id===id?{...d,active:!d.active}:d));toast("Estado actualizado");};
  return(
    <>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16}}>
        {drivers.map(d=>{
          const s=st(d.id); const ls=licSt(d); const exp=licExp(d);
          return(
            <div key={d.id} style={{background:"var(--s1)",border:`1px solid ${exp?"rgba(239,68,68,.4)":"var(--b1)"}`,borderRadius:"var(--rl)",padding:20}}>
              {exp&&<div style={{display:"flex",gap:6,background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:7,padding:"6px 10px",marginBottom:14,fontSize:12,color:"var(--re)",alignItems:"center"}}><Ic n="warn" s={13}/> Licencia vencida — no asignable</div>}
              <div style={{display:"flex",gap:14,marginBottom:14}}>
                <Av id={d.id} text={d.avatar} size={48} fs={15}/>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:15}}>{d.name}</div>
                  <div style={{fontSize:12,color:"var(--mu2)"}}>{d.vehicleBrand} {d.vehicleModel} · {d.plate}</div>
                  <div style={{fontSize:12,color:"var(--mu2)"}}>{d.vehicleType}{d.gnc?" · GNC ⛽":""}</div>
                  <div className="rat" style={{marginTop:4}}><Ic n="star" s={12}/> {d.rating}</div>
                </div>
                <span className="badge" style={d.active?{color:"var(--gr)",background:"rgba(16,185,129,0.12)"}:{color:"var(--mu)",background:"rgba(107,114,128,0.12)"}}>
                  <span className="bd" style={{background:d.active?"var(--gr)":"var(--mu)"}}/>{d.active?"Activo":"Inactivo"}
                </span>
              </div>
              <div style={{display:"flex",gap:6,fontSize:12,marginBottom:12,alignItems:"center"}}>
                <Ic n="id" s={13}/><span style={{color:"var(--mu2)"}}>Licencia:</span>
                <span style={{color:ls.c,fontWeight:600}}>{ls.l}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                {[["Traslados",s.total],["Completos",s.done],["USD",s.rev]].map(([k,v])=>(
                  <div key={k} style={{background:"var(--s2)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                    <div style={{fontSize:16,fontWeight:800,fontFamily:"var(--fh)"}}>{v}</div>
                    <div style={{fontSize:10.5,color:"var(--mu)"}}>{k}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8}}>
                <div style={{fontFamily:"var(--fh)",fontWeight:700,color:"var(--ac)",fontSize:14}}>USD {(d.walletBalance||0).toFixed(2)}</div>
                <span style={{fontSize:11,color:"var(--mu)"}}>saldo</span>
                <button className="btn bbl sm" style={{marginLeft:"auto"}} onClick={()=>onWallet(d)}><Ic n="wal" s={12}/> Billetera</button>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <button className="btn bg2 sm" onClick={()=>onDetail(d)}><Ic n="eye" s={13}/> Ficha</button>
                <a href={waLink(d.phone,`Hola ${d.name}!`)} target="_blank" rel="noreferrer" className="btn bgr sm"><Ic n="wa" s={13}/> WA</a>
                <button className="btn bg2 sm" style={{color:d.active?"var(--am)":"var(--gr)"}} onClick={()=>tog(d.id)}>{d.active?"Desactivar":"Activar"}</button>
              </div>
            </div>
          );
        })}
      </div>
      {mNewD&&<NewDrvModal onClose={()=>setMNewD(false)} onSave={async d=>{await pDrv([...drivers,d]);setMNewD(false);toast("Chofer agregado ✅");}}/>}
    </>
  );
}

// ─── USERS PAGE ───────────────────────────────────────────────────────────────
function UsersPage({users,drivers,pUsr,toast}){
  const[mNew,setMNew]=useState(false);
  return(
    <div>
      <div style={{marginBottom:16,display:"flex",justifyContent:"flex-end"}}>
        <button className="btn bp" onClick={()=>setMNew(true)}><Ic n="plus" s={14}/> Crear usuario</button>
      </div>
      <div className="tw">
        <table>
          <thead><tr><th>Usuario</th><th>Rol</th><th>Chofer vinculado</th><th>Email</th><th>Teléfono</th><th></th></tr></thead>
          <tbody>
            {users.map(u=>{
              const drv=drivers.find(d=>d.id===u.driverId);
              return(
                <tr key={u.id}>
                  <td style={{fontWeight:600}}>{u.username}</td>
                  <td><span className="badge" style={u.role==="admin"?{color:"var(--ac)",background:"rgba(0,212,255,0.1)"}:{color:"var(--gr)",background:"rgba(16,185,129,0.1)"}}>{u.role==="admin"?"Administrador":"Chofer"}</span></td>
                  <td>{drv?<div style={{display:"flex",alignItems:"center",gap:8}}><Av id={drv.id} text={drv.avatar} size={26} fs={10}/>{drv.name}</div>:"—"}</td>
                  <td style={{color:"var(--mu2)"}}>{u.email}</td>
                  <td style={{color:"var(--mu2)"}}>{u.phone}</td>
                  <td><button className="btn bg2 sm" style={{color:"var(--re)"}} onClick={async()=>{await pUsr(users.filter(x=>x.id!==u.id));toast("Eliminado","🗑️");}}><Ic n="trash" s={13}/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {mNew&&<NewUserModal drivers={drivers} users={users} onClose={()=>setMNew(false)} onSave={async u=>{await pUsr([...users,u]);setMNew(false);toast("Usuario creado ✅");}}/>}
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function NewUserModal({drivers,users,onClose,onSave}){
  const[f,setF]=useState({username:"",password:"",email:"",phone:"",role:"driver",driverId:""});
  const sf=k=>({value:f[k],onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mc">
        <div className="mh"><div className="mt">Crear usuario</div><button className="btn bg2 sm" onClick={onClose}><Ic n="x" s={14}/></button></div>
        <div className="mb">
          <div className="fg">
            <div className="fp full"><label>Nombre de usuario *</label><input {...sf("username")}/></div>
            <div className="fp"><label>Email</label><input type="email" {...sf("email")}/></div>
            <div className="fp"><label>Teléfono</label><input {...sf("phone")}/></div>
            <div className="fp"><label>Contraseña *</label><PwIn value={f.password} onChange={e=>setF(p=>({...p,password:e.target.value}))}/></div>
            <div className="fp"><label>Rol</label><select value={f.role} onChange={e=>setF(p=>({...p,role:e.target.value,driverId:""}))}><option value="driver">Chofer</option><option value="admin">Administrador</option></select></div>
            {f.role==="driver"&&<div className="fp full"><label>Chofer vinculado</label><select value={f.driverId} onChange={e=>setF(p=>({...p,driverId:e.target.value}))}><option value="">Seleccionar</option>{drivers.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>}
          </div>
        </div>
        <div className="mf"><button className="btn bg2" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>onSave({...f,id:"u"+Date.now()})}><Ic n="check" s={14}/> Crear</button></div>
      </div>
    </div>
  );
}

function WalletModal({driver,payments,onClose,onAdd}){
  const[amt,setAmt]=useState(""); const[note,setNote]=useState(""); const[loading,setLoading]=useState(false);
  const go=async()=>{if(!amt||isNaN(amt)||parseFloat(amt)<=0)return;setLoading(true);await onAdd(driver.id,amt,note);setAmt("");setNote("");setLoading(false);};
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mc">
        <div className="mh">
          <div><div className="mt">Billetera — {driver.name}</div><div style={{fontSize:12,color:"var(--mu2)",marginTop:2}}>Saldo: <strong style={{color:"var(--ac)"}}>USD {(driver.walletBalance||0).toFixed(2)}</strong></div></div>
          <button className="btn bg2 sm" onClick={onClose}><Ic n="x" s={14}/></button>
        </div>
        <div className="mb">
          <div style={{display:"flex",gap:10,marginBottom:20,alignItems:"flex-end"}}>
            <div className="fp" style={{flex:1}}><label>Monto (USD)</label><input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0.00"/></div>
            <div className="fp" style={{flex:2}}><label>Concepto</label><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Pago quincenal..."/></div>
            <button className="btn bgr" onClick={go} disabled={loading||!amt}>{loading?<div className="spin" style={{width:14,height:14,borderWidth:2}}/>:<Ic n="plus" s={14}/>} Acreditar</button>
          </div>
          <div style={{fontSize:12,color:"var(--mu)",textTransform:"uppercase",letterSpacing:".6px",marginBottom:8}}>Historial</div>
          <div style={{background:"var(--s2)",borderRadius:"var(--r)",overflow:"hidden"}}>
            {payments.length===0&&<div style={{padding:16,color:"var(--mu)",fontSize:13,textAlign:"center"}}>Sin pagos registrados</div>}
            {payments.map(p=>(
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:"1px solid var(--b1)"}}>
                <div><div style={{fontSize:13,fontWeight:500}}>{p.note||"Pago"}</div><div style={{fontSize:11.5,color:"var(--mu2)"}}>{p.date}</div></div>
                <div style={{fontFamily:"var(--fh)",fontWeight:700,color:"var(--gr)"}}>+USD {p.amount}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mf"><button className="btn bg2" onClick={onClose}>Cerrar</button></div>
      </div>
    </div>
  );
}

function DetailModal({res,driver,onClose,onConfirm,onComplete,onAssign,onWA,onSave}){
  const[tab,setTab]=useState("info"); const[edit,setEdit]=useState(false); const[f,setF]=useState({...res});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const m=SM[res.status];
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mc mlg">
        <div className="mh">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span className="chip">{res.code}</span><span style={{fontSize:12,color:"var(--mu2)"}}>{res.providerCode}</span></div>
            <div className="mt">{res.passengerName}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span className="badge" style={{color:m.color,background:m.bg}}><span className="bd" style={{background:m.color}}/>{m.label}</span>
            <button className="btn bg2 sm" onClick={onClose}><Ic n="x" s={14}/></button>
          </div>
        </div>
        <div className="mb">
          <div className="tabs">
            {["info","driver","messages"].map(t=><button key={t} className={`tab${tab===t?" on":""}`} onClick={()=>{setTab(t);setEdit(false);}}>{t==="info"?"Información":t==="driver"?"Chofer":"Mensajes WA"}</button>)}
          </div>
          {tab==="info"&&(edit?(
            <div className="fg">
              <div className="fp"><label>Empresa</label><input {...sf("company")}/></div>
              <div className="fp"><label>Cód. proveedor</label><input {...sf("providerCode")}/></div>
              <div className="fp"><label>Pasajero</label><input {...sf("passengerName")}/></div>
              <div className="fp"><label>Teléfono</label><input {...sf("passengerPhone")}/></div>
              <div className="fp"><label>Email</label><input {...sf("passengerEmail")}/></div>
              <div className="fp"><label>Fecha</label><input type="date" {...sf("date")}/></div>
              <div className="fp"><label>Hora</label><input type="time" {...sf("time")}/></div>
              <div className="fp"><label>Pax</label><input type="number" {...sf("pax")}/></div>
              <div className="fp"><label>Equipaje</label><input type="number" {...sf("luggage")}/></div>
              <div className="fp full"><label>Origen</label><input {...sf("origin")}/></div>
              <div className="fp full"><label>Destino</label><input {...sf("destination")}/></div>
              <div className="fp"><label>Vehículo</label><select value={f.vehicleType} onChange={e=>setF(p=>({...p,vehicleType:e.target.value}))}>{VTYPES.map(v=><option key={v}>{v}</option>)}</select></div>
              <div className="fp"><label>Tarifa (USD)</label><input type="number" {...sf("price")}/></div>
              <div className="fp full" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><label style={{fontSize:13.5,color:"var(--tx)"}}>¿Arribo con vuelo?</label><Toggle checked={!!f.isArrival} onChange={e=>setF(p=>({...p,isArrival:e.target.checked}))}/></div>
              {f.isArrival&&<div className="fp"><label>Nro. vuelo</label><input {...sf("flightNumber")} placeholder="AA1234"/></div>}
              <div className="fp full"><label>Driver Link</label><input {...sf("driverLink")} placeholder="https://..."/></div>
              <div className="fp full"><label>Notas</label><textarea {...sf("notes")} rows={2}/></div>
              <div className="fp full" style={{flexDirection:"row",gap:8}}>
                <button className="btn bp" onClick={()=>{onSave(f);setEdit(false);}}><Ic n="check" s={14}/> Guardar</button>
                <button className="btn bg2" onClick={()=>{setF({...res});setEdit(false);}}>Cancelar</button>
              </div>
            </div>
          ):(
            <>
              {[["Empresa",res.company],["Cód. proveedor",res.providerCode],["Fecha",res.date],["Hora",res.time+"hs"],["Pasajero",res.passengerName],["Teléfono",res.passengerPhone],["Email",res.passengerEmail],["Pax",res.pax+" · "+(res.luggage||0)+" bultos"],["Origen",res.origin],["Destino",res.destination],["Vehículo",res.vehicleType],["Tarifa",`${res.currency} ${res.price}`],...(res.isArrival&&res.flightNumber?[["Vuelo arribo","✈️ "+res.flightNumber]]:[]),...(res.driverLink?[["Driver Link",res.driverLink]]:[]),["Notas",res.notes||"—"]].map(([k,v])=><DR key={k} k={k} v={v}/>)}
            </>
          ))}
          {tab==="driver"&&(driver?(
            <div>
              <div style={{display:"flex",gap:14,alignItems:"center",background:"var(--s2)",borderRadius:"var(--r)",padding:16,marginBottom:16}}>
                <Av id={driver.id} text={driver.avatar} size={48} fs={15}/>
                <div>
                  <div style={{fontFamily:"var(--fh)",fontWeight:700,fontSize:16}}>{driver.name}</div>
                  <div style={{color:"var(--mu2)",fontSize:13}}>{driver.vehicleBrand} {driver.vehicleModel} · {driver.plate}</div>
                  <div style={{color:"var(--mu2)",fontSize:13}}>📞 {driver.phone}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <a href={waLink(driver.phone,msgAlert(res,driver))} target="_blank" rel="noreferrer" className="btn bgr"><Ic n="wa" s={14}/> Alerta al chofer</a>
                {res.status==="assigned"&&<button className="btn bp" onClick={()=>onConfirm(res.id)}><Ic n="check" s={14}/> Confirmar (aceptó)</button>}
                {res.status==="confirmed"&&<button className="btn bg2" onClick={()=>onComplete(res.id)}><Ic n="check" s={14}/> Marcar completado</button>}
              </div>
            </div>
          ):(
            <div className="empty"><div style={{fontSize:36,marginBottom:10}}>👨‍✈️</div>Sin chofer asignado<br/><button className="btn bam" style={{marginTop:12}} onClick={onAssign}><Ic n="plus" s={14}/> Asignar chofer</button></div>
          ))}
          {tab==="messages"&&(
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              {driver?(
                <>
                  <div>
                    <div style={{fontSize:12,color:"var(--mu2)",marginBottom:8,display:"flex",gap:6,alignItems:"center"}}><Ic n="wa" s={14}/><strong>Mensaje al chofer — oferta de viaje</strong></div>
                    <div className="wp">{msgAlert(res,driver)}</div>
                    <a href={waLink(driver.phone,msgAlert(res,driver))} target="_blank" rel="noreferrer" className="btn bgr" style={{marginTop:10,display:"inline-flex"}}><Ic n="wa" s={14}/> Enviar a {driver.name}</a>
                  </div>
                  <div>
                    <div style={{fontSize:12,color:"var(--mu2)",marginBottom:8,display:"flex",gap:6,alignItems:"center"}}><Ic n="wa" s={14}/><strong>Info completa al chofer (después de aceptar)</strong></div>
                    <div className="wp">{msgConfirmDrv(res,driver)}</div>
                    <a href={waLink(driver.phone,msgConfirmDrv(res,driver))} target="_blank" rel="noreferrer" className="btn bgr" style={{marginTop:10,display:"inline-flex"}}><Ic n="wa" s={14}/> Enviar info completa</a>
                  </div>
                  <div>
                    <div style={{fontSize:12,color:"var(--mu2)",marginBottom:8,display:"flex",gap:6,alignItems:"center"}}><Ic n="wa" s={14}/><strong>Confirmación al pasajero</strong></div>
                    <div className="wp">{msgPax(res,driver)}</div>
                    <a href={waLink(res.passengerPhone,msgPax(res,driver))} target="_blank" rel="noreferrer" className="btn bp" style={{marginTop:10,display:"inline-flex"}}><Ic n="wa" s={14}/> Enviar a pasajero</a>
                  </div>
                </>
              ):<div className="empty">Asigná un chofer para ver los mensajes</div>}
            </div>
          )}
        </div>
        <div className="mf">
          {!edit&&tab==="info"&&<button className="btn bg2" onClick={()=>setEdit(true)}><Ic n="edit" s={14}/> Editar</button>}
          {res.status==="pending"&&!res.driverId&&<button className="btn bam" onClick={onAssign}><Ic n="user" s={14}/> Asignar chofer</button>}
          {res.status==="assigned"&&driver&&<button className="btn bp" onClick={()=>onConfirm(res.id)}><Ic n="check" s={14}/> Confirmar</button>}
          {res.status==="confirmed"&&<button className="btn bg2" onClick={()=>onComplete(res.id)}><Ic n="check" s={14}/> Completar viaje</button>}
        </div>
      </div>
    </div>
  );
}

function AssignModal({res,drivers,onClose,onAssign}){
  const[sel,setSel]=useState(null);
  const active=drivers.filter(d=>d.active);
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mc mlg">
        <div className="mh">
          <div><div className="mt">Asignar chofer</div><div style={{fontSize:12,color:"var(--mu2)",marginTop:3}}><span className="chip">{res.code}</span> · {res.passengerName} · {res.date} {res.time}hs</div></div>
          <button className="btn bg2 sm" onClick={onClose}><Ic n="x" s={14}/></button>
        </div>
        <div className="mb">
          <div className="dcg">
            {active.map(d=>{
              const exp=licExp(d); const ls=licSt(d);
              return(
                <div key={d.id} className={`dcc${sel===d.id?" sel":""}`} onClick={()=>!exp&&setSel(d.id)} style={exp?{opacity:.45,cursor:"not-allowed",borderColor:"rgba(239,68,68,.3)"}:{}}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                    <Av id={d.id} text={d.avatar} size={32} fs={10}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13}}>{d.name}</div>
                      <div style={{fontSize:11.5,color:"var(--mu2)"}}>{d.vehicleBrand} {d.vehicleModel}</div>
                    </div>
                    {sel===d.id&&<Ic n="check" s={16}/>}
                    {exp&&<Ic n="warn" s={14}/>}
                  </div>
                  <div className="rat"><Ic n="star" s={11}/> {d.rating}</div>
                  <div style={{fontSize:11,marginTop:3,color:ls.c}}>{ls.l}</div>
                  {exp&&<div style={{fontSize:11,color:"var(--re)"}}>Licencia vencida</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mf">
          <button className="btn bg2" onClick={onClose}>Cancelar</button>
          <button className="btn bp" disabled={!sel} onClick={()=>onAssign(res.id,sel)}><Ic n="check" s={14}/> Asignar y notificar</button>
        </div>
      </div>
    </div>
  );
}

function WAModal({res,driver,mode,onClose}){
  const[am,setAm]=useState(mode);
  const msg=am==="alert"?msgAlert(res,driver):am==="confirm_driver"?msgConfirmDrv(res,driver):msgPax(res,driver);
  const phone=am==="passenger"?res.passengerPhone:driver?.phone;
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mc mlg">
        <div className="mh"><div style={{display:"flex",gap:8,alignItems:"center"}}><Ic n="wa" s={18}/><div className="mt">Mensajes WhatsApp</div></div><button className="btn bg2 sm" onClick={onClose}><Ic n="x" s={14}/></button></div>
        <div className="mb">
          <div className="tabs" style={{marginBottom:14}}>
            <button className={`tab${am==="alert"?" on":""}`} onClick={()=>setAm("alert")}>Alerta chofer</button>
            <button className={`tab${am==="confirm_driver"?" on":""}`} onClick={()=>setAm("confirm_driver")}>Info chofer</button>
            <button className={`tab${am==="passenger"?" on":""}`} onClick={()=>setAm("passenger")}>Pasajero</button>
          </div>
          <div style={{fontSize:12,color:"var(--mu)",marginBottom:10}}>Para: <strong style={{color:"var(--tx)"}}>{am==="passenger"?res.passengerName:driver?.name}</strong> · {phone}</div>
          <div className="wp">{msg}</div>
        </div>
        <div className="mf"><button className="btn bg2" onClick={onClose}>Cerrar</button><a href={waLink(phone||"",msg)} target="_blank" rel="noreferrer" className="btn bgr"><Ic n="wa" s={14}/> Abrir en WhatsApp</a></div>
      </div>
    </div>
  );
}

function NewResModal({onClose,onSave,reservations}){
  const[f,setF]=useState({company:"",providerCode:"",passengerName:"",passengerPhone:"",passengerEmail:"",date:"",time:"",origin:"",destination:"",vehicleType:"Van",pax:1,luggage:0,price:0,currency:"USD",isArrival:false,flightNumber:"",driverLink:"",notes:""});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const go=()=>onSave({...f,id:"r"+Date.now(),code:genCode(reservations.map(r=>r.code)),status:"pending",driverId:null,rawEmail:"",createdAt:TODAY});
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mc mlg">
        <div className="mh"><div className="mt">Nueva reserva</div><button className="btn bg2 sm" onClick={onClose}><Ic n="x" s={14}/></button></div>
        <div className="mb">
          <div className="fg">
            <div className="fp"><label>Empresa / Fuente</label><input {...sf("company")} placeholder="Booking, Agencia..."/></div>
            <div className="fp"><label>Código proveedor</label><input {...sf("providerCode")} placeholder="BK-1234"/></div>
            <div className="fp"><label>Pasajero *</label><input {...sf("passengerName")}/></div>
            <div className="fp"><label>Teléfono</label><input {...sf("passengerPhone")}/></div>
            <div className="fp"><label>Email pasajero</label><input {...sf("passengerEmail")}/></div>
            <div className="fp"><label>Fecha *</label><input type="date" {...sf("date")}/></div>
            <div className="fp"><label>Hora *</label><input type="time" {...sf("time")}/></div>
            <div className="fp full"><label>Origen *</label><input {...sf("origin")}/></div>
            <div className="fp full"><label>Destino *</label><input {...sf("destination")}/></div>
            <div className="fp"><label>Tipo de vehículo</label><select value={f.vehicleType} onChange={e=>setF(p=>({...p,vehicleType:e.target.value}))}>{VTYPES.map(v=><option key={v}>{v}</option>)}</select></div>
            <div className="fp"><label>Pasajeros</label><input type="number" min="1" {...sf("pax")}/></div>
            <div className="fp"><label>Equipaje (bultos)</label><input type="number" min="0" {...sf("luggage")}/></div>
            <div className="fp"><label>Tarifa</label><div style={{display:"flex",gap:6}}><select value={f.currency} onChange={e=>setF(p=>({...p,currency:e.target.value}))} style={{width:80}}><option>USD</option><option>ARS</option><option>EUR</option></select><input type="number" {...sf("price")} style={{flex:1}}/></div></div>
            <div className="fp full" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><label style={{fontSize:13.5,color:"var(--tx)"}}>¿Arribo con vuelo?</label><Toggle checked={!!f.isArrival} onChange={e=>setF(p=>({...p,isArrival:e.target.checked}))}/></div>
            {f.isArrival&&<div className="fp"><label>Número de vuelo</label><input {...sf("flightNumber")} placeholder="AR1234"/></div>}
            <div className="fp full"><label>Driver Link (opcional)</label><input {...sf("driverLink")} placeholder="https://..."/></div>
            <div className="fp full"><label>Notas</label><textarea {...sf("notes")} rows={2}/></div>
          </div>
        </div>
        <div className="mf"><button className="btn bg2" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={go}><Ic n="check" s={14}/> Crear reserva</button></div>
      </div>
    </div>
  );
}

function DrvDetailModal({driver,onClose,onSave,onDel}){
  const[tab,setTab]=useState("personal"); const[edit,setEdit]=useState(false); const[f,setF]=useState({...driver});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const ls=licSt(f);
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mc mlg">
        <div className="mh">
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Av id={driver.id} text={driver.avatar} size={44} fs={14}/>
            <div><div className="mt">{driver.name}</div><div style={{fontSize:12,color:"var(--mu2)"}}>{driver.vehicleBrand} {driver.vehicleModel} · {driver.plate}</div></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {!edit&&<button className="btn bg2 sm" onClick={()=>setEdit(true)}><Ic n="edit" s={13}/></button>}
            <button className="btn bg2 sm" onClick={onClose}><Ic n="x" s={14}/></button>
          </div>
        </div>
        <div className="mb">
          <div className="tabs">
            {["personal","vehiculo","documentos","banco"].map(t=><button key={t} className={`tab${tab===t?" on":""}`} onClick={()=>{setTab(t);setEdit(false);}}>{t==="personal"?"Personal":t==="vehiculo"?"Vehículo":t==="documentos"?"Docs":"Banco"}</button>)}
          </div>
          {tab==="personal"&&(edit?(
            <div className="fg">
              <div className="fp full"><label>Nombre</label><input {...sf("name")}/></div>
              <div className="fp"><label>WhatsApp</label><input {...sf("phone")}/></div>
              <div className="fp"><label>Email</label><input {...sf("email")}/></div>
              <div className="fp"><label>F. nacimiento</label><input type="date" {...sf("dob")}/></div>
              <div className="fp"><label>Talle campera</label><select value={f.jacketSize||""} onChange={e=>setF(p=>({...p,jacketSize:e.target.value}))}><option value="">Sel.</option>{JSIZES.map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="fp"><label>Rating</label><input type="number" step="0.1" min="1" max="5" {...sf("rating")}/></div>
            </div>
          ):[["Nombre",driver.name],["Email",driver.email||"—"],["WhatsApp",driver.phone],["F. nacimiento",driver.dob||"—"],["Talle campera",driver.jacketSize||"—"],["Rating",`⭐ ${driver.rating}`]].map(([k,v])=><DR key={k} k={k} v={v}/>))}
          {tab==="vehiculo"&&(edit?(
            <div className="fg">
              <div className="fp"><label>Tipo</label><select value={f.vehicleType||""} onChange={e=>setF(p=>({...p,vehicleType:e.target.value}))}>{DVTYPES.map(v=><option key={v}>{v}</option>)}</select></div>
              <div className="fp"><label>Marca</label><input {...sf("vehicleBrand")}/></div>
              <div className="fp"><label>Modelo</label><input {...sf("vehicleModel")}/></div>
              <div className="fp"><label>Año</label><input {...sf("vehicleYear")}/></div>
              <div className="fp"><label>Color</label><input {...sf("vehicleColor")}/></div>
              <div className="fp"><label>Patente</label><input {...sf("plate")}/></div>
              <div className="fp full" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:6}}><label style={{fontSize:13.5,color:"var(--tx)"}}>¿GNC? ⛽</label><Toggle checked={!!f.gnc} onChange={e=>setF(p=>({...p,gnc:e.target.checked}))}/></div>
            </div>
          ):[["Tipo",driver.vehicleType||"—"],["Marca",driver.vehicleBrand||"—"],["Modelo",driver.vehicleModel||"—"],["Año",driver.vehicleYear||"—"],["Color",driver.vehicleColor||"—"],["Patente",driver.plate||"—"],["GNC",driver.gnc?"✅ Sí":"❌ No"]].map(([k,v])=><DR key={k} k={k} v={v}/>))}
          {tab==="documentos"&&(edit?(
            <div className="fg">
              <div className="fp full"><label>Vencimiento licencia</label><input type="date" {...sf("licenseExpiry")}/></div>
              {ls.s==="exp"&&<div className="lw"><Ic n="warn" s={14}/> Licencia VENCIDA — no asignable</div>}
              <FileUp label="📷 Licencia — Frente" value={f.licenseFront} onChange={v=>setF(p=>({...p,licenseFront:v}))}/>
              <FileUp label="📷 Licencia — Dorso" value={f.licenseBack} onChange={v=>setF(p=>({...p,licenseBack:v}))}/>
              <div className="fp full"><FileUp label="📄 Seguro del vehículo" value={f.insuranceDoc} onChange={v=>setF(p=>({...p,insuranceDoc:v}))} accept=".pdf,image/*"/></div>
            </div>
          ):(
            <>
              {[["Vto. licencia",<span style={{color:licSt(driver).c,fontWeight:700}}>{licSt(driver).l}</span>],["Licencia frente",driver.licenseFront?"✅ Cargada":"Sin cargar"],["Licencia dorso",driver.licenseBack?"✅ Cargada":"Sin cargar"],["Seguro",driver.insuranceDoc?"✅ Cargado":"Sin cargar"]].map(([k,v])=><DR key={k} k={k} v={v}/>)}
              {driver.licenseFront?.data&&driver.licenseFront.type?.startsWith("image")&&<img src={driver.licenseFront.data} alt="" style={{width:"100%",borderRadius:8,marginTop:12}}/>}
            </>
          ))}
          {tab==="banco"&&(edit?(
            <div className="fg">
              <div className="fp"><label>Banco</label><input {...sf("bank")}/></div>
              <div className="fp"><label>Tipo de cuenta</label><select value={f.bankAccountType||""} onChange={e=>setF(p=>({...p,bankAccountType:e.target.value}))}><option value="">Sel.</option>{BTYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="fp"><label>N° cuenta</label><input {...sf("bankAccount")}/></div>
              <div className="fp"><label>CUIT/CUIL</label><input {...sf("cuitCuil")}/></div>
              <div className="fp full"><label>CBU/CVU</label><input {...sf("cbu")} maxLength={22} style={{fontFamily:"monospace"}}/></div>
              <div className="fp full"><label>Alias</label><input {...sf("alias")}/></div>
            </div>
          ):[["Banco",driver.bank||"—"],["Tipo cuenta",driver.bankAccountType||"—"],["N° cuenta",driver.bankAccount||"—"],["CBU/CVU",driver.cbu||"—"],["Alias",driver.alias||"—"],["CUIT/CUIL",driver.cuitCuil||"—"]].map(([k,v])=><DR key={k} k={k} v={v}/>))}
        </div>
        <div className="mf">
          <button className="btn bg2 sm" style={{color:"var(--re)",marginRight:"auto"}} onClick={()=>onDel(driver.id)}><Ic n="trash" s={13}/> Eliminar</button>
          {edit?<><button className="btn bg2" onClick={()=>{setF({...driver});setEdit(false);}}>Cancelar</button><button className="btn bp" onClick={()=>{onSave(f);setEdit(false);}}><Ic n="check" s={14}/> Guardar</button></>:<button className="btn bg2" onClick={()=>setEdit(true)}><Ic n="edit" s={14}/> Editar</button>}
        </div>
      </div>
    </div>
  );
}

function NewDrvModal({onClose,onSave}){
  const[step,setStep]=useState(0);
  const[f,setF]=useState({name:"",phone:"",email:"",dob:"",vehicleType:"Van",vehicleBrand:"",vehicleModel:"",vehicleYear:"",vehicleColor:"",plate:"",gnc:false,licenseExpiry:"",licenseFront:null,licenseBack:null,insuranceDoc:null,jacketSize:"",bank:"",bankAccountType:"",bankAccount:"",cbu:"",alias:"",cuitCuil:"",rating:5.0,walletBalance:0});
  const sf=k=>({value:f[k]||"",onChange:e=>setF(p=>({...p,[k]:e.target.value}))});
  const ls=licSt(f); const steps=["Personal","Vehículo","Documentos","Banco"];
  return(
    <div className="mo" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mc mlg">
        <div className="mh"><div><div className="mt">Nuevo chofer</div><div style={{fontSize:12,color:"var(--mu2)",marginTop:2}}>Paso {step+1}/{steps.length} — {steps[step]}</div></div><button className="btn bg2 sm" onClick={onClose}><Ic n="x" s={14}/></button></div>
        <div style={{padding:"10px 24px 0",display:"flex",gap:6}}>
          {steps.map((s,i)=><div key={s} className="sb3" style={{flex:1,background:i<=step?"var(--ac)":"var(--b2)",cursor:i<step?"pointer":"default"}} onClick={()=>i<step&&setStep(i)}/>)}
        </div>
        <div className="mb">
          {step===0&&<div className="fg">
            <div className="fp full"><label>Nombre completo *</label><input {...sf("name")}/></div>
            <div className="fp"><label>WhatsApp (con cód. país) *</label><input {...sf("phone")} placeholder="5491155443322"/></div>
            <div className="fp"><label>Email</label><input type="email" {...sf("email")}/></div>
            <div className="fp"><label>Fecha de nacimiento</label><input type="date" {...sf("dob")}/></div>
            <div className="fp"><label>Talle campera/buzo</label><select value={f.jacketSize} onChange={e=>setF(p=>({...p,jacketSize:e.target.value}))}><option value="">Seleccionar</option>{JSIZES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="fp"><label>Rating inicial</label><input type="number" step="0.1" min="1" max="5" {...sf("rating")}/></div>
          </div>}
          {step===1&&<div className="fg">
            <div className="fp"><label>Tipo de vehículo *</label><select value={f.vehicleType} onChange={e=>setF(p=>({...p,vehicleType:e.target.value}))}>{DVTYPES.map(v=><option key={v}>{v}</option>)}</select></div>
            <div className="fp"><label>Marca *</label><input {...sf("vehicleBrand")} placeholder="Mercedes-Benz, Ford..."/></div>
            <div className="fp"><label>Modelo *</label><input {...sf("vehicleModel")}/></div>
            <div className="fp"><label>Año de fabricación</label><input {...sf("vehicleYear")}/></div>
            <div className="fp"><label>Color</label><input {...sf("vehicleColor")}/></div>
            <div className="fp"><label>Matrícula / Patente *</label><input {...sf("plate")}/></div>
            <div className="fp full" style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:8}}><label style={{fontSize:13.5,color:"var(--tx)"}}>¿El vehículo posee GNC? ⛽</label><Toggle checked={!!f.gnc} onChange={e=>setF(p=>({...p,gnc:e.target.checked}))}/></div>
          </div>}
          {step===2&&<div className="fg">
            <div className="fp full"><label>Fecha de vencimiento de licencia *</label><input type="date" {...sf("licenseExpiry")}/></div>
            {ls.s==="exp"&&<div className="lw"><Ic n="warn" s={14}/> Licencia VENCIDA — este chofer quedará bloqueado para asignaciones</div>}
            {ls.s==="soon"&&<div style={{display:"flex",gap:8,alignItems:"center",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8,padding:"10px 14px",fontSize:12.5,color:"var(--am)",gridColumn:"1/-1"}}><Ic n="warn" s={14}/> Licencia por vencer pronto</div>}
            <FileUp label="📷 Licencia — Frente" value={f.licenseFront} onChange={v=>setF(p=>({...p,licenseFront:v}))} accept="image/*,.pdf"/>
            <FileUp label="📷 Licencia — Dorso" value={f.licenseBack} onChange={v=>setF(p=>({...p,licenseBack:v}))} accept="image/*,.pdf"/>
            <div className="fp full"><FileUp label="📄 Comprobante de seguro del vehículo" value={f.insuranceDoc} onChange={v=>setF(p=>({...p,insuranceDoc:v}))} accept=".pdf,image/*"/></div>
          </div>}
          {step===3&&<div className="fg">
            <div style={{gridColumn:"1/-1",padding:"8px 0 4px",display:"flex",gap:8,alignItems:"center",color:"var(--ac)",fontSize:13}}><Ic n="bank" s={16}/><strong>Datos para liquidación de pagos</strong></div>
            <div className="fp"><label>Banco</label><input {...sf("bank")} placeholder="Banco Galicia..."/></div>
            <div className="fp"><label>Tipo de cuenta</label><select value={f.bankAccountType} onChange={e=>setF(p=>({...p,bankAccountType:e.target.value}))}><option value="">Seleccionar</option>{BTYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="fp"><label>N° de cuenta</label><input {...sf("bankAccount")}/></div>
            <div className="fp"><label>CUIT / CUIL</label><input {...sf("cuitCuil")} placeholder="20-12345678-9"/></div>
            <div className="fp full"><label>CBU / CVU (22 dígitos)</label><input {...sf("cbu")} maxLength={22} style={{fontFamily:"monospace",letterSpacing:".5px"}}/></div>
            <div className="fp full"><label>Alias</label><input {...sf("alias")} placeholder="nombre.apellido.banco"/></div>
          </div>}
        </div>
        <div className="mf">
          <button className="btn bg2" onClick={step===0?onClose:()=>setStep(s=>s-1)}>{step===0?"Cancelar":"← Anterior"}</button>
          {step<3?<button className="btn bp" onClick={()=>setStep(s=>s+1)} disabled={step===0&&!f.name.trim()}>Siguiente →</button>:<button className="btn bp" onClick={()=>{const parts=f.name.trim().split(" ");const av=(parts[0]?.[0]||"?").toUpperCase()+(parts[1]?.[0]||"").toUpperCase();onSave({...f,id:"d"+Date.now(),avatar:av,active:true});}} disabled={!f.name.trim()||!f.phone.trim()}><Ic n="check" s={14}/> Guardar chofer</button>}
        </div>
      </div>
    </div>
  );
}

function ParsePage({reservations,pRes,toast}){
  const[txt,setTxt]=useState(""); const[parsed,setParsed]=useState(null); const[loading,setLoading]=useState(false); const[err,setErr]=useState("");
  const go=async()=>{
    if(!txt.trim())return; setLoading(true); setErr(""); setParsed(null);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`Extraé datos de email de reserva de traslado. SOLO JSON sin markdown:\n{"company":"","providerCode":"","passengerName":"","passengerPhone":"","passengerEmail":"","date":"YYYY-MM-DD","time":"HH:MM","origin":"","destination":"","vehicleType":"Van","pax":1,"luggage":0,"price":0,"currency":"USD","isArrival":false,"flightNumber":"","driverLink":"","notes":""}`,messages:[{role:"user",content:`Email:\n\n${txt}`}]})});
      const d=await r.json(); const t=d.content.map(i=>i.text||"").join("");
      setParsed(JSON.parse(t.replace(/```json|```/g,"").trim()));
    }catch{setErr("No se pudo procesar. Intentá con otro formato.");}
    setLoading(false);
  };
  const doSave=async()=>{
    const res={...parsed,id:"r"+Date.now(),code:genCode(reservations.map(r=>r.code)),status:"pending",driverId:null,rawEmail:txt,createdAt:TODAY};
    await pRes([...reservations,res]); setParsed(null); setTxt(""); toast("Reserva importada ✅");
  };
  return(
    <div style={{maxWidth:680}}>
      <div style={{background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.15)",borderRadius:"var(--r)",padding:14,marginBottom:18,fontSize:13,color:"var(--mu2)",lineHeight:1.6}}>
        <strong style={{color:"var(--ac)"}}>IA Parser</strong> — Pegá el texto de cualquier email de reserva y la IA extraerá todos los datos automáticamente.
      </div>
      <div style={{background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:"var(--r)",padding:14,marginBottom:14}}>
        <textarea value={txt} onChange={e=>setTxt(e.target.value)} rows={8} placeholder="Pegá aquí el email..." style={{width:"100%",background:"transparent",border:"none",color:"var(--mu2)",fontSize:13,padding:0,resize:"vertical"}}/>
      </div>
      <button className="btn bp" onClick={go} disabled={loading||!txt.trim()}>
        {loading?<div className="spin" style={{width:14,height:14,borderWidth:2}}/>:<Ic n="brain" s={14}/>}
        {loading?"Procesando…":"Extraer con IA"}
      </button>
      {err&&<div style={{marginTop:10,color:"var(--re)",fontSize:13}}>{err}</div>}
      {parsed&&(
        <div style={{marginTop:18,background:"var(--s1)",border:"1px solid var(--b1)",borderRadius:"var(--rl)",overflow:"hidden"}}>
          <div style={{padding:"12px 18px",borderBottom:"1px solid var(--b1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontFamily:"var(--fh)",fontWeight:700}}>Datos extraídos</div>
            <span className="badge" style={{color:"var(--gr)",background:"rgba(16,185,129,0.12)"}}><span className="bd" style={{background:"var(--gr)"}}/> Listo</span>
          </div>
          <div style={{padding:"0 18px"}}>{Object.entries(parsed).map(([k,v])=><DR key={k} k={k} v={String(v)}/>)}</div>
          <div style={{padding:16,display:"flex",gap:8}}>
            <button className="btn bp" onClick={doSave}><Ic n="check" s={14}/> Guardar reserva</button>
            <button className="btn bg2" onClick={()=>setParsed(null)}><Ic n="x" s={14}/> Descartar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT
// ═════════════════════════════════════════════════════════════════════════════
export default function App(){
  const[res,setRes]=useState([]);
  const[drv,setDrv]=useState([]);
  const[usr,setUsr]=useState([]);
  const[pmt,setPmt]=useState([]);
  const[ses,setSes]=useState(null);
  const[loading,setLoading]=useState(true);
  const[toastData,setToastData]=useState(null);

  const toast=useCallback((msg,icon="✅")=>{setToastData({msg,icon});setTimeout(()=>setToastData(null),3000);},[]);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      let r=await load(K.res); let d=await load(K.drv); let u=await load(K.usr); let p=await load(K.pmt); let s=await load(K.ses);
      if(!r){r=SR;await save(K.res,r);} if(!d){d=SD;await save(K.drv,d);} if(!u){u=SU;await save(K.usr,u);} if(!p){p=[];await save(K.pmt,p);}
      setRes(r);setDrv(d);setUsr(u);setPmt(p);
      if(s)setSes(s);
      setLoading(false);
    })();
  },[]);

  const pRes=async l=>{setRes(l);await save(K.res,l);};
  const pDrv=async l=>{setDrv(l);await save(K.drv,l);};
  const pUsr=async l=>{setUsr(l);await save(K.usr,l);};
  const pPmt=async l=>{setPmt(l);await save(K.pmt,l);};

  const handleLogin=async u=>{
    const updated=usr.map(x=>x.id===u.id?u:x);
    await pUsr(updated); setSes(u); await save(K.ses,u);
  };
  const handleLogout=async()=>{setSes(null);await save(K.ses,null);};

  if(loading)return(<><style>{css}</style><div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0A0C10"}}><div style={{textAlign:"center"}}><div className="spin" style={{margin:"0 auto 16px"}}/><div style={{color:"var(--mu)",fontSize:13}}>Cargando...</div></div></div></>);

  return(
    <>
      <style>{css}</style>
      {!ses&&<Login users={usr} onLogin={handleLogin}/>}
      {ses?.role==="admin"&&<Admin session={ses} drivers={drv} reservations={res} payments={pmt} users={usr} pRes={pRes} pDrv={pDrv} pPmt={pPmt} pUsr={pUsr} onLogout={handleLogout} toast={toast}/>}
      {ses?.role==="driver"&&<DriverPortal session={ses} drivers={drv} reservations={res} payments={pmt} onLogout={handleLogout}/>}
      {toastData&&<div className="toast"><span>{toastData.icon}</span><span>{toastData.msg}</span></div>}
    </>
  );
}
