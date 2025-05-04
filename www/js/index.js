document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova está inicializado
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    
    // Inicializar la aplicación
    app.initialize();
    
    // Mensaje de bienvenida
    setTimeout(function() {
        showToast('¡Aplicación lista! Puedes comenzar a capturar fotos.');
    }, 500);
}

function showToast(message) {
    if (navigator.notification && navigator.notification.toast) {
        navigator.notification.toast(message, 'short', 'bottom', null);
    } else {
        // Crear un toast personalizado si no está disponible el nativo
        var toast = document.createElement('div');
        toast.className = 'custom-toast animate-fade';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.classList.add('show');
            setTimeout(function() {
                toast.classList.remove('show');
                setTimeout(function() {
                    document.body.removeChild(toast);
                }, 300);
            }, 2000);
        }, 100);
    }
}

var app = {
    // Almacenar datos de la imagen temporalmente
    imageData: null,
    
    initialize: function() {
        this.bindEvents();
        console.log('App initialized');
        
        // Detectar si estamos en navegador o dispositivo
        this.isBrowser = (cordova.platformId === 'browser');
        console.log('Running on platform: ' + cordova.platformId);
        
        // Si estamos en navegador, inicializar cámara web alternativa
        if (this.isBrowser) {
            this.initWebcam();
        }
    },
   
    bindEvents: function() {
        var takePhoto = document.getElementById('takePhoto');
        takePhoto.addEventListener('click', app.takePhoto, false);
        var sendPhoto = document.getElementById('sendPhoto');
        sendPhoto.addEventListener('click', app.sendPhoto, false);
        console.log('Events bound');
    },
    
    initWebcam: function() {
        // Crear elementos para la webcam (aparecerán solo cuando se active)
        var webcamContainer = document.createElement('div');
        webcamContainer.id = 'webcam-container';
        webcamContainer.className = 'webcam-container';
        
        var video = document.createElement('video');
        video.id = 'webcam-video';
        video.className = 'webcam-video';
        video.autoplay = true;
        
        var captureBtn = document.createElement('button');
        captureBtn.id = 'webcam-capture';
        captureBtn.className = 'btn btn-light webcam-btn';
        captureBtn.innerHTML = '<i class="fas fa-camera"></i>';
        
        var closeBtn = document.createElement('button');
        closeBtn.id = 'webcam-close';
        closeBtn.className = 'btn btn-danger webcam-close-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        // Añadir canvas para capturar la imagen
        var canvas = document.createElement('canvas');
        canvas.id = 'webcam-canvas';
        canvas.style.display = 'none';
        
        webcamContainer.appendChild(video);
        webcamContainer.appendChild(captureBtn);
        webcamContainer.appendChild(closeBtn);
        webcamContainer.appendChild(canvas);
        
        document.body.appendChild(webcamContainer);
        
        // Añadir eventos
        captureBtn.addEventListener('click', this.captureWebcam);
        closeBtn.addEventListener('click', this.closeWebcam);
    },
    
    showWebcam: function() {
        var container = document.getElementById('webcam-container');
        var video = document.getElementById('webcam-video');
        
        // Mostrar el contenedor
        container.style.display = 'flex';
        setTimeout(function() {
            container.classList.add('show');
        }, 10);
        
        // Iniciar la webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                app.webcamStream = stream;
            })
            .catch(function(error) {
                console.error('Error accessing webcam:', error);
                app.closeWebcam();
                alert('No se pudo acceder a la cámara web: ' + error.message);
            });
    },
    
    captureWebcam: function() {
        var video = document.getElementById('webcam-video');
        var canvas = document.getElementById('webcam-canvas');
        
        // Configurar el tamaño del canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dibujar el fotograma actual en el canvas
        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertir la imagen a base64
        var imageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        
        // Procesar la imagen
        app.closeWebcam();
        app.onPhotoDataSuccess(imageData);
    },
    
    closeWebcam: function() {
        var container = document.getElementById('webcam-container');
        
        // Detener la transmisión de la webcam
        if (app.webcamStream) {
            app.webcamStream.getTracks().forEach(function(track) {
                track.stop();
            });
        }
        
        // Ocultar el contenedor
        container.classList.remove('show');
        setTimeout(function() {
            container.style.display = 'none';
        }, 300);
    },

    sendPhoto: function() {
        // Mostrar animación de carga
        var sendBtn = document.getElementById('sendPhoto');
        var originalContent = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        sendBtn.disabled = true;
        
        // Simular el envío (aquí se conectaría con tu servidor)
        setTimeout(function() {
            // Restaurar el botón y mostrar mensaje de éxito
            sendBtn.innerHTML = originalContent;
            sendBtn.disabled = false;
            
            // Mostrar mensaje de éxito
            if (navigator.notification && navigator.notification.alert) {
                navigator.notification.alert(
                    'Tu foto ha sido enviada con éxito',
                    null,
                    'Envío completado',
                    'Aceptar'
                );
            } else {
                showSuccessMessage('¡Foto enviada con éxito!');
            }
        }, 2000);
    },

    takePhoto: function() {
        console.log('Taking photo');
        
        // Si estamos en el navegador, usar nuestra interfaz personalizada
        if (app.isBrowser) {
            app.showWebcam();
            return;
        }
        
        // En dispositivos, verificar si el plugin de cámara está disponible
        if (!navigator.camera) {
            alert("El plugin de cámara no está disponible");
            return;
        }
        
        // Opciones de cámara mejoradas
        const options = { 
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        
        navigator.camera.getPicture(app.onPhotoDataSuccess, app.onFail, options);
    },

    onPhotoDataSuccess: function(imageData) {
        console.log('Photo data received successfully');
        
        // Guardar los datos de la imagen
        app.imageData = imageData;
        
        var photo = document.getElementById('photo');
        if (!photo) {
            console.error('Photo element not found');
            return;
        }

        // Añadir efecto de carga a la imagen
        photo.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
        photo.style.display = 'block';
        
        // Crear imagen temporal para precargar
        var tempImg = new Image();
        tempImg.onload = function() {
            // Una vez cargada, mostrar con animación
            photo.src = this.src;
            photo.classList.add('animate-fade');
            
            // Mostrar el botón de enviar con animación
            var sendPhoto = document.getElementById('sendPhoto');
            if (sendPhoto) {
                sendPhoto.style.display = 'flex';
                sendPhoto.classList.add('animate-fade');
            }
            
            // Mostrar mensaje de éxito
            showToast('¡Imagen capturada con éxito!');
        };
        tempImg.src = "data:image/jpeg;base64," + imageData;
    },

    onFail: function(message) {
        console.error('Camera error: ' + message);
        
        if (navigator.notification && navigator.notification.alert) {
            navigator.notification.alert(
                'Error: ' + message,
                null,
                'Error de cámara',
                'Cerrar'
            );
        } else {
            alert('Error al capturar la imagen: ' + message);
        }
    }
};

function showSuccessMessage(message) {
    // Crear un elemento para el mensaje
    var msgElement = document.createElement('div');
    msgElement.className = 'success-message animate-fade';
    msgElement.innerHTML = '<i class="fas fa-check-circle"></i> ' + message;
    
    // Añadir al DOM
    document.body.appendChild(msgElement);
    
    // Eliminar después de un tiempo
    setTimeout(function() {
        msgElement.classList.add('hide');
        setTimeout(function() {
            document.body.removeChild(msgElement);
        }, 500);
    }, 3000);
}