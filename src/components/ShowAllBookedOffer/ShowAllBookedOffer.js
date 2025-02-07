import React, { useEffect, useState } from 'react';

const ShowAllBookedOffer = (props) => {
    const [bookings, setBookings] = useState([]);
    const [approvableTrip, setApprovableTrip] = useState({});
    const { _id, name, email, date, selectedOffer, totalCost, status,paymentStatus } = props.allBookedOffer;
    useEffect(() => {
        fetch("https://trip-tuck-2-server.onrender.com/bookings")
            .then(res => res.json())
            .then(data => {
                setBookings(data)
                data.map(booking => {
                    if (booking._id === _id) {
                        setApprovableTrip(booking);
                    }
                })
            });
    }, [bookings,_id])
    const handleStatusUpdating = id => {
        if(!paymentStatus||paymentStatus==='unpaid'){
            alert("Payment is not completed");
            return
        }
        approvableTrip.status = "approved";

        fetch(`https://trip-tuck-2-server.onrender.com/bookings/${id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(approvableTrip)
        })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged) {
                    alert("Status Updated To Approved");
                    window.location.reload();

                }
            })
    }
    const handleDeletingBooking = id => {
        const isConfirmed = window.confirm("Are you sure want to delete ? ")
        if (isConfirmed) {
            fetch(`https://trip-tuck-2-server.onrender.com/bookings/${id}`, {
                method: "delete"
            })
                .then(res => res.json())
                .then(data => {
                    if (data.deletedCount === 1) {
                        alert("Successfully Deleted");
                        window.location.reload();

                    }
                })
        }

    }
    return (
        <tr>




            <td>{name}</td>
            <td>{email}</td>
            <td>{date}</td>
            <td>{selectedOffer}</td>
            <td>{totalCost}</td>
            <td>{paymentStatus==='paid'?"Paid":'Unpaid'}</td>
            <td>{status}</td>
            <td><button className="btn btn-primary" onClick={() => handleStatusUpdating(_id)}>Ok</button></td>

            <td><button className="btn btn-danger" onClick={() => {
                handleDeletingBooking(_id)
            }}>Delete</button></td>




        </tr>
    );
};

export default ShowAllBookedOffer;