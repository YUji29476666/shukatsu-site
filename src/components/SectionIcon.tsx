import { CalendarDays, FileText, MessageCircle, Plane, Smartphone, Users } from "lucide-react";
import type { SectionIcon as Name } from "@/data/types";

const icons = { plane: Plane, calendar: CalendarDays, smartphone: Smartphone, users: Users, file: FileText, message: MessageCircle };

export function SectionIcon({ name, size = 22, className = "" }: { name: Name; size?: number; className?: string }) {
  const I = icons[name];
  return <I size={size} strokeWidth={1.75} className={className} aria-hidden="true" />;
}
