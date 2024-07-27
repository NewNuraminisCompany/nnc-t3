import Link from "next/link";

export function EventList({ eventId }: { eventId: string }) {
  return (
    <Link href={`/eventi/${eventId}`}>
      <a className="text-blue-500 hover:text-blue-700 hover:underline">
        {eventId}
      </a>
    </Link>
  );
}
