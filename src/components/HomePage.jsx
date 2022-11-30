import React, { useState } from 'react';
import { Button, Container, Alert, Navbar, Row } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import { AuthUse } from '../contexts/AuthContext';

export default function HomePage(){
    const {currentUser, logout, email} = AuthUse()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    
    async function handleLogOut(){
        try{
            setError('')
            await logout(currentUser.multiFactor.user.email)
            navigate("/login")
         }catch{
            setError('Failed to log out')
         }
         
    }
    return(
       <header>
        <Container className='d-flex' style={{justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid black"}}>
            <h1>Make it.</h1>
            <Button variant='light' onClick={handleLogOut}>LogOut <span style={{textDecoration:"underline", fontStyle:"italic"}}>{email}</span></Button>
        </Container>
       </header>

    )

}