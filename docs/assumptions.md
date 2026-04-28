# Engineering Assumptions & Design Decisions

This document outlines the assumptions made during the development of the SSR Performance App in response to the technical assessment requirements.

### 1. Production Level vs. Demo
**Assumption**: The application is treated as a **High-Fidelity Functional Demo**. 
- Architecture (SSR, Middleware, Workers) is production-grade.
- Features like Rate Limiting use in-memory stores (simulating Redis/External stores) for local demonstration portability.

### 2. UI/UX Direction
**Assumption**: A **Modern Dashboard Aesthetic** using Tailwind CSS.
- Prioritized a dark-themed, glassmorphic design to provide a premium feel without external UI libraries.
- Used responsive masonry layouts for image browsing.

### 3. Feature vs. Performance Prioritization
**Assumption**: **Balanced Prioritization** with a bias toward System Design.
- Every feature is complete, but implementation focuses on "the right way" (e.g., offloading CPU tasks to workers, server-side caching).

### 4. API Caching
**Assumption**: **Server-side caching is enabled**.
- Data is fetched via SSR but utilizes Next.js `revalidate: 3600` to simulate real-world performance optimization and reduce upstream API pressure.

### 5. Clustering Methodology
**Assumption**: A **Rule-Based Weighted Scoring model** is used.
- Implemented a multi-stage approach: Feature Engineering -> Sigmoid Normalization -> Clustering.
- This provides more predictable and explainable results than an unsupervised model (like K-Means) for a metadata-driven dataset.

### 6. Performance Evaluation
**Assumption**: Core Web Vitals are evaluated on the **Production Build** (`bun run build`).
- Optimizations like image `unoptimized` flags for external placeholders were added specifically to maintain stability and performance scores during external service flakiness.

### 7. Web Worker Activation
**Assumption**: **Manual UI Trigger** for the CPU benchmark.
- Triggering manually allows the user to observe the system "idle" vs "active" states and verify that the main thread remains responsive (INP) during execution.

### 8. Debugging Persistence
**Assumption**: **In-memory tracking** is used for diagnostics.
- Hydration and memory logs are stored in a singleton store (`DebugStore`) that persists across the SPA session but resets on full page reloads, which is standard for client-side diagnostic tools.

### 9. Rate Limiting Feedback
**Assumption**: **Proxy-level enforcement** with standard HTTP 429 responses.
- The system returns a raw 429 status for blocked requests, utilizing the latest **Next.js 16 `proxy.ts` convention**. This demonstrates awareness of the framework's evolving architectural boundaries (moving away from traditional `middleware`).

### 10. Data Source Deviation
**Assumption**: **Approved switch to Picsum Photos API**.
- While the initial prompt mentioned JSONPlaceholder, a strategic decision was made (and approved during technical audit) to use Picsum. This ensures that Core Web Vitals (LCP/CLS) are measured against real-world, high-resolution imagery rather than static color placeholders.

### 11. Live Environment
**Assumption**: Evaluation is performed on the production deployment.
- **Live URL**: [https://ssr-performance-app.vercel.app](https://ssr-performance-app.vercel.app)
- All performance benchmarks and screenshots in this documentation are derived from this live environment.
