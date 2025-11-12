import { HelpCircle, Grid, Mail, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">Triggers API Demo</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <Grid size={20} />
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <Bell size={20} />
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">
          Upgrade
        </button>
        <div className="w-8 h-8 bg-gray-800 rounded-full" />
      </div>
    </header>
  );
}
