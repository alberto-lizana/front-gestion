# Etapa 1: Construcción de Angular
FROM node:24-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar proyecto
COPY . .

# Compilar Angular 22 para producción
RUN npm run build -- --configuration production


# Etapa 2: Servidor web
FROM nginx:alpine

# Eliminar configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar compilación de Angular
COPY --from=build /app/dist/front-gestion/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
