# grupo-SopaipillasCiberneticas-backend

| Nombre                     | Email                  | Github                                                   |
| -------------------------- | ---------------------- | -------------------------------------------------------- |
| Dafne Arriagada            | dafne.arriagada@uc.cl  | [@Dafnemami](https://github.com/Dafnemami)               |
| Alberto Agostini        | alberto.agostini@uc.cl  | [@albertoar1](https://github.com/albertoar1)          |


Para este Back utlizamos Koa un framework middleware de Node.js que nos permite crear aplicaciones web y API. Además, utilizamos Sequelize como ORM (Object-Relational Mapping) para la base de datos, y JWT para la autenticación de usuarios.

Primero asegúrate que en tu computador tienes instalado yarn, postgres y node.

En las líneas siguientes responderemos a: Cómo levantar la aplicación?  

## Cómo levantar la aplicación?

### Setup Inicial

Clona el repo en tu local y ubicado en la raíz de la carpeta del proyecto ejecuta:

```bash
yarn install
```
Lo cual instalará todas las dependencias necesarias para correr el proyecto.

Luego, crea una base de datos en postgres con el nombre que quieras, y en el archivo .env que deberás crear en la raíz del proyecto, crea las variables de entorno para que coincidan con tu base de datos.

- En el archivo .env deberás crear las siguientes variables de entorno:

```bash
DB_USER=nombre_de_tu_usuario
DB_PASSWORD=clave_de_ese_usuario
DB_HOST=localhost
DB_PORT=3002
DB_NAME=nombre_de_tu_base_de_datos (lee más abajo)
```

Notar que ese usuario de psql declarado debe tener contrasena (si no tienes, debes crearte uno) y antes de migrar la base de datos debe existir la base de datos declarada en DB_NAME (si no existe, debes crearla):

Para que tu base de datos funcione con nuestro código, debes crear 3 en tu postgres con los siguientes nombres:

```bash
database_test
database_development
database_production
```

#### Comandos útiles para postgres

- Para entrar a psql: `sudo -u postgres psql`

- Mostrar usuarios de psql: `\du`

- (Dentro de postgres) Crear base de datos: `CREATE DATABASE nombre_de_tu_base_de_datos;`

- (Dentro de postgres) Mostrar bases de datos: `\l`

- (Dentro de postgres) Conectarse/Acceder a una base de datos: `\c nombre_de_tu_base_de_datos`

- (Dentro de postgres) Mostrar tablas de una base de datos: `\dt`

- (Dentro de postgres) Salir `\q`


### Setteo Base de datos en proyecto con Sequelize

Te entregamos todas las seed y modelos de las bases de datos creadas, por lo tanto solo te falta migrar eso a tu computador, para lo cual realizarás lo siguiente:

- Enciende psql
``` bash
sudo service postgresql start
```
- Verifica que el estado del servicio sea "Active"
``` bash
sudo service postgresql status
```

- Realiza las migraciones
``` bash
npx sequelize-cli db:migrate
```

De haber algún problema acá probablemente sea porque las variables de entorno en tu .env no coinciden con las de la base de datos que creaste, por lo que deberás revisar eso.

- Corre las seed (poblar entidades)
``` bash
npx sequelize-cli db:seed:all
```

Si por alguna razón quieres deshacer algún paso te dejamos estos comandos útiles:

- Deshacer la última migración
``` bash
npx sequelize-cli db:migrate:undo
```

- Deshacer todas las migraciones
``` bash
npx sequelize-cli db:migrate:undo:all
```

- Deshacer la última seed
``` bash
npx sequelize-cli db:seed:undo
```

- Deshacer todas las seeds
``` bash
npx sequelize-cli db:seed:undo:all
```

### Correr el proyecto

Hay dos opciones:

``` bash
yarn start
```

``` bash
yarn dev
```

## Documentación

### Deploy 

El **front** se encuentra deployado en [Render](https://come-6-hi.onrender.com)
El **back** se encuentra deployado en [Render](https://sopaipillas-ciberneticas-toma-6-back.onrender.com/)

### Documentación API tipo REST - Endpoints

La aplicación debe estar corriendo para acceder a las siguientes rutas

Todos los Endpoints, parametros y respuestas de la API
se encuentran documentados con swagger en el siguiente link:    

http://localhost:3000/docs

También si se desea verificar el estado de "salud" de la API, se puede acceder a la siguiente ruta:

http://localhost:3000/health


# Consideraciones sobre nuestra base de datos:

- id de las cards parten desde 1 
- id de las rounds parten desde 1
- id de los boards parten desde 0
- id de games parten desde 0
- id del user creado es 0

Notar que en nuestra implementación decidimos que el id de board y game sean iguales. Esto es por la relación de multiplicidad entre ambas entidades (1 a 1). Por lo tanto, en la tabla de boards, el id de board es el mismo que el id de game.

# Diagrama Entidad Relación (Versión E2)

<img src="https://github.com/IIC2513/grupo-SopaipillasCiberneticas-backend/blob/swaggerUpdates/DiagramaER_E2.png" title="DiagramaER-E2">

Dónde la guía de multiplicidades utilizadas es la siguiente:

<img src="https://github.com/IIC2513/grupo-SopaipillasCiberneticas-backend/blob/swaggerUpdates/ConvencionMultiplicidadesER.png">
