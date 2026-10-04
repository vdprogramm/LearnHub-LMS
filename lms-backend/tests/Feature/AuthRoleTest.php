<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRoleTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(string $role): User
    {
        return User::factory()->create([
            'role' => $role,
            'password' => 'Password@123',
        ]);
    }

    public function test_student_can_access_student_dashboard(): void
    {
        $student = $this->createUser('STUDENT');

        $response = $this
            ->actingAs($student, 'sanctum')
            ->getJson('/api/student/dashboard');

        $response->assertOk();
    }

    public function test_instructor_can_access_instructor_dashboard(): void
    {
        $instructor = $this->createUser('INSTRUCTOR');

        $response = $this
            ->actingAs($instructor, 'sanctum')
            ->getJson('/api/instructor/dashboard');

        $response->assertOk();
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = $this->createUser('ADMIN');

        $response = $this
            ->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/dashboard');

        $response->assertOk();
    }

    public function test_student_cannot_access_admin_dashboard(): void
    {
        $student = $this->createUser('STUDENT');

        $response = $this
            ->actingAs($student, 'sanctum')
            ->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_student_cannot_access_instructor_dashboard(): void
    {
        $student = $this->createUser('STUDENT');

        $response = $this
            ->actingAs($student, 'sanctum')
            ->getJson('/api/instructor/dashboard');

        $response->assertStatus(403);
    }

    public function test_instructor_cannot_access_admin_dashboard(): void
    {
        $instructor = $this->createUser('INSTRUCTOR');

        $response = $this
            ->actingAs($instructor, 'sanctum')
            ->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_protected_routes(): void
    {
        $this->getJson('/api/admin/dashboard')
            ->assertStatus(401);

        $this->getJson('/api/instructor/dashboard')
            ->assertStatus(401);

        $this->getJson('/api/student/dashboard')
            ->assertStatus(401);
    }
}
