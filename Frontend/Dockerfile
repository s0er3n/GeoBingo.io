FROM node:17.7.2-bullseye as builder


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
#RUN npm ci

# Bundle app source
COPY . .
ARG domain
ENV VITE_DOMAIN=$domain
RUN npm run build
FROM nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

