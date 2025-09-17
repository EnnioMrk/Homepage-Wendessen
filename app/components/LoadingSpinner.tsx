interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'blue' | 'indigo' | 'white' | 'gray';
    className?: string;
    text?: string;
    centered?: boolean;
}

export default function LoadingSpinner({
    size = 'md',
    color = 'blue',
    className = '',
    text,
    centered = false,
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
        xl: 'w-16 h-16',
    };

    const colorClasses = {
        blue: 'border-t-blue-500',
        indigo: 'border-t-indigo-500',
        white: 'border-t-white',
        gray: 'border-t-gray-500',
    };

    const spinnerClasses = `${sizeClasses[size]} border-4 ${colorClasses[color]} border-gray-300 rounded-full animate-spin ${className}`;

    const containerClasses = centered
        ? 'flex items-center justify-center'
        : 'flex items-center';

    if (text) {
        return (
            <div className={containerClasses}>
                <div className={spinnerClasses}></div>
                <span className="text-gray-600 ml-3 font-medium">{text}</span>
            </div>
        );
    }

    return <div className={spinnerClasses}></div>;
}
