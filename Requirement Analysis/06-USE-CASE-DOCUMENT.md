# B2B Marketplace Platform — Bangladesh
## Detailed Use Case Document

> **Version:** 1.0.0
> **Date:** 2026-03-02
> **Actors:** Guest · Buyer · Seller · Admin

---

## Table of Contents

1. [Actors & Definitions](#1-actors--definitions)
2. [Use Case Overview Diagram](#2-use-case-overview-diagram)
3. [Use Case Index](#3-use-case-index)
4. [Authentication Use Cases](#4-authentication-use-cases)
   - UC-01 Register New Account
   - UC-02 Login via Email OTP
   - UC-03 Login via Email & Password
   - UC-04 Login via Google OAuth
   - UC-05 Reset Password
   - UC-06 Logout
5. [Guest / Public Use Cases](#5-guest--public-use-cases)
   - UC-07 Browse Homepage
   - UC-08 Search Products
   - UC-09 View Product Detail Page
   - UC-10 View Seller Public Profile
   - UC-11 Browse Category
6. [Seller Use Cases](#6-seller-use-cases)
   - UC-12 Complete Seller Profile
   - UC-13 Add Product Listing
   - UC-14 Edit Product Listing
   - UC-15 Delete Product Listing
   - UC-16 View Seller Dashboard
   - UC-17 Manage Enquiries
   - UC-18 Reply to Enquiry
   - UC-19 Export Enquiries to CSV
   - UC-20 Reply to Review
7. [Buyer Use Cases](#7-buyer-use-cases)
   - UC-21 Send Enquiry
   - UC-22 Save Product or Seller
   - UC-23 Post Buy Requirement (RFQ)
   - UC-24 Review Quotes on RFQ
   - UC-25 Submit Review for Seller
   - UC-26 View Buyer Dashboard
8. [Messaging Use Cases](#8-messaging-use-cases)
   - UC-27 Start Conversation
   - UC-28 Send Message
   - UC-29 Mark Conversation as Read
9. [Notification Use Cases](#9-notification-use-cases)
   - UC-30 View Notification Center
   - UC-31 Mark Notifications as Read
   - UC-32 Configure Notification Preferences
10. [Admin Use Cases](#10-admin-use-cases)
    - UC-33 View Admin Dashboard
    - UC-34 Moderate Product Listing
    - UC-35 Manage Users
    - UC-36 Grant / Revoke Verified Badge
    - UC-37 Manage Categories
    - UC-38 Manage Banners
    - UC-39 Manage CMS Pages
    - UC-40 Email Broadcast
    - UC-41 Export Platform Data
    - UC-42 View Activity Log

---

## 1. Actors & Definitions

| Actor | Description | Authentication |
|-------|-------------|----------------|
| **Guest** | Any visitor who has not signed in. Can browse and search freely but cannot interact with sellers. | None |
| **Buyer** | A registered user who wants to source products or materials from suppliers. | Email OTP or Email + Password or Google OAuth |
| **Seller** | A registered business (manufacturer, wholesaler, supplier) who wants to list products and receive leads. | Email OTP or Email + Password or Google OAuth |
| **Admin** | Platform operator with full control over all platform content, users, and settings. | Email + Password + Google Authenticator 2FA |
| **System** | Automated actions performed by the platform itself (notifications, digest emails, sitemap generation). | Internal |

---

## 2. Use Case Overview Diagram

```
                        ╔══════════════════════════════════════════════════════╗
                        ║            B2B MARKETPLACE SYSTEM                   ║
                        ╠══════════════════════════════════════════════════════╣
                        ║                                                      ║
  ┌─────────┐           ║  ┌──────────────────────────────────────────────┐   ║
  │         │           ║  │              PUBLIC / GUEST                  │   ║
  │  GUEST  │──────────►║  │  Browse Homepage · Search · View Product     │   ║
  │         │           ║  │  View Seller Profile · Browse Category       │   ║
  └─────────┘           ║  └──────────────────────────────────────────────┘   ║
                        ║                                                      ║
  ┌─────────┐           ║  ┌──────────────────────────────────────────────┐   ║
  │         │  extends  ║  │              AUTHENTICATION                  │   ║
  │  BUYER  │──────────►║  │  Register · Login (OTP/Pass/Google)          │   ║
  │         │           ║  │  Reset Password · Logout                     │   ║
  └────┬────┘           ║  └──────────────────────────────────────────────┘   ║
       │                ║                                                      ║
       │                ║  ┌──────────────────────────────────────────────┐   ║
       └───────────────►║  │              BUYER ACTIONS                   │   ║
                        ║  │  Send Enquiry · Save Product/Seller           │   ║
  ┌─────────┐           ║  │  Post RFQ · Review Seller · Dashboard         │   ║
  │         │           ║  └──────────────────────────────────────────────┘   ║
  │ SELLER  │──────────►║  ┌──────────────────────────────────────────────┐   ║
  │         │           ║  │              SELLER ACTIONS                  │   ║
  └────┬────┘           ║  │  Manage Profile · List Products              │   ║
       │                ║  │  Manage Enquiries · Quote RFQs                │   ║
       │                ║  │  Dashboard · Reply Review · Export CSV        │   ║
       └───────────────►║  └──────────────────────────────────────────────┘   ║
                        ║                                                      ║
  ┌─────────┐           ║  ┌──────────────────────────────────────────────┐   ║
  │         │           ║  │           SHARED (Buyer + Seller)            │   ║
  │ BUYER + │──────────►║  │  Messaging · Notifications                   │   ║
  │ SELLER  │           ║  └──────────────────────────────────────────────┘   ║
  └─────────┘           ║                                                      ║
                        ║  ┌──────────────────────────────────────────────┐   ║
  ┌─────────┐           ║  │              ADMIN ACTIONS                   │   ║
  │         │           ║  │  Dashboard · Moderate Products · Users       │   ║
  │  ADMIN  │──────────►║  │  Categories · Banners · CMS · Export         │   ║
  │         │           ║  │  Badge Management · Broadcast Email          │   ║
  └─────────┘           ║  └──────────────────────────────────────────────┘   ║
                        ║                                                      ║
                        ╚══════════════════════════════════════════════════════╝
```

---

## 3. Use Case Index

| UC-ID | Use Case Name | Primary Actor | Phase | FR Ref |
|-------|---------------|---------------|-------|--------|
| UC-01 | Register New Account | Guest | MVP | FR-01.1, FR-01.2 |
| UC-02 | Login via Email OTP | Guest | MVP | FR-01.3 |
| UC-03 | Login via Email & Password | Guest | MVP | FR-01.4 |
| UC-04 | Login via Google OAuth | Guest | Phase 2 | FR-01.5 |
| UC-05 | Reset Password | Buyer / Seller | MVP | FR-01.9 |
| UC-06 | Logout | Buyer / Seller / Admin | MVP | FR-01 |
| UC-07 | Browse Homepage | Guest | MVP | FR-13.7 |
| UC-08 | Search Products | Guest / Buyer / Seller | MVP | FR-05.1–FR-05.7 |
| UC-09 | View Product Detail Page | Guest / Buyer | MVP | FR-03, FR-05.8 |
| UC-10 | View Seller Public Profile | Guest / Buyer | MVP | FR-02.10 |
| UC-11 | Browse Category | Guest / Buyer | MVP | FR-04, FR-13.8 |
| UC-12 | Complete Seller Profile | Seller | MVP | FR-02.1–FR-02.11 |
| UC-13 | Add Product Listing | Seller | MVP | FR-03.1–FR-03.11 |
| UC-14 | Edit Product Listing | Seller | MVP | FR-03.1 |
| UC-15 | Delete Product Listing | Seller | MVP | FR-03.1 |
| UC-16 | View Seller Dashboard | Seller | MVP | FR-03.12, FR-03.13 |
| UC-17 | Manage Enquiries | Seller | MVP | FR-07.4, FR-07.5 |
| UC-18 | Reply to Enquiry | Seller | MVP | FR-07.6 |
| UC-19 | Export Enquiries to CSV | Seller | MVP | FR-07.9 |
| UC-20 | Reply to Review | Seller | Phase 2 | FR-10.3 |
| UC-21 | Send Enquiry | Buyer | MVP | FR-07.1–FR-07.3 |
| UC-22 | Save Product or Seller | Buyer | Phase 2 | FR-06.3 |
| UC-23 | Post Buy Requirement (RFQ) | Buyer | Phase 2 | FR-09.1–FR-09.2 |
| UC-24 | Review Quotes on RFQ | Buyer | Phase 2 | FR-09.4 |
| UC-25 | Submit Review for Seller | Buyer | Phase 2 | FR-10.1–FR-10.2 |
| UC-26 | View Buyer Dashboard | Buyer | MVP | FR-06.4 |
| UC-27 | Start Conversation | Buyer / Seller | Phase 2 | FR-08.1 |
| UC-28 | Send Message | Buyer / Seller | Phase 2 | FR-08.1–FR-08.4 |
| UC-29 | Mark Conversation as Read | Buyer / Seller | Phase 2 | FR-08.4 |
| UC-30 | View Notification Center | Buyer / Seller | MVP | FR-11.1 |
| UC-31 | Mark Notifications as Read | Buyer / Seller | MVP | FR-11.1 |
| UC-32 | Configure Notification Preferences | Buyer / Seller | Phase 2 | FR-11.3 |
| UC-33 | View Admin Dashboard | Admin | MVP | FR-12.1 |
| UC-34 | Moderate Product Listing | Admin | MVP | FR-12.3 |
| UC-35 | Manage Users | Admin | MVP | FR-12.2 |
| UC-36 | Grant / Revoke Verified Badge | Admin | Phase 2 | FR-12.5 |
| UC-37 | Manage Categories | Admin | MVP | FR-12.4 |
| UC-38 | Manage Banners | Admin | Phase 2 | FR-12.6 |
| UC-39 | Manage CMS Pages | Admin | Phase 2 | FR-12.7 |
| UC-40 | Email Broadcast | Admin | Phase 3 | FR-12.8 |
| UC-41 | Export Platform Data | Admin | Phase 2 | FR-12.9 |
| UC-42 | View Activity Log | Admin | Phase 2 | FR-12.12 |

---

## 4. Authentication Use Cases

---

### UC-01 — Register New Account

| Field | Detail |
|-------|--------|
| **Actor** | Guest |
| **Trigger** | User clicks "Register" or "Sign Up" |
| **Precondition** | User is not logged in. User has a valid email address. |
| **Postcondition** | A new account is created. User is logged in and redirected to the appropriate dashboard (Seller Profile setup or Buyer Dashboard). |
| **FR Reference** | FR-01.1, FR-01.2, FR-01.6 |

**Main Success Flow:**
```
1. Guest clicks "Register" on the homepage or login page.
2. System displays registration form:
      – Full name
      – Email address
      – Account type: [Buyer] or [Seller]
      – Password (optional — can use OTP-only login later)
3. Guest fills in the form and clicks "Send OTP".
4. System validates:
      a. Email is in valid format.
      b. Email is not already registered.
      c. Account type is selected.
5. System generates a 6-digit OTP and sends it to the email address.
6. System displays OTP entry screen.
7. Guest enters the OTP code received in email.
8. System validates:
      a. OTP matches.
      b. OTP has not expired (5-minute window).
      c. Attempt count ≤ 3.
9. System creates the user account.
10. System issues a Sanctum auth token.
11. If account type = Seller → redirect to Seller Profile Setup page (UC-12).
    If account type = Buyer → redirect to Buyer Dashboard.
12. System sends welcome email.
```

**Alternative Flows:**
```
A1. User already has an account (Step 4b fails):
    → System shows "Email already registered. Login instead?" with a link.

A2. User chooses to register with Google OAuth (if enabled in Phase 2):
    → See UC-04.
```

**Exception Flows:**
```
E1. OTP expires (Step 8b fails):
    → System shows "OTP expired. Request a new one."
    → User clicks "Resend OTP" — system resets the 5-minute timer.

E2. OTP entered incorrectly 3 times (Step 8c fails):
    → System locks OTP for 15 minutes.
    → User must request a new OTP after the lockout.

E3. Email delivery fails:
    → System shows "We couldn't send the OTP. Please check your email and try again."
```

**Business Rules:**
- One account per email address.
- Account type cannot be changed after registration (Buyer ≠ Seller).
- Password is optional — users can operate with OTP-only login.

---

### UC-02 — Login via Email OTP

| Field | Detail |
|-------|--------|
| **Actor** | Guest (returning Buyer or Seller) |
| **Trigger** | User clicks "Login" and chooses "Login with OTP" |
| **Precondition** | User has a registered account. |
| **Postcondition** | User is authenticated. Redirected to their dashboard. |
| **FR Reference** | FR-01.3, FR-01.6 |

**Main Success Flow:**
```
1. Guest navigates to the login page.
2. Guest enters registered email address and clicks "Send OTP".
3. System validates email exists in the database.
4. System generates a new 6-digit OTP and emails it.
5. System displays OTP input screen.
6. Guest types in the 6-digit OTP.
7. System validates OTP (correct, not expired, attempts ≤ 3).
8. System issues auth token and sets session.
9. System redirects to the user's last page or dashboard.
```

**Alternative Flows:**
```
A1. User wants to use password instead:
    → User clicks "Login with Password" → UC-03.
```

**Exception Flows:**
```
E1. Email not found:
    → "No account found with this email. Register instead?"

E2. OTP expired or wrong:
    → Same behaviour as UC-01 exception flows E1 and E2.
```

---

### UC-03 — Login via Email & Password

| Field | Detail |
|-------|--------|
| **Actor** | Guest (returning Buyer or Seller) |
| **Trigger** | User clicks "Login with Password" |
| **Precondition** | User registered with a password. |
| **Postcondition** | User is authenticated. |
| **FR Reference** | FR-01.4 |

**Main Success Flow:**
```
1. Guest enters email and password on login page.
2. Guest clicks "Login".
3. System validates credentials (email match + bcrypt hash check).
4. System issues auth token.
5. Redirect to dashboard.
```

**Exception Flows:**
```
E1. Wrong password:
    → "Incorrect email or password." (no hint about which is wrong — security).
    → After 5 failed attempts in 15 minutes → account throttled for 15 minutes.

E2. Account suspended:
    → "Your account has been suspended. Contact support."
```

---

### UC-04 — Login via Google OAuth

| Field | Detail |
|-------|--------|
| **Actor** | Guest |
| **Trigger** | User clicks "Continue with Google" |
| **Precondition** | Google OAuth is configured in the platform. |
| **Postcondition** | User is authenticated. New account created if first time. |
| **FR Reference** | FR-01.5 |
| **Phase** | Phase 2 |

**Main Success Flow:**
```
1. Guest clicks "Continue with Google".
2. System redirects to Google authorization page.
3. User grants permission to share name and email.
4. Google redirects back to the platform with an auth code.
5. System exchanges code for user profile (name, email).
6. System checks if email already exists in database:
   a. If YES → log in as existing user.
   b. If NO → prompt user to choose account type (Buyer / Seller),
              then create a new account.
7. System issues auth token and redirects to dashboard.
```

**Exception Flows:**
```
E1. User denies Google permission:
    → Redirect back to login page. Show "Google login was cancelled."
```

---

### UC-05 — Reset Password

| Field | Detail |
|-------|--------|
| **Actor** | Buyer / Seller |
| **Trigger** | User clicks "Forgot Password" on the login page |
| **Precondition** | User has a registered account. |
| **Postcondition** | User's password is updated. User can now log in with new password. |
| **FR Reference** | FR-01.9 |

**Main Success Flow:**
```
1. User clicks "Forgot Password" on the login page.
2. System displays "Enter your registered email" screen.
3. User enters email and clicks "Send OTP".
4. System validates email exists and sends an OTP with purpose = "password_reset".
5. User enters OTP.
6. System validates OTP.
7. System displays "Set New Password" form.
8. User enters and confirms new password.
9. System validates: password ≥ 8 characters, passwords match.
10. System updates password hash in database.
11. System invalidates all existing auth tokens for this user (force re-login).
12. System redirects to login page with "Password updated successfully."
```

---

### UC-06 — Logout

| Field | Detail |
|-------|--------|
| **Actor** | Buyer / Seller / Admin |
| **Trigger** | User clicks "Logout" |
| **Precondition** | User is authenticated. |
| **Postcondition** | Auth token is revoked. Session cleared. User is guest again. |

**Main Success Flow:**
```
1. User clicks "Logout" in the navigation menu.
2. System revokes the current Sanctum token.
3. System clears the session.
4. System redirects to homepage.
```

---

## 5. Guest / Public Use Cases

---

### UC-07 — Browse Homepage

| Field | Detail |
|-------|--------|
| **Actor** | Guest |
| **Trigger** | User opens the platform URL |
| **Precondition** | None |
| **Postcondition** | Homepage is displayed. |
| **FR Reference** | FR-13.7 |

**Main Success Flow:**
```
1. User opens marketplace.com.bd.
2. System displays homepage:
   a. Hero search bar (Bengali + English placeholder text).
   b. Featured category tiles (Textiles, Electronics, Food, etc.).
   c. Latest approved products (paginated, newest first).
   d. Top verified sellers section.
   e. Banner/announcement area (admin-managed).
3. User can click any category → UC-11.
4. User can click any product → UC-09.
5. User can click any seller → UC-10.
6. User can use search → UC-08.
```

---

### UC-08 — Search Products

| Field | Detail |
|-------|--------|
| **Actor** | Guest / Buyer / Seller |
| **Trigger** | User types a keyword in the search bar and submits |
| **Precondition** | None |
| **Postcondition** | Search results page is displayed with matching products. |
| **FR Reference** | FR-05.1–FR-05.7 |

**Main Success Flow:**
```
1. User types a keyword (Bengali or English) in the search bar.
2. User presses Enter or clicks the Search button.
3. System performs a MySQL FULLTEXT search across:
      – product.name_bn, product.name_en
      – product.description_bn
      – product.tags
4. System returns paginated results (20 per page), sorted by relevance by default.
5. System displays:
      – Number of results found ("৯৪টি পণ্য পাওয়া গেছে")
      – Filter panel (left or top):
            Category, Sub-category
            Location (Division, District)
            Price range (min – max)
            Sort by (Relevance / Newest / Price ↑ / Price ↓)
      – Product cards:
            Thumbnail, Name, Price range, MOQ, Seller name, District,
            Verified badge, Rating, "Send Enquiry" button
6. User can click a product card → UC-09.
7. User can adjust filters → results refresh dynamically.
8. User can navigate between pages via pagination controls.
```

**Alternative Flows:**
```
A1. Autocomplete (Phase 2):
    – As user types ≥ 2 characters, system shows up to 5 suggested
      keywords in a dropdown (UC-08.1 sub-flow).
    – User clicks a suggestion → search executes with that term.

A2. No results found:
    – System displays "কোনো পণ্য পাওয়া যায়নি" (No products found).
    – System suggests: "Did you mean...?" or related categories.
    – System shows "Post a Buy Requirement" CTA.
```

---

### UC-09 — View Product Detail Page

| Field | Detail |
|-------|--------|
| **Actor** | Guest / Buyer |
| **Trigger** | User clicks a product card from search, category, or homepage |
| **Precondition** | Product must have status = `active`. |
| **Postcondition** | Product detail page is shown. View count is incremented. |
| **FR Reference** | FR-03.2–FR-03.9, FR-05.8 |

**Main Success Flow:**
```
1. User navigates to /product/{slug}.
2. System loads the product record and increments `views_count` by 1.
3. System displays:
      – Product photo gallery (up to 10 photos, swipeable).
      – Product name (Bengali primary, English secondary).
      – Price range (e.g., ৳50 – ৳70 per yard).
      – Minimum Order Quantity (MOQ).
      – Description (Bengali).
      – Custom attributes (e.g., Fabric Type: Cotton | Width: 58 inches).
      – Tags.
      – Seller info card:
            Logo, business name, location, verified badge, rating, product count.
            Link to seller profile.
      – "Send Enquiry" button (prominent).
      – "Save" button (bookmark icon).
      – Enquiry count ("28 buyers enquired").
      – Related products section (same category, 4–6 cards).
4. If user is not logged in:
      – "Send Enquiry" button → redirect to login → then return to this page.
5. If user is logged in as Buyer:
      – "Send Enquiry" button → opens enquiry form modal → UC-21.
6. If user is logged in as Seller:
      – "Send Enquiry" button is hidden (sellers cannot enquire on products).
```

---

### UC-10 — View Seller Public Profile

| Field | Detail |
|-------|--------|
| **Actor** | Guest / Buyer |
| **Trigger** | User clicks a seller name/card anywhere on the platform |
| **Precondition** | Seller profile exists and is not suspended. |
| **Postcondition** | Public seller profile page is displayed. Profile view count incremented. |
| **FR Reference** | FR-02.10 |

**Main Success Flow:**
```
1. User navigates to /seller/{slug}.
2. System displays:
      – Cover image and logo.
      – Business name (Bengali + English).
      – Verified badge (if granted by admin).
      – Location (Division, District, Area).
      – Business type (Manufacturer / Wholesaler / etc.).
      – Year established, employee count.
      – Description.
      – Contact info:
            Phone and email visible only to logged-in users.
            Website link (visible to all).
      – Average star rating + total reviews count.
      – Tab: Products (paginated list of this seller's active products).
      – Tab: Reviews (paginated list of buyer reviews).
3. If user is Guest:
      – Contact info shows "Login to view contact details".
4. If user is logged-in Buyer:
      – Full contact info shown.
      – "Send Enquiry" CTA on each product card.
      – "Save Seller" button.
```

---

### UC-11 — Browse Category

| Field | Detail |
|-------|--------|
| **Actor** | Guest / Buyer / Seller |
| **Trigger** | User clicks a category from homepage, nav menu, or search filter |
| **Precondition** | Category exists and has active products. |
| **Postcondition** | Category listing page displayed. |
| **FR Reference** | FR-04.1, FR-13.8 |

**Main Success Flow:**
```
1. User clicks a category tile.
2. System displays:
      – Category name and banner.
      – Subcategory filter tiles.
      – All active products in this category (paginated, 20 per page).
      – Filters: subcategory, location, price, sort.
3. User can click a subcategory to narrow down.
4. User can click any product → UC-09.
```

---

## 6. Seller Use Cases

---

### UC-12 — Complete Seller Profile

| Field | Detail |
|-------|--------|
| **Actor** | Seller |
| **Trigger** | Seller logs in for the first time, or clicks "Edit Profile" |
| **Precondition** | User is authenticated with role = seller. |
| **Postcondition** | Seller profile is saved and visible at /seller/{slug}. |
| **FR Reference** | FR-02.1–FR-02.11 |

**Main Success Flow:**
```
1. After registration, Seller is redirected to Profile Setup.
2. System displays a multi-step profile form:

   STEP 1 — Business Basics
      – Business name (Bengali) *required
      – Business name (English)
      – Business type: Manufacturer / Wholesaler / Retailer / Service *required
      – Tagline / short description (Bengali)

   STEP 2 — Location & Contact
      – Division *required
      – District *required
      – Area / Thana
      – Full address
      – Business phone number *required
      – Business email (pre-filled from account)
      – Website URL (optional)

   STEP 3 — About Your Business
      – Full business description (Bengali) *required
      – Year established (optional)
      – Number of employees (optional)
      – Upload logo (JPG/PNG/WebP, max 2MB)
      – Upload cover photo (optional)

   STEP 4 — Categories & Documents
      – Select product categories (multi-select from admin categories)
      – Upload trade license or certification (optional, PDF/image)

3. Seller clicks "Save Profile".
4. System validates all required fields.
5. System generates a unique slug from the business name.
6. System saves the profile and makes it publicly accessible.
7. System shows success message: "Your profile is live at /seller/{slug}".
8. System prompts: "Add your first product listing?"
```

**Alternative Flows:**
```
A1. Profile partially filled and saved as draft:
    → Seller can leave mid-way; form state saved.
    → Profile is not publicly visible until minimum required fields are complete.
```

**Business Rules:**
- Profile slug is auto-generated from business name. If duplicate, a number suffix is appended (e.g., `abdul-textile-2`).
- Logo dimensions are resized and stored as WebP.
- Profile is immediately visible after save (no admin approval needed for profiles).

---

### UC-13 — Add Product Listing

| Field | Detail |
|-------|--------|
| **Actor** | Seller |
| **Trigger** | Seller clicks "Add New Product" in their dashboard |
| **Precondition** | Seller is authenticated. Seller profile is complete. |
| **Postcondition** | Product is submitted with status = `pending`. Admin is notified. |
| **FR Reference** | FR-03.1–FR-03.11 |

**Main Success Flow:**
```
1. Seller clicks "Add Product" in the dashboard navigation.
2. System displays the product creation form:

   SECTION 1 — Basic Info
      – Product name (Bengali) *required
      – Product name (English)
      – Category *required
      – Subcategory *required
      – Product tags (comma-separated)

   SECTION 2 — Pricing & MOQ
      – Minimum price *required
      – Maximum price (optional)
      – Price unit (per kg / per yard / per unit / per dozen / etc.) *required
      – Minimum Order Quantity (MOQ) *required
      – MOQ unit (kg / yards / units / etc.) *required

   SECTION 3 — Description
      – Product description (Bengali) *required
      – Custom attributes (dynamically generated from the selected category,
        e.g., for Textiles: Fabric Type, Thread Count, Width)

   SECTION 4 — Photos
      – Upload up to 10 product images (JPG/PNG/WebP, max 5MB each)
      – At least 1 photo required
      – First photo becomes the primary thumbnail

3. Seller clicks "Submit for Review".
4. System validates all required fields.
5. System saves the product with status = `pending`.
6. System queues an image processing job:
      – Resize images to 800×600 (display) and 200×200 (thumbnail).
      – Convert to WebP format.
7. System notifies admin of a new product in the moderation queue.
8. System shows seller: "Product submitted. Under review — typically approved within 24 hours."
9. Product appears in Seller Dashboard with status badge "⏳ Pending".
```

**Alternative Flows:**
```
A1. Seller saves as draft:
    → Status = `draft`. Not submitted to admin queue.
    → Seller can return later to complete and submit.

A2. Product previously rejected:
    → Seller edits the rejected product and resubmits.
    → Status resets to `pending`.
    → Admin sees it in the moderation queue again.
```

**Business Rules:**
- A product can only be submitted after the seller profile has a business name and at least one category.
- Price must be a positive number. Min price ≤ max price.
- At least 1 photo is required before submission.
- Tags are stripped of special characters; stored as comma-separated lowercase string.

---

### UC-14 — Edit Product Listing

| Field | Detail |
|-------|--------|
| **Actor** | Seller |
| **Trigger** | Seller clicks "Edit" on a product in their dashboard |
| **Precondition** | Seller owns the product. Product status is `active`, `draft`, or `rejected`. |
| **Postcondition** | Product is updated. If previously active, status changes to `pending` for re-review. |
| **FR Reference** | FR-03.1 |

**Main Success Flow:**
```
1. Seller clicks "Edit" next to a product.
2. System loads the product form pre-filled with existing data.
3. Seller makes changes.
4. Seller clicks "Save Changes".
5. System validates required fields.
6. System saves the updated data.
7. If previous status was `active`:
      → Status changes to `pending` (re-enters admin moderation queue).
8. If previous status was `draft` or `rejected`:
      → Status changes to `pending` upon save with photos and required fields.
9. System shows: "Changes saved. Pending admin review."
```

**Alternative Flows:**
```
A1. Minor edits to active listing (e.g., typo fix):
    – Current implementation: ALL edits trigger re-review.
    – Future enhancement: mark trivial edits vs material changes.
```

---

### UC-15 — Delete Product Listing

| Field | Detail |
|-------|--------|
| **Actor** | Seller |
| **Trigger** | Seller clicks "Delete" on a product |
| **Precondition** | Seller owns the product. |
| **Postcondition** | Product is soft-deleted. No longer visible publicly. Enquiries are preserved. |
| **FR Reference** | FR-03.1 |

**Main Success Flow:**
```
1. Seller clicks "Delete" on a product card.
2. System displays confirmation: "Are you sure you want to delete this product? This action cannot be undone."
3. Seller confirms.
4. System sets product `deleted_at` timestamp (soft delete — Eloquent SoftDeletes).
5. Product disappears from all public pages and search results immediately.
6. Product remains in seller's dashboard under a "Deleted" filter for 30 days.
7. After 30 days, a scheduled job permanently deletes the product and images.
```

**Business Rules:**
- Deleting a product does NOT delete its enquiry history.
- A product cannot be deleted while it has `pending` quotes on an RFQ.

---

### UC-16 — View Seller Dashboard

| Field | Detail |
|-------|--------|
| **Actor** | Seller |
| **Trigger** | Seller navigates to /seller/dashboard |
| **Precondition** | Seller is authenticated. |
| **Postcondition** | Dashboard is displayed with live stats. |
| **FR Reference** | FR-03.12, FR-03.13 |

**Main Success Flow:**
```
1. Seller navigates to dashboard.
2. System displays:

   STATS PANEL:
      – Total products (active / pending / rejected / draft count)
      – New enquiries (since last login or unread count)
      – Total enquiries this month
      – Product views this week
      – Profile views this week

   RECENT ENQUIRIES:
      – Last 5 enquiries with status badge (New / Contacted / Closed)
      – Buyer company name, product name, message preview, timestamp
      – "View All Enquiries" link

   MY PRODUCTS TABLE:
      – Product thumbnail, name, status, views count, enquiry count, edit/delete actions
      – Filter by status (All / Active / Pending / Rejected / Draft)
      – "Add New Product" button

   PROFILE COMPLETENESS:
      – Progress bar showing how complete the profile is (%)
      – Prompt for missing fields (logo, description, etc.)
```

---

### UC-17 — Manage Enquiries

| Field | Detail |
|-------|--------|
| **Actor** | Seller |
| **Trigger** | Seller navigates to the Enquiries section of the dashboard |
| **Precondition** | Seller is authenticated. |
| **Postcondition** | Enquiry status is updated as needed. |
| **FR Reference** | FR-07.4, FR-07.5 |

**Main Success Flow:**
```
1. Seller opens the Enquiries section.
2. System displays a filterable, paginated list of all enquiries:
      – Filter by status: All / New / Contacted / Closed
      – Each row shows:
            Product thumbnail and name
            Buyer name and company
            Enquiry message preview (truncated)
            Buyer phone and email (visible to seller)
            Quantity requested
            Date received
            Current status badge (colour-coded)
            Action buttons: [Reply] [Mark Contacted] [Mark Closed]
3. Seller reads an enquiry by clicking the row (expands full message).
4. Seller updates status:
      – [Mark as Contacted] → status changes to `contacted`
      – [Mark as Closed]   → status changes to `closed`
5. System saves the status change immediately (no page reload — AJAX).
6. Seller can filter to view only "New" enquiries to action those first.
```

---

### UC-18 — Reply to Enquiry

| Field | Detail |
|-------|--------|
| **Actor** | Seller |
| **Trigger** | Seller clicks "Reply" on an enquiry |
| **Precondition** | Seller is authenticated. Enquiry exists and belongs to this seller. |
| **Postcondition** | Reply is saved. Buyer receives in-app notification and email. |
| **FR Reference** | FR-07.6, FR-07.7 |

**Main Success Flow:**
```
1. Seller clicks "Reply" next to an enquiry.
2. System displays a reply form below the enquiry (inline or modal):
      – Shows original enquiry message for context.
      – Text area for seller's reply.
3. Seller types the reply and clicks "Send Reply".
4. System saves the reply text to `enquiries.seller_reply`.
5. System marks enquiry status as `contacted` (if not already).
6. System triggers a notification:
      – In-app notification to the buyer: "Seller replied to your enquiry."
      – Email to buyer's registered email.
7. Seller sees "Reply sent successfully."
```

**Business Rules:**
- Only one reply stored per enquiry (the latest reply overwrites the previous one — future versions may add threading).
- Seller cannot reply to their own product enquiry.

---

### UC-19 — Export Enquiries to CSV

| Field | Detail |
|-------|--------|
| **Actor** | Seller |
| **Trigger** | Seller clicks "Export CSV" in the Enquiries section |
| **Precondition** | Seller is authenticated. Has at least one enquiry. |
| **Postcondition** | A CSV file is downloaded to the seller's device. |
| **FR Reference** | FR-07.9 |

**Main Success Flow:**
```
1. Seller clicks "Export to CSV" (optionally with active status filter applied).
2. System queries all enquiries for this seller (applying current filter).
3. System generates a CSV file with columns:
      Date | Product Name | Buyer Name | Company | Phone | Email | Quantity | Message | Status
4. System streams the file as a download (Content-Disposition: attachment).
5. Seller's browser downloads the file as `enquiries-YYYY-MM-DD.csv`.
```

---

### UC-20 — Reply to Review

| Field | Detail |
|-------|--------|
| **Actor** | Seller |
| **Trigger** | Seller clicks "Reply" on a review left on their profile |
| **Precondition** | Review must be approved by admin and belong to this seller's profile. |
| **Postcondition** | Seller reply is saved and displayed publicly below the review. |
| **FR Reference** | FR-10.3 |

**Main Success Flow:**
```
1. Seller navigates to their public profile or Reviews section in dashboard.
2. Seller sees a review with no reply yet and clicks "Reply to this review".
3. System opens inline reply form.
4. Seller types their reply (max 500 characters).
5. Seller clicks "Submit Reply".
6. System saves the reply and displays it publicly under the review.
7. One reply per review (seller can edit their reply but not delete it).
```

---

## 7. Buyer Use Cases

---

### UC-21 — Send Enquiry

| Field | Detail |
|-------|--------|
| **Actor** | Buyer |
| **Trigger** | Buyer clicks "Send Enquiry" on a product detail page |
| **Precondition** | Buyer is authenticated (redirect to login if not). Product is `active`. |
| **Postcondition** | Enquiry is saved. Seller receives notification. |
| **FR Reference** | FR-07.1–FR-07.3, FR-07.8 |

**Main Success Flow:**
```
1. Buyer clicks "Send Enquiry" on a product page.
2. If not logged in → redirect to login page, then return to this product.
3. System displays the Enquiry form (modal or inline):
      – Product name (pre-filled, read-only).
      – Your Name (pre-filled from buyer profile, editable).
      – Company Name (pre-filled, editable).
      – Phone Number (pre-filled, editable).
      – Email (pre-filled, editable).
      – Quantity needed.
      – Message / requirements (text area).
4. Buyer fills in and clicks "Send Enquiry".
5. System validates:
      a. Required fields are filled.
      b. Buyer has not exceeded 20 enquiries today.
      c. Buyer is not sending an enquiry to their own product (not possible since roles differ, but validated anyway).
6. System saves enquiry with status = `new`.
7. System triggers notifications:
      – In-app notification to seller.
      – Email to seller's registered email.
8. System shows buyer: "Your enquiry was sent to the seller. They will contact you directly."
9. Enquiry appears in Buyer Dashboard under "My Enquiries".
```

**Exception Flows:**
```
E1. Buyer exceeds daily limit (20/day):
    → "You've reached today's enquiry limit (20). Try again tomorrow."

E2. Seller account is suspended:
    → Enquiry form is hidden. Product page shows "This seller is currently unavailable."
```

---

### UC-22 — Save Product or Seller

| Field | Detail |
|-------|--------|
| **Actor** | Buyer |
| **Trigger** | Buyer clicks the bookmark / heart icon on a product or seller profile |
| **Precondition** | Buyer is authenticated. |
| **Postcondition** | Item is saved to the buyer's saved list. |
| **FR Reference** | FR-06.3 |

**Main Success Flow:**
```
1. Buyer clicks the ❤️ icon on:
      – A product card (anywhere on the site), or
      – A seller profile page.
2. System checks if this item is already saved:
      a. If NOT saved → saves it (INSERT into saved_items). Icon turns filled ❤️.
      b. If already saved → removes it (DELETE). Icon reverts to empty ♡ (toggle).
3. Buyer can view all saved items at /buyer/saved:
      – Tab: Saved Products (product card list)
      – Tab: Saved Sellers (seller card list)
```

---

### UC-23 — Post Buy Requirement (RFQ)

| Field | Detail |
|-------|--------|
| **Actor** | Buyer |
| **Trigger** | Buyer clicks "Post Buy Requirement" |
| **Precondition** | Buyer is authenticated. |
| **Postcondition** | Requirement is publicly visible. Matching sellers can submit quotes. |
| **FR Reference** | FR-09.1, FR-09.2, FR-09.6 |

**Main Success Flow:**
```
1. Buyer navigates to "Post a Requirement" page.
2. System displays form:
      – Requirement title (Bengali) *required
      – Description / details *required
      – Category *required (used for seller matching)
      – Quantity needed *required
      – Target price range (optional)
      – Preferred location (optional)
      – Expiry date (default: 30 days from today)
3. Buyer clicks "Post Requirement".
4. System validates fields.
5. System saves the requirement with status = `open`.
6. System matches relevant sellers (same category) and sends them in-app notifications.
7. Requirement appears on the public "Buy Requirements" listing page.
8. Buyer's dashboard shows the requirement with a quote count counter.
```

---

### UC-24 — Review Quotes on RFQ

| Field | Detail |
|-------|--------|
| **Actor** | Buyer |
| **Trigger** | Buyer opens their posted requirement to review incoming quotes |
| **Precondition** | Buyer owns the requirement. At least one quote has been submitted. |
| **Postcondition** | Buyer contacts the preferred seller directly. |
| **FR Reference** | FR-09.4, FR-09.5 |

**Main Success Flow:**
```
1. Buyer opens a requirement from their dashboard.
2. System displays all submitted quotes:
      – Seller name, verified badge, rating.
      – Quoted price offer.
      – Message from seller.
      – Date submitted.
3. Buyer compares quotes.
4. Buyer clicks "Contact Seller" on the preferred quote.
5. System opens the seller's contact details and/or redirects to messaging → UC-27.
6. Buyer can close the requirement once they have found a supplier:
      → Clicks "Close Requirement" → status changes to `closed`.
      → Requirement removed from public listing but preserved in buyer history.
```

---

### UC-25 — Submit Review for Seller

| Field | Detail |
|-------|--------|
| **Actor** | Buyer |
| **Trigger** | Buyer clicks "Leave a Review" on a seller profile or from their enquiry history |
| **Precondition** | Buyer must have previously sent at least one enquiry to this seller. One review per buyer per seller. |
| **Postcondition** | Review is saved with status = `pending_admin_approval`. Once approved, it appears on the seller profile. |
| **FR Reference** | FR-10.1, FR-10.2 |

**Main Success Flow:**
```
1. Buyer clicks "Leave a Review" on the seller profile page.
2. System checks:
      a. Buyer has sent at least one enquiry to this seller (enforced — no fake reviews).
      b. Buyer has not already reviewed this seller.
3. System displays the review form:
      – Star rating: 1 – 5 ★ *required
      – Written review (min 20 characters) *required
      – Optional: upload up to 3 photos (product quality evidence)
4. Buyer submits review.
5. System saves review with status = `pending` (requires admin approval).
6. System notifies the seller: "A new review was submitted for your profile."
7. Admin approves or removes the review → UC-34 (review moderation).
8. Once approved, review appears publicly on the seller profile with calculated average rating.
```

**Business Rules:**
- One review per buyer per seller (enforced by unique constraint on `buyer_id + seller_id`).
- Buyers cannot review a seller they are also registered as (not possible since roles are fixed).
- Admin can remove reviews that violate community guidelines.

---

### UC-26 — View Buyer Dashboard

| Field | Detail |
|-------|--------|
| **Actor** | Buyer |
| **Trigger** | Buyer navigates to /buyer/dashboard |
| **Precondition** | Buyer is authenticated. |
| **Postcondition** | Dashboard is displayed. |
| **FR Reference** | FR-06.4 |

**Main Success Flow:**
```
1. Buyer navigates to dashboard.
2. System displays:
      – Stats: Enquiries sent (total), Requirements posted, Saved products, Saved sellers.
      – My Enquiries (recent 5):
            Product name, Seller, Date sent, Status (New/Replied/Closed).
            "View All" link.
      – My Buy Requirements:
            Title, Quotes received count, Status (Open/Closed), Expiry date.
      – Saved Items (preview — "View All Saved" link).
```

---

## 8. Messaging Use Cases

---

### UC-27 — Start Conversation

| Field | Detail |
|-------|--------|
| **Actor** | Buyer / Seller |
| **Trigger** | User clicks "Message Seller/Buyer" from an enquiry or profile page |
| **Precondition** | Both users are registered. No existing conversation between this pair. |
| **Postcondition** | A new conversation thread is created and the messages screen is opened. |
| **FR Reference** | FR-08.1, FR-08.2 |

**Main Success Flow:**
```
1. User clicks "Message" (from enquiry detail or seller profile).
2. System checks if a conversation already exists between these two users:
      a. If YES → open the existing conversation → UC-28.
      b. If NO → create a new conversation record.
3. System opens the messaging interface with an empty message thread.
4. User types a message → UC-28.
```

**Business Rules:**
- Conversations are between exactly 2 users (buyer–seller pair). Not group chats.
- A user cannot start a conversation with themselves.

---

### UC-28 — Send Message

| Field | Detail |
|-------|--------|
| **Actor** | Buyer / Seller |
| **Trigger** | User types in the message input and clicks "Send" |
| **Precondition** | An open conversation thread exists. User is a participant. |
| **Postcondition** | Message is saved. Other party notified. |
| **FR Reference** | FR-08.1–FR-08.4 |

**Main Success Flow:**
```
1. User opens a conversation thread.
2. System displays message history (oldest at top, newest at bottom).
3. User types a message in the input field.
4. User clicks "Send" or presses Enter.
5. System validates the message is not empty.
6. System saves the message with:
      – Sender ID
      – Conversation ID
      – Message body
      – Timestamp
      – read_at = NULL (unread)
7. System delivers the message using DB polling (auto-refresh every 5 seconds).
8. System sends an in-app notification to the recipient.
9. The new message appears in the thread immediately for the sender.
```

---

### UC-29 — Mark Conversation as Read

| Field | Detail |
|-------|--------|
| **Actor** | Buyer / Seller |
| **Trigger** | User opens or scrolls to the bottom of a conversation |
| **Precondition** | Conversation has unread messages for this user. |
| **Postcondition** | All messages in this thread are marked as read for this user. Unread count updates. |
| **FR Reference** | FR-08.4 |

**Main Success Flow:**
```
1. User opens a conversation.
2. System automatically marks all messages in this thread (sent to this user) as read:
      – Sets `read_at = now()` for all unread messages where recipient = current user.
3. Unread counter in the sidebar/navigation decrements accordingly.
```

---

## 9. Notification Use Cases

---

### UC-30 — View Notification Center

| Field | Detail |
|-------|--------|
| **Actor** | Buyer / Seller |
| **Trigger** | User clicks the notification bell icon in the navigation |
| **Precondition** | User is authenticated. |
| **Postcondition** | Notification panel is displayed. |
| **FR Reference** | FR-11.1 |

**Main Success Flow:**
```
1. User clicks the bell icon (shows unread badge count if > 0).
2. System opens a dropdown/panel with the latest 20 notifications, newest first.
3. Each notification shows:
      – Type icon (enquiry / message / approval / RFQ / review)
      – Short description (e.g., "Rahim Garments sent an enquiry on Cotton Fabric")
      – Relative timestamp (e.g., "2 hours ago")
      – Unread indicator (bold / highlighted background)
4. User clicks a notification:
      – System marks it as read.
      – System navigates user to the relevant page.
5. "View All Notifications" link navigates to full /notifications page.
```

---

### UC-31 — Mark Notifications as Read

| Field | Detail |
|-------|--------|
| **Actor** | Buyer / Seller |
| **Trigger** | User clicks "Mark all as read" |
| **Precondition** | User has at least one unread notification. |
| **Postcondition** | All notifications are marked as read. Badge count clears to 0. |
| **FR Reference** | FR-11.1 |

**Main Success Flow:**
```
1. User clicks "Mark all as read" button in the notification panel.
2. System sets `read_at = now()` for all unread notifications for this user.
3. Notification bell badge resets to 0.
4. All notifications visually update to "read" state.
```

---

### UC-32 — Configure Notification Preferences

| Field | Detail |
|-------|--------|
| **Actor** | Buyer / Seller |
| **Trigger** | User opens Settings → Notifications |
| **Precondition** | User is authenticated. |
| **Postcondition** | Preferences saved. Future notifications honour the preferences. |
| **FR Reference** | FR-11.3 |

**Main Success Flow:**
```
1. User navigates to Settings → Notifications.
2. System displays toggle controls:
      Sellers:
         [✅] Email — New enquiry received
         [✅] Email — Daily enquiry digest (morning)
         [✅] In-app — New enquiry
         [✅] In-app — New message
         [ ] Email — New message (optional, off by default)
         [✅] Email — Product approved / rejected
      Buyers:
         [✅] In-app — Seller replied to enquiry
         [✅] In-app — New message
         [✅] In-app — New quote on your requirement
         [ ] Email — New quote on your requirement
3. User toggles preferences and clicks "Save".
4. System saves the preferences.
```

---

## 10. Admin Use Cases

---

### UC-33 — View Admin Dashboard

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin navigates to /admin/dashboard |
| **Precondition** | User is authenticated as Admin and has passed 2FA. |
| **Postcondition** | Dashboard with live platform stats is displayed. |
| **FR Reference** | FR-12.1 |

**Main Success Flow:**
```
1. Admin logs in with email + password + Google Authenticator code.
2. System displays the admin dashboard:

   TOP STATS:
      – Total users (buyers / sellers split)
      – New users today / this week / this month
      – Total products (active / pending counts)
      – Total enquiries (today / this month)
      – Open Buy Requirements
      – Pending product reviews in queue

   CHARTS:
      – Line chart: New user registrations over last 7 days.
      – Bar chart: Enquiries sent over last 7 days.
      – Pie chart: Users by city/district (top 10).

   QUICK ACTIONS:
      – [Go to Moderation Queue] (with pending count badge)
      – [View Suspended Users]
      – [Manage Categories]
```

**Security Note:** Admin login requires 2FA. Each admin action is logged in the activity log (UC-42).

---

### UC-34 — Moderate Product Listing

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin clicks "Moderation Queue" or a new-product notification |
| **Precondition** | At least one product with status = `pending` exists. |
| **Postcondition** | Product is either `active` (approved) or `rejected` (with reason). Seller is notified. |
| **FR Reference** | FR-12.3 |

**Main Success Flow:**
```
1. Admin opens the Moderation Queue at /admin/products/pending.
2. System displays all pending products, sorted by submission time (oldest first).
3. For each product, admin sees:
      – All product photos (gallery view).
      – Product name, description, price, MOQ, category.
      – Seller name and profile link.
      – Submission timestamp.
4. Admin reviews the product.

   PATH A — Approve:
      5a. Admin clicks "Approve".
      6a. System sets product status = `active`.
      7a. Product appears publicly on the platform.
      8a. System notifies seller: "Your product [Name] has been approved and is now live."

   PATH B — Reject:
      5b. Admin clicks "Reject".
      6b. System displays a rejection reason form (dropdown + optional free text):
               – Poor quality or misleading photos
               – Incomplete product information
               – Wrong category
               – Prohibited item
               – Duplicate listing
               – Other (with mandatory text input)
      7b. Admin selects reason and clicks "Confirm Rejection".
      8b. System sets product status = `rejected`, saves rejection reason.
      9b. System notifies seller: "Your product [Name] was not approved. Reason: [reason]. You may edit and resubmit."
      10b. Seller sees the reason in their dashboard next to the rejected product.
```

**Business Rules:**
- Rejected products are not deleted. Seller can edit and resubmit.
- Admin cannot approve a product from a suspended seller account.
- Moderation queue is FIFO (first-in, first-out).

---

### UC-35 — Manage Users

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin navigates to /admin/users |
| **Precondition** | Admin is authenticated and 2FA complete. |
| **Postcondition** | User status is updated as needed. |
| **FR Reference** | FR-12.2 |

**Main Success Flow:**
```
1. Admin opens the Users list.
2. System displays a searchable, filterable table:
      – Filters: Role (All / Buyer / Seller), Status (Active / Suspended)
      – Search by name, email, phone
      – Columns: Name, Email, Role, Registered date, Products count, Enquiries count, Status, Actions
3. Admin clicks on a user to view their profile.
4. Admin can take the following actions:

   ACTIVATE: Re-enable a previously suspended account.
   SUSPEND: Temporarily block a user. Products go inactive. Enquiries locked.
            Admin must enter a reason.
   DELETE (soft delete): Anonymise and soft-delete the account.
                          Requires confirmation dialog.
```

**Business Rules:**
- Suspending a seller hides all their products from public view immediately.
- Deleting a user is soft-delete. Their data is retained for audit for 90 days.
- Admin cannot delete another admin account through this UI.

---

### UC-36 — Grant / Revoke Verified Badge

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin reviews a seller's trade license or certification documents |
| **Precondition** | Seller has uploaded trade license or certification. |
| **Postcondition** | Seller profile shows ✅ Verified badge or badge is removed. |
| **FR Reference** | FR-12.5 |

**Main Success Flow:**
```
1. Admin navigates to a seller's profile from the Admin Users list.
2. Admin reviews uploaded documents (trade license, certifications).
3. Admin clicks "Grant Verified Badge".
4. System sets `seller_profiles.is_verified = true`.
5. ✅ Verified badge appears on the seller's public profile, seller cards, and product cards.
6. System notifies seller: "Your business has been verified. A ✅ badge now appears on your profile."

   Revoking:
   1. Admin clicks "Revoke Verified Badge".
   2. System sets is_verified = false.
   3. Badge is removed immediately from all public pages.
   4. Seller is notified.
```

---

### UC-37 — Manage Categories

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin navigates to /admin/categories |
| **Precondition** | Admin is authenticated. |
| **Postcondition** | Category tree is updated. Changes reflected immediately in search and navigation. |
| **FR Reference** | FR-12.4, FR-04.1–FR-04.5 |

**Main Success Flow:**
```
1. Admin opens Category Management.
2. System displays the two-level category tree:
      – Level 1: Parent categories (e.g., Textiles & Garments)
      – Level 2: Subcategories (e.g., Yarn & Fabric, Denim, Knitwear)

   CREATE CATEGORY:
      3. Admin clicks "Add Category".
      4. Fills in: Name (Bengali) *required, Name (English), Parent category (or "Root"),
                   Icon image, Sort order, SEO meta title, SEO description.
      5. Saves. Category appears in the tree and on the public site immediately.

   EDIT CATEGORY:
      3. Admin clicks "Edit" on a category.
      4. Updates fields and saves.

   DELETE CATEGORY:
      3. Admin clicks "Delete".
      4. System checks: category has no active products assigned.
      5. If products exist → "Cannot delete. 400 products are assigned to this category."
      6. If empty → confirms deletion and removes.
```

---

### UC-38 — Manage Banners

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin navigates to /admin/banners |
| **Precondition** | Admin is authenticated. |
| **Postcondition** | Banner is live on the platform at the specified position. |
| **FR Reference** | FR-12.6 |

**Main Success Flow:**
```
1. Admin opens Banner Management.
2. System shows all current banners grouped by position:
      – Homepage Hero (top slider)
      – Homepage Mid-section
      – Category Page Top
      – Sidebar
3. Admin clicks "Add Banner".
4. System displays form:
      – Title (internal label for admin)
      – Banner image upload (recommended dimensions shown)
      – Link URL (where clicking the banner goes)
      – Position (dropdown)
      – Active toggle (on/off without deleting)
      – Start date / End date (optional scheduling)
5. Admin saves. Banner goes live immediately (or on start date if scheduled).
```

---

### UC-39 — Manage CMS Pages

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin navigates to /admin/pages |
| **Precondition** | Admin is authenticated. |
| **Postcondition** | Page content is updated and live at its URL. |
| **FR Reference** | FR-12.7 |

**Main Success Flow:**
```
1. Admin opens CMS Page Management.
2. System lists all static pages: About Us / Terms of Service / Privacy Policy / Help / Others.
3. Admin clicks "Edit" on a page.
4. System displays a rich text editor pre-filled with current content.
5. Admin edits content (supports Bengali text, headings, links, bold/italic).
6. Admin clicks "Save" → changes go live at the page's URL immediately.
```

---

### UC-40 — Email Broadcast

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin navigates to /admin/broadcast |
| **Precondition** | Admin is authenticated. |
| **Postcondition** | Email is queued for delivery to the selected user segment. |
| **FR Reference** | FR-12.8 |
| **Phase** | Phase 3 |

**Main Success Flow:**
```
1. Admin opens the Broadcast Email tool.
2. System displays form:
      – Subject line *required
      – Message body (rich text, Bengali-friendly)
      – Recipient segment (dropdown):
            → All Users
            → All Sellers
            → All Buyers
            → Sellers with no product in last 30 days
            → New registrations this week
3. Admin previews the email.
4. Admin clicks "Send Broadcast".
5. System confirms: "This will email X,XXX users. Are you sure?"
6. Admin confirms.
7. System queues all emails as individual `SendEmailNotification` jobs.
8. Emails are delivered via Hostinger SMTP.
```

**Business Rules:**
- Broadcast feature rate-limited to 2 sends per day to prevent spam.
- Users who have unsubscribed from marketing emails are excluded automatically.

---

### UC-41 — Export Platform Data

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin clicks "Export" on Users, Products, or Enquiries list |
| **Precondition** | Admin is authenticated. |
| **Postcondition** | A CSV file is downloaded. |
| **FR Reference** | FR-12.9 |

**Main Success Flow:**
```
1. Admin navigates to the relevant list (Users / Products / Enquiries).
2. Admin applies filters if needed (e.g., "All sellers registered this month").
3. Admin clicks "Export to CSV".
4. System generates the CSV with all relevant columns.
5. Browser downloads the file.

   Users Export Columns:
      ID | Name | Email | Role | Phone | Status | Registered At | City

   Products Export Columns:
      ID | Name (EN) | Category | Seller | Price Min | Price Max | Status | Created At | Views | Enquiry Count

   Enquiries Export Columns:
      ID | Product | Seller | Buyer Name | Company | Phone | Email | Quantity | Message | Status | Date
```

---

### UC-42 — View Activity Log

| Field | Detail |
|-------|--------|
| **Actor** | Admin |
| **Trigger** | Admin navigates to /admin/activity-log |
| **Precondition** | Admin is authenticated. |
| **Postcondition** | Activity log is displayed. |
| **FR Reference** | FR-12.12 |

**Main Success Flow:**
```
1. Admin opens the Activity Log.
2. System displays a reverse-chronological log of all admin actions:

   Columns: Timestamp | Admin User | Action | Subject Type | Subject ID | Description

   Example entries:
   2026-03-02 10:45  |  admin@platform.bd  |  approved    |  Product  |  #1240  |  "Cotton Fabric" approved
   2026-03-02 10:40  |  admin@platform.bd  |  suspended   |  User     |  #540   |  User "Fake Seller" suspended. Reason: fake listings
   2026-03-02 09:30  |  admin@platform.bd  |  verified    |  Seller   |  #89    |  Verified badge granted to "Abdul Textile"
   2026-03-02 09:00  |  admin@platform.bd  |  deleted     |  Category |  #12    |  Category "Test" deleted

3. Admin can filter by: Date range, Action type, Admin user.
4. Admin can export the log as CSV.
```

**Business Rules:**
- Activity log is append-only. No admin can delete log entries.
- Log is retained for a minimum of 2 years.

---

## Appendix: Use Case Relationships

```
                         ┌─────────────────────┐
                         │       UC-01          │
                         │  Register Account    │
                         └────────┬────────────┘
                                  │ extends
               ┌──────────────────┼──────────────────┐
               ▼                  ▼                   ▼
        ┌──────────┐       ┌──────────┐        ┌──────────┐
        │  UC-12   │       │  UC-26   │        │  UC-33   │
        │  Seller  │       │  Buyer   │        │  Admin   │
        │ Profile  │       │Dashboard │        │Dashboard │
        └──┬───────┘       └────┬─────┘        └────┬─────┘
           │                   │                    │
     ┌─────▼──────┐      ┌─────▼──────┐      ┌─────▼──────┐
     │   UC-13    │      │   UC-21    │      │   UC-34    │
     │  Add       │      │  Send      │      │  Moderate  │
     │  Product   │◄─────│  Enquiry   │      │  Product   │
     └─────┬──────┘      └─────┬──────┘      └────────────┘
           │                   │
     ┌─────▼──────┐      ┌─────▼──────┐
     │   UC-17    │      │   UC-23    │
     │  Manage    │      │  Post RFQ  │
     │  Enquiries │      │            │
     └─────┬──────┘      └─────┬──────┘
           │                   │
     ┌─────▼──────┐      ┌─────▼──────┐
     │   UC-18    │      │   UC-24    │
     │  Reply to  │      │  Review    │
     │  Enquiry   │      │  Quotes    │
     └─────┬──────┘      └────────────┘
           │
     ┌─────▼──────┐
     │   UC-27    │
     │  Start     │
     │Conversation│
     └─────┬──────┘
           │
     ┌─────▼──────┐
     │   UC-28    │
     │  Send      │
     │  Message   │
     └────────────┘
```

---

*End of Use Case Document — 42 Use Cases across 4 Actors*
