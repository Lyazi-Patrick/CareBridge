import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { createDonation } from "../../services/donationsService.js";

const PRESET_AMOUNTS = [25, 50, 100, 250];

/**
 * DonateModal — the "Donate Now" flow on Case Details. Requires a logged-in
 * DONOR account; sends unauthenticated/wrong-role users to login/register
 * rather than silently failing.
 */
export default function DonateModal({ medicalCase, onClose, onDonated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [error, setError] = useState(null);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  async function handleDonate() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "DONOR") {
      setError("Only donor accounts can make a gift. Log in with a donor account to continue.");
      return;
    }
    if (!finalAmount || finalAmount <= 0) {
      setError("Enter an amount greater than $0.");
      return;
    }

    setStatus("submitting");
    setError(null);
    try {
      const result = await createDonation({ caseId: medicalCase.id, amount: finalAmount });
      setStatus("done");
      onDonated?.(result.updatedCase);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div className="bg-white rounded-3xl p-xl max-w-[28rem] w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-lg right-lg text-outline hover:text-on-surface"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {status === "done" ? (
          <div className="text-center space-y-md py-md">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} className="text-secondary" aria-hidden="true" />
            </div>
            <h2 className="font-headline-md text-headline-md">Thank you for your gift!</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Your ${finalAmount} donation to {medicalCase.patientName}'s case has been recorded.
            </p>
            <Button size="md" fullWidth onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <h2 className="font-headline-md text-headline-md mb-xs">Support {medicalCase.patientName}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">
              100% of your gift goes toward {medicalCase.condition} treatment at {medicalCase.hospital}.
            </p>

            {error && (
              <div className="bg-error-container text-on-error-container text-body-sm px-md py-sm rounded-lg mb-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-4 gap-sm mb-md">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount("");
                  }}
                  className={`py-sm rounded-lg font-bold border transition-all ${
                    amount === preset && !customAmount
                      ? "border-primary bg-primary-container/10 text-primary"
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            <div className="relative mb-lg">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">
                $
              </span>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom amount"
                className="w-full bg-white border border-outline-variant rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            <Button size="lg" fullWidth disabled={status === "submitting"} onClick={handleDonate}>
              {status === "submitting" ? "Processing..." : `Donate $${finalAmount || 0}`}
            </Button>

            {!user && (
              <p className="text-label-sm text-on-surface-variant text-center mt-md">
                You'll need to log in with a donor account first.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
