"use client";

import React from 'react'
import styles from '@/styles/auth.module.css'
import { useRouter } from 'next/navigation';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '@/redux/features/auth-slice';


interface FormData {

  email: string;
  password: string;
}
const page = () => {
  const router = useRouter()
  const auth = useAppSelector((state) => state.authReducer)
  const dispatch = useDispatch<AppDispatch>()


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

    if (formData.email == '' || formData.password == '') {
      toast.error('Please fill all the fields')
      return
    }

    // if (formData.password.length < 6) {
    //   toast.error('Password must be atleast 6 characters long')
    //   return
    // }

    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    let data = await res.json()
    if (data.ok) {
      toast.success('Login Success')
      getUserData()
      // router.push('/')
    }
    else {
      toast.error(data.message)
    }
  }

  const getUserData = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/getuser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    let data = await res.json()
    if (data.ok) {
      console.log(data.data)
      dispatch(logIn(data.data))
      router.push('/')
 

    }
    else {
      dispatch(logOut())
    }

  }
  const checkLogin = async () => { 
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/checklogin', {
      method: 'GET',
      credentials: 'include'
    })

    let data = await res.json()
    if(data.ok){
      router.push('/')
    }
  }
  React.useEffect(() => {
    checkLogin()
  }, [])



  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (

    <div className={styles.formOuter}>
      <div className={styles.formContainer}>
        <h1>Login</h1>
        <TextField id="standard-basic" label="Email" variant="outlined" color="warning"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <FormControl sx={{ m: 0 }} variant="outlined" color="warning">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
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