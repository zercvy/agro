FROM node:20

WORKDIR /app

# Устанавливаем ts-node-dev глобально — надежно для всех
RUN npm install -g ts-node-dev

COPY package*.json ./
RUN npm install

COPY . .

CMD ["ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]


# FROM node:20

# RUN apt update && apt install -y \
#   build-essential cmake git curl unzip libopenblas-dev && \
#   rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# RUN npm install -g ts-node-dev

# COPY package*.json ./
# RUN npm install

# # 👇 сначала копируем исходники (не llama.cpp!)
# COPY . .

# # 👇 потом клонируем llama.cpp (не затирается!)
# RUN git clone --depth=1 https://github.com/ggerganov/llama.cpp.git /app/llama.cpp && \
#     mkdir -p /app/llama.cpp/build && \
#     cd /app/llama.cpp/build && \
#     cmake .. && make -j && \
#     ls -lh /app/llama.cpp/build/bin

# # CMD
# CMD ["ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]
