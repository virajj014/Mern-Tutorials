import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/backButton.module.css';

interface BackButtonProps {
    backroute: string;
}

const BackButton: React.FC<BackButtonProps> = ({ backroute }) => {
    const router = useRouter();

    const handleBack = () => {
        router.push(backroute);
    };

    return (
        <div className={styles.backbutton}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                onClick={handleBack}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    );
};

export default BackButton;
