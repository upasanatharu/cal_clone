import Link from "next/link";

export default function CopyLinkButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
    >
      View Booking Page
    </Link>
  );
}
