export const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );