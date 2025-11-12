import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "pending" | "acknowledged";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === "acknowledged") {
    return (
      <Badge
        variant="outline"
        className="bg-green-50 border-green-200 text-green-700 flex items-center gap-1"
      >
        <CheckCircle2 className="h-3 w-3" />
        Acknowledged
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-gray-50 border-gray-200 text-gray-700 flex items-center gap-1"
    >
      <Circle className="h-3 w-3" />
      Pending
    </Badge>
  );
};
