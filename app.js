var express = require("express")
const path = require("path")
var cons = require("consolidate")
var bodyParser = require("body-parser")
var Estudiante = require("./models/estudiante").Estudiante
var Votaciones = require("./models/votaciones").Votaciones
var Votante = require("./models/votante").Votante
var Usuario = require("./models/usuario").Usuario
var Candidato  = require("./models/candidato").Candidato

/*	================================================================
				Inicio de la aplicación : Main
================================================================  */
// Instancia del servidor
var app = express()

// Variables globales del sistema
var nom_sede 					// Guarda el nombre de la sede
var nombre_completo_personero 	// Guarda el nombre completo del personero
var nombre_completo_representante	// Guarda el nombre completo del representante
var num_grado_estudiante		// Guarda el grado del estudiante
var num_grupo					// Guarda el grupo al que pertence el estudiante
var num_id_estudiante			// Guarda el número de identificación del estudiante
var num_representante_comite	// Guarda el número del representante del comité votado
var nombre_representante_comite	// 
var num_personero				// Guarda el número del personero votado
var nombre_personero  			// 
var num_representante			// Guarda el número del representante votado
var nombre_representante 		// 

var ruta_foto
var representantes_consejo_directivo
// var personeros
// var representantes
var ids_estudiantes_ya_votaron = []
var estudiantes = []
var registros_a_bloquear = []

var estudianteCandidato 	// Variable para almacenar temporalmente el estudiante como personero => adicionarPersonero

// ========================================================
// Para cargar los grados correspondientes según el usuario
var id_docente
var grados_docente
var nombre_docente



// Establecemos el motor de vistas, es decir tomamos los archivos ".pug" para que express
// con Node.js los conviertan a archivos ".html" 
app.set("view engine", "pug")

// Se establece el directorio "static" para guardar todos aquellos archivos que van a ser
// embebidos por los archivos ".pug", como por ejemplo imagenes, .css, .js, etc.
app.use("/static", express.static("static"));

// Se establece el middleware para reconocer los archivos JSON
app.use(bodyParser.json())

// Con este middleware se puede leer correctamente los parametros que vienen en la URL
// mediante los llamados o enviados con el metodo POST, se debe dejar el valor en 'true'
app.use(bodyParser.urlencoded({extended: true}))


// Ruta a el formulario para adicionar nuevo estudiante
app.get("/adicionarEstudiante", (req, res) => {
	res.render("adicionarEstudiante")
})

/* ==================================================================
						ADMINISTRADOR
================================================================== */
// 
app.get("/administrador", (req, res) => {
	res.render("administrador")
})

// ===========================================================================
// Pagina inicial: index
// 
app.post("/", (req, res) => {
	Usuario.
	find({"usu_ID": req.body.idUsuario, "usu_contraseña": req.body.claveUsuario}).
	select( {usu_nombre:1, usu_sede:1, usu_rol:1}).
	exec( (error, docs) => {
		let mensaje
		nombre_docente = docs[0].usu_nombre
		if( docs.length==0 ) {
			mensaje = "Usuario o contraseña son incorrectas"
			res.render("index", {mensaje})
		} else {
			if( docs[0].usu_rol=="ADMINISTRADOR" ) {				
				res.render("administrador")				
			} else {				
				if( docs[0].usu_rol == "JURADO" ) {
					nom_sede = docs[0].usu_sede
					if( docs[0].usu_sede == "EL TOBO" ) {
						res.render("sedeElTobo", {nombre_docente})
					} else if( docs[0].usu_sede == "LA PIRAGUA" ) {
						res.render("sedeLaPiragua", {nombre_docente})
					} else if( docs[0].usu_sede == "MATEO RICO" ) {
						res.render("sedeMateoRico", {nombre_docente})
					} else if( docs[0].usu_sede == "PAQUIES" ) {
						res.render("sedePaquies", {nombre_docente})
					} else if( docs[0].usu_sede == "LA FLORIDA" ) {
						res.render("sedeLaFlorida", {nombre_docente})
					} else if( docs[0].usu_sede == "LA ESPERANZA" ) {
						res.render("sedeLaEsperanza", {nombre_docente})
					} else if( docs[0].usu_sede == "CASCAJAL" ) {
						id_docente = req.body.idUsuario
						if( id_docente == "39567986" || id_docente == "7731901" ) {
							grados_docente = 1
						} else if ( id_docente == "1083895325" || id_docente == "1081731044" ) {
							grados_docente = 2
						} else if ( id_docente == "123456" || id_docente == "26529241" ) {
							grados_docente = 3
						} else if ( id_docente == "40079274" || id_docente == "1075271122" ) {
							grados_docente = 4
						}
						res.render("sedeIECascajal", {grados_docente, nombre_docente} )
					} 
				}
			}
		}
	}) 
})

