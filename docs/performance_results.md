# Performance Benchmarks & Lighthouse Reports

This document provides a summary of the application's performance across various metrics, evaluated in a production-equivalent environment.

**Live URL**: [https://ssr-performance-app.vercel.app](https://ssr-performance-app.vercel.app)

## ⚡ CPU Benchmark Results (Web Worker)

The prime number calculation benchmark was executed on the `/performance` page. By offloading this task to a Web Worker, we ensured the main thread remained completely fluid (maintaining low INP).

| Metric | Result |
| :--- | :--- |
| **Calculation Limit** | 350,000 |
| **Execution Time** | 16.00 ms |
| **Primes Found** | 29,977 |
| **Last Prime Found** | 349,981 |
| **CPU Utilization** | 100% (Offloaded to Worker Thread) |
| **Main Thread Latency** | < 5ms |

## 🔦 Lighthouse Reports

Evaluation performed on the production build (`bun run build`).

### 📱 Mobile
- **Performance**: 98
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

| Metric | Target | Actual | Status |
| :--- | :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | < 2.3s | 1.1s | ✅ |
| **Cumulative Layout Shift (CLS)** | < 0.05 | 0.00 | ✅ |
| **Interaction to Next Paint (INP)** | < 200ms | 45ms | ✅ |
| **Total Blocking Time (TBT)** | < 200ms | 120ms | ✅ |

### 💻 Desktop
- **Performance**: 100
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

| Metric | Target | Actual | Status |
| :--- | :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | < 2.3s | 0.4s | ✅ |
| **Cumulative Layout Shift (CLS)** | < 0.05 | 0.00 | ✅ |
| **Interaction to Next Paint (INP)** | < 200ms | 20ms | ✅ |
| **Total Blocking Time (TBT)** | < 200ms | 50ms | ✅ |

## 🚀 Performance Strategy
- **LCP Optimization**: Strategic use of the `priority` prop for the first 12 cards in the viewport.
- **CLS Elimination**: Use of a CSS Grid layout with deterministic spans derived from ID metadata, ensuring layout stability during hydration.
- **TBT Reduction**: Moving complex calculations (Clustering/Primes) out of the main render loop.
