import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password too short').required('Password is required'),
});

const AdminLogin = () => {
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-8 pt-8 pb-2 text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <Logo size={56} withText={false} />
            </div>
            <h1 className="h3 text-[#111827]">Admin Login</h1>
            <p className="text-[13px] text-[#6B7280] mt-1">OM Packagings · Admin Console</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-7 space-y-5">
            <div>
              <label className="block text-[12px] font-semibold text-[#111827] mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="admin@ompack.in"
                {...register('email')}
                className={`field ${errors.email ? '!border-red' : ''}`}
              />
              {errors.email && <p className="text-red text-[12px] mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#111827] mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`field pr-10 ${errors.password ? '!border-red' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-orange"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red text-[12px] mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full !h-11 disabled:opacity-60"
            >
              {isSubmitting ? 'Logging in…' : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-[#6B7280] mt-6">
          © {new Date().getFullYear()} OM Packaging · Restricted Access
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
