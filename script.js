
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

	search_results.innerHTML=''
})

function showResultsSearch(direcciones) {
	search_results.innerHTML=''

	// si no se encontraron direcciones 
	if (direcciones=='') {
		return// termina la ejcucion
	}

	// console.log(direcciones)
	direcciones.forEach( col => {
		let li = document.createElement('li')
		li.innerHTML = col.nomenclatura.toLowerCase()
		li.id = "search_select"

		search_results.appendChild(li)
	})

	// si hace click es uno de los resultados de busqueda
	search_results.addEventListener('click', ev =>{
		input_dir.value=ev.target.innerText
		search_results.innerText=''
	})
}

/**
 * 
 * Evento del formulario cuando lo completa 
 * 
 * */
form_element.addEventListener('submit', e => {
	e.preventDefault()

	const form = new URLSearchParams(Object.fromEntries(new FormData(e.target))).toString()

	console.log(form)

	georefApi(`direcciones?${form}`).then(response=>{
		let data = response.direcciones[0]

		let ubicacion = data.ubicacion
		// console.log(ubicacion)

		marcarMapa(ubicacion.lat, ubicacion.lon)
	})
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