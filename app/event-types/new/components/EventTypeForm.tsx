"use client";

import { useState } from "react";
import { createEventType } from "@/app/actions";

export default function EventTypeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const duration = parseInt(formData.get("duration") as string, 10);
    const description = formData.get("description") as string;

    try {
      const result = await createEventType({
        title,
        slug,
        duration,
        description: description || null,
      });

      // If we get here, redirect didn't happen (error case)
      setIsLoading(false);
      if (result && !result.success) {
        setError(result.error || "Failed to create event type. Please try again.");
      }
    } catch (err) {
      // Redirect throws, so we catch it here but don't show error
      // The redirect will happen automatically
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-900/20 border border-red-800 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-white"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] px-3 py-2 text-white placeholder-gray-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          placeholder="e.g., 15 Min Meeting"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-2 block text-sm font-medium text-white"
        >
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          required
          className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] px-3 py-2 text-white placeholder-gray-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          placeholder="e.g., 15-min-meeting"
        />
        <p className="mt-1 text-xs text-gray-400">
          Used in the URL: localhost:3000/[username]/[slug]
        </p>
      </div>

      <div>
        <label
          htmlFor="duration"
          className="mb-2 block text-sm font-medium text-white"
        >
          Duration (minutes)
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          required
          min="1"
          className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] px-3 py-2 text-white placeholder-gray-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          placeholder="15"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-white"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full rounded-md border border-gray-700 bg-[#1a1a1a] px-3 py-2 text-white placeholder-gray-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          placeholder="Optional description of the event type..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
