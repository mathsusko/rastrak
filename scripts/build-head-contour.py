"""Gera public/data/head.bin a partir de ~/Desktop/cabeca-ref.png (cabeça em curvas de nível):
pontos nas linhas brancas, profundidade por distância à borda + relevo do rosto.
Saída float32: x, y, z, dist (1 = borda, 0 = centro do rosto)."""
import os, numpy as np
from PIL import Image
from scipy import ndimage as nd
im = Image.open(os.path.expanduser("~/Desktop/cabeca-ref.png")).convert("L")
a = np.array(im).astype(float)
dark = a < 120
rows = np.where(dark.mean(1) > 0.3)[0]; cols = np.where(dark.mean(0) > 0.3)[0]
y0, y1, x0, x1 = rows.min() + 3, rows.max() - 3, cols.min() + 3, cols.max() - 3
K = 4
big = np.array(im.crop((x0, y0, x1, y1)).resize(((x1 - x0) * K, (y1 - y0) * K), Image.BICUBIC)).astype(float)
white = big > 150
sil = nd.binary_fill_holes(nd.binary_closing(white, np.ones((3, 3)), iterations=10))
lab, n = nd.label(sil); sil = lab == (np.argmax(nd.sum(sil, lab, range(1, n + 1))) + 1)
sil = nd.binary_opening(sil, iterations=4)
dt = nd.distance_transform_edt(sil); d = dt / dt.max()
ys, xs = np.nonzero(white & sil)
H, W = sil.shape; cy, cx, s = H / 2, W / 2, H / 2
rng = np.random.default_rng(5)
idx = rng.choice(len(xs), min(22000, len(xs)), replace=False)
px = xs[idx] + rng.uniform(-.5, .5, len(idx)); py = ys[idx] + rng.uniform(-.5, .5, len(idx))
dd = d[ys[idx], xs[idx]]
X = (px - cx) / s; Y = -(py - cy) / s
Z = np.sqrt(np.clip(1 - (1 - dd) ** 2, 0, 1)) * 0.62
g = lambda x0, y0, sx, sy: np.exp(-(((X - x0) / sx) ** 2 + ((Y - y0) / sy) ** 2))
Z = Z + 0.16 * g(0, -0.40, 0.09, 0.16) + 0.05 * g(0, -0.62, 0.16, 0.06) - 0.07 * g(-0.2, -0.26, 0.11, 0.07) - 0.07 * g(0.2, -0.26, 0.11, 0.07) + 0.04 * g(0, -0.12, 0.35, 0.06)
np.stack([X, Y, Z, 1 - dd], 1).astype(np.float32).tofile("public/data/head.bin")
print(len(X))
