module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'vitest related --run --coverage=false',
  ],
  '*.{json,md,mdx,css,html,yml,yaml,scss}': ['prettier --write'],
};
