FROM node:20-alpine

WORKDIR /app

# Install frontend deps and build
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Install backend deps
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend/ ./backend/

EXPOSE 8080
ENV PORT=8080

CMD ["node", "backend/server.js"]
