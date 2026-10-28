import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import Spinner from '@/components/ui/Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  rounded?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-primary text-white hover:bg-primary-hover',
  secondary: 'border-[#3538392E] bg-surface text-slate-900 hover:bg-border/60',
  danger: 'border-transparent bg-danger text-white hover:bg-danger/90',
  ghost: 'border-transparent bg-transparent text-primary hover:bg-primary/10',
};

const disabledClasses =
  'disabled:cursor-not-allowed disabled:border-[#35383914] disabled:bg-[#F3F4F6] disabled:text-[#35383961] disabled:shadow-[0px_1px_2px_0px_var(--ColorsEffectsShadowsshadow-xs)]';

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-sm py-xs text-sm',
  md: 'px-md py-sm text-sm',
  lg: 'px-lg py-md text-base',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  rounded = true,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-sm border font-sans font-medium transition-colors',
        disabledClasses,
        rounded && 'rounded',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className="text-current" />}
      {children}
    </button>
  );
};

export default Button;
