import { useState } from 'react';
import { TextField, Button, Paper } from '@mui/material';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: (password: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin(password);
      toast.success('Connexion réussie');
    } else {
      toast.error('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <Paper className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Lock className="w-12 h-12 mx-auto text-amber-700 mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">Panneau Administrateur</h1>
          <p className="text-gray-600 mt-1">Au Petit Caillou</p>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#92400e',
              '&:hover': {
                backgroundColor: '#78350f',
              },
            }}
          >
            Se connecter
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Mot de passe par défaut : admin123
        </p>
      </Paper>
    </div>
  );
}
