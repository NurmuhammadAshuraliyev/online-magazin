import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const SalesCart = ({ items, onUpdateQty, onRemove }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border">
      <div className="p-4 border-b font-bold text-lg">Joriy Savat</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
            <div className="flex-1">
              <h4 className="font-bold text-sm">{item.name}</h4>
              <p className="text-xs text-slate-500">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 border rounded"><Minus size={14}/></button>
              <span className="font-bold">{item.qty}</span>
              <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 border rounded"><Plus size={14}/></button>
              <button onClick={() => onRemove(item.id)} className="ml-2 text-rose-500"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-slate-900 text-white rounded-b-2xl">
        <div className="flex justify-between mb-4">
          <span>Jami summa:</span>
          <span className="text-xl font-black">{formatCurrency(total)}</span>
        </div>
        <button className="w-full py-3 bg-violet-600 rounded-xl font-bold hover:bg-violet-700 transition-colors">
          To'lovga o'tish
        </button>
      </div>
    </div>
  );
};