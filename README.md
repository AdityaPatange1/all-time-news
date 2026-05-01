## All Time News Landing Page

A production-ready one-page Next.js landing page for **All Time News**, a global news syndicate focused on geopolitical awareness.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

3. Add your MongoDB connection details in `.env.local`:

```bash
MONGODB_URI="your-mongodb-uri"
MONGODB_DB="all_time_news"
MONGODB_COLLECTION="contacts"
```

4. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Framer Motion for section animations
- next-themes for dark/light mode
- MongoDB for contact submissions

## Contact Form API

- Endpoint: `POST /api/contact`
- Stores validated submissions in MongoDB
- Uses schema validation and safe error responses for production reliability
