// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VehiclePassport is AccessControl {
    using Strings for uint256;

    bytes32 public constant MECHANIC_ROLE = keccak256("MECHANIC_ROLE");
    bytes32 public constant POLICE_ROLE   = keccak256("POLICE_ROLE");

    event VehicleRegistered(string vin, address indexed owner);
    event OwnershipTransferred(string vin, address indexed from, address indexed to);

    event MaintenanceAdded(string vin, string part, string ipfsHash, string note);
    event DiagnosticAdded(string vin, string ipfsHash, string summary);
    event InspectionAdded(string vin, bool passed, string ipfsHash);
    event AccidentReported(string vin, string ipfsHash, string description);

    struct Maintenance {
        uint256 timestamp;
        string  partReplaced;   // "Brake Pads"
        string  ipfsHash;       // part picture 
        string  note;   
        address mechanic;
    }

    struct DiagnosticReport {
        uint256 timestamp;
        string  ipfsHash;       // JSON OBD dump
        string  summary;        // "P0420 Catalyst System Efficiency"
        address mechanic;
    }

    struct Inspection {
        uint256 timestamp;
        bool    passed;
        string  ipfsHash;       // PDF/JSON report
        address inspector;
    }

    struct Accident {
        uint256 timestamp;
        string  ipfsHash;       // picture 
        string  description;
        address reporter;       // police
    }

    struct OwnershipLog {
        address owner;
        uint256 from;
        uint256 to;             // 0 if current
    }

    struct Vehicle {
        address currentOwner;
        uint16  manufactureYear;
        Maintenance[] maint;
        DiagnosticReport[] diag;
        Inspection[] inspections;
        Accident[] accidents;
        OwnershipLog[] owners;
    }

    mapping(string => Vehicle) private vehicles;          
    mapping(string => bool)    private vinExists;         

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyVehicleOwner(string memory vin) {
        require(vehicles[vin].currentOwner == msg.sender, "Not vehicle owner");
        _;
    }

    modifier vehicleMustExist(string memory vin) {
        require(vinExists[vin], "VIN not registered");
        _;
    }


    function registerVehicle(
        string memory vin,
        address firstOwner,
        uint16 year
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!vinExists[vin], "VIN already registered");
        vehicles[vin].currentOwner   = firstOwner;
        vehicles[vin].manufactureYear = year;
        vehicles[vin].owners.push(OwnershipLog(firstOwner, block.timestamp, 0));
        vinExists[vin] = true;
        emit VehicleRegistered(vin, firstOwner);
    }

    function transferOwnership(string memory vin, address newOwner)
        external
        vehicleMustExist(vin)
        onlyVehicleOwner(vin)
    {
        Vehicle storage v = vehicles[vin];
        uint256 lastIdx = v.owners.length - 1;
        v.owners[lastIdx].to = block.timestamp;

        v.owners.push(OwnershipLog(newOwner, block.timestamp, 0));
        v.currentOwner = newOwner;

        emit OwnershipTransferred(vin, msg.sender, newOwner);
    }

    function addMaintenance(
        string memory vin,
        string memory part,
        string memory ipfsHash,
        string memory note
    )
        external
        vehicleMustExist(vin)
        onlyRole(MECHANIC_ROLE)
    {
        vehicles[vin].maint.push(
            Maintenance(block.timestamp, part, ipfsHash, note, msg.sender)
        );
        emit MaintenanceAdded(vin, part, ipfsHash, note);
    }

    function addDiagnosticReport(
        string memory vin,
        string memory ipfsHash,
        string memory summary
    )
        external
        vehicleMustExist(vin)
        onlyRole(MECHANIC_ROLE)
    {
        vehicles[vin].diag.push(
            DiagnosticReport(block.timestamp, ipfsHash, summary, msg.sender)
        );
        emit DiagnosticAdded(vin, ipfsHash, summary);
    }

    function addInspection(
        string memory vin,
        bool passed,
        string memory ipfsHash
    )
        external
        vehicleMustExist(vin)
        onlyRole(POLICE_ROLE)
    {
        vehicles[vin].inspections.push(
            Inspection(block.timestamp, passed, ipfsHash, msg.sender)
        );
        emit InspectionAdded(vin, passed, ipfsHash);
    }

    function reportAccident(
        string memory vin,
        string memory ipfsHash,
        string memory description
    )
        external
        vehicleMustExist(vin)
        onlyRole(POLICE_ROLE)
    {
        vehicles[vin].accidents.push(
            Accident(block.timestamp, ipfsHash, description, msg.sender)
        );
        emit AccidentReported(vin, ipfsHash, description);
    }

    function getVehicleMeta(string memory vin)
        external
        view
        vehicleMustExist(vin)
        returns (
            address owner,
            uint16 year,
            uint256 maintCount,
            uint256 diagCount,
            uint256 inspCount,
            uint256 accCount
        )
    {
        Vehicle storage v = vehicles[vin];
        return (
            v.currentOwner,
            v.manufactureYear,
            v.maint.length,
            v.diag.length,
            v.inspections.length,
            v.accidents.length
        );
    }

    function getMaintenance(string memory vin) external view returns (Maintenance[] memory) {
        return vehicles[vin].maint;
    }

    function getDiagnostics(string memory vin) external view returns (DiagnosticReport[] memory) {
        return vehicles[vin].diag;
    }

    function getInspections(string memory vin) external view returns (Inspection[] memory) {
        return vehicles[vin].inspections;
    }

    function getAccidents(string memory vin) external view returns (Accident[] memory) {
        return vehicles[vin].accidents;
    }

    function getOwnershipHistory(string memory vin) external view returns (OwnershipLog[] memory) {
        return vehicles[vin].owners;
    }
}

