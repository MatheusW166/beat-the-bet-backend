FROM node:alpine as builder
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:alpine

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN npm install --omit=dev

EXPOSE 5000

CMD ["npm", "run", "start:migrate"]