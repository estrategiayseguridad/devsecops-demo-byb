import { defineConfig } from "vite";
import { resolve } from "node:path";

// Sitio estático multipágina. La raíz es /src y la salida estática va a /dist.
// Cada página HTML se declara como entrada para que Vite genere su propio bundle.
export default defineConfig({
  root: "src",
  base: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        acerca: resolve(__dirname, "src/pages/acerca.html"),
        contacto: resolve(__dirname, "src/pages/contacto.html"),
        buscar: resolve(__dirname, "src/pages/buscar.html"),
        // VULN: A01 – la página "interna" se publica como estático (sin control).
        interno: resolve(__dirname, "src/pages/interno.html"),
      },
    },
  },
});
