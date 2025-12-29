# Zealthy Mini-EMR and Patient Portal

A modern, professional Mini-EMR and Patient Portal application built with Next.js, Tailwind CSS, and Prisma.

## Features

### Patient Portal
- **Secure Login**: Patient authentication with session management.
- **Dashboard**: At-a-glance view of upcoming appointments and refill schedules.
- **Appointments**: Detailed timeline view of upcoming visits.
- **Prescriptions**: Grid view of active medications and refill statuses.
- **Responsive Design**: Fully optimized for mobile and desktop.

### Mini-EMR (Admin)
- **Patient Management**: Create, view, and update patient records.
- **Appointment Management**: Schedule and modify appointments.
- **Prescription Management**: Prescribe medications and manage refills.
- **Professional UI**: Clean, high-contrast interface for clinical efficiency.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (with Prisma ORM)
- **Icons**: Lucide React

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd zealthy-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up the database**
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the Patient Portal.
    Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the EMR.

## Deployment

### Vercel Deployment Note
This application uses **SQLite** for simplicity and ease of setup. 
- **Important**: If deploying to Vercel, the SQLite database will be **read-only** or **ephemeral** (resetting on every redeploy/function invocation) because Vercel Serverless functions do not have a persistent writable file system.
- **Recommendation**: For a persistent production deployment, switch the Prisma provider to PostgreSQL (e.g., Vercel Postgres, Neon, or Supabase) in `prisma/schema.prisma` and update the `DATABASE_URL` environment variable.

### Build Scripts
The `package.json` includes a `postinstall` script to ensure Prisma client is generated during deployment:
```json
"postinstall": "prisma generate"
```

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/actions`: Server Actions for data mutation (CRUD).
- `src/lib`: Utility functions and shared logic.
- `prisma`: Database schema and seed scripts.
