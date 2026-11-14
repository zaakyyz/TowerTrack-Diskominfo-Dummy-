<?php

use App\Models\FoRoute;
use Illuminate\Support\Facades\Http;

it('serves a synthetic demo polyline without calling the routing service or saving GeoJSON', function () {
    config()->set('app.demo_mode', true);
    Http::fake();

    $route = FoRoute::create([
        'name' => 'Synthetic demo route',
        'path_coordinates' => [
            ['lng' => 110.4, 'lat' => -7.1],
            ['lng' => 110.41, 'lat' => -7.11],
        ],
    ]);

    $this->getJson("/api/fo-routes/{$route->id}/polyline")
        ->assertOk()
        ->assertJsonPath('tokens_consumed', 0)
        ->assertJsonPath('data.was_generated_on_demand', false);

    Http::assertNothingSent();
    expect($route->fresh()->geojson)->toBeNull();
});
