import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";


async function sendCodeByEmail(email, code) {
  const res = await fetch('https://qmg-backend.onrender.com/send-code', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  return await res.json();
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const INDEX_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Golos+Text:wght@400;500;600;700&display=swap');

:root {
  --navy:#0a1628; --navy2:#0f2040; --blue:#1565C0; --blue2:#1976D2;
  --gold:#C8960C; --gold2:#F5B800; --gold3:rgba(200,150,12,.12);
  --red:#b71c1c; --green:#1b5e20;
  --text:#1a1a2e; --text2:#4a5568; --text3:#718096;
  --bg:#f8f6f0; --bg2:#ffffff; --border:rgba(0,0,0,.08);
  --shadow:0 4px 24px rgba(0,0,0,.1);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Golos Text', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

/* NAVBAR */
.navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: var(--navy); border-bottom: 2px solid var(--gold); }
.nb-top { display: flex; align-items: center; justify-content: space-between; padding: 10px 32px; border-bottom: 1px solid rgba(255,255,255,.08); gap: 12px; }
.nb-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; cursor: pointer; flex-shrink: 0; }
.nb-logo-icon { width: 46px; height: 46px; background: var(--gold); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.nb-logo-name { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; color: #fff; line-height: 1.1; }
.nb-logo-sub { font-size: 10px; color: rgba(255,255,255,.45); letter-spacing: .1em; text-transform: uppercase; }
.nb-search { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); border-radius: 6px; padding: 7px 14px; flex: 1; max-width: 280px; margin: 0 12px; position: relative; }
.nb-search input { background: none; border: none; outline: none; color: #fff; font-size: 13px; font-family: 'Golos Text', sans-serif; width: 100%; }
.nb-search input::placeholder { color: rgba(255,255,255,.35); }
.sr { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #fff; border-radius: 8px; box-shadow: var(--shadow); z-index: 20; overflow: hidden; }
.sr-item { padding: 10px 14px; font-size: 13px; cursor: pointer; border-bottom: 1px solid var(--border); color: var(--text); transition: background .15s; }
.sr-item:hover { background: var(--bg); }
.sr-item small { color: var(--text3); font-size: 11px; display: block; margin-top: 2px; }
.nb-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.lang-toggle { display: flex; gap: 2px; background: rgba(255,255,255,.08); border-radius: 5px; padding: 3px; }
.lb { padding: 4px 10px; border-radius: 3px; font-size: 11px; font-weight: 600; cursor: pointer; color: rgba(255,255,255,.5); transition: all .15s; border: none; background: none; font-family: 'Golos Text', sans-serif; letter-spacing: .04em; }
.lb.active { background: var(--gold); color: #000; }
.burger { background: none; border: none; cursor: pointer; padding: 6px; display: flex; flex-direction: column; gap: 5px; }
.burger span { display: block; width: 24px; height: 2px; background: #fff; transition: all .3s; border-radius: 2px; }
.burger.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
.burger.open span:nth-child(2) { opacity: 0; }
.burger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }
.nb-bottom { display: flex; padding: 0 32px; overflow-x: auto; scrollbar-width: none; }
.nb-bottom::-webkit-scrollbar { display: none; }
.nbl { padding: 11px 14px; font-size: 12px; color: rgba(255,255,255,.65); cursor: pointer; white-space: nowrap; transition: all .15s; border-bottom: 2px solid transparent; font-weight: 500; text-decoration: none; display: block; border-top: none; border-left: none; border-right: none; background: none; font-family: 'Golos Text', sans-serif; }
.nbl:hover, .nbl.active { color: var(--gold); border-bottom-color: var(--gold); }
.nb-login-btn { padding: 7px 16px; background: var(--gold); color: #000; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Golos Text', sans-serif; white-space: nowrap; transition: background .2s; flex-shrink: 0; }
.nb-login-btn:hover { background: var(--gold2); }

/* MOBILE MENU */
.mm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 1999; }
.mm { position: fixed; top: 0; right: 0; width: 270px; height: 100vh; background: var(--navy2); z-index: 2000; padding: 20px; border-left: 2px solid var(--gold); display: flex; flex-direction: column; }
.mm-close { background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; align-self: flex-end; margin-bottom: 18px; }
.mm-item { padding: 13px 12px; color: rgba(255,255,255,.8); font-size: 14px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,.07); transition: color .15s; }
.mm-item:hover { color: var(--gold); }

/* HERO */
.hero-wrap { margin-top: 99px; position: relative; height: 580px; overflow: hidden; }
.slide { position: absolute; inset: 0; opacity: 0; transition: opacity .9s ease; background-size: cover; background-position: center; }
.slide.active { opacity: 1; }
.slide-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(10,22,40,.6) 40%, rgba(10,22,40,.1)); }
.slide-content { position: absolute; left: 64px; bottom: 60px; max-width: 520px; z-index: 2; }
.slide-tag { display: inline-block; padding: 4px 14px; background: var(--gold); color: #000; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; border-radius: 2px; margin-bottom: 14px; }
.slide-title { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 12px; }
.slide-desc { font-size: 14px; color: rgba(255,255,255,.72); line-height: 1.7; margin-bottom: 22px; }
.slide-btn { padding: 12px 26px; background: var(--gold); color: #000; border: none; border-radius: 4px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .2s; font-family: 'Golos Text', sans-serif; display: inline-block; }
.slide-btn:hover { background: var(--gold2); }
.hero-dots { position: absolute; bottom: 20px; right: 32px; display: flex; gap: 8px; z-index: 3; }
.hdot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.3); cursor: pointer; transition: all .3s; border: none; }
.hdot.active { background: var(--gold); width: 24px; border-radius: 4px; }
.harr { position: absolute; top: 50%; transform: translateY(-50%); z-index: 3; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.22); color: #fff; width: 42px; height: 42px; border-radius: 50%; font-size: 18px; cursor: pointer; transition: background .2s; display: flex; align-items: center; justify-content: center; }
.harr:hover { background: rgba(255,255,255,.24); }
.harr-l { left: 18px; } .harr-r { right: 18px; }

/* DIVIDER */
.divider { height: 4px; background: linear-gradient(90deg, var(--gold), var(--blue2), var(--gold)); }

/* SECTIONS */
.sec { padding: 68px 64px; }
.sec.alt { background: var(--bg2); }
.sec.dark { background: var(--navy); color: #fff; }
.sec.gold-bg { background: linear-gradient(135deg, #12100a, #241d00); color: #fff; }
.sec-tag { display: inline-block; padding: 4px 12px; background: var(--gold3); border: 1px solid var(--gold); color: var(--gold); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; border-radius: 3px; margin-bottom: 12px; }
.sec-tag.w { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.2); color: rgba(255,255,255,.65); }
.sec-h2 { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; line-height: 1.2; margin-bottom: 10px; }
.sec-p { font-size: 14px; color: var(--text2); line-height: 1.7; max-width: 540px; margin-bottom: 36px; }
.sec-p.w { color: rgba(255,255,255,.6); }

/* NEWS */
.news-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 22px; }
.nc { background: var(--bg2); border-radius: 10px; overflow: hidden; box-shadow: var(--shadow); border: 1px solid var(--border); cursor: pointer; transition: transform .2s, box-shadow .2s; }
.nc:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.15); }
.nc.feat { grid-column: span 2; display: flex; }
.nc.feat .nc-img { width: 44%; flex-shrink: 0; height: auto; }
.nc-img { height: 200px; background-size: cover; background-position: center; position: relative; }
.nc-badge { position: absolute; top: 12px; left: 12px; padding: 3px 10px; border-radius: 3px; font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.nb-red { background: #b71c1c; color: #fff; } .nb-blue { background: #1565C0; color: #fff; }
.nb-gold { background: var(--gold); color: #000; } .nb-green { background: #1b5e20; color: #fff; }
.nc-body { padding: 20px; flex: 1; }
.nc-date { font-size: 11px; color: var(--text3); margin-bottom: 8px; }
.nc-title { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; line-height: 1.4; margin-bottom: 8px; }
.nc-desc { font-size: 13px; color: var(--text2); line-height: 1.6; }

/* EMPLOYEES */
.emp-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 22px; }
.emp-card { background: var(--bg2); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow); border: 1px solid var(--border); transition: transform .2s; text-align: center; }
.emp-card:hover { transform: translateY(-4px); }
.emp-photo { width: 180px; height: 180px; margin: 0 auto; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--navy), var(--blue2)); font-size: 60px; position: relative; }
.emp-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
.emp-card:hover .emp-photo img { transform: scale(1.1); }
.emp-body { padding: 16px; }
.emp-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; margin-bottom: 4px; line-height: 1.3; }
.emp-role { font-size: 11px; color: var(--text3); margin-bottom: 8px; line-height: 1.4; }
.emp-badge { display: inline-block; padding: 3px 9px; background: var(--gold3); border: 1px solid var(--gold); border-radius: 12px; font-size: 10px; font-weight: 700; color: var(--gold); letter-spacing: .03em; }
.emp-stars { color: var(--gold); font-size: 13px; margin-top: 5px; }
.page-nav { display: flex; justify-content: center; gap: 8px; margin-top: 28px; }
.pn-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--border); border: 2px solid var(--border); cursor: pointer; transition: all .2s; }
.pn-dot.active { background: var(--gold); border-color: var(--gold); }

