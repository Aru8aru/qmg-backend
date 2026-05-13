import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE CONFIG — то же значение что в Admin.jsx
// ─────────────────────────────────────────────────────────────────────────────
const FB_URL = "https://YOUR_PROJECT-default-rtdb.firebaseio.com";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Golos+Text:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --navy:#0a1628; --navy2:#0f2040; --navy3:#162444;
  --gold:#C8960C; --gold2:#F5B800; --gold3:rgba(200,150,12,.12);
  --green:#43a047; --green2:#66bb6a; --green3:rgba(67,160,71,.12);
  --red:#e53935; --red2:rgba(229,57,53,.12);
  --amber:#f57f17; --amber2:rgba(245,127,23,.12);
  --blue3:#42a5f5;
  --text:#e8edf5; --t2:#8da4c4; --t3:#4a6080; --t4:#2a3a55;
  --bg:#07111f; --bg2:#0a1828; --bg3:#0d1f38;
  --border:rgba(255,255,255,.07); --border2:rgba(255,255,255,.04);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body,html{background:var(--bg);color:var(--text);font-family:'Golos Text',sans-serif}

.qmg-root{width:100%;height:100vh;display:flex;flex-direction:column;background:var(--bg);position:relative;overflow:hidden}
.qmg-root::before{content:'';position:fixed;inset:0;z-index:0;
  background-image:linear-gradient(rgba(67,160,71,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(67,160,71,.012) 1px,transparent 1px);
  background-size:40px 40px;pointer-events:none}

/* Topbar */
.topbar{height:54px;min-height:54px;display:flex;align-items:center;justify-content:space-between;
  padding:0 22px;background:var(--navy2);border-bottom:2px solid var(--green);flex-shrink:0;position:relative;z-index:10}
.tb-l{display:flex;align-items:center;gap:14px}
.brgr{background:none;border:none;cursor:pointer;padding:5px;display:flex;flex-direction:column;gap:5px}
.brgr span{display:block;width:22px;height:2px;background:var(--t2);border-radius:1px;transition:all .3s}
.brgr.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.brgr.open span:nth-child(2){opacity:0}
.brgr.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.tlogo{display:flex;align-items:center;gap:9px;cursor:pointer}
.tlogo-ic{width:32px;height:32px;background:var(--green);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:16px}
.tlogo-n{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:#fff}
.tlogo-s{font-size:9px;color:var(--t3);letter-spacing:.06em;text-transform:uppercase}
.rpill{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;background:var(--green3);border:1px solid rgba(67,160,71,.4);color:var(--green2)}
.tb-r{display:flex;align-items:center;gap:12px}
.ns-ind{display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:6px;font-size:11px;font-weight:600;background:var(--green3);border:1px solid rgba(67,160,71,.3);color:var(--green2)}
.nd{width:6px;height:6px;border-radius:50%;background:currentColor;animation:bp 2s infinite}
@keyframes bp{0%,100%{opacity:1}50%{opacity:.25}}
.tclock{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--t2)}
.tusr{display:flex;align-items:center;gap:8px;padding:5px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:8px}
.tav{width:28px;height:28px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff}
.tun{font-size:12px;font-weight:600}
.tip{font-size:10px;color:var(--t3);font-family:'JetBrains Mono',monospace}
.tout{padding:6px 14px;background:transparent;border:1px solid var(--border);border-radius:6px;color:var(--t2);font-size:12px;cursor:pointer;font-family:'Golos Text',sans-serif;transition:all .2s}
.tout:hover{border-color:var(--red);color:var(--red)}

/* Layout */
.body-wrap{flex:1;display:flex;overflow:hidden;position:relative;z-index:1}
.sidebar{width:220px;min-width:220px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;transition:width .3s,min-width .3s;flex-shrink:0}
.sidebar.collapsed{width:0;min-width:0}
.sb-sec{padding:14px 14px 4px;font-size:10px;font-weight:700;color:var(--t4);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}
.sbi{display:flex;align-items:center;gap:9px;padding:9px 14px;margin:1px 8px;border-radius:7px;cursor:pointer;font-size:13px;color:var(--t2);transition:all .15s;border:1px solid transparent;background:none;width:calc(100% - 16px);text-align:left;font-family:'Golos Text',sans-serif;font-weight:500;white-space:nowrap}
.sbi:hover{background:rgba(255,255,255,.05);color:var(--text)}
.sbi.active{background:rgba(67,160,71,.1);color:var(--green2);border-color:rgba(67,160,71,.2)}
.sbi-ic{font-size:15px;width:18px;text-align:center;flex-shrink:0}
.sbi-badge{margin-left:auto;background:var(--red);color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:10px}
.sb-div{height:1px;background:var(--border);margin:8px 14px}

.content{flex:1;overflow-y:auto;background:var(--bg)}
.content::-webkit-scrollbar{width:4px}
.content::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.pg{padding:26px;animation:pgi .25s ease}
@keyframes pgi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
.pg-tag{display:inline-block;padding:3px 10px;background:var(--green3);border:1px solid rgba(67,160,71,.25);color:var(--green2);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:3px;margin-bottom:10px}
.pg-h1{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#fff;margin-bottom:5px}
.pg-sub{font-size:13px;color:var(--t2);margin-bottom:24px}

.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.g-sensor{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:16px}
.ip-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.mb{margin-bottom:16px}

.card{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:20px}
.card-t{font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}

.stat{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:18px}
.stat-ic{font-size:24px;margin-bottom:9px}
.stat-lb{font-size:11px;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;font-weight:600}
.stat-val{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#fff;line-height:1}
.stat-unit{font-size:12px;color:var(--t2);margin-top:3px}
.stat-tr{font-size:11px;margin-top:7px}
.tup{color:var(--green2)} .tdn{color:var(--red)} .tok-c{color:var(--blue3)}

.bdg{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700}
.bok{background:var(--green3);color:var(--green2)}
.bwarn{background:var(--amber2);color:var(--amber)}
.berr{background:var(--red2);color:var(--red)}
.binfo{background:rgba(21,101,192,.12);color:var(--blue3)}

/* Sensor */
.sc{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:18px;text-align:center;transition:border-color .3s}
.sc.alarm{animation:alarm 0.8s infinite}
.sc-title{font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px}
.ring{width:88px;height:88px;border-radius:50%;margin:0 auto 10px;display:flex;align-items:center;justify-content:center}
.ring-in{width:66px;height:66px;border-radius:50%;background:var(--bg2);display:flex;flex-direction:column;align-items:center;justify-content:center}
.ring-num{font-family:'Playfair Display',serif;font-size:17px;font-weight:700}
.ring-unit{font-size:9px;color:var(--t3);margin-top:1px}
.sc-loc{font-size:10px;color:var(--t2);margin-bottom:5px}
.sc-st{font-size:10px;font-weight:700;padding:3px 9px;border-radius:10px;display:inline-block}

.atk-ban{display:none;padding:14px 20px;background:var(--red2);border:1px solid rgba(229,57,53,.4);border-radius:8px;margin-bottom:16px;animation:atka 1s infinite}
.atk-ban.show{display:flex;align-items:center;gap:12px}

.tbl{width:100%;border-collapse:collapse;font-size:12px}
.tbl th{text-align:left;padding:8px 12px;color:var(--t3);font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;border-bottom:1px solid var(--border)}
.tbl td{padding:9px 12px;border-bottom:1px solid var(--border2);color:var(--t2)}
.tbl td:first-child{color:var(--text);font-weight:500}

.pipe-card{background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:16px;transition:border-color .2s}
.pipe-card:hover{border-color:rgba(67,160,71,.2)}
.pipe-hd{display:flex;justify-content:space-between;margin-bottom:9px}
.pipe-name{font-size:13px;font-weight:600;color:var(--text)}
.pipe-loc{font-size:11px;color:var(--t2);margin-top:2px}
.pipe-bar{height:5px;background:rgba(255,255,255,.07);border-radius:3px;margin-bottom:7px;overflow:hidden}
.pipe-fill{height:100%;border-radius:3px}
.pfg{background:var(--green)} .pfa{background:var(--amber)} .pfr{background:var(--red)} .pfb{background:#1976D2}
.pipe-stats{display:flex;gap:14px;font-size:11px;color:var(--t2)}
.pipe-stat strong{display:block;color:var(--text);font-size:12px}

.ip-card{background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:14px}
.ip-name{font-size:12px;font-weight:600;color:var(--text);margin-bottom:5px}
.ip-addr{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--blue3);margin-bottom:5px}
.ip-info{font-size:11px;color:var(--t2);line-height:1.7}
.sdot{display:inline-block;width:6px;height:6px;border-radius:50%}
.sdg{background:var(--green2);animation:bp 2s infinite} .sda{background:var(--amber)} .sdr{background:var(--red);animation:bp .8s infinite}

.log-list{display:flex;flex-direction:column;gap:4px}
.li{display:flex;gap:9px;padding:8px 11px;border-radius:6px;background:var(--bg3);border:1px solid var(--border2);font-size:11px}
.lt{font-family:'JetBrains Mono',monospace;color:var(--t3);flex-shrink:0;font-size:10px;padding-top:1px}
.lm{color:var(--t2);flex:1;line-height:1.5}

/* ═══════════════════════════════════════════════════════
   NS-KDC CHAT STYLES (same as Admin, green theme)
═══════════════════════════════════════════════════════ */
.ns-chat-wrap{display:flex;flex-direction:column;height:460px}
.ns-chat-msgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding:4px 0}
.ns-chat-msgs::-webkit-scrollbar{width:3px}
.ns-chat-msgs::-webkit-scrollbar-thumb{background:var(--t4)}
.ns-msg-row{display:flex;flex-direction:column}
.ns-msg-row.me{align-items:flex-end}
.ns-msg-row.them{align-items:flex-start}
.ns-bubble{max-width:80%;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.5;position:relative;cursor:pointer;transition:border-color .2s}
.ns-bubble.me{background:rgba(67,160,71,.1);border:1px solid rgba(67,160,71,.25);border-bottom-right-radius:3px}
.ns-bubble.them{background:var(--bg3);border:1px solid var(--border);border-bottom-left-radius:3px}
.ns-bubble:hover{border-color:rgba(200,150,12,.4)!important}
.ns-cipher-preview{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3);word-break:break-all;line-height:1.6;margin-bottom:6px}
.ns-lock-row{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gold2);margin-top:4px}
.ns-meta{font-size:10px;color:var(--t3);margin-top:4px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ns-ttl-pill{padding:1px 7px;border-radius:8px;font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace}
.ns-ttl-ok{background:var(--green3);color:var(--green2)}
.ns-ttl-warn{background:var(--amber2);color:var(--amber)}
.ns-ttl-dead{background:var(--red2);color:var(--red)}
.ns-inp-row{display:flex;gap:8px;padding-top:10px;border-top:1px solid var(--border);margin-top:8px}
.ns-chat-inp{flex:1;padding:10px 13px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:'Golos Text',sans-serif;outline:none;transition:border-color .2s}
.ns-chat-inp:focus{border-color:rgba(67,160,71,.4)}
.ns-chat-inp::placeholder{color:var(--t3)}
.ns-send-btn{padding:10px 18px;background:var(--green);color:#fff;border:none;border-radius:7px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Golos Text',sans-serif;display:flex;align-items:center;gap:6px}
.ns-send-btn:hover{background:var(--green2)}
.ns-legend-box{padding:10px 14px;background:rgba(200,150,12,.06);border:1px solid rgba(200,150,12,.15);border-radius:7px;font-size:11px;color:rgba(200,150,12,.8);line-height:1.8;margin-bottom:10px}
.ns-legend-box strong{color:var(--gold2)}
.ns-log-strip{display:flex;flex-direction:column;gap:3px;max-height:120px;overflow-y:auto;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}
.ns-log-item{display:flex;gap:6px;font-size:10px;align-items:flex-start}
.ns-log-t{font-family:'JetBrains Mono',monospace;color:var(--t3);flex-shrink:0}
.ns-log-tag{padding:0px 5px;border-radius:3px;font-size:9px;font-weight:700;flex-shrink:0}
.ns-log-m{color:var(--t2);line-height:1.5}

/* NS Modal */
.ns-modal-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);padding:16px}
.ns-modal{background:var(--bg2);border:1px solid rgba(200,150,12,.3);border-radius:14px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,.8)}
.ns-modal::-webkit-scrollbar{width:3px}
.ns-modal::-webkit-scrollbar-thumb{background:var(--t4)}
.ns-modal-head{padding:16px 20px;background:var(--bg3);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:1}
.ns-modal-title{font-size:14px;font-weight:700;color:var(--gold2);font-family:'JetBrains Mono',monospace}
.ns-modal-close{background:none;border:none;cursor:pointer;color:var(--t2);font-size:20px;padding:0 4px;line-height:1}
.ns-modal-body{padding:18px 20px}
.ns-step{display:flex;gap:12px;margin-bottom:12px;padding:14px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);transition:border-color .3s}
.ns-step.active{border-color:rgba(200,150,12,.4);background:rgba(200,150,12,.04)}
.ns-step.done{border-color:rgba(67,160,71,.3);background:rgba(67,160,71,.04)}
.ns-step.locked{opacity:.45}
.ns-step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;margin-top:1px;font-family:'JetBrains Mono',monospace}
.ns-step-num.pending{background:var(--bg);border:1px solid var(--border);color:var(--t3)}
.ns-step-num.active-n{background:rgba(200,150,12,.15);border:1px solid rgba(200,150,12,.5);color:var(--gold2)}
.ns-step-num.done-n{background:var(--green3);border:1px solid rgba(67,160,71,.4);color:var(--green2)}
.ns-step-content{flex:1;min-width:0}
.ns-step-title{font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px}
.ns-step-formula{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t2);line-height:1.8;word-break:break-all;padding:6px 10px;background:rgba(0,0,0,.3);border-radius:5px;margin-bottom:8px}
.ns-step-formula .hi{color:var(--gold2)}
.ns-step-formula .hi2{color:var(--green2)}
.ns-step-formula .hi3{color:var(--blue3)}
.ns-inp-group{display:flex;flex-direction:column;gap:5px;margin-top:6px}
.ns-inp-label{font-size:11px;color:var(--t2)}
.ns-inp-hint{font-size:10px;color:var(--t3);font-family:'JetBrains Mono',monospace}
.ns-step-inp-row{display:flex;gap:7px;align-items:center}
.ns-step-inp{flex:1;padding:8px 11px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-family:'JetBrains Mono',monospace;background:var(--bg);color:var(--text);outline:none;transition:border-color .2s}
.ns-step-inp:focus{border-color:rgba(200,150,12,.5)}
.ns-step-inp.err{border-color:var(--red)!important}
.ns-step-btn{padding:8px 14px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Golos Text',sans-serif;border:none;background:var(--gold);color:#000;transition:all .15s;white-space:nowrap}
.ns-step-btn:hover{background:var(--gold2)}
.ns-err-msg{font-size:10px;color:var(--red);margin-top:3px}
.ns-success-box{padding:16px;background:var(--green3);border:1px solid rgba(67,160,71,.35);border-radius:8px;margin-top:12px;text-align:center}
.ns-success-title{font-size:13px;font-weight:700;color:var(--green2);margin-bottom:6px}
.ns-revealed{font-size:18px;font-weight:600;color:#fff;padding:12px 16px;background:rgba(0,0,0,.3);border-radius:6px;margin-top:6px;line-height:1.5;word-break:break-word}
.ns-expired-box{padding:14px;background:var(--red2);border:1px solid rgba(229,57,53,.4);border-radius:8px;text-align:center;color:var(--red);font-size:13px}
.ns-modal-log{margin-top:14px;padding-top:12px;border-top:1px solid var(--border)}
.ns-modal-log-title{font-size:10px;font-weight:700;color:var(--t4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}

/* Toast */
.toast{position:fixed;bottom:22px;right:22px;z-index:8000;padding:12px 18px;border-radius:9px;font-size:13px;background:var(--bg2);border:1px solid var(--border);box-shadow:0 4px 24px rgba(0,0,0,.4);max-width:320px;transition:all .3s;opacity:0;transform:translateY(18px);pointer-events:none}
.toast.show{opacity:1;transform:translateY(0)}
.toast.tok{border-color:rgba(67,160,71,.4);background:var(--green3)}
.toast.terr{border-color:rgba(229,57,53,.4);background:var(--red2)}
.toast.twarn{border-color:rgba(245,127,23,.4);background:var(--amber2)}

/* Auth */
.auth-wall{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--navy),#0a1f0a)}
.aw{background:var(--bg2);border:1px solid rgba(67,160,71,.25);border-radius:16px;width:420px;padding:36px;text-align:center;box-shadow:0 32px 80px rgba(0,0,0,.7)}
.aw h2{font-family:'Playfair Display',serif;font-size:22px;color:#fff;margin:16px 0 8px}
.aw p{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:22px}
.aw-btn{display:inline-block;padding:12px 28px;background:var(--green);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Golos Text',sans-serif}
.aw-fields{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
.aw-inp{padding:10px 14px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:'Golos Text',sans-serif;outline:none;text-align:center}
.aw-inp:focus{border-color:rgba(67,160,71,.4)}
.aw-inp::placeholder{color:var(--t3)}
.aw-err{color:var(--red);font-size:12px;margin-bottom:8px}

@keyframes alarm{0%,100%{border-color:rgba(229,57,53,.25)}50%{border-color:var(--red);box-shadow:0 0 10px rgba(229,57,53,.25)}}
@keyframes atka{0%,100%{border-color:rgba(229,57,53,.4)}50%{border-color:var(--red)}}

@media(max-width:900px){
  .sidebar{position:fixed;top:54px;bottom:0;z-index:800}
  .g2,.g3,.g4,.g-sensor,.ip-grid{grid-template-columns:1fr}
}
`;

// ─── Static data ──────────────────────────────────────────────────────────────
const PIPES_DATA = [
  {name:'Негізгі транзит',loc:'Атырау — Арал',flow:'600 м³/сағ',len:'840 км',pct:70,c:'pfg',s:'ok'},
  {name:'Маңғыстау тармағы',loc:'Ақтау — Өзен',flow:'420 м³/сағ',len:'380 км',pct:82,c:'pfg',s:'ok'},
  {name:'⚠ B-14 АВАРИЯ',loc:'Атырау обл.',flow:'92 bar',len:'45 км',pct:100,c:'pfr',s:'err'},
  {name:'Солтүстік желі',loc:'Астана бағыты',flow:'280 м³/сағ',len:'560 км',pct:58,c:'pfb',s:'ok'},
  {name:'Оңтүстік экспорт',loc:'Шымкент бағыты',flow:'350 м³/сағ',len:'720 км',pct:65,c:'pfg',s:'ok'},
  {name:'Теңіз — КТК',loc:'Каспий',flow:'820 м³/сағ',len:'1500 км',pct:88,c:'pfa',s:'warn'},
];
const DEVS_DATA = [
  {name:'SCADA-Сервер-01',ip:'192.168.0.1',mac:'00:1A:2B:3C:4D:5E',type:'SCADA сервер',proto:'NS v2.1',s:'ok'},
  {name:'KDC-Сервер',ip:'192.168.0.5',mac:'00:1A:2B:3C:4D:05',type:'Kerberos KDC',proto:'Kerberos+NS',s:'ok'},
  {name:'RTU-01 Атырау',ip:'192.168.1.10',mac:'00:1A:2B:3C:4D:61',type:'RTU/PLC',proto:'NS v2.1',s:'ok'},
  {name:'RTU-07 Секция B',ip:'192.168.1.70',mac:'00:1A:2B:3C:4D:67',type:'RTU/PLC',proto:'NS v2.1',s:'warn'},
  {name:'PLC-03 Сорғы',ip:'192.168.2.30',mac:'00:1A:2B:3C:4D:83',type:'PLC',proto:'NS v2.1',s:'ok'},
  {name:'⚠ UNKNOWN-HOST',ip:'10.0.0.99',mac:'DE:AD:BE:EF:00:99',type:'Белгісіз',proto:'—',s:'err'},
];
const INIT_SENSORS = [
  {id:'P-01',name:'Қысым',loc:'Секция A',val:70,base:70,unit:'bar',min:60,max:80,dr:0.8},
  {id:'T-03',name:'Температура',loc:'Сорғы-3',val:85,base:85,unit:'°C',min:0,max:90,dr:0.5},
  {id:'F-07',name:'Ағын',loc:'Негізгі желі',val:600,base:600,unit:'м³/сағ',min:500,max:1000,dr:6},
  {id:'L-02',name:'Деңгей',loc:'Резервуар B',val:78,base:78,unit:'%',min:20,max:90,dr:0.3},
  {id:'P-14',name:'Қысым B-14',loc:'RTU-07',val:92,base:92,unit:'bar',min:60,max:85,dr:1.2},
  {id:'G-05',name:'Газ қысымы',loc:'Сепаратор-2',val:4.2,base:4.2,unit:'МПа',min:3,max:5,dr:0.05},
];

// ─── NS-KDC Helpers (identical to Admin) ─────────────────────────────────────
const SESSION_TTL = 90;
const pp = n => String(n).padStart(2,'0');
const ts = () => { const d=new Date(); return `${pp(d.getHours())}:${pp(d.getMinutes())}:${pp(d.getSeconds())}`; };
const rHex = bytes => Array.from({length:bytes},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join('').toUpperCase();

function nsEncrypt(plaintext, Ks) {
  const bytes = [...plaintext].map(c=>c.charCodeAt(0));
  const keyBytes = Ks.match(/.{1,2}/g).map(h=>parseInt(h,16));
  const enc = bytes.map((b,i)=>(b^keyBytes[i%keyBytes.length]).toString(16).padStart(2,'0'));
  return enc.join('').toUpperCase().match(/.{1,4}/g).join(' ');
}

function nsDecrypt(cipher, Ks) {
  try {
    const hex = cipher.replace(/\s/g,'');
    const keyBytes = Ks.match(/.{1,2}/g).map(h=>parseInt(h,16));
    let text='';
    for(let i=0;i<hex.length;i+=2) {
      const b = parseInt(hex.substr(i,2),16) ^ keyBytes[(i/2)%keyBytes.length];
      text += String.fromCharCode(b);
    }
    return text;
  } catch { return null; }
}

function generateNSTicket(from, to, Ks) {
  const Na = rHex(4);
  const Nb = rHex(4);
  return {
    Na, Nb, Ks, from, to, timestamp: Date.now(),
    steps: [
      {
        label:`${from} → KDC`,
        formula:`{ ID_${from}, ID_${to}, Na=0x${Na} } K_${from}`,
        desc:`Инициатор запрашивает сессионный ключ у KDC. Nonce Na защищает от replay-атак.`,
        field:'Na', expected:Na, hint:`Na = 0x${Na}`, placeholder:`0x${Na.substr(0,2)}__`
      },
      {
        label:`KDC → ${from}`,
        formula:`{ Ks=0x${Ks.substr(0,8)}…, ID_${to}, Na=0x${Na}, { Ks, ID_${from} }K_${to} } K_${from}`,
        desc:`KDC выдаёт сессионный ключ Ks и тикет для получателя.`,
        field:'Ks', expected:Ks.substr(0,8), hint:`Ks начинается с ${Ks.substr(0,4)}`, placeholder:`${Ks.substr(0,4)}____`
      },
      {
        label:`${from} → ${to}`,
        formula:`{ Ks, ID_${from} }K_${to}  ||  { msg }Ks`,
        desc:`Отправитель передаёт тикет и зашифрованное сообщение получателю.`,
        field:'ticket',
        ticketStr:`{ Ks=0x${Ks.substr(0,8)}…, ID_${from} }K_${to}`,
        hint:`Подтвердите получение тикета`, placeholder:`ok`
      },
      {
        label:`${to} → ${from}`,
        formula:`{ Nb=0x${Nb} }Ks  →  { Nb−1 }Ks  ✓  Взаимная аутентификация`,
        desc:`Получатель доказывает знание Ks через Nb. Взаимная аутентификация завершена.`,
        field:'Nb', expected:Nb, hint:`Nb = 0x${Nb}`, placeholder:`0x${Nb.substr(0,2)}__`
      }
    ]
  };
}

// ─── Firebase ─────────────────────────────────────────────────────────────────
async function fbPush(msg) {
  if(!FB_URL||FB_URL.includes('YOUR_PROJECT')) return false;
  try {
    const res = await fetch(`${FB_URL}/qmg_chat/${msg.id}.json`,{
      method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(msg)
    });
    return res.ok;
  } catch { return false; }
}

async function fbFetch(since=0) {
  if(!FB_URL||FB_URL.includes('YOUR_PROJECT')) return [];
  try {
    const res = await fetch(`${FB_URL}/qmg_chat.json`);
    if(!res.ok) return [];
    const data = await res.json();
    if(!data) return [];
    return Object.values(data).filter(m=>m&&m.timestamp>since).sort((a,b)=>a.timestamp-b.timestamp);
  } catch { return []; }
}

function loadLocalMsgs() { try { return JSON.parse(localStorage.getItem('qmg_msgs_ns')||'[]'); } catch { return []; } }
function saveLocalMsgs(msgs) { try { localStorage.setItem('qmg_msgs_ns',JSON.stringify(msgs.slice(-80))); } catch {} }

// ─── NS Modal (identical logic, operator role) ────────────────────────────────
function NSModal({ msg, onClose, addLog }) {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState(['','','','']);
  const [errors, setErrors] = useState(['','','','']);
  const [modalLogs, setModalLogs] = useState([]);
  const [decrypted, setDecrypted] = useState('');

  const expired = (Date.now() - msg.timestamp) / 1000 > SESSION_TTL;
  const ticket = msg.ticket;

  const addMLog = (type,text)=>{ setModalLogs(p=>[{t:ts(),type,text},...p].slice(0,8)); };

  useEffect(()=>{
    addMLog('info',`NS сессия открыта — msg #${msg.id.substr(-6)}`);
    addMLog('info',`Отправитель: ${msg.from} → Получатель: operator`);
  },[]);

  const verify = (stepIdx, val) => {
    const s = ticket.steps[stepIdx];
    const clean = val.trim().replace(/^0x/i,'').toUpperCase();
    if(stepIdx===0){
      if(clean===s.expected.toUpperCase()||(clean.length>=4&&s.expected.toUpperCase().startsWith(clean))){
        addMLog('ok',`✓ Na верифицирован (0x${s.expected})`);
        addLog('ok','[NS-STEP1]','Na верифицирован → OK');
        return true;
      }
      addMLog('err',`✗ Неверный Na`); addLog('err','[NS-STEP1]','Неверный Na');
      return false;
    }
    if(stepIdx===1){
      if(clean.length>=4&&s.expected.toUpperCase().startsWith(clean)){
        addMLog('ok','✓ Ks верифицирован');
        addLog('ok','[NS-STEP2]','Ks верифицирован');
        return true;
      }
      addMLog('err','✗ Неверный Ks'); addLog('err','[NS-STEP2]','Неверный Ks');
      return false;
    }
    if(stepIdx===2){
      if(val.trim().length>0){ addMLog('ok','✓ Тикет получен'); addLog('ok','[NS-STEP3]','Тикет получен'); return true; }
      return false;
    }
    if(stepIdx===3){
      if(clean===s.expected.toUpperCase()||(clean.length>=4&&s.expected.toUpperCase().startsWith(clean))){
        addMLog('ok','✓ Nb верифицирован — взаимная аутентификация ✓');
        addLog('ok','[NS-STEP4]','Взаимная аутентификация завершена');
        return true;
      }
      addMLog('err','✗ Неверный Nb — возможна replay-атака!');
      addLog('err','[NS-STEP4]','Неверный Nb');
      return false;
    }
    return false;
  };

  const handleConfirm = (stepIdx) => {
    if(verify(stepIdx,inputs[stepIdx])){
      setErrors(p=>{const n=[...p];n[stepIdx]='';return n;});
      if(stepIdx===3){
        setDecrypted(nsDecrypt(msg.cipher,ticket.Ks)||'[Ошибка]');
        addMLog('ok','✓ Сообщение расшифровано!');
        setStep(4);
      } else setStep(stepIdx+1);
    } else {
      setErrors(p=>{const n=[...p];n[stepIdx]='Неверное значение.';return n;});
    }
  };

  const stepState=i=>i<step?'done':i===step?'active':'locked';
  const stepNumClass=i=>i<step?'done-n':i===step?'active-n':'pending';
  const LC={ok:'bok',info:'binfo',err:'berr',warn:'bwarn'};

  return (
    <div className="ns-modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="ns-modal">
        <div className="ns-modal-head">
          <div className="ns-modal-title">🔐 NS-KDC Расшифровка — Needham–Schroeder</div>
          <button className="ns-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="ns-modal-body">

          <div style={{display:'flex',gap:12,marginBottom:14,padding:'10px 12px',background:'var(--bg3)',borderRadius:7,border:'1px solid var(--border)',fontSize:11,color:'var(--t2)',fontFamily:'JetBrains Mono,monospace'}}>
            <span>От: <strong style={{color:'var(--text)'}}>{msg.from}</strong></span>
            <span>•</span><span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            <span>•</span>
            <span style={{color:expired?'var(--red)':'var(--green2)'}}>
              TTL: {expired?'ИСТЁК':`${Math.max(0,SESSION_TTL-Math.floor((Date.now()-msg.timestamp)/1000))}s`}
            </span>
            <span>•</span>
            <span>Ks: {ticket.Ks.substr(0,8)}…</span>
          </div>

          <div style={{padding:'8px 12px',background:'rgba(0,0,0,.4)',borderRadius:6,border:'1px solid var(--border2)',marginBottom:14}}>
            <div style={{fontSize:9,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Зашифрованное сообщение:</div>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'var(--t2)',wordBreak:'break-all',lineHeight:1.7}}>{msg.cipher}</div>
          </div>

          {expired && <div className="ns-expired-box">⏰ TTL истёк. Сессионный ключ недействителен.</div>}

          {step===4&&!expired&&(
            <div className="ns-success-box">
              <div className="ns-success-title">✓ Протокол завершён — взаимная аутентификация пройдена</div>
              <div className="ns-revealed">{decrypted}</div>
            </div>
          )}

          {!expired&&step<4&&ticket.steps.map((s,i)=>{
            const state=stepState(i);
            return (
              <div key={i} className={`ns-step ${state}`}>
                <div className={`ns-step-num ${stepNumClass(i)}`}>{i<step?'✓':i+1}</div>
                <div className="ns-step-content">
                  <div className="ns-step-title">{s.label}</div>
                  <div className="ns-step-formula"
                    dangerouslySetInnerHTML={{__html:s.formula
                      .replace(/Na=0x\w+/g,m=>`<span class="hi">${m}</span>`)
                      .replace(/Nb=0x\w+/g,m=>`<span class="hi3">${m}</span>`)
                      .replace(/Ks=0x[\w…]+/g,m=>`<span class="hi2">${m}</span>`)
                      .replace(/✓[^<]*/g,m=>`<span class="hi2">${m}</span>`)
                    }}
                  />
                  <div style={{fontSize:11,color:'var(--t3)',marginBottom:state==='active'?8:0}}>{s.desc}</div>
                  {state==='active'&&(
                    <div className="ns-inp-group">
                      {i===2?(
                        <>
                          <div style={{fontSize:11,color:'var(--t2)',fontFamily:'JetBrains Mono,monospace',padding:'6px 10px',background:'rgba(0,0,0,.3)',borderRadius:5,marginBottom:6}}>{s.ticketStr}</div>
                          <div className="ns-inp-hint">Введите «ok» для подтверждения:</div>
                        </>
                      ):(
                        <div className="ns-inp-hint">{s.hint}</div>
                      )}
                      <div className="ns-step-inp-row">
                        <input
                          className={`ns-step-inp${errors[i]?' err':''}`}
                          placeholder={s.placeholder}
                          value={inputs[i]}
                          onChange={e=>setInputs(p=>{const n=[...p];n[i]=e.target.value;return n;})}
                          onKeyDown={e=>e.key==='Enter'&&handleConfirm(i)}
                        />
                        <button className="ns-step-btn" onClick={()=>handleConfirm(i)}>Подтвердить →</button>
                      </div>
                      {errors[i]&&<div className="ns-err-msg">{errors[i]}</div>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="ns-modal-log">
            <div className="ns-modal-log-title">📋 Лог сессии</div>
            <div className="log-list">
              {modalLogs.map((l,i)=>(
                <div key={i} className="li">
                  <span className="lt">{l.t}</span>
                  <span className={`bdg ${LC[l.type]||'binfo'}`}>[NS]</span>
                  <span className="lm">{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Page (Operator) ─────────────────────────────────────────────────────
function ChatPage({ addLog, showToast }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [openModal, setOpenModal] = useState(null);
  const [chatLogs, setChatLogs] = useState([]);
  const [ttl, setTtl] = useState(SESSION_TTL);
  const [sessionKs, setSessionKs] = useState(()=>rHex(16));
  const [sessionStart, setSessionStart] = useState(Date.now());
  const [lastFetch, setLastFetch] = useState(0);
  const endRef = useRef(null);
  const bcRef = useRef(null);

  const addCLog = useCallback((type,tag,msg)=>{
    const cls={ok:'bok',err:'berr',warn:'bwarn',info:'binfo'}[type]||'binfo';
    setChatLogs(p=>[{t:ts(),cls,tag,msg},...p].slice(0,20));
    addLog(type,tag,msg);
  },[addLog]);

  const renewSession = useCallback(()=>{
    const newKs=rHex(16);
    setSessionKs(newKs); setSessionStart(Date.now()); setTtl(SESSION_TTL);
    addCLog('warn','[KDC]',`Сессия обновлена — Ks: ${newKs.substr(0,8)}…`);
    showToast('🔑 KDC выдал новый сессионный ключ','twarn');
  },[addCLog,showToast]);

  useEffect(()=>{
    const t=setInterval(()=>{
      const elapsed=(Date.now()-sessionStart)/1000;
      const left=Math.max(0,SESSION_TTL-elapsed);
      setTtl(Math.round(left));
      if(left<=0) renewSession();
    },1000);
    return ()=>clearInterval(t);
  },[sessionStart,renewSession]);

  useEffect(()=>{
    const local=loadLocalMsgs();
    if(local.length) setMessages(local);
    addCLog('ok','[KDC]',`Сессионный ключ: ${sessionKs.substr(0,8)}… TTL=${SESSION_TTL}s`);
    addCLog('info','[NS]','NS-KDC протокол активен');
  },[]);

  // BroadcastChannel — same browser
  useEffect(()=>{
    try {
      bcRef.current=new BroadcastChannel('qmg_chat_ns');
      bcRef.current.onmessage=(e)=>{
        if(e.data?.type==='new_msg'&&e.data.msg.from!=='operator'){
          setMessages(prev=>{
            if(prev.find(m=>m.id===e.data.msg.id)) return prev;
            const updated=[...prev,e.data.msg];
            saveLocalMsgs(updated); return updated;
          });
          addCLog('ok','[ЧАТ]','admin → operator: зашифрованное сообщение получено');
          showToast('💬 Новое зашифрованное сообщение от администратора!','tok');
        }
      };
    } catch {}
    return ()=>{ try{bcRef.current?.close();}catch{} };
  },[addCLog,showToast]);

  // Firebase polling — cross-device
  useEffect(()=>{
    const poll=async()=>{
      const remote=await fbFetch(lastFetch);
      if(remote.length){
        setLastFetch(Date.now());
        setMessages(prev=>{
          const ids=new Set(prev.map(m=>m.id));
          const newMsgs=remote.filter(m=>!ids.has(m.id)&&m.from!=='operator');
          if(!newMsgs.length) return prev;
          const updated=[...prev,...newMsgs].sort((a,b)=>a.timestamp-b.timestamp);
          saveLocalMsgs(updated);
          newMsgs.forEach(()=>{
            addCLog('ok','[FIREBASE]','Новое сообщение от admin (cross-device)');
            showToast('📡 Новое сообщение от администратора!','tok');
          });
          return updated;
        });
      }
    };
    const t=setInterval(poll,3000);
    return ()=>clearInterval(t);
  },[lastFetch,addCLog,showToast]);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); },[messages]);

  const sendMsg=()=>{
    if(!input.trim()) return;
    let ks=sessionKs;
    if((Date.now()-sessionStart)/1000>=SESSION_TTL){
      ks=rHex(16); setSessionKs(ks); setSessionStart(Date.now());
      addCLog('warn','[KDC]',`Автообновление ключа: ${ks.substr(0,8)}…`);
    }
    const ticket=generateNSTicket('operator','admin',ks);
    const cipher=nsEncrypt(input,ks);
    const msg={
      id:`op_${Date.now()}_${rHex(2)}`,
      from:'operator', cipher, ticket,
      timestamp:Date.now(), time:ts(),
    };
    const updated=[...messages,msg];
    setMessages(updated); saveLocalMsgs(updated); setInput('');
    try{ bcRef.current?.postMessage({type:'new_msg',msg}); }catch{}
    fbPush(msg).then(ok=>{ if(ok) addCLog('ok','[FIREBASE]','Опубликовано в Firebase'); });
    addCLog('ok','[NS-KDC]',`operator→admin: Ks=${ks.substr(0,8)}… Na=0x${ticket.Na}`);
  };

  const ttlPct=(ttl/SESSION_TTL)*100;
  const ttlColor=ttl>60?'var(--green)':ttl>20?'var(--amber)':'var(--red)';
  const ttlCls=ttl>60?'ns-ttl-ok':ttl>20?'ns-ttl-warn':'ns-ttl-dead';

  return (
    <div className="pg">
      {openModal&&<NSModal msg={openModal} onClose={()=>setOpenModal(null)} addLog={addCLog}/>}

      <div className="pg-tag">Чат</div>
      <div className="pg-h1">Чат — NS-KDC Шифрование</div>
      <div className="pg-sub">Needham–Schroeder протокол · Нажмите на сообщение чтобы расшифровать</div>

      <div className="ns-legend-box">
        <strong>Needham–Schroeder + KDC:</strong><br/>
        1. operator→KDC: {'{ ID_op, ID_admin, Na }'}K_op — запрос сессионного ключа<br/>
        2. KDC→operator: {'{ Ks, ID_admin, Na, { Ks, ID_op }'}K_admin {'}'} K_op — ключ выдан<br/>
        3. operator→admin: {'{ Ks, ID_op }'}K_admin || {'{ msg }'}Ks — тикет + шифртекст<br/>
        4. admin→operator: {'{ Nb }'}Ks → {'{ Nb−1 }'}Ks ✓ — взаимная аутентификация
      </div>

      <div className="card mb">
        <div className="card-t">
          <span>🔑 KDC Сессионный ключ</span>
          <span className={`bdg ${ttlCls}`}>TTL: {ttl}s</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{flex:1,height:4,background:'var(--border)',borderRadius:2,overflow:'hidden'}}>
            <div style={{width:`${ttlPct}%`,height:'100%',background:ttlColor,borderRadius:2,transition:'width 1s linear,background .5s'}}/>
          </div>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'var(--t3)',flexShrink:0}}>
            Ks: {sessionKs.substr(0,8)}…
          </span>
          <button onClick={renewSession} style={{padding:'4px 10px',background:'transparent',border:'1px solid var(--border)',borderRadius:5,color:'var(--t2)',fontSize:11,cursor:'pointer'}}>
            🔄 Обновить
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-t">
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:'var(--red)',animation:'bp 2s infinite',display:'inline-block'}}></span>
            admin — Әкімші (192.168.0.10)
          </div>
          <span className="bdg bok">🔐 NS+AES</span>
        </div>

        <div className="ns-chat-wrap">
          <div className="ns-chat-msgs">
            {!messages.length&&(
              <div style={{textAlign:'center',color:'var(--t3)',fontSize:12,padding:28}}>
                Сообщений нет. Отправьте первое зашифрованное сообщение!
              </div>
            )}
            {messages.map((m)=>{
              const isMe=m.from==='operator';
              const age=(Date.now()-m.timestamp)/1000;
              const ttlLeft=Math.max(0,SESSION_TTL-age);
              const ttlExpired=ttlLeft<=0;
              const tc=ttlLeft>60?'ns-ttl-ok':ttlLeft>20?'ns-ttl-warn':'ns-ttl-dead';
              return (
                <div key={m.id} className={`ns-msg-row ${isMe?'me':'them'}`}>
                  <div className={`ns-bubble ${isMe?'me':'them'}`} onClick={()=>setOpenModal(m)}
                    title="Нажмите для расшифровки по NS-протоколу">
                    <div className="ns-cipher-preview">{m.cipher.substr(0,48)}…</div>
                    <div className="ns-lock-row">
                      <span>🔒</span>
                      <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'var(--gold2)'}}>
                        Нажмите для расшифровки NS-протоколом
                      </span>
                    </div>
                  </div>
                  <div className="ns-meta">
                    <span>{isMe?'operator':'admin'}</span>
                    <span>·</span><span>{m.time}</span><span>·</span>
                    <span className={`ns-ttl-pill ${tc}`}>{ttlExpired?'⏰ TTL истёк':`TTL ${Math.round(ttlLeft)}s`}</span>
                    <span>·</span>
                    <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:'var(--t3)'}}>Ks:{m.ticket?.Ks?.substr(0,6)}…</span>
                  </div>
                </div>
              );
            })}
            <div ref={endRef}/>
          </div>
          <div className="ns-inp-row">
            <input className="ns-chat-inp" placeholder="Сообщение будет зашифровано NS-протоколом..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} />
            <button className="ns-send-btn" onClick={sendMsg}>🔐 Жіберу</button>
          </div>
        </div>

        {chatLogs.length>0&&(
          <div className="ns-log-strip">
            {chatLogs.slice(0,6).map((l,i)=>(
              <div key={i} className="ns-log-item">
                <span className="ns-log-t">{l.t}</span>
                <span className={`ns-log-tag bdg ${l.cls}`}>{l.tag}</span>
                <span className="ns-log-m">{l.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Other pages ──────────────────────────────────────────────────────────────
function AuthWall({ onLogin }) {
  const [user,setUser]=useState(''); const [pass,setPass]=useState(''); const [err,setErr]=useState('');
  const tryLogin=()=>{
    if(user==='operator'&&pass==='op2025'){
      try{localStorage.setItem('qmg_user',user);localStorage.setItem('qmg_role','operator');}catch{}
      onLogin(user);
    } else setErr('Қате логин немесе пароль');
  };
  return (
    <div className="auth-wall">
      <div className="aw">
        <div style={{fontSize:48}}>🛡️</div>
        <h2>Оператор панелі</h2>
        <p>Демо: <strong style={{color:'#66bb6a'}}>operator / op2025</strong></p>
        <div className="aw-fields">
          <input className="aw-inp" placeholder="Логин" value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==='Enter'&&tryLogin()} />
          <input className="aw-inp" type="password" placeholder="Пароль" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&tryLogin()} />
        </div>
        {err&&<div className="aw-err">{err}</div>}
        <button className="aw-btn" onClick={tryLogin}>Кіру →</button>
      </div>
    </div>
  );
}

function LogItem({log}) {
  return (
    <div className="li">
      <span className="lt">{log.t}</span>
      <span style={{flexShrink:0,marginRight:5}}><span className={`bdg ${log.cls}`}>{log.tag}</span></span>
      <span className="lm">{log.msg}</span>
    </div>
  );
}

function Dashboard({logs,atkVisible,hideAtk,goPage}) {
  return (
    <div className="pg">
      <div className="pg-tag">Дашборд</div>
      <div className="pg-h1">Оператор дашборды</div>
      <div className="pg-sub">SCADA жүйесі мониторингі — нақты уақыт</div>
      {atkVisible&&(
        <div className="atk-ban show" style={{display:'flex'}}>
          <div style={{fontSize:22,flexShrink:0}}>💀</div>
          <div><div style={{fontSize:14,fontWeight:700,color:'var(--red)',marginBottom:3}}>⚠ КИБЕРШАБУЫЛ — NS БҰҒАТТАДЫ!</div>
          <div style={{fontSize:12,color:'rgba(229,57,53,.8)'}}>10.0.0.99 — параллель сессия. NS тойтарды.</div></div>
          <button onClick={hideAtk} style={{marginLeft:'auto',padding:'5px 12px',background:'transparent',border:'1px solid rgba(229,57,53,.4)',borderRadius:5,color:'var(--red)',fontSize:11,cursor:'pointer'}}>✕</button>
        </div>
      )}
      <div className="g4 mb">
        <div className="stat"><div className="stat-ic">🛢️</div><div className="stat-lb">Мұнай өндірісі</div><div className="stat-val">125.4</div><div className="stat-unit">мың т/тәу</div><div className="stat-tr tup">↑ +3.2%</div></div>
        <div className="stat"><div className="stat-ic">⚙️</div><div className="stat-lb">Белсенді RTU</div><div className="stat-val" style={{color:'var(--green2)'}}>178/180</div><div className="stat-unit">онлайн</div><div className="stat-tr tok-c">2 техн. қызмет</div></div>
        <div className="stat"><div className="stat-ic">🔐</div><div className="stat-lb">NS Қорғаныс</div><div className="stat-val" style={{color:'var(--green2)'}}>100%</div><div className="stat-unit">шифрланған</div><div className="stat-tr tup">↑ 0 шабуыл</div></div>
        <div className="stat"><div className="stat-ic">⚠️</div><div className="stat-lb">Ескертулер</div><div className="stat-val" style={{color:'var(--amber)'}}>{atkVisible?3:2}</div><div className="stat-unit">белсенді</div><div className="stat-tr tok-c">RTU-07, B-14</div></div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-t">📋 Соңғы оқиғалар</div>
          <div className="log-list">{logs.slice(0,8).map((l,i)=><LogItem key={i} log={l}/>)}</div>
        </div>
        <div className="card">
          <div className="card-t">⚡ Тез іс-әрекеттер</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <button onClick={()=>goPage('chat')} style={{padding:'11px 16px',background:'var(--green)',color:'#fff',border:'none',borderRadius:7,fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'left',fontFamily:'Golos Text,sans-serif'}}>🔐 NS-KDC чат</button>
            <button onClick={()=>goPage('scada')} style={{padding:'11px 16px',background:'rgba(21,101,192,.15)',color:'var(--blue3)',border:'1px solid rgba(21,101,192,.3)',borderRadius:7,fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'left',fontFamily:'Golos Text,sans-serif'}}>🏭 SCADA датчиктер</button>
            <button onClick={()=>goPage('pipes')} style={{padding:'11px 16px',background:'transparent',color:'var(--t2)',border:'1px solid var(--border)',borderRadius:7,fontSize:13,fontWeight:600,cursor:'pointer',textAlign:'left',fontFamily:'Golos Text,sans-serif'}}>🔩 Құбыр желілері</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScadaPage({sensors}) {
  const sst=s=>s.val>s.max?'err':s.val>s.max*.93?'warn':'ok';
  const scol=st=>({ok:'#43a047',warn:'#f57f17',err:'#e53935'}[st]);
  const sdisp=s=>s.unit==='МПа'?s.val.toFixed(1):Math.round(s.val);
  return (
    <div className="pg">
      <div className="pg-tag">SCADA</div>
      <div className="pg-h1">SCADA Мониторинг</div>
      <div className="pg-sub">Датчиктер — 3 секунд сайын жаңарту</div>
      <div className="g-sensor">
        {sensors.map((s,i)=>{
          const st=sst(s),col=scol(st);
          const pct=Math.min(100,Math.max(0,Math.round((s.val-s.min)/(s.max-s.min)*100)));
          const bg=`conic-gradient(${col} ${pct*1.8}deg,rgba(255,255,255,.07) ${pct*1.8}deg)`;
          const cls=`sc-st bdg ${st==='ok'?'bok':st==='warn'?'bwarn':'berr'}`;
          return (
            <div key={i} className={`sc${st==='err'?' alarm':''}`}>
              <div className="sc-title">{s.id} — {s.name}</div>
              <div className="ring" style={{background:bg}}>
                <div className="ring-in">
                  <div className="ring-num" style={{color:col}}>{sdisp(s)}</div>
                  <div className="ring-unit">{s.unit}</div>
                </div>
              </div>
              <div className="sc-loc">{s.loc}</div>
              <div className={cls}>{st==='ok'?'✓ Норма':st==='warn'?'⚠ Назар':'✗ АВАРИЯ'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipesPage() {
  const SB={ok:'bok',warn:'bwarn',err:'berr'};
  const SL={ok:'Норма',warn:'Ескерту',err:'Авария'};
  return (
    <div className="pg">
      <div className="pg-tag">Құбырлар</div>
      <div className="pg-h1">Тасымалдау желілері</div>
      <div className="pg-sub">Барлық технологиялық желілер</div>
      <div className="g2 mb">
        {PIPES_DATA.map((p,i)=>(
          <div key={i} className="pipe-card">
            <div className="pipe-hd">
              <div><div className="pipe-name">{p.name}</div><div className="pipe-loc">{p.loc}</div></div>
              <span className={`bdg ${SB[p.s]}`}>{SL[p.s]}</span>
            </div>
            <div className="pipe-bar"><div className={`pipe-fill ${p.c}`} style={{width:`${p.pct}%`}}></div></div>
            <div className="pipe-stats">
              <div className="pipe-stat"><strong>{p.flow}</strong>Ағын</div>
              <div className="pipe-stat"><strong>{p.len}</strong>Ұзындық</div>
              <div className="pipe-stat"><strong>{p.pct}%</strong>Жүктеме</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DevicesPage() {
  const SD={ok:'sdg',warn:'sda',err:'sdr'};
  const SB={ok:'bok',warn:'bwarn',err:'berr'};
  const SL={ok:'Онлайн',warn:'Ескерту',err:'Қауіп'};
  return (
    <div className="pg">
      <div className="pg-tag">IP Құрылғылар</div>
      <div className="pg-h1">Желі құрылғылары</div>
      <div className="pg-sub">SCADA желісіндегі RTU, PLC, серверлер</div>
      <div className="ip-grid mb">
        {DEVS_DATA.map((d,i)=>(
          <div key={i} className="ip-card">
            <div className="ip-name">
              <span className={`sdot ${SD[d.s]}`} style={{marginRight:5}}></span>
              {d.name}<span className={`bdg ${SB[d.s]}`} style={{marginLeft:6,float:'right'}}>{SL[d.s]}</span>
            </div>
            <div className="ip-addr">{d.ip}</div>
            <div className="ip-info">Тип: {d.type}<br/>Протокол: <span style={{color:'var(--blue3)'}}>{d.proto}</span><br/><span style={{fontFamily:'monospace',fontSize:9,color:'var(--t3)'}}>MAC: {d.mac}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogsPage({logs}) {
  return (
    <div className="pg">
      <div className="pg-tag">Журнал</div>
      <div className="pg-h1">Оқиғалар журналы</div>
      <div className="pg-sub">Барлық жүйелік оқиғалар</div>
      <div className="card">
        <div className="card-t">📋 Оқиғалар</div>
        <div className="log-list">{logs.slice(0,60).map((l,i)=><LogItem key={i} log={l}/>)}</div>
      </div>
    </div>
  );
}

// ─── Main Operator App ────────────────────────────────────────────────────────
export default function Operator() {
  const [authed, setAuthed] = useState(null);
  const [username, setUsername] = useState('operator');
  const [page, setPage] = useState('dashboard');
  const [sbOpen, setSbOpen] = useState(true);
  const [clock, setClock] = useState(ts());
  const [logs, setLogs] = useState([]);
  const [sensors, setSensors] = useState(INIT_SENSORS.map(s=>({...s})));
  const [atkVisible, setAtkVisible] = useState(false);
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState({msg:'',type:'tok',show:false});
  const navigate = useNavigate();

  useEffect(()=>{
    if(!document.getElementById('qmg-styles')){
      const style=document.createElement('style');
      style.id='qmg-styles'; style.textContent=GLOBAL_CSS;
      document.head.appendChild(style);
    }
    try {
      const r=localStorage.getItem('qmg_role');
      const u=localStorage.getItem('qmg_user');
      if(r==='operator'&&u){ setUsername(u); setAuthed(true); }
      else setAuthed(false);
    } catch { setAuthed(false); }
  },[]);

  useEffect(()=>{ const t=setInterval(()=>setClock(ts()),1000); return ()=>clearInterval(t); },[]);

  const showToast=useCallback((msg,type='tok')=>{
    setToast({msg,type,show:true});
    setTimeout(()=>setToast(p=>({...p,show:false})),3200);
  },[]);

  const addLog=useCallback((type,tag,msg)=>{
    const cls={ok:'bok',err:'berr',warn:'bwarn',info:'binfo'}[type]||'binfo';
    setLogs(prev=>[{t:ts(),cls,tag,msg},...prev].slice(0,60));
  },[]);

  useEffect(()=>{
    if(!authed) return;
    setLogs([
      {t:ts(),cls:'bok',tag:'[КІРУ]',msg:`${username} — NS сессия инициирована · KDC онлайн`},
      {t:ts(),cls:'binfo',tag:'[NS]',msg:'Needham–Schroeder активен — сообщения шифруются'},
      {t:ts(),cls:'bwarn',tag:'[RTU-07]',msg:'B-14 секция — қысым нормадан жоғары: 92 bar'},
      {t:ts(),cls:'binfo',tag:'[KDC]',msg:'Сессионный ключ Ks сгенерирован · TTL=90s'},
    ]);
    const t1=setTimeout(()=>{ addLog('warn','[RTU-07]','Қысым критикалық'); showToast('⚠ RTU-07 авария!','twarn'); },10000);
    const t2=setTimeout(()=>{ addLog('err','[ШАБУЫЛ]','10.0.0.99 бұғатталды'); showToast('💀 Шабуыл бұғатталды!','terr'); setAtkVisible(true); },22000);
    const t3=setTimeout(()=>{ addLog('ok','[NS]','KDC кілт жаңартты'); setAtkVisible(false); },38000);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  },[authed]);

  // Sensor updates
  useEffect(()=>{
    if(!authed) return;
    const t=setInterval(()=>{
      setSensors(prev=>prev.map(s=>{
        let val=parseFloat((s.val+(Math.random()-.5)*2*s.dr).toFixed(s.unit==='МПа'?1:0));
        val=Math.max(s.base*.8,Math.min(s.base*1.2,val));
        return {...s,val};
      }));
    },3000);
    return ()=>clearInterval(t);
  },[authed]);

  // Listen for admin messages
  useEffect(()=>{
    if(!authed) return;
    let bc;
    try {
      bc=new BroadcastChannel('qmg_chat_ns');
      bc.onmessage=(e)=>{
        if(e.data?.type==='new_msg'&&e.data.msg.from!=='operator'){
          if(page!=='chat') setUnread(p=>p+1);
          showToast('💬 Зашифрованное сообщение от администратора!','tok');
        }
      };
    } catch {}
    return ()=>{ try{bc?.close();}catch{} };
  },[authed,page,showToast]);

  const goPage=(p)=>{ setPage(p); if(p==='chat') setUnread(0); };
  const doLogout=()=>{
    try{localStorage.removeItem('qmg_user');localStorage.removeItem('qmg_role');}catch{}
    navigate('/');
  };

  useEffect(()=>{ if(authed===false) navigate('/'); },[authed,navigate]);
  if(authed===null) return null;
  if(authed===false) return null;

  const NAV=[
    {id:'dashboard',icon:'📊',label:'Дашборд'},
    {id:'scada',icon:'🏭',label:'SCADA Мониторинг'},
    {id:'pipes',icon:'🔩',label:'Құбыр желілері'},
    {id:'chat',icon:'🔐',label:'NS-KDC Чат',badge:unread},
    {id:'devices',icon:'📡',label:'IP Құрылғылар'},
    {id:'logs',icon:'📋',label:'Журнал'},
  ];

  return (
    <div className="qmg-root">
      <div className="topbar">
        <div className="tb-l">
          <button className={`brgr${sbOpen?'':' open'}`} onClick={()=>setSbOpen(p=>!p)}>
            <span/><span/><span/>
          </button>
          <div className="tlogo" onClick={doLogout}>
            <div className="tlogo-ic">⛽</div>
            <div><div className="tlogo-n">QazMunaiGaz Pro</div><div className="tlogo-s">Оператор панелі</div></div>
          </div>
          <div className="rpill">🛡️ Оператор · L2</div>
        </div>
        <div className="tb-r">
          <div className="ns-ind"><span className="nd"></span>NS+KDC</div>
          <div className="tclock">{clock}</div>
          <div className="tusr">
            <div className="tav">{username[0]?.toUpperCase()}</div>
            <div><div className="tun">{username}</div><div className="tip">192.168.0.22</div></div>
          </div>
          <button className="tout" onClick={doLogout}>Шығу ↩</button>
        </div>
      </div>

      <div className="body-wrap">
        <div className={`sidebar${sbOpen?'':' collapsed'}`}>
          <div className="sb-sec">Негізгі</div>
          {NAV.map(n=>(
            <button key={n.id} className={`sbi${page===n.id?' active':''}`} onClick={()=>goPage(n.id)}>
              <span className="sbi-ic">{n.icon}</span>{n.label}
              {n.badge>0&&<span className="sbi-badge">{n.badge}</span>}
            </button>
          ))}
          <div className="sb-div"/>
        </div>

        <div className="content">
          {page==='dashboard'&&<Dashboard logs={logs} atkVisible={atkVisible} hideAtk={()=>setAtkVisible(false)} goPage={goPage}/>}
          {page==='scada'&&<ScadaPage sensors={sensors}/>}
          {page==='pipes'&&<PipesPage/>}
          {page==='chat'&&<ChatPage addLog={addLog} showToast={showToast}/>}
          {page==='devices'&&<DevicesPage/>}
          {page==='logs'&&<LogsPage logs={logs}/>}
        </div>
      </div>

      <div className={`toast ${toast.type}${toast.show?' show':''}`}>{toast.msg}</div>
    </div>
  );
}