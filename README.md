# LearnHub - Learning Management System

LearnHub là hệ thống quản lý học tập (Learning Management System - LMS) được xây dựng theo kiến trúc API-first với Laravel REST API và React.

Hệ thống hỗ trợ ba vai trò chính:

- Admin
- Instructor
- Student

Vai trò                     Email                                    Mật khẩu
Admin                     admin@lms.com                            Admin@123
Instructor                instructor@lms.com                       Instructor@123
Student                   student@lms.com                          12345678*




Các chức năng chính bao gồm quản lý khóa học, chương và bài học, đăng ký khóa học, theo dõi tiến độ học tập, thanh toán khóa học, cấp chứng chỉ PDF và quản trị hệ thống.

---

## 1. Technology Stack

### Backend

- PHP
- Laravel
- Laravel Sanctum
- PostgreSQL
- Eloquent ORM
- Laravel Queue
- Database Queue Driver
- DomPDF
- REST API

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- Lucide React

---

## 2. Project Structure

```text
LMS/
│
├── lms-backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   ├── Jobs/
│   │   ├── Mail/
│   │   └── Models/
│   │
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │
│   ├── resources/
│   │   └── views/
│   │
│   ├── routes/
│   │   └── api.php
│   │
│   └── tests/
│
├── lms-frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── pages/
│   │       ├── auth/
│   │       ├── student/
│   │       ├── instructor/
│   │       └── admin/
│   │
│   └── package.json
│
└── README.md
```

---

# 3. System Roles

## Student

Student có thể:

- Đăng ký tài khoản
- Đăng nhập
- Xem danh sách khóa học
- Xem chi tiết khóa học
- Đăng ký khóa học miễn phí
- Thanh toán khóa học trả phí
- Xem các khóa học đã đăng ký
- Học từng lesson
- Đánh dấu hoàn thành lesson
- Theo dõi tiến độ khóa học
- Hoàn thành khóa học
- Nhận chứng chỉ
- Tải chứng chỉ PDF

## Instructor

Instructor có thể:

- Đăng nhập
- Xem dashboard
- Xem các khóa học của mình
- Tạo khóa học
- Chỉnh sửa khóa học
- Tạo section
- Tạo lesson
- Quản lý nội dung khóa học
- Xóa section/lesson khi hợp lệ
- Publish khóa học

## Admin

Admin có thể:

- Xem dashboard hệ thống
- Theo dõi số lượng user
- Theo dõi số lượng khóa học
- Theo dõi enrollment
- Theo dõi certificate
- Xem danh sách người dùng
- Thay đổi role người dùng
- Xem toàn bộ khóa học
- Xem danh sách đăng ký học
- Xem danh sách chứng chỉ

---

# 4. Main Business Flow

## Course Flow

```text
Instructor
    |
    v
Create Course
    |
    v
Create Sections
    |
    v
Create Lessons
    |
    v
Publish Course
    |
    v
Student can access the course
```

## Learning Flow

```text
Student
   |
   v
Browse Courses
   |
   v
Enroll
   |
   v
Start Learning
   |
   v
Complete Lessons
   |
   v
Progress reaches 100%
   |
   v
Course Completed
   |
   v
Certificate Created
```

---

# 5. Payment Flow

Khóa học miễn phí có thể được đăng ký trực tiếp.

```text
Free Course
    |
    v
Enroll
    |
    v
Enrollment Created
```

Đối với khóa học trả phí:

```text
Paid Course
    |
    v
Create Payment
    |
    v
PENDING
    |
    v
Confirm Payment
    |
    v
SUCCESS
    |
    v
Enrollment Created
    |
    v
Start Learning
```

Phiên bản hiện tại sử dụng mock payment để mô phỏng quy trình thanh toán trong môi trường phát triển.

Payment được thiết kế tách biệt khỏi Enrollment để có thể tích hợp cổng thanh toán thực tế trong tương lai.

---

# 6. Certificate & Queue Processing

Khi Student hoàn thành 100% khóa học, hệ thống tạo Certificate.

