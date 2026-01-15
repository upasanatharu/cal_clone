import { prisma } from "@/lib/prisma";
import CopyLinkButton from "./components/CopyLinkButton";

export default async function Home() {
  const user = await prisma.user.findUnique({
    where: { id: 1 },
    include: { eventTypes: true },
  });

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">
            User not found
          </h1>
          <p className="mt-2 text-gray-400">
            Please ensure a user with ID 1 exists in the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with Welcome and New Event Type Button */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user.username}
          </h1>
          <a
            href="/event-types/new"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          >
            New Event Type
          </a>
        </div>

        {/* Event Types Grid */}
        {user.eventTypes.length === 0 ? (
          <div className="rounded-lg bg-[#1a1a1a] border border-gray-800 p-8 text-center shadow-sm">
            <p className="text-gray-400">No event types yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {user.eventTypes.map((eventType) => {
              const href = `/${user.username}/${eventType.slug}`;
              return (
                <div
                  key={eventType.id}
                  className="rounded-lg bg-[#1a1a1a] border border-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md hover:border-gray-700"
                >
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    {eventType.title}
                  </h2>
                  <p className="mb-3 text-sm font-medium text-gray-400">
                    {eventType.duration} mins
                  </p>
                  {eventType.description && (
                    <p className="mb-4 text-sm text-gray-400">
                      {eventType.description}
                    </p>
                  )}
                  <CopyLinkButton href={href} />
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
