import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WorkflowView } from './components/WorkflowView';
import { ActivityFeed } from './components/ActivityFeed';
import { TestPanel } from './components/TestPanel';

export interface Event {
  id: string;
  eventType: string;
  source: string;
  payload: any;
  timestamp: Date;
  status: 'pending' | 'processing' | 'success' | 'failed';
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isZapOn, setIsZapOn] = useState(true);

  const handleSendEvent = (eventType: string, source: string, payload: any) => {
    const newEvent: Event = {
      id: `evt_${Date.now()}`,
      eventType,
      source,
      payload,
      timestamp: new Date(),
      status: 'processing'
    };

    setEvents(prev => [newEvent, ...prev]);

    // Simulate processing
    setTimeout(() => {
      setEvents(prev =>
        prev.map(e =>
          e.id === newEvent.id ? { ...e, status: 'success' } : e
        )
      );
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Zap Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl">Process Incoming Events</h1>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isZapOn ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">{isZapOn ? 'On' : 'Off'}</span>
                </div>
              </div>
              <button
                onClick={() => setIsZapOn(!isZapOn)}
                className={`px-4 py-2 rounded-md ${
                  isZapOn
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isZapOn ? 'Turn Off' : 'Turn On'}
              </button>
            </div>

            {/* Workflow Visualization */}
            <WorkflowView isZapOn={isZapOn} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {/* Test Panel */}
              <TestPanel onSendEvent={handleSendEvent} isZapOn={isZapOn} />

              {/* Activity Feed */}
              <ActivityFeed events={events} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
