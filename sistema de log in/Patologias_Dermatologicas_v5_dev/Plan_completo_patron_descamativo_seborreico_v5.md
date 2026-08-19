# Plan técnico y funcional consolidado
## Digitalización del patrón descamativo-seborreico

**Versión:** 5.0 consolidada  
**Estado:** lista para implementación en desarrollo, con validaciones clínicas y legales pendientes antes de producción  
**Proyecto:** DermVet Pro  
**Carpeta canónica:** `c:/Curro/Patologias_Dermatologicas/`

---

## 1. Objetivo y alcance

El objetivo es incorporar a la aplicación existente la digitalización completa del **patrón descamativo-seborreico**, incluyendo:

- Una pantalla informativa del patrón.
- La explicación de su base lesional.
- Los ejemplos macroscópicos y microscópicos descritos en el manual.
- Un árbol de orientación diagnóstica interactivo.
- Los diagnósticos diferenciales y las pruebas asociadas a cada rama.
- El abordaje terapéutico general.
- La bibliografía vinculada desde el manual.
- Trazabilidad entre cada bloque digital y su página de origen.
- Accesibilidad, funcionamiento responsive y pruebas de regresión.

Esta fase **no** debe:

- Añadir diagnósticos, preguntas o relaciones clínicas que no aparezcan en el manual.
- Simular un diagnóstico confirmado.
- Introducir porcentajes de confianza.
- Añadir dosis, duración de tratamientos o pautas farmacológicas.
- Reutilizar dosis o tratamientos de otros patrones.
- Mostrar imágenes clínicas genéricas, de stock o generadas por IA.
- Incluir por defecto contenido promocional o nombres comerciales dentro del flujo clínico.

---

## 2. Resumen ejecutivo

El algoritmo del manual contiene una única pregunta:

> **¿Tiene prurito?**

Con tres respuestas:

1. **Sí, desde el principio.**
2. **No.**
3. **Sí, pero apareció después de empezar la dermatitis seborreica.**

Cada respuesta conduce directamente a un conjunto de **categorías diagnósticas diferenciales**, con las pruebas representadas por los pictogramas del manual. No existe un segundo nivel de preguntas secuenciales ni un orden obligatorio de descarte.

Por tanto, el flujo digital será:

```text
Pantalla inicial
→ Información del patrón
→ Pregunta sobre el prurito
→ Orientación diferencial
→ Pruebas asociadas
→ Abordaje terapéutico general
```

La salida se denominará siempre:

> **Orientación diagnóstica diferencial**

Nunca:

- Diagnóstico confirmado.
- Diagnóstico definitivo.
- Resultado positivo o negativo.
- Probabilidad diagnóstica.
- Nivel de confianza.

---

## 3. Decisiones arquitectónicas definitivas

| Decisión | Solución |
|---|---|
| Datos del patrón | Archivo externo `data-seborreico.js` |
| Código del motor | Permanecerá en `index.html` durante esta fase |
| Segundo archivo de lógica | **No se creará** `app-seborreico.js` |
| Registro del patrón | `window.DermVet.registerPattern()` |
| Inicialización | `bootstrap()` se ejecutará una sola vez, después de cargar `data-seborreico.js` |
| Flujo | Motor genérico mediante `meta.flowType` |
| Resultado | Nueva vista `screen-differential` |
| Información previa | Nueva vista `screen-pattern-info` |
| Imágenes | Solo originales con licencia confirmada |
| Rama C | Se implementa provisionalmente, separada de las pruebas de la rama B y bloqueada para producción hasta validación veterinaria |
| CTA de Ceva | Excluido del flujo clínico por defecto |
| Seguridad de renderizado | DOM API y `textContent`; no `innerHTML` con contenido clínico |
| Fuente de verdad | Markdown maestro y páginas 4 a 8 del manual original |

---

## 4. Estado actual del proyecto

### 4.1. Estructura

```text
c:/Curro/Patologias_Dermatologicas/
├── index.html
├── index_backup.html
├── stats.html
├── Patrones_dermatologicos_perros_markdown_maestro.md
└── Imagenes_Patologias/
    └── Patrones + Imagenes Botellas + LOGOS/
        ├── PAG 5 FOTO 1.tiff
        ├── PAG 5 FOTO 2.tiff
        ├── PAG 7 FOTO 1-5.tif
        ├── Patron_descamativo_figura_1.ai
        ├── Patron_descamativo_figura_2.ai
        ├── Patron_descamativo_figura_3.ai
        └── otros recursos
```

La carpeta duplicada detectada anteriormente se considera eliminada. Antes de modificar nada, el agente debe confirmar que esta ruta es realmente la usada por el navegador o despliegue.

### 4.2. Tecnologías

- SPA estática.
- HTML5.
- CSS3.
- JavaScript ES6 sin framework.
- Datos clínicos actuales dentro de `const TREES`.
- Tarjetas iniciales generadas mediante `PATTERNS_LIST`.
- Navegación entre `screen-home`, `screen-tree` y `screen-result`.
- Tema claro y oscuro.
- Recursos visuales y SVG parcialmente incrustados en JavaScript.

### 4.3. Patrones actuales

| Patrón | Clave | Estado |
|---|---|---|
| Alopécico | `alopécico` | Activo |
| Pustular-vesicular | `pustular_vesicular` | Activo |
| Pruriginoso | `pruriginoso` | Activo |
| Descamativo-seborreico | `seborreico` | Inactivo |
| Erosivo-ulcerativo | `ulcerativo` | Inactivo |
| Pápulo-placo-nodular | `nodular` | Inactivo |

### 4.4. Inicialización actual

