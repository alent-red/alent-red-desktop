import { AVATAR_OUTPUT_MIME_TYPE } from '@/features/agents/lib/avatar-output-mime-type';

const AVATAR_TARGET_SIZE_PX = 512;

export async function encodeAvatarFileAsBase64(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_TARGET_SIZE_PX;
  canvas.height = AVATAR_TARGET_SIZE_PX;
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Canvas context unavailable');
  }
  drawCenteredCover(context, image);
  const dataUrlOut = canvas.toDataURL(AVATAR_OUTPUT_MIME_TYPE);
  return extractBase64Payload(dataUrlOut);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject): void => {
    const reader = new FileReader();
    reader.onload = (): void => {
      resolve(reader.result as string);
    };
    reader.onerror = (): void => {
      reject(reader.error ?? new Error('File read failed'));
    };
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject): void => {
    const image = new Image();
    image.onload = (): void => {
      resolve(image);
    };
    image.onerror = (): void => {
      reject(new Error('Image decode failed'));
    };
    image.src = src;
  });
}

function drawCenteredCover(context: CanvasRenderingContext2D, image: HTMLImageElement): void {
  const target = AVATAR_TARGET_SIZE_PX;
  const sourceAspect = image.width / image.height;
  let sourceX: number;
  let sourceY: number;
  let sourceWidth: number;
  let sourceHeight: number;
  if (sourceAspect > 1) {
    sourceHeight = image.height;
    sourceWidth = image.height;
    sourceX = (image.width - sourceWidth) / 2;
    sourceY = 0;
  } else {
    sourceWidth = image.width;
    sourceHeight = image.width;
    sourceX = 0;
    sourceY = (image.height - sourceHeight) / 2;
  }
  context.clearRect(0, 0, target, target);
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, target, target);
}

function extractBase64Payload(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('Invalid data URL');
  }
  return dataUrl.slice(commaIndex + 1);
}
