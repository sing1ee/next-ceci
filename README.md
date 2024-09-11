# My Shadcn Demo

This is a Next.js project using shadcn/ui components and Supabase for backend services. It includes features such as user profiles with avatars, character divination, and a chatbot interface.

## Prerequisites

-   Node.js (version 14 or later)
-   pnpm
-   Supabase CLI

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/next-cezi.git
cd next-cezi
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your Supabase project and update the `.env.local` file with your Supabase URL and anon key.

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

-   `pnpm dev`: Runs the app in development mode
-   `pnpm build`: Builds the app for production
-   `pnpm start`: Runs the built app in production mode
-   `pnpm lint`: Runs the linter

## Supabase Migrations

To run Supabase migrations:

1. Install Supabase CLI if you haven't already:

```bash
pnpm add -g supabase
```

2. Link your project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your Supabase project reference.

3. Push the migrations:

```bash
supabase db push
```

## Project Structure

-   `components/`: Contains React components including ChatBot, UserProfileEdit, and CharacterDivination
-   `app/`: Next.js app directory with pages and layouts
-   `lib/`: Utility functions and configurations
-   `supabase/migrations/`: Supabase migration files for database schema

## Features

-   User Profile Management: Users can edit their display name and upload avatars
-   Character Divination: A feature for character-based divination
-   ChatBot: An interactive chatbot interface

## Adding New Components

This project uses shadcn/ui components. To add a new component:

```bash
pnpm dlx shadcn@latest add component-name
```

Replace `component-name` with the name of the component you want to add.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

-   [Next.js Documentation](https://nextjs.org/docs)
-   [Supabase Documentation](https://supabase.io/docs)
-   [shadcn/ui Documentation](https://ui.shadcn.com)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
