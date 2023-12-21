"use client";
import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from '@/styles/auth.module.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import BackButton from '@/components/BackButton';
interface FormData {
    name: string;
    email: string;
    password: string;
}

const page = () => {


    const Router = useRouter()

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [otp, setOtp] = useState<string>('');


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const [sendingOtp, setSendingOtp] = useState<boolean>(false)
    const sendOtp =async () => {
        // console.log(formData)
        setSendingOtp(true)
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/sendotp',{
            method:'POST',
            body:JSON.stringify({
                email:formData.email
            }),
            headers:{
                'Content-Type':'application/json'
            }
        })

        setSendingOtp(false)
        let data = await res.json()

        if(data.ok){
            toast.success('OTP Sent')
        }
        else{
            toast.error('Error Sending OTP')
        }
    }

    const handleSignup = async () => {
        let formdata = new FormData()
        formdata.append('name',formData.name)
        formdata.append('email',formData.email)
        formdata.append('password',formData.password)
        formdata.append('otp',otp)
        if(imageFile){
            formdata.append('clientfile',imageFile)
        }
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/register',{
            method:'POST',
            body:formdata
        })
        let data = await res.json()
        if(data.ok){
            toast.success('Signup Successful')
            Router.push('/login')
        }
        else{
            toast.error('Signup Failed')
        }
    }
    return (
        <div className={styles.formOuter}>
            <BackButton backroute={'/login'}/>
            <div className={styles.formContainer}>
                <h1>Signup</h1>
                <div className={styles.pickImageContaner}>
                    <Avatar src={
                        imageFile ? URL.createObjectURL(imageFile) : ''

                    } />
                    <Button variant="contained" color="secondary" component="label">
                        Select Image
                        <input type="file" hidden
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files) {
                                    setImageFile(e.target.files[0])
                                }
                            }}
                        />
                    </Button>
                </div>
                <TextField
                    id="name-input"
                    label="Name"
                    variant="outlined"
                    color="secondary"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <div className={styles.inputrow}>
                    <TextField
                        id="email-input"
                        label="Email"
                        variant="outlined"
                        color="secondary"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {
                        sendingOtp ? <CircularProgress color="secondary"/> :
                    <Button variant="contained" color="secondary"
                        onClick={sendOtp}
                    >Send OTP</Button>
                    }

                </div>
                <TextField
                    id="password-input"
                    label="Password"
                    variant="outlined"
                    color="secondary"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />

                <TextField
                    id="otp-input"
                    label="OTP"
                    variant="outlined"
                    color="secondary"
                    name="otp"
                    value={otp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setOtp(e.target.value)
                    
                    }}
                />
                <Button variant="contained" onClick={
                    handleSignup
                }>Verify</Button>
                <br />
                <p className={styles.t2}>Already have an account? <Link href="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default page