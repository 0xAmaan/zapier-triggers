"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Inbox, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "./StatusBadge";
import { formatRelativeTime } from "@/lib/formatTime";
import { api } from "@/lib/api";
import type { Event } from "@/types/api";

interface ActivityFeedProps {
  events: Event[];
  onEventAcknowledged?: () => void;
}

export const ActivityFeed = ({
  events,
  onEventAcknowledged,
}: ActivityFeedProps) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);

  const toggleExpand = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const handleAcknowledge = async (eventId: string) => {
    setAcknowledgingId(eventId);
    try {
      await api.acknowledgeEvent(eventId);
      onEventAcknowledged?.();
    } catch (error) {
      console.error("Failed to acknowledge event:", error);
    } finally {
      setAcknowledgingId(null);
    }
  };

  if (events.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No events yet
        </h3>
        <p className="text-sm text-gray-500">
          Send a test event to see it appear here
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Feed</h3>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {events.map((event) => {
            const isExpanded = expandedEventId === event.event_id;

            return (
              <div
                key={event.event_id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors cursor-default"
              >
                {/* Event Header */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {event.source}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {event.event_type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(event.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={event.status} />
                </div>

                {/* Event ID */}
                <div className="mb-3">
                  <span className="text-xs font-mono text-gray-400">
                    {event.event_id}
                  </span>
                </div>

                {/* Expand Button */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(event.event_id)}
                    className="text-xs text-gray-600 hover:text-gray-900"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show details
                      </>
                    )}
                  </Button>

                  {event.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledge(event.event_id)}
                      disabled={acknowledgingId === event.event_id}
                      className="text-xs"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <label className="text-xs font-medium text-gray-700 mb-2 block">
                      Event Payload
                    </label>
                    <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                      <pre className="text-xs font-mono text-gray-800 overflow-auto max-h-64">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </div>
                    {event.acknowledged_at && (
                      <p className="text-xs text-gray-500 mt-2">
                        Acknowledged {formatRelativeTime(event.acknowledged_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};
