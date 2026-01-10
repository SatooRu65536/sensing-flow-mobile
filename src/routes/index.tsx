import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import AccelerometerPanel from '../components/Accelerometer';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    const msg = await invoke<string>('greet', { name });
    setGreetMsg(msg);
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input id="greet-input" onChange={(e) => setName(e.currentTarget.value)} placeholder="Enter a name..." />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
      <AccelerometerPanel />
    </main>
  );
}
