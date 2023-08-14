## MNC Development Listing Site

View the live website [here!](https://mnc-development.web.app/)

This repository hosts the source code for the MNC Development Property Listing website. The site runs using a frontend of [React](https://react.dev/) + [Vite](https://vitejs.dev/) and [Tailwind CSS](https://tailwindcss.com/) along with a [Firebase](https://firebase.google.com/) backend.

## Setting up your dev environment to run the site

Ensure that npm (bundled with [Node.js](https://nodejs.org/en)) is installed. Then run the following commands:

```bash
git clone https://github.com/cowanconsultingforms/mnc-beta.git
cd mnc-beta
npm install
npm run dev
```

**Note:** certain functionalites may not work when running the site locally due to domain restrictions on the API key. The production API key only runs on the official site domain. Therefore, a separate development API key is necessary to access the various google APIs utilized in this project.
