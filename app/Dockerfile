ARG NODE_VERSION
ARG ALPINE_VERSION
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as dev

RUN apk update && apk add build-base libc6-compat gcompat curl bash

RUN corepack enable && \
    corepack prepare pnpm@latest-9 --activate && \
    pnpm config set store-dir ~/.pnpm-store

COPY ./ /app

WORKDIR /app

RUN pnpm install


FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as build

RUN apk update && apk add build-base libc6-compat gcompat curl bash

RUN npm install -g pnpm @nestjs/cli

RUN npm install --global pnpm@latest \
  && SHELL=bash pnpm setup \
  && source /root/.bashrc \
  && pnpm config set store-dir /root/.local/share/pnpm/store

COPY ./ /app

WORKDIR /app

RUN pnpm install
RUN pnpm build


FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

CMD [ "node", "dist/main.js" ]