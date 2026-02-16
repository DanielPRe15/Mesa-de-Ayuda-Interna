import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    
  const token = sessionStorage.getItem('token');

  if (token && !req.url.includes('/auth/')) {
    console.log('AuthInterceptor: Agregando token al header para', req.url);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else if (!token && !req.url.includes('/auth/')) {
    console.log('AuthInterceptor: No hay token disponible para', req.url);
  }

  return next(req);
};
