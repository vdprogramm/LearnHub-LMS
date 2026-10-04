<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family:Arial,sans-serif">
    <h2>Chúc mừng {{ $certificate->user->name }}!</h2>

    <p>
        Bạn đã hoàn thành khóa học:
        <strong>{{ $certificate->course->title }}</strong>
    </p>

    <p>
        Chứng chỉ hoàn thành đã được cấp.
    </p>

    <p>
        Mã chứng chỉ:
        <strong>{{ $certificate->cert_code }}</strong>
    </p>

    <p>
        Bạn có thể đăng nhập vào LMS để tải chứng chỉ.
    </p>

    <p>Trân trọng,<br>Đội ngũ LMS</p>
</body>
</html>
