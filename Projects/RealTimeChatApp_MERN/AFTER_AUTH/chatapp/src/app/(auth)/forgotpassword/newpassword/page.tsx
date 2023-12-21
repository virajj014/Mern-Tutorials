"use client";
import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from '@/styles/auth.module.css'
import Link from 'next/link';

import { useRouter } from 'next/navigation'

import { ToastContainer, toast } from 'react-toastify';

import { useSearchParams } from 'next/navigation'
import { CircularProgress } from '@mui/material';
import BackButton from '@/components/BackButton';
interface FormData {
    newpassword: string;
    confirmpassword: string;
    otp: string;
}
const page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
 
    const email = searchParams.get('email')

    const [formData, setFormData] = useState<FormData>({
        newpassword: '',
        confirmpassword: '',
        otp: ''
    });

    const [loading, setLoading] = useState<boolean>(false)

    const savePassword = () => {

        if (formData.newpassword != formData.confirmpassword) {
            toast.error('Passwords do not match')
            return
        }

        // router.push('/login')
        setLoading(true)

        fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/updatepassword', {
            method: 'POST',
            body: JSON.stringify({
                newpassword: formData.newpassword,
                email: email,
                otp: formData.otp
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                setLoading(false)
                if (data.ok) {
                    toast.success('Password Changed')
                    router.push('/login')
                }
                else {
                    toast.error('Error Changing Password')
                }
            })
            .catch(err => {
                setLoading(false)
                toast.error('Error Changing Password')
            })
    }
    return (
        <div className={styles.formOuter}>
            <BackButton backroute={'/login'}/>

            <div className={styles.formContainer}>


                <TextField id="standard-basic" label="New Password" variant="outlined" color="secondary"
                type="password"
                    value={formData.newpassword}
                    onChange={e => setFormData({ ...formData, newpassword: e.target.value })}
                />
                <TextField id="standard-basic" label="Confirm Password" variant="outlined" color="secondary"
               type="password"
                value={formData.confirmpassword}
                onChange={e => setFormData({ ...formData, confirmpassword: e.target.value })}
                />
                <TextField id="standard-basic" label="OTP" variant="outlined" color="secondary" 
                value={formData.otp}
                onChange={e => setFormData({ ...formData, otp: e.target.value })}
                />


                {
                    loading ?
                        <CircularProgress color='secondary' />
                        :
                        <Button variant="contained"
                            onClick={savePassword}
                        >Save Password</Button>
                }

            </div>
        </div>
    )
}

export default page