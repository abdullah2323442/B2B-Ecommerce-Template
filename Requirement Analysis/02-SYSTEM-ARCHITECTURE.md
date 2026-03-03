# B2B Marketplace Platform — Bangladesh
## System Architecture Document

> **Version:** 1.0.0  
> **Stack:** Laravel 11 + React 18 + MySQL 8.0  
> **Hosting:** Hostinger  
> **Date:** 2026-03-01

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Application Structure](#3-application-structure)
4. [Module Architecture](#4-module-architecture)
5. [Database Architecture](#5-database-architecture)
6. [Frontend Architecture](#6-frontend-architecture)
7. [File Storage](#7-file-storage)
8. [Search Architecture](#8-search-architecture)
9. [Caching Strategy](#9-caching-strategy)
10. [Queue & Background Jobs](#10-queue--background-jobs)
11. [Security Architecture](#11-security-architecture)
12. [Hosting & Deployment](#12-hosting--deployment)
13. [CI/CD Pipeline](#13-cicd-pipeline)
14. [Third-Party Integrations](#14-third-party-integrations)
15. [Scaling Strategy](#15-scaling-strategy)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
                        ┌─────────────────────────────────────────┐
                        │              Cloudflare CDN              │
                        │     (DDoS protection, static cache)      │
                        └─────────────────────┬───────────────────┘
                                              │
                        ┌─────────────────────▼───────────────────┐
                        │           Hostinger VPS / Server         │
                        │                                          │
                        │  ┌─────────────────────────────────┐    │
                        │  │         Nginx Web Server         │    │
                        │  │  (reverse proxy + static files)  │    │
                        │  └───────────────┬─────────────────┘    │
                        │                  │                       │
                        │  ┌───────────────▼─────────────────┐    │
                        │  │     Laravel 11 Application       │    │
                        │  │  (PHP-FPM + Inertia.js + React)  │    │
                        │  └───┬────────────┬────────────┬───┘    │
                        │      │            │            │         │
                        │  ┌───▼──┐  ┌─────▼──┐  ┌─────▼──────┐  │
                        │  │MySQL │  │ File   │  │Local/Cloud │  │
                        │  │  DB  │  │(Cache) │  │  Storage   │  │
                        │  └──────┘  └────────┘  └────────────┘  │
                        └─────────────────────────────────────────┘
```

### 1.2 Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture style | Monolithic (modular) | Small team, fast development, simple deployment |
| Frontend approach | Inertia.js + React | Server-side routing with React components; no separate SPA build pipeline; SEO-friendly |
| Database | MySQL 8.0 | Widely supported on Hostinger; team familiarity |
| Cache | Laravel file cache | Built-in, zero extra service, sufficient for MVP scale |
| Search | MySQL FULLTEXT | Free, built-in, sufficient for initial scale |
| Queue | Laravel Queue + database driver | Background jobs via MySQL jobs table (free, no extra service) |
| File storage | Local disk → cloud later | Start simple, migrate when traffic warrants |

---

## 2. Technology Stack

### 2.1 Backend

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | PHP | 8.3 |
| Framework | Laravel | 11.x |
| ORM | Eloquent | (Laravel built-in) |
| Authentication | Laravel Sanctum | 4.x |
| Authorization | Spatie Laravel Permission | 6.x |
| Media Library | Spatie Laravel Media Library | 11.x |
| Activity Log | Spatie Laravel Activitylog | 4.x |
| SEO | Artesaos SEOTools | 1.x |
| 2FA (Admin) | pragmarx/google2fa-laravel | 2.x |
| PDF generation | barryvdh/laravel-dompdf | 3.x |
| Testing | Pest PHP | 2.x |

### 2.2 Frontend

| Layer | Technology | Version |
|-------|-----------|---------|
| Bridge | Inertia.js (Laravel adapter) | 2.x |
| UI Library | React | 18.x |
| Build Tool | Vite | 5.x |
| CSS Framework | Tailwind CSS | 3.x |
| Component Library | Headless UI | 2.x |
| Icons | Heroicons | 2.x |
| State Management | React Context + useReducer (no Redux) | — |
| Internationalisation | react-i18next | 14.x |
| Forms | React Hook Form | 7.x |
| HTTP Client | Axios (Inertia handles forms natively) | 1.x |
| Charts | Recharts | 2.x |

### 2.3 Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Web Server | Nginx | Reverse proxy, static files, SSL termination |
| PHP Runtime | PHP-FPM | PHP process management |
| Database | MySQL 8.0 | Primary data store |
| Cache/Queue | Laravel file cache + DB queue | Built-in file-based caching; MySQL jobs table for queue |
| SSL | Let's Encrypt (Certbot) | Free HTTPS certificate |
| Hosting | Hostinger | VPS or Business Hosting |
| OS | Ubuntu 22.04 LTS | Server operating system |
| Process Manager | Supervisor | Queue workers and scheduler |
| Deployment | SSH + GitHub Actions | Automated deployment |
| Backup | mysqldump + cron | Daily database backups |
| CDN | Cloudflare (free tier) | DDoS protection, caching, DNS |
| Version Control | Git + GitHub | Source code management |

---

## 3. Application Structure

### 3.1 Laravel Directory Structure

```
marketplace/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── OtpController.php
│   │   │   │   ├── LoginController.php
│   │   │   │   └── RegisterController.php
│   │   │   ├── Seller/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── EnquiryController.php
│   │   │   │   └── ProfileController.php
│   │   │   ├── Buyer/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── EnquiryController.php
│   │   │   │   └── SavedItemController.php
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── UserController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   └── SettingsController.php
│   │   │   └── Public/
│   │   │       ├── HomeController.php
│   │   │       ├── SearchController.php
│   │   │       ├── ProductController.php
│   │   │       └── SellerController.php
│   │   ├── Middleware/
│   │   │   ├── EnsureSeller.php
│   │   │   ├── EnsureBuyer.php
│   │   │   ├── EnsureAdmin.php
│   │   │   └── SetLocale.php
│   │   └── Requests/
│   │       ├── StoreProductRequest.php
│   │       ├── SendEnquiryRequest.php
│   │       └── UpdateProfileRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── SellerProfile.php
│   │   ├── Product.php
│   │   ├── ProductImage.php
│   │   ├── ProductAttribute.php
│   │   ├── Category.php
│   │   ├── Enquiry.php
│   │   ├── BuyRequirement.php
│   │   ├── Quote.php
│   │   ├── Message.php
│   │   ├── Conversation.php
│   │   ├── Review.php
│   │   ├── SavedItem.php
│   │   ├── Banner.php
│   │   ├── Page.php
│   │   └── Notification.php
│   ├── Services/
│   │   ├── OtpService.php                    # Email OTP logic
│   │   ├── SearchService.php                 # Search logic
│   │   ├── ImageService.php                  # Image resize and compress
│   │   ├── SeoService.php                    # Meta tag generation
│   │   └── NotificationService.php           # Multi-channel notifications
│   ├── Jobs/
│   │   ├── SendEmailNotification.php
│   │   ├── ProcessProductImages.php
│   │   ├── MatchBuyRequirements.php
│   │   ├── SendLeadDigest.php
│   │   ├── GenerateSitemap.php
│   │   └── BackupDatabase.php
│   ├── Events/
│   │   ├── EnquirySent.php
│   │   └── ProductApproved.php
│   └── Listeners/
│       ├── SendEnquiryNotifications.php
│       └── NotifySellerProductApproved.php
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Auth/
│   │   │   ├── Seller/
│   │   │   ├── Buyer/
│   │   │   ├── Admin/
│   │   │   └── Public/
│   │   ├── Components/
│   │   │   ├── Shared/
│   │   │   ├── Forms/
│   │   │   └── UI/
│   │   ├── Layouts/
│   │   │   ├── AppLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   └── app.jsx
│   └── views/
│       └── app.blade.php                     # Single Blade template (Inertia root)
├── routes/
│   ├── web.php                               # All web routes (Inertia)
│   └── api.php                               # (minimal — Inertia handles most)
├── database/
│   ├── migrations/
│   └── seeders/
└── config/
```

---

## 4. Module Architecture

### 4.1 Core Modules

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Modules                          │
├─────────────┬─────────────┬─────────────┬──────────────────────┤
│    Auth     │   Seller    │    Buyer    │       Admin          │
│  Module     │   Module    │   Module   │      Module          │
├─────────────┴─────────────┴─────────────┴──────────────────────┤
│                    Shared Services Layer                         │
│   OtpService | SearchService | NotificationService │
├─────────────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                             │
│  MySQL | File Cache | Local Storage | DB Queue | Cloudflare CDN  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Request Lifecycle (Inertia.js)

```
Browser Request
      │
      ▼
Cloudflare CDN
      │ (cache miss)
      ▼
Nginx (port 443)
      │
      ▼
PHP-FPM → Laravel Bootstrap
      │
      ▼
Route Matching → Middleware Stack
      │
      ▼
Controller Action
      │
      ├─── Service Layer (business logic)
      │        │
      │        ├─ MySQL (Eloquent ORM)
      │        └─ File Cache (Laravel built-in)
      │
      ▼
Inertia::render('PageComponent', $props)
      │
      ▼
React Component hydration / full render
      │
      ▼
HTML response to browser
```

---

## 5. Database Architecture

### 5.1 Connection Configuration

```php
// config/database.php
'mysql' => [
    'driver'    => 'mysql',
    'host'      => env('DB_HOST', '127.0.0.1'),
    'port'      => env('DB_PORT', '3306'),
    'database'  => env('DB_DATABASE'),
    'username'  => env('DB_USERNAME'),
    'password'  => env('DB_PASSWORD'),
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'strict'    => true,
    'engine'    => 'InnoDB',
    'options'   => [
        PDO::ATTR_EMULATE_PREPARES => false,
    ],
],
```

### 5.2 Key Database Design Principles

- All primary keys: `BIGINT UNSIGNED AUTO_INCREMENT`
- All monetary values: `INT UNSIGNED` stored in **paisa** (1 BDT = 100 paisa)
- All timestamps: `TIMESTAMP` with `DEFAULT CURRENT_TIMESTAMP`
- Bengali text columns: `utf8mb4_unicode_ci` collation
- FULLTEXT indexes on product `name_bn`, `name_en`, `description`, `tags`
- Soft deletes on: `users`, `products`, `sellers`

> Full schema details in `03-DATABASE-SCHEMA-DESIGN.md`

---

## 6. Frontend Architecture

### 6.1 Inertia.js Pattern

Inertia eliminates the need for a separate REST API for the frontend. Laravel controllers return `Inertia::render()` responses, and React components receive props directly.

```php
// Controller
class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Seller/Products/Index', [
            'products' => ProductResource::collection(
                Product::where('seller_id', auth()->id())
                    ->with('category')
                    ->paginate(20)
            ),
        ]);
    }
}
```

```jsx
// React Page Component
export default function ProductsIndex({ products }) {
    return (
        <SellerLayout>
            <ProductTable products={products.data} />
            <Pagination links={products.links} />
        </SellerLayout>
    );
}
```

### 6.2 Component Structure

```
Pages/                          # Full page components (one per route)
  ├── Public/
  │   ├── Home.jsx
  │   ├── Search.jsx
  │   ├── Product/Show.jsx
  │   └── Seller/Show.jsx
  ├── Auth/
  │   ├── Login.jsx
  │   ├── Register.jsx
  │   └── VerifyOtp.jsx
  ├── Seller/
  │   ├── Dashboard.jsx
  │   ├── Products/Index.jsx
  │   ├── Products/Create.jsx
  │   ├── Enquiries/Index.jsx
  │   └── Profile/Edit.jsx
  ├── Buyer/
  │   ├── Dashboard.jsx
  │   ├── Enquiries/Index.jsx
  │   └── Saved/Index.jsx
  └── Admin/
      ├── Dashboard.jsx
      ├── Users/Index.jsx
      ├── Products/Moderation.jsx
      └── Categories/Index.jsx

Components/                     # Reusable components
  ├── Shared/
  │   ├── Navbar.jsx
  │   ├── Footer.jsx
  │   ├── ProductCard.jsx
  │   ├── SellerCard.jsx
  │   └── Pagination.jsx
  ├── Forms/
  │   ├── ProductForm.jsx
  │   ├── EnquiryForm.jsx
  │   └── ProfileForm.jsx
  └── UI/
      ├── Modal.jsx
      ├── Badge.jsx
      ├── Alert.jsx
      └── StarRating.jsx
```

### 6.3 Internationalisation (i18n)

```jsx
// resources/js/locales/bn.json  (Bengali — default)
// resources/js/locales/en.json  (English — fallback)

import { useTranslation } from 'react-i18next';

export function ProductCard({ product }) {
    const { t } = useTranslation();
    return (
        <div>
            <h2>{product.name_bn || product.name_en}</h2>
            <span>{t('enquiry.send')}</span>
        </div>
    );
}
```

---

## 7. File Storage

### 7.1 Storage Strategy

| Phase | Storage |
|-------|--------|
| MVP (Month 1–6) | Local disk on server (`storage/app/public`) |
| Growth (Month 6–12) | Hostinger Object Storage or additional VPS disk |
| Scale (Year 2+) | S3-compatible object storage (self-migrated via Rclone) |

### 7.2 Image Processing Pipeline

```
User Upload
      │
      ▼
Validation (MIME type, size < 5MB, extension whitelist)
      │
      ▼
Store original temporarily
      │
      ▼
Queue: ProcessProductImages job
      │
      ├── Resize to 800×600 (product display)
      ├── Resize to 200×200 (thumbnail)
      └── Convert to WebP format
      │
      ▼
Store processed images + delete original
      │
      ▼
Update product_images table with paths
```

### 7.3 File Organization

```
storage/app/public/
├── sellers/
│   ├── logos/          {seller_id}/{filename}.webp
│   └── covers/         {seller_id}/{filename}.webp
├── products/
│   ├── original/       {product_id}/{filename}.webp
│   └── thumbs/         {product_id}/{filename}.webp
├── reviews/
│   └── photos/         {review_id}/{filename}.webp
└── documents/
    └── certificates/   {seller_id}/{filename}.pdf
```

---

## 8. Search Architecture

### 8.1 Phase 1: MySQL FULLTEXT Search

```sql
-- FULLTEXT indexes on products table
ALTER TABLE products
ADD FULLTEXT INDEX ft_products (name_bn, name_en, description_bn, tags);

-- Search query
SELECT p.*, MATCH(name_bn, name_en, description_bn, tags)
    AGAINST (:query IN BOOLEAN MODE) AS relevance
FROM products p
WHERE p.status = 'active'
  AND MATCH(name_bn, name_en, description_bn, tags)
      AGAINST (:query IN BOOLEAN MODE)
ORDER BY relevance DESC
LIMIT 20 OFFSET :offset;
```

### 8.2 Phase 2: Meilisearch (Growth Phase)

When MySQL FULLTEXT becomes insufficient (typically > 50K products), migrate to Meilisearch for:
- Typo-tolerant search
- Bengali language support
- Faceted filtering
- Sub-10ms response times

```php
// Laravel Scout + Meilisearch
use Laravel\Scout\Searchable;

class Product extends Model
{
    use Searchable;

    public function toSearchableArray(): array
    {
        return [
            'id'          => $this->id,
            'name_bn'     => $this->name_bn,
            'name_en'     => $this->name_en,
            'description' => $this->description_bn,
            'tags'        => $this->tags,
            'category_id' => $this->category_id,
            'seller_city' => $this->seller->city,
        ];
    }
}
```

---

## 9. Caching Strategy

### 9.1 Cache Configuration

```php
// config/cache.php
'default' => 'file',

'stores' => [
    'file' => [
        'driver' => 'file',
        'path'   => storage_path('framework/cache/data'),
    ],
],
```

### 9.2 Cache Policy

| Data | Cache Key | TTL | Invalidation |
|------|-----------|-----|-------------|
| Homepage featured categories | `home:categories` | 1 hour | Category update |
| Category list (navbar) | `categories:nav` | 6 hours | Category CRUD |
| Seller profile | `seller:{slug}` | 30 min | Profile update |
| Product listing page | `cat:{id}:page:{n}` | 15 min | New product approved |
| Search results | `search:{hash}` | 10 min | Time-based |
| Site settings | `site:settings` | 24 hours | Settings update |
| User session | Session driver | 2 hours | Logout |

### 9.3 Cache Storage Estimate

| Data Type | Storage |
|-----------|--------|
| File-cached pages and queries (10K entries) | ~50 MB disk |
| Sessions (file driver, 1K concurrent) | ~10 MB disk |
| **Total disk overhead** | **~60 MB** |

No extra service required. All caching uses `storage/framework/cache/` on the same server.

---

## 10. Queue & Background Jobs

### 10.1 Queue Configuration

```php
// config/queue.php
'default' => 'database',

'connections' => [
    'database' => [
        'driver'      => 'database',
        'table'       => 'jobs',
        'queue'       => 'default',
        'retry_after' => 90,
    ],
],
```

### 10.2 Queued Jobs

| Job | Queue | Priority | Trigger |
|-----|-------|----------|---------|
| `SendEmailNotification` | notifications | normal | New enquiry, account events |
| `ProcessProductImages` | media | normal | Product image uploaded |
| `MatchBuyRequirements` | matching | normal | New buy requirement posted |
| `SendLeadDigest` | notifications | low | Daily cron (9 AM BST) |
| `GenerateSitemap` | maintenance | low | Daily cron (3 AM BST) |
| `CleanExpiredOtps` | maintenance | low | Hourly cron |
| `BackupDatabase` | maintenance | low | Daily cron (2 AM BST) |

### 10.3 Queue Worker Setup (Supervisor)

```ini
[program:marketplace-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/marketplace/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
numprocs=2
stdout_logfile=/var/log/supervisor/marketplace-worker.log
```

### 10.4 Scheduled Commands

```php
// routes/console.php (Laravel 11)
Schedule::command('sitemap:generate')->dailyAt('03:00');
Schedule::command('digest:leads')->dailyAt('09:00');
Schedule::command('otp:clean')->hourly();
Schedule::command('backup:run')->dailyAt('02:00');
```

---

## 11. Security Architecture

### 11.1 Authentication Flow

```
Phone Registration:
  User submits email → OTP generated → Email OTP sent → User enters OTP
  → OTP verified → Account created → Sanctum token issued

Phone Login:
  User submits email → OTP generated → Email OTP sent → User enters OTP
  → OTP verified → Sanctum token issued

Admin Login:
  Admin submits email + password → Laravel Auth → 2FA prompt
  → Google Authenticator code verified → Session created
```

### 11.2 Middleware Stack

```php
// Route groups with middleware
Route::middleware(['auth', 'verified', 'seller'])
    ->prefix('seller')
    ->group(function () { /* seller routes */ });

Route::middleware(['auth', 'verified', 'buyer'])
    ->prefix('buyer')
    ->group(function () { /* buyer routes */ });

Route::middleware(['auth', 'admin', '2fa'])
    ->prefix('admin')
    ->group(function () { /* admin routes */ });
```

### 11.3 Security Measures

| Threat | Mitigation |
|--------|-----------|
| SQL Injection | Eloquent ORM parameterized queries |
| XSS | Blade/React auto-escaping; CSP headers |
| CSRF | Laravel CSRF middleware on all state-changing requests |
| Brute force (login) | Throttle: 5 attempts / 15 minutes |
| OTP abuse | Max 3 attempts per OTP; 5 min expiry; 1 OTP per phone per minute |
| File upload abuse | MIME + extension whitelist; 5MB limit; virus scan |
| Rate limiting | Laravel ThrottleRequests middleware per route group |
| Session hijacking | Secure, HttpOnly, SameSite=Strict cookies |
| Admin access | 2FA required; IP whitelist optional |

---

## 12. Hosting & Deployment

### 12.1 Server Specifications

| Phase | Server | Specs |
|-------|--------|-------|
| MVP | Hostinger Business Hosting or VPS KVM 2 | 2 vCPU, 8GB RAM, 100GB SSD |
| Growth | Hostinger VPS KVM 4 | 4 vCPU, 16GB RAM, 200GB SSD |
| Scale | Hostinger VPS KVM 8 + Object Storage | 8 vCPU, 32GB RAM, 400GB SSD |

> **Recommended:** Hostinger VPS with Singapore or closest-to-BD datacenter for lowest latency.

### 12.2 Single Server Layout (MVP)

```
Ubuntu 22.04 VPS
│
├── Nginx (web server + reverse proxy)
│   ├── Serve static files (React build, images)
│   ├── Proxy to PHP-FPM (Laravel)
│   └── SSL termination (Let's Encrypt)
│
├── PHP-FPM 8.3 (Laravel application)
│
├── MySQL 8.0 (primary database)
│
├── File cache (storage/framework/cache — built-in, no extra service)
│
├── Supervisor
│   ├── 2× Queue workers (notifications, media)
│   └── Laravel Scheduler (via cron every minute)
│
└── Certbot (auto-renew Let's Encrypt SSL)
```

### 12.3 Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name marketplace.com.bd www.marketplace.com.bd;

    root /var/www/marketplace/public;
    index index.php;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    # Static files cache
    location ~* \.(js|css|png|jpg|jpeg|gif|webp|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Laravel routing
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    ssl_certificate     /etc/letsencrypt/live/marketplace.com.bd/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/marketplace.com.bd/privkey.pem;
}
```

### 12.4 Environment Variables

```bash
# .env (production)
APP_ENV=production
APP_DEBUG=false
APP_URL=https://marketplace.com.bd

DB_HOST=127.0.0.1
DB_DATABASE=marketplace_db
DB_USERNAME=marketplace_user
DB_PASSWORD=<strong-password>

MAIL_MAILER=smtp
MAIL_HOST=mail.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=noreply@marketplace.com.bd
MAIL_PASSWORD=<hostinger-email-password>
MAIL_ENCRYPTION=ssl

QUEUE_CONNECTION=database
CACHE_DRIVER=file
SESSION_DRIVER=file

GOOGLE_CLIENT_ID=<id>
GOOGLE_CLIENT_SECRET=<secret>
```

---

## 13. CI/CD Pipeline

### 13.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Pest tests
        run: composer test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        run: |
          ssh user@server "
            cd /var/www/marketplace &&
            git pull origin main &&
            composer install --no-dev --optimize-autoloader &&
            php artisan migrate --force &&
            php artisan config:cache &&
            php artisan route:cache &&
            php artisan view:cache &&
            npm ci && npm run build &&
            php artisan queue:restart &&
            sudo systemctl reload php8.3-fpm
          "
```

### 13.2 Zero-Downtime Deployment

Using Laravel's maintenance mode + queue restart:

```bash
php artisan down --render="errors.503" --retry=30
# ... run deployment steps ...
php artisan up
```

---

## 14. Third-Party Integrations

| Service | Provider | Purpose |
|---------|----------|---------|
| **Email** | Hostinger SMTP (built-in) | Transactional email via platform email account |
| **CDN / DNS** | Cloudflare (free) | CDN, DDoS protection, DNS |
| **Maps** | OpenStreetMap / Leaflet.js | Seller location display (no API key required) |
| **Social Login** | Google OAuth (free) | Optional Google account login |
| **SSL** | Let's Encrypt via Certbot | Free HTTPS certificate (auto-renewal) |

---

## 15. Scaling Strategy

### 15.1 When to Scale

| Trigger | Action |
|---------|--------|
| CPU consistently > 70% | Upgrade to larger Hostinger VPS |
| RAM consistently > 80% | Upgrade VPS or add dedicated Redis server |
| MySQL slow queries appearing | Add indexes; optimize queries; consider read replica |
| Disk > 80% full | Expand Hostinger VPS disk or move image storage to additional volume |
| > 500 concurrent users | Separate app server and DB server |
| > 2000 concurrent users | Load balancer + 2 app servers + managed DB |

### 15.2 Scaling Roadmap

```
Phase 1 (MVP):              Phase 2 (Growth):           Phase 3 (Scale):
Single VPS                  Separated Services           Load Balanced

┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│  1 Server    │            │  App Server  │            │ Load Balancer│
│              │            │  (Nginx+PHP) │            │  (Nginx)     │
│ Nginx        │            └──────┬───────┘            └──────┬───────┘
│ PHP-FPM      │                   │                     ┌─────┼──────┐
│ MySQL        │            ┌──────┴───────┐            ┌┴──┐ ┌┴──┐  │
│ Redis        │            │  DB Server   │            │App│ │App│  │
│ Queue Worker │            │  (MySQL +    │            │ 1 │ │ 2 │  │
│              │            │   Redis)     │            └───┘ └───┘  │
└──────────────┘            └──────────────┘                  │
                                                       ┌───────┴──────┐
                                                       │  Managed DB  │
                                                       │   + Redis    │
                                                       └──────────────┘
```

---

*End of System Architecture Document*
