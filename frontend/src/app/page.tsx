"use client";

import { useState, useEffect } from "react";
import { EventTestPanel } from "@/components/events/EventTestPanel";
import { ActivityFeed } from "@/components/events/ActivityFeed";
import { api } from "@/lib/api";
import type { Event } from "@/types/api";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await api.getInbox({ limit: 50 });
      setEvents(response.events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Poll for new events every 3 seconds
    const interval = setInterval(fetchEvents, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900">Event Inbox</h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor and manage real-time events from your integrations
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Test Panel */}
        <div>
          <EventTestPanel onEventSent={fetchEvents} />
        </div>

        {/* Right Column - Activity Feed */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : (
            <ActivityFeed events={events} onEventAcknowledged={fetchEvents} />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-medium text-gray-900 mt-1">
            {events.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-medium text-orange-600 mt-1">
            {events.filter((e) => e.status === "pending").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Acknowledged</p>
          <p className="text-2xl font-medium text-green-600 mt-1">
            {events.filter((e) => e.status === "acknowledged").length}
          </p>
        </div>
      </div>
    </div>
  );
}
