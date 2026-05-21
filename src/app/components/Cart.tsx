import { ShoppingCart, Trash2, Plus, Minus, Package, Beer } from 'lucide-react';
import { Button, IconButton, Chip } from '@mui/material';
import { Drink, PurchaseType } from './DrinkCard';

export interface CartItem {
  drink: Drink;
  quantity: number;
  purchaseType: PurchaseType;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemKey: string, delta: number) => void;
  onRemove: (itemKey: string) => void;
  onCheckout: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemove, onCheckout }: CartProps) {
  const getItemPrice = (item: CartItem) => {
    if (item.purchaseType === 'case' && item.drink.casePrice) {
      return item.drink.casePrice;
    }
    return item.drink.price;
  };

  const getItemKey = (item: CartItem) => {
    return `${item.drink.id}-${item.purchaseType}`;
  };

  const total = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-amber-700" />
          <h2 className="font-semibold text-lg">Votre commande</h2>
        </div>
        <p className="text-gray-500 text-center py-8">Votre panier est vide</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-5 h-5 text-amber-700" />
        <h2 className="font-semibold text-lg">Votre commande</h2>
      </div>

      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const itemKey = getItemKey(item);
          const itemPrice = getItemPrice(item);

          return (
            <div key={itemKey} className="border-b pb-3">
              <div className="flex items-start gap-2 mb-2">
                <div className="flex-1">
                  <p className="font-medium">{item.drink.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip
                      icon={item.purchaseType === 'case' ? <Package className="w-3 h-3" /> : <Beer className="w-3 h-3" />}
                      label={item.purchaseType === 'case' ? `Casier (${item.drink.caseSize}x)` : 'À l\'unité'}
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '0.7rem',
                        backgroundColor: item.purchaseType === 'case' ? '#fef3c7' : '#dbeafe',
                        color: item.purchaseType === 'case' ? '#92400e' : '#1e40af',
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{itemPrice.toFixed(2)} €</p>
                </div>
                <IconButton
                  size="small"
                  onClick={() => onRemove(itemKey)}
                  color="error"
                >
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              </div>
              <div className="flex items-center gap-2">
                <IconButton
                  size="small"
                  onClick={() => onUpdateQuantity(itemKey, -1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </IconButton>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <IconButton
                  size="small"
                  onClick={() => onUpdateQuantity(itemKey, 1)}
                >
                  <Plus className="w-4 h-4" />
                </IconButton>
                <span className="ml-auto font-semibold text-amber-800">
                  {(itemPrice * item.quantity).toFixed(2)} €
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-amber-800">{total.toFixed(2)} €</span>
        </div>
      </div>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={onCheckout}
        sx={{
          backgroundColor: '#92400e',
          '&:hover': {
            backgroundColor: '#78350f',
          },
        }}
      >
        Réserver
      </Button>
    </div>
  );
}
