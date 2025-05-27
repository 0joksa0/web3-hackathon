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
        bytes32  partCid;
        string partIpfs;
        bytes32  noteCid;
        address  mechanic;
    }

    struct Diagnostic {
        uint40   ts;
        bytes32  cid;        // OBD JSON
        bytes32  summaryCid; // summary string hashed to CID-like bytes
        address  mechanic;
    }

    struct Inspection {
        uint40  ts;
        bool    passed;
        bytes32 cid;
        address inspector;
    }

    struct Accident {
        uint40  ts;
        bytes32 photoCid;
        bytes32 descCid;
        address reporter;
    }

    struct VehicleMeta {
        address currentOwner;
        uint16  year;
    }

    /* ---------------- storage layout --------------- */
    mapping(bytes17 => VehicleMeta) public meta;              // VIN ⇒ owner+year
    mapping(bytes17 => OwnershipLog[]) public owners;         // VIN ⇒ history

    mapping(bytes17 => Maintenance[]) public maints;
    mapping(bytes17 => Diagnostic[])  public diags;
    mapping(bytes17 => Inspection[])  public insps;
    mapping(bytes17 => Accident[])    public accs;

    /* ---------------- events ----------------------- */
    event VehicleRegistered(bytes17 indexed vin, address indexed owner);
    event OwnershipTransferred(bytes17 indexed vin, address indexed from, address indexed to);

    event MaintenanceAdded(bytes17 vin, bytes32 partCid, bytes32 noteCid);
    event DiagnosticAdded(bytes17 vin, bytes32 cid, bytes32 summaryCid);
    event InspectionAdded(bytes17 vin, bool passed, bytes32 cid);
    event AccidentReported(bytes17 vin, bytes32 photoCid, bytes32 descCid);

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
    function registerVehicle(bytes17 vin, address firstOwner, uint16 year)
        external
    {
        require(meta[vin].currentOwner == address(0), "VIN exists");
        meta[vin] = VehicleMeta(firstOwner, year);
        owners[vin].push(OwnershipLog(firstOwner, uint40(block.timestamp), 0));
        emit VehicleRegistered(vin, firstOwner);
    }

    /* ---------------- ownership -------------------- */
    function transferOwnership(bytes17 vin, address newOwner)
        external
        vehicleExists(vin)
        onlyVehicleOwner(vin)
    {
        OwnershipLog[] storage h = owners[vin];
        h[h.length - 1].to = uint40(block.timestamp);
        h.push(OwnershipLog(newOwner, uint40(block.timestamp), 0));
        meta[vin].currentOwner = newOwner;
        emit OwnershipTransferred(vin, msg.sender, newOwner);
    }

    /* ---------------- mechanic --------------------- */
    function addMaintenance(bytes17 vin, bytes32 partCid,string memory partIpfs, bytes32 noteCid)
        external
        vehicleExists(vin)
        onlyRole(MECHANIC_ROLE)
    {
        maints[vin].push(Maintenance(uint40(block.timestamp), partCid, partIpfs, noteCid, msg.sender));
        emit MaintenanceAdded(vin, partCid, noteCid);
    }

    function addDiagnostic(bytes17 vin, bytes32 cid, bytes32 summaryCid)
        external
        vehicleExists(vin)
        onlyRole(MECHANIC_ROLE)
    {
        diags[vin].push(Diagnostic(uint40(block.timestamp), cid, summaryCid, msg.sender));
        emit DiagnosticAdded(vin, cid, summaryCid);
    }

    /* ---------------- police ----------------------- */
    function addInspection(bytes17 vin, bool passed, bytes32 cid)
        external
        vehicleExists(vin)
        onlyRole(POLICE_ROLE)
    {
        insps[vin].push(Inspection(uint40(block.timestamp), passed, cid, msg.sender));
        emit InspectionAdded(vin, passed, cid);
    }

    function reportAccident(bytes17 vin, bytes32 photoCid, bytes32 descCid)
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
            uint32(maints[vin].length),
            uint32(diags[vin].length),
            uint32(insps[vin].length),
            uint32(accs[vin].length)
        );
    }

    /* view arrays ostaju iste signaturno,
       ali sada vraćaju optimizirane strukture */
    function getMaintenance(bytes17 vin) external view returns (Maintenance[] memory) { return maints[vin]; }
    function getDiagnostics(bytes17 vin)  external view returns (Diagnostic[] memory){ return diags[vin]; }
    function getInspections(bytes17 vin)  external view returns (Inspection[] memory){ return insps[vin]; }
    function getAccidents(bytes17 vin)    external view returns (Accident[] memory)  { return accs[vin]; }
    function getOwnershipHistory(bytes17 vin) external view returns (OwnershipLog[] memory) { return owners[vin]; }
}

