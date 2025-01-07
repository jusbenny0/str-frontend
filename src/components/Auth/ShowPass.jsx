import { CheckSquare, Square } from '@phosphor-icons/react'
import React from 'react'

const ShowPass = ({ yourState, setYourState }) => {

    // simple usestate toggler used for passwords
    return (
        <div className="p-2 flex items-center text-white cursor-pointer gap-1"
            onClick={() => setYourState(prev => !prev)}
        >
            {yourState ? (
                <CheckSquare weight='fill' color='pink' size={26} className='hover:scale-105' />
            ) :
                <Square color='white' size={26} className='hover:scale-105' />


            }


            Show password?
        </div>
    )
}

export default ShowPass
