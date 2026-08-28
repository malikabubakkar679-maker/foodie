/**
 * Studio AI & Canvas Background Removal Engine
 * 
 * Features:
 * 1. Edge-Aware Flood Fill (BFS) starting ONLY from outer image borders
 * 2. Sobel Edge Gradient Barrier to prevent color bleeding into food edges
 * 3. Enclosed Hole / Interior Island Protection (preserves light sauces, cheese, whites inside food)
 * 4. Contour Boundary Anti-Aliasing & Feathering for smooth natural studio cutouts
 */

export interface BgRemovalOptions {
  tolerance?: number; // 0 to 100 sensitivity (default 32)
  feather?: number; // edge smoothing 0 to 10 (default 3)
  edgeThreshold?: number; // Sobel gradient barrier sensitivity (default 28)
  trimEdges?: boolean;
}

export const removeImageBackground = (
  imageSrc: string,
  options: BgRemovalOptions = {}
): Promise<string> => {
  const { tolerance = 32, feather = 3, edgeThreshold = 28 } = options;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve(imageSrc);

        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // 1. Sample Background Colors from perimeter border pixels
        const bgColors: Array<[number, number, number]> = [];
        const perimeterStep = Math.max(1, Math.floor(Math.min(width, height) / 40));

        // Top and Bottom borders
        for (let x = 0; x < width; x += perimeterStep) {
          const topIdx = (0 * width + x) * 4;
          const btmIdx = ((height - 1) * width + x) * 4;
          bgColors.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
          bgColors.push([data[btmIdx], data[btmIdx + 1], data[btmIdx + 2]]);
        }
        // Left and Right borders
        for (let y = 0; y < height; y += perimeterStep) {
          const leftIdx = (y * width + 0) * 4;
          const rightIdx = (y * width + (width - 1)) * 4;
          bgColors.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
          bgColors.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
        }

        // Color distance helper (weighted Euclidean)
        const colorDist = (r: number, g: number, b: number, bg: [number, number, number]) => {
          const dr = r - bg[0];
          const dg = g - bg[1];
          const db = b - bg[2];
          return Math.sqrt(dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114);
        };

        const minBgDist = (r: number, g: number, b: number) => {
          let minD = 999999;
          for (let i = 0; i < bgColors.length; i++) {
            const d = colorDist(r, g, b, bgColors[i]);
            if (d < minD) minD = d;
          }
          return minD;
        };

        // 2. Grayscale buffer for Sobel gradient calculation
        const gray = new Float32Array(width * height);
        for (let i = 0; i < width * height; i++) {
          const idx = i * 4;
          gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        }

        // 3. Compute Sobel Edge Magnitude
        const edges = new Uint8Array(width * height);
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            const gx =
              -gray[idx - width - 1] +
              gray[idx - width + 1] -
              2 * gray[idx - 1] +
              2 * gray[idx + 1] -
              gray[idx + width - 1] +
              gray[idx + width + 1];

            const gy =
              -gray[idx - width - 1] -
              2 * gray[idx - width] -
              gray[idx - width + 1] +
              gray[idx + width - 1] +
              2 * gray[idx + width] +
              gray[idx + width + 1];

            const mag = Math.sqrt(gx * gx + gy * gy);
            if (mag > edgeThreshold) {
              edges[idx] = 1; // Strong edge barrier
            }
          }
        }

        // 4. Edge-Aware Flood Fill (BFS) strictly from external borders
        // 0: unvisited, 1: confirmed background, 2: confirmed foreground
        const mask = new Uint8Array(width * height);
        const queue: Int32Array = new Int32Array(width * height);
        let head = 0;
        let tail = 0;

        const maxColorTolerance = tolerance * 1.55;

        // Push border pixels that match background
        for (let x = 0; x < width; x++) {
          // Top edge
          const topIdx = x;
          const topPix = topIdx * 4;
          if (minBgDist(data[topPix], data[topPix + 1], data[topPix + 2]) < maxColorTolerance * 1.35) {
            mask[topIdx] = 1;
            queue[tail++] = topIdx;
          }
          // Bottom edge
          const btmIdx = (height - 1) * width + x;
          const btmPix = btmIdx * 4;
          if (minBgDist(data[btmPix], data[btmPix + 1], data[btmPix + 2]) < maxColorTolerance * 1.35) {
            mask[btmIdx] = 1;
            queue[tail++] = btmIdx;
          }
        }

        for (let y = 0; y < height; y++) {
          // Left edge
          const leftIdx = y * width;
          const leftPix = leftIdx * 4;
          if (mask[leftIdx] === 0 && minBgDist(data[leftPix], data[leftPix + 1], data[leftPix + 2]) < maxColorTolerance * 1.35) {
            mask[leftIdx] = 1;
            queue[tail++] = leftIdx;
          }
          // Right edge
          const rightIdx = y * width + (width - 1);
          const rightPix = rightIdx * 4;
          if (mask[rightIdx] === 0 && minBgDist(data[rightPix], data[rightPix + 1], data[rightPix + 2]) < maxColorTolerance * 1.35) {
            mask[rightIdx] = 1;
            queue[tail++] = rightIdx;
          }
        }

        // Run BFS
        const dx = [1, -1, 0, 0];
        const dy = [0, 0, 1, -1];

        while (head < tail) {
          const curr = queue[head++];
          const cx = curr % width;
          const cy = Math.floor(curr / width);

          for (let d = 0; d < 4; d++) {
            const nx = cx + dx[d];
            const ny = cy + dy[d];

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (mask[nIdx] === 0) {
                // If it hits a strong Sobel edge and is not obvious background, stop flooding
                if (edges[nIdx] === 1) {
                  const pIdx = nIdx * 4;
                  const dist = minBgDist(data[pIdx], data[pIdx + 1], data[pIdx + 2]);
                  if (dist > maxColorTolerance * 0.7) {
                    continue; // Edge barrier reached!
                  }
                }

                const pIdx = nIdx * 4;
                const dist = minBgDist(data[pIdx], data[pIdx + 1], data[pIdx + 2]);
                if (dist < maxColorTolerance) {
                  mask[nIdx] = 1; // Mark as background
                  queue[tail++] = nIdx;
                }
              }
            }
          }
        }

        // 5. Apply Alpha Mask & Smooth Feathering only along boundary
        const featherRadius = Math.max(1, Math.min(8, Math.round(feather)));
        const finalAlpha = new Uint8Array(width * height);

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            if (mask[idx] === 1) {
              // Confirmed background
              finalAlpha[idx] = 0;
            } else {
              // Foreground or border transition
              // Check proximity to background for smooth anti-aliased edge
              let bgNeighbors = 0;
              let totalNeighbors = 0;

              for (let fy = -featherRadius; fy <= featherRadius; fy++) {
                for (let fx = -featherRadius; fx <= featherRadius; fx++) {
                  const nx = x + fx;
                  const ny = y + fy;
                  if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    totalNeighbors++;
                    if (mask[ny * width + nx] === 1) {
                      bgNeighbors++;
                    }
                  }
                }
              }

              if (bgNeighbors > 0) {
                // Smooth contour alpha transition
                const alphaRatio = 1 - bgNeighbors / totalNeighbors;
                finalAlpha[idx] = Math.round(255 * Math.pow(alphaRatio, 0.75));
              } else {
                // 100% Solid foreground subject (cheese, crust, sauces 100% protected!)
                finalAlpha[idx] = 255;
              }
            }
          }
        }

        // Write final alpha back to canvas
        for (let i = 0; i < width * height; i++) {
          data[i * 4 + 3] = finalAlpha[i];
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Auto bg removal error, returning original:', err);
        resolve(imageSrc);
      }
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
};
