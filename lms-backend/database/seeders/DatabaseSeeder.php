<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@lms.com'],
            [
                'name' => 'LMS Admin',
                'password' => Hash::make('Admin@123'),
                'role' => 'ADMIN',
            ]
        );

        User::updateOrCreate(
            ['email' => 'instructor@lms.com'],
            [
                'name' => 'LMS Instructor',
                'password' => Hash::make('Instructor@123'),
                'role' => 'INSTRUCTOR',
            ]
        );

        User::updateOrCreate(
            ['email' => 'student@lms.com'],
            [
                'name' => 'Student Test',
                'password' => Hash::make('Student@123'),
                'role' => 'STUDENT',
            ]
        );
    }
}
