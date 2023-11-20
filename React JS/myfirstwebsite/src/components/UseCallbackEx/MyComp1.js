import React, { memo } from 'react'

const MyComp1 = ({a,myfunc1}) => {
    console.log('MyComp1 is rendered',a);
    myfunc1();
    return (
        <div>MyComp1</div>
    )
}

export default memo(MyComp1)