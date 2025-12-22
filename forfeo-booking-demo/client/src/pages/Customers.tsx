import { trpc } from "../utils/trpc";

export default function Customers() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clients</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-500">Liste des clients vide.</p>
      </div>
    </div>
  );
}
