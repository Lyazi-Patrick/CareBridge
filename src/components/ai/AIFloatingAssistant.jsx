import { useState } from "react";
import { Bot } from "lucide-react";
import Button from "../ui/Button.jsx";

/**
 * AIFloatingAssistant — the small "smart_toy" bubble from the discovery
 * mockup. Kept as its own component since it's a fixed-position overlay,
 * separate from the AIInsightPanel used for in-flow content.
 */
export default function AIFloatingAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-md md:bottom-margin-desktop right-md md:right-margin-desktop z-40 flex items-end flex-col gap-sm">
      {open && (
        <div className="glass-card p-md rounded-xl shadow-xl w-72 mb-sm border-t-4 border-primary">
          <div className="flex items-start gap-sm">
            <div className="bg-primary-container p-1.5 rounded-lg shrink-0">
              <Bot size={20} className="text-on-primary-container" aria-hidden="true" />
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface mb-xs">CareBridge Assistant</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                I can help you find a case that aligns with your impact goals. What type of cases
                are you looking for?
              </p>
            </div>
          </div>
          <Button size="sm" fullWidth className="mt-md">
            Chat Now
          </Button>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-primary text-on-primary h-14 w-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all relative"
        aria-expanded={open}
        aria-label="Toggle AI assistant"
      >
        <Bot size={26} aria-hidden="true" />
        <span className="absolute -top-1 -right-1 bg-secondary w-4 h-4 rounded-full border-2 border-white" />
      </button>
    </div>
  );
}
