import { HttpInterceptorFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {

    const csrfToken = getCookie('XSRF-TOKEN');

    if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const cloned = req.clone({
            headers: req.headers.set('X-XSRF-TOKEN', csrfToken)
        });
        return next(cloned);
    }

    return next(req);

};

function getCookie(name: string): string | null {
    const match = new RegExp(new RegExp('(^| )' + name + '=([^;]+)')).exec(document.cookie);
    return match ? decodeURIComponent(match[2]) : null;
}
