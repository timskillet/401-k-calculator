# 401(k) Calculator

A React + TypeScript application built with Vite for calculating 401(k) retirement savings projections.

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

You can check if you have Node.js installed by running:
```bash
node --version
npm --version
```

## Getting Started

### 1. Install Dependencies

First, navigate to the project directory and install all required dependencies:

```bash
npm install
```

This will install all the packages listed in `package.json`, including React, TypeScript, Vite, and other dependencies.

### 2. Run the Development Server

To start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is already in use). The terminal will display the exact URL.

The development server will automatically reload when you make changes to the code.

### 3. Build for Production

To create a production build of the application:

```bash
npm run build
```

This will compile TypeScript and bundle the application for production. The output will be in the `dist` directory.

### 4. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

This serves the built application from the `dist` directory.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check for code issues

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library