import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    Car,
    Wrench,
    ClipboardCheck,
    ShieldCheck,
    Users,
    CirclePlus,
    Zap,
    History,
    RulerDimensionLineIcon
} from "lucide-react";

import { useWallet } from "~/utils/WalletProvider";
import { useContract } from "~/hooks/useContract";
import { vinToBytes17, strToBytes32, bytes17ToVin } from "~/utils/helper";

import NavBar from "~/components/NavBar/NavBar";
import { RoleBadge } from "~/components/Dashboard/RoleBadge/RoleBadge";
import { VinInput } from "~/components/Dashboard/VinInput";
import { MaintenanceForm } from "~/components/Dashboard/Forms/MaintenanceForm/MaintenanceForm";
import { DiagnosticForm } from "~/components/Dashboard/Forms/DiagnosticForm/DiagnosticForm";
import { InspectionForm } from "~/components/Dashboard/Forms/InspectionForm/InspectionForm";
import { AccidentForm } from "~/components/Dashboard/Forms/AccidentForm/AccidentForm";
import { TransferOwnershipForm } from "~/components/Dashboard/Forms/TransferOwnershipForm/TransferOwnershipForm";
import { RegisterVehicle } from "~/components/Dashboard/Forms/RegisterVehicle/RegisterVehicle";
import { MaintenanceTable } from "~/components/Dashboard/Tables/MaintenanceTable/MaintenanceTable";
import { DiagnosticsTable } from "~/components/Dashboard/Tables/DiagnosticsTable/DiagnosticsTable";
import { InspectionsTable } from "~/components/Dashboard/Tables/InspectionsTable/InspectionsTable";
import { AccidentsTable } from "~/components/Dashboard/Tables/AccidentsTable/AccidentsTable";
import { OwnershipHistoryTable } from "~/components/Dashboard/Tables/HistoryTable/HistoryTable";
import { DashboardNav } from "~/components/Dashboard/DashboardNav";

// sidebar definitions
const ALL_SECTIONS = [
    { icon: Car, label:'Overview', key: 'overview' },
    { icon: Wrench, label: 'Maintenance',key: 'maintenance' },
    { icon: ClipboardCheck,label: 'Diagnostics', key: 'diagnostics' },
    { icon: ShieldCheck,label: 'Inspections', key: 'inspections' },
    { icon: Zap,label: 'Accidents', key: 'accidents' },
    { icon: Users,label: 'Transfer', key: 'admin' },
    { icon: CirclePlus,label: 'Register', key: 'register' },
    {icon: History,label: 'Ownership', key: 'ownership'},
] as const;
type SectionKey = typeof ALL_SECTIONS[number]['key'];

