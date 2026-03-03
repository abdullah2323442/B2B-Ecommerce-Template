# B2B Marketplace Platform — Bangladesh
## Master Requirement Document

> **Version:** 1.0.0  
> **Target Market:** Bangladesh  
> **Stack:** Laravel 11 + React 18 + MySQL 8.0  
> **Date:** 2026-03-01  
> **Model:** Completely Free for All Users

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Stakeholders & User Roles](#2-stakeholders--user-roles)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [User Stories](#5-user-stories)
6. [System Constraints](#6-system-constraints)
7. [Compliance & Legal](#7-compliance--legal)
8. [Phased Delivery Roadmap](#8-phased-delivery-roadmap)

---

## 1. Project Overview

### 1.1 Vision

Build Bangladesh's leading free B2B (Business-to-Business) marketplace — a platform where Bangladeshi manufacturers, wholesalers, suppliers, and buyers can connect directly without any fees.

### 1.2 Mission

Digitize the Bangladeshi B2B trade ecosystem by providing a professional, Bengali-first, completely free platform that replaces fragmented Facebook groups, WhatsApp networks, and physical trade directories.

### 1.3 Value Proposition

| For Sellers | For Buyers |
|-------------|------------|
| Free product listings with photos | Free access to thousands of verified suppliers |
| Direct enquiries from real buyers | Direct contact with manufacturers |
| Professional public business profile | Product comparison and filtering |
| Bengali-language interface | Bengali search with BD-specific categories |
| Analytics on profile and product views | RFQ (Request for Quote) system |
| No monthly fees, ever | No registration required to browse |

### 1.4 Business Model

The platform is **completely free** for all users — buyers and sellers alike. There are no subscription tiers, no paid plans, and no payment gateway. The platform grows through network effects and word-of-mouth. Future revenue (Phase 3+) may explore non-intrusive banner advertising, fully admin-managed with no automated billing system.

### 1.5 Key Assumptions

- Primary language: Bengali (বাংলা) + English
- Currency: BDT (৳) displayed for product pricing only
- Target cities: Dhaka, Chittagong, Gazipur, Narayanganj, Rajshahi, Khulna, Sylhet
- Initial verticals: Garments & Textiles, Machinery, Food & Agriculture, Construction Materials, Electronics
- All features are free for all registered users
- No payment gateway or billing system of any kind

---

## 2. Stakeholders & User Roles

### 2.1 User Roles

| Role | Description | Key Actions |
|------|-------------|-------------|
| **Guest** | Unauthenticated visitor | Browse products, search, view profiles |
| **Buyer** | Registered buyer account | Send enquiries, post RFQs, save products, review sellers |
| **Seller** | Registered business account | List products, manage profile, respond to enquiries |
| **Admin** | Platform operator | Moderate content, manage users, configure platform |

### 2.2 Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| Platform Owner | Grow user base, dominate BD B2B market |
| Sellers (SMEs) | Reach buyers, get leads for free |
| Buyers | Find verified suppliers efficiently |
| Field Sales Team | Onboard sellers, provide support |

---

## 3. Functional Requirements

### FR-01: User Authentication

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-01.1 | Email + OTP / password registration (primary) | P0 | OTP sent via email |
| FR-01.2 | Account type selection: Buyer or Seller on registration | P0 | |
| FR-01.3 | Login with email + OTP | P0 | |
| FR-01.4 | Login with email + password | P1 | |
| FR-01.5 | Google OAuth login | P2 | |
| FR-01.6 | OTP expiry: 5 minutes, max 3 attempts | P0 | |
| FR-01.7 | Session management with remember me | P1 | |
| FR-01.8 | Phone number stored as optional contact field on profile | P1 | Not used for auth |
| FR-01.9 | Password reset via email OTP | P1 | |
| FR-01.10 | Admin: 2FA via Google Authenticator | P0 | |

### FR-02: Seller Profile Management

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-02.1 | Business name, tagline, description | P0 | |
| FR-02.2 | Business logo and cover photo upload | P0 | |
| FR-02.3 | Business category (multi-select from admin categories) | P0 | |
| FR-02.4 | Location: division, district, area, address | P0 | |
| FR-02.5 | Contact: phone, email, website | P0 | |
| FR-02.6 | Business type: Manufacturer / Wholesaler / Retailer / Service | P0 | |
| FR-02.7 | Year established, number of employees | P1 | |
| FR-02.8 | Trade licenses / certifications upload | P1 | |
| FR-02.9 | Admin-granted verified badge for confirmed businesses | P1 | |
| FR-02.10 | Public seller profile page at `/seller/{slug}` | P0 | |
| FR-02.11 | Business description in Bengali and English | P0 | |
| FR-02.12 | Operating hours | P2 | |

### FR-03: Product & Service Listing Management

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-03.1 | Add / edit / delete product listings | P0 | |
| FR-03.2 | Multiple product photos (up to 10 per product) | P0 | |
| FR-03.3 | Product name in Bengali and English | P0 | |
| FR-03.4 | Detailed product description | P0 | |
| FR-03.5 | Price range (min/max) with unit (e.g., ৳500–৳1,000 per kg) | P0 | |
| FR-03.6 | Minimum order quantity (MOQ) | P0 | |
| FR-03.7 | Category + subcategory assignment | P0 | |
| FR-03.8 | Custom attributes per category | P1 | e.g., fabric type for garments |
| FR-03.9 | Product tags for improved search | P0 | |
| FR-03.10 | Product status: draft / pending / active / inactive | P0 | |
| FR-03.11 | Admin approval required before product goes live | P0 | |
| FR-03.12 | Seller dashboard shows all listings with status | P0 | |
| FR-03.13 | Product view count visible to seller | P1 | |
| FR-03.14 | Mark product as out of stock | P1 | |
| FR-03.15 | Duplicate / clone a product listing | P2 | |

### FR-04: Category & Taxonomy Management

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-04.1 | Admin manages two-level category tree | P0 | Category → Subcategory |
| FR-04.2 | Category icon and banner image | P1 | |
| FR-04.3 | Category-level custom attribute templates | P1 | |
| FR-04.4 | Category SEO: meta title and description | P1 | |
| FR-04.5 | 20+ Bangladesh-relevant categories on launch | P0 | |

### FR-05: Search & Discovery

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-05.1 | Full-text search across products and sellers | P0 | MySQL FULLTEXT |
| FR-05.2 | Bengali keyword search with transliteration support | P0 | |
| FR-05.3 | Filters: category, location, price range, MOQ | P0 | |
| FR-05.4 | Sort: relevance, newest, price ascending/descending | P0 | |
| FR-05.5 | Search suggestions / autocomplete | P1 | |
| FR-05.6 | Paginated search results (20 per page) | P0 | |
| FR-05.7 | Zero-results page with suggestions | P1 | |
| FR-05.8 | Related products on product detail page | P1 | Same category |

### FR-06: Buyer Features

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-06.1 | Browse products without registration | P0 | |
| FR-06.2 | View seller contact info (registered buyers only) | P0 | |
| FR-06.3 | Save / bookmark products and sellers | P1 | |
| FR-06.4 | View enquiry history in buyer dashboard | P0 | |
| FR-06.5 | Buyer profile: name, company, contact | P1 | |

### FR-07: Enquiry & Lead Management

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-07.1 | Send enquiry on a product (login required) | P0 | |
| FR-07.2 | Enquiry form: quantity, requirement details, contact info | P0 | |
| FR-07.3 | Seller notified via in-app notification and email on new enquiry | P0 | |
| FR-07.4 | Seller views all enquiries in dashboard | P0 | |
| FR-07.5 | Seller marks enquiry: New / Contacted / Closed | P0 | |
| FR-07.6 | Seller can reply to enquiry via platform | P0 | |
| FR-07.7 | Buyer notified when seller replies | P0 | |
| FR-07.8 | Enquiry rate limit: max 20/day per buyer (anti-spam) | P0 | |
| FR-07.9 | Export enquiries to CSV (seller) | P1 | |

### FR-08: In-App Messaging

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-08.1 | Buyer–Seller direct messaging | P1 | Thread per enquiry |
| FR-08.2 | Conversation list in seller and buyer dashboards | P1 | |
| FR-08.3 | Message polling for near-real-time chat | P1 | WebSocket in Phase 3 |
| FR-08.4 | Read / unread message status | P1 | |
| FR-08.5 | Block / report user in conversation | P1 | |

### FR-09: RFQ (Request for Quotation)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-09.1 | Buyer posts a public "Buy Requirement" | P1 | |
| FR-09.2 | Requirement: title, description, quantity, target price | P1 | |
| FR-09.3 | Sellers submit quotes on requirements | P1 | |
| FR-09.4 | Buyer reviews quotes and contacts seller | P1 | |
| FR-09.5 | Buyer can close / expire a requirement | P1 | |
| FR-09.6 | Matching sellers notified of relevant new requirements | P1 | Category-based |

### FR-10: Reviews & Ratings

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-10.1 | Buyer rates seller (1–5 stars) after enquiry | P1 | |
| FR-10.2 | Written review with optional photos | P1 | |
| FR-10.3 | Seller responds to review | P1 | |
| FR-10.4 | Admin moderates and removes reviews | P1 | |
| FR-10.5 | Average rating displayed on seller profile | P1 | |

### FR-11: Notifications

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-11.1 | In-app notification center | P0 | |
| FR-11.2 | Email notifications: new enquiry, new message, account updates | P0 | Via Hostinger SMTP |
| FR-11.3 | User configures notification preferences | P1 | |
| FR-11.4 | Daily enquiry digest email for sellers | P1 | |

### FR-12: Admin Panel

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-12.1 | Dashboard: user, product, enquiry counts + charts | P0 | |
| FR-12.2 | User management: view, activate, deactivate, delete | P0 | |
| FR-12.3 | Product moderation queue: approve / reject with reason | P0 | |
| FR-12.4 | Category management: CRUD | P0 | |
| FR-12.5 | Grant / revoke verified badge for sellers | P1 | |
| FR-12.6 | Banner / announcement management | P1 | |
| FR-12.7 | CMS: manage About, Terms, Privacy pages | P1 | |
| FR-12.8 | Email broadcast to user segments | P2 | |
| FR-12.9 | Export users, products, enquiries to CSV | P1 | |
| FR-12.10 | SEO settings per page | P1 | |
| FR-12.11 | Site settings: name, logo, contact, social links | P0 | |
| FR-12.12 | Admin activity log | P1 | |
| FR-12.13 | Review moderation | P1 | |

### FR-13: SEO & Public Pages

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-13.1 | SEO-friendly URLs: `/product/{slug}`, `/seller/{slug}` | P0 | |
| FR-13.2 | Meta title and description per page | P0 | |
| FR-13.3 | Open Graph tags for social sharing | P1 | |
| FR-13.4 | JSON-LD structured data for products | P1 | |
| FR-13.5 | Auto-generated XML sitemap | P0 | |
| FR-13.6 | robots.txt | P0 | |
| FR-13.7 | Homepage: featured categories, latest products | P0 | |
| FR-13.8 | Category listing pages with pagination | P0 | |
| FR-13.9 | Seller directory page | P1 | |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| Requirement | Target |
|-------------|--------|
| Page load time | < 2 seconds (P75) |
| API response time | < 500ms (P95) |
| Database query time | < 200ms for listing queries |
| Concurrent users (MVP) | 200 simultaneous |
| Uptime | ≥ 99% monthly |

### 4.2 Security

| Requirement | Implementation |
|-------------|---------------|
| HTTPS everywhere | Let's Encrypt SSL via Certbot |
| SQL injection prevention | Laravel Eloquent ORM (parameterized queries) |
| XSS prevention | Blade escaping; React JSX auto-escaping |
| CSRF protection | Laravel CSRF token middleware |
| Rate limiting | Laravel throttle middleware |
| Authentication | Laravel Sanctum |
| Admin 2FA | Google Authenticator (pragmarx/google2fa) |
| File upload validation | MIME type + file size + extension whitelist |
| Password storage | bcrypt hashing |

### 4.3 Accessibility & Localization

| Requirement | Detail |
|-------------|--------|
| Bengali-first UI | All labels, buttons, messages in Bengali by default |
| English toggle | Switchable language |
| Mobile responsive | Mobile-first design (60%+ BD internet traffic is mobile) |
| Low-bandwidth mode | WebP images, lazy loading, minimal JS bundle |

### 4.4 Scalability

| Concern | Approach |
|---------|----------|
| Database growth | Indexed foreign keys; query optimization from day one |
| Caching | Laravel file cache (built-in) for sessions and frequent queries |
| Image processing | Compress and resize on upload via queue job |
| Background work | Laravel Queue + database driver (MySQL jobs table) |
| File storage | Local disk (MVP) → cloud object storage when needed |

---

## 5. User Stories

### Seller Stories

```
As a seller, I want to create a free business profile so buyers can find my business.
As a seller, I want to list my products with photos so buyers can see what I offer.
As a seller, I want to receive enquiries with buyer contact info so I can follow up.
As a seller, I want a dashboard showing product views and enquiry counts.
As a seller, I want to reply to enquiries within the platform so communication is tracked.
As a seller, I want an in-app and email alert when a new enquiry arrives so I don't miss leads.
```

### Buyer Stories

```
As a buyer, I want to search in Bengali so I can find local suppliers easily.
As a buyer, I want to filter by location and category to find relevant results.
As a buyer, I want to send an enquiry directly from a product page.
As a buyer, I want to post a Buy Requirement so multiple sellers can quote me.
As a buyer, I want to save products to a shortlist for comparison.
As a buyer, I want to see seller ratings so I can assess trustworthiness.
```

### Admin Stories

```
As admin, I want to review and approve product listings before they go live.
As admin, I want to grant verified badges to confirmed businesses.
As admin, I want platform-wide analytics on a single dashboard.
As admin, I want to manage categories and their custom attributes.
As admin, I want to broadcast announcements to all sellers or buyers.
```

---

## 6. System Constraints

| Constraint | Detail |
|------------|--------|
| Hosting | Hostinger (shared or VPS) |
| Team size | 3–5 developers |
| Timeline | MVP in 3 months |
| Backend | PHP 8.3 / Laravel 11 |
| Frontend | React 18 + Inertia.js + Tailwind CSS 3 |
| Database | MySQL 8.0 |
| Cache | Laravel file cache (built-in, no extra service) |
| Payment | None — fully free platform |

---

## 7. Compliance & Legal

### 7.1 Regulatory Compliance

| Regulation | Applicability | Action Required |
|-----------|---------------|----------------|
| Bangladesh ICT Act 2006 (amended 2013) | Content moderation, data handling | Content policy, takedown procedures |
| Digital Security Act 2018 | Data protection, cybersecurity | Secure data storage, incident reporting |
| Consumer Rights Protection Act 2009 | Buyer protection | Clear terms of service, dispute process |
| VAT & Tax (NBR) | Platform operations | Standard compliance |

### 7.2 Platform Policies Required

- Terms of Service
- Privacy Policy (Bengali + English)
- Seller Agreement
- Acceptable Use Policy
- Content Moderation Guidelines
- Intellectual Property / Counterfeit Policy

---

## 8. Phased Delivery Roadmap

### Phase 1: MVP (Month 1–3)

**Goal:** Core free marketplace with seller listings and buyer enquiry flow

| Module | Features |
|--------|----------|
| Auth | Registration, login, OTP, email verification |
| Seller | Profile creation, product listing (CRUD), basic dashboard |
| Buyer | Search, browse, send enquiry, save products |
| Admin | User management, product moderation, category management |
| SEO | Friendly URLs, meta tags, sitemap |
| Public | Homepage, category pages, product pages, seller pages |

### Phase 2: Engagement (Month 4–5)

| Module | Features |
|--------|----------|
| Messaging | In-app chat between buyer and seller |
| RFQ System | Buy requirements, seller quotes |
| Reviews | Star ratings and written reviews |
| Notifications | Daily digest, enhanced in-app notifications and email |
| Analytics | Seller dashboard: views and enquiry stats |

### Phase 3: Growth (Month 6–8)

| Module | Features |
|--------|----------|
| Search | Meilisearch (self-hosted) for typo-tolerant Bengali search |
| Mobile | Progressive Web App (PWA) |
| Admin | Advanced moderation tools, bulk actions |
| SEO | Structured data, OpenGraph, advanced sitemap |
| Featured listings | Admin-curated promoted products (merit-based, free) |

---

*End of Master Requirement Document*
