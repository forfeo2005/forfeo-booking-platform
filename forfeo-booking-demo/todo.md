# Project TODO

## Backend API & Database
- [x] Créer le schéma Prisma complet (companies, services, bookings, availability, etc.)
- [x] Implémenter les procédures tRPC pour les disponibilités
- [x] Implémenter les procédures tRPC pour les réservations
- [x] Ajouter la gestion des créneaux récurrents
- [x] Implémenter la prévention des doubles réservations (transactions SQL)
- [x] Créer le système de génération de numéros de confirmation

## Système de Paiement Stripe
- [x] Configurer Stripe Connect
- [x] Implémenter le processus de paiement
- [x] Ajouter la gestion des remboursements
- [x] Intégrer les webhooks Stripe

## Chat WebSocket
- [x] Configurer Socket.io
- [x] Implémenter les messages en temps réel
- [x] Créer le système de notifications
- [x] Préparer l'intégration du bot IA Forfy

## Frontend
- [x] Connecter le frontend aux APIs tRPC
- [x] Implémenter la gestion d'état avec React Query
- [x] Ajouter les loading states et error handling
- [x] Tester le flux complet de réservation
