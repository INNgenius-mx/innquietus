---
name: creador_de_habilidades
description: Asistente experto para la creación de nuevas habilidades en el proyecto. Utilízalo cuando necesites crear, estructurar o documentar una nueva habilidad para el agente.
---

# Habilidad: Creador de Habilidades

Esta habilidad guía al agente en el proceso de creación de nuevas habilidades para el proyecto Antigravity, asegurando consistencia, claridad y utilidad.

## ¿Cuándo usar esta habilidad?
Utiliza esta habilidad siempre que:
1.  El usuario solicite explícitamente crear una nueva habilidad.
2.  Identifiques una tarea repetitiva o compleja que se beneficiaría de tener un procedimiento estandarizado (proactividad).

## Flujo de Trabajo

### 1. Definición y Planificación
Antes de escribir cualquier archivo, define claramente:
-   **Nombre de la habilidad**: Debe ser corto, descriptivo y en `snake_case` (ej. `review_codigo`, `deploy_prod`).
-   **Propósito**: ¿Qué problema resuelve?
-   **Entradas**: ¿Qué información necesita el agente para empezar?
-   **Acciones**: ¿Qué pasos debe seguir el agente?

### 2. Estructura de Archivos
Toda habilidad debe residir en su propio directorio dentro de `.skills/`.
Estructura obligatoria:
```text
.skills/
└── [nombre_habilidad]/
    ├── SKILL.md       (Obligatorio: Instrucciones principales)
    ├── scripts/       (Opcional: Scripts de soporte)
    └── templates/     (Opcional: Plantillas de archivos)
```

### 3. Creación del archivo `SKILL.md`
El archivo `SKILL.md` es el cerebro de la habilidad. Debe seguir estrictamente este formato:

#### Frontmatter (YAML)
```yaml
---
name: [nombre_habilidad]
description: [Descripción breve (1-2 frases) de qué hace y CUÁNDO debe usarla el agente]
---
```

#### Contenido (Markdown)
El cuerpo del archivo debe contener instrucciones claras y paso a paso.
-   Usa encabezados (`#`, `##`) para organizar las secciones.
-   Secciones recomendadas:
    -   `# [Nombre Habilidad]`
    -   `## Descripción`
    -   `## Instrucciones Paso a Paso`
    -   `## Mejores Prácticas`
    -   `## Ejemplos`

### 4. Implementación
Usa las herramientas del agente (`run_command`, `write_to_file`) para:
1.  Crear el directorio: `mkdir -p .skills/[nombre_habilidad]`
2.  Crear el archivo `SKILL.md` con el contenido definido.

### 5. Verificación
Una vez creada la habilidad:
1.  Verifica que los archivos existan en la ubicación correcta.
2.  Informa al usuario que la habilidad está lista para usarse.

## Consejos para Redactar Instrucciones de Habilidades
-   **Sé imperativo**: "Haz X", "Ejecuta Y".
-   **Sé explícito**: No asumas conocimiento previo. Si hay que ejecutar un comando con flags específicos, documéntalo.
-   **Modulariza**: Si la habilidad es muy compleja, divídela en pasos o sub-tareas.
-   **Contexto**: Explica *por qué* se hace algo si no es obvio.

## Ejemplo de Plantilla `SKILL.md`

```markdown
---
name: ejemplo_habilidad
description: Descripción corta para el router del agente.
---

# Habilidad de Ejemplo

Instrucciones generales sobre esta habilidad.

## Pasos
1. Paso uno.
2. Paso dos.

## Comandos Útiles
\`\`\`bash
echo "Hola mundo"
\`\`\`
```
