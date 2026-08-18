# HC-009 · Sistema tipográfico de Hilo Cofrade

**Estado:** APROBADA  
**Área:** Diseño / Identidad / UX  
**Ámbito:** Interfaz pública y privada de Hilo Cofrade

---

## Decisión

Se establece **Open Sans como tipografía principal y de referencia de Hilo Cofrade** para toda la interfaz pública y privada del proyecto.

Debe utilizarse de forma coherente en:

- Home.
- Directorios.
- Fichas de Hermandades.
- Fichas de Imágenes.
- Fichas de Pasos.
- Fichas de Bandas.
- Futuras fichas de Autores.
- Futuras fichas de Marchas.
- Buscador / Tira del hilo.
- Agenda.
- Módulos editoriales.
- Panel de control.
- Formularios.
- Navegación.
- Cualquier nuevo componente público o privado.

La intención no es generar personalidad mediante la mezcla de varias familias tipográficas. La personalidad de Hilo Cofrade debe surgir del **uso consistente de Open Sans**, de una jerarquía fuerte, de los pesos, del espaciado, del color y de los elementos gráficos propios del proyecto.

---

## Objetivo visual

La tipografía debe transmitir:

**modernidad + funcionalidad + claridad + rigor documental + facilidad de lectura.**

Hilo Cofrade debe sentirse como un producto digital contemporáneo y una base de conocimiento navegable, no como una web cofrade clásica basada en serifas ornamentales.

La referencia estética más cercana dentro del propio proyecto es el **Panel de control**, especialmente en sus titulares: sans serif, compactos, contundentes y con `letter-spacing` negativo.

La web pública no debe parecer un panel administrativo, pero sí debe compartir con él **la misma disciplina tipográfica y visual**.

---

## Familia tipográfica

**Principal y única familia recomendada: Open Sans.**

Pesos permitidos:

- `400` · Regular.
- `600` · SemiBold.
- `700` · Bold.
- `800` · ExtraBold.

Evitar introducir nuevas familias como Poppins, Montserrat, Inter u otras salvo que en el futuro exista una necesidad de identidad claramente justificada y aprobada mediante una nueva decisión HC.

También debe retirarse progresivamente **Georgia** de los nuevos diseños y de las zonas públicas donde todavía se utilice como titular.

---

# Jerarquía tipográfica

## H1 · Grandes titulares

Ejemplos:

- Todo en las cofradías está conectado.
- Hermandad del Baratillo.
- Las Cigarreras.

```css
font-family: 'Open Sans', sans-serif;
font-weight: 800;
font-size: clamp(42px, 5vw, 58px);
line-height: 1.02;
letter-spacing: -0.045em;
```

Color habitual:

```css
color: #0f2742;
```

En fondos oscuros: blanco.

---

## H2 · Títulos principales de sección

Ejemplos:

- Hoy en Hilo Cofrade.
- Hermandades.
- Próximas salidas extraordinarias.

```css
font-weight: 800;
font-size: clamp(30px, 4vw, 40px);
line-height: 1.05;
letter-spacing: -0.035em;
```

---

## H3 · Titulares de tarjetas y módulos

Ejemplos:

- Nuestra Señora de la Piedad.
- Acompañamiento histórico.
- Plegaria a la Virgen de la Asunción.

```css
font-weight: 700;
font-size: 21px;
line-height: 1.15;
letter-spacing: -0.025em;
```

Rango recomendado: `21px–26px`.

---

## Entradillas / texto destacado

```css
font-weight: 400;
font-size: 18px;
line-height: 1.55;
```

Rango recomendado: `17px–19px`.

Deben utilizarse para explicar una ficha o sección, no como texto decorativo.

---

## Texto general

```css
font-weight: 400;
font-size: 16px;
line-height: 1.6;
```

Rango recomendado: `15px–16px`.

### Textos largos

```css
font-size: 17px;
line-height: 1.7;
max-width: 760px;
```

Debe evitarse que los párrafos ocupen líneas excesivamente largas.

---

## Datos importantes

Fechas, años, cifras, periodos, posiciones o valores especialmente relevantes:

```css
font-weight: 700;
font-size: 16px;
letter-spacing: -0.015em;
```

Rango recomendado: `14px–18px`.

Los números pueden convertirse en un recurso visual característico de Hilo Cofrade.

Ejemplos:

**1993—2003**  
Acompañamiento histórico.

**2.292**  
nazarenos · 2026.

**15 AGO**  
Salida extraordinaria.

---

## Metadatos

Ejemplos:

- Hermandad · Localidad.
- Autor · Fecha.
- Banda · Paso.

```css
font-weight: 600;
font-size: 12px;
line-height: 1.4;
color: #68788a;
```

Rango recomendado: `12px–13px`.

---

## Eyebrows / etiquetas de sección

Ejemplos:

- ENCICLOPEDIA.
- HOY EN HILO COFRADE.
- ACOMPAÑAMIENTO HISTÓRICO.
- PATRIMONIO.

```css
font-weight: 800;
font-size: 10px;
letter-spacing: 0.16em;
text-transform: uppercase;
color: #b71f37;
```

Rango recomendado:

- Tamaño: `10px–11px`.
- Tracking: `0.14em–0.16em`.

Este elemento debe funcionar como una firma visual recurrente de Hilo Cofrade.

---

## Botones y llamadas a la acción

```css
font-weight: 700;
font-size: 13px;
```

Rango recomendado: `13px–14px`.

Evitar el uso sistemático de mayúsculas.

Ejemplos:

- Explorar ficha.
- Seguir el hilo.
- Ver todas.
- Proponer información.

---

# Regla de jerarquía de información

En cualquier tarjeta o ficha debe poder entenderse la información en varios niveles de lectura.

