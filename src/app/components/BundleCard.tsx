import { Button } from '@mui/material';
import { Package } from 'lucide-react';
import { Bundle } from './Bundle';
import { Drink } from './DrinkCard';

interface BundleCardProps {
  bundle: Bundle;
  drinks: Drink[];
  onAdd: (bundle: Bundle) => void;
}

export function BundleCard({ bundle, drinks, onAdd }: BundleCardProps) {
  const getBundleItems = () => {
    return bundle.items.map(item => {
      const drink = drinks.find(d => d.id === item.drinkId);
      return drink ? { drink, quantity: item.quantity } : null;
    }).filter(item => item !== null);
  };

  const bundleItems = getBundleItems();
  const totalRegularPrice = bundleItems.reduce((sum, item) => {
    return sum + (item!.drink.price * item!.quantity);
  }, 0);

  const savings = totalRegularPrice - bundle.price;
  const savingsPercent = ((savings / totalRegularPrice) * 100).toFixed(0);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-amber-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-amber-700">
          <Package className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{bundle.name}</h3>
          <span className="text-xs bg-amber-700 text-white px-2 py-1 rounded-full">
            BUNDLE
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-3">{bundle.description}</p>

      <div className="bg-white rounded-md p-3 mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Contenu du pack :</p>
        <ul className="space-y-1">
          {bundleItems.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              • {item!.quantity}x {item!.drink.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold text-amber-800">{bundle.price.toFixed(2)} €</span>
          {savings > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {totalRegularPrice.toFixed(2)} €
            </span>
          )}
        </div>
        {savings > 0 && (
          <div className="text-sm font-semibold text-green-700">
            Économisez {savings.toFixed(2)} € ({savingsPercent}%)
          </div>
        )}
      </div>

      <Button
        fullWidth
        variant="contained"
        size="medium"
        onClick={() => onAdd(bundle)}
        sx={{
          backgroundColor: '#92400e',
          '&:hover': {
            backgroundColor: '#78350f',
          },
        }}
      >
        Ajouter le bundle
      </Button>
    </div>
  );
}
