<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    // POST /api/courses/{course}/sections
    public function store(Request $request, Course $course)
    {
        if (! $this->canManage($request, $course)) {
            return response()->json([
                'message' => 'Bạn không có quyền quản lý khóa học.',
            ], 403);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $section = $course->sections()->create($data);

        return response()->json([
            'message' => 'Tạo chương học thành công.',
            'data' => $section,
        ], 201);
    }

    // PUT /api/sections/{section}
    public function update(Request $request, Section $section)
    {
        if (! $this->canManage($request, $section->course)) {
            return response()->json([
                'message' => 'Bạn không có quyền chỉnh sửa chương học.',
            ], 403);
        }

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $section->update($data);

        return response()->json([
            'message' => 'Cập nhật chương học thành công.',
            'data' => $section->fresh(),
        ]);
    }

    // DELETE /api/sections/{section}
    public function destroy(Request $request, Section $section)
    {
        if (! $this->canManage($request, $section->course)) {
            return response()->json([
                'message' => 'Bạn không có quyền xóa chương học.',
            ], 403);
        }

        // Tránh xóa tiến độ học tập của học viên.
        if ($section->lessons()->whereHas('progress')->exists()) {
            return response()->json([
                'message' => 'Không thể xóa chương đã có tiến độ học tập.',
            ], 409);
        }

        $section->delete();

        return response()->json([
            'message' => 'Xóa chương học thành công.',
        ]);
    }

    private function canManage(Request $request, Course $course): bool
    {
        return $request->user()->role === 'ADMIN'
            || $course->instructor_id === $request->user()->id;
    }
}
