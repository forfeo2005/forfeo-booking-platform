import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { stripeRouter } from "./stripe/routes";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========== SERVICES ==========
  services: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const service = await db.getServiceById(input.id);
        if (!service) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Service not found' });
        }
        
        // Parse JSON fields
        return {
          ...service,
          images: service.images ? JSON.parse(service.images) : [],
          included: service.included ? JSON.parse(service.included) : [],
          notIncluded: service.notIncluded ? JSON.parse(service.notIncluded) : [],
        };
      }),
    
    getByCompany: publicProcedure
      .input(z.object({ companyId: z.number() }))
      .query(async ({ input }) => {
        const services = await db.getServicesByCompany(input.companyId);
        return services.map(service => ({
          ...service,
          images: service.images ? JSON.parse(service.images) : [],
          included: service.included ? JSON.parse(service.included) : [],
          notIncluded: service.notIncluded ? JSON.parse(service.notIncluded) : [],
        }));
      }),
    
    create: protectedProcedure
      .input(z.object({
        companyId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        duration: z.number(),
        price: z.string(),
        images: z.array(z.string()).optional(),
        included: z.array(z.string()).optional(),
        notIncluded: z.array(z.string()).optional(),
        ambassadorTested: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const serviceId = await db.createService({
          ...input,
          images: input.images ? JSON.stringify(input.images) : undefined,
          included: input.included ? JSON.stringify(input.included) : undefined,
          notIncluded: input.notIncluded ? JSON.stringify(input.notIncluded) : undefined,
        });
        return { id: serviceId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        duration: z.number().optional(),
        price: z.string().optional(),
        images: z.array(z.string()).optional(),
        included: z.array(z.string()).optional(),
        notIncluded: z.array(z.string()).optional(),
        ambassadorTested: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateService(id, {
          ...data,
          images: data.images ? JSON.stringify(data.images) : undefined,
          included: data.included ? JSON.stringify(data.included) : undefined,
          notIncluded: data.notIncluded ? JSON.stringify(data.notIncluded) : undefined,
        });
        return { success: true };
      }),
  }),

  // ========== AVAILABILITY ==========
  availability: router({
    getSlots: publicProcedure
      .input(z.object({
        serviceId: z.number(),
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getAvailabilitySlots(input.serviceId, input.startDate, input.endDate);
      }),
    
    createSlot: protectedProcedure
      .input(z.object({
        serviceId: z.number(),
        date: z.string(),
        time: z.string(),
        capacity: z.number(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const slotId = await db.createAvailabilitySlot(input);
        return { id: slotId };
      }),
    
    updateSlot: protectedProcedure
      .input(z.object({
        id: z.number(),
        capacity: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateAvailabilitySlot(id, data);
        return { success: true };
      }),
    
    createBulkSlots: protectedProcedure
      .input(z.object({
        serviceId: z.number(),
        slots: z.array(z.object({
          date: z.string(),
          time: z.string(),
          capacity: z.number(),
        })),
      }))
      .mutation(async ({ input }) => {
        const slotIds = [];
        for (const slot of input.slots) {
          const id = await db.createAvailabilitySlot({
            serviceId: input.serviceId,
            ...slot,
          });
          slotIds.push(id);
        }
        return { count: slotIds.length, ids: slotIds };
      }),
  }),

  // ========== BOOKINGS ==========
  bookings: router({
    create: publicProcedure
      .input(z.object({
        serviceId: z.number(),
        slotId: z.number(),
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        isGift: z.boolean().optional(),
        recipientName: z.string().optional(),
        recipientEmail: z.string().email().optional(),
        giftMessage: z.string().optional(),
        specialMessage: z.string().optional(),
        amount: z.string(),
      }))
      .mutation(async ({ input }) => {
        const slot = await db.getAvailabilitySlotById(input.slotId);
        if (!slot) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Slot not found' });
        }
        
        if (!slot.isActive) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Slot is not active' });
        }
        
        if ((slot.booked || 0) >= slot.capacity) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Slot is fully booked' });
        }
        
        let customer = await db.getCustomerByEmail(input.customerEmail);
        if (!customer) {
          const customerId = await db.createCustomer({
            name: input.customerName,
            email: input.customerEmail,
            phone: input.customerPhone,
          });
          customer = await db.getCustomerById(customerId);
        }
        
        if (!customer) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create customer' });
        }
        
        if (customer.isBlocked) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Customer is blocked due to no-shows' });
        }
        
        const confirmationNumber = db.generateConfirmationNumber();
        const bookingId = await db.createBooking({
          confirmationNumber,
          serviceId: input.serviceId,
          slotId: input.slotId,
          customerId: customer.id,
          date: slot.date,
          time: slot.time,
          isGift: input.isGift || false,
          recipientName: input.recipientName,
          recipientEmail: input.recipientEmail,
          giftMessage: input.giftMessage,
          specialMessage: input.specialMessage,
          amount: input.amount,
        });
        
        await db.incrementSlotBooked(input.slotId);
        
        return {
          id: bookingId,
          confirmationNumber,
        };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const booking = await db.getBookingById(input.id);
        if (!booking) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' });
        }
        return booking;
      }),
    
    getByConfirmation: publicProcedure
      .input(z.object({ confirmationNumber: z.string() }))
      .query(async ({ input }) => {
        const booking = await db.getBookingByConfirmationNumber(input.confirmationNumber);
        if (!booking) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' });
        }
        return booking;
      }),
    
    getByService: protectedProcedure
      .input(z.object({ serviceId: z.number() }))
      .query(async ({ input }) => {
        return await db.getBookingsByService(input.serviceId);
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['confirmed', 'completed', 'cancelled', 'no_show']),
      }))
      .mutation(async ({ input }) => {
        const booking = await db.getBookingById(input.id);
        if (!booking) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' });
        }
        
        if (input.status === 'no_show') {
          const customer = await db.getCustomerById(booking.customerId);
          if (customer) {
            const newNoShowCount = (customer.noShowCount || 0) + 1;
            await db.updateCustomer(customer.id, {
              noShowCount: newNoShowCount,
            });
            
            const service = await db.getServiceById(booking.serviceId);
            if (service) {
              const company = await db.getCompanyById(service.companyId);
              if (company && newNoShowCount >= (company.maxNoShowsBeforeBlock || 2)) {
                await db.updateCustomer(customer.id, { isBlocked: true });
              }
            }
          }
        }
        
        await db.updateBooking(input.id, { status: input.status });
        return { success: true };
      }),
    
    addInternalNote: protectedProcedure
      .input(z.object({
        id: z.number(),
        note: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.updateBooking(input.id, { internalNotes: input.note });
        return { success: true };
      }),
  }),

  // ========== CHAT ==========
  chat: router({
    getMessages: publicProcedure
      .input(z.object({ bookingId: z.number() }))
      .query(async ({ input }) => {
        return await db.getChatMessagesByBooking(input.bookingId);
      }),
    
    sendMessage: publicProcedure
      .input(z.object({
        bookingId: z.number(),
        senderId: z.number(),
        senderType: z.enum(['customer', 'company', 'bot']),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        const messageId = await db.createChatMessage(input);
        return { id: messageId };
      }),
    
    markAsRead: publicProcedure
      .input(z.object({ bookingId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markMessagesAsRead(input.bookingId);
        return { success: true };
      }),
  }),

  // ========== COMPANIES ==========
  companies: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const company = await db.getCompanyById(input.id);
        if (!company) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Company not found' });
        }
        return company;
      }),
    
    getByOwner: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        return await db.getCompaniesByOwner(ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        logo: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        
        const companyId = await db.createCompany({
          ownerId: ctx.user.id,
          ...input,
        });
        
        return { id: companyId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        cancellationPolicy: z.enum(['flexible', 'moderate', 'strict', 'custom']).optional(),
        cancellationHours: z.number().optional(),
        cancellationFeePercent: z.number().optional(),
        noShowFeePercent: z.number().optional(),
        maxNoShowsBeforeBlock: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCompany(id, data);
        return { success: true };
      }),
  }),

  // ========== STRIPE ==========
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
