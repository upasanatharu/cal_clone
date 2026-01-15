export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import CancelBookingButton from "./components/CancelBookingButton";

export default async function BookingsPage() {
  // Fetch all event types for user 1
  const user = await prisma.user.findUnique({
    where: { id: 1 },
    include: {
      eventTypes: {
        include: {
          bookings: {
            include: {
              eventType: true,
            },
            orderBy: {
              startTime: "asc",
            },
          },
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">
            User not found
          </h1>
        </div>
      </div>
    );
  }

  // Collect all bookings from all event types
  const allBookings = user.eventTypes.flatMap((eventType) =>
    eventType.bookings.map((booking) => ({
      ...booking,
      eventTypeTitle: eventType.title,
    }))
  );

  // Separate into upcoming and past
  const now = new Date();
  const upcoming = allBookings.filter(
    (booking) => new Date(booking.startTime) >= now
  );
  const past = allBookings.filter(
    (booking) => new Date(booking.startTime) < now
  );

  // Sort upcoming by startTime ascending, past by startTime descending
  upcoming.sort(
    (a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  past.sort(
    (a, b) =>
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Bookings</h1>

        {/* Upcoming Bookings */}
        <div className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Upcoming
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-400">No upcoming bookings.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((booking) => {
                const { date, time } = formatDateTime(booking.startTime);
                return (
                  <div
                    key={booking.id}
                    className="rounded-lg bg-[#1a1a1a] border border-gray-800 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-4">
                          <h3 className="font-semibold text-white">
                            {booking.bookerName}
                          </h3>
                          <span className="text-sm text-gray-400">
                            {booking.bookerEmail}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p>
                            <span className="font-medium text-gray-300">
                              Event:
                            </span>{" "}
                            {booking.eventTypeTitle}
                          </p>
                          <p>
                            <span className="font-medium text-gray-300">
                              Date:
                            </span>{" "}
                            {date}
                          </p>
                          <p>
                            <span className="font-medium text-gray-300">
                              Time:
                            </span>{" "}
                            {time}
                          </p>
                        </div>
                      </div>
                      <CancelBookingButton bookingId={booking.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Bookings */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">Past</h2>
          {past.length === 0 ? (
            <p className="text-gray-400">No past bookings.</p>
          ) : (
            <div className="space-y-3">
              {past.map((booking) => {
                const { date, time } = formatDateTime(booking.startTime);
                return (
                  <div
                    key={booking.id}
                    className="rounded-lg bg-[#1a1a1a] border border-gray-800 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-4">
                          <h3 className="font-semibold text-white">
                            {booking.bookerName}
                          </h3>
                          <span className="text-sm text-gray-400">
                            {booking.bookerEmail}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p>
                            <span className="font-medium text-gray-300">
                              Event:
                            </span>{" "}
                            {booking.eventTypeTitle}
                          </p>
                          <p>
                            <span className="font-medium text-gray-300">
                              Date:
                            </span>{" "}
                            {date}
                          </p>
                          <p>
                            <span className="font-medium text-gray-300">
                              Time:
                            </span>{" "}
                            {time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
