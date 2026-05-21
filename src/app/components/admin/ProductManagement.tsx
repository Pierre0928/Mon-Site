import { useState, useMemo } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Drink } from '../DrinkCard';
import { toast } from 'sonner';

interface ProductManagementProps {
  drinks: Drink[];
  onUpdate: (drinks: Drink[]) => void;
}

export function ProductManagement({ drinks, onUpdate }: ProductManagementProps) {
  const [editDialog, setEditDialog] = useState(false);
  const [currentDrink, setCurrentDrink] = useState<Drink | null>(null);
  const [formData, setFormData] = useState<Partial<Drink>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleEdit = (drink: Drink) => {
    setCurrentDrink(drink);
    setFormData(drink);
    setEditDialog(true);
  };

  const handleAdd = () => {
    setCurrentDrink(null);
    setFormData({
      id: Date.now().toString(),
      name: '',
      category: 'soft',
      price: 0,
      costPrice: 0,
      description: '',
      format: '',
    });
    setEditDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      onUpdate(drinks.filter((d) => d.id !== id));
      toast.success('Produit supprimé');
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (currentDrink) {
      onUpdate(
        drinks.map((d) => (d.id === currentDrink.id ? { ...d, ...formData } : d))
      );
      toast.success('Produit mis à jour');
    } else {
      onUpdate([...drinks, formData as Drink]);
      toast.success('Produit ajouté');
    }
    setEditDialog(false);
  };

  const calculateMargin = (drink: Drink) => {
    if (!drink.costPrice) return 'N/A';
    const margin = drink.price - drink.costPrice;
    const marginPercent = ((margin / drink.price) * 100).toFixed(1);
    return `${margin.toFixed(2)} € (${marginPercent}%)`;
  };

  const filteredDrinks = categoryFilter === 'all'
    ? drinks
    : drinks.filter(d => d.category === categoryFilter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Produits</h2>
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
          Ajouter un produit
        </Button>
      </div>

      <div className="mb-4">
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer par catégorie</InputLabel>
          <Select
            value={categoryFilter}
            label="Filtrer par catégorie"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">Toutes les catégories</MenuItem>
            <MenuItem value="biere">🍺 Bières</MenuItem>
            <MenuItem value="soft">🥤 Soft Drinks</MenuItem>
          </Select>
        </FormControl>
        <span className="ml-4 text-gray-600">
          {filteredDrinks.length} produit{filteredDrinks.length > 1 ? 's' : ''}
        </span>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nom</strong></TableCell>
              <TableCell><strong>Format</strong></TableCell>
              <TableCell><strong>Catégorie</strong></TableCell>
              <TableCell><strong>Prix d'achat</strong></TableCell>
              <TableCell><strong>Prix de vente</strong></TableCell>
              <TableCell><strong>Marge</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDrinks.map((drink) => (
              <TableRow key={drink.id}>
                <TableCell>{drink.name}</TableCell>
                <TableCell>{drink.format || '-'}</TableCell>
                <TableCell>{drink.category}</TableCell>
                <TableCell>{drink.costPrice?.toFixed(2) || '-'} €</TableCell>
                <TableCell>{drink.price.toFixed(2)} €</TableCell>
                <TableCell>{calculateMargin(drink)}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(drink)}>
                    <Edit className="w-4 h-4" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(drink.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-xl font-bold">
          {currentDrink ? '✏️ Modifier le produit' : '➕ Ajouter un produit'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-5 mt-4">
            {/* Informations générales */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Informations générales</h4>
              <div className="space-y-3">
                <TextField
                  fullWidth
                  label="Nom du produit"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  variant="outlined"
                  placeholder="ex: Jupiler"
                />
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    fullWidth
                    label="Format"
                    value={formData.format || ''}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    variant="outlined"
                    placeholder="ex: 33cl, 1L"
                  />
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Catégorie</InputLabel>
                    <Select
                      value={formData.category || 'soft'}
                      label="Catégorie"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as Drink['category'],
                        })
                      }
                    >
                      <MenuItem value="biere">🍺 Bière</MenuItem>
                      <MenuItem value="soft">🥤 Soft Drink</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            <Divider />

            {/* Prix et Marge */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Prix et Marge</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    fullWidth
                    label="Prix d'achat unitaire"
                    type="number"
                    value={formData.costPrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })
                    }
                    variant="outlined"
                    inputProps={{ step: '0.01', min: '0' }}
                    helperText="Coût par unité (HT)"
                  />
                  <TextField
                    fullWidth
                    label="Prix de vente"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    required
                    variant="outlined"
                    inputProps={{ step: '0.01', min: '0' }}
                    helperText="Prix client (TTC)"
                  />
                </div>

                {/* Calcul de marge en temps réel */}
                {formData.price && formData.costPrice && formData.price > 0 ? (
                  <Alert
                    severity="info"
                    icon={false}
                    sx={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Marge bénéficiaire :</span>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {(formData.price - formData.costPrice).toFixed(2)} €
                        </div>
                        <div className="text-sm text-gray-600">
                          {(((formData.price - formData.costPrice) / formData.price) * 100).toFixed(1)}% de marge
                        </div>
                      </div>
                    </div>
                  </Alert>
                ) : null}
              </div>
            </div>

            <Divider />

            {/* Vente par casier */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-700">📦 Vente par casier</h4>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.caseAvailable || false}
                      onChange={(e) =>
                        setFormData({ ...formData, caseAvailable: e.target.checked })
                      }
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#92400e',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#92400e',
                        },
                      }}
                    />
                  }
                  label="Activer la vente par casier"
                />
              </div>

              {formData.caseAvailable && (
                <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                  <TextField
                    fullWidth
                    label="Nombre de bouteilles par casier"
                    type="number"
                    value={formData.caseSize || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, caseSize: parseInt(e.target.value) || 0 })
                    }
                    variant="outlined"
                    inputProps={{ step: '1', min: '1' }}
                    placeholder="ex: 24"
                    helperText="Combien d'unités dans un casier ?"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      fullWidth
                      label="Prix d'achat du casier"
                      type="number"
                      value={formData.caseCostPrice || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          caseCostPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      variant="outlined"
                      inputProps={{ step: '0.01', min: '0' }}
                      helperText="Coût d'achat du casier complet"
                    />
                    <TextField
                      fullWidth
                      label="Prix de vente du casier"
                      type="number"
                      value={formData.casePrice || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, casePrice: parseFloat(e.target.value) || 0 })
                      }
                      variant="outlined"
                      inputProps={{ step: '0.01', min: '0' }}
                      helperText="Prix client pour le casier"
                    />
                  </div>

                  {/* Calcul de marge casier */}
                  {formData.casePrice && formData.caseCostPrice && formData.casePrice > 0 ? (
                    <Alert
                      severity="success"
                      icon={false}
                      sx={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Marge casier :</span>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {(formData.casePrice - formData.caseCostPrice).toFixed(2)} €
                          </div>
                          <div className="text-sm text-gray-600">
                            {(
                              ((formData.casePrice - formData.caseCostPrice) /
                                formData.casePrice) *
                              100
                            ).toFixed(1)}
                            % de marge
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ) : null}

                  {/* Info prix unitaire en casier */}
                  {formData.casePrice && formData.caseSize && formData.caseSize > 0 ? (
                    <Alert severity="info" icon={false}>
                      <div className="text-sm">
                        <strong>Prix unitaire en casier :</strong>{' '}
                        {(formData.casePrice / formData.caseSize).toFixed(2)} € / unité
                        {formData.price && formData.price > 0 && (
                          <span className="ml-2 text-green-700">
                            (économie de{' '}
                            {(
                              ((formData.price - formData.casePrice / formData.caseSize) /
                                formData.price) *
                              100
                            ).toFixed(1)}
                            % par unité)
                          </span>
                        )}
                      </div>
                    </Alert>
                  ) : null}
                </div>
              )}
            </div>

            <Divider />

            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Description</h4>
              <TextField
                fullWidth
                label="Description du produit"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="outlined"
                placeholder="Décrivez brièvement le produit..."
              />
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