app.get("/", (req, res) => {
	let mensaje = ""
	res.render("index",{mensaje})
})


// =============================================================================
// Funcion que obtiene los nombres de los candidatos que recibieron votos, 
// sin repetir
Array.prototype.unique = function(a){
	return function(){ 
		return this.filter(a) 
	}
}(function(a,b,c){ 
	return c.indexOf(a,b+1) < 0 
});

// ==================================================================================
// 
// Resumen de votaciones por representantes: Personero, Rep Consejo Directivo y Rep Consejo Estudiantil

function get_resumen(candidatos) {
	let i = 0
	var array_candidatos = []
	candidatos.forEach(function(array_candidatos_distinct) {
		array_candidatos[i] = array_candidatos_distinct._id.nombre
		i++
	})

	array_candidatos = array_candidatos.unique()

	var resumen = []
	var cont = 0
	var suma_votos
	var votacion_caritas = []
	var cont_carita_feliz = 0
	var cont_carita_triste = 0
	for (var k = 0; k < array_candidatos.length; k++) {			
		suma_votos = 0
		candidatos.forEach(function(candidato) {
			if (array_candidatos[k] == candidato._id.nombre && candidato._id.sede == nom_sede ) {
				suma_votos += candidato.cantidad
			}
		})
		if(array_candidatos[k] != "No hay candidato" )
			resumen[k] = [array_candidatos[k], suma_votos]
	}
	return resumen
}

app.get("/reportes", (req, res) => {
	let reporte_representantes_comite
	let reporte_personeros
	let reporte_representantes
	let resumen_total_representantes_comite
	let resumen_total_personeros
	let resumen_total_representantes

	Votaciones.
	aggregate([
		{ $sort: {vot_sede:1, vot_grupo:-1, vot_representante_comite:-1} },
		{ $group: 
			{ _id: 
				{
					sede: "$vot_sede", 
					grupo: "$vot_grupo", 
					nombre: "$vot_nombre_rep_comite", 
					representante_comite: "$vot_representante_comite" 
				}, 
				cantidad: { $sum: 1 } 
			} 
		}
	]).
	exec( (error, docs) => { reporte_representantes_comite = docs	} )

	Votaciones.
	aggregate([
		{ $sort: {vot_sede:1, vot_grupo:-1, vot_representante:-1} },
		{ $group: 
			{ _id: 
				{
					sede: "$vot_sede", 
					grupo: "$vot_grupo", 
					nombre: "$vot_nombre_representante", 
					representante: "$vot_representante" 
				}, 
				cantidad: { $sum: 1 } 
			} 
		}
	]).
	exec( (error, docs) => { reporte_representantes = docs	} )

	Votaciones.
	aggregate([
		{ $sort: {vot_sede:1, vot_grupo:-1, vot_personero:-1} },
		{ $group: 
			{_id: 
				{
					sede: "$vot_sede", 
					grupo: "$vot_grupo", 
					nombre: "$vot_nombre_personero", 
					personero:"$vot_personero"
				}, 
				cantidad: {$sum:1} 
			} 
		}
	]).
	exec( (error, docs) => {
		reporte_personeros = docs

		// =============================================================================
		// Representante_Comite = "CONSEJO DIRECTIVO"
		let total_representantes_comite = 0
		// Cuenta votos por candidatos
		reporte_representantes_comite.forEach(function(candidato){
			if( candidato._id.sede == nom_sede ) {
				total_representantes_comite += candidato.cantidad
			} else {}
		})
		resumen_total_representantes_comite = get_resumen(reporte_representantes_comite)
		// Restar los votos de PREESCOLAR, PRIMERO y SEGUNDO
		resumen_total_representantes_comite.forEach(function(candidato){
			if( candidato[0] == "CARITA FELIZ" || candidato[0] == "CARITA TRISTE" ) {
				total_representantes_comite -= candidato[1]
			}
		})

		// =============================================================================
		// Personeros
		let total_personeros = 0
		reporte_personeros.forEach(function(reporte_personero){
			if (reporte_personero._id.personero != -1 && reporte_personero._id.sede == nom_sede){
				total_personeros+= reporte_personero.cantidad
			} else {}
		})
		resumen_total_personeros = get_resumen(reporte_personeros)		

		// =============================================================================
		// Representante = "CONSEJO ESTUDIANTIL"
		let total_representantes = 0
		reporte_representantes.forEach(function(reporte_representante){
			if (reporte_representante._id.representante != -1 && reporte_representante._id.sede == nom_sede){
				total_representantes+= reporte_representante.cantidad
			} else {}
		})
		resumen_total_representantes = get_resumen(reporte_representantes)		

		res.render(
			"reportes",
			{
				reporte_representantes_comite, resumen_total_representantes_comite, 
				reporte_personeros, resumen_total_personeros, 
				reporte_representantes, resumen_total_representantes, 
				nom_sede, 
				total_representantes_comite, 
				total_personeros, 
				total_representantes 
			}
		)
	})
	
})
// ===========================================================================
// 
// Gestión de candidatos


