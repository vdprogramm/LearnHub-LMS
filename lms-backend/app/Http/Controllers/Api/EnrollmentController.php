<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnrollmentController extends Controller
{
    // POST /api/courses/{course}/enroll
    public function enroll(Request $request, Course $course)
    {
        if ($course->status !== 'PUBLISHED') {
            return response()->json([
                'message' => 'Khóa học chưa được xuất bản.',
            ], 422);
        }

        if ((float) $course->price > 0) {
            return response()->json([
                'message' => 'Khóa học trả phí cần được thanh toán trước.',
            ], 422);
        }

        if (! $course->sections()->whereHas('lessons')->exists()) {
            return response()->json([
                'message' => 'Khóa học chưa có bài học.',
            ], 422);
        }

        $user = $request->user();

        $enrollment = DB::transaction(function () use ($user, $course) {
            return Enrollment::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                ],
                [
                    'status' => 'ACTIVE',
                    'enrolled_at' => now(),
                ]
            );
        });

        if (! $enrollment->wasRecentlyCreated) {
            return response()->json([
                'message' => 'Bạn đã đăng ký khóa học này.',
                'data' => $enrollment,
            ], 409);
        }

        return response()->json([
            'message' => 'Đăng ký khóa học thành công.',
            'data' => $enrollment->load('course'),
        ], 201);
    }

    // GET /api/my-courses
    public function myCourses(Request $request)
    {
        $enrollments = Enrollment::query()
            ->where('user_id', $request->user()->id)
            ->with([
                'course:id,instructor_id,title,slug,thumbnail,price,status',
                'course.instructor:id,name',
            ])
            ->latest()
            ->paginate(10);

        return response()->json($enrollments);
    }

    // GET /api/my-courses/{course}
    public function show(Request $request, Course $course)
    {
        $enrollment = Enrollment::query()
            ->where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->first();

        if (! $enrollment) {
            return response()->json([
                'message' => 'Bạn chưa đăng ký khóa học này.',
            ], 403);
        }

        return response()->json([
            'enrollment' => $enrollment,
            'course' => $course->load([
                'instructor:id,name',
                'sections.lessons',
            ]),
        ]);
    }
}
