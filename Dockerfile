FROM node:20-alpine
WORKDIR /app
COPY package.json server.js ./
COPY models ./models
EXPOSE 8080
ENV PORT=8080
CMD ["node","server.js"]