// Adicionar candidato a personero
app.get("/adicionarCandidato", (req, res) => {
	res.render("adicionarCandidato")
})

app.get("/consultarEstudianteParaCandidato", (req, res) => {
	res.render("consultarEstudianteParaCandidato")
})

app.post("/consultarEstudianteParaCandidato", (req, res) => {
	var mensaje
	var idEstudiante = req.body.idEstudiante	

	Estudiante.
	find({"est_doc": idEstudiante}).
	select( {est_doc:1} ).
	exec( (error, docs) => { 
		// 1. Verificar que el estudiante está matriculado
		if( docs.length == 1 ) { 
			Candidato.
			find( {"est_doc": idEstudiante} ).
			select().
			exec( (error, docs) => { 
				// 2. Verificar si el candidato ya es un(a) personero(a)/representante
				// == 0 No es candidato
				if( docs.length == 0 ) { 
					// Verificar disponibilidad de número de tarjetón


					Estudiante.
					find({"est_doc": idEstudiante}).
					select({
						est_anio: 1, est_secretaria: 1, est_dane_ie: 1, est_nombre_ie: 1,	
						est_dane_sede: 1, est_nombre_sede: 1, est_jornada: 1, est_calendario: 1,
						est_grado: 1, est_sector: 1, est_grupo: 1, est_modelo_educativo: 1,
						est_tipo_identificacion: 1, est_doc: 1, est_primer_apellido: 1,
						est_segundo_apellido: 1, est_primer_nombre: 1, est_segundo_nombre: 1,
						est_estado: 1, est_matricula_contratada: 1, est_fuente_recursos: 1
					}).
					exec( (error, docs) => {
						estudianteCandidato = docs[0]
						res.render("consultarEstudianteParaCandidato", {estudianteCandidato})
					})

				} else {
					mensaje = "Este(a) estudiante ya tiene candidatura"
					res.render("adicionarCandidato", {mensaje})
				}
			})
		} else {
			mensaje = "Este(a) estudiante no está matriculado en la Institución Educativa."
			res.render("adicionarCandidato", {mensaje})			
		}
	})
})

