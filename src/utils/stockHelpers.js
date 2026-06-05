export const getStockStatus = (quantity, minLimit = 10) => {
    if (quantity <= 0) return { label: 'Tugagan', color: 'bg-red-100 text-red-700' };
    if (quantity <= minLimit) return { label: 'Kam qolgan', color: 'bg-amber-100 text-amber-700' };
    return { label: 'Mavjud', color: 'bg-emerald-100 text-emerald-700' };
  };