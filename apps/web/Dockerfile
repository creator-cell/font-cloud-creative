FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start", "--", "-H", "0.0.0.0"]
