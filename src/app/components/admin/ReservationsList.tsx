import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { GuestInfo } from '../ReservationForm';
import { CartItem } from '../Cart';

export interface Reservation {
  id: string;
  guestInfo: GuestInfo;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'confirmed' | 'delivered';
}

interface ReservationsListProps {
  reservations: Reservation[];
}

export function ReservationsList({ reservations }: ReservationsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'delivered':
        return 'default';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'delivered':
        return 'Livrée';
      default:
        return 'En attente';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Réservations</h2>

      {reservations.length === 0 ? (
        <Paper className="p-8 text-center text-gray-500">
          Aucune réservation pour le moment
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Client</strong></TableCell>
                <TableCell><strong>Chambre</strong></TableCell>
                <TableCell><strong>Téléphone</strong></TableCell>
                <TableCell><strong>Date de livraison</strong></TableCell>
                <TableCell><strong>Articles</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    {new Date(reservation.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{reservation.guestInfo.name}</div>
                      <div className="text-sm text-gray-500">
                        {reservation.guestInfo.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{reservation.guestInfo.roomNumber}</TableCell>
                  <TableCell>{reservation.guestInfo.phone}</TableCell>
                  <TableCell>
                    {new Date(reservation.guestInfo.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {reservation.items.map((item, idx) => (
                        <div key={idx}>
                          {item.drink.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {reservation.total.toFixed(2)} €
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(reservation.status)}
                      color={getStatusColor(reservation.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
