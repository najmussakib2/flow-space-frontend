/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../../../redux/store/hooks';
import { useRegisterMutation } from '../../../../redux/api/authApi';
import { setCredentials } from '../../../../redux/slices/auth.slice';


const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setCredentials(result.data));
      toast.success('Account created! Welcome to FlowSpace.');
      router.push('/');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 lg:hidden mb-6">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-indigo-500/30">
            ⚡
          </div>
          <span className="text-white font-bold text-lg">Flow<span className="text-indigo-400">Space</span></span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
        <p className="text-slate-400 text-sm">Start building with your team today</p>
      </div>

      {/* Google OAuth */}
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
        className="flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </a>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-slate-600 text-xs font-mono">or continue with email</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Full name</label>
          <input
            {...register('name')}
            type="text"
            placeholder="Alice Johnson"
            className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
          {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@company.com"
            className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
          {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 characters"
              className="w-full px-3 py-2.5 pr-10 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Confirm password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
          {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 size={15} className="animate-spin" />}
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-600">
        By creating an account you agree to our Terms of Service.
      </p>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}