# B2B Marketplace Platform — Bangladesh
## API Specification

> **Version:** 1.0.0  
> **Framework:** Laravel 11 + Inertia.js  
> **Date:** 2026-03-01  
> **Note:** Most routes use Inertia.js (server-rendered pages). REST JSON endpoints are used for AJAX interactions and mobile-readiness.

---

## Table of Contents

1. [API Conventions](#1-api-conventions)
2. [Authentication APIs](#2-authentication-apis)
3. [Seller APIs](#3-seller-apis)
4. [Buyer APIs](#4-buyer-apis)
5. [Search APIs](#5-search-apis)
6. [Enquiry APIs](#6-enquiry-apis)
7. [Messaging APIs](#7-messaging-apis)
8. [RFQ APIs](#8-rfq-apis)
9. [Review APIs](#9-review-apis)
10. [Notification APIs](#10-notification-apis)
11. [Admin APIs](#11-admin-apis)
12. [Public APIs](#12-public-apis)
13. [Error Codes](#13-error-codes)

---

## 1. API Conventions

### 1.1 Base URL

```
https://marketplace.com.bd/api/v1
```

### 1.2 Standard Response Format

**Success:**
```json
{
    "success": true,
    "data": { ... },
    "message": "Optional message"
}
```

**Error:**
```json
{
    "success": false,
    "message": "Human-readable error message",
    "error_code": "AUTH_001",
    "errors": {
        "field_name": ["Validation error message"]
    }
}
```

**Pagination:**
```json
{
    "success": true,
    "data": [ ... ],
    "meta": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 20,
        "total": 94,
        "from": 1,
        "to": 20
    },
    "links": {
        "first": "https://...",
        "last":  "https://...",
        "prev":  null,
        "next":  "https://..."
    }
}
```

### 1.3 Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer {sanctum_token}
```

### 1.4 Rate Limiting

| Route Group | Limit |
|-------------|-------|
| OTP send | 1 per minute per email |
| Login attempts | 5 per 15 minutes per IP |
| Enquiry send | 20 per day per user |
| General API | 300 per minute per user |
| Public API (guest) | 60 per minute per IP |

---

## 2. Authentication APIs

### POST `/api/v1/auth/otp/send`

Send OTP to email address.

**Body:**
```json
{
    "email": "user@example.com",
    "purpose": "registration"    // "registration" | "login" | "password_reset"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "expires_in": 300,
        "email": "us***@example.com"
    },
    "message": "OTP sent to your email address."
}
```

---

### POST `/api/v1/auth/otp/verify`

Verify OTP and issue auth token.

**Body:**
```json
{
    "email": "user@example.com",
    "code": "123456",
    "purpose": "login"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "token": "3|laravel_sanctum_token...",
        "user": {
            "id": 1,
            "name": "আবদুল করিম",
            "phone": "01712345678",
            "role": "seller",
            "avatar": null
        },
        "is_new_user": false
    }
}
```

---

### POST `/api/v1/auth/register`

Complete registration after OTP verification.

**Body:**
```json
{
    "email": "abdul@example.com",
    "otp_token": "verified_token_from_otp_verify",
    "name": "আবদুল করিম",
    "phone": "01712345678",
    "role": "seller",
    "password": "optional_password"
}
```

---

### POST `/api/v1/auth/login`

Email + password login (alternative to OTP).

**Body:**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "device_name": "web"
}
```

---

### POST `/api/v1/auth/logout`

**Auth Required:** Yes

Revokes the current token.

---

### GET `/api/v1/auth/me`

**Auth Required:** Yes

Get authenticated user profile.

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "আবদুল করিম",
        "email": "abdul@example.com",
        "phone": "01712345678",
        "role": "seller",
        "avatar": null,
        "seller_profile": {
            "slug": "abdul-textile-bd",
            "business_name_bn": "আব্দুল টেক্সটাইল",
            "is_verified": false,
            "profile_completed": 75
        }
    }
}
```

---

## 3. Seller APIs

### GET `/api/v1/seller/dashboard`

**Auth Required:** Yes (seller)

Seller dashboard stats.

**Response:**
```json
{
    "success": true,
    "data": {
        "products": {
            "total": 45,
            "active": 38,
            "pending": 5,
            "rejected": 2
        },
        "enquiries": {
            "total": 312,
            "new": 14,
            "this_month": 42
        },
        "views": {
            "products_total": 8540,
            "profile_total": 1230,
            "this_week": 340
        }
    }
}
```

---

### GET `/api/v1/seller/profile`

**Auth Required:** Yes (seller)

Get own seller profile.

---

### PUT `/api/v1/seller/profile`

**Auth Required:** Yes (seller)

Update seller profile.

**Body:**
```json
{
    "business_name_bn": "আব্দুল টেক্সটাইল",
    "business_name_en": "Abdul Textile",
    "tagline_bn": "মানসম্পন্ন পোশাক সরবরাহকারী",
    "description_bn": "...",
    "business_type": "manufacturer",
    "division": "Dhaka",
    "district": "Gazipur",
    "area": "Konabari",
    "phone": "01712345678",
    "website": "https://abdultextile.com"
}
```

---

### POST `/api/v1/seller/profile/logo`

**Content-Type:** `multipart/form-data`  
Upload seller logo. Body: `logo` (image, max 2MB)

---

### GET `/api/v1/seller/products`

**Auth Required:** Yes (seller)

List own products with pagination.

**Query:** `?status=active&page=1&per_page=20`

---

### POST `/api/v1/seller/products`

**Auth Required:** Yes (seller)

Create new product.

**Body:**
```json
{
    "name_bn": "সুতি কাপড়",
    "name_en": "Cotton Fabric",
    "category_id": 5,
    "description_bn": "উচ্চমানের সুতি কাপড়...",
    "price_min": 50000,
    "price_max": 100000,
    "price_unit": "per yard",
    "moq": "100",
    "moq_unit": "yards",
    "tags": "cotton, fabric, textile, গার্মেন্টস"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 124,
        "slug": "suti-kapor-124",
        "status": "pending",
        "message": "Product submitted for admin review."
    }
}
```

---

### PUT `/api/v1/seller/products/{id}`

**Auth Required:** Yes (seller, owns product)

Update an existing product.

---

### DELETE `/api/v1/seller/products/{id}`

**Auth Required:** Yes (seller, owns product)

Soft delete a product.

---

### POST `/api/v1/seller/products/{id}/images`

**Content-Type:** `multipart/form-data`  
**Auth Required:** Yes (seller, owns product)

Upload product images. Body: `images[]` (up to 10 files, max 5MB each)

---

### DELETE `/api/v1/seller/products/{id}/images/{image_id}`

**Auth Required:** Yes (seller, owns product)

Delete a product image.

---

## 4. Buyer APIs

### GET `/api/v1/buyer/dashboard`

**Auth Required:** Yes (buyer)

```json
{
    "success": true,
    "data": {
        "enquiries_sent": 18,
        "requirements_posted": 3,
        "saved_products": 24,
        "saved_sellers": 8
    }
}
```

---

### GET `/api/v1/buyer/saved`

**Auth Required:** Yes (buyer)

Saved products and sellers.

**Query:** `?type=products&page=1`

---

### POST `/api/v1/buyer/saved`

**Auth Required:** Yes (buyer)

Save a product or seller.

**Body:**
```json
{
    "saveable_type": "product",
    "saveable_id": 124
}
```

---

### DELETE `/api/v1/buyer/saved/{id}`

**Auth Required:** Yes (buyer)

Remove from saved list.

---

## 5. Search APIs

### GET `/api/v1/search`

Search products and sellers.

**Auth:** Not required.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search keyword (Bengali or English) |
| `category_id` | integer | Filter by category |
| `district` | string | Filter by seller district |
| `price_min` | integer | Minimum price in paisa |
| `price_max` | integer | Maximum price in paisa |
| `sort` | string | `relevance` \| `newest` \| `price_asc` \| `price_desc` |
| `page` | integer | Page number |

**Example:** `GET /api/v1/search?q=সুতি+কাপড়&category_id=5&district=Dhaka`

**Response:**
```json
{
    "success": true,
    "data": {
        "products": [
            {
                "id": 124,
                "slug": "suti-kapor-124",
                "name_bn": "সুতি কাপড়",
                "name_en": "Cotton Fabric",
                "price_min": 50000,
                "price_max": 100000,
                "price_unit": "per yard",
                "moq": "100 yards",
                "thumbnail": "https://...",
                "seller": {
                    "slug": "abdul-textile-bd",
                    "business_name_bn": "আব্দুল টেক্সটাইল",
                    "district": "Gazipur",
                    "is_verified": true,
                    "rating": 4.5
                }
            }
        ],
        "total": 94,
        "query": "সুতি কাপড়"
    },
    "meta": { "current_page": 1, "last_page": 5, "per_page": 20, "total": 94 }
}
```

---

### GET `/api/v1/search/suggestions`

Autocomplete suggestions as user types.

**Query:** `?q=সুতি`

**Response:**
```json
{
    "success": true,
    "data": [
        "সুতি কাপড়",
        "সুতি শাড়ি",
        "সুতি থ্রি-পিস"
    ]
}
```

---

## 6. Enquiry APIs

### POST `/api/v1/enquiries`

**Auth Required:** Yes

Send an enquiry on a product.

**Body:**
```json
{
    "product_id": 124,
    "quantity": "500 yards",
    "message": "আমরা প্রতি মাসে ৫০০ গজ কটন কাপড় ক্রয় করতে চাই।",
    "contact_name": "রহিম উদ্দিন",
    "contact_phone": "01987654321",
    "contact_email": "rahim@example.com",
    "contact_company": "Rahim Garments Ltd"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "enquiry_id": 890,
        "message": "Enquiry sent. The seller will contact you shortly."
    }
}
```

---

### GET `/api/v1/seller/enquiries`

**Auth Required:** Yes (seller)

List all received enquiries.

**Query:** `?status=new&page=1`

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 890,
            "product": {
                "id": 124,
                "name_bn": "সুতি কাপড়",
                "thumbnail": "https://..."
            },
            "contact_name": "রহিম উদ্দিন",
            "contact_phone": "01987654321",
            "contact_company": "Rahim Garments Ltd",
            "quantity": "500 yards",
            "message": "আমরা প্রতি মাসে...",
            "status": "new",
            "created_at": "2026-03-01T10:30:00Z"
        }
    ],
    "meta": { "current_page": 1, "last_page": 3, "per_page": 20, "total": 55 }
}
```

---

### PATCH `/api/v1/seller/enquiries/{id}/status`

**Auth Required:** Yes (seller)

Update enquiry status.

**Body:** `{ "status": "contacted" }`

---

### POST `/api/v1/seller/enquiries/{id}/reply`

**Auth Required:** Yes (seller)

Reply to an enquiry.

**Body:** `{ "reply": "ধন্যবাদ। আমরা আপনার সাথে যোগাযোগ করব।" }`

---

### GET `/api/v1/buyer/enquiries`

**Auth Required:** Yes (buyer)

Buyer's sent enquiries list.

---

## 7. Messaging APIs

### GET `/api/v1/conversations`

**Auth Required:** Yes (buyer or seller)

List all conversations.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 44,
            "other_party": {
                "name": "আব্দুল টেক্সটাইল",
                "avatar": null,
                "role": "seller"
            },
            "last_message": "আমাদের সাথে যোগাযোগ রাখুন।",
            "last_message_at": "2026-03-01T12:00:00Z",
            "unread_count": 2
        }
    ]
}
```

---

### GET `/api/v1/conversations/{id}/messages`

**Auth Required:** Yes (participant)

Messages in a conversation (paginated, newest first).

---

### POST `/api/v1/conversations/{id}/messages`

**Auth Required:** Yes (participant)

Send a message.

**Body:** `{ "body": "Message text here" }`

---

### POST `/api/v1/conversations/{id}/read`

Mark conversation as read.

---

## 8. RFQ APIs

### GET `/api/v1/requirements`

**Auth:** Not required.

Browse open buy requirements.

**Query:** `?category_id=5&page=1`

---

### POST `/api/v1/buyer/requirements`

**Auth Required:** Yes (buyer)

Post a buy requirement.

**Body:**
```json
{
    "title": "কটন ফ্যাব্রিক দরকার",
    "description": "প্রতি মাসে ৫০০ গজ ৩০-কাউন্ট কটন ফ্যাব্রিক চাই",
    "category_id": 5,
    "quantity": "500 yards/month",
    "target_price": "৳50-৳70 per yard",
    "location": "Gazipur, Dhaka",
    "expires_at": "2026-04-01"
}
```

---

### POST `/api/v1/requirements/{id}/quotes`

**Auth Required:** Yes (seller)

Submit a quote on a requirement.

**Body:**
```json
{
    "price_offer": "৳55 per yard (minimum 200 yards)",
    "message": "আমরা আপনার চাহিদা পূরণ করতে সক্ষম।"
}
```

---

### PATCH `/api/v1/buyer/requirements/{id}`

**Auth Required:** Yes (buyer, owns requirement)

Update or close requirement.

**Body:** `{ "status": "closed" }`

---

## 9. Review APIs

### POST `/api/v1/reviews`

**Auth Required:** Yes (buyer)

Submit a seller review.

**Body:**
```json
{
    "seller_id": 12,
    "enquiry_id": 890,
    "rating": 5,
    "review": "অসাধারণ পণ্য এবং দ্রুত ডেলিভারি।"
}
```

---

### GET `/api/v1/sellers/{slug}/reviews`

**Auth:** Not required.

Get reviews for a seller (paginated).

---

### POST `/api/v1/seller/reviews/{id}/reply`

**Auth Required:** Yes (seller)

Reply to a review left on own profile.

**Body:** `{ "reply": "ধন্যবাদ আপনার মতামতের জন্য।" }`

---

## 10. Notification APIs

### GET `/api/v1/notifications`

**Auth Required:** Yes

Get unread notifications.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid-...",
            "type": "NewEnquiry",
            "data": {
                "enquiry_id": 890,
                "product_name": "সুতি কাপড়",
                "buyer_name": "রহিম উদ্দিন",
                "message": "আপনার পণ্যে নতুন একটি জিজ্ঞাসা এসেছে।"
            },
            "read_at": null,
            "created_at": "2026-03-01T10:30:00Z"
        }
    ],
    "meta": { "unread_count": 3 }
}
```

---

### PATCH `/api/v1/notifications/{id}/read`

Mark a notification as read.

---

### POST `/api/v1/notifications/read-all`

Mark all notifications as read.

---

## 11. Admin APIs

### GET `/api/v1/admin/dashboard`

**Auth Required:** Yes (admin)

```json
{
    "success": true,
    "data": {
        "users": { "total": 5240, "sellers": 2100, "buyers": 3140, "today": 24 },
        "products": { "total": 42000, "active": 38000, "pending": 450, "rejected": 200 },
        "enquiries": { "total": 85000, "today": 340, "this_week": 2100 },
        "chart_data": {
            "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "users": [12, 19, 15, 22, 18, 30, 24],
            "enquiries": [120, 180, 150, 210, 190, 280, 340]
        }
    }
}
```

---

### GET `/api/v1/admin/users`

**Query:** `?role=seller&status=active&search=rahim&page=1`

---

### PATCH `/api/v1/admin/users/{id}/status`

**Body:** `{ "status": "suspended", "reason": "Fake listings" }`

---

### PATCH `/api/v1/admin/users/{id}/verify-seller`

Grant or revoke verified badge for a seller.

**Body:** `{ "is_verified": true }`

---

### GET `/api/v1/admin/products/pending`

Products in the moderation queue.

---

### PATCH `/api/v1/admin/products/{id}/moderate`

Approve or reject a product.

**Body:**
```json
{
    "action": "approve"       // "approve" | "reject"
    "rejection_reason": null  // Required if action = "reject"
}
```

---

### GET `/api/v1/admin/categories`

List all categories.

---

### POST `/api/v1/admin/categories`

Create a new category.

**Body:**
```json
{
    "parent_id": null,
    "name_bn": "টেক্সটাইল ও পোশাক",
    "name_en": "Textile & Garments",
    "slug": "textile-garments",
    "sort_order": 1
}
```

---

### PUT `/api/v1/admin/categories/{id}`

Update a category.

---

### DELETE `/api/v1/admin/categories/{id}`

Delete a category (only if no products assigned).

---

## 12. Public APIs

### GET `/api/v1/categories`

Top-level categories with subcategories.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name_bn": "টেক্সটাইল ও পোশাক",
            "name_en": "Textile & Garments",
            "slug": "textile-garments",
            "icon": "https://...",
            "product_count": 8500,
            "subcategories": [
                { "id": 5, "name_bn": "সুতা ও কাপড়", "name_en": "Yarn & Fabric", "slug": "yarn-fabric" }
            ]
        }
    ]
}
```

---

### GET `/api/v1/products/{slug}`

Product detail page data.

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 124,
        "slug": "suti-kapor-124",
        "name_bn": "সুতি কাপড়",
        "name_en": "Cotton Fabric",
        "description_bn": "...",
        "price_min": 50000,
        "price_max": 100000,
        "price_unit": "per yard",
        "moq": "100",
        "moq_unit": "yards",
        "tags": "cotton, fabric, textile",
        "is_in_stock": true,
        "views_count": 342,
        "enquiries_count": 28,
        "images": [
            { "id": 1, "path": "https://...", "thumb_path": "https://..." }
        ],
        "attributes": [
            { "key_bn": "কাপড়ের ধরণ", "key_en": "Fabric Type", "value_bn": "সুতি", "value_en": "Cotton" }
        ],
        "seller": {
            "slug": "abdul-textile-bd",
            "business_name_bn": "আব্দুল টেক্সটাইল",
            "business_name_en": "Abdul Textile",
            "logo": "https://...",
            "district": "Gazipur",
            "is_verified": true,
            "rating": 4.5,
            "review_count": 38,
            "product_count": 45
        },
        "related_products": [ ... ]
    }
}
```

---

### GET `/api/v1/sellers/{slug}`

Seller public profile.

**Response:**
```json
{
    "success": true,
    "data": {
        "slug": "abdul-textile-bd",
        "business_name_bn": "আব্দুল টেক্সটাইল",
        "business_name_en": "Abdul Textile",
        "description_bn": "...",
        "business_type": "manufacturer",
        "year_established": 2010,
        "employee_count": "51-200",
        "logo": "https://...",
        "cover_image": "https://...",
        "phone": "01712345678",
        "email": "info@abdultextile.com",
        "website": "https://abdultextile.com",
        "division": "Dhaka",
        "district": "Gazipur",
        "area": "Konabari",
        "is_verified": true,
        "rating": 4.5,
        "review_count": 38,
        "views_count": 12040,
        "products": [ ... ]
    }
}
```

---

### GET `/api/v1/health`

Health check endpoint. Used by uptime monitors.

**Response:**
```json
{
    "status": "ok",
    "timestamp": "2026-03-01T10:00:00Z",
    "services": {
        "database": "ok",
        "redis": "ok"
    }
}
```

---

## 13. Error Codes

### HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (delete success) |
| 400 | Bad Request (validation error) |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role/permissions) |
| 404 | Not Found |
| 422 | Unprocessable Entity (validation) |
| 429 | Too Many Requests (rate limit) |
| 500 | Server Error |

