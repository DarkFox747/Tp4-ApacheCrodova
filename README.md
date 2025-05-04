# TP N.º 4 - Prueba de plugin de cámara con Apache Cordova

## 📱 Descripción

Este trabajo práctico forma parte de la materia **Programación Cliente-Servidor** y fue realizado por el alumno **Diego Soler**.  
El objetivo principal fue realizar una prueba de integración con Apache Cordova para evaluar el funcionamiento del plugin `cordova-plugin-camera`.

La aplicación desarrollada permite:

- Acceder a la cámara del dispositivo (por ejemplo, la laptop).
- Capturar una fotografía.
- Simular el envío de la imagen a un servidor.
- Visualizar alertas en caso de éxito o fallo.

## 🔧 Tecnologías utilizadas

- NodeJS (v0.10.24 o superior)
- Apache Cordova (v10.0.0 o superior)
- HTML, CSS y JavaScript
- Plugin: `cordova-plugin-camera`

## 🧩 Estructura del proyecto

- `index.html`: Interfaz de usuario con botones para capturar y enviar la foto.
- `index.js`: Lógica de interacción con la cámara y manejo de eventos.
- `index.css`: Estilos personalizados para mejorar la apariencia visual de la aplicación.

## 🎨 Personalización

Se realizaron modificaciones libres en el archivo CSS para mejorar la estética general de la pantalla:  
colores, tipografía, fondo, visibilidad condicional de botones e imagen.

## 🚀 Ejecución del proyecto

1. Crear el proyecto Cordova:
   cordova create mytestapp y 
   cd mytestapp
   
2. Instalar el plugin de cámara: cordova plugin add cordova-plugin-camera
   
3. Reemplazar los archivos `index.html`, `index.js` e `index.css` con los contenidos provistos o modificados.

4. Compilar y ejecutar en el navegador:
  cordova build y 
  cordova run browser

---

Trabajo realizado por **Diego Soler** – Materia: **Programación Cliente-Servidor**
