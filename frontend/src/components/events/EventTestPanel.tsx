"use client";

import { useState } from "react";
import { Zap, Loader2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventTemplates } from "@/lib/eventTemplates";
import { api } from "@/lib/api";
import type { EventTemplate } from "@/types/api";

interface EventTestPanelProps {
  onEventSent?: () => void;
}

export const EventTestPanel = ({ onEventSent }: EventTestPanelProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate>(
    eventTemplates[0]!
  );
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setIsSending(true);
    setError(null);

    try {
      await api.createEvent({
        source: selectedTemplate.source,
        event_type: selectedTemplate.event_type,
        payload: selectedTemplate.payload,
      });
      onEventSent?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send event");
    } finally {
      setIsSending(false);
    }
  };

  const handleTemplateChange = (value: string) => {
    const template = eventTemplates.find((t) => t.displayName === value);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
          <Zap className="h-5 w-5 text-white fill-current" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Test Event Panel</h3>
      </div>

      {/* Event Type Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Event Source
        </label>
        <Select
          value={selectedTemplate.displayName}
          onValueChange={handleTemplateChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {eventTemplates.map((template) => (
              <SelectItem key={template.displayName} value={template.displayName}>
                <span className="flex items-center gap-2">
                  <span>{template.emoji}</span>
                  <span>{template.displayName}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payload Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Sample Payload
        </label>
        <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
          <pre className="text-xs font-mono text-gray-800 overflow-auto max-h-48">
            {JSON.stringify(
              {
                source: selectedTemplate.source,
                event_type: selectedTemplate.event_type,
                payload: selectedTemplate.payload,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          This will send a test event to your inbox. Make sure the backend API is
          running.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-800">{error}</p>
        </div>
      )}

      {/* Send Button */}
      <Button
        onClick={handleSend}
        disabled={isSending}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 !cursor-pointer disabled:!cursor-not-allowed"
      >
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Test Event"
        )}
      </Button>
    </Card>
  );
};
