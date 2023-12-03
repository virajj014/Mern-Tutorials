import React from 'react'

const page = ({ params }) => {

    return (
        <div>review page
            <h1>
                product id {params.pdid}
            </h1>

            <h1>review id {params.reviewid}</h1>
        </div>
    )
}

export default page