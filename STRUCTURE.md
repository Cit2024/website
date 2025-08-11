# Project Structure - Misurata Center for Entrepreneurship & Business Incubators

## Updated Project Structure (With Improvements)

```
website/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Localized public pages
│   │   │   ├── (standalone)/
│   │   │   ├── collaborators/
│   │   │   ├── innovators/
│   │   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── dashboard/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/
│   │   │   ├── error/
│   │   │   └── callback/
│   │   └── api/                # API routes
│   │       ├── [[...route]]/   # Hono API routes
│   │       ├── admin/          # Admin API endpoints (NEW)
│   │       └── auth/           # NextAuth endpoints
│   ├── features/               # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── schemas.ts
│   │   │   └── auth.ts
│   │   ├── collaborators/
│   │   │   ├── server/
│   │   │   ├── components/
│   │   │   └── schemas.ts
│   │   ├── innovators/
│   │   │   ├── server/
│   │   │   ├── components/
│   │   │   └── schemas.ts
│   │   └── news/
│   │       └── server/
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── error-boundary.tsx  # Error handling (NEW)
│   │   └── index.ts
│   ├── lib/                    # Utilities & configs
│   │   ├── db.ts              # Prisma client
│   │   ├── cache.ts           # Caching system (NEW)
│   │   ├── rate-limit.ts      # Rate limiting (NEW)
│   │   ├── audit-log.ts       # Audit logging (NEW)
│   │   ├── file-validation.ts # File upload validation (NEW)
│   │   ├── mail.ts            # Email service
│   │   ├── rpc.ts             # Hono RPC client
│   │   └── utils.ts
│   ├── i18n/                   # Internationalization
│   │   └── routing.ts
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   ├── middleware.ts           # Next.js middleware
│   └── routes.ts              # Route definitions
├── prisma/
│   ├── schema.prisma          # Database schema with AuditLog
│   └── migrations/
├── messages/                   # i18n translations
│   ├── ar.json
│   └── en.json
├── public/
│   └── assets/
│       ├── icons/
│       └── images/
├── tests/
├── .env                       # Environment variables
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── tsconfig.json
```

## New Features & Improvements Implemented

### 1. Performance Improvements ✅
- **Caching System** (`src/lib/cache.ts`)
  - Memory cache with TTL support
  - 5-minute cache for public data
  - Cache invalidation on data updates
  - Pagination support for all list endpoints

### 2. Security Enhancements ✅
- **Rate Limiting** (`src/lib/rate-limit.ts`)
  - API endpoints: 100 req/min
  - Auth endpoints: 5 attempts/15min
  - Form submissions: 10/hour
  - Admin endpoints: 200 req/min
  
- **Audit Logging** (`src/lib/audit-log.ts`)
  - Tracks all admin actions
  - Login/logout events
  - Data exports
  - Approval/rejection actions
  - Stores IP addresses and user agents

- **CSRF Protection**
  - Built-in via NextAuth.js
  - Secure session management

### 3. Feature Additions ✅
- **Admin Search & Export** (`src/app/api/admin/route.ts`)
  - Search collaborators/innovators/audit logs
  - Export to JSON/CSV formats
  - Filtered exports with audit trail
  
- **File Validation** (`src/lib/file-validation.ts`)
  - Image files: Max 5MB
  - Media files: Max 50MB
  - Video files: Max 100MB
  - Type validation for uploads

### 4. Code Quality ✅
- **Error Boundaries** (`src/components/error-boundary.tsx`)
  - Global error handling
  - User-friendly error messages
  - Development error details

## Database Schema Updates

Added `AuditLog` model to track admin actions:
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  userEmail   String
  action      String
  entity      String
  entityId    String?
  details     Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
}
```

## API Endpoints

### Public Endpoints
- `GET /api/collaborator/public` - Paginated, cached collaborator list
- `POST /api/collaborator` - Rate-limited submission with file validation
- `POST /api/innovators` - Rate-limited submission with file validation

### Admin Endpoints (Protected)
- `GET /api/admin?type=collaborators&q=search` - Search functionality
- `POST /api/admin` - Export data (JSON/CSV)
- All admin actions are audit logged

## Environment Variables Required
```env
# Database
DATABASE_URL="mysql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# Email (Review configuration)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASS="..."
SMTP_FROM="noreply@example.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Performance Metrics
- Public data cached for 5 minutes
- Rate limiting prevents abuse
- Pagination reduces payload size
- File size limits prevent storage issues

## Security Features
- Role-based access control
- Audit trail for compliance
- Rate limiting for DDoS protection
- File validation for upload security
- 2FA support ready

## Next Steps
1. Run database migrations: `npx prisma migrate dev`
2. Update environment variables
3. Test rate limiting and caching
4. Configure email settings properly
5. Add comprehensive unit tests