export default function Dashboard() {
    const { address } = useWallet();
    const navigate = useNavigate();
    const { web3, contract } = useContract();

    const [loading, setLoading] = useState(true);
    const [vin, setVin] = useState('');
    const [role, setRole] = useState<'Mechanic' | 'Police' | 'User'>();
    const [meta, setMeta] = useState<any>(null);
    const [maint, setMaint] = useState<any[]>([]);
    const [diag, setDiag] = useState<any[]>([]);
    const [insp, setInsp] = useState<any[]>([]);
    const [accs, setAccs] = useState<any[]>([]);
    const [ohiss, setOhiss] = useState<any[]>([]);
    const [vinError, setVinError] = useState<string | null>(null);
    const [ownedVh, setOwnedVh] = useState<any[]>([]);


    const [section, setSection] = useState<SectionKey>('overview');

    // determine visible sidebar icons
    const visibleSections = ALL_SECTIONS.filter(sec => {
        switch (sec.key) {
            case 'overview': return true;
            case 'maintenance':
            case 'diagnostics': return role === 'Mechanic';
            case 'inspections':
            case 'accidents': return role === 'Police';
            case 'admin': return meta?.owner?.toLowerCase() === address?.toLowerCase();
            case 'register': return true;
        }
    });

    // fetch role
    useEffect(() => {
        if (!address) { navigate('/'); return; }
        if (!contract) return;
        (async () => {
            const MECH = web3.utils.keccak256('MECHANIC_ROLE');
            const POLI = web3.utils.keccak256('POLICE_ROLE');
            const isMech = await contract.methods.hasRole(MECH, address).call();
            const isPoli = await contract.methods.hasRole(POLI, address).call();
            const owned = await contract.methods.getMyVehicles().call({ from: address });
            setRole(isMech ? 'Mechanic' : isPoli ? 'Police' : 'User');
            setLoading(false);
            setOwnedVh(owned);
            console.log(ownedVh)
        })();
    }, [contract, address]);

    // load data
    const loadAll = async () => {
        if (!contract || !vin.trim()) return;
        const v = vinToBytes17(vin);
        try {
            const m = await contract.methods.getVehicleMeta(v).call();
            const [ma, di, ins, ac, hi, ow] = await Promise.all([
                contract.methods.getMaintenance(v).call(),
                contract.methods.getDiagnostics(v).call(),
                contract.methods.getInspections(v).call(),
                contract.methods.getAccidents(v).call(),
                contract.methods.getOwnershipHistory(v).call(),
                contract.methods.getMyVehicles().call({ from: address })
            ]);
            setMeta(m); setMaint(ma); setDiag(di); setInsp(ins); setAccs(ac); setOwnedVh(ow); setOhiss(hi);
            console.log(maint)
            setVinError(null);
        } catch {
            setMeta(null); setMaint([]); setDiag([]); setInsp([]); setAccs([]);
            setVinError('VIN not found.');
        }
    };

    // actions
    const handlers = {
        maintenance: (part: string, hash: string, note: string, mileage: string) => contract.methods.addMaintenance(vinToBytes17(vin), strToBytes32(part), hash, strToBytes32(note), parseInt(mileage, 10)).send({ from: address }).then(loadAll),
        diagnostics: (cid: string, summary: string, mileage: string) => contract.methods.addDiagnostic(vinToBytes17(vin), cid, strToBytes32(summary), parseInt(mileage, 10)).send({ from: address }).then(loadAll),
        inspections: (passed: boolean, cid: string, mileage: string) => contract.methods.addInspection(vinToBytes17(vin), passed, cid, parseInt(mileage, 10)).send({ from: address }).then(loadAll),
        accidents: (photoCid: string, desc: string) => contract.methods.reportAccident(vinToBytes17(vin), photoCid, desc).send({ from: address }).then(loadAll),
        admin: (newOwner: string) => contract.methods.transferOwnership(vinToBytes17(vin), newOwner).send({ from: address }).then(loadAll),
        register: (v: string, year: string, mileage: string) => contract.methods.registerVehicle(vinToBytes17(v), address, year, parseInt(mileage, 10)).send({ from: address }).then(() => { setVin(v); loadAll() }),
    };

    if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#090C13] text-white"><span className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full" /></div>;

    return (
        <div className="flex flex-col md:flex-row min-h-screen max-h-screen bg-[#090C13] text-white">
           <DashboardNav sections={visibleSections} current={section} onSelect={setSection} /> 
            <main className="flex-1 pb-24 md:pb-4 overflow-y-scroll">
                <NavBar roleBadge={<RoleBadge role={role!} />} />
                <div className="m-3">
                    <div className="my-6">
                        <ul className="flex gap-2 flex-wrap">
                            {ownedVh.length === 0 ? (
                                <li className="text-gray-400">No vehicles owned</li>
                            ) : (
                                ownedVh.map((vehicle) => (
                                    <li
                                        key={vehicle}
                                        className="flex items-center h-1/1 gap-3 px-4 py-2 bg-[#222]/50 rounded-lg"
                                    >
                                        <Car size={20} className="text-gray-400" />
                                        <span className="font-medium text-gray-100">
                                            {bytes17ToVin(vehicle)}
                                        </span>
                                    </li>
                                ))
                            )}
                        </ul>


                    </div>
                    <div className="my-6">
                        <VinInput vin={vin} setVin={setVin} onLoad={loadAll} />
                        {vinError && <p className="text-red-500 mt-1">{vinError}</p>}
                    </div>
                    {/* conditional sections */}
                    {meta && <OverviewSection meta={meta} address={address!} ohiss={ohiss!} onSelect={setSection} />}              {section === 'maintenance' && role === 'Mechanic' && <SectionFrame title="Maintenance"><MaintenanceForm onSubmit={handlers.maintenance} /></SectionFrame>}
                    {section === 'maintenance' && <SectionFrame title="Maintenance"><MaintenanceTable rows={maint} /></SectionFrame>}

                    {section === 'diagnostics' && role === 'Mechanic' && <SectionFrame title="Maintenance">
                        <DiagnosticForm onSubmit={handlers.diagnostics} />
                    </SectionFrame>}
                    {section === 'diagnostics' && <SectionFrame title="Diagnostics"> <DiagnosticsTable rows={diag} /></SectionFrame>}


                    {section === 'inspections' && role === 'Police' && <SectionFrame title="Inspections"><InspectionForm onSubmit={handlers.inspections} /></SectionFrame>}

                    {section === 'inspections' && <SectionFrame title="Inspections"><InspectionsTable rows={insp} /></SectionFrame>}

                    {section === 'accidents' && role === 'Police' && <SectionFrame title="Accidents"><AccidentForm onSubmit={handlers.accidents} /></SectionFrame>}

                    {section === 'accidents' && <SectionFrame title="Accidents"><AccidentsTable rows={accs} /></SectionFrame>}

                    {section === 'admin' && <SectionFrame title="Transfer Ownership"><TransferOwnershipForm onSubmit={handlers.admin} /></SectionFrame>}
                    {section === 'register' && <SectionFrame title="Register Vehicle"><RegisterVehicle onSubmit={handlers.register} /></SectionFrame>}
                    {section === 'ownership' && <SectionFrame title="Accidents"><OwnershipHistoryTable rows={ohiss} /></SectionFrame>}
                </div>
            </main>
        </div>
    );
}

