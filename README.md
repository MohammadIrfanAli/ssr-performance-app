# SSR Performance App

A production-grade Next.js application demonstrating advanced SSR architecture, custom data clustering, and real-time performance monitoring.

**Live URL**: [https://ssr-performance-app.vercel.app](https://ssr-performance-app.vercel.app)

## 🚀 Key Features

- **SSR-First Architecture**: High-performance rendering for all routes using Next.js 16 App Router.
- **Custom Clustering Algorithm**: Multi-stage data processing with feature engineering and non-linear sigmoid normalization.
- **Web Worker Offloading**: Intensive CPU tasks (Prime calculation) run in background threads to maintain a fluid UI.
- **Diagnostic Suite**: Real-time hydration consistency checks and memory snapshot monitoring.
- **Next.js 16 Proxy**: IP-based request throttling implemented via the latest `proxy.ts` convention.

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Runtime**: Bun
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript (Strict Mode)

## 📖 Documentation

Detailed technical documentation is available in the `/docs` directory:

1. [**Architecture Overview**](./docs/architecture.md) - System design and technology choices.
2. [**Clustering Algorithm**](./docs/algorithm.md) - Mathematical model and logic behind data grouping.
3. [**Engineering Assumptions**](./docs/assumptions.md) - Assumptions made against the project requirements.

## 🏁 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed.

### Installation
```bash
bun install
```

### Development
```bash
bun dev
```

### Production Build
```bash
bun run build
bun start
```

## 🧪 Advanced Features

### Hydration Consistency
The app computes a checksum of the SSR data on the server and validates it on the client during hydration. Any mismatch is logged to the `/debug` dashboard.

### Memory Monitoring
Every route transition triggers a memory snapshot. If the JS heap usage delta exceeds 10MB, a diagnostic entry is generated to help identify potential leaks.

### API Retry Logic
The fetch utility implements an exponential backoff strategy with up to 4 retries for transient API failures.
