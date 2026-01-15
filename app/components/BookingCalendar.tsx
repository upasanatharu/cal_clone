"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createBooking } from "@/app/actions";

interface BookingCalendarProps {
  duration: number;
  eventTypeId: number;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function BookingCalendar({
  duration,
  eventTypeId,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setSelectedTime("");
    }
  };

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 17;
    const startMinutes = 0;
    const endMinutes = 0;

    let currentHour = startHour;
    let currentMinutes = startMinutes;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinutes <= endMinutes)
    ) {
      const timeString = `${currentHour.toString().padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}`;
      slots.push(timeString);

      currentMinutes += duration;
      if (currentMinutes >= 60) {
        currentMinutes = 0;
        currentHour += 1;
      }
    }

    return slots;
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTime(time);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time.");
      return;
    }

    // Combine selectedDate and selectedTime into a single Date object
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);

    // Call the createBooking action
    const result = await createBooking({
      eventTypeId,
      name,
      email,
      startTime,
      duration,
    });

    if (result.success) {
      alert("Booking Confirmed!");
      // Reset form and close modal
      setShowModal(false);
      setName("");
      setEmail("");
      setSelectedTime("");
      setSelectedDate(null);
    } else {
      alert(result.error || "Failed to create booking. Please try again.");
    }
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Calendar */}
      <div className="md:col-span-2">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="!border-0 !w-full"
          tileClassName={({ date, view }) => {
            if (view === "month") {
              const isSelected =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString();
              return `p-2 rounded-lg text-sm ${
                isSelected
                  ? "bg-white text-black"
                  : "hover:bg-[#1a1a1a] text-white"
              }`;
            }
            return "";
          }}
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="md:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-white">
            Select a time
          </h3>
          <div className="h-full max-h-[350px] overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-2 pr-1">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => handleTimeSlotClick(time)}
                    className={`w-full py-3 font-medium border rounded-md transition-all ${
                      isSelected
                        ? "bg-white text-black border-white"
                        : "border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="w-full max-w-md rounded-lg bg-[#1a1a1a] border border-gray-800 p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-white">
              Confirm your booking
            </h2>
            <div className="mb-4 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-700 bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="rounded-md bg-[#0a0a0a] border border-gray-800 p-3 text-sm text-gray-400">
                <p>
                  <span className="font-medium text-gray-300">Date:</span>{" "}
                  {selectedDate?.toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-gray-300">Time:</span> {selectedTime}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setName("");
                  setEmail("");
                }}
                className="flex-1 rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!name || !email}
                className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
