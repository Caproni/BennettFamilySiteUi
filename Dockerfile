FROM node:alpine3.17 AS build

ARG configuration=production

WORKDIR /build

COPY package.json .

RUN npm install

COPY . .

RUN npm run build --  --output-path=dist --output-hashing=all --configuration=${configuration}

FROM nginx:alpine3.17-slim

EXPOSE 80

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /build/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
