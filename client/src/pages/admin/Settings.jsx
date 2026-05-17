import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Lock, Mail, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const profileSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(8, 'At least 8 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Please confirm the new password'),
});

const inputClass = 'w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)] placeholder:text-[#9CA3AF]';
const labelClass = 'block text-xs font-semibold text-navy mb-1.5 font-[family-name:var(--font-caption)]';

const ProfileForm = () => {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const onSubmit = async (data) => {
    try {
      const { data: res } = await api.patch('/auth/me', data);
      updateUser(res.user);
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Full Name</label>
        <input {...register('name')} className={inputClass} placeholder="Your name" />
        {errors.name && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.name.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Email Address</label>
        <input {...register('email')} type="email" className={inputClass} placeholder="admin@ompack.in" />
        {errors.email && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.email.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors font-[family-name:var(--font-heading)] disabled:opacity-50"
      >
        <Save size={14} /> {isSubmitting ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  );
};

const PasswordForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Current Password</label>
        <input {...register('currentPassword')} type="password" className={inputClass} placeholder="••••••••" />
        {errors.currentPassword && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.currentPassword.message}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>New Password</label>
          <input {...register('newPassword')} type="password" className={inputClass} placeholder="At least 8 characters" />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Confirm New Password</label>
          <input {...register('confirmPassword')} type="password" className={inputClass} placeholder="Re-enter new password" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-caption)]">{errors.confirmPassword.message}</p>}
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors font-[family-name:var(--font-heading)] disabled:opacity-50"
      >
        <Lock size={14} /> {isSubmitting ? 'Updating…' : 'Change Password'}
      </button>
    </form>
  );
};

const AdminSettings = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-navy font-[family-name:var(--font-heading)] mb-1">Settings</h1>
      <p className="text-om-gray text-sm mb-6 font-[family-name:var(--font-caption)]">Manage your account and security.</p>

      {/* User card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0">
          <span className="text-orange font-bold text-lg uppercase font-[family-name:var(--font-heading)]">
            {user?.name?.[0] || 'A'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-navy text-base font-[family-name:var(--font-heading)] truncate">{user?.name || 'Admin'}</p>
          <p className="text-xs text-om-gray flex items-center gap-1 font-[family-name:var(--font-caption)]">
            <Mail size={11} /> {user?.email}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 bg-orange/10 text-orange text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full font-[family-name:var(--font-caption)]">
          <Shield size={10} /> {user?.role || 'editor'}
        </span>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        <div className="flex border-b border-[#E5E7EB]">
          {[
            { key: 'profile',  icon: User, label: 'Profile' },
            { key: 'password', icon: Lock, label: 'Password' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors font-[family-name:var(--font-caption)] ${
                tab === t.key
                  ? 'text-orange border-b-2 border-orange -mb-px'
                  : 'text-om-gray hover:text-navy'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === 'profile' ? <ProfileForm /> : <PasswordForm />}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
