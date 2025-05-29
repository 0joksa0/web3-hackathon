/* app/routes/about.tsx  (React-Router v6 data route)  */
import { Users, Layers3, HeartHandshake, Globe2 } from "lucide-react";
import type { Route } from "./+types/about";
import NavBar from "~/components/NavBar/NavBar";
import Footer from "~/components/Footer/Footer";
import DetailsIcon from "~/components/DetailsIcon/DetailsIcon";
import SectionBrake from "~/components/SectionBrake/SectionBrake";

export function meta({ }: Route.MetaArgs) {
    return [{ title: "About • Car Passport" }];
}

/* 1️⃣  Fake team data – zamijeni fotke i imena kad budeš imao prave */
export function loader({ context }: Route.LoaderArgs) {
    return {
        heroTitle: "Driving Trust into Mobility",
        heroDes: "We’re a hackathon-born collective turning every vehicle’s history into an auditable on-chain passport — transparent, immutable and greener.",
        missionTitle: "Why we exist",
        mission: [
            {
                "id": "transparency",
                "title": "Transparency",
                "description": "Every maintenance, inspection or accident record is hashed and stored on a public blockchain.",
                "icon": "Layers3"
            },
            {
                "id": "trust",
                "title": "Trust",
                "description": "Second-hand buyers, insurers and regulators see the same truth — no middlemen needed.",
                "icon": "HeartHandshake"
            },
            {
                "id": "sustainability",
                "title": "Sustainability",
                "description": "Longer vehicle life-cycles and data-driven eco-incentives reduce waste and CO₂.",
                "icon": "Globe2"
            }
        ],
        teamTitle: "The team",
        team: [
            { name: "Hesam Jafazadeh", role: "", avatar: "./hesam.jpeg" },
            { name: "Aleksandar Joksimović", role: "", avatar: "./joksa.jpeg" },
            { name: "Radovan Marković", role: "", avatar: "./radovan.jpeg" },
        ],
        callTitle:"Join us on the road to transparent mobility",
        callDes:"We’re open-sourcing the protocol. Contributors and early pilot partners welcome!",
        callLink:"",
        callButton:"Contact us",
    }
};

export default function About({ loaderData }: Route.ComponentProps) {
    return (
        <main className="overflow-x-hidden h-screen overflow-y-auto snap-y snap-proximity">
            <NavBar />
            <section className="relative flex flex-col items-center justify-center py-32 text-center">
                <h1 className="py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
                    {loaderData.heroTitle}
                </h1>
                <p className="mt-9 max-w-xl text-gray-400">
                    {loaderData.heroDes}
                </p>
            </section>
            <SectionBrake className="rotate-180" />
            <section className="flex flex-col md:justify-evenly justify-center items-center snap-center">
                <h1 className="text-center md:text-left">{loaderData.missionTitle}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">

                    {loaderData.mission.map(
                        (item) => (
                            <DetailsIcon key={item.id} passportData={item} />
                        )
                    )}

                </div>

            </section>

            <SectionBrake className="ml-auto" />
            <section className="flex flex-col md:justify-evenly justify-center items-center snap-center">
                <h1 className="text-center md:text-left">
                    {loaderData.teamTitle}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
                    {loaderData.team.map((m) => (
                        <div
                            key={m.name}
                            className="flex flex-col items-center text-center"
                        >
                            <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover border border-gray-600 shadow-lg"
                            />
                            <p className="mt-6 text-xl font-semibold">{m.name}</p>
                            <p className="text-sm text-gray-400">{m.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            <SectionBrake className="rotate-180" />
            {/* call-to-action */}
            <Footer />
        </main>
    );
}




