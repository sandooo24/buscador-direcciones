

$(document).ready(function() {
	// busca localidades
	$('#l').on('keyup', function(){
		var busqueda=$(this).val();

		if (busqueda) {
			let data={
				provincia: $('#p').val(),
				nombre: busqueda,
			}

			georefApi('localidades',data).then( response => {
				// almacena las localidades
				let localidades = response.localidades

				// alamcena solo los nombres de la localidades
				let namesL = localidades.map(item=> `${item.nombre} - ${item.municipio.nombre}`)

				// muestra un autocompletado de las localidades
				$('#l').autocomplete({
					source: namesL,
				})

			})	
		}
	})

	$('#d').on('keyup', function(){
		var busqueda=$(this).val();

		if (busqueda) {
			let data={
				provincia: $('#p').val(),
				direccion: busqueda,
				max: 10,
			}

			georefApi('direcciones',data).then( response => {
				// almacena las direcciones
				let direcciones = response.direcciones
				// console.log(response)
				
				// alamcena solo los nombres de la direcciones
				let namesL = direcciones.map(item=> `${item.nomenclatura}`)

				// muestra un autocompletado de las direcciones
				$('#d').autocomplete({
					source: namesL,
				})

			})	
		}
	})
})

form_element.addEventListener('submit', e => {
	e.preventDefault()

	const form = Object.fromEntries(new FormData(e.target))

	console.log(form)
	let options={
		provincia: $('#p').val(),
		direccion: $('#d').val(),

	}
	georefApi('direcciones',options).then(response=>{
		let data = response.direcciones[0]

		console.log(data)
		let ubicacion = data.ubicacion
		// console.log(ubicacion)

		marcarMapa(ubicacion.lat, ubicacion.lon)
	})
})

const georefApi = async(option,datos) =>{
	const info={
		url: `https://apis.datos.gob.ar/georef/api/${option}`,
		type: 'GET',
		data: datos,
	}

	const response = await $.ajax(info)

	return response;
}


georefApi('provincias',{ orden: "nombre" }).then( response => {

	// almacena las provincias
	let provincias = response.provincias

	// alamcena solo los nombres de la provincias
	provincias.map(item=> {
		$('#p').append(`<option value="${item.nombre}">${item.nombre}</option>`) 
	})

})