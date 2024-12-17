// inicializo el mapa
let map=L.map('mapa');

let marker = ''

navigator.geolocation.getCurrentPosition( (p) =>{
	// console.log(p)
	// obtengo la posicion actual
	const coords = [p.coords.latitude, p.coords.longitude]

	// console.log(coords)

	// muestro una posicion
	map.setView(coords,12);
},(e)=>{
	// muestro una posicion
	map.setView([-34.9964963, -64.9672817],5);
})	

// agrego las licencias
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
	
L.control.scale().addTo(map);

// funcion para marcar ubicacion
function marcarMapa(lat, lon){
	if (marker) {
		marker.remove()
	}

	// coloca el marcador en el mapa
	marker = L.marker([lat, lon]).addTo(map);

	// muestra la posicion del marcador
	map.setView([lat, lon], 16)
}