/* PRODUCTION */
.yr-tabs { display: flex; gap: 6px; margin-bottom: 32px; }
.yr-tab { padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 700; cursor: pointer; border: 2px solid var(--border); background: transparent; transition: all .2s; font-family: 'Golos Text', sans-serif; color: var(--text2); }
.yr-tab.active { background: var(--navy); color: #fff; border-color: var(--navy); }
.st-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; margin-bottom: 28px; }
.st-card { background: var(--bg2); border-radius: 10px; padding: 22px; border: 1px solid var(--border); box-shadow: var(--shadow); }
.st-icon { font-size: 30px; margin-bottom: 10px; }
.st-lbl { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 5px; }
.st-val { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: var(--navy); line-height: 1; }
.st-unit { font-size: 13px; color: var(--text2); margin-top: 3px; }
.st-trend { font-size: 12px; margin-top: 7px; }
.tr-up { color: #2e7d32; } .tr-dn { color: #b71c1c; }
.chart-wrap { background: var(--bg2); border-radius: 10px; padding: 24px; border: 1px solid var(--border); }
.chart-t { font-size: 14px; font-weight: 700; margin-bottom: 18px; }
.bar-chart { display: flex; align-items: flex-end; gap: 14px; height: 130px; }
.bg-col { display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; }
.bgs { display: flex; align-items: flex-end; gap: 3px; flex: 1; width: 100%; justify-content: center; }
.bar { width: 26px; border-radius: 4px 4px 0 0; transition: height .6s cubic-bezier(.34,1.56,.64,1); }
.b-navy { background: var(--navy); } .b-gold { background: var(--gold); } .b-blue { background: var(--blue2); }
.bg-lbl { font-size: 10px; color: var(--text3); text-align: center; }

/* FACTS */
.facts-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.fact-card { padding: 26px; border-radius: 10px; border: 1px solid rgba(255,255,255,.09); background: rgba(255,255,255,.04); transition: border-color .2s, background .2s; }
.fact-card:hover { border-color: var(--gold); background: rgba(200,150,12,.07); }
.fact-icon { font-size: 34px; margin-bottom: 12px; }
.fact-num { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; color: var(--gold); line-height: 1; margin-bottom: 6px; }
.fact-lbl { font-size: 13px; color: rgba(255,255,255,.65); line-height: 1.5; }

/* PROJECTS */
.proj-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }
.proj-card { border-radius: 10px; overflow: hidden; position: relative; height: 295px; cursor: pointer; box-shadow: var(--shadow); }
.proj-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform .4s ease; }
.proj-card:hover .proj-bg { transform: scale(1.06); }
.proj-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,22,40,.95) 40%, rgba(10,22,40,.2)); }
.proj-cnt { position: absolute; bottom: 0; left: 0; right: 0; padding: 22px; }
.proj-tag { display: inline-block; padding: 3px 10px; background: var(--gold); font-size: 10px; font-weight: 700; letter-spacing: .07em; color: #000; border-radius: 2px; margin-bottom: 10px; text-transform: uppercase; }
.proj-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 5px; }
.proj-desc { font-size: 11px; color: rgba(255,255,255,.6); line-height: 1.5; }
.prog { margin-top: 10px; }
.prog-bar { height: 3px; background: rgba(255,255,255,.18); border-radius: 2px; }
.prog-fill { height: 100%; background: var(--gold); border-radius: 2px; }
.prog-lbl { font-size: 10px; color: var(--gold); margin-top: 3px; }

