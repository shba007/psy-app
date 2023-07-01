import { spawn } from "node:child_process";

// import { createCanvas, loadImage } from "canvas";
import sharp from "sharp";

import { calculateBWRatio, choiceGenerator, drawCircle } from "./helper";

interface Input {
  index: number;
  choices: {
    name: string;
    value: number;
    chord: number[] | null;
  }[];
}

interface Highlight {
  (imageBuffer: Buffer, inputs: Input[], type: 'alignment', responses?: undefined): Promise<Buffer>;
  (imageBuffer: Buffer, inputs: Input[], type: 'response' | 'both', responses: { index: number, value: number | null }[]): Promise<Buffer>;
}

const highlight: Highlight = async (imageBuffer, inputs, type, responses) => {
  /* const [isAlignment, isResponse] = [type === 'alignment' || type === 'both', type === 'response' || type === 'both']

  const dots = inputs.flatMap(({ choices }) => choices.map(({ chord }) => chord))
  // Load the image
  return loadImage(imageBuffer).then((image) => {
    // Create a canvas with the same dimensions as the image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    let index = 0
    for (const dot of dots) {
      if (!dot)
        continue

      const [x, y] = dot

      if (isAlignment)
        drawCircle(canvas, x, y, 'alignment');

      if (isResponse) {
        const choice = !!responses ? responses[Math.floor(index / 2)].value : null
        if (choice !== null && choice === 1 - index % 2)
          drawCircle(canvas, x, y, 'response', choice * 4);
      }

      index++
    }

    return canvas.toBuffer("image/jpeg")
  }); */
  return Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
}


async function detectMarkers(imagePath: string): Promise<{ id: number, position: number }[]> {
  const python = spawn('venv/Scripts/python.exe', ['python/detect_markers.py']);

  const imageBuffer = await sharp(imagePath).toBuffer()
  python.stdin.write(imageBuffer);
  python.stdin.end();

  return new Promise<{ id: number, position: number }[]>((resolve, reject) => {
    python.stdout.on('data', (data: Buffer) => {
      let result = data.toString().trim();
      result = JSON.parse(result);
      // console.log("detectMarkers", { result });

      resolve(result as any);
    });

    python.stderr.on('data', (error: Buffer) => {
      console.error("Error detectMarkers ", error.toString());
      reject(error.toString());
    })
  })
}

async function alignCrop(imagePath: string, markers: { id: number, position: number }[]): Promise<Buffer> {
  const python = spawn('venv/Scripts/python.exe', ['python/align_crop.py', JSON.stringify(markers)]);

  const imageBuffer = await sharp(imagePath).toBuffer()
  python.stdin.write(imageBuffer);
  python.stdin.end();

  return new Promise<Buffer>((resolve, reject) => {
    python.stdout.on('data', async (data: Buffer) => {
      let result = await sharp(data)
        .toBuffer()
      // await sharp(result).toFile("./temp/cropped.jpg")

      resolve(result);
    });

    python.stderr.on('data', (error: Buffer) => {
      console.error("Error alignCrop ", error.toString());
      reject(error.toString());
    })
  })
}

async function alignInputs(imageBuffer: Buffer, choiceCount: number): Promise<Input[]> {
  const factor = 4
  const startX = 10
  const startY = 90

  let inputs = Array.from(choiceGenerator(choiceCount)).map(({ index, choices }) => ({
    index,
    choices: choices.map(({ name, value, chord }) => {
      let [x, y] = chord ?? [0, 0]
      x = (startX + x) * factor
      y = (startY + y) * factor

      return { name, value, chord: chord !== null ? [x, y] : null }
    })
  }))

  const python = spawn('venv/Scripts/python.exe', ['python/align_inputs.py', JSON.stringify(inputs)]);
  python.stdin.write(imageBuffer);
  python.stdin.end();

  return new Promise<{
    index: number;
    choices: {
      name: string;
      value: number;
      chord: number[];
    }[];
  }[]>((resolve, reject) => {
    python.stdout.on('data', async (data: Buffer) => {
      let result: string = data.toString().trim();
      result = JSON.parse(result);
      // console.log("highlight", { result });

      // @ts-ignore
      resolve(result);
    });

    python.stderr.on('data', (error: Buffer) => {
      console.error("Error highlight", error.toString());
      reject(error.toString());
    })
  })

}

