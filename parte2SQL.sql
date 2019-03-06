Listado de los estudiantes que hacen parte de los elegidos para la conformación del gobierno escolar:

Grado tercero
-Brigith Dayana Gomez Gallardo #  01 
-John Alejandro Rengifo Murcia # 02 

Grado cuarto
-Monica Maria Lugo Cespedes#1
-Hermes David Becerra Sapuy#2

Grado quinto
-Daniela Manrique Murcia#1
- Karol Yuliana Guevara Anacona#2

Grado sexto A
-Luisa Fernanda Castro López#1
-Deiny Liceth Guzman Giron#1

Grado sexto B
-Wendy Katerine Florez Chito#1
-Danna Sofía Ramos Triviño#2

Grado séptimo A
-Gabriela Gutiérrez Muñoz#1
-Faiver Aldana Garzón#1

Grado séptimo B
-Angela Rocío Castañeda Nieto#1
-Breiner Stiven Muñoz Ospitia#2

Grado octavo
-Edna Lizeth Gutiérrez#1
-Lina Marcela Garzón Sterling#2

Grado noveno
-Danna Geraldin Romero Ordoñez#1
-Carlos Alberto Muñoz Collazoz#2

Grado décimo 
-Caren Yulisa Yate Romero#1
-Daniel Eduardo Sterling Calderón#2

Grado once
-Natalia Guzmán Gutiérrez#1
-Evelin Rojas Medina#2

CANDIDATOS AL CONSEJO:
-Caren Yuliana Guevara Díaz#1
-Jhonatan Olaya Lozano#2

CANDIDATOS A PERSONERIA:
-Karen Jhulieth Burbano Ruiz#1
-Yolima Cuéllar Santiago#2
-Alcicardo Erik Silva#3



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
-- Usuarios docentes

-- Preescolar, Primero y Segundo
db.usuarios.insert({
    usu_ID : "mesa1",
    usu_contraseña: "mesa1",
    usu_nombre: "MESA 1",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"
});

-- Tercero, Cuarto y Quinto (3ro, 4to y 5to)
db.usuarios.insert({
    usu_ID : "mesa2",
    usu_contraseña: "mesa2",
    usu_nombre: "MESA 2",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"

});

-- Sexto-Uno 6-1, Sexto Dos 6-2, Septimo Uno 7-1, Septimo Dos 7-2
db.usuarios.insert({
    usu_ID : "mesa3",
    usu_contraseña: "mesa3",
    usu_nombre: "MESA 3",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"

});

-- Octavo, Noveno (8 y 9)
-- Décimo y Undécimo (10 y 11)
db.usuarios.insert({
    usu_ID : "mesa4",
    usu_contraseña: "mesa4",
    usu_nombre: "MESA 4",
    usu_sede: "CASCAJAL",
    usu_rol: "JURADO"

});

db.usuarios.insert({
    usu_ID : "tobo",
    usu_contraseña: "tobo123",    
    usu_nombre: "PROFE EL TOBO",
    usu_sede: "EL TOBO",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "laesperanza",
    usu_contraseña: "esperanza123",    
    usu_nombre: "PROFE LA ESPERANZA",
    usu_sede: "LA ESPERANZA",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "lapiragua",
    usu_contraseña: "piragua123",    
    usu_nombre: "PROFE LA PIRAGUA",
    usu_sede: "LA PIRAGUA",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "mateorico",
    usu_contraseña: "mateo123",    
    usu_nombre: "PROFE MATEO RICO",
    usu_sede: "MATEO RICO",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "paquies",
    usu_contraseña: "paquies123",    
    usu_nombre: "PROFE PAQUIES",
    usu_sede: "PAQUIES",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
db.usuarios.insert({
    usu_ID : "laflorida",
    usu_contraseña: "florida123",    
    usu_nombre: "PROFE LA FLORIDA",
    usu_sede: "LA FLORIDA",
    usu_grado: "TODOS",
    usu_rol: "JURADO"
});
