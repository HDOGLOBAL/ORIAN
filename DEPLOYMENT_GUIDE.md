# HDO Trade — Multi-Domain Deployment Guide
## VPS + Cloudflare + Nginx Setup

---

## 1. Domain Summary & Purpose

| Domain | Language | Currency | Role |
|---|---|---|---|
| **hdotrade.pt** | English (global) | EUR / GBP / USD | **Main canonical domain** — connect .com to this |
| hdotrade.com | English (USA/global) | USD or EUR (toggle) | US/global market, UK flag option |
| hdotrade.co.uk | English (UK) | GBP | UK market |
| hdotrade.de | Deutsch (German) | EUR | German market |
| hdotrade.es | Español | EUR | Spanish market |
| hdotrade.fr | Français | EUR | French market |
| hdotrade.co.il | עברית (Hebrew) | — | Israeli market |

---

## 2. Cloudflare DNS — Add All Domains

For **each domain**, add these DNS records in Cloudflare:

```
Type: A
Name: @
Value: YOUR_VPS_IP
Proxied: YES (orange cloud)

Type: A
Name: www
Value: YOUR_VPS_IP
Proxied: YES (orange cloud)
```

Do this for:
- hdotrade.pt
- hdotrade.com
- hdotrade.co.uk
- **hdotrade.de** ← NEW
- hdotrade.es
- hdotrade.fr
- hdotrade.co.il

**In Cloudflare for each domain:**
- SSL/TLS → Full (strict)
- Edge Certificates → Always Use HTTPS ON
- Minimum TLS: 1.2

---

## 3. VPS — Nginx Configuration

Install Nginx if not installed:
```bash
sudo apt update && sudo apt install nginx certbot python3-certbot-nginx -y
```

### 3a. Main app config (hdotrade.pt — canonical)

File: `/etc/nginx/sites-available/hdotrade`

```nginx
# ─── hdotrade.pt (main global English / canonical) ───────────────────────────
server {
    listen 80;
    server_name hdotrade.pt www.hdotrade.pt;
    return 301 https://hdotrade.pt$request_uri;
}
server {
    listen 443 ssl http2;
    server_name hdotrade.pt www.hdotrade.pt;

    ssl_certificate /etc/letsencrypt/live/hdotrade.pt/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hdotrade.pt/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}

# ─── hdotrade.com (USA/global — proxies to same app) ─────────────────────────
server {
    listen 80;
    server_name hdotrade.com www.hdotrade.com;
    return 301 https://hdotrade.com$request_uri;
}
server {
    listen 443 ssl http2;
    server_name hdotrade.com www.hdotrade.com;

    ssl_certificate /etc/letsencrypt/live/hdotrade.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hdotrade.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}

# ─── hdotrade.co.uk (UK / GBP) ───────────────────────────────────────────────
server {
    listen 80;
    server_name hdotrade.co.uk www.hdotrade.co.uk;
    return 301 https://hdotrade.co.uk$request_uri;
}
server {
    listen 443 ssl http2;
    server_name hdotrade.co.uk www.hdotrade.co.uk;

    ssl_certificate /etc/letsencrypt/live/hdotrade.co.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hdotrade.co.uk/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}

# ─── hdotrade.de (German) ─────────────────────────────────────────────────────
server {
    listen 80;
    server_name hdotrade.de www.hdotrade.de;
    return 301 https://hdotrade.de$request_uri;
}
server {
    listen 443 ssl http2;
    server_name hdotrade.de www.hdotrade.de;

    ssl_certificate /etc/letsencrypt/live/hdotrade.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hdotrade.de/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}

# ─── hdotrade.es (Spanish) ────────────────────────────────────────────────────
server {
    listen 80;
    server_name hdotrade.es www.hdotrade.es;
    return 301 https://hdotrade.es$request_uri;
}
server {
    listen 443 ssl http2;
    server_name hdotrade.es www.hdotrade.es;

    ssl_certificate /etc/letsencrypt/live/hdotrade.es/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hdotrade.es/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}

# ─── hdotrade.fr (French) ─────────────────────────────────────────────────────
server {
    listen 80;
    server_name hdotrade.fr www.hdotrade.fr;
    return 301 https://hdotrade.fr$request_uri;
}
server {
    listen 443 ssl http2;
    server_name hdotrade.fr www.hdotrade.fr;

    ssl_certificate /etc/letsencrypt/live/hdotrade.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hdotrade.fr/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and test:
```bash
sudo ln -s /etc/nginx/sites-available/hdotrade /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3b. SSL Certificates for all domains

