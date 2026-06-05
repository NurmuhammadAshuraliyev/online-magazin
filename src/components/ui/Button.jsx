export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
      primary: 'gradient-primary text-white shadow-lg',
      secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
      danger: 'bg-rose-500 text-white shadow-rose-100 shadow-lg'
    };
    
    return (
      <button className={`px-4 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  };