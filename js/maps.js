//Inicializacion del objeto tipo mapa
var map = new GMaps({
    //busca con el id #map 
    el: '#map',   
    //el zoom que la persona tiene permitido hacer      
    zoom: 14, 
    //latitud del centro del mapa         
    lat: 9.9333296, 
    //longitu del centro del mapa    
    lng: -84.0833282,    
    //se añade el evento click y se referencia a la funcion addMarker
    click: addMarker   
});
//la funcion recibe un parametro
function addMarker(e) { 
    //se revisa la lista y solo va a permitir crear dos puntos                       
    if (map.markers.length <= 2) {  
        //en el caso que la lista este vacia se añade el punto inicial           
        if (map.markers.length == 0) {  
            //llama a la funcion del punto inicial        
            addStartPoint(e);                   
        }
        //Si la lista de puntos tiene solamente uno [1] se añade el punto final
        else if (map.markers.length == 1) {
            //llama a la funcion del punto inicial    
            addEndPoint(e);   
            //llama a la funcion que dibuja la ruta                  
            drawRoute();   
            //por ultimo calcula la ruta                    
            calculateDistance();              
        }
    }
}
//Se añade el punto inicial
function addStartPoint(e) {                     
    map.addMarker({ 
        //el objeto e que se paso por parametro trae la latitud y la longitud                            
        lat: e.latLng.lat(),                    
        lng: e.latLng.lng(),                    
        title: "Start Point",                  
        icon: {                                 
            path: google.maps.SymbolPath.CIRCLE,//icono
            scale: 5, //tamaño
            strokeColor: '#f00', //color del borde
            strokeWeight: 10
        }
    });
}
 //Se añade el punto final
function addEndPoint(e) {                      
    map.addMarker({    
        //el objeto e que se paso por parametro trae la latitud y la longitud
        lat: e.latLng.lat(),                  
        lng: e.latLng.lng(),                    
        title: "End Point",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,//icono
            scale: 5, //tamaño
            strokeColor: '#009975', //color del borde
            strokeWeight: 10
        }
    });
}
 //Se dibuja la ruta entre los dos puntos
function drawRoute() {  
    //En la lista de puntos se toma la posicion cero como el inicial y el 1 como final                       
    var start = map.markers[0].position;       
    var end = map.markers[1].position;   
    //llamada a funcion de Gmaps --> drawRoute      
    map.drawRoute({      
        //Se toma la lat y long del punto inicial                       
        origin: [start.lat(), start.lng()],   
        //Lo mismo con el punto final  
        destination: [end.lat(), end.lng()],   
        //el tipo de modo de traslado ya sea manejando o en bicicleta por ejemplo 
        travelMode: 'driving', 
        //se distengue por un color                
        strokeColor: '#131540',                 
        strokeOpacity: 0.6,
        strokeWeight: 6
    });
}

/*  Se calcula la distancia entre los 2 puntos tomando las coordenadas, 
    se toma la latitud y longitud del punto inicial y del punto final.
    Teniendo en cuenta que esta fórmula asume que la Tierra es completamente esférica.

     */
function calculateDistance() {
    var start = map.markers[0].position;
    var end = map.markers[1].position;
    var lat1 = 0, lat2 = 0, long1 = 0, lon2 = 0, dist = 0;
   
    lat1 = start.lat();
    lat2 = end.lat();
    lon1 = start.lng();
    lon2 = end.lng();
  
    
    if ((lat1 == lat2) && (lon1 == lon2)) {
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
    }
    //Ahora se muestra el resultado de la operacion en el html anteriormente prepado.
    $("#distancia").html("Distancia: " + Math.round(dist).toFixed(1) + "kilometros");
    $("#tiempo").html("Tiempo estimado : " + Math.round(dist * 5).toFixed(1) + "minutos");

}

/*Importante: El tiempo varia depende el transporte el trafico y otras condiciones mas.
En el ejemplo se suposo que el tiempo estandar por kilometro son 5 minutos pero numero no es exacto,
ya que tambien posee factores que lo alteran.
 */
