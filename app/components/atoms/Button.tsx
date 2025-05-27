import React from 'react'
import {cn} from '../../lib/utils'
import type {LucideIcon} from 'lucide-react'

type Variant = 'default' | 'success' | 'error' | 'info'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    icon?: LucideIcon
    iconSize?: Size
    iconOnly?: boolean
    children?: React.ReactNode
    fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
    default: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    error: 'bg-red-600 hover:bg-red-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
}

const sizeClasses: Record<Size, string> = {
    sm: 'text-sm px-2 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
}

const iconOnlySizeClasses: Record<Size, string> = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
}

const iconSizes: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'default',
    size = 'md',
    iconSize = 'md',
    fullWidth = false,
    icon: Icon,
    iconOnly = false,
    children,
    className,
    ...props
}) => {
    const isIconOnly = iconOnly && Icon

    return (
        <button
            {...props}
            className={cn(
                'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer active:scale-95 active:bg-opacity-90',
                variantClasses[variant],
                isIconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
                isIconOnly ? 'rounded-full p-0' : 'rounded-lg gap-2',
                fullWidth && 'w-full',
                className
            )}
        >
            {Icon && <Icon size={iconSizes[size]} />}
            {!iconOnly && children}
        </button>
    )
}
