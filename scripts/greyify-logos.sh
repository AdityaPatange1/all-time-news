#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

node "scripts/greyify-logos.mjs"
echo "Done. Monochrome logos generated in public/logos/mono."
