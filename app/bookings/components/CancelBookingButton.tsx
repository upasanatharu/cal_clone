"use client";

import { cancelBooking } from "@/app/actions";
import { useState } from "react";

export default function CancelBookingButton({
  bookingId,
}: {
  bookingId: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setIsLoading(true);
    const result = await cancelBooking(bookingId);
    setIsLoading(false);

    if (result.success) {
      alert("Booking cancelled successfully!");
    } else {
      alert(result.error || "Failed to cancel booking. Please try again.");
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className="text-red-600 hover:text-red-800 text-sm border border-red-200 px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Cancelling..." : "Cancel"}
    </button>
  );
}
