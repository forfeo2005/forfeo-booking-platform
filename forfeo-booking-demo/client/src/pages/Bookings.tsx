import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

function statusBadge(status: string) {
  const s = (status || "").toUpperCase();

  if (s === "PENDING") return <span className="badge text-bg-warning">En attente</span>;
  if (s === "CONFIRMED") return <span className="badge text-bg-success">Confirmée</span>;
  if (s === "CANCELLED" || s === "CANCELED")
    return <span className="badge text-bg-danger">Annulée</span>;

  return <span className="badge text-bg-light border">{status}</span>;
}

export default function Bookings() {
  const utils = trpc.useUtils();

  const { data, isLoading, isError } = trpc.bookings.list.useQuery();

  const updateStatus = trpc.bookings.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.bookings.list.invalidate();
    },
  });

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Réservations</h1>
          <div className="text-muted">Gérer, confirmer, annuler des réservations.</div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-primary">Module</span>
          <Link href="/">
            <a className="btn btn-outline-secondary btn-sm">← Retour</a>
          </Link>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-primary btn-sm" disabled>
                + Nouvelle réservation
              </button>
              <button className="btn btn-outline-primary btn-sm" disabled>
                Exporter
              </button>
            </div>

            <div className="d-flex gap-2">
              <input
                className="form-control form-control-sm"
                placeholder="Rechercher (nom, #, service)…"
                style={{ minWidth: 260 }}
                disabled
              />
              <select className="form-select form-select-sm" defaultValue="all" disabled>
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="canceled">Annulée</option>
              </select>
            </div>
          </div>

          <div className="small text-muted mt-2">
            (Les filtres/recherche seront branchés après. Là on connecte la DB.)
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {isLoading && <div className="text-muted">Chargement des réservations…</div>}

          {isError && (
            <div className="alert alert-danger mb-0">
              Impossible de charger les réservations (tRPC/DB).
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(data ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          Aucune réservation pour le moment.
                        </td>
                      </tr>
                    ) : (
                      (data ?? []).map((b: any) => {
                        // selon ton router, les champs peuvent s’appeler:
                        // id, createdAt, status, customerName, serviceTitle, etc.
                        const id = b.id;
                        const status = b.status ?? "PENDING";

                        const customer =
                          b.customerName ??
                          b.customerEmail ??
                          b.customerId ??
                          "—";

                        const service = b.serviceTitle ?? b.serviceId ?? "—";

                        const dateText =
                          b.date && b.time
                            ? `${b.date} ${b.time}`
                            : b.createdAt
                            ? new Date(b.createdAt).toLocaleString()
                            : "—";

                        const isPending = updateStatus.isPending;

                        return (
                          <tr key={id}>
                            <td className="fw-semibold">{id}</td>
                            <td>{customer}</td>
                            <td>{service}</td>
                            <td>{dateText}</td>
                            <td>{statusBadge(status)}</td>
                            <td className="text-end">
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  disabled={isPending}
                                  onClick={() =>
                                    updateStatus.mutate({
                                      bookingId: String(id),
                                      status: "CONFIRMED",
                                    })
                                  }
                                >
                                  Confirmer
                                </button>

                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  disabled={isPending}
                                  onClick={() =>
                                    updateStatus.mutate({
                                      bookingId: String(id),
                                      status: "CANCELLED",
                                    })
                                  }
                                >
                                  Annuler
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="small text-muted mt-3">
                ✅ Cette liste vient maintenant de MySQL (Drizzle) via tRPC :{" "}
                <code>trpc.bookings.list</code>.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
