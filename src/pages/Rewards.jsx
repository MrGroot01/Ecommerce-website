// FILE: src/pages/Rewards.jsx
// Route: /rewards

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Pages.css";

const COUPONS = [
  { code:"FIRST20",  title:"20% OFF First Order", desc:"Valid on orders above ₹299", discount:"20%",  expires:"2026-05-31", color:"coup-orange", min:299,  type:"Percent"  },
  { code:"HEALTH30", title:"30% OFF Pharmacy",     desc:"On all medicine orders",    discount:"30%",  expires:"2026-04-30", color:"coup-green",  min:199,  type:"Percent"  },
  { code:"PETLOVE",  title:"₹150 OFF Pet Care",    desc:"On orders above ₹699",      discount:"₹150", expires:"2026-06-15", color:"coup-amber",  min:699,  type:"Flat"     },
  { code:"BABY10",   title:"10% OFF Baby Care",    desc:"On all baby products",      discount:"10%",  expires:"2026-05-15", color:"coup-blue",   min:0,    type:"Percent"  },
  { code:"SAVE100",  title:"₹100 OFF Grocery",     desc:"On grocery orders ₹499+",   discount:"₹100", expires:"2026-04-20", color:"coup-purple", min:499,  type:"Flat"     },
  { code:"FREESHIP", title:"Free Delivery",         desc:"On any order, no minimum",  discount:"FREE", expires:"2026-05-01", color:"coup-teal",   min:0,    type:"Shipping" },
];

const HISTORY = [
  { action:"Order Placed",    pts:+50,  date:"28 Mar 2026", icon:"📦", color:"#22c55e" },
  { action:"Coupon Redeemed", pts:-200, date:"15 Mar 2026", icon:"🎟",  color:"#ef4444" },
  { action:"Order Delivered", pts:+100, date:"20 Feb 2026", icon:"✅", color:"#22c55e" },
  { action:"Referral Bonus",  pts:+250, date:"10 Feb 2026", icon:"👥", color:"#22c55e" },
  { action:"Review Reward",   pts:+30,  date:"05 Feb 2026", icon:"⭐", color:"#22c55e" },
  { action:"Welcome Bonus",   pts:+200, date:"01 Jan 2026", icon:"🎁", color:"#22c55e" },
];

const TIERS = [
  { name:"Silver",   min:0,    max:499,  icon:"🥈", color:"#94a3b8", perks:["1 pt per ₹10 spent","Birthday bonus 50 pts"] },
  { name:"Gold",     min:500,  max:1499, icon:"🥇", color:"#f59e0b", perks:["1.5x pts multiplier","Priority support","Free delivery on select orders"] },
  { name:"Platinum", min:1500, max:3999, icon:"💎", color:"#8b5cf6", perks:["2x pts multiplier","Dedicated support","Exclusive coupons","Early sale access"] },
  { name:"Diamond",  min:4000, max:9999, icon:"💠", color:"#06b6d4", perks:["3x pts multiplier","Free express delivery","VIP deals","Personal shopper"] },
];

const HOW_EARN = [
  { icon:"📦", label:"Place an Order",  pts:"+50 pts per order"    },
  { icon:"✅", label:"Order Delivered", pts:"+100 pts per order"   },
  { icon:"⭐", label:"Write a Review",  pts:"+30 pts per review"   },
  { icon:"👥", label:"Refer a Friend",  pts:"+250 pts per referral" },
  { icon:"📱", label:"Download App",    pts:"+100 pts one-time"    },
  { icon:"🎂", label:"Birthday Bonus",  pts:"+150 pts on birthday"  },
];

