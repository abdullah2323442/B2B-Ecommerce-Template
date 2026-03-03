# B2B Marketplace Platform — Bangladesh
## Database Schema Design

> **Version:** 1.0.0  
> **Database:** MySQL 8.0  
> **Engine:** InnoDB  
> **Charset:** utf8mb4 / utf8mb4_unicode_ci  
> **Date:** 2026-03-01

---

## Table of Contents

1. [Schema Overview](#1-schema-overview)
2. [Entity Relationship Overview](#2-entity-relationship-overview)
3. [Table Definitions](#3-table-definitions)
4. [Indexes & Performance](#4-indexes--performance)
5. [Migration Order](#5-migration-order)

---

## 1. Schema Overview

### 1.1 Design Principles

- All primary keys: `BIGINT UNSIGNED AUTO_INCREMENT`
- Monetary values (prices): `INT UNSIGNED` stored in **paisa** (1 BDT = 100 paisa)
- Bengali text in dedicated `_bn` columns; English in `_en` columns
- Soft deletes (`deleted_at`) on business-critical tables
- All timestamps: MySQL `TIMESTAMP` with `DEFAULT CURRENT_TIMESTAMP`
- FULLTEXT indexes for search on product name, description, tags

### 1.2 Tables Summary

| # | Table | Description |
|---|-------|-------------|
| 1 | `users` | All registered users (buyers, sellers, admins) |
| 2 | `seller_profiles` | Extended business info for sellers |
| 3 | `categories` | Product categories (2-level tree) |
| 4 | `products` | Product and service listings |
| 5 | `product_images` | Product photo paths |
| 6 | `product_attributes` | Custom key-value attributes per product |
| 7 | `enquiries` | Buyer-to-seller enquiries |
| 8 | `buy_requirements` | Buyer public RFQ posts |
| 9 | `quotes` | Seller quotes on buy requirements |
| 10 | `conversations` | Messaging threads |
| 11 | `messages` | Individual chat messages |
| 12 | `reviews` | Seller ratings and reviews |
| 13 | `saved_items` | Buyer bookmarks |
| 14 | `notifications` | In-app notifications |
| 15 | `otps` | OTP authentication records |
| 16 | `banners` | Homepage / category banners |
| 17 | `pages` | CMS static pages |
| 18 | `activity_logs` | Admin audit trail |
| 19 | `page_views` | Analytics: product/seller view counts |

---

## 2. Entity Relationship Overview

```
┌──────────┐
│  users   │──1:1──┌─────────────────┐
└──────────┘       │  seller_profiles│
      │            └─────────────────┘
      │                    │
      │                    │──1:N──┌──────────┐──1:N──┌───────────────────┐
      │                            │ products │       │  product_images   │
      │                            └──────────┘       └───────────────────┘
      │                            │       │
      │                   categories│       │──1:N──┌───────────────────────┐
      │                            │               │  product_attributes   │
      │                            │               └───────────────────────┘
      │──1:N──┌──────────────────┐
      │       │    enquiries     │
      │       └──────────────────┘
      │──1:N──┌──────────────────┐──1:N──┌──────────┐
      │       │  buy_requirements│       │  quotes  │
      │       └──────────────────┘       └──────────┘
      │──1:N──┌──────────────────┐──1:N──┌──────────┐
      │       │  conversations   │       │ messages │
      │       └──────────────────┘       └──────────┘
      │──1:N──┌──────────────────┐
      │       │    reviews       │
      │       └──────────────────┘
      │──1:N──┌──────────────────┐
      │       │   saved_items    │
      │       └──────────────────┘
      │──1:N──┌──────────────────┐
              │  notifications   │
              └──────────────────┘
```

---

## 3. Table Definitions

### 3.1 users

```sql
CREATE TABLE `users` (
    `id`                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`              VARCHAR(255) NOT NULL,
    `email`             VARCHAR(255) NULL UNIQUE,
    `phone`             VARCHAR(20) NULL UNIQUE,
    `password`          VARCHAR(255) NULL,                  -- NULL if OTP-only auth
    `role`              ENUM('buyer', 'seller', 'admin') NOT NULL DEFAULT 'buyer',
    `status`            ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    `avatar`            VARCHAR(500) NULL,
    `email_verified_at` TIMESTAMP NULL,
    `phone_verified_at` TIMESTAMP NULL,
    `remember_token`    VARCHAR(100) NULL,
    `last_login_at`     TIMESTAMP NULL,
    `deleted_at`        TIMESTAMP NULL,
    `created_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_users_role`   (`role`),
    INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.2 seller_profiles

```sql
CREATE TABLE `seller_profiles` (
    `id`                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`             BIGINT UNSIGNED NOT NULL UNIQUE,
    `slug`                VARCHAR(255) NOT NULL UNIQUE,
    `business_name_bn`    VARCHAR(255) NOT NULL,           -- Bengali
    `business_name_en`    VARCHAR(255) NOT NULL,           -- English
    `tagline_bn`          VARCHAR(500) NULL,
    `tagline_en`          VARCHAR(500) NULL,
    `description_bn`      TEXT NULL,
    `description_en`      TEXT NULL,
    `business_type`       ENUM('manufacturer', 'wholesaler', 'retailer', 'service') NOT NULL,
    `year_established`    YEAR NULL,
    `employee_count`      ENUM('1-10', '11-50', '51-200', '201-500', '500+') NULL,
    `logo`                VARCHAR(500) NULL,
    `cover_image`         VARCHAR(500) NULL,
    `phone`               VARCHAR(20) NULL,
    `email`               VARCHAR(255) NULL,
    `website`             VARCHAR(500) NULL,
    `whatsapp`            VARCHAR(20) NULL,
    `division`            VARCHAR(100) NULL,
    `district`            VARCHAR(100) NULL,
    `area`                VARCHAR(255) NULL,
    `address_bn`          TEXT NULL,
    `address_en`          TEXT NULL,
    `gmap_lat`            DECIMAL(10, 8) NULL,
    `gmap_lng`            DECIMAL(11, 8) NULL,
    `is_verified`         BOOLEAN NOT NULL DEFAULT FALSE,   -- Admin-granted badge
    `verified_at`         TIMESTAMP NULL,
    `views_count`         INT UNSIGNED NOT NULL DEFAULT 0,
    `profile_completed`   TINYINT UNSIGNED NOT NULL DEFAULT 0,  -- Percentage 0-100
    `created_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,

    INDEX `idx_sp_slug`     (`slug`),
    INDEX `idx_sp_verified` (`is_verified`),
    INDEX `idx_sp_district` (`district`),
    FULLTEXT INDEX `ft_sp`  (`business_name_bn`, `business_name_en`, `description_bn`, `description_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.3 categories

```sql
CREATE TABLE `categories` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id`    BIGINT UNSIGNED NULL,                    -- NULL = top-level category
    `name_bn`      VARCHAR(255) NOT NULL,
    `name_en`      VARCHAR(255) NOT NULL,
    `slug`         VARCHAR(255) NOT NULL UNIQUE,
    `icon`         VARCHAR(500) NULL,
    `banner`       VARCHAR(500) NULL,
    `description`  TEXT NULL,
    `meta_title`   VARCHAR(255) NULL,
    `meta_desc`    VARCHAR(500) NULL,
    `sort_order`   INT UNSIGNED NOT NULL DEFAULT 0,
    `is_active`    BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,

    INDEX `idx_cat_parent`  (`parent_id`),
    INDEX `idx_cat_active`  (`is_active`),
    INDEX `idx_cat_slug`    (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.4 products

```sql
CREATE TABLE `products` (
    `id`               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `seller_id`        BIGINT UNSIGNED NOT NULL,            -- FK → seller_profiles.id
    `category_id`      BIGINT UNSIGNED NOT NULL,
    `slug`             VARCHAR(255) NOT NULL UNIQUE,
    `name_bn`          VARCHAR(500) NOT NULL,
    `name_en`          VARCHAR(500) NULL,
    `description_bn`   LONGTEXT NULL,
    `description_en`   LONGTEXT NULL,
    `price_min`        INT UNSIGNED NULL,                   -- In paisa
    `price_max`        INT UNSIGNED NULL,                   -- In paisa
    `price_unit`       VARCHAR(100) NULL,                   -- 'per kg', 'per piece', etc.
    `moq`              VARCHAR(100) NULL,                   -- Minimum order quantity
    `moq_unit`         VARCHAR(100) NULL,                   -- 'pieces', 'kg', 'dozen', etc.
    `tags`             VARCHAR(1000) NULL,                  -- Comma-separated for FULLTEXT
    `is_in_stock`      BOOLEAN NOT NULL DEFAULT TRUE,
    `status`           ENUM('draft', 'pending', 'active', 'rejected', 'inactive') NOT NULL DEFAULT 'pending',
    `rejection_reason` TEXT NULL,
    `approved_at`      TIMESTAMP NULL,
    `approved_by`      BIGINT UNSIGNED NULL,                -- FK → users.id (admin)
    `views_count`      INT UNSIGNED NOT NULL DEFAULT 0,
    `enquiries_count`  INT UNSIGNED NOT NULL DEFAULT 0,
    `deleted_at`       TIMESTAMP NULL,
    `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`seller_id`)   REFERENCES `seller_profiles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,

    INDEX `idx_prod_seller`   (`seller_id`),
    INDEX `idx_prod_category` (`category_id`),
    INDEX `idx_prod_status`   (`status`),
    INDEX `idx_prod_stock`    (`is_in_stock`),
    INDEX `idx_prod_created`  (`created_at`),
    FULLTEXT INDEX `ft_prod`  (`name_bn`, `name_en`, `description_bn`, `tags`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.5 product_images

```sql
CREATE TABLE `product_images` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `path`       VARCHAR(500) NOT NULL,                     -- Full-size WebP
    `thumb_path` VARCHAR(500) NULL,                         -- Thumbnail WebP
    `alt_text`   VARCHAR(255) NULL,
    `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,

    INDEX `idx_pi_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.6 product_attributes

```sql
CREATE TABLE `product_attributes` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `key_bn`     VARCHAR(255) NOT NULL,                     -- e.g., 'কাপড়ের ধরণ'
    `key_en`     VARCHAR(255) NOT NULL,                     -- e.g., 'Fabric Type'
    `value_bn`   VARCHAR(500) NOT NULL,                     -- e.g., 'সুতি'
    `value_en`   VARCHAR(500) NULL,                         -- e.g., 'Cotton'
    `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,

    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,

    INDEX `idx_pa_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.7 enquiries

```sql
CREATE TABLE `enquiries` (
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id`    BIGINT UNSIGNED NOT NULL,
    `seller_id`     BIGINT UNSIGNED NOT NULL,               -- Denormalized for quick access
    `buyer_id`      BIGINT UNSIGNED NOT NULL,
    `quantity`      VARCHAR(255) NULL,                      -- Free text: '100 pieces'
    `message`       TEXT NOT NULL,
    `contact_name`  VARCHAR(255) NOT NULL,
    `contact_phone` VARCHAR(20) NOT NULL,
    `contact_email` VARCHAR(255) NULL,
    `contact_company` VARCHAR(255) NULL,
    `status`        ENUM('new', 'contacted', 'closed') NOT NULL DEFAULT 'new',
    `seller_reply`  TEXT NULL,
    `replied_at`    TIMESTAMP NULL,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`seller_id`)  REFERENCES `seller_profiles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`buyer_id`)   REFERENCES `users`(`id`) ON DELETE CASCADE,

    INDEX `idx_enq_seller`  (`seller_id`),
    INDEX `idx_enq_buyer`   (`buyer_id`),
    INDEX `idx_enq_product` (`product_id`),
    INDEX `idx_enq_status`  (`status`),
    INDEX `idx_enq_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.8 buy_requirements

```sql
CREATE TABLE `buy_requirements` (
    `id`             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `buyer_id`       BIGINT UNSIGNED NOT NULL,
    `category_id`    BIGINT UNSIGNED NULL,
    `title`          VARCHAR(500) NOT NULL,
    `description`    TEXT NOT NULL,
    `quantity`       VARCHAR(255) NULL,
    `target_price`   VARCHAR(255) NULL,                     -- Free text: '৳500-৳1000/kg'
    `location`       VARCHAR(255) NULL,                     -- Preferred supplier location
    `status`         ENUM('open', 'closed', 'expired') NOT NULL DEFAULT 'open',
    `expires_at`     TIMESTAMP NULL,
    `quotes_count`   INT UNSIGNED NOT NULL DEFAULT 0,
    `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`buyer_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,

    INDEX `idx_br_buyer`    (`buyer_id`),
    INDEX `idx_br_category` (`category_id`),
    INDEX `idx_br_status`   (`status`),
    INDEX `idx_br_expires`  (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.9 quotes

```sql
CREATE TABLE `quotes` (
    `id`                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `buy_requirement_id` BIGINT UNSIGNED NOT NULL,
    `seller_id`          BIGINT UNSIGNED NOT NULL,
    `price_offer`        VARCHAR(255) NULL,                 -- Free text quoted price
    `message`            TEXT NOT NULL,
    `is_selected`        BOOLEAN NOT NULL DEFAULT FALSE,    -- Buyer selected this quote
    `created_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `uq_quote_seller_req` (`buy_requirement_id`, `seller_id`),

    FOREIGN KEY (`buy_requirement_id`) REFERENCES `buy_requirements`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`seller_id`)          REFERENCES `seller_profiles`(`id`) ON DELETE CASCADE,

    INDEX `idx_q_requirement` (`buy_requirement_id`),
    INDEX `idx_q_seller`      (`seller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.10 conversations

```sql
CREATE TABLE `conversations` (
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `enquiry_id`  BIGINT UNSIGNED NULL UNIQUE,              -- Optional: started from enquiry
    `buyer_id`    BIGINT UNSIGNED NOT NULL,
    `seller_id`   BIGINT UNSIGNED NOT NULL,
    `status`      ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
    `last_message_at` TIMESTAMP NULL,
    `unread_buyer`    INT UNSIGNED NOT NULL DEFAULT 0,
    `unread_seller`   INT UNSIGNED NOT NULL DEFAULT 0,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`buyer_id`)   REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`seller_id`)  REFERENCES `users`(`id`) ON DELETE CASCADE,

    INDEX `idx_conv_buyer`  (`buyer_id`),
    INDEX `idx_conv_seller` (`seller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.11 messages

```sql
CREATE TABLE `messages` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` BIGINT UNSIGNED NOT NULL,
    `sender_id`       BIGINT UNSIGNED NOT NULL,
    `body`            TEXT NOT NULL,
    `attachment`      VARCHAR(500) NULL,                    -- Optional file/image
    `read_at`         TIMESTAMP NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`sender_id`)       REFERENCES `users`(`id`) ON DELETE CASCADE,

    INDEX `idx_msg_conversation` (`conversation_id`),
    INDEX `idx_msg_created`      (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.12 reviews

```sql
CREATE TABLE `reviews` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `seller_id`  BIGINT UNSIGNED NOT NULL,
    `buyer_id`   BIGINT UNSIGNED NOT NULL,
    `enquiry_id` BIGINT UNSIGNED NULL,
    `rating`     TINYINT UNSIGNED NOT NULL,                 -- 1 to 5
    `review`     TEXT NULL,
    `photos`     JSON NULL,                                 -- Array of image paths
    `seller_reply`   TEXT NULL,
    `seller_replied_at` TIMESTAMP NULL,
    `is_approved`    BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `uq_review` (`seller_id`, `buyer_id`, `enquiry_id`),

    FOREIGN KEY (`seller_id`)  REFERENCES `seller_profiles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`buyer_id`)   REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries`(`id`) ON DELETE SET NULL,

    INDEX `idx_rev_seller`   (`seller_id`),
    INDEX `idx_rev_approved` (`is_approved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.13 saved_items

```sql
CREATE TABLE `saved_items` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`      BIGINT UNSIGNED NOT NULL,
    `saveable_id`  BIGINT UNSIGNED NOT NULL,
    `saveable_type` VARCHAR(255) NOT NULL,                  -- 'Product' | 'SellerProfile'
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY `uq_saved` (`user_id`, `saveable_id`, `saveable_type`),

    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,

    INDEX `idx_saved_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.14 notifications

```sql
CREATE TABLE `notifications` (
    `id`          CHAR(36) PRIMARY KEY,                     -- UUID (Laravel default)
    `type`        VARCHAR(255) NOT NULL,
    `notifiable_type` VARCHAR(255) NOT NULL,
    `notifiable_id`   BIGINT UNSIGNED NOT NULL,
    `data`        JSON NOT NULL,
    `read_at`     TIMESTAMP NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_notif_notifiable` (`notifiable_type`, `notifiable_id`),
    INDEX `idx_notif_read`       (`read_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.15 otps

```sql
CREATE TABLE `otps` (
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `identifier`  VARCHAR(150) NOT NULL,               -- email address
    `code`        VARCHAR(10) NOT NULL,
    `purpose`     ENUM('registration', 'login', 'password_reset') NOT NULL,
    `attempts`    TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `verified_at` TIMESTAMP NULL,
    `expires_at`  TIMESTAMP NOT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX `idx_otp_identifier` (`identifier`),
    INDEX `idx_otp_expires`    (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.16 banners

```sql
CREATE TABLE `banners` (
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title`       VARCHAR(255) NOT NULL,
    `image`       VARCHAR(500) NOT NULL,
    `link`        VARCHAR(500) NULL,
    `position`    ENUM('homepage_hero', 'homepage_mid', 'category_top', 'sidebar') NOT NULL,
    `sort_order`  INT UNSIGNED NOT NULL DEFAULT 0,
    `is_active`   BOOLEAN NOT NULL DEFAULT TRUE,
    `starts_at`   TIMESTAMP NULL,
    `ends_at`     TIMESTAMP NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_ban_position` (`position`),
    INDEX `idx_ban_active`   (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.17 pages

```sql
CREATE TABLE `pages` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `slug`         VARCHAR(255) NOT NULL UNIQUE,
    `title_bn`     VARCHAR(500) NOT NULL,
    `title_en`     VARCHAR(500) NULL,
    `content_bn`   LONGTEXT NOT NULL,
    `content_en`   LONGTEXT NULL,
    `meta_title`   VARCHAR(255) NULL,
    `meta_desc`    VARCHAR(500) NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_page_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.18 activity_logs

```sql
CREATE TABLE `activity_logs` (
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `log_name`     VARCHAR(255) NULL DEFAULT 'default',
    `description`  TEXT NOT NULL,
    `subject_type` VARCHAR(255) NULL,
    `subject_id`   BIGINT UNSIGNED NULL,
    `causer_type`  VARCHAR(255) NULL,
    `causer_id`    BIGINT UNSIGNED NULL,
    `properties`   JSON NULL,
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX `idx_al_subject` (`subject_type`, `subject_id`),
    INDEX `idx_al_causer`  (`causer_type`, `causer_id`),
    INDEX `idx_al_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3.19 page_views

```sql
CREATE TABLE `page_views` (
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `viewable_type` VARCHAR(255) NOT NULL,                  -- 'Product' | 'SellerProfile'
    `viewable_id`   BIGINT UNSIGNED NOT NULL,
    `ip_address`    VARCHAR(45) NULL,
    `user_id`       BIGINT UNSIGNED NULL,                   -- NULL for guests
    `user_agent`    VARCHAR(500) NULL,
    `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,

    INDEX `idx_pv_viewable` (`viewable_type`, `viewable_id`),
    INDEX `idx_pv_created`  (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. Indexes & Performance

### 4.1 FULLTEXT Search Indexes

```sql
-- Products search (priority index)
ALTER TABLE products
    ADD FULLTEXT INDEX ft_products_search (name_bn, name_en, description_bn, tags);

-- Seller search
ALTER TABLE seller_profiles
    ADD FULLTEXT INDEX ft_sellers_search (business_name_bn, business_name_en, description_bn);
```

### 4.2 Composite Indexes for Common Queries

```sql
-- Seller's active products (seller dashboard and public profile)
ALTER TABLE products
    ADD INDEX idx_prod_seller_status (seller_id, status, created_at DESC);

-- Category browsing (most common public page)
ALTER TABLE products
    ADD INDEX idx_prod_cat_status_created (category_id, status, created_at DESC);

-- Enquiry inbox for seller
ALTER TABLE enquiries
    ADD INDEX idx_enq_seller_status (seller_id, status, created_at DESC);
```

### 4.3 Query Examples

```sql
-- Category page: active products in Garments, newest first
SELECT p.*, si.thumb_path, sp.business_name_en, sp.slug AS seller_slug
FROM products p
JOIN seller_profiles sp ON p.seller_id = sp.id
LEFT JOIN (
    SELECT product_id, thumb_path
    FROM product_images
    WHERE sort_order = 0
) si ON si.product_id = p.id
WHERE p.category_id = 3
  AND p.status = 'active'
  AND p.deleted_at IS NULL
ORDER BY p.created_at DESC
LIMIT 20 OFFSET 0;

-- FULLTEXT search
SELECT p.*,
    MATCH(p.name_bn, p.name_en, p.description_bn, p.tags)
        AGAINST ('পোশাক কারখানা' IN BOOLEAN MODE) AS relevance
FROM products p
WHERE p.status = 'active'
  AND p.deleted_at IS NULL
  AND MATCH(p.name_bn, p.name_en, p.description_bn, p.tags)
      AGAINST ('পোশাক কারখানা' IN BOOLEAN MODE)
ORDER BY relevance DESC
LIMIT 20;
```

---

## 5. Migration Order

### 5.1 Laravel Migration Sequence

```
1.  create_users_table
2.  create_seller_profiles_table
3.  create_categories_table
4.  create_products_table
5.  create_product_images_table
6.  create_product_attributes_table
7.  create_enquiries_table
8.  create_buy_requirements_table
9.  create_quotes_table
10. create_conversations_table
11. create_messages_table
12. create_reviews_table
13. create_saved_items_table
14. create_notifications_table
15. create_otps_table
16. create_banners_table
17. create_pages_table
18. create_activity_logs_table
19. create_page_views_table
```

### 5.2 Seeders

```
1.  CategorySeeder          — 20+ BD-relevant categories with bn/en names
2.  AdminUserSeeder         — Create initial admin account
3.  PageSeeder              — About, Terms, Privacy, Seller Agreement pages
4.  BannerSeeder            — Placeholder homepage banners
```

### 5.3 Database Size Estimate (Year 1)

| Table | Est. Rows (12 months) | Avg Row Size | Est. Size |
|-------|-----------------------|-------------|-----------|
| users | 50,000 | 400 B | ~20 MB |
| seller_profiles | 20,000 | 2 KB | ~40 MB |
| products | 200,000 | 3 KB | ~600 MB |
| product_images | 800,000 | 200 B | ~160 MB |
| enquiries | 500,000 | 800 B | ~400 MB |
| messages | 1,000,000 | 300 B | ~300 MB |
| notifications | 2,000,000 | 300 B | ~600 MB |
| page_views | 5,000,000 | 150 B | ~750 MB |
| **Total (approx.)** | | | **~3 GB** |

### 5.4 Backup Strategy

```bash
#!/bin/bash
# Daily database backup — runs at 2 AM via cron
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u marketplace_user -p marketplace_db \
    --single-transaction \
    --routines \
    --triggers \
    | gzip > /backups/marketplace_${DATE}.sql.gz

# Keep last 7 days locally
find /backups -name "*.sql.gz" -mtime +7 -delete

# Download backups to developer machine over SFTP for off-site copy
# sftp user@server:/backups /local/backup-store
```

---

*End of Database Schema Design Document*
