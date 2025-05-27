import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Car,
  Wrench,
  ClipboardCheck,
  ShieldCheck,
  Settings,
} from "lucide-react";

import { useWallet } from "~/utils/WalletProvider";
import { useContract } from "~/hooks/useContract";
import { vinToBytes17, strToBytes32 } from "~/utils/helper";

import NavBar from "~/components/NavBar/NavBar";
import { VinInput } from "~/components/Dashboard/VinInput";
import { MaintenanceForm } from "~/components/Dashboard/Forms/MaintenanceForm/MaintenanceForm";
import { MaintenanceTable } from "~/components/Dashboard/Tables/MaintenanceTable/MaintenanceTable";
import { DiagnosticsTable } from "~/components/Dashboard/Tables/DiagnosticsTable/DiagnosticsTable";
import { InspectionsTable } from "~/components/Dashboard/Tables/InspectionsTable/InspectionsTable";
import { AccidentsTable } from "~/components/Dashboard/Tables/AccidentsTable/AccidentsTable";
import { RegisterVehicle } from "~/components/Dashboard/Forms/RegisterVehicle/RegisterVehicle";

const NAV_ICONS = [
  { icon: Car,     label: "Details" },
  { icon: Wrench,  label: "Maint." },
  { icon: ClipboardCheck, label: "Diag." },
  { icon: ShieldCheck,    label: "Inspect" },
  { icon: Settings, label: "Admin" },
];

type ReportTab = "maintenance" | "diagnostics" | "inspections" | "accidents";

export default function Dashboard() {
  const { address } = useWallet();
  const navigate = useNavigate();
  const { web3, contract } = useContract();

  const [loading, setLoading] = useState(true);
  const [vin, setVin] = useState("");
  const [role, setRole] = useState<string>();
  const [meta, setMeta] = useState<any>(null);
  const [maint, setMaint] = useState<any[]>([]);
  const [diag, setDiag] = useState<any[]>([]);
  const [insp, setInsp] = useState<any[]>([]);
  const [accs, setAccs] = useState<any[]>([]);
  const [vinError, setVinError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [activeTab, setActiveTab] = useState<ReportTab>("maintenance");

  // fetch roles
  useEffect(() => {
    if (!address) {
      navigate("/");
      return;
    }
    if (!contract) return;
    (async () => {
      const MECH = web3.utils.keccak256("MECHANIC_ROLE");
      const POLI = web3.utils.keccak256("POLICE_ROLE");
      const isMech = await contract.methods.hasRole(MECH, address).call();
      const isPoli = await contract.methods.hasRole(POLI, address).call();
      setRole(isMech ? "Mechanic" : isPoli ? "Police" : "User");
      setLoading(false);
    })();
  }, [contract, address]);

  // load all data sets
  const loadAll = async () => {
    if (!contract || !vin.trim()) return;
    const v = vinToBytes17(vin);
    try {
      const m = await contract.methods.getVehicleMeta(v).call();
      const [ma, di, ins, ac] = await Promise.all([
        contract.methods.getMaintenance(v).call(),
        contract.methods.getDiagnostics(v).call(),
        contract.methods.getInspections(v).call(),
        contract.methods.getAccidents(v).call(),
      ]);
      setMeta(m);
      setMaint(ma);
      setDiag(di);
      setInsp(ins);
      setAccs(ac);
      setVinError(null);
    } catch {
      setMeta(null);
      setMaint([]);
      setDiag([]);
      setInsp([]);
      setAccs([]);
      setVinError("VIN not found.");
    }
  };

  const addMaint = async (part: string, hash: string, note: string) => {
    if (!contract || !address) return;
    await contract.methods
      .addMaintenance(vinToBytes17(vin), strToBytes32(part), hash, strToBytes32(note))
      .send({ from: address });
    setShowAddForm(false);
    loadAll();
  };

  const registerVehicle = async (v: string, year: string) => {
    if (!contract || !address) return;
    const vb = vinToBytes17(v);
    await contract.methods.registerVehicle(vb, address, year).send({ from: address });
    setVin(v);
    loadAll();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090C13] text-white">
        <span className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-white ">
      {/* Sidebar / bottom nav */}
      <nav className="bg-[#0f1218] flex md:flex-col justify-around md:justify-start items-center p-2 fixed bottom-0 md:static w-full md:w-20">
        {NAV_ICONS.map(({ icon: Icon }, i) => (
          <Icon key={i} className="text-gray-400 hover:text-white cursor-pointer my-2 md:my-4" size={24} />
        ))}
      </nav>

      <main className="flex-1 p-4 pb-24 md:pb-4">
        <NavBar />

        {/* VIN lookup */}
        <div className="my-6">
          <VinInput vin={vin} setVin={setVin} onLoad={loadAll} />
          {vinError && <p className="text-red-500 mt-1">{vinError}</p>}
        </div>

        {/* Overview stats */}
        {meta && !showReports && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard label="Year" value={meta.year} icon={ClipboardCheck} />
            <StatCard label="Maintenance" value={meta.maintCnt} icon={Wrench} />
            <StatCard label="Diagnostics" value={meta.diagCnt} icon={ClipboardCheck} />
            <StatCard label="Inspections" value={meta.inspCnt} icon={ShieldCheck} />
          </div>
        )}

        {/* Actions */}
        {meta && !showReports && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {role === "Mechanic" && (
              <button
                onClick={() => { setShowAddForm(true); setShowReports(false); }}
                className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg text-center"
              >
                + Add Maintenance
              </button>
            )}
            <button
              onClick={() => { setShowReports(true); setShowAddForm(false); setActiveTab("maintenance"); }}
              className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg text-center"
            >
              View Reports
            </button>
          </div>
        )}

        {/* Add Maintenance Form */}
        {showAddForm && (
          <div className="mb-8 bg-white/5 backdrop-blur p-6 rounded-xl">
            <MaintenanceForm onSubmit={addMaint} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {/* Reports Section */}
        {meta && showReports && (
          <div className="mb-8 bg-white/5 backdrop-blur p-4 rounded-xl">
            <div className="flex space-x-4 mb-4 overflow-auto">
              {(["maintenance","diagnostics","inspections","accidents"] as ReportTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full ${activeTab===tab ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  {tab.charAt(0).toUpperCase()+tab.slice(1)}
                </button>
              ))}
            </div>
            <div>
              {activeTab === "maintenance" && <MaintenanceTable rows={maint} />}
              {activeTab === "diagnostics" && <DiagnosticsTable rows={diag} />}
              {activeTab === "inspections" && <InspectionsTable rows={insp} />}
              {activeTab === "accidents" && <AccidentsTable rows={accs} />}
            </div>
          </div>
        )}

        {/* Register Vehicle */}
        {meta && (
          <div className="mt-8">
            <RegisterVehicle onSubmit={registerVehicle} />
          </div>
        )}
      </main>
    </div>
  );
}

// Small stat card component
function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: React.FC<{ size?: number; className?: string }>;
}) {
  return (
    <div className="bg-white/5 backdrop-blur p-4 rounded-xl flex items-center gap-3">
      <Icon size={24} className="text-gray-300" />
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
