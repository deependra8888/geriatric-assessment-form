# Geriatric Care Assessment Form

React 19 + TypeScript + Mantine + Zod implementation of the take-home assignment.

## Run

```bash
npm install
npm run dev
```

Run checks with `yarn test`; build with `yarn build`.

Deployment URL: https://geriatric-assessment-form-psi.vercel.app/

All patient data is fictional. Local implementation and automated checks took
roughly 1 hour.

## Verification

`yarn test` passes typecheck, lint, format checking, 12 tests, and the
production build. The build emits only dependency annotation and bundle-size
warnings; neither prevents deployment.
