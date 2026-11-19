// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './src/data/site.ts';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Dominio final. Se puede pisar en el deploy con la variable de entorno SITE_URL.
  site: process.env.SITE_URL || SITE_URL,
  // 100 % estático: todo el contenido sale en el HTML, sin renderizado en el cliente.
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // El CSS (Tailwind ya purgado) va inline en el <head>: cero requests que bloqueen el render.
    inlineStylesheets: 'always',
    format: 'directory',
  },
  compressHTML: true,
  image: {
    // Las imágenes locales se convierten a AVIF/WebP en el build (sharp).
    responsiveStyles: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
