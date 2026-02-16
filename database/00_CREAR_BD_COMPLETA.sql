-- ============================================================================
-- SCRIPT SQL COMPLETO - Mesa de Ayuda Innovation
-- Crea BD desde cero con todas las tablas, constraints e inserts de ejemplo
-- ============================================================================

-- 1. ELIMINAR BD EXISTENTE SI EXISTE
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'DB_MesaAyuda_Innovation')
BEGIN
    ALTER DATABASE DB_MesaAyuda_Innovation SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE DB_MesaAyuda_Innovation;
END

-- 2. CREAR BASE DE DATOS
CREATE DATABASE DB_MesaAyuda_Innovation;
GO

USE DB_MesaAyuda_Innovation;
GO

-- ============================================================================
-- TABLA: Roles
-- ============================================================================
CREATE TABLE Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    NombreRol VARCHAR(20) NOT NULL UNIQUE
);

-- ============================================================================
-- TABLA: Usuarios
-- ============================================================================
CREATE TABLE Usuarios (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    NombreCompleto VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(MAX) NOT NULL,
    activo BIT NOT NULL DEFAULT 1,
    fecha_registro DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IdRol INT NOT NULL,
    FOREIGN KEY (IdRol) REFERENCES Roles(IdRol)
);

-- ============================================================================
-- TABLA: Solicitudes
-- ============================================================================
CREATE TABLE Solicitudes (
    IdSolicitud INT PRIMARY KEY IDENTITY(1,1),
    Titulo VARCHAR(100) NOT NULL,
    Descripcion TEXT NOT NULL,
    Prioridad VARCHAR(10) NOT NULL,
    Estado VARCHAR(15) NOT NULL DEFAULT 'Nuevo',
    SolicitanteId INT NOT NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaActualizacion DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (SolicitanteId) REFERENCES Usuarios(IdUsuario)
);

-- ============================================================================
-- INSERTS: DATOS INICIALES
-- ============================================================================

-- Insertar Roles
INSERT INTO Roles (NombreRol) VALUES ('Usuario');
INSERT INTO Roles (NombreRol) VALUES ('Operador');

PRINT N'✓ Roles insertados';

-- Insertar Usuarios de ejemplo (10 usuarios)
-- Nota: Las contraseñas están en texto plano, en producción usar BCrypt desde la app
INSERT INTO Usuarios (NombreCompleto, Correo, password, activo, IdRol) VALUES 
    ('Juan Pérez García', 'juan@example.com', 'password123', 1, 1),
    ('María López Rodríguez', 'maria@example.com', 'password123', 1, 1),
    ('Carlos González Martínez', 'carlos@example.com', 'password123', 1, 2),
    ('Ana Martínez Fernández', 'ana@example.com', 'password123', 1, 2),
    ('Pedro Sánchez López', 'pedro@example.com', 'password123', 1, 1),
    ('Laura Fernández García', 'laura@example.com', 'password123', 1, 1),
    ('Miguel Rodríguez Santos', 'miguel@example.com', 'password123', 1, 2),
    ('Sofía García Gutiérrez', 'sofia@example.com', 'password123', 1, 1),
    ('Roberto Díaz Moreno', 'roberto@example.com', 'password123', 1, 2),
    ('Elena Ruiz Vargas', 'elena@example.com', 'password123', 1, 1);

PRINT N'✓ Usuarios insertados';

-- Insertar Solicitudes de ejemplo (10 solicitudes)
INSERT INTO Solicitudes (Titulo, Descripcion, Prioridad, Estado, SolicitanteId, FechaCreacion, FechaActualizacion) VALUES 
    ('Sistema no carga', 'La aplicación principal no carga desde esta mañana', 'Alta', 'Nuevo', 1, DATEADD(DAY, -5, GETDATE()), GETDATE()),
    ('Error al guardar datos', 'Cuando intento guardar un registro me sale error 500', 'Alta', 'En Progreso', 2, DATEADD(DAY, -4, GETDATE()), DATEADD(DAY, -2, GETDATE())),
    ('Mejorar velocidad del sistema', 'El sistema está muy lento en horas pico', 'Media', 'Nuevo', 5, DATEADD(DAY, -3, GETDATE()), GETDATE()),
    ('Problema con reportes', 'Los reportes PDF no se generan correctamente', 'Media', 'En Progreso', 8, DATEADD(DAY, -3, GETDATE()), DATEADD(DAY, -1, GETDATE())),
    ('Solicitud resuelta correctamente', 'El sistema de notificaciones ya funciona', 'Baja', 'Resuelto', 1, DATEADD(DAY, -10, GETDATE()), DATEADD(DAY, -2, GETDATE())),
    ('Error en módulo de usuarios', 'No puede crearse usuario administrativo', 'Alta', 'Nuevo', 2, DATEADD(DAY, -2, GETDATE()), GETDATE()),
    ('Base de datos lenta', 'Las consultas a BD tardan mucho tiempo', 'Media', 'En Progreso', 5, DATEADD(DAY, -1, GETDATE()), GETDATE()),
    ('Problema en integración de API', 'La API externa no responde correctamente', 'Alta', 'Nuevo', 8, GETDATE(), GETDATE()),
    ('Solicitud completada', 'Contraseña del usuario resetada exitosamente', 'Baja', 'Cerrado', 1, DATEADD(DAY, -7, GETDATE()), DATEADD(DAY, -1, GETDATE())),
    ('Solicitud en progreso', 'Backup de base de datos programado para el fin de semana', 'Media', 'En Progreso', 2, DATEADD(DAY, -4, GETDATE()), DATEADD(DAY, -3, GETDATE()));

PRINT N'✓ Solicitudes insertadas';

