import { ShieldAlert, Wrench, User } from "lucide-react";
export function RoleBadge({ role }: { role: string }) {
    const map: Record<string, any> = {
        Mechanic: Wrench,
        Police: ShieldAlert,
        Owner: User,
    };
    const Icon = map[role] ?? User;
    return (
        <span className="flex gap-2 justify-center content-center text-lg">
            <Icon className="w-auto h-1/1  text-white shrink-0 object-contain" />
            {role}
        </span>
    );
}

