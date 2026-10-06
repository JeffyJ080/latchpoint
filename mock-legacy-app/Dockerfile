# Lightweight Node LTS Alpine image (~50MB)
FROM node:18-alpine

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy server code and public assets
COPY server.js ./
COPY public/ ./public/
COPY views/ ./views/

EXPOSE 8082

CMD ["node", "server.js"]