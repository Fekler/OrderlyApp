# Fase 1: Build da aplicação Angular
FROM node:lts AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Fase 2: Servindo a aplicação com Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/sales-order-management-app/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
