import React from "react";

interface LandCardProps {
    icon?: React.ReactNode;
    img?: string;
    title?: string;
    subtitle?: string;
    value?: string;
    desc?: string;
    className?: string;
    children?: React.ReactNode;
}

const LandCard: React.FC<LandCardProps> = ({
    icon,
    img,
    title,
    subtitle,
    value,
    desc,
    className = "",
    children,
}) => {
    return (
        <div
            className={`border border-blue-900 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center text-center ${className}`}
        >
            {/* Image or Icon */}
            {img ? (
                <img
                    src={img}
                    alt={title || "Card image"}
                    className="h-12 w-12 mb-3"
                    loading="lazy"
                />
            ) : (
                icon && <div className="mb-3 text-3xl text-blue-900">{icon}</div>
            )}

            {/* Title */}
            {title && (
                <h3 className="text-sm font-semibold mb-2 text-blue-500">{title}</h3>
            )}

            {/* Sub Title */}
            {subtitle && (
                <h3 className="text-lg font-semibold mb-2 text-blue-500">{subtitle}</h3>
            )}

            {/* Value (Optional) */}
            {value && (
                <p className="font-bold text-3xl text-blue-900 mt-1 mb-1">{value}</p>
            )}

            {/* Description */}
            {desc && <p className="text-gray-800 text-sm">{desc}</p>}

            {/* Custom Children */}
            {children && <div className="mt-2">{children}</div>}
        </div>
    );
};

export default LandCard;
