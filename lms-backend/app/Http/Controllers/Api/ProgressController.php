<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateCertificateJob;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProgressController extends Controller
{
    // POST /api/lessons/{lesson}/complete
    public function complete(Request $request, Lesson $lesson)
    {
        $course = $lesson->section->course;
        $user = $request->user();

        return DB::transaction(function () use ($user, $lesson, $course) {

            // Khóa bản ghi Enrollment để tránh cập nhật đồng thời.
            $enrollment = Enrollment::query()
                ->where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->lockForUpdate()
                ->first();

            if (! $enrollment) {
                return response()->json([
                    'message' => 'Bạn chưa đăng ký khóa học.',
                ], 403);
            }

            if ($enrollment->status === 'COMPLETED') {
                return response()->json([
                    'message' => 'Khóa học đã hoàn thành.',
                    'progress' => 100,
                ]);
            }

            // Đếm tổng bài học của khóa học.
            $totalLessons = Lesson::query()
                ->whereHas('section', function ($query) use ($course) {
                    $query->where('course_id', $course->id);
                })
                ->count();

            if ($totalLessons === 0) {
                return response()->json([
                    'message' => 'Khóa học chưa có bài học.',
                ], 422);
            }

            // Lưu tiến độ, không tạo trùng.
            LessonProgress::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'lesson_id' => $lesson->id,
                ],
                [
                    'is_completed' => true,
                    'completed_at' => now(),
                ]
            );

            // Đếm số bài học đã hoàn thành.
            $completedLessons = LessonProgress::query()
                ->where('user_id', $user->id)
                ->where('is_completed', true)
                ->whereHas('lesson.section', function ($query) use ($course) {
                    $query->where('course_id', $course->id);
                })
                ->count();

            $percentage = round(
                ($completedLessons / $totalLessons) * 100,
                2
            );

            $isCompleted = $completedLessons === $totalLessons;

            if ($isCompleted) {
                $enrollment->update([
                    'status' => 'COMPLETED',
                    'completed_at' => now(),
                ]);

                // Unique constraint ngăn cấp trùng chứng chỉ.
                $certificate = Certificate::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'course_id' => $course->id,
                    ],
                    [
                        'cert_code' => 'LMS-'
                            .Str::upper((string) Str::ulid()),
                        'status' => 'PENDING',
                    ]
                );

                // Chỉ dispatch khi chứng chỉ vừa được tạo.
                if ($certificate->wasRecentlyCreated) {
                    GenerateCertificateJob::dispatch(
                        $certificate->id
                    )->afterCommit();
                }
            }

            return response()->json([
                'message' => $isCompleted
                    ? 'Chúc mừng! Bạn đã hoàn thành khóa học.'
                    : 'Hoàn thành bài học thành công.',

                'data' => [
                    'course_id' => $course->id,
                    'lesson_id' => $lesson->id,
                    'total_lessons' => $totalLessons,
                    'completed_lessons' => $completedLessons,
                    'progress' => $percentage,
                    'course_completed' => $isCompleted,
                ],
            ]);
        });
    }

    // GET /api/courses/{course}/progress
    public function show(Request $request, Course $course)
    {
        $user = $request->user();

        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if (! $enrollment) {
            return response()->json([
                'message' => 'Bạn chưa đăng ký khóa học.',
            ], 403);
        }

        $totalLessons = Lesson::query()
            ->whereHas('section', function ($query) use ($course) {
                $query->where('course_id', $course->id);
            })
            ->count();

        $completedLessons = LessonProgress::query()
            ->where('user_id', $user->id)
            ->where('is_completed', true)
            ->whereHas('lesson.section', function ($query) use ($course) {
                $query->where('course_id', $course->id);
            })
            ->count();

        $percentage = $totalLessons > 0
            ? round(($completedLessons / $totalLessons) * 100, 2)
            : 0;

        return response()->json([
            'data' => [
                'course_id' => $course->id,
                'status' => $enrollment->status,
                'total_lessons' => $totalLessons,
                'completed_lessons' => $completedLessons,
                'progress' => $percentage,
                'completed_at' => $enrollment->completed_at,
            ],
        ]);
    }
}
