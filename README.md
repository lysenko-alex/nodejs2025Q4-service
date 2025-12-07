# Home Library Service

A RESTful API service for managing a home music library built with NestJS. This service allows you to manage users, artists, albums, tracks, and favorites.

## Features

- **User Management**: Create, read, update, and delete users with password management
- **Music Library Management**: 
  - Artists (with Grammy award status)
  - Albums (linked to artists)
  - Tracks (linked to artists and albums)
- **Favorites System**: Add and remove artists, albums, and tracks to/from favorites
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Comprehensive Testing**: End-to-end tests

## Prerequisites

### For Local Development
- **Node.js** >=23.6.1 <25.0.0 (supports Node.js 23.x and 24.x) - [Download & Install Node.js](https://nodejs.org/en/download/)
- **npm** or **pnpm** package manager
- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **PostgreSQL** (optional, if running without Docker)

### For Docker Deployment
- **Docker** - [Download & Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** - [Install Docker Compose](https://docs.docker.com/compose/install/)

> **Note**: The application includes a Node.js version check that will prevent startup if an incompatible version is detected. Make sure you're using a supported Node.js version.

## Installation

1. Clone the repository:
```bash
git clone {repository URL}
cd nodejs2025Q4-service
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

### Environment Variables

**Application:**
- `PORT` - Server port (default: 4000)
- `BASE_URL` - Base URL for the API (default: http://localhost:4000)

**Database:**
- `DATABASE_URL` - PostgreSQL connection string (required for Prisma)
- `POSTGRES_USER` - PostgreSQL username (default: postgres)
- `POSTGRES_PASSWORD` - PostgreSQL password (default: postgres)
- `POSTGRES_DB` - PostgreSQL database name (default: home_library)
- `POSTGRES_PORT` - PostgreSQL port (default: 5432)

## Running the Application

### Using Docker (Recommended)

The easiest way to run the application is using Docker Compose, which sets up both the application and PostgreSQL database.

 **Build and start containers:**
```bash

npm run start:container
# or
pnpm run start:container
```


The application will be available at `http://localhost:4000` (or your configured port).

**Note:** The application container is configured with hot reload, so changes to files in the `src` folder will automatically restart the application.

### Local Development (Without Docker)

1. **Start PostgreSQL database:**
   - Install and start PostgreSQL locally, or
   - Use Docker: `docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16-alpine`

2. **Set up the database:**
```bash
# Generate Prisma Client
npm prisma generate

# Run migrations
npm prisma migrate dev
```

3. **Start the application:**
```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

After starting the application, it will be available at `http://localhost:4000` (or your configured port).

## API Documentation

Once the application is running, you can access the interactive Swagger documentation at:

```
http://localhost:4000/docs
```

The API documentation includes:
- All available endpoints
- Request/response schemas
- Example requests

## API Endpoints

### Users
- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `POST /user` - Create a new user
- `PUT /user/:id` - Update user password
- `DELETE /user/:id` - Delete user

### Artists
- `GET /artist` - Get all artists
- `GET /artist/:id` - Get artist by ID
- `POST /artist` - Create a new artist
- `PUT /artist/:id` - Update artist
- `DELETE /artist/:id` - Delete artist

### Albums
- `GET /album` - Get all albums
- `GET /album/:id` - Get album by ID
- `POST /album` - Create a new album
- `PUT /album/:id` - Update album
- `DELETE /album/:id` - Delete album

### Tracks
- `GET /track` - Get all tracks
- `GET /track/:id` - Get track by ID
- `POST /track` - Create a new track
- `PUT /track/:id` - Update track
- `DELETE /track/:id` - Delete track

### Favorites
- `GET /favs` - Get all favorites (artists, albums, tracks)
- `POST /favs/artist/:id` - Add artist to favorites
- `DELETE /favs/artist/:id` - Remove artist from favorites
- `POST /favs/album/:id` - Add album to favorites
- `DELETE /favs/album/:id` - Remove album from favorites
- `POST /favs/track/:id` - Add track to favorites
- `DELETE /favs/track/:id` - Remove track from favorites

## Testing

The project includes comprehensive end-to-end tests.

### Run All Tests
```bash
npm run test
```

### Run Tests with Authentication Mode
```bash
npm run test:auth
```

### Run Refresh Token Tests
```bash
npm run test:refresh
```

### Run Specific Test Suite
```bash
npm run test -- <path-to-test-file>
npm run test:auth -- <path-to-test-file>
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Debug Tests
```bash
npm run test:debug
```

## Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

## Project Structure

```
src/
├── albums/          # Album module (controller, service, entities, DTOs, repositories)
├── artists/         # Artist module (controller, service, entities, DTOs, repositories)
├── tracks/          # Track module (controller, service, entities, DTOs, repositories)
├── users/           # User module (controller, service, entities, DTOs, repositories)
├── favorites/       # Favorites module (controller, service, entities, DTOs, repositories)
├── prisma/          # Prisma module and service
├── common/          # Shared utilities (errors, filters, interceptors)
├── app.module.ts    # Root module
├── app.controller.ts
├── app.service.ts
└── main.ts          # Application entry point

prisma/
└── schema.prisma    # Prisma schema definition

test/
├── auth/            # Authentication-related e2e tests (for future implementation)
├── refresh/         # Token refresh e2e tests (for future implementation)
├── utils/           # Test utilities
├── lib/             # Test helpers
└── *.e2e.spec.ts    # E2E test suites

doc/
└── api.yaml         # OpenAPI/Swagger specification
```

## Technology Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: Prisma 7.x
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI (@nestjs/swagger)
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose


## Error Handling

The application includes global error handling with:
- HTTP exception filters
- Transform interceptors
- Validation pipes for request validation

## Development

### Building the Project
```bash
npm run build
```

The compiled output will be in the `dist/` directory.
