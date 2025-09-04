
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/Employees.css';

const AssignedMembers = () => {
    const { id } = useParams();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeamMembers();
    });

    const fetchTeamMembers = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/admin/team-members?managerId=${id}`,
                { withCredentials: true }
            );
            setEmployees(res.data);
        } catch (err) {
            console.error("Error fetching team members:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading team members...</p>;


    return (
        <div className="employees-container">
            <h2 className="employees-heading">Team Members</h2>
            {employees.length === 0 ? (
                <p>No employees available</p>
            ) : (
                <div className="table-responsive">
                    <table className="employees-table">
                        <thead>
                            <tr>
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Role</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Mobile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.employeeId} className="text-center">
                                    <td className="border p-2">{emp.employeeId}</td>
                                    <td className="border p-2">{emp.employeeName}</td>
                                    <td className="border p-2">{emp.role}</td>
                                    <td className="border p-2">{emp.email}</td>
                                    <td className="border p-2">{emp.mobile}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AssignedMembers;