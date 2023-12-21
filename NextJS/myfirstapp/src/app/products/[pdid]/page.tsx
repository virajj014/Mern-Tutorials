import React from 'react'
import { Metadata } from 'next'
import { resolve } from 'path'

type Props ={
  params:{
    pdid:string
  }
}

export const generateMetadata =async ({params}:Props):Metadata => {
  const title = await new Promise(resolve=>{{
    setTimeout(()=>{
      resolve(`Product ${params.pdid}`)
    },1000)
  }})
  return {
    title : {
      absolute: `${title}`
    },
  }
}

const page = ({params}:Props) => {

  return (
    <div>product page {params.pdid}</div>
  )
}

export default page