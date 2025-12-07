# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:24-alpine AS deps

WORKDIR /app

# Copy only package files for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies (including dev dependencies for build)
RUN npm i --legacy-peer-deps && \
    npm cache clean --force

# ============================================
# Stage 2: Builder
# ============================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package.json package-lock.json* ./

# Copy Prisma schema and config
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy source code
COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copy API documentation
COPY doc/api.yaml ./doc/api.yaml

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# ============================================
# Stage 3: Production
# ============================================
FROM node:24-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm i --omit=dev --legacy-peer-deps && \
    npm install -g prisma@^7.0.1 && \
    npm cache clean --force && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.cache

# Copy built application from builder (includes dist/prisma/generated from nest-cli.json)
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copy only Prisma files needed for migrations (schema and migrations)
# Note: prisma.config.ts is not needed - Prisma CLI uses schema.prisma and DATABASE_URL by default
COPY --from=builder --chown=nestjs:nodejs /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder --chown=nestjs:nodejs /app/prisma/migrations ./prisma/migrations
COPY --from=builder --chown=nestjs:nodejs /app/prisma.config.* ./

# Copy API documentation (app expects it at doc/api.yaml)
COPY --from=builder --chown=nestjs:nodejs /app/doc/api.yaml ./doc/api.yaml

# Copy and setup entrypoint script
COPY --chown=nestjs:nodejs docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4000


# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the application
CMD ["node", "dist/src/main"]