```text
Complete final lesson
        |
        v
Progress = 100%
        |
        v
Enrollment = COMPLETED
        |
        v
Certificate = PENDING
        |
        v
Dispatch Queue Job
        |
        v
Generate PDF
        |
        v
Certificate = ISSUED
        |
        v
Student downloads PDF
```

Việc tạo PDF được xử lý bằng Laravel Queue nhằm tránh làm chậm request hoàn thành bài học.

Queue worker:

```bash
php artisan queue:work database --tries=3 --timeout=120
```

Trong môi trường production, queue worker cần được cấu hình chạy liên tục bằng process manager phù hợp.

---

# 7. Authentication & Authorization

Hệ thống sử dụng Laravel Sanctum.

Frontend gửi token:

```http
Authorization: Bearer <token>
```

Các route được bảo vệ bằng:

```php
auth:sanctum
```

và Role-Based Access Control:

```php
role:ADMIN
role:INSTRUCTOR
role:STUDENT
```

Ví dụ:

```text
Student
→ Student APIs

Instructor
→ Course Management APIs

Admin
→ Administration APIs
```

---

# 8. Database

Database:

```text
PostgreSQL
```

Các bảng nghiệp vụ chính:

```text
users
courses
sections
lessons
enrollments
lesson_progress
certificates
payments
jobs
```

Ngoài ra Laravel có thể tạo các bảng hệ thống như:

```text
personal_access_tokens
failed_jobs
job_batches
migrations
```

---

# 9. Main API Endpoints

## Authentication

```http
POST /api/register
POST /api/login
GET  /api/me
POST /api/logout
```

## Courses

```http
GET    /api/courses
GET    /api/courses/{id}
POST   /api/courses
PUT    /api/courses/{id}
DELETE /api/courses/{id}

PATCH /api/courses/{id}/publish
```

## Sections

```http
POST   /api/courses/{course}/sections
PUT    /api/sections/{section}
DELETE /api/sections/{section}
```

## Lessons

```http
POST   /api/sections/{section}/lessons
PUT    /api/lessons/{lesson}
DELETE /api/lessons/{lesson}

POST /api/lessons/{lesson}/complete
```

## Enrollment

```http
POST /api/courses/{course}/enroll

GET /api/my-courses
GET /api/my-courses/{course}
```

## Progress

```http
GET /api/courses/{course}/progress
```

## Certificate

```http
GET /api/my-certificates
GET /api/certificates/{id}/download

GET /api/certificates/verify/{code}
```

## Payment

```http
POST /api/courses/{course}/payments
GET  /api/payments/{payment}
POST /api/payments/{payment}/confirm
GET  /api/my-payments
```

## Instructor

```http
GET /api/instructor/dashboard
GET /api/instructor/courses
```

## Admin

```http
GET   /api/admin/dashboard

GET   /api/admin/users
GET   /api/admin/users/{user}
PATCH /api/admin/users/{user}/role

GET /api/admin/courses
GET /api/admin/enrollments
GET /api/admin/certificates
```

---

# 10. Backend Installation

Đi đến backend:

```bash
cd lms-backend
```

Cài dependencies:

```bash
composer install
```

Tạo file `.env` nếu chưa có:

```bash
cp .env.example .env
```

Trên Windows có thể copy thủ công `.env.example` thành `.env`.

Generate application key:

```bash
php artisan key:generate
```

Cấu hình PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=lms
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Queue:

```env
QUEUE_CONNECTION=database
```

Mail development:

```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@lms.local
MAIL_FROM_NAME="LearnHub"
```

Chạy migration:

```bash
php artisan migrate
```

Khởi động backend:

```bash
php artisan serve
```

Backend mặc định:

```text
http://127.0.0.1:8000
```

---

# 11. Queue Worker

Mở terminal riêng:

```bash
cd lms-backend
```

Chạy:

```bash
php artisan queue:work database --tries=3 --timeout=120
```

Queue worker được sử dụng cho các tác vụ bất đồng bộ như tạo Certificate PDF.

Sau khi thay đổi code của Job, nên restart worker:

