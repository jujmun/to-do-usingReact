'use client';
import React, {FormEvent, useState, useEffect} from 'react';
import { collection, addDoc, getDocs, getDoc, query, onSnapshot, doc, deleteDoc, where } from "firebase/firestore"; 
import {db} from '../firebase';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  name: string;
}

export default function Done() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'doneTask'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArr: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ id: doc.id, name: doc.data().name });
      });
      setTasks(tasksArr);
    });
    
    return() => unsubscribe();
  }, []);

  const trashIt = async (id: string) => {
    await deleteDoc(doc(db, 'doneTask', id));
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-black bg-cover">
      <div className="container mx-auto p-4 max-w-md text-white bg-opacity-50">
        {
          tasks.length > 0 ? (
            <h1 id="titleText" className="text-2xl font-bold font-mono mb-4">
              Done! 🎉
            </h1>
          ) : (
            <h1 id="titleText" className="text-center text-2xl font-bold font-mono mb-4">
              Finish your tasks!
            </h1>
          )
        }
        <ol className="taskSheet list-decimal leading-loose space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <span className="px-3">{task.name}</span>
              <button
                onClick={() => trashIt(task.id)}
                className="remove-button  w-10 p-1 rounded text-white "
              >
                X
              </button>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
