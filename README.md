El Siguiente – Sistema simple de turnos médicos

Este es un proyecto que desarrollé para practicar cómo construir una aplicación completa con React, Node.js, Express y MongoDB.

La idea es tener un sistema sencillo donde:

Los pacientes puedan registrarse, iniciar sesión, sacar turnos, ver sus turnos y cancelarlos.

Los profesionales puedan registrarse, iniciar sesión y ver solo los turnos que tienen con sus pacientes.

Cualquier persona pueda consultar un turno usando un código de reserva.

Exista un flujo de recupero de contraseña usando un código de verificación.

Es un proyecto de perfil junior, pensado para aprender buenas prácticas básicas, manejo de roles y autenticación con JWT.

Funcionalidades principales

Registro y login con JWT para:

Pacientes

Profesionales

Recupero de contraseña:

Solicitud de código de verificación.

Validación del código y cambio de contraseña.

Paciente:

Registro como paciente.

Listado de profesionales disponibles.

Formulario para sacar turno (profesional, fecha, hora, motivo, medio).

Pantalla “Mis turnos” con:

Estado (Activo / Cancelado).

Código de reserva.

Opción para cancelar turnos.

Profesional:

Registro como profesional con especialidad y matrícula.

Pantalla “Mis turnos (profesional)” donde ve solo sus turnos.

Opción para cancelar turnos desde su agenda.

Consulta por código:

Pantalla “Consultar código” para buscar un turno solo con el código de reserva.

UX:

Cartel de bienvenida al iniciar sesión.

Mensajes de error claros.

Interfaz simple y responsive, pensada para usuarios de distintas edades.

Stack técnico

Frontend

React

React Router DOM

Axios

HTML5 / CSS3

Backend

Node.js

Express

MongoDB + Mongoose

JSON Web Tokens (JWT)

Bcrypt (hash de contraseñas)


Estructura del repositorio

En este repositorio tengo separadas las dos partes del proyecto:
├── el-siguiente-backend/    # API REST (Node, Express, MongoDB)
└── el-siguiente-frontend/   # Aplicación React (interfaz de El Siguiente)

Cómo correr el proyecto en local
1. Clonar el repositorio

git clone https://github.com/nicorodriguez23/el-siguiente-app.git
cd el-siguiente-app


2. Backend

Entrar a la carpeta del backend e instalar dependencias: 

cd el-siguiente-backend
npm install


Crear un archivo .env en el-siguiente-backend con algo similar a:

MONGO_URI=mongodb+srv://USUARIO:PASSWORD@TU_CLUSTER/elsiguiente
JWT_SECRET=el-siguiente-super-secreto-dev
PORT=4000


Luego levantar el servidor: 

npm run dev o npm start


La API queda escuchando en algo como:  http://localhost:4000/api

3. Frontend

En otra terminal, desde la carpeta raíz del proyecto:   

cd el-siguiente-frontend
npm install
npm run dev

Por defecto se levanta en:  http://localhost:5173


Usuarios de prueba (sugeridos)
Se pueden crear usuarios desde la propia aplicación, pero la idea para demo es tener algo así:

Paciente demo

Usuario o email: paciente_demo@ejemplo.com

Contraseña: 123456

Profesional demo

Usuario o email: doctor_demo@ejemplo.com

Contraseña: 123456

Con esto se puede mostrar rápido:

Flujo paciente: login → sacar turno → ver “Mis turnos” → cancelar turno.

Flujo profesional: login → ver turnos de sus pacientes → cancelar turno.

Cualquier sugerencia o feedback sobre el proyecto es bienvenida, lo estoy usando para seguir aprendiendo y mejorando como desarrollador.

