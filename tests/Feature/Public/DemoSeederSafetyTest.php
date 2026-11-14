<?php

it('refuses demo seeding without a configured password before changing data', function () {
    config()->set('app.demo_mode', true);
    config()->set('app.demo_seed_password', null);

    expect(fn () => $this->artisan('db:seed'))
        ->toThrow(RuntimeException::class, 'DEMO_SEED_PASSWORD must be set');
});
