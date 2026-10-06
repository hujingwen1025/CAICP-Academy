FROM nginx:1.30.5-alpine

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY index.html styles.css manifest.webmanifest sw.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY js/ /usr/share/nginx/html/js/
COPY data/ /usr/share/nginx/html/data/
COPY LICENSE CONTENT-LICENSE.md THIRD-PARTY-NOTICES.md README.md VALIDATION.md COVERAGE.md VIDEO-RESEARCH.md /usr/share/nginx/html/

USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/index.html || exit 1

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
