<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page { margin: 25px; }

        body {
            font-family: DejaVu Sans, sans-serif;
            text-align: center;
            color: #243047;
        }

        .certificate {
            border: 8px solid #233b65;
            padding: 45px 25px;
            height: 470px;
        }

        h1 {
            font-size: 29px;
            color: #233b65;
        }

        .name {
            font-size: 26px;
            font-weight: bold;
            margin: 25px 0;
        }

        .course {
            font-size: 21px;
            color: #176b87;
            font-weight: bold;
        }

        .footer {
            margin-top: 55px;
            font-size: 12px;
        }
    </style>
</head>
<body>
<div class="certificate">
    <h1>CHỨNG NHẬN HOÀN THÀNH</h1>

    <p>Nền tảng học trực tuyến LMS</p>

    <p>Chứng nhận học viên</p>

    <div class="name">{{ $certificate->user->name }}</div>

    <p>Đã hoàn thành khóa học</p>

    <div class="course">
        {{ $certificate->course->title }}
    </div>

    <div class="footer">
        <p>
            Ngày cấp:
            {{ $certificate->issued_at->format('d/m/Y') }}
        </p>

        <p>
            Mã chứng chỉ:
            {{ $certificate->cert_code }}
        </p>
    </div>
</div>
</body>
</html>
