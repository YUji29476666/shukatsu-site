import { Briefcase, Building2, CalendarClock, ImageIcon, MessagesSquare } from "lucide-react";
import { photos } from "@/data/site";
import type { CategoryId } from "@/data/types";

// 写真。public/images/ に写真が入るまでは、カテゴリの色の「写真（仮）」を表示する
const tone: Record<CategoryId, { bg: string; fg: string; Icon: typeof Building2 }> = {
  bosscari: { bg: "#e3eaf4", fg: "#2f4a6e", Icon: Building2 },
  timeline: { bg: "#e5efe8", fg: "#3b6b4d", Icon: CalendarClock },
  jobs: { bg: "#f1ebe0", fg: "#7a5a2c", Icon: Briefcase },
  selection: { bg: "#efe6ec", fg: "#7a4a63", Icon: MessagesSquare },
};

export function Photo({
  id,
  category,
  className = "",
  rounded = "rounded-xl",
  small = false,
}: {
  id: string;
  category?: CategoryId;
  className?: string;
  rounded?: string;
  small?: boolean;
}) {
  const p = photos[id];
  if (p) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.src} alt="" className={`h-full w-full object-cover ${rounded} ${className}`} loading="lazy" />;
  }
  const t = category ? tone[category] : { bg: "#e8edf3", fg: "#5b6475", Icon: ImageIcon };
  return (
    <div
      className={`relative grid h-full w-full place-items-center overflow-hidden ${rounded} ${className}`}
      style={{ background: t.bg, color: t.fg }}
      aria-hidden="true"
    >
      <t.Icon size={small ? 22 : 34} strokeWidth={1.4} />
      {!small && <span className="absolute bottom-1.5 right-2 text-[10px] opacity-70">写真（仮）</span>}
    </div>
  );
}