```bash
# Run once per domain (requires DNS to point to VPS first)
sudo certbot --nginx -d hdotrade.pt -d www.hdotrade.pt
sudo certbot --nginx -d hdotrade.com -d www.hdotrade.com
sudo certbot --nginx -d hdotrade.co.uk -d www.hdotrade.co.uk
sudo certbot --nginx -d hdotrade.de -d www.hdotrade.de
sudo certbot --nginx -d hdotrade.es -d www.hdotrade.es
sudo certbot --nginx -d hdotrade.fr -d www.hdotrade.fr

# Auto-renewal (already configured by certbot, but verify):
sudo certbot renew --dry-run
```

> **Note:** If using Cloudflare proxy (orange cloud), use Cloudflare Origin Certificates instead of Let's Encrypt, or set Cloudflare SSL to "Full" and use Let's Encrypt on the origin.

---

## 4. Environment Variables (.env)

Update your `.env` file on the VPS. The app auto-detects the domain via the `Host` header — no separate `.env` per domain needed:

```env
MONGODB_URI=mongodb://admin:YOUR_PASSWORD@YOUR_HOST:27017/comet-commerce?authSource=admin

# Set to your canonical domain
NEXTAUTH_URL=https://hdotrade.pt
AUTH_URL=https://hdotrade.pt
NEXT_PUBLIC_SITE_URL=https://hdotrade.pt

NEXTAUTH_SECRET=your_secret_here
AUTH_SECRET=your_secret_here

STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

RESEND_API_KEY=your_resend_key
EMAIL_FROM=noreply@hdotrade.pt

NEXT_PUBLIC_imageBB_key=your_imgbb_api_key_here
```

---

## 5. PM2 — Run the App

```bash
# Build
cd /var/www/hdotrade
npm run build

# Start with PM2
pm2 start npm --name "hdotrade" -- start
pm2 save
pm2 startup

# Restart after code update
pm2 restart hdotrade
```

---

## 6. SEO: hreflang in app/layout.js

Add hreflang alternate links so Google knows which domain serves which language.
Edit your root `app/layout.js` or `app/(main)/layout.js`:

```jsx
export const metadata = {
  // ... your existing metadata
  alternates: {
    canonical: "https://hdotrade.pt",
    languages: {
      "x-default": "https://hdotrade.pt",
      "en":        "https://hdotrade.pt",
      "en-GB":     "https://hdotrade.co.uk",
      "en-US":     "https://hdotrade.com",
      "de":        "https://hdotrade.de",
      "pt":        "https://hdotrade.pt",
      "es":        "https://hdotrade.es",
      "fr":        "https://hdotrade.fr",
    },
  },
};
```

This tells Google: `.pt` is the default/canonical, each ccTLD serves its language.

---

## 7. What Each Code Change Does

### `middleware.js` (NEW FILE)
- Reads the incoming `Host` header
- Sets an `x-lang` header + cookie so server and client components both know the language without extra DB calls
- No redirects — each domain just serves content in its language

### `utils/seoMetadata.js`
- Added `de` (German) translations for all page titles and descriptions
- Added `.de` host detection in `getLanguageFromHost()`
- Added `nameDe` / `descriptionDe` to product SEO maps

### `components/clients/ProductCartC.jsx`
- Added German translations to all UI strings (home, manufacturer, stock, quantity, buttons, errors)
- Added `nameDe` and `descriptionDe` to product name/description maps

### `components/shop/ProductCard.jsx`
- Added `de: "Details anzeigen"` to view details button
- Added `nameDe` to product name map

### `components/detailProduct/Detail.jsx`
- Fixed hardcoded `$` price symbol — now uses `currency` prop with proper `Intl.NumberFormat` for EUR/GBP/USD
- Added `currency` to component props

### `app/(admin)/auth/dashboard/admin-components/AddUpdate.jsx`
- Added `nameDe` and `descriptionDe` input fields in the admin product form
- Admin can now enter German name and description for products

### `utils/uiLanguage.js`
- Added comment clarifying `he` maps to `en` (Hebrew uses RTL content, English UI labels)

---

## 8. Quick Verification Checklist

After deployment:

- [ ] Visit `https://hdotrade.de` → site appears in German
- [ ] Visit `https://hdotrade.de/shop/[product-id]` → price shows in EUR (€)
- [ ] Visit `https://hdotrade.co.uk` → UK flag active in language switcher, price in GBP
- [ ] Visit `https://hdotrade.com` → US flag with USD/EUR toggle dropdown
- [ ] Visit `https://hdotrade.pt` → English content (global canonical)
- [ ] Admin dashboard → Add/Edit product → German name & description fields visible
- [ ] `curl -I https://hdotrade.de` → returns 200, not redirect loop
- [ ] Google Search Console → Submit hdotrade.de as new property