function OverviewSection({ meta, address, ohiss, onSelect }: { meta: any, address: string, ohiss: [], onSelect: (k: SectionKey) => void }) {
    return <>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard label="Year" value={meta.year} icon={ClipboardCheck} onClick={() => onSelect('overview')} />
            <StatCard label="Miles" value={ meta.mileage} icon={RulerDimensionLineIcon} onClick={() => onSelect('overview')} />
            <StatCard label="Maintenance" value={meta.maintCnt} icon={Wrench} onClick={() => onSelect('maintenance')} />
            <StatCard label="Diagnostics" value={meta.diagCnt} icon={ClipboardCheck} onClick={() => onSelect('diagnostics')} />
            <StatCard label="Inspections" value={meta.inspCnt} icon={ShieldCheck} onClick={() => onSelect('inspections')} /> 
            <StatCard label="Accidents" value={meta.accCnt} icon={Zap} onClick={() => onSelect('accidents')} />
            <StatCard label="Ownership" value={ ohiss.length } icon={History} onClick={() => onSelect('ownership')} />
        </div>
    </>;
}

function SectionFrame({ title, children }: { title: string, children: React.ReactNode }) {
    return <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {children}
    </div>;
}

function StatCard({ label, value, icon: Icon, onClick }: { label: string; value: number | string; icon: React.FC<{ size?: number }>; onClick: () => void }) {
    return <div onClick={onClick} className="bg-white/5 backdrop-blur p-4 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-white/10">
        <Icon size={20} className="text-gray-300" />
        <div><p className="text-sm text-gray-400">{label}</p><p className="font-semibold text-lg">{value}</p></div>
    </div>;
}

