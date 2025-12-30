# Zealthy EMR Application

A modern Electronic Medical Record (EMR) application built with Next.js, Prisma, and Supabase.

## Live Demo

The application is deployed on Vercel and connected to a live Supabase database:

- **Patient Portal**: [https://zealthy-mini.vercel.app](https://zealthy-mini.vercel.app)
- **Patient Dashboard**: [https://zealthy-mini.vercel.app/dashboard](https://zealthy-mini.vercel.app/dashboard)
- **Admin Dashboard**: [https://zealthy-mini.vercel.app/admin](https://zealthy-mini.vercel.app/admin)

### Demo Credentials

To test the application, you can use these demo credentials:

**Patient Login:**
- Email: `mark@some-email-provider.net`
- Password: `Password123!`

**How to access Admin:**
- Navigate directly to [/admin](https://zealthy-mini.vercel.app/admin)
- The admin dashboard has no authentication (for demo purposes)

## Features

- **Patient Portal**: Patients can view their upcoming appointments and current prescriptions.
- **Admin Dashboard**: Administrators can manage patient records, schedule appointments, and issue prescriptions.
- **Persistent Storage**: Powered by Supabase Postgres for reliable data persistence.
- **Type-Safe Database Access**: Integrated with Prisma ORM for a robust developer experience.
- **Robust Validation**: Comprehensive input validation and logical constraints to ensure data integrity.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Supabase (Postgres)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod & Custom Logic

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Supabase account and project

### 2. Environment Variables
Create a `.env` file in the root directory and add your Supabase connection string:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres"
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
Push the schema to your Supabase database:
```bash
npx prisma db push
```

### 5. Seed Data (Optional)
Populate the database with initial demo patients:
```bash
npx prisma db seed
```

### 6. Run the Application
```bash
npm run dev
```

## Architecture

### Database Layer
The application uses a unified database layer in `src/lib/db.ts` that wraps the Prisma Client. This layer includes:
- **Input Validation**: Checks for empty fields and valid formats.
- **Business Logic**: Ensures appointments are in the future and quantities are positive.
- **Error Handling**: Provides user-friendly error messages for common issues like duplicate emails.

### Server Actions
All data mutations are handled via Next.js Server Actions in `src/actions/`. These actions include pre-validation to provide immediate feedback to the user.

## Deployment

This application is ready for deployment on **Vercel**. Since it uses Supabase for persistence, data will remain consistent across all serverless instances.
