"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
 

  return (
    <main className={styles.main}>
      <button
        className={styles.button}
        onClick={() => {
          router.push("/chats");
        }}
      >
        GO TO CHATS
      </button>
    </main>
  );
}
