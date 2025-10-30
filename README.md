This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Persistence Setup (Redis)

This app can persist player data (registrations, bios, likes, photos, totals, player-of-the-game) using Redis.

### 1) Create an `.env.local` file
Create a file named `.env.local` in the project root with:

```
# Redis connection string for persistence across restarts
# Examples:
#   redis://localhost:6379
#   rediss://default:<password>@<host>:<port>
REDIS_URL=redis://localhost:6379

# Only needed if you enable real uploads (not the fake upload)
BLOB_READ_WRITE_TOKEN=
```

If you cannot create dotfiles in your editor, use a terminal:

```bash
cd /Users/I556101/soccer-profile-app/soccer-profile-app
printf "REDIS_URL=redis://localhost:6379\nBLOB_READ_WRITE_TOKEN=\n" > .env.local
```

### 2) Start a local Redis
- Docker: `docker run --name soccer-redis -p 6379:6379 -d redis:7`
- Homebrew (macOS): `brew install redis && brew services start redis`

### 3) Restart the dev server
```bash
npm run dev
```

### 4) Verify persistence
- Register a player, edit bio/likes, update Player of the Game, upload a photo.
- Stop the dev server and start it again. Your changes should remain.

Data stored via Redis keys (for reference):
- `players:registered` – registered player list
- `player:<id>:meta` – bio, likes, playerOfGame
- `player:<id>:photoUrl` – photo
- `player:<id>:totals` – goals, assists
