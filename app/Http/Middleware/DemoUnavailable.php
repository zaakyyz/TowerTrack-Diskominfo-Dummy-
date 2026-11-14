<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DemoUnavailable
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!config('app.demo_ready')) {
            return response('TowerTrack demo sedang disiapkan. Silakan kembali lagi nanti.', 503)
                ->header('Content-Type', 'text/plain; charset=UTF-8')
                ->header('X-Robots-Tag', 'noindex');
        }

        return $next($request);
    }
}
