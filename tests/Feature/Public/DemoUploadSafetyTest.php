<?php

use Illuminate\Http\UploadedFile;

it('rejects file uploads when demo storage is ephemeral', function () {
    config()->set('app.demo_disable_uploads', true);

    $this->post('/feedback', [
        'foto' => UploadedFile::fake()->image('demo.jpg'),
    ])->assertSessionHasErrors('file');
});
