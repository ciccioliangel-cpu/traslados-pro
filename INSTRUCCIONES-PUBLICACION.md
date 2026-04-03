# TRASLADOS PRO — Guía de publicación en Netlify
## De cero a una URL real en 10 minutos

---

## LO QUE VAS A TENER AL FINAL

Una URL tipo: **https://traslados-pro.netlify.app**
- Accesible desde cualquier navegador, celular o PC
- Admin entra con: admin / admin123
- Choferes entran con su usuario/contraseña
- Los datos se guardan en el navegador de cada usuario (localStorage)

---

## PASO 1 — Crear cuenta en GitHub (2 min)

1. Ir a https://github.com
2. Click en "Sign up"
3. Completar: username, email, contraseña
4. Verificar el email que te llega

---

## PASO 2 — Crear el repositorio y subir los archivos (3 min)

1. En GitHub, click en el botón verde **"New"** (arriba a la izquierda)
2. En "Repository name" escribir: `traslados-pro`
3. Dejarlo en **Public**
4. Click en **"Create repository"**

Ahora subir los archivos:

5. Click en **"uploading an existing file"** (link en el centro de la página)
6. Arrastrá TODOS los archivos de la carpeta `traslados-pro` que descargaste
   - package.json
   - vite.config.js
   - index.html
   - netlify.toml
   - .gitignore
   - carpeta `src/` con App.jsx y main.jsx
   - carpeta `public/` con favicon.svg
7. Click en **"Commit changes"** (botón verde abajo)

---

## PASO 3 — Crear cuenta en Netlify (2 min)

1. Ir a https://netlify.com
2. Click en **"Sign up"**
3. Elegir **"Sign up with GitHub"** (se conecta automáticamente)
4. Autorizar Netlify a acceder a tu GitHub

---

## PASO 4 — Publicar el sitio (3 min)

1. En el dashboard de Netlify, click en **"Add new site"**
2. Click en **"Import an existing project"**
3. Click en **"Deploy with GitHub"**
4. Seleccionar el repositorio **traslados-pro**
5. En la configuración del build:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click en **"Deploy site"**

Netlify va a construir el proyecto (tarda 1-2 minutos la primera vez).

---

## PASO 5 — Personalizar tu URL (opcional)

Por defecto Netlify te da algo como `amazing-goldfish-123.netlify.app`.

Para cambiarlo:
1. En el dashboard de tu sitio → click en **"Site configuration"**
2. Click en **"Change site name"**
3. Escribir: `traslados-pro` (o el nombre que prefieras)
4. Tu URL queda: `https://traslados-pro.netlify.app`

---

## CREDENCIALES DE ACCESO INICIALES

### Administrador
- Usuario: `admin`
- Contraseña: `admin123`
- ⚠️ Cambiala desde el panel de Usuarios apenas entres

### Choferes demo (para probar)
- `carlos.mendez` / chofer123
- `roberto.silva` / chofer456
- `ana.gonzalez` / chofer789

---

## IMPORTANTE — Sobre los datos

Los datos (reservas, choferes, pagos) se guardan en el **localStorage del navegador** de cada usuario. Esto significa:

✅ Funciona perfectamente para empezar sin costo
✅ Cada admin tiene sus datos en su navegador
⚠️ Si abrís desde otro navegador o dispositivo, los datos no se sincronizan

**Para el futuro:** cuando quieras que los datos sean compartidos entre dispositivos (ej: vos en la PC y un empleado en otro celular), el próximo paso es agregar una base de datos real como **Supabase** (gratuita hasta cierto volumen). Avisame cuando llegues a ese punto.

---

## ACTUALIZAR LA PLATAFORMA EN EL FUTURO

Cuando quieras agregar funcionalidades:

1. Descargás el nuevo `App.jsx` de Claude
2. Lo reemplazás en GitHub (mismo repositorio, mismo archivo)
3. Netlify re-publica automáticamente en 1-2 minutos

---

## SOPORTE

Si algo no funciona en el proceso de publicación, mandame el mensaje de error exacto y lo resolvemos.
