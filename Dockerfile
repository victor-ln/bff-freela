# Use a versão adequada (20 para BFF, 22 para Front se preferir, ou 20 para ambos)
FROM node:22-alpine

WORKDIR /app

# 1. Copia os arquivos de definição de pacote
COPY package*.json ./

# 2. Instala as dependências dentro da imagem
RUN npm install

# 3. Copia o restante do código
# COPY . .

# A porta e o comando serão sobrescritos pelo docker-compose, 
# mas deixamos um padrão aqui.
EXPOSE 3000
CMD ["npm", "run", "start:dev"]