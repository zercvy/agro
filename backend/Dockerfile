FROM node:20

WORKDIR /app

# Устанавливаем ts-node-dev глобально — надежно для всех
RUN npm install -g ts-node-dev

COPY package*.json ./
RUN npm install

COPY . .

CMD ["ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]
