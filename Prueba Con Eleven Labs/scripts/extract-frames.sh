#!/usr/bin/env bash
# ─── KATANA FLOW — Frame Extraction ──────────────────────────────────────────
# Run this once from the project root after installing FFmpeg.
#
# Requirements:
#   ffmpeg must be in PATH
#   katana-animation.mp4 must exist in project root
#
# Usage:
#   bash scripts/extract-frames.sh
#
# After running:
#   1. Check the frame count printed below
#   2. Update TOTAL_FRAMES in lib/constants.ts with that number

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INPUT="$PROJECT_ROOT/katana-animation.mp4"
OUTPUT_DIR="$PROJECT_ROOT/public/frames"

echo "► Katana Flow — Frame Extraction"
echo ""

# Verify input exists
if [ ! -f "$INPUT" ]; then
  echo "✗ Error: katana-animation.mp4 not found in project root"
  echo "  Expected: $INPUT"
  exit 1
fi

# Verify ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
  echo "✗ Error: ffmpeg not found in PATH"
  echo ""
  echo "  Install options:"
  echo "    macOS:   brew install ffmpeg"
  echo "    Windows: winget install ffmpeg  OR  choco install ffmpeg"
  echo "    Linux:   sudo apt install ffmpeg"
  exit 1
fi

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

echo "  Input:  $INPUT"
echo "  Output: $OUTPUT_DIR/frame_%04d.webp"
echo "  FPS:    30"
echo "  Quality: 80 (WebP, visually lossless)"
echo ""
echo "► Extracting frames..."
echo ""

# Remove any existing frames to avoid stale files from previous runs
rm -f "$OUTPUT_DIR"/frame_*.webp

# -vcodec libwebp forces static (non-animated) WebP per frame.
# Without this, newer FFmpeg defaults to libwebp_anim and outputs 1 file.
ffmpeg -i "$INPUT" \
  -vf fps=30 \
  -vcodec libwebp \
  -lossless 0 \
  -compression_level 4 \
  -q:v 80 \
  -an \
  -y \
  "$OUTPUT_DIR/frame_%04d.webp"

# Count extracted frames
FRAME_COUNT=$(ls "$OUTPUT_DIR"/frame_*.webp 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "✓ Extraction complete"
echo ""
echo "  Frames extracted: $FRAME_COUNT"
echo "  Output directory: $OUTPUT_DIR"
echo ""
echo "─────────────────────────────────────────────────────"
echo "  NEXT STEP: Update lib/constants.ts"
echo ""
echo "  Change:"
echo "    export const TOTAL_FRAMES = 300;"
echo "  To:"
echo "    export const TOTAL_FRAMES = $FRAME_COUNT;"
echo "─────────────────────────────────────────────────────"
