# Build Stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# ARG deve ser declarado antes de ser usado no ENV/RUN
ARG VITE_API_URL=http://localhost:3000/api/v1
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
