export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">
          404 Event Not Found
        </h1>
        <p className="mb-4 text-gray-400">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/"
          className="text-white hover:text-gray-300 hover:underline"
        >
          Return to home
        </a>
      </div>
    </div>
  );
}
