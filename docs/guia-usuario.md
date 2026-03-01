# Guía de Usuario

## Requisitos previos

- Java 17+
- Maven 3.8+
- PostgreSQL 14+

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/DanielPRe15/Mesa-de-Ayuda-Interna.git

# Entrar al directorio
cd Mesa-de-Ayuda-Interna/backend

# Compilar
mvn clean install

# Ejecutar
mvn spring-boot:run
```

## Configuración

Editar `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mesa_ayuda
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

## Uso básico

1. Acceder a `http://localhost:8080`
2. Crear un ticket nuevo
3. Asignar a un técnico
4. Dar seguimiento hasta resolución
