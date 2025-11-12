"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Inbox, CheckCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { StatusBadge } from "./StatusBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { formatRelativeTime } from "../../lib/formatTime";
import { api } from "../../lib/api";
import type { Event } from "../../types/api";

interface ActivityFeedProps {
  events: Event[];
  onEventAcknowledged?: (eventId: string) => void;
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
      onEventAcknowledged?.(eventId);
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
    <TooltipProvider>
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Feed</h3>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {events.map((event, index) => {
              const isExpanded = expandedEventId === event.event_id;

              return (
                <motion.div
                  key={event.event_id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  layout
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(event.event_id)}
                          disabled={acknowledgingId === event.event_id}
                          className="text-xs hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark as Processed
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark this event as consumed by your workflow</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-gray-100 overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Card>
    </TooltipProvider>
  );
};
