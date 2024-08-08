'use client';
import React, {FormEvent, useState, useEffect} from 'react';
import { collection, addDoc, getDocs, getDoc, query, onSnapshot, doc, deleteDoc, where } from "firebase/firestore"; 
import {db} from './firebase';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  name: string;
}

export default function Todo() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [maxLength, setMaxLength] = useState<number>(20);

  const accomplishmentBtn = () => {
    router.push('/done')
  }

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
      setMaxLength(window.innerWidth <= 600 ? 20 : 30);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'todo'));
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
      await addDoc(collection(db, 'todo'), {
        name: inputValue,
        createdAt: new Date(),
      });
      setInputValue('');
    }
  };

  const deleteYesterday = async () => {
    const today = new Date();
    today.setHours(0,0,0,0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const q = query(collection(db, 'todo'), where('createdAt', '<', today));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (doc) => {
      await handleRemove(doc.id);
    });

  };

  const handleRemove = async (id: string) => {
    const taskDocRef = doc(db, 'todo', id);
    const taskDocSnap = await getDoc(taskDocRef);
    const taskData = taskDocSnap.data();
    await addDoc(collection(db, 'doneTask'), {
      ...taskData,
      id,
      completedAt: new Date(),
    });
    await deleteDoc(taskDocRef);
  };


  return (
    <main className="flex items-center justify-center min-h-screen bg-black bg-cover">
      <div className="container mx-auto p-4 max-w-sm text-white bg-opacity-50">
        <div className="flex items-center mb-2">
        <h1 id="titleText" className="text-2xl font-bold font-mono ">
          To-Do List
        </h1>
        <button 
            onClick={accomplishmentBtn}
            className="text-2xl p-1 rounded text-white ml-5"
          >
            🎉
          </button>
        </div>
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
                className="remove-button bg-green-500 w-10 p-1 rounded text-white hover:bg-green-700 outline outline-2 outline-black"
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
