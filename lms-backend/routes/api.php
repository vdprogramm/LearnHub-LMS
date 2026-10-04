<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\SectionController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class, 'show']);

Route::get('/certificates/verify/{code}', [CertificateController::class, 'verify']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Instructor & Admin routes
    Route::middleware(['role:INSTRUCTOR,ADMIN'])->group(function () {
        Route::get('/instructor/courses', [CourseController::class, 'myCourses']);

        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);
        Route::patch('/courses/{course}/publish', [CourseController::class, 'publish']);

        Route::post('/courses/{course}/sections', [SectionController::class, 'store']);
        Route::put('/sections/{section}', [SectionController::class, 'update']);
        Route::delete('/sections/{section}', [SectionController::class, 'destroy']);

        Route::post('/sections/{section}/lessons', [LessonController::class, 'store']);
        Route::put('/lessons/{lesson}', [LessonController::class, 'update']);
        Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy']);
    });

    // Student routes
    Route::middleware(['role:STUDENT'])->group(function () {
        Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'enroll']);
        Route::get('/my-courses', [EnrollmentController::class, 'myCourses']);
        Route::get('/my-courses/{course}', [EnrollmentController::class, 'show']);
        Route::post('/lessons/{lesson}/complete', [ProgressController::class, 'complete']);
        Route::get('/courses/{course}/progress', [ProgressController::class, 'show']);
        Route::get('/my-certificates', [CertificateController::class, 'myCertificates']);
        
        Route::post('/courses/{course}/payments', [PaymentController::class, 'create']);
        Route::get('/payments/{payment}', [PaymentController::class, 'show']);
        Route::post('/payments/{payment}/confirm', [PaymentController::class, 'confirm']);
        Route::get('/my-payments', [PaymentController::class, 'myPayments']);
    });

    // Download certificate (accessible to owner/admin, logic enforced in controller)
    Route::get('/certificates/{id}/download', [CertificateController::class, 'download']);
});

// Role Testing Routes
Route::middleware([
    'auth:sanctum',
    'role:ADMIN'
])->prefix('admin')->group(function () {

    Route::get(
        '/dashboard',
        [AdminController::class, 'dashboard']
    );

    Route::get(
        '/users',
        [AdminController::class, 'users']
    );

    Route::get(
        '/users/{user}',
        [AdminController::class, 'showUser']
    );

    Route::patch(
        '/users/{user}/role',
        [AdminController::class, 'updateRole']
    );

    Route::get(
        '/courses',
        [AdminController::class, 'courses']
    );

    Route::get(
        '/enrollments',
        [AdminController::class, 'enrollments']
    );

    Route::get(
        '/certificates',
        [AdminController::class, 'certificates']
    );
});

Route::middleware(['auth:sanctum', 'role:ADMIN,INSTRUCTOR'])
    ->get('/instructor/dashboard', function () {
        return response()->json([
            'message' => 'Welcome Instructor',
        ]);
    });

Route::middleware(['auth:sanctum', 'role:STUDENT'])
    ->get('/student/dashboard', function () {
        return response()->json([
            'message' => 'Welcome Student',
        ]);
    });
