import { aspectRatioOptions } from "@/constants";
import { type ClassValue, clsx } from "clsx";
import qs from "qs";
import { twMerge } from "tailwind-merge";

/* -------------------- CLASSNAME MERGER -------------------- */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------- ERROR HANDLER -------------------- */
export const handleError = (error: unknown): never => {
  if (error instanceof Error) {
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    throw new Error(`Error: ${error}`);
  } else {
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

/* -------------------- SHIMMER PLACEHOLDER (LOADER) -------------------- */
const shimmer = (w: number, h: number): string => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string): string =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const dataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(1000, 1000)
)}`;

/* -------------------- FORM URL QUERY -------------------- */
interface FormUrlQueryParams {
  searchParams: URLSearchParams;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({
  searchParams,
  key,
  value,
}: FormUrlQueryParams): string => {
  const params = { ...qs.parse(searchParams.toString()), [key]: value };

  return `${window.location.pathname}?${qs.stringify(params, {
    skipNulls: true,
  })}`;
};

/* -------------------- REMOVE KEYS FROM QUERY -------------------- */
interface RemoveUrlQueryParams {
  searchParams: string;
  keysToRemove: string[];
}

export function removeKeysFromQuery({
  searchParams,
  keysToRemove,
}: RemoveUrlQueryParams): string {
  const currentUrl = qs.parse(searchParams) as Record<string, unknown>;

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  // Remove null or undefined values
  Object.keys(currentUrl).forEach((key) => {
    if (currentUrl[key] == null) delete currentUrl[key];
  });

  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

/* -------------------- DEBOUNCE FUNCTION -------------------- */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>): void => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/* -------------------- GET IMAGE SIZE -------------------- */
export type AspectRatioKey = keyof typeof aspectRatioOptions;

interface ImageType {
  aspectRatio?: string;
  width?: number;
  height?: number;
}

export const getImageSize = (
  type: string,
  image: ImageType,
  dimension: "width" | "height"
): number => {
  if (type === "fill") {
    return (
      aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] ||
      1000
    );
  }
  return image?.[dimension] ?? 1000;
};

/* -------------------- DOWNLOAD IMAGE -------------------- */
export const download = async (
  url: string,
  filename: string
): Promise<void> => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobURL = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobURL;

    if (filename && filename.length)
      a.download = `${filename.replace(" ", "_")}.png`;

    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Download error:", error);
  }
};

/* -------------------- DEEP MERGE OBJECTS -------------------- */
export const deepMergeObjects = <T extends Record<string, unknown>>(
  obj1: T,
  obj2: Partial<T>
): T => {
  if (obj2 === null || obj2 === undefined) {
    return obj1;
  }

  const output: Record<string, unknown> = { ...obj2 };

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (
        val1 &&
        typeof val1 === "object" &&
        val2 &&
        typeof val2 === "object"
      ) {
        output[key] = deepMergeObjects(
          val1 as Record<string, unknown>,
          val2 as Record<string, unknown>
        );
      } else {
        output[key] = val1;
      }
    }
  }

  return output as T;
};
