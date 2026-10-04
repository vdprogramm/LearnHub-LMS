<?php

namespace App\Jobs;

use App\Mail\CertificateIssuedMail;
use App\Models\Certificate;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Throwable;

class GenerateCertificateJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 120;

    public function __construct(
        public int $certificateId
    ) {}

    public function handle(): void
    {
        $certificate = Certificate::with([
            'user',
            'course',
        ])->findOrFail($this->certificateId);

        if ($certificate->status === 'ISSUED') {
            return;
        }

        $certificate->update([
            'status' => 'PENDING',
        ]);

        $certificate->issued_at = now();

        $path = 'certificates/'
            .$certificate->cert_code
            .'.pdf';

        // Sinh PDF từ Blade.
        $pdf = Pdf::loadView(
            'certificates.pdf',
            compact('certificate')
        )->setPaper('a4', 'landscape');

        // Lưu trên private disk.
        $saved = Storage::disk('local')->put(
            $path,
            $pdf->output()
        );

        if (! $saved) {
            throw new \RuntimeException(
                'Không thể lưu file chứng chỉ.'
            );
        }

        $certificate->update([
            'pdf_path' => $path,
            'status' => 'ISSUED',
            'issued_at' => $certificate->issued_at,
        ]);

        // Gửi email sau khi PDF được tạo.
        Mail::to($certificate->user->email)
            ->send(new CertificateIssuedMail($certificate));
    }

    public function failed(?Throwable $exception): void
    {
        Certificate::whereKey($this->certificateId)
            ->where('status', '!=', 'ISSUED')
            ->update([
                'status' => 'FAILED',
            ]);
    }
}
