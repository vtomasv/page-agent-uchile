# Page Agent · Educación Continua DCC

Prototipo frontend-only de una página web que puede conversar acerca de su propio contenido. La demo replica una parte de Educación Continua del Departamento de Ciencias de la Computación de la Universidad de Chile y añade un harness local para preguntar, comparar cursos, mostrar fuentes y convertir respuestas en secciones temporales dentro de la página.

## Ejecutar

```bash
pnpm install
pnpm dev
```

La compilación de producción se valida con:

```bash
pnpm check
pnpm build
```

## Rutas incluidas

| Ruta | Propósito |
|---|---|
| `/` | Homepage inspirada en Educación Continua DCC, con hero, contexto, oferta y explicación de Page Agent. |
| `/cursos` | Catálogo local filtrable con ocho cursos y navegación interna. |
| `/cursos/machine-learning` | Ficha completa de Machine Learning con objetivos, contenidos, requisitos, fecha y cursos relacionados. |
| `/cursos/redes-neuronales-deep-learning` | Ficha de Redes Neuronales y Deep Learning. |
| `/cursos/inteligencia-artificial-generativa` | Ficha de Inteligencia Artificial Generativa. |
| `/cursos/procesamiento-lenguaje-natural` | Ficha de Procesamiento de Lenguaje Natural. |
| `/cursos/python-aplicado-ciencia-datos` | Ficha de Python aplicado a la Ciencia de Datos. |
| `/cursos/ingenieria-de-software` | Ficha de Ingeniería de Software. |
| `/cursos/gestion-proyectos-informaticos` | Ficha de Gestión de Proyectos Informáticos. |
| `/cursos/bootcamp-desarrollo-frontend` | Ficha de Bootcamp Desarrollo Frontend. |
| `/admin` | Consola de configuración local del harness, marcada explícitamente como protección de demostración. |

## Qué está implementado

El prototipo incorpora un `PageContextManager` distribuido en el contexto React y los módulos de recuperación: la ruta actual se observa, se combinan chunks estructurados con una extracción DOM controlada y el contexto visible recibe prioridad. El retrieval MVP combina score lexical, coincidencia de ruta y `currentPageBoost`. Los embeddings y la reconstrucción de índice quedan preparados detrás de `embedding.worker.ts` y IndexedDB para la siguiente iteración de producción.

El `ToolRegistry` incluye búsqueda local, lectura de página actual, lectura de curso, comparación determinista, navegación mediante enlaces visibles, foco de fuentes y creación de artifacts aprobados. Las visualizaciones temporales pasan por componentes React; el modelo nunca inserta HTML mediante `innerHTML`. `ArtifactManager` mantiene mutaciones activas/removidas y permite cerrar, descartar, restaurar, limpiar y deshacer artifacts.

El chat flotante soporta memoria de sesión o persistente, sugerencias, estado de pensamiento, streaming preparado, detención de generación, salida con `speechSynthesis`, entrada por micrófono usando `SpeechRecognition` cuando el navegador la expone y degradación explícita cuando no existe soporte. Se registra un Service Worker para cachear el shell y se muestra el backend detectado, IndexedDB, Cache Storage, audio, micrófono y estado offline.

La integración de inferencia local está preparada con `@huggingface/transformers` **4.2.0**, `llm.worker.ts`, `embedding.worker.ts` y `audio.worker.ts`. El modelo LLM se carga bajo demanda desde Admin con `WebGPU → WASM/CPU`, cuantización configurable y progreso de descarga. La demo no intenta descargarlo al abrir la página para no bloquear la navegación: el camino determinista grounded sigue funcionando mientras el modelo no ha sido cargado.

## Modelo de seguridad y grounding

El contenido del snapshot se trata como datos no confiables. El prompt por defecto prohíbe inventar fechas, precios, docentes, requisitos o contenidos, y el controller responde “no hay información suficiente” cuando no puede encontrar una fuente local. Las fuentes aparecen como chips clicables que intentan llevar al elemento de origen y lo resaltan brevemente.

La ruta `/admin` no es un perímetro de seguridad: es una consola UX de demostración, tal como exige la arquitectura frontend-only. La configuración pequeña se guarda en `localStorage`; conversaciones y futuros embeddings usan IndexedDB. No hay API routes, base remota, servidor de inferencia ni claves de proveedor.

## Fuentes y decisiones de diseño

La jerarquía visual de la réplica se inspiró en la página pública de Educación Continua DCC: navegación institucional, subnavegación de Educación Continua, titular “La tecnología evoluciona, tú también”, modalidad online, secciones de programas y contacto [1]. La decisión de pinnear Transformers.js 4.2.0 se tomó contrastando la versión npm publicada con la documentación oficial y el árbol oficial de ejemplos conversacionales WebGPU [2] [3] [4].

La dirección visual es **Archivo editorial cívico**: DM Serif Display para titulares, Manrope para UI, marfil de papel, carbón, granate académico y verde mineral contextual. Los activos visuales son originales y se referencian con URLs de almacenamiento gestionado por el proyecto.

## Limitaciones conocidas

El snapshot de cursos es una representación de demostración normalizada; debe sustituirse por una nueva extracción y revisión institucional antes de publicar información académica o comercial. La respuesta grounded determinista cubre el flujo del MVP y evita depender de un modelo pesado en la primera carga, mientras que el worker de Transformers.js queda listo para activar inferencia local real. La transcripción Whisper y TTS Transformers.js están encapsulados como workers, pero el camino usable por defecto emplea las APIs nativas del navegador cuando están disponibles.

## Referencias

[1]: https://dcc.uchile.cl/educacion-continua/ "DCC | Educación Continua"
[2]: https://www.npmjs.com/package/@huggingface/transformers "@huggingface/transformers en npm"
[3]: https://huggingface.co/docs/transformers.js/en/index "Transformers.js — documentación oficial"
[4]: https://github.com/huggingface/transformers.js-examples/tree/main/conversational-webgpu "Transformers.js examples — conversational-webgpu"
