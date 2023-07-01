import { Canvas } from "canvas";
import sharp from "sharp";

function drawCircle(canvas: Canvas, x: number, y: number, type: 'alignment' | 'response', value?: number) {
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(x, y, type === 'alignment' ? 25 : 10, 0, 2 * Math.PI);

  if (type === 'alignment') {
    ctx.setLineDash([10, 10]);
    ctx.lineCap = 'round';
    ctx.lineWidth = 7.5;
    ctx.strokeStyle = '#22c55e'
    ctx.stroke()
  } else {
    const colorMap = ["#e11d48", "#c026d3", "#9333ea", "#4f46e5", "#3b82f6"]
    ctx.fillStyle = colorMap[value ?? 0];
    ctx.fill();
  }
}

function* choiceGenerator(total: number) {
  const unit = 15
  let index = 0, x = 45, y = 10

  while (index < total) {
    if (!(index % 40) && (index)) {
      x += 70
      y = 10
    }
    else if (!(index % 5) && (index))
      y += 15

    y += unit

    yield {
      index: index + 1,
      choices: [
        { name: 'True', value: 1, chord: [x, y] as [number, number] | null },
        { name: 'False', value: 0, chord: [x + unit, y] as [number, number] | null },
      ]
    }

    index++;
  }
}

async function calculateBWRatio(imageBuffer: Buffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    const numPixels = width * height;
    let numWhitePixels = 0;

    // Iterate over the pixel data and count white pixels
    for (let i = 0; i < numPixels; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const alpha = data[i * 4 + 3];

      // Check if the pixel is white (RGB values close to 255) and fully opaque
      if (r >= 250 && g >= 250 && b >= 250 && alpha === 255) {
        numWhitePixels++;
      }
    }

    // Calculate the percentage of white pixels
    return numWhitePixels / numPixels
  } catch (error: any) {
    console.error('Error occurred while calculating whiteness percentage:', error);
    throw Error(error)
  }
}

export { calculateBWRatio, choiceGenerator, drawCircle }