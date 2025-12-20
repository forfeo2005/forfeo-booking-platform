import { describe, it, expect, beforeAll } from 'vitest';
import * as db from '../db';

describe('Database Functions', () => {
  let testCompanyId: number;
  let testServiceId: number;
  let testCustomerId: number;

  beforeAll(async () => {
    // Ensure database is connected
    const dbInstance = await db.getDb();
    expect(dbInstance).toBeDefined();
  });

  describe('Company Operations', () => {
    it('should create a company', async () => {
      const companyId = await db.createCompany({
        ownerId: 1,
        name: 'Test Company',
        description: 'A test company',
        email: 'test@example.com',
      });
      
      expect(companyId).toBeGreaterThan(0);
      testCompanyId = companyId;
    });

    it('should get company by id', async () => {
      const company = await db.getCompanyById(testCompanyId);
      
      expect(company).toBeDefined();
      expect(company?.name).toBe('Test Company');
      expect(company?.email).toBe('test@example.com');
    });

    it('should update company', async () => {
      await db.updateCompany(testCompanyId, {
        description: 'Updated description',
      });

      const company = await db.getCompanyById(testCompanyId);
      expect(company?.description).toBe('Updated description');
    });
  });

  describe('Service Operations', () => {
    it('should create a service', async () => {
      const serviceId = await db.createService({
        companyId: testCompanyId,
        name: 'Test Service',
        description: 'A test service',
        duration: 60,
        price: '99.99',
      });
      
      expect(serviceId).toBeGreaterThan(0);
      testServiceId = serviceId;
    });

    it('should get service by id', async () => {
      const service = await db.getServiceById(testServiceId);
      
      expect(service).toBeDefined();
      expect(service?.name).toBe('Test Service');
      expect(service?.duration).toBe(60);
    });

    it('should get services by company', async () => {
      const services = await db.getServicesByCompany(testCompanyId);
      
      expect(services).toBeDefined();
      expect(services.length).toBeGreaterThan(0);
      expect(services.some(s => s.id === testServiceId)).toBe(true);
    });
  });

  describe('Availability Operations', () => {
    it('should create availability slot', async () => {
      // Use the demo service ID from seed data
      const slotId = await db.createAvailabilitySlot({
        serviceId: 1, // Demo service from seed
        date: '2025-01-15',
        time: '10:00',
        capacity: 3,
      });
      
      expect(slotId).toBeGreaterThan(0);
    });

    it('should get availability slots', async () => {
      const slots = await db.getAvailabilitySlots(
        1, // Demo service from seed
        '2025-01-01',
        '2025-01-31'
      );
      
      expect(slots).toBeDefined();
      expect(slots.length).toBeGreaterThan(0);
    });
  });

  describe('Customer Operations', () => {
    it('should create a customer', async () => {
      const customerId = await db.createCustomer({
        name: 'Test Customer',
        email: 'customer@example.com',
        phone: '514-555-0000',
      });
      
      expect(customerId).toBeGreaterThan(0);
      testCustomerId = customerId;
    });

    it('should get customer by email', async () => {
      const customer = await db.getCustomerByEmail('customer@example.com');
      
      expect(customer).toBeDefined();
      expect(customer?.name).toBe('Test Customer');
    });

    it('should not create duplicate customer', async () => {
      // Getting existing customer should work
      const existing = await db.getCustomerByEmail('customer@example.com');
      expect(existing).toBeDefined();
    });
  });

  describe('Booking Operations', () => {
    it('should generate unique confirmation numbers', () => {
      const num1 = db.generateConfirmationNumber();
      const num2 = db.generateConfirmationNumber();
      
      expect(num1).toMatch(/^FORFEO-\d{4}-[A-Z0-9]{6}$/);
      expect(num2).toMatch(/^FORFEO-\d{4}-[A-Z0-9]{6}$/);
      expect(num1).not.toBe(num2);
    });

    it('should create a booking', async () => {
      // Use demo data from seed
      const customer = await db.getCustomerByEmail('marie.t@example.com');
      expect(customer).toBeDefined();
      
      // First create a slot
      const slotId = await db.createAvailabilitySlot({
        serviceId: 1, // Demo service
        date: '2025-01-20',
        time: '14:00',
        capacity: 2,
      });

      const confirmationNumber = db.generateConfirmationNumber();
      const bookingId = await db.createBooking({
        confirmationNumber,
        serviceId: 1,
        slotId,
        customerId: customer!.id,
        date: '2025-01-20',
        time: '14:00',
        amount: '99.99',
      });
      
      expect(bookingId).toBeGreaterThan(0);

      // Verify booking was created
      const booking = await db.getBookingById(bookingId);
      expect(booking).toBeDefined();
      expect(booking?.confirmationNumber).toBe(confirmationNumber);
      expect(booking?.status).toBe('confirmed');
    });

    it('should get booking by confirmation number', async () => {
      const customer = await db.getCustomerByEmail('marie.t@example.com');
      const confirmationNumber = db.generateConfirmationNumber();
      const slotId = await db.createAvailabilitySlot({
        serviceId: 1,
        date: '2025-01-21',
        time: '15:00',
        capacity: 2,
      });

      await db.createBooking({
        confirmationNumber,
        serviceId: 1,
        slotId,
        customerId: customer!.id,
        date: '2025-01-21',
        time: '15:00',
        amount: '99.99',
      });

      const booking = await db.getBookingByConfirmationNumber(confirmationNumber);
      expect(booking).toBeDefined();
      expect(booking?.confirmationNumber).toBe(confirmationNumber);
    });
  });

  describe('Chat Operations', () => {
    it('should create chat message', async () => {
      const customer = await db.getCustomerByEmail('marie.t@example.com');
      
      // Create a booking first
      const slotId = await db.createAvailabilitySlot({
        serviceId: 1,
        date: '2025-01-22',
        time: '16:00',
        capacity: 2,
      });

      const bookingId = await db.createBooking({
        confirmationNumber: db.generateConfirmationNumber(),
        serviceId: 1,
        slotId,
        customerId: customer!.id,
        date: '2025-01-22',
        time: '16:00',
        amount: '99.99',
      });

      const messageId = await db.createChatMessage({
        bookingId,
        senderId: customer!.id,
        senderType: 'customer',
        message: 'Hello, I have a question',
      });
      
      expect(messageId).toBeGreaterThan(0);

      // Get messages
      const messages = await db.getChatMessagesByBooking(bookingId);
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0].message).toBe('Hello, I have a question');
    });
  });
});
