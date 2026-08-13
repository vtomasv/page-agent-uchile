# Hallazgos de referencia

## Sitio de Educación Continua DCC

La página pública de Educación Continua del DCC presenta una navegación institucional con “Nosotros”, “Pregrado”, “Postgrado”, “Educación Continua”, “Investigación”, “Difusión” y “CONTACTO”. Dentro de Educación Continua aparecen “Magíster en TI”, “Diplomas”, “Bootcamps”, “Cursos”, “Programas Corporativos”, “Docentes” y “Equipo”.

El contenido visible incluye el titular “EDUCACIÓN CONTINUA DCC”, el mensaje “La tecnología evoluciona, tu también”, la modalidad “MODALIDAD ONLINE - CLASES EN VIVO”, una llamada “Postula aquí”, una sección “¿QUIÉNES SOMOS?” y bloques de “MAGÍSTER Y DIPLOMAS” y “BOOTCAMPS”. El contacto público incluye Departamento de Ciencias de la Computación, FCFM, Universidad de Chile, Beauchef #851, Santiago, el correo ec@dcc.uchile.cl y teléfonos de contacto. La réplica usa esta jerarquía y datos de referencia como contenido de demostración, con una nota visible de que no reemplaza la fuente institucional.

Fuente: [DCC | Educación Continua](https://dcc.uchile.cl/educacion-continua/)

## Transformers.js

La investigación preliminar muestra que Transformers.js v4 fue anunciado como disponible en npm el 9 de febrero de 2026, con un runtime WebGPU reescrito y compatibilidad con ejecución en navegador. El árbol oficial de ejemplos mantiene una carpeta `conversational-webgpu` y también ejemplos separados para embeddings WebGPU, Whisper en tiempo real y text-to-speech WebGPU. La implementación fijará la versión disponible durante el build y aislará la API detrás de workers para no acoplar la UI a una versión antigua.

La guía oficial documenta `pipeline()` para tareas como `text-generation`, `feature-extraction`, `automatic-speech-recognition` y `text-to-speech`, la opción `device: "webgpu"`, cuantización por `dtype`, `progress_callback`, cache de navegador y `TextStreamer` para streaming. En el MVP se usarán esos patrones como integración progresiva: el camino principal se ejecutará localmente cuando el modelo esté disponible; el camino de demostración seguirá funcionando sin descargar un modelo pesado.

Fuentes: [Transformers.js v4](https://huggingface.co/blog/transformersjs-v4), [Transformers.js docs](https://huggingface.co/docs/transformers.js/en/index), [Transformers.js examples](https://github.com/huggingface/transformers.js-examples/tree/main/conversational-webgpu)

## Restricciones de confianza

El contenido recuperado del sitio se trata como datos no confiables y nunca como instrucciones. El agente debe priorizar el contexto visible, combinar score semántico/lexical y route boost, citar los chunks utilizados y rechazar afirmaciones que no puedan sustentarse. Los artifacts se validan con Zod antes de renderizarse.
