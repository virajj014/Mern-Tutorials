"use client";
import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from '@/styles/auth.module.css'
import Link from 'next/link';

import { useRouter } from 'next/navigation'

import { ToastContainer, toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import BackButton from '@/components/BackButton';

interface FormData {
    email: string;
}
const page = () => {
    const router = useRouter()

    const [formData, setFormData] = useState<FormData>({
        email: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const [sendingOtp, setSendingOtp] = useState<boolean>(false)
    const sendotp = async () => {
        // router.push('/forgotpassword/newpassword')

        // console.log(formData)
        setSendingOtp(true)
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/sendotp', {
            method: 'POST',
            body: JSON.stringify({
                email: formData.email
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        setSendingOtp(false)
        let data = await res.json()

        if (data.ok) {
            toast.success('OTP Sent')
           // send email to next page
            router.push('/forgotpassword/newpassword?email='+formData.email)
        }
        else {
            toast.error('Error Sending OTP')
        }
    }
    return (
        <div className={styles.formOuter}>
            <BackButton backroute={'/login'}/>

            <div className={styles.formContainer}>
                <h1>Forgot Password</h1>

                <TextField id="standard-basic" label="Email" variant="outlined" color="secondary"
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <div className={styles.inputrow}>
                    {
                        sendingOtp ?
                            <CircularProgress color='secondary' />
                            :
                            <Button variant="contained"
                                onClick={sendotp}
                            >Send OTP</Button>
                    }
                </div>

            </div>
        </div>
    )
}

export default page