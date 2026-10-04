<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function create(Request $request, Course $course)
    {
        $user = $request->user();

        if ($course->status !== 'PUBLISHED') {
            return response()->json([
                'message' => 'Khóa học chưa được xuất bản.',
            ], 422);
        }

        if ((float) $course->price <= 0) {
            return response()->json([
                'message' => 'Khóa học này miễn phí, không cần thanh toán.',
            ], 422);
        }

        $alreadyEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json([
                'message' => 'Bạn đã đăng ký khóa học này.',
            ], 409);
        }

        $existingPayment = Payment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'PENDING')
            ->latest()
            ->first();

        if ($existingPayment) {
            return response()->json([
                'message' => 'Đã có giao dịch đang chờ thanh toán.',
                'data' => $existingPayment,
            ]);
        }

        $payment = Payment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'amount' => $course->price,
            'method' => 'MOCK',
            'status' => 'PENDING',
            'transaction_code' => 'PAY-' . Str::upper((string) Str::ulid()),
        ]);

        return response()->json([
            'message' => 'Đã tạo giao dịch.',
            'data' => $payment,
        ], 201);
    }

    public function show(Request $request, Payment $payment)
    {
        if ($payment->user_id !== $request->user()->id) {
            abort(403);
        }

        $payment->load('course');

        return response()->json([
            'data' => $payment,
        ]);
    }

    public function confirm(Request $request, Payment $payment)
    {
        $user = $request->user();

        if ($payment->user_id !== $user->id) {
            abort(403);
        }

        if ($payment->status === 'SUCCESS') {
            return response()->json([
                'message' => 'Giao dịch đã được thanh toán.',
                'data' => $payment,
            ]);
        }

        if ($payment->status !== 'PENDING') {
            return response()->json([
                'message' => 'Giao dịch không còn hợp lệ.',
            ], 422);
        }

        $result = DB::transaction(function () use ($payment, $user) {
            $lockedPayment = Payment::whereKey($payment->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedPayment->status === 'SUCCESS') {
                return $lockedPayment;
            }

            $lockedPayment->update([
                'status' => 'SUCCESS',
                'paid_at' => now(),
            ]);

            Enrollment::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'course_id' => $lockedPayment->course_id,
                ],
                [
                    'status' => 'ACTIVE',
                    'enrolled_at' => now(),
                ]
            );

            return $lockedPayment->fresh('course');
        });

        return response()->json([
            'message' => 'Thanh toán thành công. Bạn đã được ghi danh vào khóa học.',
            'data' => $result,
        ]);
    }

    public function myPayments(Request $request)
    {
        $payments = Payment::where('user_id', $request->user()->id)
            ->with('course:id,title')
            ->latest()
            ->paginate(10);

        return response()->json($payments);
    }
}
