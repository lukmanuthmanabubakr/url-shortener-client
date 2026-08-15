import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { AxiosError } from 'axios';
import { loginSchema } from '../schemas/auth.schema';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorBody } from '../api/urls';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const result = loginSchema.safeParse({ email, password });

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
      await login(result.data.email, result.data.password);
      navigate('/dashboard');
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorBody>;
      const code = axiosError.response?.data?.error?.code;

      if (code === 'INVALID_CREDENTIALS') {
        setFormError('Incorrect email or password.');
      } else {
        setFormError('Something went wrong logging you in. Try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg text-text flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold mb-8 text-center">Log in</h1>

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
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="font-body text-sm text-text/50 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-quench hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}