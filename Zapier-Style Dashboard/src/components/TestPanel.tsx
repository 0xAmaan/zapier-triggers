import { useState } from 'react';
import { Send, Zap } from 'lucide-react';

interface TestPanelProps {
  onSendEvent: (eventType: string, source: string, payload: any) => void;
  isZapOn: boolean;
}

const eventTemplates = {
  'stripe.payment.succeeded': {
    source: 'Stripe',
    icon: '💳',
    payload: {
      amount: 4999,
      currency: 'usd',
      customer: 'cus_' + Math.random().toString(36).substr(2, 9),
      customer_email: 'john.doe@example.com',
      description: 'Premium Plan Subscription'
    }
  },
  'gmail.email.received': {
    source: 'Gmail',
    icon: '📧',
    payload: {
      from: 'sarah.smith@company.com',
      subject: 'Q4 Planning Meeting',
      snippet: 'Hi team, let\'s schedule our Q4 planning session...',
      timestamp: new Date().toISOString()
    }
  },
  'slack.message.sent': {
    source: 'Slack',
    icon: '💬',
    payload: {
      channel: '#general',
      user: '@alice',
      text: 'New deployment completed successfully!',
      timestamp: new Date().toISOString()
    }
  },
  'github.push': {
    source: 'GitHub',
    icon: '🔀',
    payload: {
      repository: 'zapier/triggers-api',
      branch: 'main',
      commits: 3,
      pusher: 'developer@zapier.com'
    }
  },
  'webhook.custom': {
    source: 'Webhook',
    icon: '🔗',
    payload: {
      event_name: 'custom_event',
      data: {
        key: 'value',
        timestamp: new Date().toISOString()
      }
    }
  }
};

export function TestPanel({ onSendEvent, isZapOn }: TestPanelProps) {
  const [selectedEvent, setSelectedEvent] = useState<keyof typeof eventTemplates>('stripe.payment.succeeded');
  const [isSending, setIsSending] = useState(false);

  const handleSendEvent = () => {
    if (!isZapOn) return;
    
    setIsSending(true);
    const template = eventTemplates[selectedEvent];
    onSendEvent(selectedEvent, template.source, template.payload);
    
    setTimeout(() => {
      setIsSending(false);
    }, 1500);
  };

  const template = eventTemplates[selectedEvent];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={20} className="text-orange-500" />
        <h2 className="text-lg">Test Your Trigger</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Simulate an external system sending an event to your Triggers API
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Event Type
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value as keyof typeof eventTemplates)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={!isZapOn}
          >
            {Object.entries(eventTemplates).map(([key, value]) => (
              <option key={key} value={key}>
                {value.icon} {value.source} - {key}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Sample Payload
          </label>
          <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-48 border border-gray-200">
            {JSON.stringify(template.payload, null, 2)}
          </pre>
        </div>

        <button
          onClick={handleSendEvent}
          disabled={!isZapOn || isSending}
          className={`w-full py-3 rounded-md flex items-center justify-center gap-2 transition-colors ${
            !isZapOn
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isSending
              ? 'bg-orange-400 text-white cursor-wait'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending Event...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Send Test Event</span>
            </>
          )}
        </button>

        {!isZapOn && (
          <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
            ⚠️ Turn on your Zap to send test events
          </p>
        )}
      </div>
    </div>
  );
}
