"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CreateBookingInput {
  eventTypeId: number;
  name: string;
  email: string;
  startTime: Date;
  duration: number;
}

export async function createBooking({
  eventTypeId,
  name,
  email,
  startTime,
  duration,
}: CreateBookingInput) {
  try {
    // Calculate endTime (startTime + duration in minutes)
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    // Check for overlapping bookings
    // Two time ranges overlap if: newStart < existingEnd AND newEnd > existingStart
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        eventTypeId: eventTypeId,
        AND: [
          { startTime: { lt: endTime } }, // existing start < new end
          { endTime: { gt: startTime } }, // existing end > new start
        ],
      },
    });

    if (overlappingBooking) {
      return {
        success: false,
        error: "This time slot is already booked. Please select another time.",
      };
    }

    // Create the booking
    await prisma.booking.create({
      data: {
        eventTypeId,
        bookerName: name,
        bookerEmail: email,
        startTime,
        endTime,
      },
    });

    // Revalidate the booking page to update the calendar
    revalidatePath("/[username]/[slug]", "page");

    return { success: true };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      error: "Failed to create booking. Please try again.",
    };
  }
}

export async function cancelBooking(bookingId: number) {
  try {
    // Delete the booking
    await prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });

    // Revalidate the bookings page and booking pages
    revalidatePath("/bookings");
    revalidatePath("/[username]/[slug]", "page");

    return { success: true };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      error: "Failed to cancel booking. Please try again.",
    };
  }
}

interface CreateEventTypeInput {
  title: string;
  slug: string;
  duration: number;
  description: string | null;
}

export async function createEventType({
  title,
  slug,
  duration,
  description,
}: CreateEventTypeInput) {
  try {
    // Check if slug already exists
    const existingEventType = await prisma.eventType.findUnique({
      where: { slug },
    });

    if (existingEventType) {
      return {
        success: false,
        error: "A event type with this slug already exists. Please choose a different slug.",
      };
    }

    // Create the event type for User 1
    await prisma.eventType.create({
      data: {
        title,
        slug,
        duration,
        description,
        userId: 1,
      },
    });

    // Revalidate the home page
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating event type:", error);
    return {
      success: false,
      error: "Failed to create event type. Please try again.",
    };
  }

  // Redirect outside of try-catch so redirect error can propagate
  redirect("/");
}
