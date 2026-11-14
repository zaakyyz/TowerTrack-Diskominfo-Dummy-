<?php

it('allows public browsing but rejects writes in read-only demo mode', function () {
    config()->set('app.demo_read_only', true);

    $this->get('/')->assertOk();
    $this->post('/feedback', [])->assertForbidden()
        ->assertSee('Mode demo hanya untuk melihat data');
    $this->post('/login', [])->assertForbidden();
});
