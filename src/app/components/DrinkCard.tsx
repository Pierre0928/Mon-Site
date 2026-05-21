import { useState } from 'react';
import { Wine, Beer, Coffee, Package } from 'lucide-react';
import { Button, ToggleButtonGroup, ToggleButton } from '@mui/material';

export interface Drink {
  id: string;
  name: string;
  category: 'biere' | 'soft' | 'spiritueux';
  price: number;
  description: string;
  format?: string;
  costPrice?: number;
  image?: string;
  caseAvailable?: boolean;
  caseSize?: number;
  casePrice?: number;
  caseCostPrice?: number;
}

export type PurchaseType = 'unit' | 'case';

export interface DrinkPurchase {
  drink: Drink;
  purchaseType: PurchaseType;
}

interface DrinkCardProps {
  drink: Drink;
  onAdd: (drinkPurchase: DrinkPurchase) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'biere':
      return <Beer className="w-6 h-6" />;
    default:
      return <Coffee className="w-6 h-6" />;
  }
};

export function DrinkCard({ drink, onAdd }: DrinkCardProps) {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('unit');

  const currentPrice = purchaseType === 'case' && drink.casePrice ? drink.casePrice : drink.price;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-amber-700">
          {getCategoryIcon(drink.category)}
        </div>
        <h3 className="font-semibold text-lg">{drink.name}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-2">{drink.description}</p>
      {drink.format && (
        <p className="text-gray-500 text-xs mb-3 font-medium">Format: {drink.format}</p>
      )}

      {/* Sélecteur Unité / Casier */}
      {drink.caseAvailable && drink.caseSize && drink.casePrice ? (
        <div className="mb-4">
          <ToggleButtonGroup
            value={purchaseType}
            exclusive
            onChange={(_, value) => value && setPurchaseType(value)}
            size="small"
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  backgroundColor: '#92400e',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#78350f',
                  },
                },
              },
            }}
          >
            <ToggleButton value="unit">
              <div className="flex flex-col items-center py-1">
                <Beer className="w-4 h-4 mb-1" />
                <span className="text-xs">À l'unité</span>
                <span className="font-bold text-sm">{drink.price.toFixed(2)} €</span>
              </div>
            </ToggleButton>
            <ToggleButton value="case">
              <div className="flex flex-col items-center py-1">
                <Package className="w-4 h-4 mb-1" />
                <span className="text-xs">Casier ({drink.caseSize}x)</span>
                <span className="font-bold text-sm">{drink.casePrice.toFixed(2)} €</span>
              </div>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-amber-800">{currentPrice.toFixed(2)} €</div>
          {purchaseType === 'case' && drink.caseSize && drink.casePrice && (
            <div className="text-xs text-gray-500">
              soit {(drink.casePrice / drink.caseSize).toFixed(2)} € / unité
            </div>
          )}
        </div>
        <Button
          variant="contained"
          size="small"
          onClick={() => onAdd({ drink, purchaseType })}
          sx={{
            backgroundColor: '#92400e',
            '&:hover': {
              backgroundColor: '#78350f',
            },
          }}
        >
          Ajouter
        </Button>
      </div>
    </div>
  );
}
