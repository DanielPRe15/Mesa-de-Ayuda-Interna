export const HTTP_ERROR_MESSAGES: { [key: number]: string } = {
  400: 'Datos inválidos',
  401: 'No tienes sesión activa. Por favor inicia sesión',
  403: 'No tienes permiso para acceder a este recurso',
  404: 'El recurso solicitado no existe',
  409: 'Este recurso ya existe',
  500: 'Error interno del servidor',
  0: 'No se puede conectar al servidor'
};

export const DEFAULT_ERROR = 'Ocurrió un error. Intenta más tarde';
