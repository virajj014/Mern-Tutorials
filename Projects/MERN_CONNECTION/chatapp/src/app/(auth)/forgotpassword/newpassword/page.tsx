"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import styles from '@/styles/auth.module.css'
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
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


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [showCPassword, setShowCPassword] = React.useState(false);
    const handleClickShowCPassword = () => setShowCPassword((show) => !show);
    const [showOtp, setShowOtp] = React.useState(false);
    const handleClickShowOtp = () => setShowOtp((show) => !show);

    const [loading, setLoading] = useState<boolean>(false)

    const savePassword = async () => {
        if (formData.newpassword != formData.confirmpassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/updatepassword', {
            method: 'POST',
            body: JSON.stringify({ email, otp: formData.otp, newpassword: formData.newpassword }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        let data = await res.json()
        setLoading(false)

        if (data.ok) {
            toast.success('Password updated')
            router.push('/login')
        }
        else {
            toast.error(data.message)
        }
    }
    return (
        <div className={styles.formOuter}>
            {/* BackButton */}
            <BackButton backroute='/login' />

            <div className={styles.formContainer}>
                <FormControl sx={{ m: 0 }} variant="outlined" color="warning">
                    <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name="newpassword"
                        value={formData.newpassword}
                        onChange={handleInputChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    // onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>

                <FormControl sx={{ m: 0 }} variant="outlined" color="warning">
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showCPassword ? 'text' : 'password'}
                        name="confirmpassword"
                        value={formData.confirmpassword}
                        onChange={handleInputChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowCPassword}
                                    // onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showCPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>

                <FormControl sx={{ m: 0 }} variant="outlined" color="warning">
                    <InputLabel htmlFor="outlined-adornment-password">Otp</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showOtp ? 'text' : 'password'}
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowOtp}
                                    // onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showOtp ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>

                {
                    loading ?
                        <></>
                        :
                        <Button variant="contained"
                            color="secondary"
                            onClick={savePassword}
                        >
                            Save Password
                        </Button>
                }
            </div>
        </div>
    )
}

export default page