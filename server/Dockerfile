FROM oven/bun:1.2-alpine

WORKDIR /app
COPY package.json ./
RUN bun install --production
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/data/engagement.sqlite
EXPOSE 3000

CMD ["bun", "src/index.ts"]
