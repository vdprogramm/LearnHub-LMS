<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    // GET /api/courses
    public function index(Request $request)
    {
        $courses = Course::query()
            ->with('instructor:id,name')
            ->where('status', 'PUBLISHED')
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(
                    'title',
                    'ilike',
                    '%'.$request->search.'%'
                );
            })
            ->when($request->filled('min_price'), function ($query) use ($request) {
                $query->where('price', '>=', $request->min_price);
            })
            ->when($request->filled('max_price'), function ($query) use ($request) {
                $query->where('price', '<=', $request->max_price);
            })
            ->latest()
            ->paginate(10);

        return response()->json($courses);
    }

    // GET /api/courses/{course}
    public function show(Course $course)
    {
        if ($course->status !== 'PUBLISHED') {
            $user = auth('sanctum')->user();

            if (! $user || (
                $user->role !== 'ADMIN' &&
                $course->instructor_id !== $user->id
            )) {
                return response()->json([
                    'message' => 'Không tìm thấy khóa học.',
                ], 404);
            }
        }

        return response()->json([
            'data' => $course->load([
                'instructor:id,name',
                'sections.lessons',
            ]),
        ]);
    }

    // POST /api/courses
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|url|max:2048',
            'price' => 'required|numeric|min:0',
        ]);

        $course = Course::create([
            ...$data,
            'instructor_id' => $request->user()->id,
            'slug' => Str::slug($data['title']).'-'.Str::lower(Str::random(8)),
            'status' => 'DRAFT',
        ]);

        return response()->json([
            'message' => 'Tạo khóa học thành công.',
            'data' => $course,
        ], 201);
    }

    // PUT /api/courses/{course}
    public function update(Request $request, Course $course)
    {
        if (! $this->canManage($request, $course)) {
            return response()->json([
                'message' => 'Bạn không có quyền chỉnh sửa khóa học.',
            ], 403);
        }

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|url|max:2048',
            'price' => 'sometimes|required|numeric|min:0',
        ]);

        if (isset($data['title']) && $data['title'] !== $course->title) {
            $data['slug'] = Str::slug($data['title'])
                .'-'.Str::lower(Str::random(8));
        }

        $course->update($data);

        return response()->json([
            'message' => 'Cập nhật khóa học thành công.',
            'data' => $course->fresh(),
        ]);
    }

    // DELETE /api/courses/{course}
    public function destroy(Request $request, Course $course)
    {
        if (! $this->canManage($request, $course)) {
            return response()->json([
                'message' => 'Bạn không có quyền xóa khóa học.',
            ], 403);
        }

        if ($course->enrollments()->exists()) {
            return response()->json([
                'message' => 'Không thể xóa khóa học đã có học viên đăng ký.',
            ], 409);
        }

        $course->delete();

        return response()->json([
            'message' => 'Xóa khóa học thành công.',
        ]);
    }

    // PATCH /api/courses/{course}/publish
    public function publish(Request $request, Course $course)
    {
        if (! $this->canManage($request, $course)) {
            return response()->json([
                'message' => 'Bạn không có quyền xuất bản khóa học.',
            ], 403);
        }

        if (! $course->sections()->whereHas('lessons')->exists()) {
            return response()->json([
                'message' => 'Khóa học cần có ít nhất một bài học.',
            ], 422);
        }

        $course->update([
            'status' => 'PUBLISHED',
        ]);

        return response()->json([
            'message' => 'Xuất bản khóa học thành công.',
            'data' => $course->fresh(),
        ]);
    }

    // GET /api/instructor/courses
    public function myCourses(Request $request)
    {
        $query = Course::query()
            ->withCount(['sections', 'enrollments'])
            ->latest();

        if ($request->user()->role !== 'ADMIN') {
            $query->where('instructor_id', $request->user()->id);
        }

        return response()->json(
            $query->paginate(10)
        );
    }

    private function canManage(Request $request, Course $course): bool
    {
        return $request->user()->role === 'ADMIN'
            || $course->instructor_id === $request->user()->id;
    }
}
