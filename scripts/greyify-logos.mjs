import path from "node:path";
import { mkdir, readdir } from "node:fs/promises";
import sharp from "sharp";

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, "public", "logos", "standard");
const OUTPUT_DIR = path.join(ROOT, "public", "logos", "mono");

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const entries = await readdir(INPUT_DIR, { withFileTypes: true });

  const logoFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".webp"))
    .map((entry) => entry.name);

  for (const logoFile of logoFiles) {
    const inputPath = path.join(INPUT_DIR, logoFile);
    const outputPath = path.join(OUTPUT_DIR, logoFile);

    // Apply a soft neutral filter (not pure black/white conversion).
    await sharp(inputPath)
      .ensureAlpha()
      .grayscale()
      .modulate({ brightness: 1.02, saturation: 0.18 })
      .linear(1.06, -2)
      .webp({ quality: 92, effort: 5, alphaQuality: 100 })
      .toFile(outputPath);
  }

  console.log(`Greyified ${logoFiles.length} logos into public/logos/mono.`);
}

run().catch((error) => {
  console.error("Greyify pipeline failed.");
  console.error(error);
  process.exit(1);
});
