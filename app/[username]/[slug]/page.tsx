import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingCalendar from "@/app/components/BookingCalendar";

interface PageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { username, slug } = await params;

  const eventType = await prisma.eventType.findUnique({
    where: {
      slug: slug,
    },
    include: {
      user: true,
    },
  });

  // Check if event type exists and belongs to the correct user
  if (!eventType || eventType.user.username !== username) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl mx-auto rounded-2xl border border-gray-800 bg-[#1a1a1a] shadow-xl p-6 md:p-10">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Event Info */}
          <div>
            {/* Event Title */}
            <h1 className="mb-4 text-3xl font-bold text-white">
              {eventType.title}
            </h1>

            {/* Description */}
            {eventType.description && (
              <p className="mb-6 text-gray-400 leading-relaxed">
                {eventType.description}
              </p>
            )}

            {/* Duration with clock icon */}
            <div className="flex items-center gap-2 text-gray-300">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                {eventType.duration} minutes
              </span>
            </div>
          </div>

          {/* Gray Vertical Divider */}
          <div className="hidden md:block border-r border-gray-800" />

          {/* Right Side - Calendar */}
          <div className="border-t border-gray-800 md:border-t-0">
            <BookingCalendar
              duration={eventType.duration}
              eventTypeId={eventType.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
