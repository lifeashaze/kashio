"use client";

import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  description?: ReactNode;
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  disabled,
  required,
  description,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pr-10"
          disabled={disabled}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  );
}
