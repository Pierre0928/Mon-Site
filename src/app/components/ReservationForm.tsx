import { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Paper, Chip } from '@mui/material';
import { CheckCircle, Package, Beer } from 'lucide-react';
import { CartItem } from './Cart';

interface ReservationFormProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  onConfirm: (guestInfo: GuestInfo) => void;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  roomNumber: string;
  date: string;
}

export function ReservationForm({ open, onClose, cartItems, total, onConfirm }: ReservationFormProps) {
  const [formData, setFormData] = useState<GuestInfo>({
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
    setConfirmed(true);
  };

  const handleClose = () => {
    setConfirmed(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      roomNumber: '',
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  if (confirmed) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Réservation confirmée !</h2>
          <p className="text-gray-600 mb-4">
            Merci {formData.name}, votre commande de boissons a été enregistrée.
          </p>
          <p className="text-sm text-gray-500">
            Vous recevrez un email de confirmation à {formData.email}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" fullWidth>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-xl font-bold">Finaliser votre réservation</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-6">
          {/* Récapitulatif de commande */}
          <Paper elevation={2} className="p-4 bg-amber-50">
            <h3 className="font-bold text-lg mb-4 text-amber-900">📋 Récapitulatif de votre commande</h3>
            <div className="space-y-3">
              {cartItems.map((item, idx) => {
                const itemPrice =
                  item.purchaseType === 'case' && item.drink.casePrice
                    ? item.drink.casePrice
                    : item.drink.price;

                return (
                  <div key={`${item.drink.id}-${item.purchaseType}-${idx}`} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.drink.name}</span>
                        <Chip
                          icon={item.purchaseType === 'case' ? <Package className="w-3 h-3" /> : <Beer className="w-3 h-3" />}
                          label={item.purchaseType === 'case' ? `Casier (${item.drink.caseSize}x)` : 'Unité'}
                          size="small"
                          sx={{
                            height: '18px',
                            fontSize: '0.65rem',
                            backgroundColor: item.purchaseType === 'case' ? '#fef3c7' : '#dbeafe',
                            color: item.purchaseType === 'case' ? '#92400e' : '#1e40af',
                          }}
                        />
                      </div>
                      {item.drink.format && (
                        <span className="text-xs text-gray-500">({item.drink.format})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">x{item.quantity}</span>
                      <span className="font-semibold min-w-[70px] text-right">
                        {(itemPrice * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-amber-800">{total.toFixed(2)} €</span>
            </div>
          </Paper>

          {/* Informations client */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">👤 Vos informations</h3>
            <div className="space-y-4">
              <TextField
                fullWidth
                label="Nom complet"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                variant="outlined"
                size="medium"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Téléphone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  variant="outlined"
                  placeholder="ex: 0495123456"
                />
              </div>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  fullWidth
                  label="Numéro de chambre"
                  required
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  variant="outlined"
                  placeholder="ex: 12"
                />
                <TextField
                  fullWidth
                  label="Date de livraison souhaitée"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50">
          <Button onClick={onClose} size="large">
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#92400e',
              '&:hover': {
                backgroundColor: '#78350f',
              },
              paddingX: 4,
            }}
          >
            Confirmer la réservation
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
