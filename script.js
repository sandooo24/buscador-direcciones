let DIRECCIONES = []// Almacenara las ubicaciones

/**
 * 
 * Evento cuando escribe la direccion á buscar
 * 
 * */
input_dir.addEventListener('keyup', async e => {
	let busqueda = e.target.value

	if (busqueda) {
		// paramatros de la peticion a la api
		const optionsRequest = new URLSearchParams({
			provincia: select_pro.value,
			direccion: busqueda,
			max: 10,
		}).toString()

		// peticion a la api
		const { direcciones } = await georefApi(`direcciones?${optionsRequest}`)

		showResultsSearch(direcciones)

		return
	}

	search_results.innerHTML='<option value="nada" selected disabled>No se encontraron resultados</option>'
})

/**
 * 
 * Muestra las direcciones buscadas 
 * 
 * */
function showResultsSearch(direcciones) {
	// console.log(direcciones)
	search_results.innerHTML=''

	// si no se encontraron direcciones 
	if (direcciones=='') {
		search_results.innerHTML='<option value="nada" selected disabled>No se encontraron resultados</option>'
		return// termina la ejcucion
	}

	DIRECCIONES = []

	// console.log(direcciones)
	direcciones.map( (col,ind) => {
		DIRECCIONES.push(col)

		let option = document.createElement('option')
		option.innerHTML = col.nomenclatura.toLowerCase()
		option.value = ind+1

		search_results.appendChild(option)
	})
}

/**
 * 
 * Evento del formulario cuando lo completa 
 * 
 * */
form_element.addEventListener('submit', async e => {
	e.preventDefault()

	const form = new FormData(e.target)

	// si no se encontro la direccion de buscada
	if (!form.get('result')) {
		alert('No se encontro la dirección')
		return
	}	

	const { ubicacion: {lat, lon}, nomenclatura } = DIRECCIONES[form.get('result')-1]
	
	marcarMapa(lat,lon,`<h2>${nomenclatura}</h2> <b>Lat:</b> ${lat} <br/> <b>Lon:</b> ${lon}`)	
})

/*
 *
 * Envia una peticion a la api
 * @return object | array | string valor de la respuesta
 * @param option string nombre del endpoint
 *
 **/
const georefApi = async(option) =>{

	const url = `https://apis.datos.gob.ar/georef/api/${option}`

	const response = await fetch(url)
	const data = await response.json();

	return data;
}

// peticion a la api para traer las povincias
georefApi('provincias?orden=nombre').then( response => {
	response.provincias.map(item=> {
		let option = document.createElement('option')
		option.value = item.nombre
		option.innerHTML = item.nombre

		select_pro.appendChild(option)
	})
})