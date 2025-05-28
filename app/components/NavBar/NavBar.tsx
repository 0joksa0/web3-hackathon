import { useState, type ReactElement } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import ConnectButton from "../ConnectButton/ConnectButton";
import { useWallet } from "~/utils/WalletProvider";
import { RoleBadge } from "../Dashboard/RoleBadge/RoleBadge";

export default function NavBar({roleBadge} : {roleBadge : ReactElement}) {
  const navigate            = useNavigate();
  const { address }         = useWallet();
  const [open, setOpen]     = useState(false);          
  let navItems = [
    { label: "Home",  to: "/"     },
    { label: "About", to: "/about"}
  ];

   if (address) navItems.push({label:"Dashboard", to:"/dashboard"}) 

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <button
      onClick={() => {
        setOpen(false);
        navigate(to);
      }}
      className="py-2 px-3 rounded hover:opacity-80 transition text-white text-lg"
    >
      {label}
    </button>
  );

  return (
    <header className="w-full bg-transparent snap-start">
      <nav className="hidden md:flex items-center justify-between  pt-10  font-bold text-xl ">
        <h1 className="shrink-0 ml-10">NAME</h1>

        <div className="gradient-bg flex items-center gap-6 px-6 py-2 rounded-full self-end">
          {navItems.map((i) => (
            <NavLink key={i.label} {...i} />
          ))}

          {address ? <div /> : <div />}
            {roleBadge ? roleBadge : <></>}
          <ConnectButton className="border-2 border-gray-950 hover:bg-gray-950 px-3 py-1 rounded" />
        </div>
      </nav>

      <nav className="flex md:hidden items-center justify-between pt-4 px-6">
        <h1 className="text-xl font-bold">NAME</h1>

        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded hover:bg-white/10 transition"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <div
        className={`
          md:hidden
          ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
          overflow-hidden transition-all duration-300
        `}
      >
        <div className="mt-4 mx-6 flex flex-col gap-4 bg-[#111]/70 backdrop-blur rounded-xl p-6">
          {navItems.map((i) => (
            <NavLink key={i.label} {...i} />
          ))}

            {roleBadge ? roleBadge : <></>}
          <ConnectButton className="border-2 border-gray-950 hover:bg-gray-950 py-2 rounded" />
        </div>
      </div>
    </header>
  );
}

