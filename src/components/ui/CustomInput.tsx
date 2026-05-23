"use client";

import React, { type JSX } from "react";
import { Input } from "@/components/ui/input";

export interface CustomInputProps {
  placeholder?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "amount"
    | "decimal"
    | "color";
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  register?: any;
  showRequired?: boolean;
  disabled?: boolean;
  icon?: JSX.Element;
  iconClick?: () => void;
  inputClassName?: string;
  className?: string;
  isHelping?: boolean;
  id?: string;
  readOnly?: boolean;
}

export const CustomInput = ({
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  label,
  error,
  register,
  showRequired = false,
  disabled = false,
  icon,
  iconClick,
  inputClassName,
  readOnly,
  className,
  isHelping = true,
  id,
}: CustomInputProps) => {
  return (
    <div className={`w-full ${className || ""}`}>
      {name && (
        <label htmlFor={name} className="text-[10px] font-black tracking-[0.2em] text-[var(--text-primary)]/40 uppercase py-2 block">
          {label}
          {showRequired && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="w-full relative">
        <Input
          id={id || name}
          placeholder={placeholder ? placeholder : (label ? "Enter " + label : "")}
          type={
            type === "password" ? "password" : type === "color" ? "color" : "text"
          }
          name={name}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
          {...register}
          className={
            type === "color"
              ? "!p-0 !m-0 border-none"
              : `w-full bg-[var(--bg-surface)] border rounded-2xl px-5 py-4.5 text-base md:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/20 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all ${
                  error ? "border-red-500/50" : "border-[var(--glass-border)]"
                } ${type === "amount" ? "text-right" : ""} ${inputClassName || ""}`
          }
          onKeyPress={(e) => {
            if (type === "number" || type === "amount") {
              !/[0-9]/.test(e.key) && e.preventDefault();
            }
          }}
          disabled={disabled}
        />
        {icon && (
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:cursor-pointer"
            onClick={iconClick}
          >
            {icon}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-[11px] font-bold mt-2 px-1">{error}</p>}
    </div>
  );
};
