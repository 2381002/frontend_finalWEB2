import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import PostCreate from './pages/PostCreate';
import PostManager from './pages/PostManager';
import LandingPage from './pages/LandingPage';
import TagList from './pages/TagList';
import Register from './pages/Register';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import { AuthProvider, useAuth } from './utils/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostEdit from './pages/PostEdit';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RequireAuth><MainLayout isLoggedIn={isAuthenticated} onLogout={logout} /></RequireAuth>}>
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/create" element={<PostCreate />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/tags" element={<TagList />} />
        <Route path="/posts/manage" element={<PostManager />} />
        <Route path="/posts/edit/:id" element={<PostEdit />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
