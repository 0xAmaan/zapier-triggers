import { Home, Search, Zap, Table, Box, MessageSquare, Users, Link, History, MoreHorizontal } from 'lucide-react';

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Search, label: 'Discover', active: false },
    { icon: Zap, label: 'Zaps', active: true },
    { icon: Table, label: 'Tables', active: false },
    { icon: Box, label: 'Interfaces', active: false },
    { icon: MessageSquare, label: 'Chatbots', badge: 'Beta', active: false },
    { icon: Users, label: 'Agents', badge: 'Beta', active: false },
    { icon: Link, label: 'App Connections', active: false },
    { icon: History, label: 'Zap History', active: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14.4 2.4L21.6 9.6L14.4 2.4ZM9.6 21.6L2.4 14.4L9.6 21.6ZM21.6 14.4L14.4 21.6H21.6V14.4ZM2.4 9.6V2.4H9.6L2.4 9.6Z" fill="#FF4A00"/>
          </svg>
          <span className="text-lg">zapier</span>
        </div>
      </div>

      {/* Create Button */}
      <div className="p-4">
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors">
          <span className="text-lg">+</span>
          <span>Create</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors ${
              item.active
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm">{item.label}</span>
            {item.badge && (
              <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                {item.badge}
              </span>
            )}
          </button>
        ))}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-gray-700 hover:bg-gray-100 transition-colors">
          <MoreHorizontal size={18} />
          <span className="text-sm">More</span>
        </button>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-600 space-y-1">
          <div>Plan tasks: 0 / 100</div>
          <div>Zaps: 0 / 5</div>
          <div>Usage resets in 2 weeks</div>
        </div>
        <button className="mt-3 text-sm text-orange-600 hover:text-orange-700">
          Manage plan
        </button>
      </div>
    </div>
  );
}
