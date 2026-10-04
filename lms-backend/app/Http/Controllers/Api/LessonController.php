<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Section;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    // POST /api/sections/{section}/lessons
    public function store(Request $request, Section $section)
    {
        if (! $this->canManage($request, $section->course)) {
            return response()->json([
                'message' => 'Bạn không có quyền thêm bài học.',
            ], 403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url|max:2048',
            'duration' => 'sometimes|integer|min:0',
            'sort_order' => 'sometimes|integer|min:0',
            'is_preview' => 'sometimes|boolean',
        ]);

        $lesson = $section->lessons()->create($data);

        return response()->json([
            'message' => 'Tạo bài học thành công.',
            'data' => $lesson,
        ], 201);
    }

    // PUT /api/lessons/{lesson}
    public function update(Request $request, Lesson $lesson)
    {
        $course = $lesson->section->course;

        if (! $this->canManage($request, $course)) {
            return response()->json([
                'message' => 'Bạn không có quyền chỉnh sửa bài học.',
            ], 403);
        }

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url|max:2048',
            'duration' => 'sometimes|integer|min:0',
            'sort_order' => 'sometimes|integer|min:0',
            'is_preview' => 'sometimes|boolean',
        ]);

        $lesson->update($data);

        return response()->json([
            'message' => 'Cập nhật bài học thành công.',
            'data' => $lesson->fresh(),
        ]);
    }

    // DELETE /api/lessons/{lesson}
    public function destroy(Request $request, Lesson $lesson)
    {
        $course = $lesson->section->course;

        if (! $this->canManage($request, $course)) {
            return response()->json([
                'message' => 'Bạn không có quyền xóa bài học.',
            ], 403);
        }

        if ($lesson->progress()->exists()) {
            return response()->json([
                'message' => 'Không thể xóa bài học đã có tiến độ học tập.',
            ], 409);
        }

        $lesson->delete();

        return response()->json([
            'message' => 'Xóa bài học thành công.',
        ]);
    }

    private function canManage(Request $request, Course $course): bool
    {
        return $request->user()->role === 'ADMIN'
            || $course->instructor_id === $request->user()->id;
    }
}
