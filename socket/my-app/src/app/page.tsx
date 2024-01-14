"use client";
import Image from 'next/image'
import styles from './page.module.css'
import io from 'socket.io-client';

import { useEffect } from 'react';
import {nanoid} from 'nanoid';

const username = nanoid(4);

export default function Home() {
  let socket = io('http://localhost:8000');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('ft connected');
    });
    socket.on('disconnect', () => {
      console.log('ft disconnected');
    });
    socket.on('chatmessage', (message) => {
      console.log(message);
    });
  }, []);

  
  return (
    <main className={styles.main}>
      <button onClick={() => socket.emit('message', {
        username,
        message: 'Hello World',
      })}>Send</button>
    </main>
  );
}
