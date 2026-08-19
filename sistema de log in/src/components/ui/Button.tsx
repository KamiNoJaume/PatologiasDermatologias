import { SpinnerIcon } from "@/components/ui/Icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
    secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary",
    danger: "bg-danger text-white hover:bg-red-700 focus:ring-danger",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <SpinnerIcon />}
      {children}
    </button>
  );
}
