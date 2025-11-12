import { CheckCircle, Clock, AlertCircle, XCircle, ChevronDown } from 'lucide-react';
import { Event } from '../App';
import { useState } from 'react';

interface ActivityFeedProps {
  events: Event[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const getStatusIcon = (status: Event['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'processing':
        return <Clock size={20} className="text-blue-500" />;
      case 'failed':
        return <XCircle size={20} className="text-red-500" />;
      case 'pending':
        return <AlertCircle size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'success':
        return 'SUCCESS';
      case 'processing':
        return 'PROCESSING';
      case 'failed':
        return 'FAILED';
      case 'pending':
        return 'PENDING';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return timestamp.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg">Zap Runs</h2>
        <span className="text-sm text-gray-500">{events.length} total</span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">No events yet</p>
          <p className="text-sm text-gray-500">
            Send a test event to see it appear here in real-time
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-4 transition-all ${getStatusColor(
                event.status
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(event.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-white rounded border border-gray-300">
                        {getStatusText(event.status)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm mb-1">
                      <span className="text-gray-600">Trigger:</span>{' '}
                      <span>{event.eventType}</span>
                    </p>
                    {event.status === 'processing' && (
                      <div className="mt-2">
                        <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3" />
                        </div>
                      </div>
                    )}
                    {event.status === 'success' && (
                      <p className="text-xs text-gray-600 mt-1">
                        Action: ✓ Displayed in feed
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setExpandedEvent(expandedEvent === event.id ? null : event.id)
                  }
                  className="p-1 hover:bg-white rounded transition-colors"
                >
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${
                      expandedEvent === event.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {expandedEvent === event.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-2">Event Data:</div>
                  <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-40 border border-gray-200">
                    {JSON.stringify(
                      {
                        id: event.id,
                        source: event.source,
                        event_type: event.eventType,
                        payload: event.payload,
                        timestamp: event.timestamp.toISOString(),
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
