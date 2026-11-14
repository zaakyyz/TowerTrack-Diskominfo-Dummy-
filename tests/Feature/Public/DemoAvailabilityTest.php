<?php

it('shows a preparation response before the demo database is ready', function () {
    config()->set('app.demo_ready', false);

    $this->get('/')
        ->assertStatus(503)
        ->assertHeader('X-Robots-Tag', 'noindex')
        ->assertSee('TowerTrack demo sedang disiapkan');
});
