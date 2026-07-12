import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-md px-md text-center">
      <h1 className="font-display-lg text-display-lg text-primary">404</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">
        This page doesn't exist.
      </p>
      <Button as={Link} to="/" size="md">
        Back to CareBridge
      </Button>
    </div>
  );
}
