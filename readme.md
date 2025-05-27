# JamSpace - Reserva de Salas de Ensayo

JamSpace es un proyecto full-stack que permite a los músicos encontrar y reservar salas de ensayo equipadas. El proyecto consta de un backend desarrollado con Spring Boot (Java) y un frontend con React (TypeScript) y Vite.

## Visión General

El sistema permite a los usuarios registrarse, iniciar sesión, ver una lista de salas de ensayo disponibles, ver detalles de cada sala (equipamiento, capacidad, precio) y realizar reservas para un horario específico.

## Características

**Usuarios:**
*   Registro e Inicio de Sesión de Usuarios (Autenticación con JWT).
*   Ver perfil de usuario.
*   Listar todas las salas de ensayo disponibles.
*   Ver detalles específicos de una sala.
*   Crear reservas para una sala en un horario disponible.
*   Ver mis reservas.
*   Cancelar mis reservas.


## Tecnologías Utilizadas

**Backend:**
*   Java 17
*   Spring Boot 3
    *   Spring Web (RESTful APIs)
    *   Spring Data JPA (Hibernate)
    *   Spring Security (Autenticación y Autorización con JWT)
    *   Spring Validation
*   PostgreSQL 
*   Maven 
*   Lombok
*   JSON Web Token (jwt)

**Frontend:**
*   React 19 
*   TypeScript
*   Vite 
*   React Router 
*   Axios 
*   Material-UI 
*   Tailwind CSS
*   Date-fns (Manipulación de fechas)

**Despliegue:**
*   Backend: Fly.io
*   Frontend: Vercel

## Prerrequisitos

*   Node.js
*   npm o yarn
*   JDK 17 
*   Maven
*   Una instancia de PostgreSQL en ejecución (local o remota)

## TODOs

*   Implementar funcionalidad de administrador en el frontend.
*   Mejorar la gestión de errores y feedback al usuario en el frontend.
*   Añadir tests unitarios e de integración para el backend.
*   Añadir tests para el frontend.
*   Implementar un calendario de disponibilidad

