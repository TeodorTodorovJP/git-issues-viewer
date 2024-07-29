
I have tried my best to make server components but I could not.
The initial page which holds the form, has to be client side, which means that all it's children would be client too.
To avoid that I can pass the components as children or params to the form (to avoid using import), but that would work only if those components don't need any dynamic data.


As every project the first step after cloning the repo, you run ```npm install```

After that you can user the default documentation

If you want to test the dev version, run ```npm run dev```

If you want to test the production version, run ```npm run build``` and then ```npm run start```

I attempted to implement jest for unit testing as requested, but encountered too many run time errors from the provided setup from the documentation.
https://nextjs.org/docs/app/building-your-application/testing/jest

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