La llamada actual equivalente a:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  renderPatternsGrid();
});
```

debe sustituirse. No puede coexistir con la nueva inicialización.

---

## 5. Elementos reutilizables

### 5.1. CSS

Se pueden reutilizar:

- Variables de color y tema.
- Tipografías.
- Radios, sombras y espaciados.
- `.disease-card`.
- `.card-image-container`.
- `.card-details`.
- `.option-button`.
- `.option-btn-icon`.
- `.option-btn-texts`.
- `.step-container-card`.
- `.step-header-banner`.
- `.step-body-content`.
- `.step-clinical-instruction`.
- `.disclaimer-card-info`.
- Botones de retorno.
- Media queries existentes.

### 5.2. JavaScript

Se pueden reutilizar:

- `showScreen(screenId)`.
- `goHome()`, adaptándolo al nuevo estado.
- `toggleTheme()`.
- `renderPatternsGrid()`, con cambios en el manejador de clic.
- `showLockedPattern()` y `closeLockedModal()` para patrones aún inactivos.
- `startTree()` y el motor secuencial para los tres patrones existentes.

### 5.3. Elementos que no deben reutilizarse directamente

No se usarán para el resultado seborreico:

- `showResultScreen()`.
- El bloque de confianza porcentual.
- El título singular de diagnóstico.
- El renderizador de tratamientos con dosis.
- El CTA comercial automático.
- Los SVG clínicos sintéticos del motor antiguo.
- Los iconos de respuesta positiva o negativa.

---

## 6. Problemas y deuda técnica que afectan a esta fase

| ID | Problema | Acción |
|---|---|---|
| P1 | `screen-result` presupone un diagnóstico único | Crear `screen-differential` |
| P2 | Existen dosis en otros patrones | No reutilizar ese renderizador |
| P3 | `index.html` supera las 2.300 líneas | Extraer únicamente los datos seborreicos |
| P4 | Los datos actuales contienen HTML | Usar datos estructurados y `textContent` |
| P5 | Las tarjetas usan imágenes genéricas | Eliminar la imagen genérica del nuevo patrón |
| P6 | No existe pantalla informativa | Crear `screen-pattern-info` |
| P7 | El motor secuencial no representa este algoritmo | Incorporar `flowType` |
| P8 | No existe historial fiable | Centralizar navegación |
| P9 | No se gestiona el foco | Implementar foco y anuncios accesibles |
| P10 | `stats.html` puede asumir diagnósticos únicos | Auditar y probar antes de darlo por compatible |
| P11 | El árbol reutiliza `screen-tree` | Limpiar completamente la vista al cambiar de flujo |
| P12 | La carga externa puede fallar | Validar el registro y desactivar la tarjeta |

---

# 7. Contenido clínico que debe digitalizarse

## 7.1. Definición y base lesional

Fuente: página 6.

Los cuadros descamativo-seborreicos se producen cuando se altera:

- El proceso normal de queratinización.
- El número de las glándulas sebáceas.
- La actividad de las glándulas sebáceas.

Renovación epidérmica normal:

- **21–28 días.**

Consecuencias descritas:

- La piel se renueva a un ritmo anormal.
- La piel se descama.
- Se producen alteraciones en el número o la actividad de las glándulas sebáceas.
- La capa córnea engrosada retiene bacterias.
- El exceso de grasa se une a la piel muerta y ralentiza la eliminación de bacterias.

## 7.2. Anatomía y capas señaladas

Fuente: página 6.

### Elementos numerados

1. Tallo del pelo.
2. Melanocitos.
3. Glándula sudorípara.
4. Vaso sanguíneo.
5. Corpúsculo de Pacini.
6. Glándula sebácea.
7. Folículo piloso.
8. Músculo erector del pelo.
9. Descarga de cuerpos lamelares.
10. Cuerpos lamelares.
11. Gránulos de queratohialina.
12. Núcleo en degeneración.
13. Cuerpos lamelares.
14. Membrana basal.

Las posiciones 10 y 13 tienen la misma denominación en el original. Se conservarán sin corrección y el elemento 13 tendrá una advertencia editorial interna.

### Capas

- Estrato córneo.
- Estrato granuloso.
- Estrato espinoso.
- Estrato basal.
- Epidermis.
- Dermis.
- Tejido subcutáneo.

### Presentación digital

Mientras no exista una ilustración autorizada:

- Mostrar una explicación textual resumida.
- Incluir la lista anatómica dentro de un elemento desplegable `<details>`.
- No intentar reconstruir un diagrama clínico con IA.
- Cuando se autorice el recurso original, sustituir o complementar el texto con el diagrama.

## 7.3. Ejemplos macroscópicos

Fuente: página 6.

1. Seborrea oleosa por *Demodex injai*.
2. Dermatitis descamativa por leishmaniosis.
3. Descamación masiva por ictiosis.
4. Seborrea seca en dos perros con adenitis sebácea.

Sin licencia confirmada:

- En desarrollo: usar tarjetas textuales sin fotografía.
- En producción: omitir el espacio de imagen.
- No mostrar el texto “pendiente de licencia” al usuario final.

## 7.4. Hallazgos microscópicos

Fuente: página 7.

1. *Demodex injai* en un raspado.
2. *Sarcoptes* en un raspado.

El documento original incluye una grafía específica en el pie de imagen de *Sarcoptes*. No se corregirá ni se reproducirá como nombre científico completo sin validación editorial. La interfaz mostrará la forma neutral:

> Sarcoptes en un raspado.

## 7.5. Catálogo central de pruebas diagnósticas

Fuente: página 4.

El catálogo debe contener exactamente estos once identificadores:

| ID | Etiqueta |
|---|---|
| `ensayo_terapeutico` | Ensayo terapéutico |
| `citologia` | Citología |
| `histopatologia` | Histopatología |
| `cultivo_fungico_pcr` | Cultivo fúngico / PCR de dermatofitos |
| `cultivo_bacteriano` | Cultivo bacteriano |
| `protocolo_alergias` | Protocolo diagnóstico de las alergias |
| `anamnesis_resena` | Diagnóstico basado en gran medida en la anamnesis/reseña del paciente |
| `lampara_wood` | Lámpara de Wood |
| `examen_pelo` | Examen microscópico del pelo |
| `analiticas_sangre` | Analíticas específicas en sangre |
| `raspado_cutaneo` | Raspado cutáneo |

Las “tinciones específicas” no forman parte de este catálogo de pictogramas. Se modelarán como `additionalProcedures`.

---

# 8. Árbol de orientación diagnóstica

## 8.1. Pregunta

Texto literal visible:

> **¿Tiene prurito?**

## 8.2. Respuestas

Textos literales visibles:

1. **Sí, desde el principio.**
2. **No.**
3. **Sí, pero apareció después de empezar la dermatitis seborreica.**

Los tres botones deben utilizar un icono neutro. Ninguna respuesta debe representarse como correcta, incorrecta, positiva o negativa.

---

## 8.3. Rama A: Sí, desde el principio

### A.1. Ectoparásitos

Diagnósticos diferenciales:

- *Sarcoptes*.
- Pulgas.
- *Cheyletiella*.
- *Demodex* spp., incluido *D. injai*.

Pruebas:

- Raspado cutáneo.
- Examen microscópico del pelo.
- Ensayo terapéutico.

### A.2. Dermatitis alérgica ± infecciones secundarias

Componentes secundarios:

- Bacterias.
- Levaduras.

Pruebas:

- Citología.
- Protocolo diagnóstico de las alergias.
- Diagnóstico basado en gran medida en la anamnesis/reseña del paciente.

### A.3. Dermatofitosis

Nota:

> El prurito inicial no está presente en muchos casos.

Pruebas:

- Lámpara de Wood.
- Cultivo fúngico / PCR de dermatofitos.

### A.4. Linfoma epiteliotrópico

Contexto:

- Perros geriátricos.

Pruebas:

- Citología.
- Histopatología.

---

## 8.4. Rama B: No

### B.1. Dermatosis seborreica primaria

Contexto:

- Perros jóvenes.

Diagnósticos diferenciales:

- Seborrea idiopática.
- Ictiosis.
- Dermatosis que responden al zinc.

Pruebas:

- Diagnóstico basado en gran medida en la anamnesis/reseña del paciente.
- Histopatología.

### B.2. Adenitis sebácea

Diagnósticos diferenciales:

- Idiopática granulomatosa.
- Por leishmaniosis.

Pruebas:

- Histopatología.

Procedimiento complementario:

- ± Tinciones específicas.

### B.3. Dermatosis exfoliativa por *Leishmania*

Pruebas:

- Analíticas específicas en sangre.
- Histopatología.

Procedimiento complementario:

- ± Tinciones específicas.

Debe mantenerse como entidad separada de B.2.

### B.4. Dermatofitosis

Nota:

> El prurito es variable entre individuos.

Pruebas:

- Lámpara de Wood.
- Cultivo fúngico / PCR de dermatofitos.

### B.5. Demodicosis

Pruebas:

- Examen microscópico del pelo.
- Raspado cutáneo.
- Ensayo terapéutico.

### B.6. Patologías del folículo que pueden cursar con seborrea

Diagnósticos:

- Secuestro folicular.
- Displasia folicular.

Prueba:

- Histopatología.

### B.7. Deficiencias nutricionales

Contexto:

- Mala calidad del alimento.

Pruebas:

- Ningún pictograma asignado en el algoritmo.

Nota editorial visible:

> El algoritmo del manual no especifica una prueba diagnóstica para esta categoría.

La interfaz no debe afirmar que “no existen pruebas”.

### B.8. Alteraciones hormonales

Diagnósticos:

- Hipotiroidismo.
- Hiperadrenocorticismo.

Prueba:

- Analíticas específicas en sangre.

---

## 8.5. Rama C: prurito posterior

Texto del manual:

- Las mismas patologías que inicialmente no cursan con prurito.
- El prurito aparece al desarrollarse infecciones secundarias.

Implementación propuesta:

1. Mostrar las ocho categorías de la Rama B sin modificar sus pruebas.
2. Añadir un bloque separado denominado:

> **Evaluación adicional del prurito secundario**

3. Incluir en ese bloque:

- Citología.
- Diagnóstico basado en gran medida en la anamnesis/reseña del paciente.

### Estado de validación

Esta traducción digital se implementará con:

```text
validationStatus: pending_clinical_review
```

Reglas:

- En desarrollo o validación: puede mostrarse con una advertencia.
- En producción: la Rama C permanecerá desactivada o marcada como no validada hasta aprobación veterinaria.
- Las pruebas adicionales nunca deben mezclarse dentro de cada categoría de la Rama B.

---

# 9. Abordaje terapéutico

Fuente: página 8.

Debe modelarse en bloques independientes para conservar su condicionalidad.

## 9.1. Con prurito asociado

- Investigar y tratar la causa primaria del prurito.

## 9.2. Control del prurito

- Antiinflamatorios tópicos/sistémicos.

## 9.3. Control de ectoparásitos

- Antiparasitarios externos con acción acaricida.

## 9.4. Control del componente infeccioso secundario

- Uso de antisépticos tópicos (clorhexidina 2–4 %).
- Uso de antibiótico únicamente si es estrictamente necesario.
- Antifúngicos tópicos/sistémicos si es estrictamente necesario.

## 9.5. En caso de linfoma

- Seguir las recomendaciones oncológicas adecuadas.

## 9.6. Tratamiento hormonal

- Añadir tratamiento hormonal si procede.

## 9.7. Medidas que en todos los casos pueden ser adecuadas

El encabezado condicional debe mostrarse explícitamente:

> **En todos los casos puede ser adecuado:**

- Uso de productos antiseborreicos/seborreguladores tópicos.
- Uso de productos tópicos para hidratación cutánea intensiva.
- Evitar infecciones secundarias principalmente a base de baños.
- En casos puntuales puede ser adecuado el uso de suplementos de zinc ± retinoides.

### Restricciones

No añadir:

- Dosis.
- Frecuencias.
- Duraciones.
- Nombres comerciales.
- Recomendaciones procedentes de otros patrones.

La concentración de clorhexidina `2–4 %` sí debe conservarse porque aparece expresamente en el manual.

---

# 10. Información no disponible en la fuente

Debe representarse como ausencia, no completarse mediante conocimiento externo:

- Dosis farmacológicas.
- Duración de tratamientos.
- Frecuencia de administración.
- Nombres comerciales.
- Probabilidad de cada diagnóstico.
- Nivel de confianza.
- Orden secuencial de descarte.
- Resultado esperado de cada prueba.
- Prueba concreta para deficiencias nutricionales.
- Indicaciones específicas de las tinciones.
- Confirmación definitiva de la interpretación digital de la Rama C.

---
# 11. Modelo de datos

## 11.1. Namespace de registro

Para evitar depender de que un `const` global sea propiedad de `window`:

```javascript
const TREES = {
  // patrones existentes
};

