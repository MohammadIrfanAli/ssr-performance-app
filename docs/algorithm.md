# Multi-Stage Clustering Algorithm

This document explains the design, mathematics, and complexity of the custom clustering algorithm implemented for this project.

## 🧠 Design Philosophy

The algorithm is designed to quantify "Information Density" in image metadata. Instead of a linear grouping, it uses a non-linear pipeline to better distinguish between "average" data points and "exceptional" ones.

## 🏗️ The Multi-Stage Pipeline

### Stage 1: Feature Engineering (Server-Side)
We calculate a **Numeric Complexity Score** using weighted heuristics:
- **Title Complexity (45%)**: Direct correlation between title length and data density.
- **Logarithmic ID (25%)**: Using `Math.log10` ensures that as IDs grow large, their impact on complexity follows a diminishing return curve.
- **Album Context (15%)**: Parity-based weighting (`albumId % 2`) simulates categorical complexity.
- **Path Depth (15%)**: Depth of the image URL (`url.split('/').length`).

### Stage 2: Non-Linear Normalization (Client-Side)
To map raw scores to a human-readable 0-100 scale, we use a **Logistic Sigmoid Function**:
$$f(x) = \frac{L}{1 + e^{-k(x-x_0)}}$$
- **$k = 0.15$**: Steepness of the curve.
- **$x_0 = 42$**: The midpoint (calibrated specifically for Picsum metadata).
- **Why?**: Linear scaling often results in "clumping" in the middle. Sigmoid normalization pushes outliers further apart. The midpoint was shifted from 35 to 42 to account for the deeper path structures and author metadata density in the **Picsum Photos** dataset compared to standard placeholder sources.

### Stage 3: Clustering Logic
Photos are grouped into four distinct buckets based on their normalized scores:
- **Cluster A (0-25)**: Low metadata complexity.
- **Cluster B (26-50)**: Standard informative data.
- **Cluster C (51-75)**: High-density information.
- **Cluster D (76-100)**: Exceptional/Complex metadata signatures.

## ⏱️ Computational Complexity (Big-O)

The algorithm operates in **O(N)** time complexity.
- **Server Stage**: Single pass over the dataset to compute raw scores.
- **Client Stage**: Single pass over the scores to normalize and filter using `useMemo`.
- **Space Complexity**: O(N) to store the augmented metadata.

## 🎯 Why this design?
By splitting the logic between Server and Client, we satisfy strict architectural requirements while demonstrating proficiency in both backend data engineering and frontend performance optimization. 

**Live Algorithm Demo**: [https://ssr-performance-app.vercel.app/clusters](https://ssr-performance-app.vercel.app/clusters)
