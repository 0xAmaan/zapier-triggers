"use client";

import { Card } from "../../components/ui/card";
import { Code, BookOpen, Zap } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">API Documentation</h1>
        </div>
        <p className="text-gray-600">
          Real-time event ingestion system for Zapier workflows
        </p>
      </div>

      {/* Overview */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Overview</h2>
        <p className="text-gray-700 mb-4">
          The Zapier Triggers API provides a RESTful interface for ingesting, retrieving, and acknowledging events from any system. Events flow through a simple lifecycle: ingest → store → retrieve → acknowledge.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            <strong>Base URL:</strong> <code className="bg-orange-100 px-2 py-1 rounded">http://localhost:8000</code>
          </p>
        </div>
      </Card>

      {/* Endpoints */}
      <div className="space-y-6">
        {/* POST /api/v1/events */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">POST</span>
            <code className="text-lg font-mono text-gray-900">/api/v1/events</code>
          </div>

          <p className="text-gray-700 mb-4">
            Create a new event in the system. Events are stored with status "pending" until acknowledged.
          </p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Body</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">{`{
  "source": "stripe",
  "event_type": "payment.succeeded",
  "payload": {
    "amount": 2999,
    "currency": "usd",
    "customer_id": "cus_12345"
  }
}`}</pre>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-2 font-medium text-gray-700">Field</th>
                    <th className="text-left p-2 font-medium text-gray-700">Type</th>
                    <th className="text-left p-2 font-medium text-gray-700">Required</th>
                    <th className="text-left p-2 font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-2 font-mono text-gray-900">source</td>
                    <td className="p-2 text-gray-600">string</td>
                    <td className="p-2 text-orange-600">Yes</td>
                    <td className="p-2 text-gray-700">Source system (e.g., "stripe", "gmail")</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono text-gray-900">event_type</td>
                    <td className="p-2 text-gray-600">string</td>
                    <td className="p-2 text-orange-600">Yes</td>
                    <td className="p-2 text-gray-700">Event type (e.g., "payment.succeeded")</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono text-gray-900">payload</td>
                    <td className="p-2 text-gray-600">object</td>
                    <td className="p-2 text-orange-600">Yes</td>
                    <td className="p-2 text-gray-700">Event data (any valid JSON)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Response (201 Created)</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">{`{
  "event_id": "evt_abc123",
  "status": "received",
  "created_at": "2025-01-12T10:30:00Z",
  "message": "Event successfully ingested"
}`}</pre>
            </div>
          </div>
        </Card>

        {/* GET /api/v1/inbox */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">GET</span>
            <code className="text-lg font-mono text-gray-900">/api/v1/inbox</code>
          </div>

          <p className="text-gray-700 mb-4">
            Retrieve events from the inbox. Use this to poll for new events or fetch acknowledged events.
          </p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Query Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-2 font-medium text-gray-700">Parameter</th>
                    <th className="text-left p-2 font-medium text-gray-700">Type</th>
                    <th className="text-left p-2 font-medium text-gray-700">Default</th>
                    <th className="text-left p-2 font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-2 font-mono text-gray-900">status</td>
                    <td className="p-2 text-gray-600">string</td>
                    <td className="p-2 text-gray-600">pending</td>
                    <td className="p-2 text-gray-700">"pending" or "acknowledged"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono text-gray-900">limit</td>
                    <td className="p-2 text-gray-600">integer</td>
                    <td className="p-2 text-gray-600">50</td>
                    <td className="p-2 text-gray-700">Max events to return (1-1000)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Response (200 OK)</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">{`{
  "events": [
    {
      "event_id": "evt_abc123",
      "source": "stripe",
      "event_type": "payment.succeeded",
      "payload": { "amount": 2999 },
      "status": "pending",
      "created_at": "2025-01-12T10:30:00Z",
      "acknowledged_at": null
    }
  ],
  "total": 1
}`}</pre>
            </div>
          </div>
        </Card>

        {/* DELETE /api/v1/events/{event_id} */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">DELETE</span>
            <code className="text-lg font-mono text-gray-900">/api/v1/events/&#123;event_id&#125;</code>
          </div>

          <p className="text-gray-700 mb-4">
            Acknowledge an event after processing. This marks the event as "acknowledged" so it won't be retrieved again.
          </p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Path Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-2 font-medium text-gray-700">Parameter</th>
                    <th className="text-left p-2 font-medium text-gray-700">Type</th>
                    <th className="text-left p-2 font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 font-mono text-gray-900">event_id</td>
                    <td className="p-2 text-gray-600">string</td>
                    <td className="p-2 text-gray-700">Unique event identifier</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Response (200 OK)</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">{`{
  "event_id": "evt_abc123",
  "status": "acknowledged",
  "acknowledged_at": "2025-01-12T10:31:00Z"
}`}</pre>
            </div>
          </div>
        </Card>

        {/* GET /api/v1/events/{event_id} */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">GET</span>
            <code className="text-lg font-mono text-gray-900">/api/v1/events/&#123;event_id&#125;</code>
          </div>

          <p className="text-gray-700 mb-4">
            Retrieve a specific event by its ID.
          </p>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Response (200 OK)</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">{`{
  "event_id": "evt_abc123",
  "source": "stripe",
  "event_type": "payment.succeeded",
  "payload": { "amount": 2999 },
  "status": "pending",
  "created_at": "2025-01-12T10:30:00Z",
  "acknowledged_at": null
}`}</pre>
            </div>
          </div>
        </Card>
      </div>

      {/* Example Usage */}
      <Card className="p-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Code className="h-5 w-5 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-900">Quick Start</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Using cURL</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">{`# Send an event
curl -X POST http://localhost:8000/api/v1/events \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "stripe",
    "event_type": "payment.succeeded",
    "payload": {"amount": 2999, "currency": "usd"}
  }'

# Get pending events
curl http://localhost:8000/api/v1/inbox?status=pending

# Acknowledge an event
curl -X DELETE http://localhost:8000/api/v1/events/evt_abc123`}</pre>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Using JavaScript</h4>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">{`// Send an event
const response = await fetch('http://localhost:8000/api/v1/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    source: 'stripe',
    event_type: 'payment.succeeded',
    payload: { amount: 2999, currency: 'usd' }
  })
});

const result = await response.json();
console.log(result.event_id);`}</pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
