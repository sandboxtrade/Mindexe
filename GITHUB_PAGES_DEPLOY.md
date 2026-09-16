# GitHub Pages deployment

This repository contains Vite source code. Do not publish the repository root directly with GitHub Pages.

Use GitHub Pages -> Build and deployment -> Source: GitHub Actions.

The workflow `.github/workflows/pages.yml` will:
1. install dependencies;
2. run the regression and syntax checks;
3. build the Vite production bundle into `dist/`;
4. deploy only `dist/` to GitHub Pages.

For normal updates, commit source changes to `main`. GitHub Actions will rebuild and publish automatically.
