import { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Container, Button } from '@mui/material';
import { DrinkCard, Drink, DrinkPurchase } from './components/DrinkCard';
import { BundleCard } from './components/BundleCard';
import { Bundle } from './components/Bundle';
import { Cart, CartItem } from './components/Cart';
import { ReservationForm, GuestInfo } from './components/ReservationForm';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Reservation } from './components/admin/ReservationsList';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { Settings } from 'lucide-react';

const DEFAULT_DRINKS: Drink[] = [
  {
    id: '1',
    name: 'Jupiler',
    category: 'biere',
    price: 1.50,
    costPrice: 0.57,
    format: '25cl',
    description: 'Bière blonde belge classique, rafraîchissante et légère',
    caseAvailable: true,
    caseSize: 24,
    casePrice: 30.00,
    caseCostPrice: 13.64,
  },
  {
    id: '2',
    name: 'Maes',
    category: 'biere',
    price: 1.50,
    costPrice: 0.55,
    format: '25cl',
    description: 'Bière belge douce et équilibrée',
    caseAvailable: true,
    caseSize: 24,
    casePrice: 28.00,
    caseCostPrice: 13.19,
  },
  {
    id: '3',
    name: 'Maes Promo',
    category: 'biere',
    price: 1.50,
    costPrice: 0.30,
    format: '25cl',
    description: 'Bière belge douce et équilibrée - Promotion',
  },
  {
    id: '4',
    name: 'Chouffe Blonde',
    category: 'biere',
    price: 3.00,
    costPrice: 1.39,
    format: '33cl',
    description: 'Bière d\'Ardenne blonde non filtrée, ronde et épicée',
  },
  {
    id: '5',
    name: 'Chouffe Blonde Promo',
    category: 'biere',
    price: 3.00,
    costPrice: 0.98,
    format: '33cl',
    description: 'Bière d\'Ardenne blonde non filtrée - Promotion',
  },
  {
    id: '6',
    name: 'Lupulus Triple',
    category: 'biere',
    price: 3.00,
    costPrice: 1.73,
    format: '33cl',
    description: 'Bière triple artisanale belge, blonde dorée et houblonnée',
  },
  {
    id: '7',
    name: 'Lupulus Organicus',
    category: 'biere',
    price: 3.00,
    costPrice: 1.63,
    format: '33cl',
    description: 'Bière biologique aux arômes fruités et floraux',
  },
  {
    id: '8',
    name: 'Lupulus Blanche',
    category: 'biere',
    price: 3.00,
    costPrice: 1.59,
    format: '33cl',
    description: 'Bière blanche rafraîchissante aux notes d\'agrumes',
  },
  {
    id: '9',
    name: 'Lupulus Fructus',
    category: 'biere',
    price: 3.00,
    costPrice: 1.73,
    format: '33cl',
    description: 'Bière fruitée aux notes de fruits rouges',
  },
  {
    id: '10',
    name: 'Lupulus Hopera',
    category: 'biere',
    price: 3.00,
    costPrice: 1.51,
    format: '33cl',
    description: 'IPA belge intensément houblonnée',
  },
  {
    id: '11',
    name: 'Lupulus Brune',
    category: 'biere',
    price: 3.00,
    costPrice: 1.60,
    format: '33cl',
    description: 'Bière brune aux arômes de caramel et chocolat',
  },
  {
    id: '12',
    name: 'Lupulus Pils',
    category: 'biere',
    price: 3.00,
    costPrice: 1.22,
    format: '33cl',
    description: 'Pils artisanale belge, fraîche et désaltérante',
  },
  {
    id: '13',
    name: 'Lupulus Placebo 0%',
    category: 'biere',
    price: 3.00,
    costPrice: 1.40,
    format: '33cl',
    description: 'Bière sans alcool, saveurs authentiques préservées',
  },
  {
    id: '14',
    name: 'Vieille Salm',
    category: 'biere',
    price: 3.00,
    costPrice: 1.82,
    format: '33cl',
    description: 'Bière régionale des Ardennes belges',
  },
  {
    id: '15',
    name: 'Tharee',
    category: 'biere',
    price: 3.00,
    costPrice: 1.42,
    format: '33cl',
    description: 'Bière artisanale locale aux arômes subtils',
  },
  {
    id: '16',
    name: 'Spa Reine',
    category: 'soft',
    price: 2.00,
    costPrice: 0.56,
    format: '1L',
    description: 'Eau minérale naturelle des Ardennes belges',
    caseAvailable: true,
    caseSize: 6,
    casePrice: 10.50,
    caseCostPrice: 3.33,
  },
  {
    id: '17',
    name: 'Spa Intense',
    category: 'soft',
    price: 2.00,
    costPrice: 0.56,
    format: '1L',
    description: 'Eau minérale pétillante des Ardennes',
  },
  {
    id: '18',
    name: 'Coca-Cola Regular',
    category: 'soft',
    price: 3.00,
    costPrice: 1.88,
    format: '1L',
    description: 'Boisson gazeuse au cola, la recette originale',
    caseAvailable: true,
    caseSize: 6,
    casePrice: 16.00,
    caseCostPrice: 11.30,
  },
  {
    id: '19',
    name: 'Coca-Cola Zero',
    category: 'soft',
    price: 3.00,
    costPrice: 1.88,
    format: '1L',
    description: 'Coca-Cola sans sucre, même goût original',
  },
  {
    id: '20',
    name: 'Fanta',
    category: 'soft',
    price: 3.00,
    costPrice: 1.74,
    format: '1L',
    description: 'Boisson gazeuse à l\'orange, fruitée et pétillante',
  },
  {
    id: '21',
    name: 'Sprite',
    category: 'soft',
    price: 3.00,
    costPrice: 1.74,
    format: '1L',
    description: 'Boisson gazeuse citron-citron vert rafraîchissante',
  },
  {
    id: '22',
    name: 'Ice Tea',
    category: 'soft',
    price: 3.00,
    costPrice: 1.99,
    format: '1L',
    description: 'Thé glacé saveur pêche, désaltérant et sucré',
  },
];

