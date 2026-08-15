import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { AxiosError } from 'axios';
import { registerSchema } from '../schemas/auth.schema';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorBody } from '../api/urls';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const result = registerSchema.safeParse({ email, password, confirmPassword });

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await register(result.data.email, result.data.password);
      navigate('/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorBody>;
      const code = axiosError.response?.data?.error?.code;

      if (code === 'CONFLICT') {
        setFormError('An account with that email already exists.');
      } else {
        setFormError('Something went wrong creating your account. Try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold mb-8 text-center">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              disabled={isSubmitting}
              className="w-full bg-surface text-text placeholder:text-text/40 font-body text-sm rounded-lg px-4 py-3 border border-text/10 focus:border-forge focus:outline-none transition-colors disabled:opacity-50"
            />
            {fieldErrors.email && (
              <p className="text-forge text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              disabled={isSubmitting}
              className="w-full bg-surface text-text placeholder:text-text/40 font-body text-sm rounded-lg px-4 py-3 border border-text/10 focus:border-forge focus:outline-none transition-colors disabled:opacity-50"
            />
            {fieldErrors.password && (
              <p className="text-forge text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              disabled={isSubmitting}
              className="w-full bg-surface text-text placeholder:text-text/40 font-body text-sm rounded-lg px-4 py-3 border border-text/10 focus:border-forge focus:outline-none transition-colors disabled:opacity-50"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-forge text-xs mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {formError && (
            <p className="text-forge text-sm text-center" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-forge text-bg font-body font-medium text-sm rounded-lg px-6 py-3 hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="font-body text-sm text-text/50 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-quench hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}