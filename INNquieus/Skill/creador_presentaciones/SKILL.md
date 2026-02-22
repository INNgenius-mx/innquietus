---
name: creador_presentaciones
description: Crea presentaciones de Google Slides impactantes y visuales a partir de blogs o documentos. Genera código de Apps Script para automatizar la creación.
---

# Habilidad: Creador de Presentaciones

Esta habilidad transforma contenido de texto (entradas de blog, documentos, notas) en presentaciones de Google Slides visualmente impactantes y "Premium".

## ¿Cuándo usar esta habilidad?
1.  Cuando el usuario pide crear una presentación basada en un texto, URL o archivo.
2.  Cuando se necesita convertir un documento técnico o extenso en un formato presentable y digerible.

## Flujo de Trabajo

### 1. Análisis y Estructuración
Lee el contenido proporcionado por el usuario. Identifica:
-   **Idea Central**: El mensaje principal de la presentación.
-   **Puntos Clave**: 3-5 ideas principales que soportan la idea central.
-   **Narrativa**: Estructura la información en una secuencia lógica (Introducción -> Problema -> Solución -> Beneficios -> Conclusión).

### 2. Diseño Visual (Concepto)
Define una dirección de arte antes de generar nada. Piensa como un diseñador gráfico:
-   **Paleta de Colores**: Elige colores modernos, complementarios y con buen contraste. Evita los colores predeterminados aburridos.
-   **Tipografía**: Selecciona fuentes legibles y modernas (ej. Montserrat, Roboto, Open Sans, Lato).
-   **Estilo Visual**: Minimalista, Corporativo Moderno, Tech, Bold, Elegant.

### 3. Generación de Diapositivas
Para cada diapositiva planificada, define:
-   **Título**: Corto e impactante.
-   **Cuerpo**: Texto mínimo. Usa bullets (máximo 4-5 líneas) o frases cortas.
-   **Notas del Orador**: El guion detallado de lo que se debe decir.
-   **Elementos Visuales**: Sugerencia de imágenes, iconos o formas geométricas.

### 4. Automatización con Apps Script
**IMPORTANTE**: No puedes crear la presentación directamente. Debes escribir un script de **Google Apps Script** que el usuario copiará y pegará para generar la presentación "mágicamente".

#### Instrucciones para el Script (.gs):
Tu salida final debe ser un bloque de código javascript/apps-script bien comentado.

El script debe:
1.  Crear una nueva presentación: `SlidesApp.create('Nombre Presentación')`.
2.  Definir un tema base (colores, fuentes).
3.  Crear diapositivas (`appendSlide`) insertando:
    -   Títulos (`shapes` o placeholders).
    -   Texto (`insertShape` o `insertTextBox`).
    -   Formas y fondos de color para dar diseño (`insertShape`).
4.  **No usar placeholders por defecto** si es posible, crea layouts personalizados usando formas rectangulares para fondos, barras laterales, etc., para que se vea "diseñado" y no una plantilla básica.

### Ejemplo de Estructura de Script Solicitado
```javascript
function crearPresentacionWow() {
  // 1. Crear Presentación
  var deck = SlidesApp.create("Título de la Presentación");
  var slides = deck.getSlides();
  slides[0].remove(); // Eliminar slide por defecto

  // 2. Definir Estilo
  var hexPrimary = "#2D3E50"; // Dark Blue
  var hexAccent = "#E74C3C";  // Red
  
  // 3. Función Helper para Slide de Título
  function createTitleSlide(title, subtitle) {
     var slide = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
     // Fondo
     slide.getBackground().setSolidFill(hexPrimary);
     // Texto
     var titleShape = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, 50, 200, 600, 100);
     titleShape.getText().setText(title).getDateTextStyle().setFontSize(48).setForegroundColor("#FFFFFF");
     titleShape.setBorderColor("#00000000"); // Sin borde
     titleShape.getFill().setSolidFill("#00000000"); // Transparente
  }

  // 4. Generar Slides (Ejecutar lógica)
  createTitleSlide("Innovación 2026", "Estrategia de Futuro");
  // ... más slides ...
  
  Logger.log("Presentación creada: " + deck.getUrl());
}
```

## Entregable al Usuario
1.  Presenta la **Estructura** (puntos clave).
2.  Entrega el **Código Apps Script** completo dentro de un bloque de código.
3.  Da instrucciones de cómo ejecutarlo:
    -   Ir a [script.google.com](https://script.google.com).
    -   Crear nuevo proyecto.
    -   Pegar código.
    -   Ejecutar función `crearPresentacion`.
    -   Revisar logs para ver la URL.
