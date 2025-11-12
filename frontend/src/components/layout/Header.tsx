"use client";

import { Bell, Grid3x3, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-gray-900">Zapier Triggers</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-600">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Grid3x3 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Upgrade
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-700 text-white text-sm">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
