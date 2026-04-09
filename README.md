# Portfolio Website

Simple and professional portfolio website built with React + Vite, GSAP animation, and Firebase Hosting deployment setup.

## Tech Stack

- React (Vite)
- GSAP (with ScrollTrigger)
- React Bits inspired reveal component pattern (`src/components/reactbits/FadeContent.jsx`)
- Firebase Hosting

## Run Locally

1. Install dependencies:
   npm install
2. Start dev server:
   npm run dev
3. Build for production:
   npm run build

## Deploy to Firebase Hosting

1. Update `.firebaserc` and set your project id.
2. Login to Firebase CLI:
   npx firebase login
3. Deploy:
   npm run deploy

## Notes

- Update contact details in `src/data/portfolioData.js`.
- Replace profile photo URL in `src/data/portfolioData.js` with your own professional image.
- Replace `public/Sebastian-Ampon-Resume.pdf` with your official resume PDF.
