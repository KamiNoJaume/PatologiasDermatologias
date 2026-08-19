"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/ui/Icons";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  type,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          className={`w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary ${
            isPassword ? "pr-10" : ""
          } ${
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
