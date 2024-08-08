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
  const router = useRouter();

  const taskBtn = () => {
    router.push('/')
  }

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
            <div className="flex items-center mb-2">
            <h1 id="titleText" className="text-2xl font-bold font-mono ">
              Done!
            </h1>
            <button 
                onClick={taskBtn}
                className="text-2xl p-1 rounded text-white ml-5"
              >
                🎉
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
            <h1 id="titleText" className="text-2xl font-bold font-mono text-center mb-5">
              Finish your tasks!
            </h1>
            <button 
                onClick={taskBtn}
                className="text-xl text-white text-center font-mono outline outline-2 p-2 w-30"
              >
                Okay...
              </button>
            </div>
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
