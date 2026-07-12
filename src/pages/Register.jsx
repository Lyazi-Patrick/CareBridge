import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartHandshake, Hospital, Mail, Stethoscope, User } from "lucide-react";
import AuthShell from "../components/auth/AuthShell.jsx";
import TextField from "../components/ui/TextField.jsx";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ROLES = [
  { id: "DONOR", label: "Donor", icon: HeartHandshake, description: "Support verified patients" },
  { id: "PATIENT", label: "Patient", icon: User, description: "Get help with treatment costs" },
  { id: "HOSPITAL", label: "Hospital", icon: Hospital, description: "Submit assistance requests" },
];

const ROLE_ROUTE = { DONOR: "/donor", PATIENT: "/patient", HOSPITAL: "/hospital" };

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("DONOR");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await register({ ...form, role });
      navigate(ROLE_ROUTE[user.role] || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Join the network"
      title="Create your account"
      subtitle="Whether you're giving, receiving, or providing care — your place is here."
    >
      <form onSubmit={handleSubmit} className="space-y-lg">
        {error && (
          <div className="bg-error-container text-on-error-container text-body-sm px-md py-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-label-md text-on-surface-variant uppercase tracking-wide">
            I am a...
          </label>
          <div className="grid grid-cols-3 gap-sm">
            {ROLES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                aria-pressed={role === id}
                className={`flex flex-col items-center justify-center gap-xs h-20 rounded-lg border transition-all ${
                  role === id
                    ? "border-primary bg-primary-container/10 text-primary"
                    : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <Icon size={22} aria-hidden="true" />
                <span className="text-label-sm font-bold">{label}</span>
              </button>
            ))}
          </div>
          <p className="text-label-sm text-on-surface-variant pt-1">
            {ROLES.find((r) => r.id === role)?.description}
          </p>
        </div>

        <TextField
          id="name"
          label={role === "HOSPITAL" ? "Facility Name" : "Full Name"}
          type="text"
          icon={Stethoscope}
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder={role === "HOSPITAL" ? "e.g. City General Hospital" : "e.g. Jane Doe"}
        />

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

        <TextField
          id="password"
          label="Password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          placeholder="At least 8 characters"
        />

        <Button type="submit" size="md" fullWidth disabled={submitting} className="!h-12">
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-body-sm text-on-surface-variant text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-bold hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
