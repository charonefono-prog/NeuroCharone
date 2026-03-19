FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy application files
COPY . .

# Build web assets
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
