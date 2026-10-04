<?php

namespace App\Mail;

use App\Models\Certificate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CertificateIssuedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Certificate $certificate
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Chứng chỉ hoàn thành khóa học LMS'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.certificate-issued'
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
