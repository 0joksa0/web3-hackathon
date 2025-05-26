import { Github, TwitterIcon, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="snap-start">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 md:flex-row md:justify-between">
        <span className="text-lg font-semibold text-gray-400">
         NAME © {new Date().getFullYear()}
        </span>

        <nav className="flex gap-6 text-sm text-gray-400">
          <a href="/"     className="hover:text-white/80">Home</a>
          <a href="/about" className="hover:text-white/80">About</a>
          <a href="/dashboard" className="hover:text-white/80">Dashboard</a>
        </nav>

        <div className="flex gap-4">
          <a
            href="https://github.com/your-repo"
            target="_blank"
            className="rounded p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

