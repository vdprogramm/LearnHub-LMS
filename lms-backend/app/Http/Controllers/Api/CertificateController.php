<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    // GET /api/my-certificates
    public function myCertificates(Request $request)
    {
        return response()->json(
            Certificate::query()
                ->where('user_id', $request->user()->id)
                ->with('course:id,title')
                ->latest()
                ->paginate(10)
        );
    }

    // GET /api/certificates/{id}/download
    public function download(Request $request, int $id)
    {
        $certificate = Certificate::findOrFail($id);

        $user = $request->user();

        if (
            $user->role !== 'ADMIN' &&
            $certificate->user_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Bạn không có quyền tải chứng chỉ.',
            ], 403);
        }

        if (
            $certificate->status !== 'ISSUED' ||
            ! $certificate->pdf_path
        ) {
            return response()->json([
                'message' => 'Chứng chỉ chưa sẵn sàng.',
            ], 409);
        }

        $disk = Storage::disk('local');

        if (! $disk->exists($certificate->pdf_path)) {
            return response()->json([
                'message' => 'Không tìm thấy file chứng chỉ.',
            ], 404);
        }

        return $disk->download(
            $certificate->pdf_path,
            $certificate->cert_code.'.pdf'
        );
    }

    // GET /api/certificates/verify/{code}
    public function verify(string $code)
    {
        $certificate = Certificate::query()
            ->where('cert_code', $code)
            ->where('status', 'ISSUED')
            ->with([
                'user:id,name',
                'course:id,title',
            ])
            ->first();

        if (! $certificate) {
            return response()->json([
                'valid' => false,
                'message' => 'Chứng chỉ không hợp lệ.',
            ], 404);
        }

        return response()->json([
            'valid' => true,
            'data' => [
                'cert_code' => $certificate->cert_code,
                'student_name' => $certificate->user->name,
                'course_title' => $certificate->course->title,
                'issued_at' => $certificate->issued_at,
            ],
        ]);
    }
}
