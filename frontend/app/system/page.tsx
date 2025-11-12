"use client";

import { useState, useEffect } from "react";
import { Database, GitBranch, Activity, ArrowRight } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { api } from "../../lib/api";
import type { Event } from "../../types/api";

type TabType = "database" | "flow" | "inspector";

export default function SystemPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("database");
  const [selectedEventPayload, setSelectedEventPayload] = useState<any>(null);

  const fetchAllEvents = async () => {
    try {
      const [pendingResponse, acknowledgedResponse] = await Promise.all([
        api.getInbox({ status: "pending", limit: 100 }),
        api.getInbox({ status: "acknowledged", limit: 100 }),
      ]);

      const allEvents = [
        ...pendingResponse.events,
        ...acknowledgedResponse.events,
      ].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setEvents(allEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
    const interval = setInterval(fetchAllEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-900">System Overview</h1>
        <p className="text-sm text-gray-600 mt-1">
          Backend transparency and system internals
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("database")}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            activeTab === "database"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Database className="h-4 w-4 inline-block mr-2" />
          Database
        </button>
        <button
          onClick={() => setActiveTab("flow")}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            activeTab === "flow"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <GitBranch className="h-4 w-4 inline-block mr-2" />
          Flow Diagram
        </button>
        <button
          onClick={() => setActiveTab("inspector")}
          className={`px-4 py-2 text-sm font-medium cursor-pointer ${
            activeTab === "inspector"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Activity className="h-4 w-4 inline-block mr-2" />
          Request Inspector
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "database" && (
        <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Database Contents
          </h2>
          <span className="text-sm text-gray-500">
            {events.length} total events
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading database...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No events in database</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Event ID
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Source
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Event Type
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Created At
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Payload
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr
                    key={event.event_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-mono text-xs text-gray-600">
                      {event.event_id.substring(0, 12)}...
                    </td>
                    <td className="p-3 text-gray-900">{event.source}</td>
                    <td className="p-3 text-gray-600">{event.event_type}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === "pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(event.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-blue-600 hover:text-blue-700 h-auto p-0"
                          >
                            View JSON
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>Event Payload</DialogTitle>
                          </DialogHeader>
                          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto">
                            <pre className="text-xs font-mono">
                              {JSON.stringify(event.payload, null, 2)}
                            </pre>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </Card>
      )}

      {/* Flow Diagram Tab */}
      {activeTab === "flow" && (
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Event Flow Architecture
          </h2>

          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-6">
              {/* External System */}
              <div className="text-center">
                <div className="w-32 h-24 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-center">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-blue-700">
                      External System
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Sends events</p>
              </div>

              <ArrowRight className="h-6 w-6 text-gray-400" />

              {/* FastAPI Backend */}
              <div className="text-center">
                <div className="w-32 h-24 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-center">
                    <Database className="h-8 w-8 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-green-700">
                      FastAPI
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">POST /api/v1/events</p>
              </div>

              <ArrowRight className="h-6 w-6 text-gray-400" />

              {/* SQLite Database */}
              <div className="text-center">
                <div className="w-32 h-24 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-center">
                    <Database className="h-8 w-8 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-purple-700">
                      SQLite DB
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Stores as pending</p>
              </div>

              <ArrowRight className="h-6 w-6 text-gray-400" />

              {/* Frontend UI */}
              <div className="text-center">
                <div className="w-32 h-24 bg-orange-100 border-2 border-orange-300 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-center">
                    <Activity className="h-8 w-8 text-orange-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-orange-700">
                      Frontend UI
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">GET /api/v1/inbox</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Event Lifecycle:
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-medium text-gray-900">1.</span> External
                system POSTs event → <code className="bg-gray-200 px-1 rounded">/api/v1/events</code>
              </li>
              <li>
                <span className="font-medium text-gray-900">2.</span> FastAPI
                validates and stores event in SQLite with status = "pending"
              </li>
              <li>
                <span className="font-medium text-gray-900">3.</span> Zapier
                workflow polls → <code className="bg-gray-200 px-1 rounded">/api/v1/inbox</code> (retrieves pending events)
              </li>
              <li>
                <span className="font-medium text-gray-900">4.</span> Workflow
                processes event (sends email, updates sheet, etc.)
              </li>
              <li>
                <span className="font-medium text-gray-900">5.</span> Workflow
                calls DELETE → <code className="bg-gray-200 px-1 rounded">/api/v1/events/&#123;id&#125;</code> (marks
                as "acknowledged")
              </li>
            </ol>
          </div>
        </Card>
      )}

      {/* Request Inspector Tab */}
      {activeTab === "inspector" && (
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            HTTP Request Inspector
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                1. Create Event (POST)
              </h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <pre>{`POST http://localhost:8000/api/v1/events
Content-Type: application/json

{
  "source": "stripe",
  "event_type": "payment.succeeded",
  "payload": {
    "amount": 2999,
    "currency": "usd"
  }
}

Response (201):
{
  "event_id": "evt_12345",
  "status": "received",
  "created_at": "2025-01-12T10:30:00Z",
  "message": "Event successfully ingested"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                2. Get Inbox (GET)
              </h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <pre>{`GET http://localhost:8000/api/v1/inbox?status=pending&limit=50

Response (200):
{
  "events": [
    {
      "event_id": "evt_12345",
      "source": "stripe",
      "event_type": "payment.succeeded",
      "payload": { "amount": 2999 },
      "status": "pending",
      "created_at": "2025-01-12T10:30:00Z"
    }
  ],
  "total": 1
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                3. Acknowledge Event (DELETE)
              </h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <pre>{`DELETE http://localhost:8000/api/v1/events/evt_12345

Response (200):
{
  "event_id": "evt_12345",
  "status": "acknowledged",
  "acknowledged_at": "2025-01-12T10:31:00Z"
}`}</pre>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
