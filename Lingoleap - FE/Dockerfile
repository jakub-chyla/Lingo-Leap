FROM node:18.13-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production
EXPOSE 4200
RUN npm install -g http-server
CMD ["http-server", "dist/lingo-leap-fe", "-p", "4200", "-a", "0.0.0.0"]
