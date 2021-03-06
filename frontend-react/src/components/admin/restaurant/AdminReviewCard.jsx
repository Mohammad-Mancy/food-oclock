import React from 'react'
import { MdDone, MdClose } from 'react-icons/md'

const AdminReviewCard = ({onDelete,onClick,user_name,restaurant_name,rate,description}) => {
  return (
    <>
    <div className="admin-review-card">
        <span>{user_name}</span>
        <span>{restaurant_name}</span>
        <span>{rate}</span>
        <span>{description}</span>
        <span>
            <button 
            className='review-approve-btn' 
            onClick={onClick}
            ><MdDone/></button>
            <button 
            className='review-disapprove-btn'
            onClick={onDelete}
            ><MdClose/></button>
        </span>
    </div>
    <hr className="user-card-devider" />
    </>
  )
}

export default AdminReviewCard