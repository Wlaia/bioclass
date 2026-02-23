import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Home } from "./pages/Home";
import { Courses } from "./pages/Courses";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCourses } from "./pages/admin/AdminCourses";
import { StudentLayout } from "./components/layout/StudentLayout";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { StudentCourses } from "./pages/student/StudentCourses";
import { Certificate } from "./pages/student/Certificate";
import { CoursePlayer } from "./pages/student/CoursePlayer";
import { StudentSettings } from "./pages/student/Settings";
import { CourseForm } from "./pages/admin/CourseForm";
import { AdminEnrollments } from "./pages/admin/AdminEnrollments";
import { AdminStudents } from "./pages/admin/AdminStudents";
import { AdminFinance } from "./pages/admin/AdminFinance";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/materiais" element={<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"><h2 className="text-4xl font-bold text-gray-900 mb-2">Página em Construção</h2><p className="text-gray-500">Estamos preparando novidades para você.</p></div>} />
        <Route path="/sobre" element={<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"><h2 className="text-4xl font-bold text-gray-900 mb-2">Página em Construção</h2><p className="text-gray-500">Estamos preparando novidades para você.</p></div>} />
        <Route path="/contato" element={<div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"><h2 className="text-4xl font-bold text-gray-900 mb-2">Página em Construção</h2><p className="text-gray-500">Estamos preparando novidades para você.</p></div>} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      {/* ... existing imports */}

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="courses/new" element={<CourseForm />} />
        <Route path="courses/:id/edit" element={<CourseForm />} />
        <Route path="users" element={<AdminStudents />} />
        <Route path="students" element={<AdminEnrollments />} />
        <Route path="finance" element={<AdminFinance />} />
        <Route path="instructors" element={<div className="p-8">Gestão de Professores (Em Breve)</div>} />
        <Route path="settings" element={<div className="p-8">Configurações (Em Breve)</div>} />
      </Route>



      {/* Student Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="certificates" element={<div className="p-8">Meus Certificados</div>} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>
      <Route path="/student/course/:courseId/learn" element={<CoursePlayer />} />
      <Route path="/student/certificates/:id" element={<Certificate />} />

      {/* Fallback */}
      <Route path="*" element={<div className="p-8 text-center">Página não encontrada</div>} />
    </Routes >
  );
}

export default App;
