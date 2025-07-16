import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LuDot } from "react-icons/lu";

function ChatCard({ item, setShowProfile }) {

    const { onlineUsers } = useSelector(store => store.socket);

    const isOnline = onlineUsers.includes(item._id);

    return (
        <Link to={`/message/${item._id}`} onClick={() => setShowProfile(false)}>
            <div className='flex justify-center items-center gap-4 border-b-2 py-2'>
                <div >
                    {item?.profilePic ? (
                        <img className='w-10 h-10 rounded-[50%]' src={item.profilePic} alt='User' />
                    ) : (
                        <div className='flex justify-center items-center w-10 h-10 rounded-[50%] bg-gray-300'>
                            {item.name[0]}
                        </div>
                    )}
                </div>

                <div className='flex-[3] flex-col justify-start items-start gap-2'>
                    <h5 className='text-sm'>{item.name}</h5>
                    <div className='flex items-center gap-1'>
                        {isOnline ? (
                            <>

                                <span className='text-xs text-green-500'>Online</span>
                            </>
                        ) : (
                            <span className='text-xs text-gray-400'>Offline</span>
                        )}
                    </div>
                </div>

            </div>
        </Link>
    )
}

export default ChatCard