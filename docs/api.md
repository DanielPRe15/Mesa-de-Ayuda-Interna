# API Endpoints

## Base URL

```
http://localhost:8080/api
```

## Tickets

### Listar todos los tickets

```http
GET /api/tickets
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "Error en login",
    "descripcion": "No puedo acceder al sistema",
    "prioridad": "alta",
    "estado": "abierto"
  }
]
```

### Crear ticket

```http
POST /api/tickets
Content-Type: application/json

{
  "titulo": "Error en login",
  "descripcion": "No puedo acceder al sistema",
  "prioridad": "alta"
}
```

### Obtener ticket por ID

```http
GET /api/tickets/{id}
```

### Actualizar ticket

```http
PUT /api/tickets/{id}
Content-Type: application/json

{
  "estado": "en_progreso",
  "tecnicoAsignado": "juan.perez"
}
```

### Eliminar ticket

```http
DELETE /api/tickets/{id}
```

## Códigos de respuesta

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 404 | No encontrado |
| 500 | Error del servidor |
