# AOSA & OPN Production Architecture

## Overview
This document outlines the production architecture for the Australian Opal Standards Authority (AOSA) and the Opal Provenance Network (OPN), designed to scale as a "Bloomberg Terminal for geological assets." 

## Tech Stack
* **Frontend**: Next.js App Router (React 18), TypeScript, TailwindCSS, Framer Motion
* **Backend**: Vercel Serverless Functions, Supabase (PostgreSQL + Auth + Storage)
* **AI/CV**: Gemini API (Digital Twin/Semantic Generation), Google Teachable Machine (TF.js for edge image classification)
* **Assets**: Cloudinary (Image transformations), IPFS (Metadata pinning for NFTs)
* **Visualization**: Three.js (Depth cards), Recharts (Market Variance)

## Supabase Schema Architecture

```sql
-- opals (The Physical Asset)
CREATE TABLE opals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  aosa_id VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  origin_coords VARCHAR,
  mined_date DATE,
  weight_ct NUMERIC,
  brightness_grade VARCHAR(2), -- B1-B7
  body_tone VARCHAR(2), -- N1-N9
  pattern_type VARCHAR,
  mk_grade INTEGER, -- Machine Grade (1-9)
  image_url_raw VARCHAR,
  is_minted BOOLEAN DEFAULT false
);

-- digital_twins (The Cryptographic Identity)
CREATE TABLE digital_twins (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  opal_id uuid REFERENCES opals(id) ON DELETE CASCADE,
  twin_name VARCHAR,
  twin_concept TEXT,
  metadata_hash VARCHAR UNIQUE,
  ipfs_uri VARCHAR,
  forged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ownership_ledger (Provenance)
CREATE TABLE ownership_ledger (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  opal_id uuid REFERENCES opals(id) ON DELETE CASCADE,
  owner_id VARCHAR, -- Wallet address or User ID
  transfer_price_usd NUMERIC,
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  status_type VARCHAR -- 'Mined', 'Verified', 'Transferred', 'Forged'
);

-- market_variance (Economic Data)
CREATE TABLE market_variance (
  id SERIAL PRIMARY KEY,
  grade_level INTEGER, -- 1-9
  implied_fair_value NUMERIC,
  liquidity_score NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Folder Structure (Next.js)

```
/
├── public/                 # Static assets, models, Teachable Machine exports
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (marketing)/    # Landing page, public routes
│   │   │   └── page.tsx
│   │   ├── (auth)/         # Supabase Auth layouts
│   │   ├── verify/         # VerifyAI Terminal
│   │   │   └── page.tsx
│   │   ├── vault/          # User's Portfolio & Tactile Deck
│   │   │   └── page.tsx
│   │   ├── market/         # Intelligence & Variance Dashboard
│   │   │   └── page.tsx
│   │   ├── api/            # Vercel Serverless Functions
│   │   │   ├── verify/     # Gemini Prompt Enhancement
│   │   │   ├── mint/       # NFT interaction
│   │   │   └── upload/     # Cloudinary / Supabase Storage
│   ├── components/
│   │   ├── ui/             # Radix / shadcn primatives
│   │   ├── 3d/             # Three.js & Framer cards
│   │   │   └── TactileCard.tsx
│   │   ├── charts/         # Recharts implementations
│   │   │   └── VarianceChart.tsx
│   │   └── scanner/        # Camera & TensorFlow implementations
│   │       ├── CameraView.tsx
│   │       └── TFLiteRunner.ts
│   ├── lib/
│   │   ├── supabase/       # DB connection clients
│   │   ├── gemini.ts       # AI Wrapper
│   │   └── math.ts         # Liquidity / Variance / Rarity formulas
│   └── types/              # TS Interfaces (Database matches)
```

## AI Engine Integration Flow (Teachable Machine + Gemini)
1. **Ingest**: User opens `CameraView.tsx`. `navigator.mediaDevices` streams feed.
2. **Edge Inference**: Frame captured, resized to 224x224. Passed to `@tensorflow/tfjs` running the exported Google Teachable Machine model (`https://teachablemachine.withgoogle.com/models/jOWvy-EIT/`).
3. **Classification**: Model outputs logits mapped to M1-M9.
4. **Cloud Processing**: If confidence > 85%, image and grade sent to `/api/verify`.
5. **Generative Twin**: Gemini API receives image data and structural grade, outputs a 3-word `twin_name` and abstract `twin_concept`.
6. **Ledger Update**: Data committed to Supabase, IPFS metadata generated.

## UI/UX Rules
- **Physical Mode**: `#fdfcfb` backgrounds, `serif` typography, high-contrast borders. Simulates a scientific lab or institutional terminal.
- **Digital Mode**: `#050a15` backgrounds, `inter` font, glowing holographic accents (`rgba(0,255,213,1)`). Simulates the blockchain / NFT layer.
- **Card Physics**: Cards are scaled using `-translate-z` in a CSS `preserve-3d` container. Cursor movement maps horizontally and vertically to `rotateX` and `rotateY` via `framer-motion` springs for a tangible feel.
