FROM node:18.13-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production
EXPOSE 4200
CMD ["npm", "run", "start:prod"]