app.post("/finalAdicionarCandidato", (req, res) => {
	let grado = estudianteCandidato.est_grado
	let grupo = estudianteCandidato.est_grupo
	let number_tarjeton = req.body.numeroTarjeton
	let tipo_candidato = req.body.tipo_candidato

	var est_candidato = new Candidato({
		est_anio: estudianteCandidato.est_anio,
		est_secretaria: estudianteCandidato.est_secretaria,
		est_dane_ie: estudianteCandidato.est_dane_ie,
		est_nombre_ie: estudianteCandidato.est_nombre_ie,
		est_dane_sede: estudianteCandidato.est_dane_sede,
		est_nombre_sede: estudianteCandidato.est_nombre_sede,
		est_jornada: estudianteCandidato.est_jornada,
		est_calendario: estudianteCandidato.est_calendario,
		est_grado: estudianteCandidato.est_grado,
		est_sector: estudianteCandidato.est_sector,
		est_grupo: estudianteCandidato.est_grupo,
		est_modelo_educativo: estudianteCandidato.est_modelo_educativo,
		est_tipo_identificacion: estudianteCandidato.est_tipo_identificacion,
		est_doc: estudianteCandidato.est_doc,
		est_primer_apellido: estudianteCandidato.est_primer_apellido,
		est_segundo_apellido: estudianteCandidato.est_segundo_apellido,
		est_primer_nombre: estudianteCandidato.est_primer_nombre,
		est_segundo_nombre: estudianteCandidato.est_segundo_nombre,
		est_estado: estudianteCandidato.est_estado,
		est_matricula_contratada: estudianteCandidato.est_matricula_contratada,
		est_fuente_recursos: estudianteCandidato.est_fuente_recursos,
		est_tipo_candidato: req.body.tipo_candidato,
		est_num_tarjeton: req.body.numeroTarjeton,
		est_foto: req.body.fotoEstudiante
	})


	Candidato.
	find( {"est_grado":grado, "est_grupo":grupo, "est_num_tarjeton":number_tarjeton, "est_tipo_candidato":tipo_candidato} ).
	select( {est_grado:1, est_grupo:1, est_num_tarjeton:1, est_tipo_candidato:1} ).
	exec( (error, docs) => {
		if( docs.length >= 1 ) {
			mensaje = "Ya existe un candidato del mismo grado y grupo con el número de tarjetón seleccionado"
			res.render("consultarEstudianteParaCandidato", {estudianteCandidato, mensaje})
		}
		else {	
			est_candidato.save().then( (est) => {
				res.render("finalAdicionarCandidato")
			}, (error) => {
				let mensaje = "No se guardó el registro, por favor intentarlo de nuevo."
				res.render("finalAdicionarCandidato", {mensaje})
			})
		}

	})
})

// ===========================================================================
// Consultar estudiante para votar


// Consultar estudiantes SOLO IE CASCAJAL
app.get("/consultarEstudiantes", (req, res) => {
	Estudiante.
	find({}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		res.render("consultarEstudiantes", {estudiantes} )
	})
})

app.get("/estudiantesIECascajal", (req, res) => {
	Estudiante.
	find({}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		res.render("estudiantesIECascajal", {estudiantes} )
	})
})

// ============================================================================
// Consultar candidatos
app.get("/consultarCandidatos", (req, res) => {	
	let mensaje, mensajeOK

	Candidato.
	find().
	sort({est_grupo:1, est_num_tarjeton:1}).
	exec( (error, docs) => {
		let candidatos = docs
		if( docs.length == 0 ) {
			mensaje = "No hay candidatos inscritos"
			mensajeOK = "VACIO"
			res.render("consultarCandidatos", {mensaje, mensajeOK})
		} else {
			mensajeOK = "OK"
			res.render("consultarCandidatos", {candidatos, mensajeOK})
		}		
	}, (error) => {
		mensajeOK = "ERROR"
		mensaje = "No se pudo leer los datos de los candidatos, por favor intentar nuevamente"		
		res.render("consultarCandidatos", {mensaje, mensajeOK} )
	})
})

// ============================================================================
// Votar en la I.E. Cascajal
app.get("/sedeIECascajal", (req, res) => {
	res.render("sedeIECascajal", {nombre_docente, grados_docente})
})

app.get("/votarIECascajal", (req, res) => {
	res.render("votarIECascajal")
})

