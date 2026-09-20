// Re-export compiled runtime when available so platforms that run
// `node src/index.ts` (e.g., Render configured with that start command)
// execute the built JS at `dist/index.js` instead of trying to run
// TypeScript source directly.

export { default } from '../dist/index.js';
