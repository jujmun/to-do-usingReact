'use client';
import React, {FormEvent, useState, useEffect} from 'react';
import { collection, addDoc, getDocs, query, onSnapshot, doc, deleteDoc } from "firebase/firestore"; 
import {db} from './firebase';

interface Task {
  id: string;
  name: string;
}

export default function Todo() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [maxLength, setMaxLength] = useState<number>(30);

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions= {month: 'long', day: 'numeric'};
    const formattedDate=today.toLocaleDateString(undefined, options);
    const titleElement = document.getElementById('titleText');
    if (titleElement) {
      titleElement.textContent = `To-Do for ${formattedDate}`;
    }
  }, []);

  useEffect(()=> {
    const handleResize = () => {
      setMaxLength(window.innerWidth <= 600 ? 20 : 39);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArr: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ id: doc.id, name: doc.data().name });
      });
      setTasks(tasksArr);
    });
    
    return() => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()){
      await addDoc(collection(db, 'tasks'), {
        name: inputValue,
      });
      setInputValue('');
    }
  };

  const handleRemove = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
  };


  return (
    <main className="flex items-center justify-center min-h-screen bg-black bg-cover">
      <div className="container mx-auto p-4 max-w-md text-white bg-opacity-50">
        <h1 id="titleText" className="text-2xl font-bold mb-4 font-mono">To-Do List</h1>
        <form onSubmit={handleSubmit} className="text-center mb-4">
          <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="input-box w-full p-2 rounded text-black"
          placeholder="Just do it."
          maxLength={maxLength}
          />
        </form>
        <ol className="taskSheet list-decimal leading-loose space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <span className="px-3">{task.name}</span>
              <button
                onClick={() => handleRemove(task.id)}
                className="remove-button bg-green-500 w-10 p-1 rounded text-white hover:bg-green-700"
              >
                ✔
              </button>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
