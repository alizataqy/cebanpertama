# syntax=docker/dockerfile:1

FROM node:alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN --mount=type=cache,target=/root/.npm npm install --no-audit --no-fund

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV BETTER_AUTH_SECRET="build-secret-dummy-ceban-pertama-32chars"
ENV BETTER_AUTH_URL="http://localhost:3000"

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
