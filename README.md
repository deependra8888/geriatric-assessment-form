# Geriatric Care Assessment Form

React 19 + TypeScript + Mantine + Zod implementation of the take-home assignment.

## Run

```bash
npm install
npm run dev
```

Run checks with `yarn test`; build with `yarn build`.

Deployment URL: not yet deployed. Publishing requires a hosting account or
platform credentials, which are not available in this workspace.

All patient data is fictional. Unfinished: deploy the built app and add its
public URL here. I would next publish `dist` to a static host, verify the
deployed form in a browser, and update this section. Local implementation and
automated checks took roughly 1 hour.

## Verification

`yarn test` passes typecheck, lint, format checking, 12 tests, and the
production build. The build emits only dependency annotation and bundle-size
warnings; neither prevents deployment.
