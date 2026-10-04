<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    // GET /api/admin/dashboard
    public function dashboard()
    {
        return response()->json([
            'data' => [
                'total_users' => User::count(),
                'total_students' => User::where('role', 'STUDENT')->count(),
                'total_instructors' => User::where('role', 'INSTRUCTOR')->count(),

                'total_courses' => Course::count(),
                'published_courses' => Course::where('status', 'PUBLISHED')->count(),
                'draft_courses' => Course::where('status', 'DRAFT')->count(),

                'total_enrollments' => Enrollment::count(),
                'completed_enrollments' =>
                    Enrollment::where('status', 'COMPLETED')->count(),

                'total_certificates' => Certificate::count(),
                'issued_certificates' =>
                    Certificate::where('status', 'ISSUED')->count(),
            ]
        ]);
    }

    // GET /api/admin/users
    public function users(Request $request)
    {
        $users = User::query()
            ->select([
                'id',
                'name',
                'email',
                'role',
                'created_at'
            ])
            ->when(
                $request->filled('role'),
                fn ($query) =>
                    $query->where('role', strtoupper($request->role))
            )
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->search;

                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'ilike', "%{$search}%")
                          ->orWhere('email', 'ilike', "%{$search}%");
                    });
                }
            )
            ->latest()
            ->paginate(10);

        return response()->json($users);
    }

    // GET /api/admin/users/{user}
    public function showUser(User $user)
    {
        return response()->json([
            'data' => $user->loadCount([
                'enrollments',
                'certificates'
            ])
        ]);
    }

    // PATCH /api/admin/users/{user}/role
    public function updateRole(Request $request, User $user)
    {
        $data = $request->validate([
            'role' => [
                'required',
                Rule::in([
                    'ADMIN',
                    'INSTRUCTOR',
                    'STUDENT'
                ])
            ]
        ]);

        // Không cho Admin tự hạ quyền chính mình.
        if (
            $request->user()->id === $user->id &&
            $data['role'] !== 'ADMIN'
        ) {
            return response()->json([
                'message' => 'Admin không thể tự hạ quyền tài khoản của mình.'
            ], 422);
        }

        $user->update([
            'role' => $data['role']
        ]);

        // Thu hồi token cũ để role mới có hiệu lực an toàn.
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Cập nhật vai trò thành công.',
            'data' => $user->only([
                'id',
                'name',
                'email',
                'role'
            ])
        ]);
    }

    // GET /api/admin/courses
    public function courses(Request $request)
    {
        $courses = Course::query()
            ->with('instructor:id,name,email')
            ->withCount([
                'sections',
                'enrollments'
            ])
            ->when(
                $request->filled('status'),
                fn ($query) =>
                    $query->where(
                        'status',
                        strtoupper($request->status)
                    )
            )
            ->latest()
            ->paginate(10);

        return response()->json($courses);
    }

    // GET /api/admin/enrollments
    public function enrollments()
    {
        return response()->json(
            Enrollment::query()
                ->with([
                    'user:id,name,email',
                    'course:id,title'
                ])
                ->latest()
                ->paginate(10)
        );
    }

    // GET /api/admin/certificates
    public function certificates()
    {
        return response()->json(
            Certificate::query()
                ->with([
                    'user:id,name,email',
                    'course:id,title'
                ])
                ->latest()
                ->paginate(10)
        );
    }
}
