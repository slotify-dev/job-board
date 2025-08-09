# Claude AI Assistant Guidelines

## Development Rules

### 1. TypeScript Types

- **NEVER use `any` type**
- Always use proper TypeScript interfaces, types, and generics
- Prefer strict typing over loose typing

### 2. Package Manager

- **Always use `bun` for package management**
- Never use `npm` or `yarn` unless explicitly requested
- Use `bun install`, `bun run`, `bun test`, etc.

### 3. Code Quality

- **After every job, MUST run:**

  ```bash
  bun run format:all
  bun run lint:staged
  ```

- Ensure code passes all linting and formatting checks before completion

## Project Structure

```text
job-board/
├── apps/
│   ├── backend/                    # Node.js/Express API
│   │   ├── src/
│   │   │   ├── __tests__/          # Jest test files
│   │   │   │   ├── middleware/     # Middleware tests
│   │   │   │   ├── schemas/        # Schema validation tests
│   │   │   │   └── utils/          # Test helpers
│   │   │   ├── config/             # App configuration
│   │   │   ├── database/           # Database models & migrations
│   │   │   │   ├── models/         # Drizzle ORM models
│   │   │   │   ├── migrations/     # SQL migration files
│   │   │   │   └── repository/     # Data access layer
│   │   │   ├── middleware/         # Express middleware
│   │   │   ├── modules/            # Feature modules
│   │   │   │   ├── auth/           # Authentication
│   │   │   │   ├── employer/       # Employer job management
│   │   │   │   ├── jobs/           # Job browsing
│   │   │   │   └── applications/   # Application management
│   │   │   └── services/           # Business logic services
│   │   ├── package.json
│   │   └── jest.config.js
│   └── frontend/                   # React/Vite frontend
│       ├── src/
│       │   ├── components/         # Shared components
│       │   ├── modules/            # Feature-specific modules
│       │   │   ├── auth/           # Authentication UI
│       │   │   ├── employer/       # Employer dashboard
│       │   │   ├── job-browsing/   # Job search & apply
│       │   │   └── application-review/ # Application management
│       │   ├── hooks/              # Custom React hooks
│       │   ├── services/           # API service layer
│       │   └── types/              # TypeScript type definitions
│       └── package.json
├── package.json                    # Root workspace config
├── eslint.config.js               # ESLint configuration
└── CLAUDE.md                      # This file
```

## Technology Stack

### Backend

- **Runtime**: Bun
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis
- **Testing**: Jest + Supertest
- **Authentication**: Cookie-based with JWT

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State**: Redux Toolkit + React Query
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