/* INVESTORS */
.inv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.inv-card { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.11); border-radius: 12px; padding: 26px; }
.inv-card h3 { font-family: 'Playfair Display', serif; font-size: 19px; margin-bottom: 14px; color: var(--gold2); }
.inv-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,.05); font-size: 13px; }
.inv-row:last-of-type { border-bottom: none; }
.inv-k { color: rgba(255,255,255,.55); } .inv-v { color: #fff; font-weight: 600; }
.inv-v.gv { color: var(--gold2); } .inv-v.gr { color: #66bb6a; } .inv-v.rv { color: #ef5350; }
.inv-bars { display: flex; gap: 10px; align-items: flex-end; height: 110px; margin-top: 14px; }
.ibar { flex: 1; border-radius: 4px 4px 0 0; background: var(--gold); opacity: .65; transition: opacity .2s; }
.ibar:hover { opacity: 1; }
.inv-btn { display: block; text-align: center; margin-top: 14px; padding: 10px; background: var(--gold); color: #000; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s; border: none; font-family: 'Golos Text', sans-serif; width: 100%; }
.inv-btn:hover { background: var(--gold2); }

/* CONTACTS */
.ct-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; margin-bottom: 36px; }
.ct-card { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09); border-radius: 10px; padding: 22px; text-align: center; transition: border-color .2s, background .2s; }
.ct-card:hover { border-color: var(--gold); background: rgba(200,150,12,.07); }
.ct-icon { font-size: 30px; margin-bottom: 10px; }
.ct-title { font-size: 11px; color: rgba(255,255,255,.45); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 7px; }
.ct-val { font-size: 13px; color: #fff; font-weight: 600; line-height: 1.6; }
.ct-val a { color: var(--gold2); text-decoration: none; }
.ct-val a:hover { text-decoration: underline; }

/* FOOTER */
footer { background: #050e1a; color: rgba(255,255,255,.35); padding: 18px 64px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; border-top: 1px solid rgba(255,255,255,.05); flex-wrap: wrap; gap: 8px; }
footer a { color: var(--gold); text-decoration: none; }

/* SCROLL TOP */
.sct { position: fixed; bottom: 24px; right: 24px; z-index: 500; width: 42px; height: 42px; background: var(--gold); border: none; border-radius: 50%; color: #000; font-size: 18px; cursor: pointer; box-shadow: var(--shadow); display: flex; align-items: center; justify-content: center; opacity: 0; transform: translateY(16px); transition: all .3s; pointer-events: none; }
.sct.show { opacity: 1; transform: none; pointer-events: auto; }

/* LOGIN MODAL */
.lm-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,.7); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); animation: lmFadeIn .2s ease; }
@keyframes lmFadeIn { from{opacity:0} to{opacity:1} }
.lm-box { background: var(--navy2); border: 1px solid var(--gold); border-radius: 14px; padding: 36px; width: 100%; max-width: 420px; position: relative; animation: lmSlideUp .25s ease; }
@keyframes lmSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
.lm-close { position: absolute; top: 14px; right: 16px; background: none; border: none; color: rgba(255,255,255,.5); font-size: 20px; cursor: pointer; transition: color .2s; }
.lm-close:hover { color: #fff; }
.lm-head { text-align: center; margin-bottom: 24px; }
.lm-lbl { font-size: 11px; color: rgba(255,255,255,.45); letter-spacing: .08em; text-transform: uppercase; display: block; margin-bottom: 6px; }
.lm-inp { width: 100%; padding: 11px 14px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.15); border-radius: 7px; color: #fff; font-size: 14px; font-family: 'Golos Text', sans-serif; outline: none; transition: border-color .2s; margin-bottom: 14px; }
.lm-inp:focus { border-color: rgba(200,150,12,.5); }
.lm-inp::placeholder { color: rgba(255,255,255,.3); }
.lm-inp-code { font-size: 20px; font-family: monospace; text-align: center; letter-spacing: .3em; margin-bottom: 0; }
.lm-err { color: #ef5350; font-size: 13px; margin-bottom: 12px; padding: 8px 12px; background: rgba(183,28,28,.12); border-radius: 6px; border: 1px solid rgba(183,28,28,.3); }
.lm-einfo { font-size: 13px; color: rgba(255,255,255,.7); margin-bottom: 16px; padding: 10px 14px; background: rgba(255,255,255,.05); border-radius: 7px; border: 1px solid rgba(255,255,255,.1); line-height: 1.6; }
.lm-btn { width: 100%; padding: 13px; background: var(--gold); color: #000; border: none; border-radius: 7px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Golos Text', sans-serif; transition: background .2s; }
.lm-btn:hover { background: var(--gold2); }
.lm-btn-back { flex: 1; padding: 12px; background: rgba(255,255,255,.07); color: rgba(255,255,255,.7); border: 1px solid rgba(255,255,255,.15); border-radius: 7px; font-size: 13px; cursor: pointer; font-family: 'Golos Text', sans-serif; transition: all .2s; }
.lm-btn-back:hover { background: rgba(255,255,255,.12); }
.lm-btn-confirm { flex: 2; padding: 12px; background: var(--gold); color: #000; border: none; border-radius: 7px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Golos Text', sans-serif; transition: background .2s; }
.lm-btn-confirm:hover { background: var(--gold2); }
.lm-ns-step { padding: 7px 12px; background: rgba(200,150,12,.08); border: 1px solid rgba(200,150,12,.3); border-radius: 5px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #F5B800; margin-bottom: 7px; }
.lm-progress { height: 6px; background: rgba(255,255,255,.1); border-radius: 4px; overflow: hidden; margin-bottom: 12px; }
.lm-progress-bar { height: 100%; background: var(--gold); border-radius: 4px; transition: width .35s ease; }

@media(max-width:1050px) {
  .news-grid,.proj-grid,.emp-grid,.st-grid,.ct-grid { grid-template-columns: 1fr 1fr; }
  .facts-grid { grid-template-columns: 1fr 1fr; }
  .nc.feat { grid-column: span 2; flex-direction: column; }
  .nc.feat .nc-img { width: 100%; height: 200px; }
  .inv-grid { grid-template-columns: 1fr; }
}
@media(max-width:650px) {
  .sec { padding: 44px 18px; }
  .nb-top { padding: 10px 14px; } .nb-bottom { padding: 0 14px; }
  .nb-search { display: none; }
  .slide-content { left: 20px; bottom: 36px; }
  .slide-title { font-size: 26px; }
  .hero-wrap { height: 380px; }
  .emp-grid,.st-grid,.news-grid,.proj-grid,.ct-grid { grid-template-columns: 1fr; }
  .facts-grid { grid-template-columns: 1fr; }
  .nc.feat { grid-column: span 1; }
}
`;

// ─── Static Data ──────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  kk: {
    sub: 'Мұнай-газ компаниясы · Астана',
    nl: ['Басты бет','Жаңалықтар','Қызметкерлер','Өнімділік','Қызықты фактілер','Жобалар','Инвесторларға','Байланыс'],
    empH: 'Үздік қызметкерлер', empD: 'Компанияның жетістіктерін қамтамасыз ететін тәжірибелі мамандар.',
    newsTag: 'Жаңалықтар', newsH: 'Соңғы жаңалықтар мен оқиғалар', newsD: 'Компанияның маңызды оқиғалары, жобалар мен салалық жаңалықтар.',
    chartT: 'Тоқсандар бойынша өндіріс (мың тонна)', ct1: 'Тәуліктік байланыс', srph: 'Іздеу...',
    badge: ['Үздік қызметкер','Жылдың маманы','Топ менеджер','Инновация жеңімпазы'],
  },
  ru: {
    sub: 'Нефтегазовая компания · Астана',
    nl: ['Главная','Новости','Сотрудники','Производство','Интересные факты','Проекты','Инвесторам','Контакты'],
    empH: 'Лучшие сотрудники', empD: 'Опытные специалисты, обеспечивающие успех компании.',
    newsTag: 'Новости', newsH: 'Последние новости и события', newsD: 'Важные события компании, проекты и отраслевые новости.',
    chartT: 'Производство по кварталам (тыс. тонн)', ct1: 'Горячая линия 24/7', srph: 'Поиск...',
    badge: ['Лучший сотрудник','Специалист года','Топ менеджмент','Победитель инноваций'],
  },
};

const SLIDES = [
  { tag:'Мұнай өндірісі', title:'Қазақстанның мұнай-газ\nсаласының көшбасшысы', desc:'Заманауи технологиялар мен жоғары қауіпсіздік стандарттары негізінде Қазақстанның энергетикалық болашағын қалыптастырамыз.', btn:'Жобалар →', href:'#projects', img:'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1400&q=80' },
  { tag:'Ақпараттық қауіпсіздік', title:'SCADA жүйелерін\nNS протоколымен қорғау', desc:'Needham–Schroeder протоколы арқылы өнеркәсіптік басқару жүйелерін кибершабуылдардан қорғаймыз.', btn:'Толығырақ →', href:'#projects', img:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1400&q=80' },
  { tag:'Жаңартылатын энергия', title:'Таза болашаққа\nинвестиция', desc:'2030 жылға дейін жаңартылатын энергия көздеріне 2.4 млрд доллар инвестиция салу жоспарланған.', btn:'Инвесторларға →', href:'#investors', img:'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1400&q=80' },
  { tag:'Команда', title:'12,000+ маман\nбір мақсат үшін', desc:'Біздің командамыз — Қазақстанның ең тәжірибелі мұнай-газ мамандары.', btn:'Команда →', href:'#employees', img:'https://images.unsplash.com/photo-1581093806997-124204d9fa9d?w=1400&q=80' },
];

const EMPS_DATA = [
  {name:'Сейткали Арман Болатович',role:'Бас директор',img:'img/emp1.jpg',badge:0,stars:5},
  {name:'Нұрланова Гүлнар Қайратқызы',role:'SCADA қауіпсіздік бөлімі басшысы',img:'img/emp2.jpg',badge:1,stars:5},
  {name:'Ержанов Дәурен Мұхтарұлы',role:'Бас инженер',img:'img/emp3.jpg',badge:2,stars:5},
  {name:'Сарсенова Айгерім Берікқызы',role:'Киберқауіпсіздік маманы',img:'img/emp4.jpg',badge:1,stars:5},
  {name:'Қасымов Тимур Асқарұлы',role:'Геолог, PhD',img:'img/emp5.jpg',badge:3,stars:4},
  {name:'Бекова Мадина Серікқызы',role:'Қаржы директоры',img:'img/emp6.jpg',badge:2,stars:5},
  {name:'Иванченко Роман Владимирович',role:'IT Архитектор',img:'img/emp7.jpg',badge:3,stars:4},
  {name:'Абдрахманова Салтанат Ержанқызы',role:'HR директоры',img:'img/emp8.jpg',badge:0,stars:4},
];

const YDATA = {
  '2024': { items:[{ic:'🛢️',lb:'Мұнай өндірісі',val:'43.2',unit:'млн тонна',tr:'+5.4%',up:true},{ic:'💨',lb:'Газ',val:'18.7',unit:'млрд м³',tr:'+3.2%',up:true},{ic:'💰',lb:'Кіріс',val:'2.4',unit:'трлн ₸',tr:'+12%',up:true},{ic:'🌱',lb:'CO₂ азайту',val:'8.2',unit:'млн тонна',tr:'-6%',up:false}], bars:[[85,92,78,95],[60,75,80,70],[40,55,60,65]] },
  '2025': { items:[{ic:'🛢️',lb:'Мұнай өндірісі',val:'45.8',unit:'млн тонна',tr:'+6.0%',up:true},{ic:'💨',lb:'Газ',val:'19.4',unit:'млрд м³',tr:'+3.7%',up:true},{ic:'💰',lb:'Кіріс',val:'2.84',unit:'трлн ₸',tr:'+18%',up:true},{ic:'🌱',lb:'CO₂ азайту',val:'10.1',unit:'млн тонна',tr:'-12%',up:false}], bars:[[90,95,88,100],[65,80,85,78],[55,65,70,75]] },
  '2026': { items:[{ic:'🛢️',lb:'Мұнай өндірісі',val:'48.5',unit:'млн тонна',tr:'+6.0% ж.',up:true},{ic:'💨',lb:'Газ',val:'21.0',unit:'млрд м³',tr:'+8.2% ж.',up:true},{ic:'💰',lb:'Кіріс',val:'3.2',unit:'трлн ₸',tr:'+12% ж.',up:true},{ic:'🌱',lb:'CO₂ азайту',val:'14.0',unit:'млн тонна',tr:'-19% ж.',up:false}], bars:[[95,100,95,105],[70,85,90,88],[65,75,80,85]] },
};

const SEARCH_DATA = [
  {t:'Жаңалықтар / Новости',s:'news',d:'Соңғы оқиғалар'},
  {t:'SCADA қауіпсіздік',s:'projects',d:'NS протоколы жобасы'},
  {t:'Қызметкерлер / Сотрудники',s:'employees',d:'Үздік мамандар'},
  {t:'Өнімділік / Производство',s:'production',d:'Өндіріс деректері'},
  {t:'Жобалар / Проекты',s:'projects',d:'Стратегиялық жобалар'},
  {t:'Инвесторлар / Инвесторы',s:'investors',d:'Қаржылық деректер'},
  {t:'Байланыс / Контакты',s:'contacts',d:'Телефондар, пошта'},
  {t:'Авариялық қызмет',s:'contacts',d:'+7 (7172) 55-00-01'},
  {t:'Киберқауіпсіздік',s:'contacts',d:'soc@qmg.kz'},
  {t:'Қызықты фактілер / Факты',s:'facts',d:'45М+ тонна, 12K+ маман'},
];

const USERS = {
  admin: {
    pass: 'qmg2025',
    role: 'admin',
    email: 'seraiko4@gmail.com'
  },

  operator: {
    pass: 'op2025',
    role: 'operator',
    email: 'seraiko4@gmail.com'
  }
};
const NS_STEPS = ['A → KDC: {user, B, Na}Kkdc','KDC → A: {Ks, B, Na, {Ks,A}Kb}Ka','A → B: {Ks, A}Kb','B → A: {Nb}Ks','A → B: {Nb-1}Ks ✓ — Кіру рұқсат'];

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({behavior:'smooth'});

// ─── Login Modal ──────────────────────────────────────────────────────────────
function LoginModal({ onClose }) {
  const [step, setStep]     = useState(1);
  const [user, setUser]     = useState('');
  const [pass, setPass]     = useState('');
  const [code, setCode]     = useState('');
  const [err1, setErr1]     = useState('');
  const [err2, setErr2]     = useState('');
  const [einfo, setEinfo]   = useState('');
  const [nsSteps, setNsSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [pendingRole, setPendingRole] = useState('');
  const [pendingUser, setPendingUser] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const codeRef = useRef(null);

  useEffect(() => { if (step === 2) setTimeout(() => codeRef.current?.focus(), 80); }, [step]);

  const go1 = async () => {
    setErr1('');
    const u = USERS[user.trim().toLowerCase()];
    if (!u || u.pass !== pass) { setErr1('❌ Логин немесе пароль қате'); return; }
    setPendingRole(u.role); setPendingUser(user.trim().toLowerCase());
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(newCode);
    setCode(''); setErr2(''); setSending(true);
    setEinfo('📧 Код жіберілуде...');
    setStep(2);
    try {
      await sendCodeByEmail(u.email, newCode);
      setEinfo(`✅ Код жіберілді: ${u.email}
Spam папкасын тексеріңіз.`);
    } catch(e) {
      console.warn('EmailJS error:', e);
      setEinfo(`⚠️ Email жіберілмеді.\n🔑 Демо режим — код: ${newCode}`);
    } finally {
      setSending(false);
    }
  };

  const go2 = () => {
    setErr2('');
    if (code.trim() !== generatedCode) { setErr2('true'); return; }
    try { localStorage.setItem('qmg_user', pendingUser); localStorage.setItem('qmg_role', pendingRole); } catch {}
    setStep(3); setNsSteps([]); setProgress(0);
    let i = 0;
    const tick = () => {
      setNsSteps(prev => [...prev, '✓ ' + NS_STEPS[i]]);
      setProgress(Math.round(((i+1)/NS_STEPS.length)*100));
      i++;
      if (i < NS_STEPS.length) setTimeout(tick, 400);
      else setTimeout(() => {
        onClose();
        navigate(pendingRole === 'admin' ? '/admin' : '/operator');
      }, 600);
    };
    setTimeout(tick, 100);
  };

  return (
    <div className="lm-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="lm-box">
        <button className="lm-close" onClick={onClose}>✕</button>
        <div className="lm-head">
          <div style={{fontSize:36,marginBottom:8}}>⛽</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:'#fff',fontWeight:700}}>QazMunaiGaz Pro</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:4}}>Жүйеге кіру / Вход в систему</div>
        </div>

        {step === 1 && (
          <div>
            <label className="lm-lbl">Логин</label>
            <input className="lm-inp" type="text" placeholder="admin / operator"
              value={user} onChange={e=>setUser(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&go1()} autoFocus />
            <label className="lm-lbl">Пароль</label>
            <input className="lm-inp" type="password" placeholder="••••••••" style={{marginBottom:18}}
              value={pass} onChange={e=>setPass(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&go1()} />
            {err1 && <div className="lm-err">{err1}</div>}
            <button className="lm-btn" onClick={go1}>Кіру →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.7)',marginBottom:16,padding:'10px 14px',background:'rgba(255,255,255,.05)',borderRadius:7,border:'1px solid rgba(255,255,255,.1)',lineHeight:1.6,whiteSpace:'pre-line'}}>{einfo}</div>
            <label className="lm-lbl">6 таңбалы код</label>
            <input ref={codeRef} className="lm-inp lm-inp-code" type="text" maxLength={6} placeholder="000000"
              value={code} onChange={e=>setCode(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&go2()} style={{marginBottom:18}} />
            {err2 && <div className="lm-err">❌ Код қате. Қайта енгізіңіз.</div>}
            <div style={{display:'flex',gap:8}}>
              <button className="lm-btn-back" onClick={()=>{setStep(1);setErr2('');}}>← Артқа</button>
              <button className="lm-btn-confirm" onClick={go2} disabled={sending}>{sending ? 'Күте тұрыңыз...' : 'Растау ✓'}</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{textAlign:'center',marginBottom:16,fontSize:13,color:'rgba(255,255,255,.6)'}}>🔐 Needham–Schroeder протоколы...</div>
            <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:16}}>
              {nsSteps.map((s,i) => <div key={i} className="lm-ns-step">{s}</div>)}
            </div>
            <div className="lm-progress"><div className="lm-progress-bar" style={{width:`${progress}%`}}/></div>
            <div style={{textAlign:'center',fontSize:12,color:'rgba(255,255,255,.4)'}}>Бағытталуда...</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ lang, setLang, onLogin, activeSection }) {
  const [mmOpen, setMmOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchRes, setSearchRes] = useState([]);
  const t = TRANSLATIONS[lang];
  const sections = ['hero','news','employees','production','facts','projects','investors','contacts'];

  const doSearch = (v) => {
    setSearchVal(v);
    if (!v.trim()) { setSearchRes([]); return; }
    const f = SEARCH_DATA.filter(p => p.t.toLowerCase().includes(v.toLowerCase()) || p.d.toLowerCase().includes(v.toLowerCase()));
    setSearchRes(f.slice(0,5));
  };
  const srGo = (s) => { scrollTo(s); setSearchVal(''); setSearchRes([]); };

  return (
    <>
      <nav className="navbar">
        <div className="nb-top">
          <a className="nb-logo" onClick={()=>scrollTo('hero')}>
            <div className="nb-logo-icon">⛽</div>
            <div><div className="nb-logo-name">QazMunaiGaz Pro</div><div className="nb-logo-sub">{t.sub}</div></div>
          </a>
          <div className="nb-search">
            <span style={{color:'rgba(255,255,255,.4)',fontSize:14}}>🔍</span>
            <input type="text" placeholder={t.srph} value={searchVal} onChange={e=>doSearch(e.target.value)} />
            {searchRes.length > 0 && (
              <div className="sr">
                {searchRes.map((p,i) => (
                  <div key={i} className="sr-item" onClick={()=>srGo(p.s)}>{p.t}<small>{p.d}</small></div>
                ))}
              </div>
            )}
          </div>
          <button className="nb-login-btn" onClick={onLogin}>🔐 Жүйеге кіру</button>
          <div className="nb-right">
            <div className="lang-toggle">
              <button className={`lb${lang==='kk'?' active':''}`} onClick={()=>setLang('kk')}>ҚАЗ</button>
              <button className={`lb${lang==='ru'?' active':''}`} onClick={()=>setLang('ru')}>РУС</button>
            </div>
            <button className={`burger${mmOpen?' open':''}`} onClick={()=>setMmOpen(p=>!p)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>
        <div className="nb-bottom">
          {t.nl.map((n,i) => (
            <button key={i} className={`nbl${activeSection===sections[i]?' active':''}`} onClick={()=>scrollTo(sections[i])}>{n}</button>
          ))}
        </div>
      </nav>

      {mmOpen && <div className="mm-overlay" onClick={()=>setMmOpen(false)} />}
      {mmOpen && (
        <div className="mm">
          <button className="mm-close" onClick={()=>setMmOpen(false)}>✕</button>
          {[['hero','🏠'],['news','📰'],['employees','👥'],['production','📊'],['facts','💡'],['projects','🏗'],['investors','📈'],['contacts','📞']].map(([id,ic],i) => (
            <div key={id} className="mm-item" onClick={()=>{scrollTo(id);setMmOpen(false);}}>{ic} {t.nl[i]}</div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [cur, setCur] = useState(0);
  const timerRef = useRef(null);
  const goSlide = useCallback((n) => setCur((n + SLIDES.length) % SLIDES.length), []);
  useEffect(() => {
    timerRef.current = setInterval(() => goSlide(cur + 1), 5500);
    return () => clearInterval(timerRef.current);
  }, [cur, goSlide]);
  const chSlide = (d) => { clearInterval(timerRef.current); goSlide(cur + d); };

  return (
    <section id="hero">
      <div className="hero-wrap">
        {SLIDES.map((s,i) => (
          <div key={i} className={`slide${cur===i?' active':''}`} style={{backgroundImage:`url('${s.img}')`}}>
            <div className="slide-overlay"/>
            <div className="slide-content">
              <div className="slide-tag">{s.tag}</div>
              <h1 className="slide-title" style={{whiteSpace:'pre-line'}}>{s.title}</h1>
              <p className="slide-desc">{s.desc}</p>
              <button className="slide-btn" onClick={()=>scrollTo(s.href.slice(1))}>{s.btn}</button>
            </div>
          </div>
        ))}
        <button className="harr harr-l" onClick={()=>chSlide(-1)}>‹</button>
        <button className="harr harr-r" onClick={()=>chSlide(1)}>›</button>
        <div className="hero-dots">
          {SLIDES.map((_,i) => <button key={i} className={`hdot${cur===i?' active':''}`} onClick={()=>chSlide(i-cur)}/>)}
        </div>
      </div>
    </section>
  );
}

// ─── News ─────────────────────────────────────────────────────────────────────
function NewsSection({ lang }) {
  const t = TRANSLATIONS[lang];
  return (
    <section className="sec alt" id="news">
      <div className="sec-tag">{t.newsTag}</div>
      <h2 className="sec-h2">{t.newsH}</h2>
      <p className="sec-p">{t.newsD}</p>
      <div className="news-grid">
        <div className="nc feat">
          <div className="nc-img" style={{backgroundImage:"url('https://images.unsplash.com/photo-1563089145-4c32b9f7ac84?w=700&q=80')"}}>
            <span className="nc-badge nb-red">Маңызды</span>
          </div>
          <div className="nc-body">
            <div className="nc-date">15 сәуір 2025</div>
            <div className="nc-title">QazMunaiGaz Pro жаңа киберқауіпсіздік жүйесін іске қосты</div>
            <div className="nc-desc">Needham–Schroeder протоколының жетілдірілген нұсқасы негізінде SCADA жүйелері толықтай қорғалды. Лоу шабуылдарынан 100% қорғаныс қамтамасыз етілді.</div>
          </div>
        </div>
        {[
          {img:'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&q=80',cls:'nb-green',badge:'Экология',date:'10 сәуір 2025',title:'Атырау облысында жаңа экологиялық бағдарлама іске қосылды',desc:'Жыл сайын 500 гектар жерді рекультивациялау жоспары бекітілді.'},
          {img:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',cls:'nb-gold',badge:'Қаржы',date:'5 сәуір 2025',title:'2025 жылдың I тоқсаны: таза пайда 18% өсті',desc:'Мұнай бағасының тұрақтануы және өндіріс тиімділігінің артуы нәтижесінде жақсы қаржылық нәтиже алынды.'},
          {img:'https://images.unsplash.com/photo-1581093806997-124204d9fa9d?w=600&q=80',cls:'nb-blue',badge:'Технология',date:'1 сәуір 2025',title:'AI негізіндегі болжамды техникалық қызмет жүйесі енгізілді',desc:'Машиналық оқыту алгоритмдері жабдық істен шығуын 72 сағат бұрын анықтайды.'},
        ].map((n,i) => (
          <div key={i} className="nc">
            <div className="nc-img" style={{backgroundImage:`url('${n.img}')`}}>
              <span className={`nc-badge ${n.cls}`}>{n.badge}</span>
            </div>
            <div className="nc-body">
              <div className="nc-date">{n.date}</div>
              <div className="nc-title">{n.title}</div>
              <div className="nc-desc">{n.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Employees ────────────────────────────────────────────────────────────────
function EmployeesSection({ lang }) {
  const [page, setPage] = useState(0);
  const t = TRANSLATIONS[lang];
  const PER = 4;
  const pages = Math.ceil(EMPS_DATA.length / PER);
  const items = EMPS_DATA.slice(page * PER, (page+1) * PER);

  return (
    <section className="sec" id="employees">
      <div className="sec-tag">Команда</div>
      <h2 className="sec-h2">{t.empH}</h2>
      <p className="sec-p">{t.empD}</p>
      <div className="emp-grid">
        {items.map((e,i) => (
          <div key={i} className="emp-card">
            <div style={{padding:'20px 20px 0',display:'flex',justifyContent:'center'}}>
              <div className="emp-photo">
                <img src={e.img} alt={e.name} onError={ev=>{ev.target.style.display='none';}} />
              </div>
            </div>
            <div className="emp-body">
              <div className="emp-name">{e.name}</div>
              <div className="emp-role">{e.role}</div>
              <div className="emp-badge">🏆 {t.badge[e.badge]}</div>
              <div className="emp-stars">{'★'.repeat(e.stars)}{'☆'.repeat(5-e.stars)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="page-nav">
        {Array.from({length:pages},(_,i) => (
          <div key={i} className={`pn-dot${i===page?' active':''}`} onClick={()=>setPage(i)} />
        ))}
      </div>
    </section>
  );
}

// ─── Production ───────────────────────────────────────────────────────────────
function ProductionSection({ lang }) {
  const [yr, setYr] = useState('2024');
  const t = TRANSLATIONS[lang];
  const d = YDATA[yr];
  const mx = Math.max(...d.bars.flat());
  const colors = ['b-navy','b-gold','b-blue'];

  return (
    <section className="sec alt" id="production">
      <div className="sec-tag">Өнімділік</div>
      <h2 className="sec-h2">Өндірістік көрсеткіштер</h2>
      <p className="sec-p">Жылдар бойынша компанияның негізгі өнімділік деректері.</p>
      <div className="yr-tabs">
        {['2024','2025','2026'].map(y => (
          <button key={y} className={`yr-tab${yr===y?' active':''}`} onClick={()=>setYr(y)}>
            {y}{y==='2026' ? ' (жоспар)' : ''}
          </button>
        ))}
      </div>
      <div className="st-grid">
        {d.items.map((s,i) => (
          <div key={i} className="st-card">
            <div className="st-icon">{s.ic}</div>
            <div className="st-lbl">{s.lb}</div>
            <div className="st-val">{s.val}</div>
            <div className="st-unit">{s.unit}</div>
            <div className={`st-trend ${s.up?'tr-up':'tr-dn'}`}>{s.tr}</div>
          </div>
        ))}
      </div>
      <div className="chart-wrap">
        <div className="chart-t">{t.chartT}</div>
        <div className="bar-chart">
          {['Q1','Q2','Q3','Q4'].map((q,qi) => (
            <div key={qi} className="bg-col">
              <div className="bgs">
                {d.bars.map((ser,si) => (
                  <div key={si} className={`bar ${colors[si]}`} style={{height:`${Math.round((ser[qi]/mx)*120)}px`}} />
                ))}
              </div>
              <div className="bg-lbl">{q}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Facts ────────────────────────────────────────────────────────────────────
function FactsSection() {
  const FACTS = [
    {ic:'🛢️',num:'45M+',lbl:'Жылдық мұнай өндірісі (тонна) — ҚР экспортының 28%'},
    {ic:'🌍',num:'32',lbl:'Экспорт бағыттары — Азия, Еуропа, Таяу Шығыс'},
    {ic:'👷',num:'12K+',lbl:'Қызметкер — 95% қазақстандық маман'},
    {ic:'🏭',num:'180',lbl:'Өндіріс нысаны бүкіл Қазақстанда'},
    {ic:'🔐',num:'0',lbl:'Кибершабуыл сәттілігі NS протоколы енгізілгеннен бері'},
    {ic:'🌱',num:'40%',lbl:'2030 жылға дейін CO₂ шығарындыларын азайту мақсаты'},
  ];
  return (
    <section className="sec dark" id="facts">
      <div className="sec-tag w">Деректер</div>
      <h2 className="sec-h2">Қызықты фактілер</h2>
      <p className="sec-p w">Компания туралы таңғаларлық сандар мен жетістіктер.</p>
      <div className="facts-grid">
        {FACTS.map((f,i) => (
          <div key={i} className="fact-card">
            <div className="fact-icon">{f.ic}</div>
            <div className="fact-num">{f.num}</div>
            <div className="fact-lbl">{f.lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function ProjectsSection() {
  const PROJS = [
    {tag:'SCADA Қауіпсіздік',title:'NS протоколын SCADA жүйелеріне енгізу',desc:'180 өндіріс нысанындағы RTU/PLC жүйелерін Needham–Schroeder протоколымен қорғау',pct:78,img:'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80'},
    {tag:'Жаңартылатын энергия',title:'Жайсаң жел электр станциясы',desc:'500 МВт қуаттылықтағы жел электр станциясы, 2026 жылы іске қосылады',pct:45,img:'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80'},
    {tag:'Цифрландыру',title:'Digital Twin платформасы',desc:'Барлық өндіріс нысандарының цифрлық егізін жасау — AI болжамды аналитика',pct:62,img:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80'},
  ];
  return (
    <section className="sec" id="projects">
      <div className="sec-tag">Жобалар</div>
      <h2 className="sec-h2">Негізгі жобалар</h2>
      <p className="sec-p">Компанияның стратегиялық даму жобалары.</p>
      <div className="proj-grid">
        {PROJS.map((p,i) => (
          <div key={i} className="proj-card">
            <div className="proj-bg" style={{backgroundImage:`url('${p.img}')`}}/>
            <div className="proj-ov"/>
            <div className="proj-cnt">
              <div className="proj-tag">{p.tag}</div>
              <div className="proj-title">{p.title}</div>
              <div className="proj-desc">{p.desc}</div>
              <div className="prog">
                <div className="prog-bar"><div className="prog-fill" style={{width:`${p.pct}%`}}/></div>
                <div className="prog-lbl">{p.pct}% аяқталды</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Investors ────────────────────────────────────────────────────────────────
function InvestorsSection() {
  const invVals = [62,70,68,75,80,85,78,90,88,95,100,108];
  const mx = Math.max(...invVals);
  return (
    <section className="sec gold-bg" id="investors">
      <div className="sec-tag w">Инвесторлар</div>
      <h2 className="sec-h2" style={{color:'#fff'}}>Инвесторларға арналған ақпарат</h2>
      <p className="sec-p w">Компанияның қаржылық көрсеткіштері мен инвестициялық мүмкіндіктері.</p>
      <div className="inv-grid">
        <div className="inv-card">
          <h3>Қаржылық нәтижелер 2025</h3>
          {[['Кіріс','₸ 2.84 трлн','gv'],['Таза пайда','↑ ₸ 420 млрд (+18%)','gr'],['EBITDA','₸ 890 млрд','gv'],['Инвестиция','₸ 340 млрд',''],['Дивиденд','₸ 85 / акция','gr'],['Несие рейтинг','BBB+ (Fitch)','gv']].map(([k,v,c])=>(
            <div key={k} className="inv-row"><span className="inv-k">{k}</span><span className={`inv-v ${c}`}>{v}</span></div>
          ))}
        </div>
        <div className="inv-card">
          <h3>Акция динамикасы</h3>
          {[['Ағымдағы баға','₸ 4,280','gv'],['Өзгеріс (YTD)','+22.4%','gr'],['P/E коэффициент','8.4x',''],['Нарықтық капитал','$14.2 млрд','gv']].map(([k,v,c])=>(
            <div key={k} className="inv-row"><span className="inv-k">{k}</span><span className={`inv-v ${c}`}>{v}</span></div>
          ))}
          <div className="inv-bars">
            {invVals.map((v,i)=><div key={i} className="ibar" style={{height:`${Math.round((v/mx)*100)}px`}} title={`${v}₸`}/>)}
          </div>
        </div>
        <div className="inv-card">
          <h3>Стратегиялық жоспар 2030</h3>
          {[['Өндірісті ұлғайту','+35%','gr'],['Жаңа энергия инвестиция','$2.4 млрд','gv'],['CO₂ азайту','-40%','gr'],['Цифрландыру','100% нысан','']].map(([k,v,c])=>(
            <div key={k} className="inv-row"><span className="inv-k">{k}</span><span className={`inv-v ${c}`}>{v}</span></div>
          ))}
        </div>
        <div className="inv-card">
          <h3>Инвесторларға байланыс</h3>
          {[['IR менеджер','Сейткали А.Б.',''],['Email','ir@qmg.kz',''],['Телефон','+7 (7172) 55-88-00',''],['Есеп беру','МСФО, жыл сайын','']].map(([k,v])=>(
            <div key={k} className="inv-row"><span className="inv-k">{k}</span><span className="inv-v">{v}</span></div>
          ))}
          <button className="inv-btn">📄 Жылдық есеп 2024 (PDF)</button>
        </div>
      </div>
    </section>
  );
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
function ContactsSection({ lang }) {
  const t = TRANSLATIONS[lang];
  const CARDS = [
    {ic:'📞',title:t.ct1,val:<>+7 (7172) 55-88-99<br/><small style={{color:'rgba(255,255,255,.35)',fontSize:11}}>7/24 жұмыс істейді</small></>},
    {ic:'🌐',title:'Интернет-портал',val:<><a href="#">www.qmg.kz</a><br/><a href="#">portal.qmg.kz</a></>},
    {ic:'📧',title:'Электрондық пошта',val:<><a href="mailto:info@qmg.kz">info@qmg.kz</a><br/><a href="mailto:security@qmg.kz">security@qmg.kz</a></>},
    {ic:'📍',title:'Мекенжай',val:<>Астана қ., Есіл р-ны,<br/>Мәңгілік Ел, 8-үй</>},
    {ic:'🚨',title:'Авариялық қызмет',val:<span style={{color:'#ef5350'}}>+7 (7172) 55-00-01<br/><small style={{color:'rgba(255,255,255,.35)',fontSize:11}}>Тәулік бойы</small></span>},
    {ic:'🔐',title:'Киберқауіпсіздік SOC',val:<><a href="mailto:soc@qmg.kz">soc@qmg.kz</a><br/>+7 (7172) 55-77-77</>},
    {ic:'📱',title:'Мобильді қосымша',val:<><a href="#">App Store</a><br/><a href="#">Google Play</a></>},
    {ic:'💼',title:'HR байланыс',val:<><a href="mailto:hr@qmg.kz">hr@qmg.kz</a><br/>+7 (7172) 55-66-55</>},
  ];
  return (
    <section className="sec dark" id="contacts">
      <div className="sec-tag w">Байланыс</div>
      <h2 className="sec-h2">Байланыс ақпараты</h2>
      <p className="sec-p w">Сұрақтарыңыз бен ұсыныстарыңыз үшін бізге хабарласыңыз.</p>
      <div className="ct-grid">
        {CARDS.map((c,i) => (
          <div key={i} className="ct-card">
            <div className="ct-icon">{c.ic}</div>
            <div className="ct-title">{c.title}</div>
            <div className="ct-val">{c.val}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState('kk');
  const [showLogin, setShowLogin] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById('idx-css')) {
      const s = document.createElement('style'); s.id = 'idx-css';
      s.textContent = INDEX_CSS; document.head.appendChild(s);
    }
  }, []);

  // Scroll events
  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 350);
      const secs = ['hero','news','employees','production','facts','projects','investors','contacts'];
      for (const id of secs) {
        const el = document.getElementById(id); if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= 110 && r.bottom > 110) { setActiveSection(id); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);



  return (
    <>
      <Navbar lang={lang} setLang={setLang} onLogin={()=>setShowLogin(true)} activeSection={activeSection} />
      <Hero />
      <div className="divider" />
      <NewsSection lang={lang} />
      <EmployeesSection lang={lang} />
      <ProductionSection lang={lang} />
      <FactsSection />
      <ProjectsSection />
      <InvestorsSection />
      <ContactsSection lang={lang} />
      <footer>
        <div>©️ 2025 QazMunaiGaz Pro. Барлық құқықтар қорғалған.</div>
        <div>Диплом жобасы — Аружан Аманова | Ақпараттық қауіпсіздік</div>
        <div><a href="#">Жеке деректер саясаты</a> · <a href="#">Байланыс</a></div>
      </footer>
      <button className={`sct${showTop?' show':''}`} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>↑</button>
      {showLogin && <LoginModal onClose={()=>setShowLogin(false)} />}
    </>
  );
}