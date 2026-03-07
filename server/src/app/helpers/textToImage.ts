import { createCanvas, registerFont } from "canvas";
import cloudinary from "../lib/cloudinary";

registerFont("./public/fonts/Poppins/Poppins-Regular.ttf", {
  family: "Poppins",
});
registerFont("./public/fonts/Poppins/Poppins-Bold.ttf", {
  family: "Poppins",
  weight: "bold",
});

const WIDTH = 1080;
const HEIGHT = 1920;

function wrapText(ctx: any, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line + word + " ";
    const width = ctx.measureText(testLine).width;

    if (width > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }

  lines.push(line.trim());
  return lines;
}

function createGradient(ctx: any, colors: string[]) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);

  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });

  return gradient;
}

export async function generateAndUploadStory(payload: any) {
  const canvas = createCanvas(1080, 1920);
  const ctx = canvas.getContext("2d");

  // background
  if (payload.background.type === "gradient") {
    ctx.fillStyle = createGradient(ctx, payload.background.colors);
  } else {
    ctx.fillStyle = payload.background.value;
  }

  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // text style
  const {
    fontFamily,
    fontSize,
    fontWeight = "normal",
    fontStyle = "normal",
    textColor,
    textAlign = "center",
  } = payload.style;

  ctx.fillStyle = textColor;
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = textAlign;
  ctx.textBaseline = "middle";

  const lines = wrapText(ctx, payload.text, WIDTH * 0.8);

  const lineHeight = fontSize * 1.2;
  const startY = HEIGHT / 2 - (lines.length / 2) * lineHeight;

  lines.forEach((line: string, i: number) => {
    ctx.fillText(line, WIDTH / 2, startY + i * lineHeight);
  });

  // convert to buffer
  const buffer = canvas.toBuffer("image/png");

  // upload to cloudinary
  const uploadResult = await new Promise<{
    url: string;
    pub_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "connecto/stories",
        resource_type: "image",
        filename_override: `${Date.now()}.png`,
      },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            url: result?.secure_url as string,
            pub_id: result?.public_id as string,
          } as { url: string; pub_id: string });
      },
    );

    stream.end(buffer);
  });

  return uploadResult;
}
