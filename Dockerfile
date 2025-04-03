# Étape 1 : Build de l'application React
FROM node:12 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Servir les fichiers avec Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
