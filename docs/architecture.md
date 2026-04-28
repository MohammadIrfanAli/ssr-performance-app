# Architecture Overview

The **SSR Performance App** is designed with a focus on Server-Side Rendering (SSR), Core Web Vitals, and robust system monitoring.

## Core Pillars

### 1. SSR-First Strategy
- All primary routes (`/`, `/details/[id]`, `/clusters`) are rendered on the server.
- Data fetching happens in Server Components, reducing client-side JS and improving LCP.
- **Data Source**: Utilizes **Picsum Photos API** (replacing JSONPlaceholder per architecture approval) to provide high-fidelity image assets for more accurate Core Web Vitals profiling.
- Caching is implemented via Next.js `revalidate` and IP-based rate limiting via the latest **Next.js 16 Proxy API**.

### 2. Performance Engineering
- **Image Optimization**: Utilizing `next/image` with proper sizing, lazy loading, and priority flags for above-the-fold content.
- **Offloading Tasks**: Intensive CPU calculations (e.g., prime number generation) are offloaded to Web Workers to ensure the main thread remains responsive (targeting < 200ms INP).
- **Bundle Optimization**: Minimal dependencies, using only Tailwind CSS for styling to keep the CSS bundle lean.

### 3. Resilience & Monitoring
- **API Resilience**: Fetcher implements exponential backoff with a maximum of 4 retries for transient failures.
- **Hydration Safety**: A custom checksum system validates SSR data against client hydration to prevent and log mismatches.
- **Memory Tracking**: Real-time monitoring of JS heap usage across route transitions.
- **Proxy Enforcement**: IP-based protection (10 req/min) enforced at the network boundary using the `proxy.ts` convention.

## Folder Structure

- `/app`: Route definitions and Server Components.
- `/components`: UI units and client monitoring wrappers.
- `/lib`: Core logic including API, clustering algorithm, and rate limiting.
- `/hooks`: Custom React hooks for system diagnostics.
- `/workers`: Dedicated threads for heavy computation.
- `/docs`: Technical documentation.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 4
- **Runtime**: Bun