app.post("/votarIECascajal", (req, res) => {
	nom_sede = "CASCAJAL"
	num_grado_estudiante = req.body.gradosIECascajal

	if( num_grado_estudiante=="SEXTO A" | num_grado_estudiante=="SEXTO B" | 
		num_grado_estudiante=="SEPTIMO A" | num_grado_estudiante=="SEPTIMO B" 
		) 
	{
		if( num_grado_estudiante=="SEXTO A" ) {
			num_grado_estudiante = num_grado_estudiante.split(" ")[0]
			num_grupo = 601
		} else if( num_grado_estudiante=="SEXTO B" ) {
			num_grado_estudiante = num_grado_estudiante.split(" ")[0]
			num_grupo = 602
		} else if( num_grado_estudiante=="SEPTIMO A" ) {
			num_grado_estudiante = num_grado_estudiante.split(" ")[0]
			num_grupo = 701
		} else {
			num_grado_estudiante = num_grado_estudiante.split(" ")[0]
			num_grupo = 702
		}
		
		Votante.
		find( {"vot_sede": nom_sede, "vot_grado": num_grado_estudiante} ).
		select( {_id:0, vot_doc:1} ).
		exec( (error, docs) => {
			ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
		})

		Estudiante.
		find({"est_grupo": num_grupo, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			let sedes = "Listado de estudiantes sede I. E. Cascajal"
			let volver_a = "/sedeIECascajal"
			res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
		})		
	} else {
		Votante.
		find({"vot_sede": nom_sede, "vot_grado":num_grado_estudiante}).
		select( {_id:0, vot_doc:1} ).
		exec( (error, docs) => {
			ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
		})

		Estudiante.
		find({"est_grado": num_grado_estudiante, "est_nombre_sede": "CASCAJAL"}).
		select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
		exec( (error, docs) => {
			estudiantes = docs
			registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
			let sedes = "Listado de estudiantes sede I. E. Cascajal"
			let volver_a = "/sedeIECascajal"
			res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
		})		
	}
})

// ============================================================================
// Votar en la Sede 2) El Tobo
app.get("/sedeElTobo", (req, res) => {
	res.render("sedeElTobo")
})

app.get("/votarSedeElTobo", (req, res) => {
	// console.log("GET -> votar votarSedeElTobo" + req.body.gradosSedeElTobo)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("listarEstudiantesVotacion")
})

app.post("/votarSedeElTobo", (req, res) => {
	nom_sede = "EL TOBO"
	num_grado_estudiante = req.body.gradosSedeElTobo

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede El Tobo"
		let volver_a = "/sedeElTobo"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})
// ============================================================================
// Votar en la Sede 3) La Esperanza
app.get("/sedeLaEsperanza", (req, res) => {
	res.render("sedeLaEsperanza")
})

app.get("/votarSedeLaEsperanza", (req, res) => {
	// console.log("GET -> votar votarSedeLaEsperanza" + req.body.gradosSedeLaEsperanza)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeLaEsperanza")
})

app.post("/votarSedeLaEsperanza", (req, res) => {
	// console.log("POST -> votar votarSedeLaEsperanza" + req.body.gradosSedeLaEsperanza)

	nom_sede = "LA ESPERANZA"
	num_grado_estudiante = req.body.gradosSedeLaEsperanza

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede La Esperanza"
		let volver_a = "/sedeLaEsperanza"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})

})

// ============================================================================
// Votar en la Sede 4) La Piragua
app.get("/sedeLaPiragua", (req, res) => {
	res.render("sedeLaPiragua")
})

app.get("/votarSedeLaPiragua", (req, res) => {
	// console.log("GET -> votar votarSedeLaPiragua" + req.body.gradosSedeLaPiragua)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeLaPiragua")
})

