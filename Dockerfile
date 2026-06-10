FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'server { listen 8080; location / { root /usr/share/nginx/html; index index.html; try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf

# Script to replace the placeholder with the actual runtime environment variable
RUN echo '#!/bin/sh' > /docker-entrypoint.d/99-replace-env.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i -e "s|VITE_GEMINI_API_KEY_PLACEHOLDER|${VITE_GEMINI_API_KEY}|g" -e "s|VITE_GEMINI_MODEL_PLACEHOLDER|${VITE_GEMINI_MODEL}|g" {} +' >> /docker-entrypoint.d/99-replace-env.sh && \
    chmod +x /docker-entrypoint.d/99-replace-env.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
