import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthShell from "../components/auth/AuthShell.jsx";
import TextField from "../components/ui/TextField.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ROLE_ROUTE = { DONOR: "/donor", PATIENT: "/patient", HOSPITAL: "/hospital" };

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(ROLE_ROUTE[user.role] || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to CareBridge"
      subtitle="Access your dashboard to track cases, donations, or your care journey."
    >
      <form onSubmit={handleSubmit} className="space-y-lg">
        {error && (
          <div className="bg-error-container text-on-error-container text-body-sm px-md py-sm rounded-lg">
            {error}
          </div>
        )}

        <TextField
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="you@example.com"
        />

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-label-md text-on-surface-variant uppercase tracking-wide">
              Password
            </label>
            <a href="#reset" className="text-label-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <TextField
            id="password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-outline hover:text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </div>

        <Button type="submit" size="md" fullWidth disabled={submitting} className="!h-12">
          {submitting ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <p className="text-body-sm text-on-surface-variant text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-bold hover:underline">
          Register
        </Link>
      </p>

      <div className="pt-lg border-t border-outline-variant text-label-sm text-on-surface-variant space-y-1">
        <p className="font-bold uppercase">Demo accounts (password: password123)</p>
        <p>Hospital — citygeneralhospital@carebridge.dev</p>
        <p>Patient — patient@carebridge.dev</p>
        <p>Donor — donor@carebridge.dev</p>
      </div>
    </AuthShell>
  );
}
