FROM node:20 AS build

WORKDIR /lectify

COPY ./lectify/package*.json ./
RUN npm install

COPY ./lectify ./
RUN npm install
RUN npm run build

FROM node:20-alpine3.16

WORKDIR /app
# Copy the build files from the previous stage
COPY --from=build /lectify . 

ENV HOST=0.0.0.0
EXPOSE 4173
CMD ["npm","run", "preview","--", "--host", "0.0.0.0"]