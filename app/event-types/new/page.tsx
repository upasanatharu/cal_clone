import { createEventType } from "@/app/actions";
import EventTypeForm from "./components/EventTypeForm";

export default function NewEventTypePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-white">
          Create New Event Type
        </h1>
        <EventTypeForm />
      </div>
    </div>
  );
}
