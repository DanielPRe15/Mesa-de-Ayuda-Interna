import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Listado } from './pages/solicitudes/listado/listado';
import { Crear } from './pages/solicitudes/crear/crear';
import { Editar } from './pages/solicitudes/editar/editar';
import { Detalle } from './pages/solicitudes/detalle/detalle';

export const routes: Routes = [
    { path: "", component: Login },
    { path: "login", component: Login },
    { path: "register", component: Register },
    
    // Rutas de Solicitudes
    { path: "solicitudes", component: Listado },
    { path: "solicitudes/crear", component: Crear },
    { path: "solicitudes/editar/:id", component: Editar },
    { path: "solicitudes/detalle/:id", component: Detalle },
    
    // Ruta por defecto
    { path: "**", redirectTo: "/login" }
];
