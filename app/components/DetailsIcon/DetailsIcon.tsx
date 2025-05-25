import { Car, Wrench, Users, ClipboardCheck, ShieldCheck } from 'lucide-react'
import React from 'react'



const iconMap: Record<string, React.ElementType> = {
    Car,
    Wrench,
    Users,
    ClipboardCheck,
    ShieldCheck,
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
            className="flex gap-4 items-center"
        >

                <Icon className="text-white" size={200} />
            <div >
                <h3 className="text-xl font-semibold text-white">{passportData.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{passportData.description}</p>
            </div>
        </div>
    )
}

export default DetailsIcon
