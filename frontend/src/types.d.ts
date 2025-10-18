// Temporary module declaration to satisfy TypeScript for the Vite Tailwind plugin
// Place this file in `src/` so it's picked up by the frontend tsconfig's include.
declare module '@tailwindcss/vite' {
  import { Plugin } from 'vite'
  const plugin: () => Plugin
  export default plugin
}
