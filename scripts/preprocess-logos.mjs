import path from "node:path";
import { mkdir, readdir } from "node:fs/promises";
import sharp from "sharp";

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, "public", "logos");
const OUTPUT_DIR = path.join(INPUT_DIR, "standard");
const WIDTH = 260;
const HEIGHT = 140;
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

async function getFilesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (absolutePath === OUTPUT_DIR) continue;
      files.push(...(await getFilesRecursively(absolutePath)));
      continue;
    }
    files.push(absolutePath);
  }

  return files;
}

async function normalizeLogo(inputPath) {
  const extension = path.extname(inputPath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) return null;

  const baseName = path.basename(inputPath, extension);
  const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

  await sharp(inputPath, { failOn: "none" })
    .resize(WIDTH, HEIGHT, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
      withoutEnlargement: true,
    })
    .webp({ quality: 88, effort: 4 })
    .toFile(outputPath);

  return outputPath;
}

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const allFiles = await getFilesRecursively(INPUT_DIR);
  const logoFiles = allFiles.filter((file) =>
    ALLOWED_EXTENSIONS.has(path.extname(file).toLowerCase()),
  );

  const results = await Promise.all(logoFiles.map((file) => normalizeLogo(file)));
  const generated = results.filter(Boolean);

  console.log(
    `Processed ${generated.length} logos to ${WIDTH}x${HEIGHT} into public/logos/standard.`,
  );
}

run().catch((error) => {
  console.error("Logo preprocessing failed.");
  console.error(error);
  process.exit(1);
});
