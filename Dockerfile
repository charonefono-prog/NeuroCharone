FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Copy application files
COPY . .

# Build web assets (if needed)
RUN pnpm build || true

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the server using pnpm start
CMD ["pnpm", "start"]
