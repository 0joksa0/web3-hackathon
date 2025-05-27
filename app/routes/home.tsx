import ConnectButton from "~/components/ConnectButton/ConnectButton";
import type { Route } from "./+types/home";
import NavBar from "~/components/NavBar/NavBar";
import type { warn } from "console";
import SectionBrake from "~/components/SectionBrake/SectionBrake";
import DetailsIcon from "~/components/DetailsIcon/DetailsIcon";
import Footer from "~/components/Footer/Footer";


export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Home • Car Passport" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return {
        hero: {
            header: "CAR DEALER PRESENTATION",
            desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quae sint officia enim quam beatae distinctio eligendi neque consequuntur incidunt rerum porro, nostrum inventore eius commodi omnis mollitia quibusdam recusandae.",
        },
        ownershipRecords: {
            "sectionTitle": "Your Vehicle Passport",
            "sectionDescription": "Explore the full digital identity of your vehicle — stored and verified on-chain for transparency, trust, and sustainability.",

            "sections": [
                {
                    "id": "vehicleDetails",
                    "title": "Vehicle Details",
                    "description": "Basic metadata and static technical specifications of your vehicle – VIN, make, model, year of production, and current mileage.",
                    "icon": "Car"
                },
                {
                    "id": "maintenanceRecords",
                    "title": "Maintenance Records",
                    "description": "Complete and immutable record of all service actions: inspections, part replacements, and software updates – time-stamped and certified.",
                    "icon": "Wrench"
                },
                {
                    "id": "ownershipHistory",
                    "title": "Ownership History",
                    "description": "Decentralized log of previous owners, registration changes and handovers. Clear provenance builds trust on second-hand markets.",
                    "icon": "Users"
                },
                {
                    "id": "inspectionReports",
                    "title": "Inspection Reports",
                    "description": "Trusted reports from authorized inspection centers. Stored on-chain to prevent tampering or forgery.",
                    "icon": "ClipboardCheck"
                },
                {
                    "id": "blockchainProvenance",
                    "title": "Blockchain Provenance",
                    "description": "All records are hashed and linked to a public blockchain network, ensuring that your data is secure, auditable, and always verifiable.",
                    "icon": "ShieldCheck"
                }
            ]
        }

    };
}

export default function Home({ loaderData }: Route.ComponentProps) {
    return (<main className="overflow-x-hidden h-screen overflow-y-auto snap-y snap-mandatory">
        <NavBar />
        <section className="flex flex-col-reverse justify-between items-center md:flex-row snap-none" >
            <div className="w-1/1 md:w-1/2 ">
                <h1 className="">{loaderData.hero.header}</h1>
                <p>{loaderData.hero.desc}</p>
            </div>
            <div className="flex gap-[1rem] bg-black p-6 h-full w-[50vh] md:w-auto md:h-[70vh]">
                <img
                    src="/hero.jpg"
                    className="md:w-[30vw] h-[40vh] md:h-auto object-cover [clip-path:polygon(15%_0%,100%_0%,85%_100%,0%_100%)] "
                    alt="Car 1"
                />
                <img
                    src="/hero.jpg"
                    className="md:w-[30vw] h-auto object-cover [clip-path:polygon(15%_0%,100%_0%,85%_100%,0%_100%)] "
                    alt="Car 1"
                />
            </div>

        </section>
        <SectionBrake className="rotate-180" />
        <section className="flex flex-col md:justify-evenly justify-center items-center snap-center">
            <h1 className="text-center md:text-left">{loaderData.ownershipRecords.sectionTitle}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">

                {loaderData.ownershipRecords.sections.map(
                    (item) => (
                        <DetailsIcon key={item.id} passportData={item} />
                    )
                )}

            </div>

        </section>
        <SectionBrake className="ml-auto" />
        <Footer />
    </main>
    );
}

