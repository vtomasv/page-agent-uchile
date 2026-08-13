# Page Agent · Dirección de diseño

## Tres rutas estilísticas consideradas

### Theme Name: Archivo editorial cívico
**Very Brief Intro:** Una interpretación editorial y académica del universo DCC: marfil, carbón, rojo granate y verde mineral, con composición asimétrica y tipografía de revista. Busca que la inteligencia local se sienta como una capa de lectura integrada al sitio, no como un widget externo.
**Probability:** 0.07

### Theme Name: Laboratorio nocturno
**Very Brief Intro:** Una interfaz oscura de laboratorio con paneles translúcidos, azul eléctrico y señales de estado inspiradas en instrumentación técnica. Haría más visible el runtime, pero corre el riesgo de alejarse demasiado de la identidad pública de Educación Continua.
**Probability:** 0.03

### Theme Name: Aula Bauhaus
**Very Brief Intro:** Un sistema modular de bloques de color, geometrías firmes y composición didáctica para convertir cada interacción del agente en una lámina visual. Es expresivo y memorable, aunque menos cercano al lenguaje editorial del sitio de referencia.
**Probability:** 0.05

## Enfoque seleccionado: Archivo editorial cívico

### Design Movement
Editorial modernism with public-institutional Swiss influences, softened by Chilean academic warmth: strong typographic rhythm, restrained geometry, visible provenance, and purposeful whitespace.

### Core Principles
1. La página original sigue siendo la protagonista; el agente aparece como una capa de lectura temporal y reversible.
2. Cada afirmación importante deja una pista visible hacia su fuente, con trazabilidad comprensible para personas no técnicas.
3. La jerarquía se construye con contraste tipográfico, reglas finas, bloques de color y alineaciones desplazadas; no con una cuadrícula genérica centrada.
4. El estado del runtime se comunica con honestidad editorial: preparado, descargando, local, degradado o con limitaciones.

### Color Philosophy
El fondo marfil (#F4F1EA) evoca papel y lectura prolongada; el carbón (#242321) ancla el texto y recuerda la navegación del DCC; el granate académico (#9D2038) funciona como firma institucional sin imitar un logotipo; el verde mineral (#166A68) marca acciones del agente, fuentes y estados locales; un amarillo azafrán (#E2AA3B) se reserva para señales de progreso y atención. La intención es que la IA se sienta confiable, situada y pública, no futurista ni espectacularizada.

### Layout Paradigm
Una estructura de columna editorial: header oscuro de navegación, hero dividido en texto y visual, riel lateral contextual para la página actual, y contenido principal con secciones amplias. El chat flota en la esquina inferior derecha, mientras que los Page Artifacts se insertan en el flujo principal con una línea de origen y una barra de acciones. En mobile, el riel pasa a una cinta horizontal y el chat se convierte en bottom sheet.

### Signature Elements
1. **Source rail:** chips y reglas laterales que conectan respuestas con fragmentos de la página.
2. **Page Artifact strip:** una banda superior granate/verde con la leyenda “Generado por el asistente” y controles reversibles.
3. **Runtime pulse:** una pequeña marca circular que cambia entre local, descargando y degradado, siempre acompañada por texto.

### Interaction Philosophy
Las interacciones son explícitas, reversibles y explicables. El agente no toma el control de la navegación: propone rutas, inserta una visualización temporal y deja controles para escuchar, preguntar, deshacer y volver al contenido original. Las acciones importantes tienen confirmación visual inmediata, no efectos sorpresivos.

### Animation
Entradas con desplazamiento vertical corto y opacidad, entre 180 y 240 ms, usando una curva de salida firme. Los artifacts aparecen desde su ancla con escala inicial 0.98, nunca desde 0. Las tarjetas de cursos elevan ligeramente su borde al pasar el cursor; los chips de fuente hacen un pulso breve al resaltar un bloque. Se respeta `prefers-reduced-motion` y los cambios de ruta son instantáneos para teclado.

### Typography System
Display: **DM Serif Display**, en títulos de hero y números de sección, para una voz editorial cálida. UI/body: **Manrope**, 400–800, para navegación, metadata, controles y lectura larga. La escala combina titulares grandes con etiquetas uppercase pequeñas y tracking amplio. Las cifras de duración, fechas y estado usan peso 700 y tabular numbers cuando sea posible.

### Brand Essence
Una página académica que puede leerse a sí misma, para personas que buscan formación tecnológica continua y necesitan comparar opciones sin perder el contexto. **Rigurosa, situada, hospitalaria.**

### Brand Voice
Los titulares son directos y con sentido de avance; los CTAs son verbos concretos; el microcopy explica límites sin sonar defensivo. Se evita el relleno aspiracional.

Ejemplos:

> **Pregunta a la página, no a una caja negra.**

> **Compara con el contenido que está aquí.**

### Wordmark & Logo
El símbolo es un monograma abstracto sin texto: dos corchetes editoriales que se acercan y forman una “P” abierta, atravesados por un punto verde que representa el contexto activo. Se usará como marca de la capa Page Agent y como favicon, sin sustituir la mención textual del DCC.

### Signature Brand Color
**Verde mineral contextual — #166A68.** Es el color propio de Page Agent: señala que el agente está leyendo contenido local y no una conversación genérica.

## Decisiones de implementación

- La réplica conservará la jerarquía del sitio real observada el 13 de agosto de 2026: navegación superior oscura, subnavegación de Educación Continua, hero con “La tecnología evoluciona, tú también”, modalidad online, bloques de programas y contacto.
- La aplicación será frontend-only. No habrá rutas de API, servidor propio de inferencia, base remota ni claves de proveedor.
- El runtime local expondrá capacidades, persistencia, recuperación lexical/semántica y estado de modelos aun cuando los modelos no se hayan descargado. Para no bloquear la demo, el prototipo incluirá una ruta determinista de grounding local y dejará Transformers.js preparado para carga progresiva.
- Los artifacts se renderizarán mediante componentes React validados, nunca mediante HTML recibido del modelo.

## Style Decisions

- La IA se expresa como una capa editorial visible y reversible, no como un dashboard oscuro separado.
- El color verde mineral queda reservado para contexto local, fuentes y acciones del agente.
