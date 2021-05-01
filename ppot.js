var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');

var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
	var camino='public'+objetourl.pathname;
	if (camino=='public/')
		camino='public/index.html';
	encaminar(pedido,respuesta,camino);
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});


function encaminar (pedido,respuesta,camino) {
	console.log(camino);
	switch (camino) {
		case 'public/recuperardatos': {
			recuperar(pedido,respuesta);
			break;
		}	
	    default : {  
			fs.exists(camino,function(existe){
				if (existe) {
					fs.readFile(camino,function(error,contenido){
						if (error) {
							respuesta.writeHead(500, {'Content-Type': 'text/plain'});
							respuesta.write('Error interno');
							respuesta.end();					
						} else {
							var vec = camino.split('.');
							var extension=vec[vec.length-1];
							var mimearchivo=mime[extension];
							respuesta.writeHead(200, {'Content-Type': mimearchivo});
							respuesta.write(contenido);
							respuesta.end();
						}
					});
				} else {
					respuesta.writeHead(404, {'Content-Type': 'text/html'});
					respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
					respuesta.end();
				}
			});	
		}
	}	
}


function recuperar(pedido,respuesta) {
    var info = '';
    pedido.on('data', function(datosparciales){
         info += datosparciales;
    });
    pedido.on('end', function(){
        var formulario = querystring.parse(info);
		respuesta.writeHead(200, {'Content-Type': 'text/html'});
        var opcion = 0;
        if (formulario['numero'] == "piedra") {
            opcion = 1;
        }
        else{
            if (formulario['numero'] == "papel") {
                opcion = 2;
            }
            else{
                if (formulario['numero'] == "tijera") {
                    opcion = 3;
                }
            }
        }
		var pagina='<!doctype html><html><head></head><body>'+
					'Resultado:'+'<br>'+
					usuario(opcion)+'<br>'+
					'<a href="index.html">Volver</a>'+
					'</body></html>';
		respuesta.end(pagina);
    });	
}
var opciones = [1, 2, 3];
var eleccionServer;

function aleatorio(minimo, maximo){
    var numero = Math.floor(Math.random() * (maximo - minimo +2) + minimo);
    return numero;
}

function usuario(opcion){
    var eleccionJugador = opcion;
    eleccionServer = aleatorio(1,3);
    var mensaje = "";

    if(eleccionJugador == 1)
    {
        if(opciones[eleccionServer] == 2)
        {
            mensaje +="¡Perdiste! La maquina eligio papel y vos piedra.";
        }else{
            if(opciones[eleccionServer] == 3){
                mensaje +="¡Ganaste! La maquina eligio tijera y vos piedra.";
            }else{
                if(opciones[eleccionServer] == 1){
                    mensaje +="¡Empate! Ambos eligieron piedra.";
                }
            }
        } 
    }

    if(eleccionJugador == 2)
    {
        if(opciones[eleccionServer] == 3)
        {
            mensaje +="¡Perdiste! La maquina eligio tijera y vos papel.";
        }else{
            if(opciones[eleccionServer] == 1){
                mensaje +="¡Ganaste! La maquina eligio piedra y vos papel.";
                
            }else{
                if(opciones[eleccionServer] == 2){
                    mensaje +="¡Empate! Ambos eligieron papel."; 
                }
            }
        }
    }

    if(eleccionJugador == 3) 
    { 
        if(opciones[eleccionServer] == 2)
        {
            mensaje +="¡Ganaste! La maquina eligio papel y vos tijera.";
        
        }else{
            if(opciones[eleccionServer] == 1){
                mensaje +="¡Perdiste! La maquina eligio piedra y vos tijera."; 
            }else{
                if(opciones[eleccionServer] == 3) {
                    mensaje +="¡Empate! Ambos eligieron tijera.";
                }
            }
        }
    }
    return mensaje;
}
console.log('Servidor web iniciado');