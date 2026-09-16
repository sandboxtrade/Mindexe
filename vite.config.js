import fs from "node:fs";
import path from "node:path";

const ROOT_PWA_FILES = ["manifest.json"];
const ROOT_PWA_PATTERNS = [/^icon-\d+\.png$/i, /^favicon(?:-\d+)?\.png$/i];
const PRECACHE_EXTENSIONS = new Set([".html", ".js", ".css", ".json", ".jpg", ".jpeg", ".png", ".svg", ".webp", ".ico", ".woff", ".woff2"]);

function listFilesRecursive(dir, root = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFilesRecursive(full, root, out);
    else if (entry.isFile()) out.push(path.relative(root, full).split(path.sep).join("/"));
  }
  return out;
}

function copyExistingRootPwaAssets() {
  return {
    name: "mind-exe-copy-root-pwa-assets",
    apply: "build",
    closeBundle() {
      const root = process.cwd();
      const outDir = path.join(root, "dist");
      fs.mkdirSync(outDir, { recursive: true });
      const names = fs.readdirSync(root);
      const selected = new Set([
        ...ROOT_PWA_FILES.filter((name) => fs.existsSync(path.join(root, name))),
        ...names.filter((name) => ROOT_PWA_PATTERNS.some((re) => re.test(name)))
      ]);
      for (const name of selected) {
        fs.copyFileSync(path.join(root, name), path.join(outDir, name));
      }

      // The source SW cannot know Vite's hashed chunk names. After the build is complete, inject
      // only files that actually exist in dist. Video is intentionally runtime-cached instead of
      // precached so first install does not re-download the splash movie in the background.
      const swPath = path.join(outDir, "sw.js");
      if (fs.existsSync(swPath)) {
        const files = listFilesRecursive(outDir)
          .filter((name) => name !== "sw.js" && PRECACHE_EXTENSIONS.has(path.extname(name).toLowerCase()))
          .map((name) => `./${name}`);
        const urls = [...new Set(["./", ...files])].sort();
        const sw = fs.readFileSync(swPath, "utf8");
        const marker = 'const PRECACHE_URLS = ["./"];';
        if (!sw.includes(marker)) throw new Error("mind-exe service worker precache marker missing");
        fs.writeFileSync(swPath, sw.replace(marker, `const PRECACHE_URLS = ${JSON.stringify(urls)};`));
      }
    }
  };
}

export default {
  base: "./",
  publicDir: "public",
  plugins: [copyExistingRootPwaAssets()],
  build: {
    target: "es2022",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("/firebase/") || id.includes("/@firebase/")) return "vendor-firebase";
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) return "vendor-react";
          if (id.includes("/recharts/") || id.includes("/d3-")) return "vendor-charts";
          if (id.includes("/lucide-react/")) return "vendor-icons";
          return "vendor-misc";
        }
      }
    }
  }
};
