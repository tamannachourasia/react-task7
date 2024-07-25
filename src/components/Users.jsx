//componets/Users.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="users-container p-4">
      <h2 className="text-2xl mb-4 font-bold" style={{color:'black'}}>Users</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2 border">Email ID</th>
              <th className="px-4 py-2 border">Password</th>
              <th className="px-4 py-2 border">Signup Time</th>
              <th className="px-4 py-2 border">IP</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.password}</td>
                <td className="border px-4 py-2">
                  {user.signupTime ? new Date(user.signupTime.toDate()).toLocaleString() : 'N/A'}
                </td>
                <td className="border px-4 py-2">{user.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;

