"use client";

import { Plus, Home, Zap, Inbox, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Inbox, label: "Inbox", href: "/", active: true },
  { icon: Clock, label: "History", href: "/history" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
            <Zap className="h-5 w-5 text-white fill-current" />
          </div>
          <span className="font-semibold text-gray-900">Triggers</span>
        </div>
      </div>

      {/* Create Button */}
      <div className="p-4">
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Send Event
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
              ${
                item.active
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Usage Stats */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Plan tasks</span>
          <span className="font-medium text-gray-900">0 / 100</span>
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-0 bg-orange-500 rounded-full" />
        </div>
        <button className="text-xs text-orange-600 hover:text-orange-700 font-medium cursor-pointer">
          Manage plan
        </button>
      </div>
    </aside>
  );
};
