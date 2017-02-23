FROM node:7.3.0-onbuild

ENV NODE_ENV=production
RUN npm run prod:build

