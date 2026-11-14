<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = config('app.demo_mode') ? config('app.demo_seed_password') : 'password123';

        // Create 1 admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@kominfo.go.id',
            'role' => 'admin',
            'password' => Hash::make($password),
        ]);

        // Create operator users
        User::factory()->create([
            'name' => 'Operator',
            'email' => 'operator@kominfo.go.id',
            'role' => 'operator',
            'password' => Hash::make($password),
        ]);

        // Create complainant users
        User::factory()->create([
            'name' => 'Compainant',
            'email' => 'complainant@example.com',
            'role' => 'complainant',
            'password' => Hash::make($password),
        ]);


    }
}
