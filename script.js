let DIRECCIONES = []// Almacenara las ubicaciones
let DIRE_SELECT = '';// Almacenara la direccion seleccionada en sugerencias

// si quita el foco del input
input_dir.addEventListener('blur', e =>{
	setTimeout(()=>{
		search_results.innerHTML=''
	}, 500)
})

/**
 * 
 * Evento cuando escribe la direccion á buscar
 * 
 * */
input_dir.addEventListener('keyup', async e => {
	let busqueda = e.target.value

	if (busqueda) {
		DIRE_SELECT=''
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

/**
 * 
 * Muestra las sugerencias
 * 
 * */
function showResultsSearch(direcciones) {
	// console.log(direcciones)
	search_results.innerHTML=''

	// si no se encontraron direcciones 
	if (direcciones=='') {
		return// termina la ejcucion
	}

	DIRE_SELECT = ''
	DIRECCIONES = []

	// console.log(direcciones)
	direcciones.map( (col,ind) => {
		DIRECCIONES.push(col.ubicacion)

		let li = document.createElement('li')
		li.innerHTML = col.nomenclatura.toLowerCase()
		li.id = "search_select"
		li.value = ind+1

		search_results.appendChild(li)
	})

	// si hace click es uno de los resultados de busqueda
	search_results.addEventListener('click', ev =>{
		// console.dir(ev.target.value)
		DIRE_SELECT = ev.target.value
		input_dir.value=ev.target.innerText
		search_results.innerText=''
	})
}

/**
 * 
 * Evento del formulario cuando lo completa 
 * 
 * */
form_element.addEventListener('submit', async e => {
	e.preventDefault()

	// si la direc fue seleccionada
	if (DIRE_SELECT) {	
		console.log('li',DIRE_SELECT)
		console.log('a',DIRECCIONES[DIRE_SELECT-1])
		const { lat, lon } = DIRECCIONES[DIRE_SELECT-1]

		marcarMapa(lat, lon)

		return
	}

	let form = Object.fromEntries(new FormData(e.target))

	form.direccion = form.direccion.toUpperCase()

	form = new URLSearchParams(form).toString()
	console.log(form)

	//peticion a la api
	const {direcciones} = await georefApi(`direcciones?${form}`)

	// si no encontro coincidencias
	if(direcciones==''){
		alert('No se encontro la dirección')
		return
	}

	let {lat, lon} = direcciones[0].ubicacion

	marcarMapa(lat, lon)
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