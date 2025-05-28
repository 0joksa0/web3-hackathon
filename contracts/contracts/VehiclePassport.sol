// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract VehiclePassport is AccessControl {
    /* -------------------- roles -------------------- */
    bytes32 public constant MECHANIC_ROLE = keccak256("MECHANIC_ROLE");
    bytes32 public constant POLICE_ROLE   = keccak256("POLICE_ROLE");

    /* -------------------- types -------------------- */
    struct OwnershipLog {
        address owner;
        uint40  from;
        uint40  to;      // 0 ⇢ current owner
    }

    /* ipfs CID, part, note… stanu u 32 B */
    struct Maintenance {
        uint40   ts;
        bytes32  part;
        string partIpfs;
        bytes32  note;
        address  mechanic;
    }

    struct Diagnostic {
        uint40   ts;
        string digIpfs;        // OBD JSON
        bytes32  summary; // summary string hashed to CID-like bytes
        address  mechanic;
    }

    struct Inspection {
        uint40  ts;
        bool    passed;
        string  insIpfs;
        address inspector;
    }

    struct Accident {
        uint40  ts;
        string accIpfs;
        string desc;
        address reporter;
    }

    struct VehicleMeta {
        address currentOwner;
        uint16  year;
        uint32 mileage; 
    }

    /* ---------------- storage layout --------------- */
    mapping(bytes17 => VehicleMeta) public meta;              // VIN ⇒ owner+year
    mapping(bytes17 => OwnershipLog[]) public owners;         // VIN ⇒ history

    mapping(bytes17 => Maintenance[]) public maints;
    mapping(bytes17 => Diagnostic[])  public diags;
    mapping(bytes17 => Inspection[])  public insps;
    mapping(bytes17 => Accident[])    public accs;
    mapping(address => bytes17[]) public ownerToVins;


    /* ---------------- events ----------------------- */
    event VehicleRegistered(bytes17 indexed vin, address indexed owner);
    event OwnershipTransferred(bytes17 indexed vin, address indexed from, address indexed to);

    event MaintenanceAdded(bytes17 vin, bytes32 partCid, bytes32 noteCid);
    event DiagnosticAdded(bytes17 vin, string cid, bytes32 summaryCid);
    event InspectionAdded(bytes17 vin, bool passed, string cid);
    event AccidentReported(bytes17 vin, string photoCid, string descCid);

    /* ---------------- constructor ------------------ */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /* ---------------- modifiers -------------------- */
    modifier onlyVehicleOwner(bytes17 vin) {
        require(meta[vin].currentOwner == msg.sender, "Not owner");
        _;
    }

    modifier vehicleExists(bytes17 vin) {
        require(meta[vin].currentOwner != address(0), "VIN not registered");
        _;
    }

    /* ---------------- admin ------------------------ */
    function registerVehicle(bytes17 vin, address firstOwner, uint16 year, uint32 mileage)
        external
    {
        require(meta[vin].currentOwner == address(0), "VIN exists");
        meta[vin] = VehicleMeta(firstOwner, year, mileage);
        owners[vin].push(OwnershipLog(firstOwner, uint40(block.timestamp), 0));
        ownerToVins[firstOwner].push(vin);
        emit VehicleRegistered(vin, firstOwner);
    }

    /* ---------------- ownership -------------------- */
    function transferOwnership(bytes17 vin, address newOwner)
        external
        vehicleExists(vin)
        onlyVehicleOwner(vin)
    {
        _removeVinFromOwner(msg.sender, vin);
        OwnershipLog[] storage h = owners[vin];
        h[h.length - 1].to = uint40(block.timestamp);
        h.push(OwnershipLog(newOwner, uint40(block.timestamp), 0));
        ownerToVins[newOwner].push(vin);
        meta[vin].currentOwner = newOwner;
        emit OwnershipTransferred(vin, msg.sender, newOwner);
    }

    /* ---------------- mechanic --------------------- */
    function addMaintenance(bytes17 vin, bytes32 partCid, string memory partIpfs, bytes32 noteCid, uint32 mileage)
        external
        vehicleExists(vin)
        onlyRole(MECHANIC_ROLE)
    {
        require(mileage>= meta[vin].mileage, "Can only increase");
        meta[vin].mileage = mileage;
        maints[vin].push(Maintenance(uint40(block.timestamp), partCid, partIpfs, noteCid, msg.sender));
        emit MaintenanceAdded(vin, partCid, noteCid);
    }

    function addDiagnostic(bytes17 vin, string memory cid, bytes32 summaryCid, uint32 mileage)
        external
        vehicleExists(vin)
        onlyRole(MECHANIC_ROLE)
    {
        require(mileage>= meta[vin].mileage, "Can only increase");
        meta[vin].mileage = mileage;
        diags[vin].push(Diagnostic(uint40(block.timestamp), cid, summaryCid, msg.sender));
        emit DiagnosticAdded(vin, cid, summaryCid);
    }

    /* ---------------- police ----------------------- */
    function addInspection(bytes17 vin, bool passed, string memory cid, uint32 mileage)
        external
        vehicleExists(vin)
        onlyRole(POLICE_ROLE)
    {
        require(mileage>= meta[vin].mileage, "Can only increase");
        meta[vin].mileage = mileage;
        insps[vin].push(Inspection(uint40(block.timestamp), passed, cid, msg.sender));
        emit InspectionAdded(vin, passed, cid);
    }

    function reportAccident(bytes17 vin, string memory photoCid, string memory descCid)
        external
        vehicleExists(vin)
        onlyRole(POLICE_ROLE)
    {
        accs[vin].push(Accident(uint40(block.timestamp), photoCid, descCid, msg.sender));
        emit AccidentReported(vin, photoCid, descCid);
    }

    /* ----------- compact meta getter -------------- */
    function getVehicleMeta(bytes17 vin)
        external
        view
        vehicleExists(vin)
        returns (
            address owner,
            uint16  year,
            uint32  mileage,
            uint32  maintCnt,
            uint32  diagCnt,
            uint32  inspCnt,
            uint32  accCnt
        )
    {
        VehicleMeta storage m = meta[vin];
        return (
            m.currentOwner,
            m.year,
            m.mileage,
            uint32(maints[vin].length),
            uint32(diags[vin].length),
            uint32(insps[vin].length),
            uint32(accs[vin].length)
        );
    }
function _removeVinFromOwner(address owner, bytes17 vin) internal {
    bytes17[] storage arr = ownerToVins[owner];
    for (uint i = 0; i < arr.length; i++) {
        if (arr[i] == vin) {
            // swap with last and pop
            arr[i] = arr[arr.length - 1];
            arr.pop();
            break;
        }
    }
}
    /* view arrays ostaju iste signaturno,
       ali sada vraćaju optimizirane strukture */
    function getMaintenance(bytes17 vin) external view returns (Maintenance[] memory) { return maints[vin]; }
    function getDiagnostics(bytes17 vin)  external view returns (Diagnostic[] memory){ return diags[vin]; }
    function getInspections(bytes17 vin)  external view returns (Inspection[] memory){ return insps[vin]; }
    function getAccidents(bytes17 vin)    external view returns (Accident[] memory)  { return accs[vin]; }
    function getOwnershipHistory(bytes17 vin) external view returns (OwnershipLog[] memory) { return owners[vin]; }
function getMyVehicles() external view returns (bytes17[] memory) {
    return ownerToVins[msg.sender];
}
}