Ejemplo:

```text
Nuestra Señora de la Piedad
Hermandad del Baratillo · Sevilla
Anónima · siglo XVII
```

Tratamiento:

- Nombre → `700/800`.
- Relación principal → `600`.
- Dato documental → `400`.

No debe ponerse toda la información en negrita.

La jerarquía debe permitir recorrer visualmente una ficha sin necesidad de leer cada línea.

---

# Identidad visual asociada

El sistema tipográfico debe convivir con la identidad actual de Hilo Cofrade:

```text
Azul marino     #0f2742
Azul principal #123a67
Rojo            #b71f37
Fondo suave     #f3f7fa
Líneas          #dfe7ef
Blanco          #ffffff
```

La personalidad del proyecto debe construirse mediante:

```text
Open Sans
+
azul marino
+
rojo
+
espacios amplios
+
líneas finas
+
concepto gráfico de hilo/nodo
+
datos y relaciones
```

No mediante ornamentación cofrade tradicional.

---

# Aplicación específica en Home

La futura revisión de la Home debe utilizar este sistema como criterio principal.

El cambio tipográfico debe provocar que la Home se acerque visualmente al Panel sin copiar su estructura administrativa.

Especialmente:

- **Hoy en Hilo Cofrade** debe usar Open Sans 800 y abandonar Georgia.
- **Tira del hilo** debe tener una jerarquía limpia, tecnológica y de producto.
- Las entradas Hermandades, Imágenes, Pasos, Bandas, Autores y Marchas deben utilizar la misma jerarquía tipográfica.

Los módulos:

- Dato Cofrade.
- Curiosidad.
- Efeméride.
- Marcha del día.
- Próximas salidas extraordinarias.

deben conservar personalidad editorial, pero utilizando la misma familia tipográfica.

---

# Aplicación en fichas

La nueva regla debe afectar progresivamente a:

- Hermandades.
- Imágenes.
- Pasos.
- Bandas.
- Autores.
- Marchas.
- Patrimonio.
- Acontecimientos.
- Salidas.
- Cultos.

Los nombres de entidades deben ser el principal elemento visual.

Las relaciones deben ocupar un segundo nivel.

Los detalles documentales, fechas y fuentes deben ocupar niveles inferiores y nunca competir con el nombre principal.

---

# Regla de accesibilidad y lectura

La prioridad siempre será **legibilidad antes que densidad**.

Evitar:

- Textos generales por debajo de `14px`.
- Interlineados muy cerrados.
- Párrafos excesivamente anchos.
- Exceso de negritas.
- Contraste insuficiente.
- Uso ornamental de mayúsculas.

Para contenidos de lectura prolongada:

```css
font-size: 16px;
line-height: 1.7;
max-width: 760px;
```

Se podrá aumentar a `17px` cuando el contexto editorial lo justifique.

---

# Regla técnica

Open Sans debe cargarse de manera **global y centralizada**, no definirla manualmente componente por componente.

Actualmente el proyecto dispone del paquete:

```text
@fontsource/open-sans
```

Debe aprovecharse como fuente oficial del producto.

Objetivo:

```css
body {
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;
}
```

Los componentes nuevos no deben declarar Georgia ni otra familia salvo una excepción deliberadamente aprobada.

---

# Tokens tipográficos recomendados

Se recomienda centralizar la jerarquía mediante variables CSS para evitar valores aislados.

```css
:root {
  --font-sans: 'Open Sans', Arial, Helvetica, sans-serif;

  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  --tracking-display: -0.045em;
  --tracking-heading: -0.035em;
  --tracking-card: -0.025em;
  --tracking-data: -0.015em;
  --tracking-eyebrow: 0.16em;

  --line-display: 1.02;
  --line-heading: 1.05;
  --line-card: 1.15;
  --line-body: 1.6;
  --line-reading: 1.7;
}
```

---

# Principio de diseño

La personalidad moderna de Hilo Cofrade no debe proceder de añadir muchas fuentes, iconos o efectos.

Debe proceder de:

**buena tipografía + relaciones claras + datos bien jerarquizados + espacios + una identidad cromática consistente.**

La referencia conceptual es:

> **Una enciclopedia digital contemporánea, no una web cofrade tradicional.**

Y el principio que debe gobernar cualquier nueva pantalla sigue siendo:

> **Hilo Cofrade no es una web de fichas. Es una base de conocimiento cofrade navegable.**

---

# Criterios de aceptación

- [ ] Open Sans pasa a ser la tipografía principal global.
- [ ] Se utilizan únicamente los pesos `400`, `600`, `700` y `800`.
- [ ] Georgia deja de utilizarse en nuevos componentes.
- [ ] Los titulares públicos se alinean visualmente con la contundencia tipográfica del Panel.
- [ ] H1 y H2 usan tracking negativo.
- [ ] Las etiquetas pequeñas usan mayúsculas y tracking amplio.
- [ ] Los textos generales priorizan lectura sobre densidad.
- [ ] Home, fichas, directorios y Panel deben sentirse como partes del mismo producto.
- [ ] No se introduce una segunda familia tipográfica sin una nueva decisión HC.
- [ ] La migración tipográfica se realiza progresivamente para evitar regresiones visuales.
- [ ] La carga de Open Sans queda centralizada.
- [ ] Los nuevos componentes reutilizan tokens tipográficos comunes.

---

# Impacto esperado

Esta decisión busca conseguir que Hilo Cofrade tenga una identidad reconocible basada en:

- claridad;
- jerarquía;
- lectura;
- consistencia;
- modernidad;
- navegación de relaciones.

No se trata únicamente de cambiar una fuente, sino de establecer un **sistema tipográfico común para todo el producto**.
