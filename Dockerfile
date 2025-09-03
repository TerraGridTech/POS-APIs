FROM node:18-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production

# Instala dependências para o Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Instala o Google Chrome via repositório oficial
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Cria o diretório de trabalho
WORKDIR /app

# Copia os arquivos da aplicação
COPY . .

# Instala dependências Node.js
RUN npm install --omit=dev

# Expõe a porta da aplicação
EXPOSE 3000

# Comando de start da aplicação
CMD ["node", "src/server.js"]
