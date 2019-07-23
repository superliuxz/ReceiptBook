FROM node:alpine

EXPOSE 10101

RUN apk add --no-cache \
    nginx \
    supervisor

# Nginx
RUN rm -rf /etc/nginx/sites-enabled /etc/nginx/sites-available
RUN mkdir /run/nginx /etc/nginx/logs /etc/nginx/sites-enabled /etc/nginx/sites-available
COPY conf/nginx/nginx.conf /etc/nginx/
COPY conf/nginx/sites-available/app.conf /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/app.conf

# supervisor
RUN mkdir -p /etc/supervisor /var/log/supervisor
COPY conf/supervisor /etc/supervisor/

WORKDIR /app
COPY ./ /app/
RUN npm run clean
RUN npm install
RUN npm run build:ssr

CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