app.post("/votarSedeLaPiragua", (req, res) => {
	nom_sede = "LA PIRAGUA"
	num_grado_estudiante = req.body.gradosSedeLaPiragua

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede La Piragua"
		let volver_a = "/sedeLaPiragua"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar en la Sede 5) Paquies
app.get("/sedePaquies", (req, res) => {
	res.render("sedePaquies")
})

app.get("/votarSedePaquies", (req, res) => {
	// console.log("GET -> votar votarSedePaquies" + req.body.gradosSedePaquies)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedePaquies")
})

app.post("/votarSedePaquies", (req, res) => {
	// console.log("POST -> votar votarSedePaquies" + req.body.gradosSedePaquies)

	nom_sede = "PAQUIES"
	num_grado_estudiante = req.body.gradosSedePaquies

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede Paquies"
		let volver_a = "/sedePaquies"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})


// ============================================================================
// Votar en la Sede 6) La Florida
app.get("/sedeLaFlorida", (req, res) => {
	res.render("sedeLaFlorida")
})

app.get("/votarSedeLaFlorida", (req, res) => {
	// console.log("GET -> votar votarSedeLaFlorida" + req.body.gradosSedeLaFlorida)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeLaFlorida")
})

app.post("/votarSedeLaFlorida", (req, res) => {
	// console.log("POST -> votar votarSedeLaFlorida" + req.body.gradosSedeLaFlorida)

	nom_sede = "LA FLORIDA"
	num_grado_estudiante = req.body.gradosSedeLaFlorida

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede La Florida"
		let volver_a = "/sedeLaFlorida"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar en la Sede 7) Mateo Rico

app.get("/sedeMateoRico", (req, res) => {
	res.render("sedeMateoRico")
})

app.get("/votarSedeMateoRico", (req, res) => {
	// console.log("GET -> votar votarSedeMateoRico" + req.body.gradosSedeMateoRico)
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	res.render("votarSedeMateoRico")
})

app.post("/votarSedeMateoRico", (req, res) => {
	// console.log("POST -> votar votarSedeMateoRico" + req.body.gradosSedeMateoRico)

	nom_sede = "MATEO RICO"
	num_grado_estudiante = req.body.gradosSedeMateoRico

	Votante.
	find( {"vot_sede": nom_sede, "vot_grado":num_grado_estudiante} ).
	select( {_id:0, vot_doc:1} ).
	exec( (error, docs) => {
		ids_estudiantes_ya_votaron = obtener_ids_estudiantes_ya_votaron(docs)
	})

	Estudiante.
	find({"est_grado": num_grado_estudiante, "est_nombre_sede": nom_sede}).
	select({est_tipo_identificacion:1, est_doc:1, est_primer_apellido:1, est_segundo_apellido:1, est_primer_nombre:1, est_segundo_nombre:1, est_grado:1, est_grupo:1, est_matricula_contratada:1, est_fuente_recursos:1}).
	exec( (error, docs) => {
		estudiantes = docs
		registros_a_bloquear = bloquearRegistros(estudiantes, ids_estudiantes_ya_votaron)
		let sedes = "Listado de estudiantes sede Mateo Rico"
		let volver_a = "/sedeMateoRico"
		res.render("listarEstudiantesVotacion", {sedes, volver_a, estudiantes, registros_a_bloquear} )
	})
})

// ============================================================================
// Votar por Representantes Consejo Directivo
// 
app.post("/representanteConsejoDirectivo", (req, res) => {
	num_id_estudiante = req.body.documentoIdentidadEstudiante
	// Obtenemos los <<Representantes Consejo Directivo>> desde la base de datos
	Candidato.
	find({"est_tipo_candidato":"representante_consejo_directivo"}).
	sort({est_num_tarjeton:1}).
	select({
		est_anio: 1, est_secretaria: 1, est_dane_ie: 1, est_nombre_ie: 1,	
		est_dane_sede: 1, est_nombre_sede: 1, est_jornada: 1, est_calendario: 1,
		est_grado: 1, est_sector: 1, est_grupo: 1, est_modelo_educativo: 1,
		est_tipo_identificacion: 1, est_doc: 1, est_primer_apellido: 1,
		est_segundo_apellido: 1, est_primer_nombre: 1, est_segundo_nombre: 1,
		est_estado: 1, est_matricula_contratada: 1, est_fuente_recursos: 1,
		est_tipo_candidato: 1, est_num_tarjeton: 1, est_foto: 1
	}).
	exec( (error, docs) => {
		representantes_consejo_directivo = docs

		Estudiante.
		find({"est_doc":num_id_estudiante}).
		select({est_grado:1, est_grupo:1, 
			est_primer_nombre:1, est_segundo_nombre:1, 
			est_primer_apellido:1, est_segundo_apellido:1}
		).
		exec( (error, docs) => {
			num_grado_estudiante = docs[0].est_grado
			num_grupo = docs[0].est_grupo		
			// Variable para determinar cuales grados tienen representante
			let conRepresentante
			if( num_grupo >= 299 ) { conRepresentante = 1 }
			else { conRepresentante = 0 }
			res.render(
				"representanteConsejoDirectivo", 
				{
					representantes_consejo_directivo, 
					num_id_estudiante, 
					nombre_representante_comite, 
					nom_sede, num_grado_estudiante, 
					conRepresentante
				}
			)
		})
	})	
})


// ============================================================================
//
// Votar por Personero
// 
app.post("/personero", (req, res) => {
	// console.log("POST -> personero")
	num_representante_comite = req.body.representante_consejo_directivo

	if( num_representante_comite == 0 ) {
		nombre_representante_comite = "VOTO EN BLANCO"
	} else {
		nombre_representante_comite = `${representantes_consejo_directivo[num_representante_comite-1].est_primer_nombre} ${representantes_consejo_directivo[num_representante_comite-1].est_segundo_nombre} ${representantes_consejo_directivo[num_representante_comite-1].est_primer_apellido} ${representantes_consejo_directivo[num_representante_comite-1].est_segundo_apellido}`
	}

	// Obtenemos los personeros desde la base de datos
	Candidato.
	find({"est_tipo_candidato":"personero"}).
	sort({est_num_tarjeton:1}).
	select({
		est_anio: 1, est_secretaria: 1, est_dane_ie: 1, est_nombre_ie: 1,	
		est_dane_sede: 1, est_nombre_sede: 1, est_jornada: 1, est_calendario: 1,
		est_grado: 1, est_sector: 1, est_grupo: 1, est_modelo_educativo: 1,
		est_tipo_identificacion: 1, est_doc: 1, est_primer_apellido: 1,
		est_segundo_apellido: 1, est_primer_nombre: 1, est_segundo_nombre: 1,
		est_estado: 1, est_matricula_contratada: 1, est_fuente_recursos: 1,
		est_tipo_candidato: 1, est_num_tarjeton: 1, est_foto: 1
	}).
	exec( (error, docs) => {
		personeros = docs

		// CODING: Obtener nombre completo de personero
		Estudiante.
		find({"est_doc":num_id_estudiante}).
		select({est_grado:1, est_grupo:1, est_primer_nombre:1, est_segundo_nombre:1, est_primer_apellido:1, est_segundo_apellido:1}).
		exec( (error, docs) => {
			num_grado_estudiante = docs[0].est_grado
			num_grupo = docs[0].est_grupo		
			// Variable para determinar cuales grados tienen representante
			let conRepresentante
			if( num_grupo >= 299 ) { conRepresentante = 1 } 
			else { conRepresentante = 0 }
			res.render("personero", {personeros, num_id_estudiante, nombre_personero, nom_sede, num_grado_estudiante, conRepresentante})
		})
	})
})


// ============================================================================
// Votar por representante de grado 11
// 
app.post("/representante", (req, res) => {
	num_personero = req.body.personero
	if( num_personero == 0 ) {
		nombre_personero = "VOTO EN BLANCO"
	} else {
		nombre_personero = `${personeros[num_personero-1].est_primer_nombre} ${personeros[num_personero-1].est_segundo_nombre} ${personeros[num_personero-1].est_primer_apellido} ${personeros[num_personero-1].est_segundo_apellido}`
	}

	// Obtenemos los representantes desde la base de datos
	Candidato.
	find({"est_tipo_candidato":"representante_consejo_estudiantil", "est_grado":num_grado_estudiante, "est_grupo":num_grupo}).
	sort({est_num_tarjeton:1}).
	select({
		est_anio: 1, est_secretaria: 1, est_dane_ie: 1, est_nombre_ie: 1,	
		est_dane_sede: 1, est_nombre_sede: 1, est_jornada: 1, est_calendario: 1,
		est_grado: 1, est_sector: 1, est_grupo: 1, est_modelo_educativo: 1,
		est_tipo_identificacion: 1, est_doc: 1, est_primer_apellido: 1,
		est_segundo_apellido: 1, est_primer_nombre: 1, est_segundo_nombre: 1,
		est_estado: 1, est_matricula_contratada: 1, est_fuente_recursos: 1,
		est_tipo_candidato: 1, est_num_tarjeton: 1, est_foto: 1
	}).
	exec( (error, docs) => {
		representantes = docs
		res.render("representante", {representantes, nombre_representante, num_grado_estudiante, num_grupo})
	})
})


// ============================================================================
// 		

function obtener_ids_estudiantes_ya_votaron(listaYaVotaron) {
	// Arreglo de numeros de identificación de estudiantes que ya votarion
	var numeros_id_estudiantes = []

	for( let i=0; i<listaYaVotaron.length; i++ ) {
		numeros_id_estudiantes[i] = listaYaVotaron[i].vot_doc
	}

	return numeros_id_estudiantes
}

// Función para bloquear registros de aquellos estudiantes que ya votaron
function bloquearRegistros(estudiantes, estudiantes_ya_votaron) {
	let regs_a_bloquear = []
	let bloquear = 1
	let no_bloquear = 0

	for(let i=0; i<estudiantes.length; i++) {
		regs_a_bloquear[i] = no_bloquear
		for(let j=0; j<estudiantes_ya_votaron.length; j++) {
			if( estudiantes[i].est_doc==estudiantes_ya_votaron[j] ) {
				regs_a_bloquear[i] = bloquear
			}
		}		
	}

	return regs_a_bloquear
}

// ============================================================================
// Final de votación
// 
app.post("/finalProcesoVotacion", (req, res) => {
	// Se decide si el estudiante debe o no votar por "Representante por grado" y "Representante al Comité"
	if( nom_sede=="CASCAJAL"  ) {
		if( num_grupo < 300 ) {
			num_representante_comite = req.body.representante_consejo_directivo
			if (num_representante_comite == 1 ) {
				nombre_representante_comite = "CARITA FELIZ"
								
			} else {
				nombre_representante_comite = "CARITA TRISTE"
			}

			nombre_representante = "No hay candidato"
			num_representante = -1
			nombre_personero = "No hay candidato"
			num_personero = -1
		} else {
			num_representante = req.body.representante
			if (num_representante == 0) {
				nombre_representante = "VOTO EN BLANCO"
			} else {
				nombre_representante = `${representantes[num_representante-1].est_primer_nombre} ${representantes[num_representante-1].est_segundo_nombre} ${representantes[num_representante-1].est_primer_apellido} ${representantes[num_representante-1].est_segundo_apellido}`
			}
		}		
	} else {		// Votaciones para sedes (El Tobo, Mateo Rico,...)
		if( num_grupo < 300 ) { 	// Votaciones para grados de: Preescolar, Primero y Segundo
			num_representante_comite = req.body.representante_consejo_directivo
			if (num_representante_comite == 1 ) {
				nombre_representante_comite = "CARITA FELIZ"
			} else {
				nombre_representante_comite = "CARITA TRISTE"
			}

			nombre_representante = "No hay candidato"
			num_representante = -1
			nombre_personero = "No hay candidato"
			num_personero = -1
			
		} else {	// Votaciones en sedes (Tobo, Mateo Rico,...) para grados: Tercero, Cuarto y Quinto
			num_representante = req.body.representante
			num_personero = req.body.personero
			if (num_representante == 0) {
				nombre_representante = "VOTO EN BLANCO"
			} else {
				if(num_personero == 0) {
					nombre_personero = "VOTO EN BLANCO"
				}
				else {
					nombre_personero = `${personeros[num_personero-1].est_primer_nombre} ${personeros[num_personero-1].est_segundo_nombre} ${personeros[num_personero-1].est_primer_apellido} ${personeros[num_personero-1].est_segundo_apellido}`
				}			
				nombre_representante = "No hay candidato"
				num_representante = -1
			}
		}		
	}

	// console.log("Nombre representante comite:" + nombre_representante_comite)
	// console.log("Numero rep comite:" + num_representante_comite + "\n")

	// console.log("Nombre personero:" + nombre_personero)
	// console.log("Numero personero:" + num_personero + "\n")

	// console.log("Nombre representante:" + nombre_representante)
	// console.log("Numero representante:" + num_representante + "\n")

	var votaciones = new Votaciones({
	    vot_sede: nom_sede,
	    vot_grado: num_grado_estudiante,
	    vot_grupo: num_grupo,
	    vot_representante_comite: num_representante_comite,
	    vot_nombre_rep_comite: nombre_representante_comite,
	    vot_personero: num_personero,
	    vot_nombre_personero: nombre_personero,
	    vot_representante: num_representante,
	    vot_nombre_representante: nombre_representante,
	    vot_fecha: new Date()
	});

	var votante = new Votante({
	    vot_sede: nom_sede,
	    vot_grado: num_grado_estudiante,
	    vot_doc: num_id_estudiante,
	    vot_fecha: new Date()
	});

	// Guardar en la base de datos de VOTACIONES
	votaciones.save().then( (est) => {
		// console.log("Votación guardada correctamente!") 
	}, (error) => { console.log("Error al escibir en la base de datos. Collection: votaciones") })

	// Guardar en la base de datos de VOTANTES
	votante.save().then( (est) => {
		res.render("finalProcesoVotacion", {nom_sede})
	}, (error) => { res.send("Error al escibir en la base de datos. Collection: votantes") })

})

app.listen(8080)

