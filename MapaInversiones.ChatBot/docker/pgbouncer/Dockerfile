FROM alpine:3.20

RUN apk add --no-cache pgbouncer dumb-init bash && \
    addgroup -S pgbouncer && adduser -S -G pgbouncer pgbouncer

COPY docker/pgbouncer/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