window.DermVet = window.DermVet || {};

window.DermVet.registerPattern = function registerPattern(key, data) {
  if (!key || !data || typeof data !== 'object') {
    console.error('Registro de patrón no válido:', key);
    return false;
  }

  TREES[key] = data;
  return true;
};
```

En `data-seborreico.js`:

```javascript
window.DermVet.registerPattern('seborreico', {
  // modelo completo
});
```

## 11.2. Metadatos obligatorios

```text
meta.id
meta.slug
meta.name
meta.flowType = single-question-differential
meta.resultType = differential-guidance
meta.sourceDocument
meta.sourcePages
meta.validationStatus
meta.contentMode
meta.productionReady
```

## 11.3. Secciones obligatorias

```text
definition
anatomy
macroscopicExamples
microscopicExamples
diagnosticTests
decisionTree
therapeuticApproach
bibliography
warnings
```

## 11.4. Estructura de un grupo diferencial

```text
id
type
title
sourceText
diagnoses
secondaryComponents
tests
additionalProcedures
context
notes
editorialNote
source
validationStatus
contentMode
```

## 11.5. Estados de validación

| Valor | Uso |
|---|---|
| `source_verified` | Verificado contra el documento |
| `editorial_note` | Explicación añadida por el equipo |
| `pending_clinical_review` | Requiere aprobación veterinaria |
| `pending_legal_review` | Requiere revisión de licencia o marca |
| `pending_link_check` | Enlace aún no comprobado |

## 11.6. Modos de contenido

| Valor | Uso |
|---|---|
| `literal` | Coincide con el texto original |
| `normalized` | Reformulado sin cambiar el significado |
| `editorial` | Añadido por el equipo digital |

Reglas:

- Todo contenido `normalized` tendrá `sourceText`.
- El contenido `literal` se comparará con el original, no con una versión normalizada.
- Los cambios de mayúsculas realizados solo mediante CSS no alteran el modo.
- Las advertencias profesionales tendrán `origin: editorial`.

## 11.7. Trazabilidad

Cada bloque tendrá una fuente directa o heredada:

```javascript
source: {
  pages: [7],
  section: 'Rama A / A.1',
  appliesToChildren: true
}
```

Las colecciones también tendrán fuente:

- `anatomy`.
- `macroscopicExamples`.
- `microscopicExamples`.
- `therapeuticApproach`.

## 11.8. Imágenes

Cada recurso tendrá:

```text
imageRef
imageStatus
alt
source
licenseStatus
```

Estados:

- `pending_license`.
- `approved`.
- `excluded`.

Reglas:

- El texto alternativo debe revisarlo una persona con competencia clínica.
- Los archivos TIF y AI se conservan como maestros.
- Fotografías web: WebP con JPEG de respaldo.
- Diagramas: SVG exportado o PNG.
- No convertir ni publicar hasta confirmar derechos.

## 11.9. Bibliografía

```text
label
url
source
validationStatus
```

La interfaz mostrará un enlace descriptivo:

> Consultar la bibliografía del manual

Con:

```html
target="_blank"
rel="noopener noreferrer"
```

Antes de producción se verificará que la URL extraída del QR siga activa y corresponda al recurso correcto.

---

# 12. Validación automática del modelo

Crear:

```javascript
function validatePatternData(pattern) {
  const errors = [];
  // campos obligatorios
  // IDs únicos
  // referencias de pruebas válidas
  // referencia de branch-c válida
  // campos prohibidos
  // contenido normalizado con sourceText
  // notas editoriales identificadas
  return errors;
}
```

Validaciones mínimas:

1. Existe `meta.flowType`.
2. Existe la pregunta.
3. Existen las tres respuestas.
4. Todos los IDs son únicos.
5. Todos los IDs de pruebas existen en `DIAGNOSTIC_TESTS`.
6. No hay pruebas duplicadas dentro de un grupo.
7. `branch-c.referenceToBranch` apunta a `branch-b`.
8. No existen campos:
   - `confidence`.
   - `probability`.
   - `dosage`.
   - `dose`.
9. Todo contenido `normalized` tiene `sourceText`.
10. Toda nota editorial está identificada.
11. Las fuentes tienen página y sección.
12. Las URL externas usan protocolo HTTPS.
13. La Rama C no muta los datos de la Rama B.
14. Las recomendaciones terapéuticas no contienen dosis detectables.
15. La aplicación no se inicia con el patrón activo si hay errores.

---

# 13. Inicialización y orden de carga

## 13.1. Orden

```html
<script>
  // TREES
  // PATTERNS_LIST
  // DIAGNOSTIC_TESTS
  // window.DermVet.registerPattern
  // funciones
  // bootstrap, todavía sin ejecutar
