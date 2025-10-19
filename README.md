# Manage Social Messages App

A React + Vite application for managing social media messages and mentions.
It uses the backend provided by [manage-social-messages-api](https://github.com/m3lc/manage-social-messages-api).
The endpoint is configured from environment variable `VITE_API_BASE_URL`.
Default location of the API is `http://localhost:3000/v1.

## 🚀 Quick Start with Docker (Recommended)

The easiest way to run this app is with Docker:

```bash
# Start the app
docker compose up

# App will be available at http://localhost:5173
```

That's it! The app runs with hot reload enabled - any changes you make will instantly reflect.

### Docker Commands

```bash
# Start in background
docker compose up -d

# Stop the app
docker compose down

# Rebuild after dependency changes
docker compose up --build

# View logs
docker compose logs -f frontend
```

## 💻 Local Development (Without Docker)

If you prefer running without Docker:

### Prerequisites

- Node.js 20+ installed
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## 🔧 Configuration

Edit `.env` to configure the API endpoint:

```env
VITE_API_BASE_URL=http://localhost:3000/v1
```

## 📦 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool with HMR
- **React Router** - Routing
- **TanStack Table** - Data tables
- **Axios** - HTTP client
- **ESLint + Prettier** - Code quality

## 🏗️ Project Structure

```
src/
├── assets/          # Static assets
├── contexts/        # React contexts with hooks and providers (login, mentions, users)
├── features/        # Feature-based modules, representing screens
├── services/        # API services and utilities
└── main.jsx         # App entry point
```

## 🐳 Production Deployment

Build production image:

```bash
docker build --target production -t manage-social-messages-app .
docker run -p 80:80 manage-social-messages-app
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
