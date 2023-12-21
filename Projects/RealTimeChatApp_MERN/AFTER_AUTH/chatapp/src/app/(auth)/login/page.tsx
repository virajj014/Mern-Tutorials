"use client";
import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from '@/styles/auth.module.css'
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
interface FormData {

    email: string;
    password: string;
}

const page = () => {
    const router = useRouter()

    const [formData, setFormData] = React.useState<FormData>({

        email: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleLogin = async () => {
        // console.log(formData)
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            // allow cookies
            credentials: 'include'
        })

        let data = await res.json()

        if (data.ok) {
            toast.success('Login Success')
            router.push('/')
        }
        else {
            toast.error('Error Logging In')
        }
    }

    const checkLogin = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/checklogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'

        })

        let data = await res.json()
        console.log(data)
        if (data.ok) {
            router.push('/')
        }
    }

    React.useEffect(() => {
        checkLogin()
    }, [])
    return (
        <div className={styles.formOuter}>
            <div className={styles.formContainer}>
                <h1>Login</h1>
                <TextField id="standard-basic" label="Email" variant="outlined" color="secondary"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <TextField id="standard-basic" label="Password" variant="outlined" color="secondary" type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <p className={styles.t1}><Link href="/forgotpassword">Forgot password?</Link></p>

                <Button variant="contained"
                    onClick={handleLogin}
                >Submit</Button>
                <br />
                <p className={styles.t2}>Don't have an account? <Link href="/signup">Register</Link></p>
            </div>
        </div>
    )
}

export default page