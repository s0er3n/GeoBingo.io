FROM node:20 as builder


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

ARG VITE_DOMAIN
ARG VITE_GMAPSAPI
ARG VITE_SUPABASE_KEY
ARG VITE_SUPABASE_URL

ENV VITE_DOMAIN=$VITE_DOMAIN
ENV VITE_GMAPSAPI=$VITE_GMAPSAPI
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL

RUN npm run build
FROM nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

