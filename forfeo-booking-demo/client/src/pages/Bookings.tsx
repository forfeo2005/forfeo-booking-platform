import { trpc } from "../utils/trpc";

export default function Bookings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Réservations</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-500">Aucune réservation pour le moment.</p>
      </div>
    </div>
  );
}