```bash
php artisan queue:restart
```

---

# 12. Frontend Installation

Đi đến frontend:

```bash
cd lms-frontend
```

Cài dependencies:

```bash
npm install
```

Khởi động development server:

```bash
npm run dev
```

Frontend thường chạy tại:

```text
http://localhost:5173
```

Backend API:

```text
http://127.0.0.1:8000/api
```

---

# 13. Running the Project

Khi phát triển local nên mở 3 terminal.

### Terminal 1 - Laravel API

```bash
cd lms-backend
php artisan serve
```

### Terminal 2 - Queue Worker

```bash
cd lms-backend
php artisan queue:work database --tries=3 --timeout=120
```

### Terminal 3 - React

```bash
cd lms-frontend
npm run dev
```

Sau đó truy cập:

```text
http://localhost:5173
```

---

# 14. Demo Accounts

## Admin

```text
Email: admin@lms.com
Password: Admin@123
```

## Instructor

```text
Email: instructor@lms.com
Password: Instructor@123
```

## Student

Tài khoản Student có thể được tạo trực tiếp từ màn hình Register.

Nếu sử dụng tài khoản seed/test, kiểm tra thông tin tương ứng trong database/seeder của môi trường hiện tại.

---

# 15. Testing

Chạy toàn bộ Laravel tests:

```bash
php artisan test
```

Hệ thống có automated tests cho authentication và role-based authorization.

Các trường hợp quan trọng cần kiểm thử:

```text
Guest cannot access protected APIs

Student cannot access Instructor APIs

Student cannot access Admin APIs

Instructor can manage owned courses

Instructor cannot manage another instructor's course

Admin can access administration APIs

Student can enroll in published courses

Student cannot access courses without enrollment

Student can complete lessons

100% progress creates certificate

Certificate PDF is generated by Queue
```

Frontend production build:

```bash
npm run build
```

---

# 16. Security

Các cơ chế bảo vệ chính:

- Laravel Sanctum authentication
- Role-Based Access Control
- Course ownership validation
- Enrollment validation
- Certificate ownership validation
- Server-side course price validation
- Database transactions
- Row locking for critical operations
- Protected certificate downloads

Frontend không được coi là lớp bảo mật chính.

Tất cả authorization quan trọng đều được kiểm tra lại tại backend.

---

# 17. Important Development Notes

Không commit file `.env`.

Không commit:

```text
vendor/
node_modules/
```

Sau khi thay đổi Queue Job hoặc cấu hình Queue:

```bash
php artisan queue:restart
```

Khi Certificate ở trạng thái:

```text
PENDING
```

hãy kiểm tra queue worker có đang chạy hay không.

Khi Certificate chuyển thành:

```text
ISSUED
```

file PDF đã được tạo thành công và có thể tải xuống.

---

# 18. Current Payment Implementation

Payment hiện tại là mock payment dành cho development/demo.

Nó không thực hiện giao dịch tiền thật.

Mục đích của module này là mô phỏng đúng business flow:

```text
Create transaction
→ Pending
→ Payment confirmation
→ Success
→ Enrollment
```

Trong production, module này có thể được thay bằng payment gateway thực tế như PayOS, VNPay hoặc một nhà cung cấp khác.

---

# 19. Future Improvements

Một số hướng phát triển tiếp theo:

- Real payment gateway
- Email service production
- Course reviews
- Search and filtering nâng cao
- Instructor revenue statistics
- Admin reporting
- Object storage cho course files
- Video hosting
- Refresh token / secure cookie authentication
- Queue monitoring
- Docker deployment
- CI/CD
- Automated integration tests

---

# 20. Project Purpose

Dự án được xây dựng nhằm thực hành các kỹ năng Backend và Full-stack:

- REST API design
- Authentication
- Authorization
- RBAC
- Relational database design
- Laravel Eloquent
- Database transaction
- Concurrency control
- Asynchronous processing
- Queue
- PDF generation
- React frontend integration
- API state management
- Error handling
- Role-based UI

---

## License

This project is intended for educational and portfolio purposes.