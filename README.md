# Zealthy Mini-EMR & Patient Portal

A streamlined Electronic Medical Record (EMR) system and Patient Portal built for clinical efficiency and patient engagement. This application provides a seamless interface for both healthcare providers and patients to manage records, appointments, and prescriptions.

## Core Features

### Patient Portal
*   **Secure Access**: Personalized login for patients to access their health data.
*   **Health Overview**: A comprehensive dashboard showing upcoming appointments and medication refills.
*   **Appointment Tracking**: View and manage scheduled visits with healthcare providers.
*   **Prescription Management**: Keep track of active medications, dosages, and refill schedules.
*   **Mobile Optimized**: Responsive design for access on any device.

### Mini-EMR (Admin)
*   **Patient Records**: Centralized management of patient profiles and history.
*   **Scheduling**: Efficient tools for creating and modifying patient appointments.
*   **Clinical Prescriptions**: Streamlined workflow for prescribing medications and managing refills.
*   **Professional Interface**: High-contrast, clean UI designed for fast-paced clinical environments.

## Technology Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4
*   **Data Layer**: In-memory data store (optimized for rapid deployment and testing)
*   **Icons**: Lucide React

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

3.  **Run the development server**
    ```bash
    npm run dev
    ```

    *   **Patient Portal**: [http://localhost:3000](http://localhost:3000)
    *   **Admin EMR**: [http://localhost:3000/admin](http://localhost:3000/admin)

## Data Management

This version of the application uses an **in-memory data store**. 
*   **Initial Data**: The system is pre-populated with sample patient records (Mark Johnson and Lisa Smith) to demonstrate the full functionality immediately.
*   **Persistence**: Data persists during the active session. Note that the store resets if the server process is restarted or redeployed.
*   **Deployment**: Optimized for zero-config deployment on platforms like Vercel without requiring external database setup.

## Project Structure

*   `src/app`: Application routes and page layouts.
*   `src/components`: Reusable UI components and design system.
*   `src/actions`: Server-side logic for data mutations (CRUD).
*   `src/lib`: Core database logic and shared utilities.

