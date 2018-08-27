# Create the image based on the official Node 8.9.0 image from Dockerhub
FROM node:8.9.0 as node

# Get all the code needed to run the app
COPY . /

# Install dependencies using npm
RUN npm install

#Build the app
RUN npm run build

#==================== Setting up stage ==================== 
# Create image based on the official nginx - Alpine image
FROM nginx:1.13.7-alpine

COPY --from=node /dist/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
