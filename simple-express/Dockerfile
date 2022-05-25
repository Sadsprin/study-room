FROM node:alpine
WORKDIR /app
COPY package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ] ; then \
        npm install; \
    else \
        npm install --production; \
    fi
COPY . ./
CMD ["node","app"]


