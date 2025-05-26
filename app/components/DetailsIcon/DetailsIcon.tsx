import { Car, Wrench, Users, ClipboardCheck, ShieldCheck, Layers3, HeartHandshake, Globe2 } from 'lucide-react'
import React from 'react'



const iconMap: Record<string, React.ElementType> = {
    Car,
    Wrench,
    Users,
    ClipboardCheck,
    ShieldCheck, Layers3, HeartHandshake, Globe2,
}


function DetailsIcon({ passportData = {
    id: "",
    title: "",
    description: "",
    icon: ""
} }) {
    const Icon = iconMap[passportData.icon]
    return (
        <div
            key={passportData.id}
            className="flex gap-10 items-center"
        >

            <Icon className="w-12 h-12 md:w-15 md:h-15 text-white shrink-0 object-contain" />

            <div >
                <h3 className="text-xl font-semibold text-white">{passportData.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{passportData.description}</p>
            </div>
        </div>
    )
}

export default DetailsIcon
