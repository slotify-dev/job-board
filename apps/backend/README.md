# Job Board Backend

A fully-typed TypeScript backend API built with Express, following modular architecture patterns and best practices.

## 🏗️ Project Structure

```text
src/
├── modules/                    # Feature-based modules
│   └── health/                 # Health check module
│       ├── health.model.ts     # TypeScript interfaces and types
│       ├── health.service.ts   # Business logic layer
│       ├── health.controller.ts # Request/response handlers
│       └── health.routes.ts    # Route definitions
├── middleware/                 # Express middleware
│   └── errorHandler.ts         # Global error handling
├── config/                     # Configuration files
│   └── env.ts                  # Environment variables with Zod validation
├── app.ts                      # Express app setup with middleware
└── server.ts                   # Server entry point and startup
```

## 🎯 Architecture Principles

### Modular Structure

Each feature follows the **Route → Controller → Service → Model** pattern:

- **Routes**: Define API endpoints and HTTP methods
- **Controllers**: Handle HTTP requests/responses and validation
- **Services**: Contain business logic and data processing
- **Models**: Define TypeScript interfaces and data structures

### TypeScript Best Practices

- ✅ **No `any` types** - Everything is properly typed
- ✅ **Interface-driven development** - Clear contracts between layers
- ✅ **Strict TypeScript configuration** - Enhanced type safety
- ✅ **Zod validation** - Runtime type checking for environment variables and requests

### Security & Middleware

- 🛡️ **Helmet** - Security headers
- 🌐 **CORS** - Cross-origin resource sharing
- ⚡ **Express** - Fast, minimalist web framework
- 📝 **Morgan** - HTTP request logging (dev/production modes)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0.0 or higher
- Node.js v20.0.0 or higher

### Installation

1. Install dependencies:

```bash
bun install
```

1. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

Start the development server with hot reload:

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

Start production server:

```bash
bun run start
```

Type checking:

```bash
bun run typecheck
```

## 📡 API Endpoints

### Health & Status

- `GET /api` - API information (name, version, environment)
- `GET /api/health` - Health check status

## 🔧 Environment Variables

| Variable      | Description        | Default       |
| ------------- | ------------------ | ------------- |
| `NODE_ENV`    | Environment mode   | `development` |
| `PORT`        | Server port        | `3000`        |
| `API_VERSION` | API version string | `v1`          |

## 🏗️ Adding New Modules

When adding a new feature (e.g., `users`), follow this structure:

1. Create module directory:

```bash
mkdir src/modules/users
```

1. Create the four core files:

```text
src/modules/users/
├── users.model.ts      # Types and interfaces
├── users.service.ts    # Business logic
├── users.controller.ts # HTTP handlers
└── users.routes.ts     # Route definitions
```

1. Follow the established patterns:

```typescript
// users.model.ts
export interface User {
  id: string;
  email: string;
  username: string;
}

// users.service.ts
export class UsersService {
  async getUser(id: string): Promise<User | null> {
    // Business logic here
  }
}

// users.controller.ts
export class UsersController {
  private usersService = new UsersService();

  getUser = async (req: Request, res: Response): Promise<void> => {
    // HTTP handling here
  };
}

// users.routes.ts
const router = Router();
const usersController = new UsersController();
router.get('/users/:id', usersController.getUser);
export { router as usersRoutes };
```

1. Register routes in `app.ts`:

```typescript
app.use('/api', usersRoutes);
```

## 🧪 Best Practices

### Code Organization

- ✅ One feature per module directory
- ✅ Separation of concerns (routes, controllers, services, models)
- ✅ Consistent file naming conventions
- ✅ Clear import/export patterns

### Error Handling

- ✅ Global error middleware catches all errors
- ✅ Proper HTTP status codes
- ✅ Structured error responses
- ✅ Environment-specific error details

### Type Safety

- ✅ Zod schemas for runtime validation
- ✅ Proper TypeScript interfaces
- ✅ No implicit any types
- ✅ Strict compiler options

### Security

- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ Environment variable validation

## 📦 Dependencies

### Production

- `express` - Web framework
- `zod` - Runtime type validation
- `dotenv` - Environment variable loading
- `cors` - CORS middleware
- `helmet` - Security middleware
- `morgan` - HTTP logging

### Dev Dependencies

- `typescript` - TypeScript compiler
- `@types/*` - Type definitions
- `tsx` - TypeScript execution

## 🐳 Docker

The project includes Docker configuration for containerized deployment.
The modular structure is maintained within containers for consistent
development and production environments.

---

Built with ❤️ using TypeScript, Express, and Bun
