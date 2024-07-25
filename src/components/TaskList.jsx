import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, query, onSnapshot } from 'firebase/firestore';

function TaskList() {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'lists'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setTaskList(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="task-list-container p-4">
      <h2 className="text-2xl mb-4 font-bold" style={{color:'black'}}>Task Lists</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2 border">Task List Title</th>
              <th className="px-4 py-2 border">Created By (Email ID)</th>
              <th className="px-4 py-2 border">No. Of Tasks</th>
              <th className="px-4 py-2 border">Creation Time</th>
              <th className="px-4 py-2 border">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map((list, index) => (
              <tr key={list.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border px-4 py-2">{list.name}</td>
                <td className="border px-4 py-2">{list.email}</td>
                <td className="border px-4 py-2">{list.taskCount}</td>
                <td className="border px-4 py-2">
                  {list.creationTime ? new Date(list.creationTime.toDate()).toLocaleString() : 'N/A'}
                </td>
                <td className="border px-4 py-2">
                  {list.lastUpdated ? new Date(list.lastUpdated.toDate()).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskList;



