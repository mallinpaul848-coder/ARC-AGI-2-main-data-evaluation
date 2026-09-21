FROM node:20-alpine
WORKDIR /app
COPY package.json server.js apex-run.js ./
COPY models ./models
RUN addgroup -S apex && adduser -S apex -G apex
USER apex
EXPOSE 8080
ENV PORT=8080
ENV APEX_CORS_ORIGIN=*
CMD ["node","server.js"]
