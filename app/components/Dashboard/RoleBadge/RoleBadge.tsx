import { ShieldAlert, Wrench, User } from "lucide-react";
export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, any> = {
    Mechanic: Wrench,
    Police:   ShieldAlert,
    Owner:    User,
  };
  const Icon = map[role] ?? User;
  return (
    <span className="flex items-center gap-1 rounded-full border border-cyan-400/40 px-3 py-1 text-sm">
      <Icon size={14} className="text-cyan-400" /> {role}
    </span>
  );
}

