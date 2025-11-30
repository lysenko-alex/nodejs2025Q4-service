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

- **Node.js** >=23.6.1 <25.0.0 (supports Node.js 23.x and 24.x) - [Download & Install Node.js](https://nodejs.org/en/download/)
- **npm** or **pnpm** package manager
- **Git** - [Download & Install Git](https://git-scm.com/downloads)

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

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory (optional, defaults are provided):

```env
PORT=4000
BASE_URL=http://localhost:4000
```

### Environment Variables

- `PORT` - Server port (default: 4000)
- `BASE_URL` - Base URL for the API (default: http://localhost:4000)

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
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
├── common/          # Shared utilities (errors, filters, interceptors)
├── app.module.ts    # Root module
├── app.controller.ts
├── app.service.ts
└── main.ts          # Application entry point

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
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI (@nestjs/swagger)
- **Testing**: Jest, Supertest

## Data Storage

Currently, the application uses **in-memory storage** (no database). All data is stored in memory and will be lost when the application restarts. This is suitable for development and testing purposes.

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
