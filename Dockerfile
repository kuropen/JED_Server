FROM node:14-alpine

RUN apk --update add bash
RUN mkdir -p /srv
WORKDIR /srv
COPY . /srv/
RUN npm install && npm run build
RUN chmod 755 /srv/start.sh
EXPOSE 4000
CMD [ "/srv/start.sh" ]
