<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class RejectDemoUploads
{
    public function handle(Request $request, Closure $next): Response
    {
        if (config('app.demo_disable_uploads') && $request->allFiles() !== []) {
            throw ValidationException::withMessages([
                'file' => 'Unggahan file tidak tersedia pada demo portofolio ini.',
            ]);
        }

        return $next($request);
    }
}
