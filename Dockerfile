FROM node:alpine
WORKDIR /app
COPY . .
RUN npm run build:prod
EXPOSE 5000

CMD ["npm", "start"]