const Rewards = () => {
  const navigate = useNavigate();
  const points   = parseInt(localStorage.getItem("myshop_points") || "840");

  const [activeTab,    setActiveTab]    = useState("Coupons");
  const [copiedCode,   setCopiedCode]   = useState("");
  const [redeemInput,  setRedeemInput]  = useState("");
  const [redeemMsg,    setRedeemMsg]    = useState("");

  const currentTier = TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
  const nextTier    = TIERS[TIERS.indexOf(currentTier) + 1];
  const progress    = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const handleRedeem = () => {
    if (!redeemInput.trim()) return;
    const found = COUPONS.find(c => c.code === redeemInput.toUpperCase().trim());
    setRedeemMsg(found ? `✅ "${found.code}" is valid! ${found.title}` : "❌ Invalid coupon code.");
    setTimeout(() => setRedeemMsg(""), 3000);
  };

  return (
    <div className="page-root">
      <div className="page-hero rewards-hero">
        <div className="page-hero-inner">
          <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
          <div className="page-hero-text">
            <h1>⭐ Rewards & Points</h1>
            <p>Earn, redeem and unlock exclusive benefits</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* POINTS CARD */}
        <div className="rw-hero-card">
          <div className="rw-points-big">
            <div className="rw-pts-num">{points.toLocaleString()}</div>
            <div className="rw-pts-label">MyShop Points</div>
          </div>
          <div className="rw-tier-info">
            <div className="rw-tier-badge" style={{ color: currentTier.color }}>
              {currentTier.icon} {currentTier.name} Member
            </div>
            {nextTier && (
              <>
                <div className="rw-progress-bar">
                  <div className="rw-progress-fill" style={{ width:`${progress}%`, background:currentTier.color }} />
                </div>
                <p className="rw-progress-label">{nextTier.min - points} pts to reach {nextTier.icon} {nextTier.name}</p>
              </>
            )}
          </div>
          <div className="rw-quick-stats">
            <div><span>₹{Math.floor(points / 10)}</span><small>Redeemable Value</small></div>
            <div><span>{HISTORY.filter(h => h.pts > 0).length}</span><small>Times Earned</small></div>
          </div>
        </div>

        {/* REDEEM ROW */}
        <div className="rw-redeem-row">
          <div className="rw-redeem-wrap">
            <input className="rw-redeem-input" placeholder="Enter coupon code to validate..."
              value={redeemInput} onChange={e => setRedeemInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && handleRedeem()} />
            <button className="rw-redeem-btn" onClick={handleRedeem}>Validate</button>
          </div>
          {redeemMsg && <p className="rw-redeem-msg">{redeemMsg}</p>}
        </div>

        {/* TABS */}
        <div className="rw-tabs">
          {["Coupons","Points History","How to Earn","Membership Tiers"].map(t => (
            <button key={t} className={`rw-tab ${activeTab === t ? "rw-tab-active" : ""}`}
              onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>

        {activeTab === "Coupons" && (
          <div className="coup-grid">
            {COUPONS.map((c, i) => (
              <div key={i} className={`coup-card ${c.color}`}>
                <div className="coup-left">
                  <div className="coup-discount">{c.discount}</div>
                  <div className="coup-type">{c.type} Off</div>
                </div>
                <div className="coup-body">
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                  {c.min > 0 && <span className="coup-min">Min. order ₹{c.min}</span>}
                  <span className="coup-exp">Expires: {new Date(c.expires).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
                </div>
                <div className="coup-right">
                  <span className="coup-code">{c.code}</span>
                  <button className={`coup-copy ${copiedCode === c.code ? "coup-copied" : ""}`} onClick={() => copyCode(c.code)}>
                    {copiedCode === c.code ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Points History" && (
          <div className="ph-list">
            <div className="ph-balance-row"><span>Current Balance</span><span className="ph-balance">{points} pts</span></div>
            {HISTORY.map((h, i) => (
              <div key={i} className="ph-row">
                <div className="ph-icon">{h.icon}</div>
                <div className="ph-info"><strong>{h.action}</strong><span>{h.date}</span></div>
                <div className="ph-pts" style={{ color: h.color }}>{h.pts > 0 ? "+" : ""}{h.pts} pts</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "How to Earn" && (
          <div className="earn-grid">
            {HOW_EARN.map((e, i) => (
              <div key={i} className="earn-card">
                <div className="earn-icon">{e.icon}</div>
                <h4>{e.label}</h4>
                <span className="earn-pts">{e.pts}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Membership Tiers" && (
          <div className="tier-grid">
            {TIERS.map((tier, i) => (
              <div key={i} className={`tier-card ${points >= tier.min && points <= tier.max ? "tier-active" : ""}`}>
                {points >= tier.min && points <= tier.max && <div className="tier-current-badge">Your Tier</div>}
                <div className="tier-icon" style={{ color: tier.color }}>{tier.icon}</div>
                <h4 style={{ color: tier.color }}>{tier.name}</h4>
                <p className="tier-range">{tier.min.toLocaleString()} – {tier.max.toLocaleString()} pts</p>
                <ul className="tier-perks">
                  {tier.perks.map((p, j) => <li key={j}><span>✓</span>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;