function extractMeta(imageBuffer: Buffer): Promise<{ scale: string, page: { current: number, total: number } }> {
  const python = spawn('venv/Scripts/python.exe', ['python/detect_qrcode.py']);

  python.stdin.write(imageBuffer);
  python.stdin.end();

  return new Promise<{ scale: string, page: { current: number, total: number } }>((resolve, reject) => {
    python.stdout.on('data', (data: Buffer) => {
      let result: string = data.toString().trim();
      result = JSON.parse(result);
      // console.log("detectQRCode", { result });

      // @ts-ignore
      resolve({ scale: result.scale, page: { current: result.curr, total: result.total } });
    });

    python.stderr.on('data', (error: Buffer) => {
      console.error("Error extractMeta ", error.toString());
      reject(error.toString());
    })
  })
}

async function preprocess(imageBuffer: Buffer): Promise<Buffer> {
  const python = spawn('venv/Scripts/python.exe', ['python/preprocess.py']);

  python.stdin.write(imageBuffer);
  python.stdin.end();

  return new Promise((resolve, reject) => {
    python.stdout.on('data', async (data: Buffer) => {
      let result = await sharp(data)
        .toBuffer()
      // await sharp(result).toFile("./temp/aligned.jpg")

      resolve(result);
    });

    python.stderr.on('data', (error: Buffer) => {
      console.error("Error preprocess ", error.toString());
      reject(error.toString());
    })
  })
}

// imagePath: string
async function extractData(imageBuffer: Buffer, inputs: Input[]): Promise<{ index: number; value: number | null; }[]> {
  const factor = 4
  const threshold = 0.12

  imageBuffer = await preprocess(imageBuffer)

  return Promise.all(inputs.map(async ({ index, choices }) => {
    const bwRatios: number[] = []
    for (const { name, chord } of choices) {
      if (!chord)
        continue

      const [x, y] = chord
      const w = 12, h = 12;
      const left = x - (w / 2) * factor, top = y - (h / 2) * factor
      const width = w * factor, height = h * factor;

      const cropImage = await sharp(imageBuffer)
        .extract({ left, top, width, height })
        .toBuffer()

      // await sharp(cropImage).toFile(`./temp/inputs/${index}-${name}.jpg`)

      const bwRatio = await calculateBWRatio(cropImage)
      bwRatios.push(bwRatio)
    }
    let choiceIndex: number | null = bwRatios.indexOf(Math.min(...bwRatios));
    const secondChoiceIndex: number | null = bwRatios.indexOf(Math.min(...bwRatios.filter((_, index) => index !== choiceIndex)));

    // choiceIndex = bwRatios[choiceIndex] < threshold ? choiceIndex : null
    // secondChoiceIndex = bwRatios[secondChoiceIndex] < threshold ? secondChoiceIndex : null
    const deltaBWRatio = choiceIndex !== null && secondChoiceIndex !== null ? bwRatios[choiceIndex] - bwRatios[secondChoiceIndex] : null

    if (deltaBWRatio !== null && Math.abs(deltaBWRatio) >= threshold)
      choiceIndex = deltaBWRatio < 0 ? choiceIndex : secondChoiceIndex
    else
      choiceIndex = null

    return {
      index,
      value: choiceIndex !== null ? choices[choiceIndex].value : choiceIndex,
      deltaBWRatio
    }
  }))
}

export { detectMarkers, alignCrop, alignInputs, highlight, extractMeta, extractData }