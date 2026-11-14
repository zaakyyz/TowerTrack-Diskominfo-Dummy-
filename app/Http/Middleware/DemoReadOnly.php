<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DemoReadOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        if (config('app.demo_read_only') && ! $request->isMethodSafe()) {
            return response('Mode demo hanya untuk melihat data. Pengiriman dan perubahan data dinonaktifkan.', 403)
                ->header('Content-Type', 'text/plain; charset=UTF-8')
                ->header('X-Robots-Tag', 'noindex');
        }

        return $next($request);
    }
}
