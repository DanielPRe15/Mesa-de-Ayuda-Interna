# Arquitectura

## Diagrama de componentes

```
┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│    Backend      │
│    (Angular)    │     │  (Spring Boot)  │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        └─────────────────┘
```

## Componentes del sistema

| Componente | Tecnología | Responsabilidad |
|------------|------------|-----------------|
| Frontend | Angular 17 | Interfaz de usuario |
| Backend | Spring Boot 3.x | Lógica de negocio y API REST |
| Database | PostgreSQL 14 | Persistencia de datos |

## Flujo de datos

1. **Usuario** interactúa con el Frontend
2. **Frontend** hace peticiones HTTP al Backend
3. **Backend** procesa la lógica de negocio
4. **Backend** consulta/actualiza la base de datos
5. **Respuesta** viaja de vuelta al usuario

## Estructura del proyecto

```
Mesa-de-Ayuda-Interna/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/
│   └── src/
├── docs/
│   ├── index.md
│   ├── guia-usuario.md
│   ├── api.md
│   └── arquitectura.md
└── mkdocs.yml
```
