# B2B Marketplace Platform — Bangladesh
## Risk Assessment & Go-to-Market Strategy

> **Version:** 1.0.0  
> **Market:** Bangladesh  
> **Date:** 2026-03-01  
> **Platform Model:** 100% Free — No Subscriptions, No Payment Gateway

---

## Table of Contents

1. [Risk Assessment Register](#1-risk-assessment-register)
2. [Go-to-Market Strategy](#2-go-to-market-strategy)
3. [Team & Resourcing](#3-team--resourcing)
4. [Success Metrics & KPIs](#4-success-metrics--kpis)
5. [Competitive Landscape](#5-competitive-landscape)
6. [Growth & Scaling Roadmap](#6-growth--scaling-roadmap)
7. [Appendix: Key Decisions](#7-appendix-key-decisions)

---

## 1. Risk Assessment Register

### Risk Rating Matrix

| Likelihood | Impact | Rating |
|-----------|--------|--------|
| High (3) × High (3) | = 9 | Critical |
| High (3) × Medium (2) | = 6 | High |
| Medium (2) × Medium (2) | = 4 | Medium |
| Low (1) × Any | ≤ 3 | Low |

---

### Risk Register

| ID | Risk | Category | Likelihood | Impact | Score | Mitigation |
|----|------|----------|-----------|--------|-------|-----------|
| **R-01** | Cold Start — Not enough sellers when launching, buyers find nothing | Business | High (3) | High (3) | 9 | Supply-first strategy: onboard 300+ sellers before public launch. Focus on 3 product categories initially (Textile, Electronics, FMCG). Run targeted Facebook ads to sellers. |
| **R-02** | Low Engagement — Users register but never return | Business | High (3) | High (3) | 9 | In-app notifications and email to re-engage. Seller digest emails (weekly enquiry summary). Buyer RFQ match alerts. Quality onboarding flow to show value fast. |
| **R-03** | Data Quality — Fake/duplicate listings degrade search results | Business | High (3) | Medium (2) | 6 | Admin moderation queue for every new product. Seller rating system surface quality. User flag/report feature. Automated duplicate text detection via MySQL FULLTEXT. |
| **R-04** | Technical Failure — Server downtime during peak usage or traffic spike | Technical | Medium (2) | High (3) | 6 | Laravel file caching and MySQL query optimisation for high-traffic routes. Queue workers offload heavy tasks. Hostinger control panel monitoring + custom `/health` Laravel endpoint. Daily DB backup via cron. |
| **R-05** | Email OTP Delivery — Verification emails not delivered, users cannot complete login | Technical | Low (1) | High (3) | 3 | Use Hostinger’s built-in SMTP (reliable for transactional email). Implement retry logic in OtpService. Offer password-based login as fallback. Monitor email delivery via Hostinger mail logs. |
| **R-06** | Seller Abandonment — Sellers list products but later leave for Facebook groups | Business | Medium (2) | High (3) | 6 | Provide clear value: lead management dashboard, CRM tools, verified badge, buyers can't access seller phone unless they enquire. Regular engagement emails with stats ("Your products got 200 views this week"). |
| **R-07** | Content Scalability — Bengali language support issues (encoding, search) | Technical | Medium (2) | Medium (2) | 4 | MySQL utf8mb4 from Day 1. FULLTEXT search configured for Bengali. Thorough manual testing of Bengali input/search before launch. Phase 2: Meilisearch with Bengali stemmer. |
| **R-08** | Admin Overwhelm — Manual product moderation doesn't scale beyond 1,000/day | Operations | Medium (2) | Medium (2) | 4 | Phase 2: automated spam/duplicate detection. Admin bulk-approve tools. Trusted seller fast-track (skip moderation once track record established). Hire additional moderator when queue exceeds 200/day. |
| **R-09** | Legal & Compliance — Bangladesh e-commerce regulations evolve | Legal | Low (1) | High (3) | 3 | Monitor Bangladesh Telecommunications Regulatory Commission (BTRC) updates. Terms of Service and Privacy Policy approved by local legal counsel before launch. No financial transactions on platform reduces regulatory exposure. |
| **R-10** | Competitive Response — Large player (e.g., Alibaba, TradeKey, Bikroy) copies the model or runs promotions to poach sellers | Business | Low (1) | Medium (2) | 2 | Focus on localisation (Bengali-first UX, Bangladesh-specific categories). Build seller community and loyalty early. Free model means no switching cost — compete on product quality and features. |

---

## 2. Go-to-Market Strategy

### 2.1 Phase 1: Supply-First Launch (Month 1–2)

**Goal:** 300 active sellers, 3,000 products live before public launch.

**Target Seller Segments (Priority Order):**
1. **Textile & Garments** — Narayanganj, Savar, Gazipur (factory dense)
2. **Electronics & Accessories** — Elephant Road, Multiplan Centre, Dhaka
3. **Agricultural / FMCG** — Bogura, Rajshahi, Sylhet wholesale markets

**Activation Channels:**

| Channel | Activity | Cost |
|---------|----------|------|
| Field Sales (2 reps) | Visit wholesale markets, sign up sellers in person with assisted onboarding | Staff salary |
| Facebook Ads (Seller-targeted) | "তালিকা করুন বিনামূল্যে — লক্ষ ক্রেতার কাছে পৌঁছান" | ৳15,000/month |
| WhatsApp Business Outreach | Reach seller WhatsApp groups in wholesale clusters | Free |
| Trade Associations | Partner with BGMEA, BTMA for credibility in garment sector | Relationship |
| YouTube Tutorial Videos | "সহজেই পণ্য তালিকা করুন" — 3-minute instructional video in Bengali | Production cost |

---

### 2.2 Phase 2: Buyer Acquisition (Month 2–4)

**Goal:** 2,000 active buyers, first confirmed deals traced through platform.

**Buyer Channels:**

| Channel | Activity |
|---------|----------|
| SEO Content | Category landing pages optimised for long-tail Bengali search (e.g., "ঢাকায় কটন কাপড়ের সাপ্লায়ার") |
| Google Ads | Search intent keywords: "wholesale supplier Bangladesh", "কারখানা থেকে পণ্য কিনুন" |
| Facebook Groups | Post product listings in trade/procurement Facebook groups |
| B2B Buyer Directories | List platform on TradeIndia, Kompass, etc. as a sourcing hub |
| Email Outreach | Target SME importers and garment buying houses |
| PR | Prothom Alo, Daily Star feature: "Free B2B marketplace for Bangladesh SMEs" |

---

### 2.3 Phase 3: Growth & Retention (Month 5+)

- Monthly seller newsletters with performance stats
- Buyer "match" emails: "New sellers added in your search category"
- RFQ email matching: seller notified when relevant buy requirement posted
- Leaderboard: "Top Verified Sellers This Month" on home page
- Referral incentive: Seller gets "Early Adopter" badge for referring 5 more sellers

---

## 3. Team & Resourcing

### 3.1 Core Development Team

| Role | Responsibilities | Salary (BDT/month) |
|------|-----------------|-------------------|
| Lead Full-Stack Developer | Laravel + React + Inertia, architecture decisions | ৳60,000 – ৳90,000 |
| Backend Developer | API development, DB optimisation, queue jobs | ৳40,000 – ৳60,000 |
| Frontend Developer | React components, Tailwind UI, mobile responsiveness | ৳35,000 – ৳55,000 |
| QA Engineer (part-time) | Manual + automated testing, regression | ৳20,000 – ৳35,000 |

### 3.2 Operations Team

| Role | Responsibilities | Salary (BDT/month) |
|------|-----------------|-------------------|
| Admin / Content Moderator | Review pending products, handle reports, CMS updates | ৳18,000 – ৳25,000 |
| Customer Support | Respond to seller/buyer queries via email/WhatsApp | ৳15,000 – ৳22,000 |
| Field Sales Representative (×2) | Seller onboarding in Dhaka/Chittagong markets | ৳20,000 – ৳30,000 + incentive |
| Digital Marketing Coordinator | Facebook ads, SEO content, social media | ৳25,000 – ৳40,000 |

### 3.3 Team Scaling by Phase

| Phase | Team Size | Focus |
|-------|-----------|-------|
| MVP (Month 1–3) | 3–4 devs + 1 ops | Build and launch |
| Growth (Month 4–6) | + 1 moderation + 2 field sales | Seller acquisition |
| Scale (Month 7–12) | + 1 dev + 1 marketing + 1 support | Retention, feature expansion |

---

## 4. Success Metrics & KPIs

### 4.1 North Star Metric

> **Monthly Active Buyers Getting Enquiry Responses**  
> A buyer who sent an enquiry AND received a reply from a seller = proven value exchange.

---

### 4.2 Phase 1 KPIs (Month 1–3, MVP)

| Metric | Target |
|--------|--------|
| Sellers registered | 500 |
| Products listed (active) | 3,000 |
| Sellers with >3 active products | 200 |
| Platform uptime | ≥ 99.5% |
| Page load speed (mobile) | < 3 seconds |
| Admin moderation turnaround | < 12 hours |

---

### 4.3 Phase 2 KPIs (Month 4–6, Traction)

| Metric | Target |
|--------|--------|
| Registered buyers | 2,000 |
| Monthly enquiries sent | 500 |
| Enquiry-to-reply rate | ≥ 60% |
| Seller Monthly Active Rate | ≥ 40% |
| Search → product page conversion | ≥ 15% |
| Organic traffic (monthly) | 5,000 sessions |

---

### 4.4 Phase 3 KPIs (Month 7–12, Growth)

| Metric | Target |
|--------|--------|
| Total registered sellers | 5,000 |
| Total products listed | 30,000 |
| Monthly Active Users (total) | 10,000 |
| Monthly enquiries sent | 5,000 |
| Verified sellers | 500 |
| Average seller rating | ≥ 4.0 |
| Reviews submitted | 2,000 |
| NPS score (seller survey) | ≥ 40 |
| Returning buyer rate (monthly) | ≥ 35% |

---

### 4.5 Tracking Tools

| Tool | Purpose |
|------|---------|
| Platform admin dashboard | Registrations, enquiries, product listings, active users |
| Laravel Telescope | Developer query/job/request performance monitoring |
| Seller survey (Google Form) | NPS quarterly |

---

## 5. Competitive Landscape

### 5.1 Direct Competitors in Bangladesh

| Platform | Type | Strength | Weakness |
|----------|------|----------|---------|
| Facebook Groups | Informal marketplace | Mass adoption, free, Bengali-familiar | No search, no lead tracking, spam-heavy |
| Bikroy.com | C2C/B2C classifieds | Brand awareness | Not B2B focused, no RFQ, no seller CRM |
| Alibaba.com | Global B2B | Huge catalog | Not Bangladesh-specific, English-first, expensive for local SMEs |
| TradeKey.com | Global B2B directory | International buyer access | Paid plans, no Bengali support, irrelevant to local trade |
| Yellow Pages BD | Business directory | Established | No product listings, no enquiry system, no SEO |
| LinkedIn | Professional network | Decision-maker access | Not designed for product discovery or trade |

### 5.2 Competitive Advantage

| Factor | Our Platform | Facebook Groups | Bikroy | Alibaba |
|--------|-------------|-----------------|--------|---------|
| Bengali-first UX | ✅ | Partial | ✅ | ❌ |
| B2B product listings | ✅ | ❌ | ❌ | ✅ |
| RFQ system | ✅ | ❌ | ❌ | ✅ |
| Structured search | ✅ | ❌ | Partial | ✅ |
| Seller CRM / lead tracking | ✅ | ❌ | ❌ | Paid |
| Free for buyers AND sellers | ✅ | ✅ | ✅ | ❌ |
| BD-specific categories | ✅ | ❌ | ❌ | ❌ |
| Verified seller badge | ✅ | ❌ | ❌ | Paid |
| Review system | ✅ | ❌ | Limited | ✅ |

---

## 6. Growth & Scaling Roadmap

### 6.1 Year 1 Feature Plan

| Phase | Features |
|-------|---------|
| **MVP (Month 1–3)** | Seller onboarding, product listings, search, enquiry, admin panel, OTP login |
| **Engagement (Month 4–5)** | In-app messaging, RFQ system, reviews, notifications, seller dashboard stats |
| **Retention (Month 6–8)** | SEO-optimised public pages, sitemap, category pages, mobile performance optimisation, seller profile badges |
| **Scale (Month 9–12)** | Meilisearch integration (self-hosted), bulk product upload (CSV), API access for sellers, advanced admin analytics |

### 6.2 Year 2 Plans (Evaluative)

- Mobile app (React Native) — Android first (BD market is 90%+ Android)
- Seller analytics dashboard with conversion insights
- AI-powered product description generator (Bengali)
- Logistics partner directory integration (Pathao, RedX)
- National trade show presence (BGMEA, DITF)
- Government B2B: tender/procurement listing section
- Revenue model evaluation: non-intrusive homepage banner ads from verified brands

### 6.3 Infrastructure Scaling Triggers

| When | Action |
|------|--------|
| Products > 50,000 | Add Meilisearch server, enable full-text indexing |
| Concurrent users > 500 | Upgrade Hostinger VPS to 8-core / 32GB RAM |
| DB queries > 10ms avg | Add read replica MySQL, optimise with MySQL indexes and Laravel file cache |
| Queue jobs > 1000 pending | Add second queue worker server |
| Traffic > 50,000 sessions/day | Enable Cloudflare CDN for all static assets, enable page caching |

---

## 7. Appendix: Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Business model | 100% free for all users | Network effects strategy — grow supply and demand without price friction. No payment gateway risk or compliance needed. |
| Tech stack | Laravel 11 + React + Inertia.js + MySQL | Best fit for BD developer market, strong community, lower hiring cost vs Node/Next |
| Hosting | Hostinger VPS (Singapore) | Budget-friendly, low latency to Bangladesh, easy to scale VPS plan |
| Payment gateway | None | Platform is entirely free; no transactions processed |
| Subscriptions | None | All features free to all users — buyers and sellers equally |
| Authentication | Email OTP (primary) + Email/Password (secondary) + Google OAuth | No SMS gateway needed; Hostinger SMTP handles OTP delivery at zero variable cost |
| Language | Bengali-first with English fallback | Primary audience is BD-based SME owners; Bengali builds trust |
| Search engine | MySQL FULLTEXT (Phase 1) → Meilisearch (Phase 2) | FULLTEXT sufficient at launch; Meilisearch added when catalog exceeds 50,000 products |
| External APIs | Google OAuth only | All other features use self-hosted or built-in services; no external API keys required |
| Image storage | Hostinger VPS local storage (Phase 1) | Cost-effective at early scale; expand VPS disk or move to object storage when needed |
| Product moderation | Manual admin review | AI moderation for future; manual ensures quality at early stage |
| Mobile strategy | Responsive web (Phase 1), React Native (Year 2) | Web covers all users; native app after product-market fit validated |

---

*End of Risk Assessment & Go-to-Market Strategy Document*
