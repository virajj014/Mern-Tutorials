"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import styles from '@/styles/auth.module.css'
import { Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
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
  const sendOtp = async () => {
    setSendingOtp(true)
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/sendotp', {
      method: 'POST',
      body: JSON.stringify({ email: formData.email }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    let data = await res.json()
    setSendingOtp(false)

    if (data.ok) {
      toast.success('OTP sent')
      router.push('/forgotpassword/newpassword?email='+formData.email)
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
        <h1>Forgot Password</h1>
        <TextField id="standard-basic" label="Email" variant="outlined" color="secondary"
          name='email'
          value={formData.email}
          onChange={handleInputChange}
        />

        <div className={styles.inputrow}>
          {
            sendingOtp ?
              <LoadingButton
                size="small"

                endIcon={<SendIcon />}
                loading={
                  sendingOtp
                }
                loadingPosition="end"
                variant="contained"
              >
                <span>Send</span>
              </LoadingButton>
              :
              <Button variant='contained' color='secondary'
                onClick={sendOtp}

              >Send OTP</Button>
          }
        </div>
      </div>
    </div>

  )
}

export default page