import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DashboardLayout from './layouts/DashboardLayout'

import StudentDashboard from './pages/student/Dashboard'
import Courses from './pages/student/Courses'
import CourseDetail from './pages/student/CourseDetail'
import MyCourses from './pages/student/MyCourses'
import Learn from './pages/student/Learn'
import Certificates from './pages/student/Certificates'
import Payment from './pages/student/Payment'

import InstructorDashboard from './pages/instructor/Dashboard'
import InstructorCourses from './pages/instructor/Courses'
import CreateCourse from './pages/instructor/CreateCourse'
import CourseEditor from './pages/instructor/CourseEditor'

import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminCourses from './pages/admin/Courses'
import AdminEnrollments from './pages/admin/Enrollments'
import AdminCertificates from './pages/admin/Certificates'

function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-6xl font-semibold text-slate-200">403</p>
        <h1 className="mt-4 text-xl font-semibold">Không có quyền truy cập</h1>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute roles={['STUDENT']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<Courses />} />
            <Route path="/student/courses/:id" element={<CourseDetail />} />
            <Route path="/student/payments/:id" element={<Payment />} />
            <Route path="/student/my-courses" element={<MyCourses />} />
            <Route path="/student/my-courses/:id" element={<Learn />} />
            <Route path="/student/certificates" element={<Certificates />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['INSTRUCTOR']} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/instructor"
              element={<InstructorDashboard />}
            />

            <Route
              path="/instructor/courses"
              element={<InstructorCourses />}
            />

            <Route
              path="/instructor/courses/new"
              element={<CreateCourse />}
            />

            <Route
              path="/instructor/courses/:id"
              element={<CourseEditor />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/courses"
              element={<AdminCourses />}
            />

            <Route
              path="/admin/enrollments"
              element={<AdminEnrollments />}
            />

            <Route
              path="/admin/certificates"
              element={<AdminCertificates />}
            />
          </Route>
        </Route>

        <Route path="/403" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  )
}
