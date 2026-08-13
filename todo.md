# Publicación pública y Docker

## Corrección del build Docker

- [x] Copiar `patches/` antes de ejecutar `pnpm install --frozen-lockfile`.
- [x] Verificar que el Dockerfile ya no falle por `wouter@3.7.1.patch` ausente.
- [ ] Publicar la corrección en GitHub y reintentar `docker compose up --build`.

## Corrección del arranque Nginx

- [x] Evitar que el entrypoint intente modificar `default.conf` en filesystem de solo lectura.
- [x] Configurar directorios temporales Nginx escribibles y permisos compatibles con el contenedor.
- [ ] Verificar `docker compose up` y publicar el ajuste en GitHub.

- [x] Leer la guía de persistent computing y confirmar el enfoque Docker compatible con WebDev.
- [x] Añadir Dockerfile de producción y configuración de prueba aislada.
- [x] Añadir documentación de build, ejecución, puertos y limitaciones del contenedor.
- [x] Verificar `pnpm check` y `pnpm build`.
- [ ] Construir la imagen Docker y probar el endpoint HTTP; el sandbox actual no tiene el binario Docker instalado.
- [x] Crear el repositorio público en GitHub usando GitHub CLI.
- [x] Subir el código, revisar el estado remoto y entregar la URL pública.
