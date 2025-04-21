import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { useForm } from "react-hook-form";
import AxiosInstance from "../utils/AxiosInstance";
import { useMutation } from "@tanstack/react-query";

export type LoginInput = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>();

  const handleLogin = async (data: LoginInput) => {
    try {
      const res = await AxiosInstance.post<{ access_token: string }>(
        "/api/auth/login",
        {
          email: data.email,
          password: data.password
        }
      );
      console.log(res.data);
      if (res.data) {
        login(res.data.access_token);
        localStorage.setItem('access_token', res.data.access_token);
        // Fetch user profile to get userId
        try {
          const profileRes = await AxiosInstance.get('/api/auth/me');
          if (!profileRes.data.id) {
            alert('Gagal mengambil user ID. Silakan login ulang.');
            logout();
            return;
          }
          localStorage.setItem('userId', profileRes.data.id);
        } catch (profileErr) {
          console.error('Failed to fetch user profile:', profileErr);
          alert('Gagal mengambil data user. Silakan login ulang.');
          logout();
          return;
        }
        navigate('/posts');
      } else {
        alert("Username or password is wrong");
      }
    } catch (err) {
      alert("Username or password is wrong");
    }
  };
  const { mutate, isPending } = useMutation({
    mutationFn: handleLogin
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md mx-auto py-16 px-4">
        <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 drop-shadow-lg">Login</h1>
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md relative">
          {isPending && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20 rounded-2xl">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <form
            className="space-y-5"
            onSubmit={handleSubmit((data) => mutate(data))}
          >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600 text-xs italic" id="titleError">
                Email is required.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-600 text-xs italic" id="titleError">
                Password is required.
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => {
              navigate("/register");
            }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  </div>
  );
};

export default Login;