</script>

<script src="data-seborreico.js"></script>

<script>
  bootstrap();
</script>
```

No se creará `app-seborreico.js`.

## 13.2. Inicialización única

Eliminar o sustituir cualquier llamada anterior a:

```javascript
renderPatternsGrid();
```

Reglas:

- `bootstrap()` se ejecuta exactamente una vez.
- `renderPatternsGrid()` solo se invoca desde `bootstrap()` durante el arranque.
- Añadir un guard:

```javascript
let appBootstrapped = false;
```

## 13.3. Bootstrap

Responsabilidades:

1. Validar los patrones registrados.
2. Desactivar el seborreico si no se cargó o no es válido.
3. Aplicar el estado de producción de la Rama C.
4. Renderizar la cuadrícula.
5. Inicializar listeners globales.
6. No duplicar tarjetas ni listeners.

Fallback:

```text
Si data-seborreico.js falla:
- El resto de la aplicación funciona.
- La tarjeta queda inactiva.
- Badge: NO DISPONIBLE.
- Se registra el error en consola.
```

---

# 14. Motor de navegación genérico

Todas las tarjetas activas llamarán a:

```javascript
startPatternFlow(patternKey)
```

Comportamiento:

```text
Si flowType = single-question-differential:
  información → pregunta → orientación diferencial

