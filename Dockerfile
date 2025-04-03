# Étape 1 : build React
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : servir les fichiers avec Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
