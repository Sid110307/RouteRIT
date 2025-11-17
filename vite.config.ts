import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
	plugins: [
		react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
		tailwindcss(),
		viteCompression(),
		ViteImageOptimizer(),
	],
	server: { port: 3000 },
	resolve: { alias: { "@": "/src" } },
	build: { emptyOutDir: true },
});