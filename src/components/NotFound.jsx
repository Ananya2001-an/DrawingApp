import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function NotFound(){
    const navigate = useNavigate()
    useEffect(()=>{
        setTimeout(()=>{navigate("/",{state:{err: "Error finding page"}})}, 3000)
    },[])
    return (
        <>
            <h1>Oops ! Not found...</h1>
        </>
    )
}