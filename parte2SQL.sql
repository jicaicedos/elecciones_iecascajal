-- Caritas -> emoticones
db.estudiantes.insert({
    est_anio: 2018,
    est_secretaria: "TIMANÁ",
    est_dane_ie: 241807000079,
    est_nombre_ie: "IE CASCAJAL",
    est_dane_sede: 24180700007901,
    est_nombre_sede: "CASCAJAL",
    est_jornada: "COMPLETA",
    est_calendario: "A",
    est_grado: "GRADO-0-PRIMERO-SEGUNDO",
    est_sector: "OFICIAL",
    est_grupo: 1,
    est_modelo_educativo: "POST PRIMARIA",
    est_tipo_identificacion: "TI",
    est_doc: 11,
    est_primer_apellido: "FELIZ",
    est_segundo_apellido: "",
    est_primer_nombre: "CARITA",
    est_segundo_nombre: "",
    est_estado: "MATRICULADO",
    est_matricula_contratada: "N",
    est_fuente_recursos: "SGP"
});
db.estudiantes.insert({
    est_anio: 2018,
    est_secretaria: "TIMANÁ",
    est_dane_ie: 241807000079,
    est_nombre_ie: "IE CASCAJAL",
    est_dane_sede: 24180700007901,
    est_nombre_sede: "CASCAJAL",
    est_jornada: "COMPLETA",
    est_calendario: "A",
    est_grado: "GRADO-0-PRIMERO-SEGUNDO",
    est_sector: "OFICIAL",
    est_grupo: 1,
    est_modelo_educativo: "POST PRIMARIA",
    est_tipo_identificacion: "TI",
    est_doc: 12,
    est_primer_apellido: "TRISTE",
    est_segundo_apellido: "",
    est_primer_nombre: "CARITA",
    est_segundo_nombre: "",
    est_estado: "MATRICULADO",
    est_matricula_contratada: "N",
    est_fuente_recursos: "SGP"
});

db.usuarios.insert({
    usu_ID : "Administrador",
    usu_contraseña: "admin",
    usu_nombre: "Administrador",
    usu_sede: "",
    usu_grado: "",
    usu_rol: "ADMINISTRADOR"
});


-- JURADOS
-- Preescolar, Primero y Segundo
db.usuarios.insert({
    usu_ID : "39567986",
    usu_contraseña: "39567986",
    usu_nombre: "CARMEN LUCIA CÓRDOBA",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "7731901",
    usu_contraseña: "7731901",
    usu_nombre: "CRISTIAN ANDRES CUERO MOSQUERA",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"
});

-- Tercero, Cuarto y Quinto (3ro, 4to y 5to)
db.usuarios.insert({
    usu_ID : "1083895325",
    usu_contraseña: "1083895325",
    usu_nombre: "OSCAR IVAN ARDILA ARDILA",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "1081731044",
    usu_contraseña: "1081731044",
    usu_nombre: "SERGIO ALBERTO CHAVARRO",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"
});
-- Sexto-Uno 6-1, Sexto Dos 6-2, 
-- Septimo Uno 7-1, Septimo Dos 7-2
db.usuarios.insert({
    usu_ID : "83231140",
    usu_contraseña: "83231140",
    usu_nombre: "JOSE ALIRIO VALDERRAMA",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "26529241",
    usu_contraseña: "26529241",
    usu_nombre: "ELCY YOLANDA RODRIGUEZ PERDOMO",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"
});
-- Octavo, Noveno (8 y 9)
-- Décimo y Undécimo (10 y 11)
db.usuarios.insert({
    usu_ID : "40079274",
    usu_contraseña: "40079274",
    usu_nombre: "TRINIDAD LADINO CANO",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "1075271122",
    usu_contraseña: "1075271122",
    usu_nombre: "LEIBER EDUARDO RODRIGUEZ PAPAMIJA",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"
});

db.usuarios.insert({
    usu_ID : "tobo",
    usu_contraseña: "tobo123",    
    usu_nombre: "ALFAENA ROJAS CORREA",
    usu_sede: "EL TOBO",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "laesperanza",
    usu_contraseña: "esperanza123",    
    usu_nombre: "LUZ DARY ROJAS GARZON",
    usu_sede: "LA ESPERANZA",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "lapiragua",
    usu_contraseña: "piragua123",    
    usu_nombre: "MARIA INÉS HERNANDEZ",
    usu_sede: "LA PIRAGUA",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "mateorico",
    usu_contraseña: "mateo123",    
    usu_nombre: "MANUEL AGUSTÍN ROMERO GALINDEZ",
    usu_sede: "MATEO RICO",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "paquies",
    usu_contraseña: "paquies123",    
    usu_nombre: "ELSA NORBELLY MONTOYA QUIROGA",
    usu_sede: "PAQUIES",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "laflorida",
    usu_contraseña: "florida123",
    usu_nombre: "CAROL MARCELA GONZALEZ RAMIREZ",
    usu_sede: "LA FLORIDA",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
