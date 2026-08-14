# Publicación pública y Docker

## Corrección del build Docker

- [x] Copiar `patches/` antes de ejecutar `pnpm install --frozen-lockfile`.
- [x] Verificar que el Dockerfile ya no falle por `wouter@3.7.1.patch` ausente.
- [ ] Publicar la corrección en GitHub y reintentar `docker compose up --build`.

## Corrección del arranque Nginx

- [x] Evitar que el entrypoint intente modificar `default.conf` en filesystem de solo lectura.
- [x] Configurar directorios temporales Nginx escribibles y permisos compatibles con el contenedor.
- [ ] Verificar `docker compose up` y publicar el ajuste en GitHub.

## Assets locales y Docker

- [x] Auditar todas las referencias `/manus-storage` y URLs externas de recursos.
- [x] Copiar las imágenes usadas por la interfaz a `client/public/assets`.
- [x] Actualizar JSX, CSS, manifest y documentación para usar rutas relativas locales.
- [x] Verificar que las rutas ejecutadas ya no dependan de `/manus-storage`.
- [ ] Ejecutar checks/build y publicar la corrección en GitHub.

## Comparación y advertencia unload

- [x] Identificar el origen del listener `unload` obsoleto en `/admin`.
- [x] Revisar el parser de intención y el registro de la herramienta de comparación.
- [x] Añadir soporte explícito para consultas de precios, costos, duración y plazos.
- [x] Verificar que la comparación cree un artifact visible con fuentes y datos correctos.
- [x] Ejecutar checks/build y publicar la corrección en GitHub.

## Mallas y gráficos dinámicos

- [x] Definir módulos, sesiones y precedencias para cada curso del snapshot.
- [x] Añadir tipos y datos de malla al modelo local de cursos.
- [x] Crear artifacts de gráfico comparativo, malla y flujo de precedencias.
- [x] Conectar consultas naturales como “muéstrame la malla” y “compara las mallas”.
- [x] Añadir pruebas de regresión para gráficos y precedencias.
- [ ] Verificar visualmente, ejecutar build y publicar en GitHub.

## Admin: acciones no funcionales

- [x] Auditar callbacks de `Ejecutar retrieval`, `Cargar modelo local`, `Descargar / cargar` y `Probar`.
- [x] Implementar resultados visibles y estados de error para cada acción.
- [x] Hacer que exportar/importar configuración use archivos JSON descargables y seleccionables.
- [x] Añadir pruebas de regresión de las acciones Admin.
- [ ] Verificar Admin, build y publicar la corrección.

## Error de carga del modelo

- [x] Auditar configuración de Transformers.js, model ID y respuesta HTTP.
- [x] Evitar que el worker intente interpretar HTML como metadata JSON.
- [x] Mostrar un diagnóstico accionable cuando el modelo o sus archivos no estén disponibles.
- [ ] Verificar worker, build y carga desde Admin; publicar la corrección.

- [x] Leer la guía de persistent computing y confirmar el enfoque Docker compatible con WebDev.
- [x] Añadir Dockerfile de producción y configuración de prueba aislada.
- [x] Añadir documentación de build, ejecución, puertos y limitaciones del contenedor.
- [x] Verificar `pnpm check` y `pnpm build`.
- [ ] Construir la imagen Docker y probar el endpoint HTTP; el sandbox actual no tiene el binario Docker instalado.
- [x] Crear el repositorio público en GitHub usando GitHub CLI.
- [x] Subir el código, revisar el estado remoto y entregar la URL pública.
