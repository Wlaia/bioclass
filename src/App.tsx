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
import { CoursePlayer } from "./pages/student/CoursePlayer";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/sobre" element={<div className="p-8 text-center">Sobre Nós (Em Breve)</div>} />
        <Route path="/contato" element={<div className="p-8 text-center">Contato (Em Breve)</div>} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="students" element={<div className="p-8">Gestão de Alunos (Em Breve)</div>} />
        <Route path="instructors" element={<div className="p-8">Gestão de Professores (Em Breve)</div>} />
        <Route path="settings" element={<div className="p-8">Configurações (Em Breve)</div>} />
      </Route>



      {/* Student Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<div className="p-8">Meus Cursos (Lista completa)</div>} />
        <Route path="certificates" element={<div className="p-8">Meus Certificados</div>} />
      </Route>
      <Route path="/student/course/:courseId/learn" element={<CoursePlayer />} />

      {/* Fallback */}
      <Route path="*" element={<div className="p-8 text-center">Página não encontrada</div>} />
    </Routes >
  );
}

export default App;
