import React, { useState } from "react";
import { Car, Wrench, ClipboardCheck, ShieldCheck, Users, Menu, X } from "lucide-react";

export type SectionKey =
    | "overview"
    | "maintenance"
    | "diagnostics"
    | "inspections"
    | "accidents"
    | "admin"
    | "register";

interface SectionDef {
    key: SectionKey;
    label: string;
    icon: React.FC<{ size?: number; className?: string }>;
}

interface DashboardNavProps {
    sections: SectionDef[];
    current: SectionKey;
    onSelect: (key: SectionKey) => void;
}

export function DashboardNav({ sections, current, onSelect }: DashboardNavProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Desktop sidebar */}
            <nav className="group hidden md:flex flex-col justify-around bg-[#0f1218] p-2 h-screen">
                {sections.map((sec) => (
                    <div key={sec.key} className="flex flex-col items-center relative">
                        <sec.icon
                            size={30}
                            className={`cursor-pointer m-2 ${current === sec.key ? "text-white" : "text-gray-400 hover:text-white"
                                }`}
                            onClick={() => onSelect(sec.key)}
                        />
                        <p
                            className="
          m-2
          transform scale-0 opacity-0 max-w-0
          group-hover:scale-100 group-hover:opacity-100 group-hover:max-w-xs
          transition-all duration-400 ease-out
          origin-left
          text-white text-sm whitespace-nowrap
        "
                        >
                            {sec.label}
                        </p>
                    </div>
                ))}
            </nav>
            {/* Mobile floating button */}
            <div className="md:hidden fixed bottom-4 right-4 z-50 flex flex-col justify-center items-end">
              
                {open && (
                    <div className="mb-2 bg-[#111]/70 backdrop-blur p-2 rounded-xl flex flex-col space-y-2">
                        {sections.map((sec) => (
                            <button
                                key={sec.key}
                                onClick={() => {
                                    onSelect(sec.key);
                                    setOpen(false);
                                }}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg text-white"
                            >
                                <sec.icon size={20} />
                                <span>{sec.label}</span>
                            </button>
                        ))}
                    </div>
                )}  <button
                    onClick={() => setOpen(!open)}
                    className="p-3 bg-[#0f1218] text-white rounded-full shadow-lg"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </>
    );
}

