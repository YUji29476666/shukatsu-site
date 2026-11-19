import { Briefcase, Globe, CalendarDays, Clock, FileText, MessageCircle, Plane, Smartphone, Users } from "lucide-react";
import type { SectionIcon as Name } from "@/data/types";

const icons = { globe: Globe, plane: Plane, clock: Clock, briefcase: Briefcase, calendar: CalendarDays, smartphone: Smartphone, users: Users, file: FileText, message: MessageCircle };

export function SectionIcon({ name, size = 22, className = "" }: { name: Name; size?: number; className?: string }) {
  const I = icons[name];
  return <I size={size} strokeWidth={1.75} className={className} aria-hidden="true" />;
}
