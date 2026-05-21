import { useState } from 'react';
import { Tabs, Tab, Box, Button, Container } from '@mui/material';
import { LogOut } from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { ReservationsList, Reservation } from './ReservationsList';
import { BundleManagement } from './BundleManagement';
import { Drink } from '../DrinkCard';
import { Bundle } from '../Bundle';

interface AdminDashboardProps {
  drinks: Drink[];
  reservations: Reservation[];
  bundles: Bundle[];
  onUpdateDrinks: (drinks: Drink[]) => void;
  onUpdateBundles: (bundles: Bundle[]) => void;
  onLogout: () => void;
}

export function AdminDashboard({
  drinks,
  reservations,
  bundles,
  onUpdateDrinks,
  onUpdateBundles,
  onLogout,
}: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white shadow-sm">
        <Container maxWidth="xl">
          <div className="py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-amber-900">
                Administration - Au Petit Caillou
              </h1>
              <p className="text-gray-600 text-sm">Panneau de gestion</p>
            </div>
            <Button
              variant="outlined"
              startIcon={<LogOut />}
              onClick={onLogout}
              sx={{
                borderColor: '#92400e',
                color: '#92400e',
                '&:hover': {
                  borderColor: '#78350f',
                  backgroundColor: 'rgba(146, 64, 14, 0.04)',
                },
              }}
            >
              Déconnexion
            </Button>
          </div>
        </Container>
      </header>

      <Container maxWidth="xl" className="py-8">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, value) => setSelectedTab(value)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '16px',
              },
              '& .Mui-selected': {
                color: '#92400e',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#92400e',
              },
            }}
          >
            <Tab label="Produits" />
            <Tab label="Bundles" />
            <Tab label="Réservations" />
          </Tabs>
        </Box>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {selectedTab === 0 && (
            <ProductManagement drinks={drinks} onUpdate={onUpdateDrinks} />
          )}
          {selectedTab === 1 && (
            <BundleManagement bundles={bundles} drinks={drinks} onUpdate={onUpdateBundles} />
          )}
          {selectedTab === 2 && <ReservationsList reservations={reservations} />}
        </div>
      </Container>
    </div>
  );
}
