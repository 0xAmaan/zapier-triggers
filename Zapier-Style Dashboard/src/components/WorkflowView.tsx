import { Zap, ArrowDown, Eye } from 'lucide-react';

interface WorkflowViewProps {
  isZapOn: boolean;
}

export function WorkflowView({ isZapOn }: WorkflowViewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Trigger Step */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Zap size={16} className="text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">Trigger</span>
          </div>
          
          <div className={`border-2 rounded-lg p-6 transition-colors ${
            isZapOn ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <Zap size={16} className="text-white" />
                  </div>
                  <h3 className="font-medium">Triggers API</h3>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  1. New Event in Inbox
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Triggers when any external system sends an event to your API inbox
                </p>
              </div>
              {isZapOn && (
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Listening
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Event Sources:</div>
              <div className="flex flex-wrap gap-2">
                {['Stripe', 'Gmail', 'Slack', 'GitHub', 'Webhook'].map((source) => (
                  <span
                    key={source}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center my-4">
            <div className="w-px h-8 bg-gray-300" />
          </div>
        </div>

        {/* Action Step */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Eye size={16} className="text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">Action</span>
          </div>
          
          <div className={`border-2 rounded-lg p-6 transition-colors ${
            isZapOn ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <Eye size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium">Display Event</h3>
                <p className="text-sm text-gray-600 mt-2">
                  2. Show in Activity Feed
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Displays the event details in the activity feed below
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
