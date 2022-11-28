FROM node:16-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn tsc

FROM node:16-alpine AS server

WORKDIR /app

COPY package* ./

# ARG DATABASE_URL
# ENV DATABASE_URL $DATABASE_URL

RUN yarn --production

COPY --from=dependencies ./app/public ./public
COPY --from=dependencies ./app/public/uploads ./public/uploads
COPY --from=dependencies ./app/.env ./.env
COPY --from=dependencies ./app/bin ./bin
COPY --from=dependencies ./app/lib ./lib
COPY --from=dependencies ./app/lib/views ./views
COPY --from=dependencies ./app/database.sqlite3 ./database.sqlite3
COPY --from=dependencies ./app/.sequelizerc ./.sequelizerc

# RUN ls -ah
EXPOSE 3200

CMD ["yarn", "dev"]
