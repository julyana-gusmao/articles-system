FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN sed -i 's/\r$//' /app/docker-entrypoint.sh
RUN sed -i '1s/^\xEF\xBB\xBF//' /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

RUN npm run build

EXPOSE 3000

CMD ["/app/docker-entrypoint.sh"]
