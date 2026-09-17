# GitHub Pages deployment

This repository contains Vite source code. Do not publish the repository root directly with GitHub Pages.

Use GitHub Pages -> Build and deployment -> Source: GitHub Actions.

The workflow `.github/workflows/pages.yml` will:
1. install dependencies;
2. run the regression and syntax checks;
3. build the Vite production bundle into `dist/`;
4. deploy only `dist/` to GitHub Pages.

For normal updates, commit source changes to `main`. GitHub Actions will rebuild and publish automatically.

## App Check production secret

If you have provisioned reCAPTCHA Enterprise for Firebase App Check, add this GitHub Actions repository secret before deployment:

`VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`

The Pages workflow forwards it only to the Vite build step. If the secret is absent, the existing registered reCAPTCHA v3 provider remains the compatibility fallback.

