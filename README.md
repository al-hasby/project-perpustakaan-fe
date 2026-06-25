# project-perpustakaan-fe

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Registration / Demo accounts

- This frontend supports creating member accounts from the `/register` page.
- If your backend provides `POST /auth/register`, the app will use it and log you in with the backend token.
- If the backend endpoint is not available, the app falls back to saving a demo user in `localStorage` (key: `local_demo_users`) and logs in with a fake token — this is for local/demo use only.

To test locally:

```sh
npm run dev
# open http://localhost:5173/register
```

After registering you should be redirected to the home page and see your name in the header.
