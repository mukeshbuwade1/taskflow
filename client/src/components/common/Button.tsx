import { ButtonHTMLAttributes, ReactNode } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children?: ReactNode;
}

const Button = ({ children, variant = 'primary', loading = false, className = '', ...props }: ButtonProps) => (
  <button
    className={`${variantClass[variant]} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && <AiOutlineLoading3Quarters className="animate-spin" size={14} />}
    {children}
  </button>
);

export default Button;