const DEFAULT_BUNDLES: Bundle[] = [
  {
    id: 'bundle-1',
    name: 'Pack Lupulus Découverte',
    description: 'Découvrez toute la gamme Lupulus avec ce pack complet',
    items: [
      { drinkId: '6', quantity: 1 }, // Lupulus Triple
      { drinkId: '7', quantity: 1 }, // Lupulus Organicus
      { drinkId: '8', quantity: 1 }, // Lupulus Blanche
      { drinkId: '9', quantity: 1 }, // Lupulus Fructus
      { drinkId: '10', quantity: 1 }, // Lupulus Hopera
      { drinkId: '11', quantity: 1 }, // Lupulus Brune
    ],
    price: 15.00,
    costPrice: 9.79,
  },
  {
    id: 'bundle-2',
    name: 'Pack Soirée 24 Bières',
    description: 'Pack parfait pour une soirée : 24 bières au choix',
    items: [
      { drinkId: '1', quantity: 12 }, // Jupiler
      { drinkId: '4', quantity: 12 }, // Chouffe Blonde
    ],
    price: 35.00,
    costPrice: 23.52,
  },
];

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const savedDrinks = localStorage.getItem('drinks');
    const savedBundles = localStorage.getItem('bundles');
    const savedReservations = localStorage.getItem('reservations');

    if (savedDrinks) {
      setDrinks(JSON.parse(savedDrinks));
    } else {
      setDrinks(DEFAULT_DRINKS);
    }

    if (savedBundles) {
      setBundles(JSON.parse(savedBundles));
    } else {
      setBundles(DEFAULT_BUNDLES);
    }

    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }
  }, []);

  const handleUpdateDrinks = (newDrinks: Drink[]) => {
    setDrinks(newDrinks);
    localStorage.setItem('drinks', JSON.stringify(newDrinks));
  };

  const handleUpdateBundles = (newBundles: Bundle[]) => {
    setBundles(newBundles);
    localStorage.setItem('bundles', JSON.stringify(newBundles));
  };

  const getItemKey = (drinkId: string, purchaseType: string) => {
    return `${drinkId}-${purchaseType}`;
  };

  const handleAddToCart = (drinkPurchase: DrinkPurchase) => {
    const { drink, purchaseType } = drinkPurchase;
    const itemKey = getItemKey(drink.id, purchaseType);

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.drink.id === drink.id && item.purchaseType === purchaseType
      );
      if (existing) {
        return prev.map((item) =>
          item.drink.id === drink.id && item.purchaseType === purchaseType
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { drink, quantity: 1, purchaseType }];
    });

    const typeLabel = purchaseType === 'case' ? 'casier' : 'unité';
    toast.success(`${drink.name} (${typeLabel}) ajouté au panier`);
  };

  const handleAddBundleToCart = (bundle: Bundle) => {
    // Ajouter chaque produit du bundle au panier
    bundle.items.forEach(item => {
      const drink = drinks.find(d => d.id === item.drinkId);
      if (drink) {
        setCartItems((prev) => {
          const existing = prev.find(
            (cartItem) => cartItem.drink.id === drink.id && cartItem.purchaseType === 'unit'
          );
          if (existing) {
            return prev.map((cartItem) =>
              cartItem.drink.id === drink.id && cartItem.purchaseType === 'unit'
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            );
          }
          return [...prev, { drink, quantity: item.quantity, purchaseType: 'unit' }];
        });
      }
    });

    toast.success(`${bundle.name} ajouté au panier`);
  };

  const handleUpdateQuantity = (itemKey: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        const key = getItemKey(item.drink.id, item.purchaseType);
        return key === itemKey
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item;
      })
    );
  };

  const handleRemove = (itemKey: string) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        const key = getItemKey(item.drink.id, item.purchaseType);
        return key !== itemKey;
      })
    );
    toast.info('Article retiré du panier');
  };

  const handleCheckout = () => {
    setShowReservationForm(true);
  };

  const handleConfirmReservation = (guestInfo: GuestInfo) => {
    const total = cartItems.reduce((sum, item) => {
      const price =
        item.purchaseType === 'case' && item.drink.casePrice
          ? item.drink.casePrice
          : item.drink.price;
      return sum + price * item.quantity;
    }, 0);

    const newReservation: Reservation = {
      id: Date.now().toString(),
      guestInfo,
      items: cartItems,
      total,
      date: new Date().toISOString(),
      status: 'pending',
    };

    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));

    setTimeout(() => {
      setCartItems([]);
    }, 2000);
  };

  const handleLogin = () => {
    setIsAdmin(true);
    setIsAdminMode(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setIsAdminMode(false);
  };

  const filteredDrinks =
    selectedCategory === 'all'
      ? drinks
      : drinks.filter((drink) => drink.category === selectedCategory);

  const total = cartItems.reduce(
    (sum, item) => sum + item.drink.price * item.quantity,
    0
  );

  if (isAdminMode && !isAdmin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (isAdminMode && isAdmin) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <AdminDashboard
          drinks={drinks}
          reservations={reservations}
          bundles={bundles}
          onUpdateDrinks={handleUpdateDrinks}
          onUpdateBundles={handleUpdateBundles}
          onLogout={handleLogout}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Toaster position="top-right" richColors />

      <header className="bg-white shadow-sm">
        <Container maxWidth="xl">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">Au Petit Caillou</h1>
              <p className="text-gray-600 mt-1">Réservez vos boissons pour votre séjour</p>
            </div>
            <Button
              variant="text"
              startIcon={<Settings />}
              onClick={() => setIsAdminMode(true)}
              sx={{
                color: '#92400e',
                '&:hover': {
                  backgroundColor: 'rgba(146, 64, 14, 0.04)',
                },
              }}
            >
              Admin
            </Button>
          </div>
        </Container>
      </header>

      <Container maxWidth="xl" className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
              <Tabs
                value={selectedCategory}
                onChange={(_, value) => setSelectedCategory(value)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                  },
                  '& .Mui-selected': {
                    color: '#92400e',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#92400e',
                  },
                }}
              >
                <Tab label="Toutes" value="all" />
                <Tab label="Bières" value="biere" />
                <Tab label="Soft Drinks" value="soft" />
                <Tab label="Bundles" value="bundles" />
              </Tabs>
            </Box>

            {selectedCategory === 'bundles' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bundles.map((bundle) => (
                  <BundleCard
                    key={bundle.id}
                    bundle={bundle}
                    drinks={drinks}
                    onAdd={handleAddBundleToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDrinks.map((drink) => (
                  <DrinkCard key={drink.id} drink={drink} onAdd={handleAddToCart} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </Container>

      <ReservationForm
        open={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        cartItems={cartItems}
        total={total}
        onConfirm={handleConfirmReservation}
      />
    </div>
  );
}