import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { Bundle, BundleItem } from '../Bundle';
import { Drink } from '../DrinkCard';
import { toast } from 'sonner';

interface BundleManagementProps {
  bundles: Bundle[];
  drinks: Drink[];
  onUpdate: (bundles: Bundle[]) => void;
}

export function BundleManagement({ bundles, drinks, onUpdate }: BundleManagementProps) {
  const [editDialog, setEditDialog] = useState(false);
  const [currentBundle, setCurrentBundle] = useState<Bundle | null>(null);
  const [formData, setFormData] = useState<Partial<Bundle>>({
    items: [],
  });
  const [selectedDrink, setSelectedDrink] = useState<string>('');
  const [drinkQuantity, setDrinkQuantity] = useState<number>(1);

  const handleEdit = (bundle: Bundle) => {
    setCurrentBundle(bundle);
    setFormData(bundle);
    setEditDialog(true);
  };

  const handleAdd = () => {
    setCurrentBundle(null);
    setFormData({
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
      costPrice: 0,
      items: [],
    });
    setEditDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bundle ?')) {
      onUpdate(bundles.filter((b) => b.id !== id));
      toast.success('Bundle supprimé');
    }
  };

  const handleAddDrinkToBundle = () => {
    if (!selectedDrink) {
      toast.error('Veuillez sélectionner un produit');
      return;
    }

    const existingItems = formData.items || [];
    const existingItem = existingItems.find(item => item.drinkId === selectedDrink);

    if (existingItem) {
      setFormData({
        ...formData,
        items: existingItems.map(item =>
          item.drinkId === selectedDrink
            ? { ...item, quantity: item.quantity + drinkQuantity }
            : item
        ),
      });
    } else {
      setFormData({
        ...formData,
        items: [...existingItems, { drinkId: selectedDrink, quantity: drinkQuantity }],
      });
    }

    setSelectedDrink('');
    setDrinkQuantity(1);
  };

  const handleRemoveDrinkFromBundle = (drinkId: string) => {
    setFormData({
      ...formData,
      items: (formData.items || []).filter(item => item.drinkId !== drinkId),
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.items || formData.items.length === 0) {
      toast.error('Veuillez remplir tous les champs obligatoires et ajouter au moins un produit');
      return;
    }

    if (currentBundle) {
      onUpdate(
        bundles.map((b) => (b.id === currentBundle.id ? { ...b, ...formData } : b))
      );
      toast.success('Bundle mis à jour');
    } else {
      onUpdate([...bundles, formData as Bundle]);
      toast.success('Bundle ajouté');
    }
    setEditDialog(false);
  };

  const calculateBundleSavings = (bundle: Bundle) => {
    const totalRegular = bundle.items.reduce((sum, item) => {
      const drink = drinks.find(d => d.id === item.drinkId);
      return sum + (drink ? drink.price * item.quantity : 0);
    }, 0);
    const savings = totalRegular - bundle.price;
    return savings > 0 ? `${savings.toFixed(2)} € (${((savings / totalRegular) * 100).toFixed(0)}%)` : 'Aucune';
  };

  const getDrinkName = (drinkId: string) => {
    const drink = drinks.find(d => d.id === drinkId);
    return drink ? drink.name : 'Produit inconnu';
  };

  const calculateTotalCost = () => {
    if (!formData.items) return 0;
    return formData.items.reduce((sum, item) => {
      const drink = drinks.find(d => d.id === item.drinkId);
      return sum + (drink ? (drink.costPrice || 0) * item.quantity : 0);
    }, 0);
  };

  const calculateTotalRegularPrice = () => {
    if (!formData.items) return 0;
    return formData.items.reduce((sum, item) => {
      const drink = drinks.find(d => d.id === item.drinkId);
      return sum + (drink ? drink.price * item.quantity : 0);
    }, 0);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Bundles</h2>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={handleAdd}
          sx={{
            backgroundColor: '#92400e',
            '&:hover': {
              backgroundColor: '#78350f',
            },
          }}
        >
          Créer un bundle
        </Button>
      </div>

      {bundles.length === 0 ? (
        <Paper className="p-8 text-center text-gray-500">
          Aucun bundle créé pour le moment
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Produits inclus</strong></TableCell>
                <TableCell><strong>Prix</strong></TableCell>
                <TableCell><strong>Économie</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bundles.map((bundle) => (
                <TableRow key={bundle.id}>
                  <TableCell>
                    <div className="font-semibold">{bundle.name}</div>
                    <div className="text-sm text-gray-500">{bundle.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {bundle.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          {item.quantity}x {getDrinkName(item.drinkId)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{bundle.price.toFixed(2)} €</TableCell>
                  <TableCell className="text-green-700 font-semibold">
                    {calculateBundleSavings(bundle)}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(bundle)}>
                      <Edit className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(bundle.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-xl font-bold">
          {currentBundle ? '✏️ Modifier le bundle' : '➕ Créer un bundle'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-5 mt-4">
            {/* Informations générales */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Informations générales</h4>
              <div className="space-y-3">
                <TextField
                  fullWidth
                  label="Nom du bundle"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  variant="outlined"
                  placeholder="ex: Pack Lupulus Découverte"
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  variant="outlined"
                  placeholder="Décrivez le bundle..."
                />
              </div>
            </div>

            <Divider />

            {/* Produits inclus */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Produits inclus</h4>

              {/* Liste des produits ajoutés */}
              {formData.items && formData.items.length > 0 && (
                <div className="bg-gray-50 rounded-md p-3 mb-3">
                  <div className="space-y-2">
                    {formData.items.map((item) => (
                      <div key={item.drinkId} className="flex items-center justify-between">
                        <span className="text-sm">
                          {item.quantity}x {getDrinkName(item.drinkId)}
                        </span>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveDrinkFromBundle(item.drinkId)}
                        >
                          <X className="w-4 h-4" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ajouter un produit */}
              <div className="flex gap-2">
                <FormControl variant="outlined" size="small" sx={{ flex: 1 }}>
                  <InputLabel>Sélectionner un produit</InputLabel>
                  <Select
                    value={selectedDrink}
                    label="Sélectionner un produit"
                    onChange={(e) => setSelectedDrink(e.target.value)}
                  >
                    {drinks.map(drink => (
                      <MenuItem key={drink.id} value={drink.id}>
                        {drink.name} - {drink.price.toFixed(2)} €
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  label="Quantité"
                  value={drinkQuantity}
                  onChange={(e) => setDrinkQuantity(parseInt(e.target.value) || 1)}
                  size="small"
                  variant="outlined"
                  inputProps={{ min: 1, style: { width: '60px' } }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddDrinkToBundle}
                  sx={{
                    borderColor: '#92400e',
                    color: '#92400e',
                    '&:hover': {
                      borderColor: '#78350f',
                      backgroundColor: 'rgba(146, 64, 14, 0.04)',
                    },
                  }}
                >
                  Ajouter
                </Button>
              </div>
            </div>

            <Divider />

            {/* Prix */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Prix du bundle</h4>

              {formData.items && formData.items.length > 0 && (
                <Alert severity="info" icon={false} className="mb-3">
                  <div className="text-sm">
                    <strong>Prix total si acheté séparément :</strong> {calculateTotalRegularPrice().toFixed(2)} €
                  </div>
                  <div className="text-sm">
                    <strong>Coût total d'achat :</strong> {calculateTotalCost().toFixed(2)} €
                  </div>
                </Alert>
              )}

              <TextField
                fullWidth
                label="Prix de vente du bundle"
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
                variant="outlined"
                inputProps={{ step: '0.01', min: '0' }}
                helperText="Prix total du bundle pour le client"
              />

              {formData.price && formData.items && formData.items.length > 0 && (
                <Alert
                  severity={formData.price < calculateTotalRegularPrice() ? 'success' : 'warning'}
                  icon={false}
                  className="mt-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {formData.price < calculateTotalRegularPrice() ? 'Économie client :' : 'Aucune économie'}
                    </span>
                    {formData.price < calculateTotalRegularPrice() && (
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {(calculateTotalRegularPrice() - formData.price).toFixed(2)} €
                        </div>
                        <div className="text-sm">
                          {(((calculateTotalRegularPrice() - formData.price) / calculateTotalRegularPrice()) * 100).toFixed(0)}% de réduction
                        </div>
                      </div>
                    )}
                  </div>
                </Alert>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50">
          <Button onClick={() => setEditDialog(false)} size="large">
            Annuler
          </Button>
          <Button
            onClick={handleSave}
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
            💾 Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
