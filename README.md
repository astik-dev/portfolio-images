# portfolio-images

A Node.js image processing pipeline for my [portfolio website](https://github.com/astik-dev/portfolio). Takes raw project screenshots, compresses them, converts them to modern formats, and generates responsive image sets — all automatically via GitHub Actions.

## Overview

Portfolio screenshots are high-quality PNG files that are too heavy to serve directly on a website. This script processes them into compressed, multi-format, responsive image sets (JPEG, WebP, AVIF) at multiple widths, ready to be used with `<picture>` and `srcset` in the browser. Processed images are published to a separate branch and served via GitHub Pages.

## Input Structure

Raw images are placed in:

```
img/raw/projects/
└── {projectName}/
    ├── screenshots/
    │   ├── 1.png
    │   ├── 2.png
    │   └── 3.png ...
    └── thumbnail.png   ← optional (2:1 aspect ratio)
```

- **`screenshots/`** — Project screenshots named sequentially (`1.png`, `2.png`, ...).
- **`thumbnail.png`** — Optional custom thumbnail with a 2:1 aspect ratio. If not provided, the script automatically generates one from `screenshots/1.png` by cropping from the top to fit the 2:1 ratio.

## Output Structure

Processed images are saved to:

```
img/processed/projects/
└── {projectName}/
    ├── thumbnail/
    │   ├── 400.jpg
    │   ├── 400.webp
    │   ├── 400.avif
    │   ├── 600.jpg
    │   └── ... (all widths × all formats)
    └── screenshots/
        ├── 1/
        │   ├── 620.jpg
        │   ├── 620.webp
        │   ├── 620.avif
        │   ├── 775.jpg
        │   └── ... (all widths × all formats)
        ├── 2/
        │   └── ...
        └── 3/
            └── ...
```

Each image is named `[width].[format]` (e.g. `1240.webp`, `1920.avif`).

## Processing Details

### Thumbnails

| Property      | Value                                        |
|---------------|----------------------------------------------|
| Widths (px)   | 400, 600, 800, 1000, 1200, 1400              |
| Aspect ratio  | 2:1 (enforced — crops from top if needed)    |
| Formats       | JPEG, WebP, AVIF                             |

### Screenshots

| Property      | Value                                                       |
|---------------|-------------------------------------------------------------|
| Widths (px)   | 620, 775, 930, 1085, 1240, 1420, 1920                       |
| Aspect ratio  | Preserved (height scaled proportionally, nothing cropped)  |
| Formats       | JPEG, WebP, AVIF                                            |

Compression quality settings are shared between thumbnails and screenshots.

## GitHub Actions Workflow

The workflow automates processing and publishing on every push:

1. **Processes and caches images** — if `img/raw/projects/` hasn't changed and a cache exists, the processed images are simply restored; if anything changed in `img/raw/projects/` or the cache expired (7 days), all images are reprocessed and re-cached.
2. **Publishes** the processed images to a dedicated `processed-images` branch, which is served via **GitHub Pages**.

The portfolio website fetches all images directly from the GitHub Pages URL of the `processed-images` branch.

## Tech Stack

- **[sharp](https://sharp.pixelplumbing.com/)** — High-performance image processing (resize, crop, compress, convert).
- **Node.js** — Script runtime.
- **GitHub Actions** — CI/CD for automated processing and publishing.
- **GitHub Pages** — CDN for serving the processed images.
