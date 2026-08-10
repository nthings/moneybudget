FROM node:20-alpine

# libc6-compat for Alpine compatibility with some Node.js native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies first (cached layer when source changes but deps don't)
COPY package.json ./
RUN npm install

# Copy source code (overridden by bind mount in docker-compose dev mode)
COPY . .

EXPOSE 3000

# Development server — hot reload via WATCHPACK_POLLING in docker-compose.yml
CMD ["npm", "run", "dev"]
