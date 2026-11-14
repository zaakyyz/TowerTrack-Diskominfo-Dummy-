<?php

use App\Models\User;
use App\Models\FoRoute;

it('requires authentication for FO mutation and route generation endpoints', function (string $method, string $url) {
    $this->{$method}($url)->assertRedirect(route('login'));
})->with([
    ['post', '/fo-route/1/generate-geojson'],
    ['post', '/api/fo-routes/generate-all'],
    ['put', '/fo-points/1'],
    ['put', '/fo-routes/1'],
]);

it('rejects a regular user from FO mutation and route generation endpoints', function (string $method, string $url) {
    $user = User::factory()->create(['role' => 'complainant']);

    $this->actingAs($user)->{$method}($url)->assertForbidden();
})->with([
    ['post', '/api/fo-routes/generate-all'],
    ['put', '/fo-points/1'],
    ['put', '/fo-routes/1'],
]);

it('rejects a regular user from generating an existing FO route', function () {
    $route = FoRoute::create([
        'name' => 'Demo route',
        'path_coordinates' => [],
    ]);
    $user = User::factory()->create(['role' => 'complainant']);

    $this->actingAs($user)
        ->post("/fo-route/{$route->id}/generate-geojson")
        ->assertForbidden();
});
