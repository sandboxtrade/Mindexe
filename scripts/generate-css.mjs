import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { compile } from "tailwindcss";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const require = createRequire(import.meta.url);
const tailwindCssPath = require.resolve("tailwindcss/index.css");
const tailwindSource = fs.readFileSync(tailwindCssPath, "utf8");

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && /\.(?:js|html)$/.test(entry.name)) files.push(full);
  }
}
walk(root);

// Tailwind ignores unknown candidates, so scanning lexical tokens is intentionally conservative:
// it captures utility strings inside normal strings, templates and conditional className branches
// without needing a JS parser or a runtime CDN scanner.
const tokenRe = /!?-?[A-Za-z0-9_]+(?:[A-Za-z0-9_:\-/.%#[\](),]+)?/g;
const candidates = new Set();
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const token of text.match(tokenRe) || []) {
    if (token.length > 1 && token.length < 180) candidates.add(token);
  }
}

// A few classes are assembled around variables, so keep their static shells explicit.
[
  "pointer-events-none", "pointer-events-auto", "z-[110]", "z-[120]",
  "max-w-[calc(100%-24px)]", "-translate-x-1/2", "left-1/2", "top-3",
  "underline", "underline-offset-2", "whitespace-nowrap"
].forEach((token) => candidates.add(token));

const compiler = await compile(tailwindSource);
const utilityCss = compiler.build([...candidates].sort());
const customCss = fs.readFileSync(path.join(root, "styles.base.css"), "utf8");
const output = `${utilityCss}\n\n${customCss}\n`;
fs.writeFileSync(path.join(root, "styles.css"), output);
console.log(`mind.exe CSS: ${candidates.size} candidates -> ${Buffer.byteLength(output)} bytes`);
