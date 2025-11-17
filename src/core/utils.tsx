import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getColorValue = (color: string | undefined, alpha = 1) => {
	if (!color) return undefined;
	return `color-mix(in srgb, var(--color-${color}) ${alpha * 100}%, transparent)`;
};