En cualquier otro caso:
  delegar en startTree(patternKey)
```

Funciones genéricas nuevas:

- `startPatternFlow(patternKey)`.
- `renderPatternIntroduction(pattern)`.
- `renderDecisionQuestion(pattern)`.
- `showDifferentialResult(patternKey, branchId)`.
- `renderDifferentialGroups(groups)`.
- `renderTherapeuticApproach(groups)`.
- `renderBibliography(bibliography)`.
- `resetTreeScreen()`.
- `navigateTo(view, options)`.
- `navigateBack()`.
- `resetOrientation()`.
- `showPatternUnavailable(patternKey)`.
- `validatePatternData(pattern)`.
- `bootstrap()`.

No deben crearse funciones llamadas específicamente:

- `startSeborreicoFlow`.
- `renderSeborreicoQuestion`.
- `showSeborreicoResult`.

---

# 15. Pantallas

## 15.1. `screen-home`

Cambios:

- Activar la tarjeta solo tras validación.
- Eliminar la URL de Unsplash.
- Usar fondo visual neutro mediante CSS o recurso no clínico.
- Badge descriptivo.
- Toda tarjeta activa usa `startPatternFlow()`.

## 15.2. `screen-pattern-info`

Contenido:

1. Título.
2. Definición.
3. Renovación epidérmica.
4. Consecuencias.
5. “Cómo se produce el patrón”.
6. Capas de la piel.
7. Anatomía desplegable.
8. Ejemplos macroscópicos.
9. Hallazgos microscópicos.
10. Bibliografía.
11. Botón “Iniciar orientación diagnóstica”.
12. Botón “Volver al panel inicial”.

## 15.3. `screen-tree`

Para este flujo:

- Mostrar una sola pregunta.
- Ocultar barra de progreso secuencial.
- Ocultar contador de pasos.
- Ocultar diagramas del patrón anterior.
- Usar tres botones neutros.
- Mostrar un texto introductorio breve sin añadir información clínica nueva.

Antes de cada uso ejecutar:

```javascript
resetTreeScreen();
```

## 15.4. `screen-differential`

Contenido:

1. Título “Orientación diagnóstica”.
2. Rama seleccionada.
3. Número de categorías.
4. Tarjetas de categorías.
5. Diagnósticos.
6. Componentes secundarios.
7. Chips de pruebas.
8. Procedimientos complementarios fuera de los chips.
9. Contextos y notas.
10. Nota editorial para B.7.
11. Bloque separado de evaluación adicional para Rama C.
12. Abordaje terapéutico.
13. Bibliografía.
14. Advertencia profesional.
15. Volver a la pregunta.
16. Reiniciar orientación.
17. Volver al panel inicial.

No debe contener:

- Porcentaje.
- Diagnóstico singular.
- Botón de prescripción.
- Dosis.
- CTA comercial.

---

# 16. Estado e historial

Variables:

```javascript
let currentView = 'home';
let currentPatternKey = null;
let selectedBranchId = null;
let navigationHistory = [];
```

Función central:

```javascript
navigateTo(view, { replace = false, state = {} } = {})
```

Reglas:

- No duplicar dos veces la misma vista consecutiva.
- Al volver, restaurar la pregunta sin mantener una selección visual.
- Al reiniciar, ir a la pregunta y limpiar `selectedBranchId`.
- Al volver al inicio, limpiar todo el estado del patrón.
- Al cambiar entre motores, ejecutar siempre la limpieza correspondiente.

Historial esperado:

```text
home → pattern-info → tree → differential
```

---

# 17. Accesibilidad

## 17.1. Foco

- Cada pantalla tendrá un `<h1 tabindex="-1">`.
- Al abrir la pregunta, el foco irá al título.
- Al abrir resultados, el foco irá al título.
- No mover el foco automáticamente al primer botón.

## 17.2. Cambios dinámicos

Crear fuera de las pantallas:

```html
<div id="screen-status" class="sr-only" aria-live="polite"></div>
```

Ejemplos de anuncio:

- “Se muestra la información del patrón descamativo-seborreico.”
- “Se muestra la pregunta sobre el prurito.”
- “Orientación actualizada. Se muestran cuatro categorías diagnósticas.”

No aplicar `aria-live` a todo el resultado.

## 17.3. Teclado

- `Tab`: recorrer controles.
- `Enter` y `Space`: activar botones.
- `Escape`: volver a la pantalla anterior.
- No usar `div onclick`.

## 17.4. Semántica

- Un solo `<h1>` por vista.
- Categorías como `<h2>` o `<h3>`.
- Listas reales para diagnósticos y recomendaciones.
- `<button>` para acciones.
- `<a>` para bibliografía.
- `<details>` y `<summary>` para anatomía si no hay diagrama.

## 17.5. Presentación

- Contraste mínimo 4.5:1.
- No depender solo del color.
- Icono + texto para pruebas.
- Respetar `prefers-reduced-motion`.
- Área táctil suficiente en móvil.

---

# 18. Responsive

## Escritorio, más de 900 px

- Contenedor principal entre 680 y 900 px.
- Categorías en una columna legible.
- Abordaje terapéutico debajo o en columna secundaria si no reduce legibilidad.

## Tablet, 600–900 px

- Una columna.
- Chips con salto de línea.
- Botones de navegación agrupados sin desbordamiento.

## Móvil, menos de 600 px

- Botones a ancho completo.
- Tarjetas apiladas.
- Sin tablas horizontales.
- Tipografía legible.
- Procedimientos complementarios debajo de las pruebas.
- Anatomía plegada por defecto.

---

# 19. Seguridad y calidad del renderizado

- Crear nodos con `document.createElement`.
- Insertar textos mediante `textContent`.
- No insertar datos clínicos mediante `innerHTML`.
- Validar las URL externas.
- Usar `rel="noopener noreferrer"`.
- No ejecutar contenido proveniente del Markdown.
- No incluir datos personales del paciente.
- No registrar en analíticas respuestas clínicas identificables.

---

# 20. Integración con `stats.html`

No se da por compatible automáticamente.

Auditar:

1. Si mantiene una lista fija de patrones.
2. Si espera un diagnóstico único.
3. Si espera porcentaje de confianza.
4. Si registra inicios y finalizaciones.
5. Si el nuevo `resultType` provoca errores.
6. Si `bootstrap()` doble cuenta una visita.
7. Si permite diferenciar:
   - `pattern_started`.
   - `branch_selected`.
   - `differential_viewed`.

No registrar:

- Diagnósticos personales.
- Datos identificativos.
- Respuestas vinculadas a un usuario real.

`stats.html` solo se modificará si la auditoría demuestra que es necesario.

---

# 21. Archivos

## Modificar: `index.html`

- Añadir `DIAGNOSTIC_TESTS`.
- Añadir `window.DermVet.registerPattern`.
- Añadir validador.
- Añadir `bootstrap`.
- Eliminar la inicialización anterior.
- Añadir `screen-pattern-info`.
- Añadir `screen-differential`.
- Añadir `screen-status`.
- Añadir CSS nuevo.
- Adaptar `renderPatternsGrid`.
- Añadir motor genérico.
- Añadir navegación e historial.
- Añadir limpieza de `screen-tree`.
- Añadir carga de `data-seborreico.js`.

## Crear: `data-seborreico.js`

Solo contendrá:

- Metadatos.
- Contenido informativo.
- Anatomía.
- Ejemplos.
- Árbol.
- Tratamiento.
- Bibliografía.
- Advertencias.
- Llamada a `window.DermVet.registerPattern`.

No contendrá:

- Funciones de UI.
- Manipulación del DOM.
- HTML.
- CSS.
- Dosis.
- CTA comercial.

## Auditar: `stats.html`

Modificar únicamente si la auditoría detecta incompatibilidad.

## Conservar

- `index_backup.html`.
- Markdown maestro.
- Originales TIF, AI y PSD.

---
# 22. Plan de implementación por fases

## Fase 1. Preparación

| Tarea | Prioridad | Complejidad | Criterio |
|---|---|---:|---|
| Confirmar carpeta canónica | Bloqueante | Baja | Se ejecuta el `index.html` correcto |
| Probar los tres patrones actuales | Alta | Baja | Todos terminan sin errores |
| Probar `stats.html` actual | Alta | Baja | No hay errores de consola |
| Crear backup con fecha | Alta | Baja | Copia verificable |
| Congelar una lista de comportamiento actual | Media | Baja | Base para regresión |

## Fase 2. Catálogo y registro

| Tarea | Prioridad | Dependencia | Complejidad | Criterio |
|---|---|---|---:|---|
| Crear `DIAGNOSTIC_TESTS` | Alta | Fase 1 | Baja | 11 pruebas exactas |
| Crear namespace `window.DermVet` | Alta | Fase 1 | Baja | Registro accesible |
| Crear `registerPattern()` | Alta | Namespace | Baja | Devuelve éxito o error |
| Crear `validatePatternData()` | Alta | Catálogo | Media | Detecta referencias inválidas |

## Fase 3. Datos clínicos

| Tarea | Prioridad | Dependencia | Complejidad | Criterio |
|---|---|---|---:|---|
| Crear `data-seborreico.js` | Alta | Fase 2 | Alta | Modelo completo |
| Añadir trazabilidad | Alta | Modelo | Media | Todo bloque tiene fuente |
| Marcar literal/normalizado/editorial | Alta | Modelo | Media | Modos coherentes |
| Modelar B.7 correctamente | Alta | Modelo | Baja | Solo la nota es editorial |
| Modelar Rama C por referencia | Alta | Modelo | Media | No duplica ni muta B |
| Modelar tratamiento granular | Alta | Modelo | Media | Conserva condicionales |
| Modelar imágenes y licencias | Media | Modelo | Baja | No publica recursos no aprobados |

## Fase 4. Inicialización

| Tarea | Prioridad | Dependencia | Complejidad | Criterio |
|---|---|---|---:|---|
| Cargar archivo externo | Alta | Fase 3 | Baja | Se registra antes del bootstrap |
| Sustituir inicialización antigua | Alta | Fase 2 | Media | Una sola llamada |
| Implementar `bootstrap()` | Alta | Validador | Media | Activa solo datos válidos |
| Implementar fallback | Alta | Bootstrap | Baja | Aplicación sigue operativa |

## Fase 5. Pantallas y estilos

| Tarea | Prioridad | Dependencia | Complejidad | Criterio |
|---|---|---|---:|---|
| Crear `screen-pattern-info` | Alta | Fase 3 | Media | Contenido completo |
| Crear `screen-differential` | Alta | Fase 3 | Alta | Grupos y pruebas correctos |
| Añadir `screen-status` | Alta | Pantallas | Baja | Anuncios accesibles |
| Añadir CSS responsive | Alta | Pantallas | Media | Dos temas y tres tamaños |
| Crear fondo neutro de tarjeta | Media | Home | Baja | Sin imagen clínica falsa |

## Fase 6. Motor genérico

| Tarea | Prioridad | Dependencia | Complejidad | Criterio |
|---|---|---|---:|---|
| Implementar `startPatternFlow()` | Alta | Fases 4–5 | Media | Delega según `flowType` |
| Renderizar introducción | Alta | Datos | Media | Sin `innerHTML` clínico |
| Renderizar pregunta | Alta | Datos | Media | Tres respuestas literales |
| Renderizar resultado | Alta | Datos | Alta | Diferenciales paralelos |
| Renderizar tratamiento | Alta | Datos | Media | Sin dosis |
| Renderizar bibliografía | Media | Datos | Baja | Enlace seguro |
| Limpiar `screen-tree` | Alta | Motor | Media | Sin contaminación cruzada |

## Fase 7. Navegación y accesibilidad

| Tarea | Prioridad | Dependencia | Complejidad | Criterio |
|---|---|---|---:|---|
| Centralizar historial | Alta | Motor | Media | Volver predecible |
| Implementar reinicio | Alta | Historial | Baja | Limpia selección |
| Gestionar foco | Alta | Pantallas | Media | Foco al título |
| Añadir anuncios | Alta | Pantallas | Baja | `aria-live` pequeño |
| Verificar teclado | Alta | Navegación | Media | Flujo completo sin ratón |
| Verificar contraste | Alta | CSS | Baja | 4.5:1 |

## Fase 8. Imágenes y contenido externo

| Tarea | Prioridad | Dependencia | Complejidad | Criterio |
|---|---|---|---:|---|
| Confirmar licencias | Bloqueante producción | Legal | Variable | Aprobación escrita |
| Convertir recursos | Media | Licencia | Media | WebP/JPEG/SVG/PNG |
| Redactar alt text | Alta producción | Imágenes | Media | Revisión clínica |
| Verificar bibliografía | Alta producción | URL | Baja | Recurso correcto |
| Revisar CTA | Fuera de alcance | Legal/Marca | — | No incluido por defecto |

## Fase 9. Validación

| Tarea | Prioridad | Dependencia | Complejidad | Criterio |
|---|---|---|---:|---|
| Ejecutar pruebas funcionales | Alta | Todas | Media | 100 % pasan |
| Ejecutar regresión | Alta | Todas | Media | Patrones previos intactos |
| Revisar contenido clínico | Alta | UI final | Alta | Aprobación veterinaria |
| Validar Rama C | Bloqueante producción | Veterinario | Variable | Aprobada o desactivada |
| Auditar `stats.html` | Alta | Motor | Media | Compatible |
| Revisar accesibilidad | Alta | UI final | Media | Sin bloqueos críticos |

---

# 23. Casos de prueba

## 23.1. Pantalla informativa

- FI-01: La tarjeta abre `screen-pattern-info`.
- FI-02: Se muestran las tres causas.
- FI-03: Se muestra “21–28 días”.
- FI-04: Se muestran las cinco consecuencias.
- FI-05: Se muestran las siete capas.
- FI-06: El desplegable contiene los catorce elementos.
- FI-07: Los números 10 y 13 conservan “Cuerpos lamelares”.
- FI-08: Se muestran los cuatro ejemplos macroscópicos.
- FI-09: Se muestran los dos ejemplos microscópicos.
- FI-10: La bibliografía aparece como enlace descriptivo.
- FI-11: No se muestra una imagen clínica sin licencia.

## 23.2. Pregunta

- PQ-01: El texto es exactamente “¿Tiene prurito?”.
- PQ-02: Las tres respuestas son las del manual.
- PQ-03: No hay iconos ✓ o ✗.
- PQ-04: No hay una segunda pregunta clínica.
- PQ-05: No se muestra barra de progreso secuencial.
- PQ-06: El foco se mueve al `<h1>`.

## 23.3. Rama A

- A-01: Aparecen cuatro categorías.
- A-02: Ectoparásitos contiene Sarcoptes, Pulgas, Cheyletiella y Demodex spp.
- A-03: Ectoparásitos contiene tres pruebas.
- A-04: Dermatitis alérgica contiene bacterias y levaduras.
- A-05: Dermatitis alérgica contiene citología, protocolo de alergias y anamnesis/reseña.
- A-06: Dermatofitosis contiene su nota específica.
- A-07: Dermatofitosis contiene Wood y cultivo/PCR.
- A-08: Linfoma contiene “perros geriátricos”.
- A-09: Linfoma contiene citología e histopatología.

## 23.4. Rama B

- B-01: Aparecen ocho categorías.
- B-02: Seborrea primaria contiene tres diagnósticos.
- B-03: Seborrea primaria contiene “perros jóvenes”.
- B-04: Adenitis sebácea y dermatosis exfoliativa son tarjetas separadas.
- B-05: Adenitis contiene histopatología.
- B-06: Sus tinciones aparecen como procedimiento, no como chip.
- B-07: Dermatosis exfoliativa contiene analíticas e histopatología.
- B-08: Dermatofitosis tiene una nota distinta de la Rama A.
- B-09: Demodicosis contiene tres pruebas.
- B-10: Patologías foliculares contiene secuestro y displasia.
- B-11: B.7 no contiene chips.
- B-12: B.7 muestra la nota de limitación de fuente.
- B-13: Alteraciones hormonales contiene hipotiroidismo e hiperadrenocorticismo.
- B-14: Alteraciones hormonales contiene analíticas específicas.

## 23.5. Rama C

- C-01: Reutiliza las ocho categorías de B.
- C-02: No modifica los arrays de B.
- C-03: Muestra un bloque adicional separado.
- C-04: El bloque contiene citología y anamnesis/reseña.
- C-05: No mezcla esas pruebas en cada categoría.
- C-06: En desarrollo muestra el estado pendiente.
- C-07: En producción permanece inactiva hasta validación.

## 23.6. Tratamiento

- T-01: Se muestran todos los bloques.
- T-02: “Puede ser adecuado” se mantiene visible.
- T-03: Se conserva clorhexidina 2–4 %.
- T-04: No aparecen dosis por peso.
- T-05: No aparecen pautas temporales.
- T-06: No aparecen nombres comerciales.
- T-07: No aparece CTA de producto.

Regex de dosis:

```regex
\b\d+(?:[.,]\d+)?\s*(?:mg|g|µg|mcg|ml)\s*\/\s*kg\b
```

Regex de frecuencia:

```regex
\b(?:cada\s+\d+\s*(?:h|horas)|q\d+h|una vez al día|dos veces al día)\b
```

## 23.7. Navegación

- N-01: Home → información.
- N-02: Información → pregunta.
- N-03: Pregunta → resultado.
- N-04: Resultado → pregunta.
- N-05: Pregunta → información.
- N-06: Información → home.
- N-07: Reiniciar limpia la selección.
- N-08: Cambiar la respuesta actualiza el resultado.
- N-09: No se duplican estados consecutivos.
- N-10: `bootstrap()` se ejecuta una vez.

## 23.8. Contaminación cruzada

- X-01: Alopécico → home → seborreico no conserva SVG ni progreso.
- X-02: Seborreico → home → pruriginoso recupera el motor secuencial.
- X-03: Cambiar de tema no rompe las pantallas nuevas.
- X-04: Reiniciar no modifica otro patrón.

## 23.9. Integridad de datos

- M-01: IDs únicos.
- M-02: Todos los tests existen en el catálogo.
- M-03: No hay tests repetidos.
- M-04: La referencia de C existe.
- M-05: No hay `confidence`.
- M-06: No hay `probability`.
- M-07: No hay `dosage` ni `dose`.
- M-08: `normalized` tiene `sourceText`.
- M-09: `literal` coincide con el original.
- M-10: Notas editoriales identificadas.
- M-11: Las colecciones tienen fuente.
- M-12: La bibliografía usa HTTPS.
- M-13: Los recursos no aprobados no se renderizan.
- M-14: Los grupos sin diagnósticos se renderizan.
- M-15: Los grupos sin pruebas se renderizan.

## 23.10. Errores

- E-01: `data-seborreico.js` 404: tarjeta desactivada.
- E-02: ID de prueba desconocido: patrón desactivado.
- E-03: Rama inexistente: mensaje controlado.
- E-04: URL inválida: bibliografía no se renderiza.
- E-05: Imagen ausente: no aparece icono roto.
- E-06: El resto de patrones sigue operativo.

## 23.11. Accesibilidad

- AC-01: Flujo completo con teclado.
- AC-02: Escape vuelve.
- AC-03: Cambios anunciados.
- AC-04: Foco visible.
- AC-05: Contraste correcto en tema oscuro.
- AC-06: Contraste correcto en tema claro.
- AC-07: Chips distinguibles sin color.
- AC-08: Orden de encabezados correcto.
- AC-09: Enlace de bibliografía tiene texto descriptivo.
- AC-10: `prefers-reduced-motion` reduce animaciones.

## 23.12. Responsive

- RSP-01: 320 px sin scroll horizontal.
- RSP-02: 600 px legible.
- RSP-03: 900 px legible.
- RSP-04: Escritorio no genera líneas excesivamente largas.
- RSP-05: Chips se adaptan.
- RSP-06: Botones táctiles suficientes.

## 23.13. Regresión

- RG-01: Alopécico completo.
- RG-02: Pustular-vesicular completo.
- RG-03: Pruriginoso completo.
- RG-04: Ulcerativo sigue bloqueado.
- RG-05: Nodular sigue bloqueado.
- RG-06: Tema claro/oscuro.
- RG-07: Modal de patrón bloqueado.
- RG-08: `stats.html` abre sin error.
- RG-09: No se duplican eventos estadísticos.

---

# 24. Criterios de aceptación finales

La implementación estará completa cuando:

1. El patrón puede abrirse desde la pantalla inicial.
2. Existe una pantalla informativa.
3. La pregunta y las respuestas son fieles al manual.
4. No existen preguntas clínicas inventadas.
5. Rama A muestra cuatro categorías.
6. Rama B muestra ocho categorías.
7. Rama C está separada y controlada por validación.
8. Las pruebas corresponden a cada categoría.
9. Las tinciones no se muestran como pictogramas.
10. B.7 no afirma que no existan pruebas.
11. El resultado es diferencial, no diagnóstico.
12. No hay confianza porcentual.
13. No hay dosis ni pautas.
14. La concentración de clorhexidina se conserva.
15. El tratamiento conserva sus condicionales.
16. No hay imágenes clínicas falsas.
17. Las imágenes originales no se publican sin licencia.
18. La bibliografía se muestra de forma segura.
19. El modelo tiene trazabilidad.
20. El registro externo no rompe el arranque.
21. `bootstrap()` se ejecuta una vez.
22. Si los datos fallan, la tarjeta queda inactiva.
23. No hay contaminación entre motores.
24. La navegación permite volver y reiniciar.
25. El flujo funciona con teclado.
26. El contraste cumple 4.5:1.
27. El diseño funciona en móvil, tablet y escritorio.
28. Los patrones existentes siguen funcionando.
29. `stats.html` no falla.
30. La revisión veterinaria ha aprobado el contenido destinado a producción.

---

# 25. Decisiones pendientes antes de producción

## 25.1. Rama C

Debe aprobarla un veterinario. Hasta entonces:

- Implementada en entorno de validación.
- Desactivada o señalada como no validada en producción.

## 25.2. Imágenes

Confirmar por escrito:

- Derechos de publicación.
- Derecho de transformación a formatos web.
- Necesidad de atribución.
- Texto alternativo final.

## 25.3. Bibliografía

Confirmar:

- Que la URL sigue activa.
- Que el contenido es el esperado.
- Que puede enlazarse desde la web.

## 25.4. CTA de Ceva

Excluido por defecto. Para incorporarlo será necesario:

- Requisito comercial explícito.
- Separación visual del contenido clínico.
- Etiqueta “Información de producto”.
- Revisión médica, legal y de marca.
- Pruebas independientes.

---

# 26. Instrucción final para el agente

El agente debe:

1. Trabajar únicamente sobre la carpeta canónica.
2. Crear una copia de seguridad antes de modificar.
3. Implementar las fases en orden.
4. No resumir ni reinterpretar el contenido clínico.
5. No añadir preguntas ni secuencias de descarte.
6. No completar vacíos con conocimiento externo.
7. No publicar imágenes sin licencia.
8. Ejecutar todos los casos de prueba.
9. Entregar un informe final con:
   - Archivos modificados.
   - Funciones añadidas.
   - Pruebas ejecutadas.
   - Resultados.
   - Problemas pendientes.
   - Confirmación de que no se añadieron dosis.
   - Confirmación de que los patrones existentes siguen funcionando.
