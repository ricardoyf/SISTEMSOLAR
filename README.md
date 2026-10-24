# Órbita · Sistema solar didáctico

Explorador del sistema solar en español, desarrollado a partir de `Sol9.html` para aprender observando, comparando y razonando.

## Abrir

Abre **`index.html`** en un navegador moderno. El HTML contiene el código, los estilos, el motor 3D y las texturas procedurales: no necesita un servidor ni descargas externas para la experiencia. Los enlaces a NASA sí requieren internet.

La escena 3D requiere WebGL. Si el navegador no lo ofrece, las fichas, las comparaciones y las actividades siguen funcionando. En algunos móviles la aplicación de archivos previsualiza el HTML sin ejecutar JavaScript; abrir la versión de GitHub Pages con el navegador evita esa limitación.

## Qué incluye

- **Explorar:** Sol, ocho planetas y Luna; selección, seguimiento de cámara, zoom, vista cenital, pausa, nombres y órbitas configurables.
- **Tiempo:** velocidad expresada en días terrestres por segundo, periodos orbitales relativos reales y pausa de todos los movimientos temporales. El tiempo no avanza mientras la pestaña está oculta.
- **Fichas:** diámetro medio, periodo orbital, distancia y rotación; tres explicaciones y una pregunta por cuerpo, con fuente NASA.
- **Comparar tamaños:** dos cuerpos con el mismo factor de escala; relaciones de diámetro y volumen aproximado.
- **Comparar distancias:** escala lineal en UA y un modelo físico en el que el usuario decide a cuántos metros estará la Tierra del Sol.
- **Comparar años:** edad equivalente en cada planeta, calculada a partir de su duración orbital.
- **Aprender:** cuatro misiones, diez preguntas con explicaciones y un diccionario espacial.
- **Progreso:** misiones y mejor resultado guardados solo en el almacenamiento local del navegador, cuando está disponible.
- **Accesibilidad:** controles con nombres accesibles, navegación con teclado, foco visible, reducción de movimiento y diseño adaptable.

## Criterios científicos

La exploración 3D usa tamaños y distancias exagerados de forma distinta; órbitas circulares y coplanares; fases iniciales fijas e ilustrativas. No calcula las posiciones actuales. El comparador muestra las proporciones físicas por separado. Las texturas son ilustraciones procedurales, no fotografías ni mapas científicos. Las rotaciones rápidas pueden presentar aliasing visual al acelerar mucho el tiempo.

Los periodos orbitales y de rotación son sidéreos y aproximados. Para Venus se distingue entre rotación y día solar. La Luna gira de forma sincronizada con su órbita alrededor de la Tierra; no hereda el giro de la esfera terrestre. Los radios son medios volumétricos para mantener comparaciones coherentes. En el Sol la rotación es una referencia aproximada, porque presenta rotación diferencial.

Consulta [SOURCES.md](SOURCES.md) para valores, fuentes y limitaciones.

## Desarrollo

Requiere Node.js y npm. Las versiones de las herramientas están fijadas en `package-lock.json`.

```sh
npm ci
npm run check
npm run build
```

El resultado distribuible es `index.html`. `dist/index.html` es una copia de trabajo para previsualización, excluida de Git. No se necesita Node.js para abrir la versión ya construida.

| Archivo | Responsabilidad |
| --- | --- |
| `src/template.html` | Estructura, controles, ayuda y fuentes |
| `src/styles.css` | Diseño adaptable |
| `src/app.js` | Navegación, fichas, misiones y preguntas |
| `src/scene.js` | Renderizado y simulación 3D |
| `src/compare.js` | Comparadores de tamaño, distancia y años |
| `src/data.js` | Datos científicos y actividades |
| `build.mjs` | Empaquetado autónomo y comprobación del JavaScript resultante |
| `original/Sol9.html` | Versión original aportada, conservada como referencia |

## GitHub Pages

Este proyecto se publica desde la raíz de la rama `main`:

1. Subir el contenido a un repositorio público nuevo.
2. En **Settings → Pages**, elegir **Deploy from a branch**.
3. Seleccionar **main** y **/(root)**, y guardar.
4. Esperar a que GitHub confirme el despliegue y utilizar la dirección mostrada por Pages.

El archivo `.nojekyll` permite publicar el HTML estático directamente. No hay claves, servidor de aplicación ni base de datos. No se incluye una dirección de Pages hasta que exista un despliegue verificado.

## Comprobaciones de esta entrega

Se verificaron la sintaxis de los módulos y del JavaScript empaquetado, la integridad de los datos, las proporciones del comparador y la sincronización lunar. En navegador se recorrieron las comparaciones, las respuestas correctas e incorrectas de misiones y las diez preguntas hasta el resultado. Se comprobó el diseño a ancho de móvil y la conservación de las funciones no gráficas sin WebGL.

El navegador remoto utilizado para revisar esta entrega tiene WebGL desactivado: por eso la comprobación del motor 3D fue estática y matemática, y no constituye una validación visual de esa escena. Es recomendable confirmar su aspecto final en un equipo con WebGL antes de usarla en una actividad de aula.

## Créditos

Basado en el HTML `Sol9.html` aportado por el propietario del proyecto. Datos educativos: NASA Science y NASA NSSDCA, enlazados en las fichas. Three.js 0.157.0: licencia MIT, incluida en [THIRD_PARTY_LICENSES.txt](THIRD_PARTY_LICENSES.txt). Las nuevas texturas son dibujos generados por el código, sin fotografías remotas.

Revisión de contenido: 24 de octubre de 2026.
