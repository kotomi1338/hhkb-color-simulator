<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Always send authenticated users to the top page, ignoring any intended URL.
     */
    public function toResponse($request): RedirectResponse|JsonResponse
    {
        return $request->wantsJson()
            ? new JsonResponse('', 204)
            : redirect()->route('home');
    }
}
