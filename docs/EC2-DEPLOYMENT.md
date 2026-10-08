# Website on an existing EC2 host

This is an alternative to Vercel. Use a new directory for this release and preserve the existing reverse-proxy configuration. No MongoDB or SMTP credentials are needed by the public website.

## Build and start

From the extracted `sandbee-website` folder:

```sh
export RELEASE_TAG=2026-10-02-launch
docker compose -f compose.production.yaml config --quiet
docker compose -f compose.production.yaml build app
docker compose -f compose.production.yaml up -d --no-build
docker compose -f compose.production.yaml ps
curl --fail http://127.0.0.1:8099/robots.txt
```

The container runs as a non-root user. Host port 8099 binds only to loopback; it must not be opened in the EC2 security group. NEXT_PUBLIC_SITE_URL defaults to https://sandbee.in and is passed at build time. Change it before rebuilding if the domain changes. Production dependencies are installed inside Linux from the lockfile. Do not copy Windows node_modules into the image.

The image retains Next.js route output, MDX source, OG font/CSS and public assets used by server-side content routes. Next's image and route caches can write to the owned `.next` directory. Cache loss during container replacement does not remove business data.

## Reverse proxy

Use the existing certificate process for sandbee.in, then add this location in its TLS virtual host:

```nginx
location / {
    proxy_pass http://127.0.0.1:8099;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_buffering off;
    proxy_connect_timeout 5s;
    proxy_read_timeout 60s;
    client_max_body_size 1m;
}
```

Redirect HTTP to HTTPS. Add a www-to-apex redirect only after both names have valid DNS/certificates. Run `nginx -t` before reloading. Do not overwrite existing GST/OCR/Store/Admin virtual hosts. This assumes a host-installed Nginx; a containerized proxy needs its own private Docker network upstream instead of host loopback.

## Current contact and content boundaries

The default Docker release uses the existing email enquiry composer. It opens the visitor's mail app; it does not send through Admin or create a customer record. There is no contact transport in this release's Compose configuration. Keep CONTACT_TRANSPORT_URL unset. Wiring a real transport later requires a reviewed build/runtime configuration and delivery test.

Privacy and Terms remain visibly marked as pending and noindex. Obtain approved business policy content before considering those pages final. Paid Messaging/POS provisioning and payments are not implemented by the website. Product descriptions and enquiry links do not activate a paid product in Store.

## Verify and roll back

Check `/`, `/products`, `/products/pos`, `/technology/aadhaar-pan-ocr`, `/blog`, `/contact`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, and a missing path returning 404. Test product menu, mobile navigation and the enquiry composer. Confirm Store links target https://store.sandbee.in.

Preserve the previous image and release directory. For rollback, use its original RELEASE_TAG and run `docker compose -f compose.production.yaml up -d --no-build`; restore only this domain's previous proxy upstream if it changed. Do not prune old images until acceptance completes. Resource limits are safeguards, not measured capacity.

References reviewed 2026-09-28: [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting), [Docker environment variables](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/), [Nginx proxy module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html).
