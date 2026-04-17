import React from "react";

interface LandCardProps {
  icon?: React.ReactNode;
  img?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  desc?: string;
  className?: string;
  titleColor?: string;
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
      className={`glass group p-8 rounded-[2rem] hover:bg-white/5 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden ${className}`}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 blur-3xl group-hover:bg-brand-primary/20 transition-all duration-500" />
      
      {/* Image or Icon */}
      {img ? (
        <img
          src={img}
          alt={title || "Card image"}
          className="h-16 w-16 mb-6 object-contain filter group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        icon && <div className="mb-6 scale-125 text-brand-primary group-hover:scale-150 group-hover:rotate-12 transition-all duration-500">{icon}</div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-xs font-black tracking-widest uppercase text-brand-primary mb-4 opacity-80 group-hover:opacity-100 transition-opacity"> {title}</h3>
      )}

      {/* Sub Title */}
      {subtitle && (
        <h3 className="text-2xl font-bold mb-3 text-white">
          {subtitle}
        </h3>
      )}

      {/* Value (Optional) */}
      {value && (
        <p className="font-black text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mt-1 mb-4">{value}</p>
      )}

      {/* Description */}
      {desc && <p className="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-gray-300 transition-colors">{desc}</p>}

      {/* Custom Children */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default LandCard;
