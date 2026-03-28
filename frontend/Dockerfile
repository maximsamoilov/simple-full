# Development stage
FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

# Build stage
FROM development AS build

RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets to Nginx html directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port (Nginx default is 80)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