### Application Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `AUTH_001` | Unauthenticated | No valid token provided |
| `AUTH_002` | Token expired | Sanctum token has expired |
| `AUTH_003` | Invalid credentials | Wrong email/password |
| `AUTH_004` | OTP expired | OTP code has expired (>5 min) |
| `AUTH_005` | OTP invalid | Wrong OTP code entered |
| `AUTH_006` | Too many OTP attempts | Max 3 attempts per OTP |
| `AUTH_007` | Phone already registered | Phone number in use |
| `PROD_001` | Product not found | Product does not exist |
| `PROD_002` | Not your product | Seller doesn't own this product |
| `PROD_003` | Product not approved | Product is pending/rejected |
| `ENQ_001` | Cannot enquire own product | Seller cannot enquire on own listing |
| `ENQ_002` | Enquiry limit reached | Max 20 enquiries per day |
| `ENQ_003` | Enquiry not found | Enquiry does not exist |
| `MSG_001` | Cannot message self | Self-conversation not allowed |
| `MSG_002` | Conversation blocked | Other party has blocked the conversation |
| `REV_001` | Already reviewed | One review per buyer per seller per enquiry |
| `REV_002` | Cannot review own profile | Sellers cannot review themselves |
| `GEN_001` | Forbidden | User does not have permission |
| `GEN_002` | Not found | Resource not found |
| `GEN_003` | Validation failed | Request body failed validation |
| `GEN_004` | Rate limit exceeded | Too many requests |

---

*End of API Specification Document*
