import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { AuthUse } from '../contexts/AuthContext'
import { Container } from 'react-bootstrap';
import { Link, useNavigate} from 'react-router-dom';

export default function ForgotPassword() {

    const emailRef = useRef()
    const navigate = useNavigate()
    const { forgotpassword } = AuthUse()
    const [error, setError] = useState()
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()
        
        try{
            setError('')
            setLoading(true)
            await forgotpassword(emailRef.current.value)
            setLoading(false)
            setMessage('Check inbox for further instructions')
        }catch(error){
            setError('Failed to reset password')
            setLoading(false)
        }
        
    }

    return (
        <Container className='d-flex align-items-center justify-content-center'
        style={{minHeight: "100vh"}}>
        <div className='w-100' style={{maxWidth: "400px"}}>
        <Card style={{border:"1px solid lightblue"}}>
            <Card.Body>
            {/* <p>{currentUser.multiFactor.user.email}</p> */}
            <h2 className='text-center mb-4'>Reset Password</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            {message && <Alert variant='success'>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control style={{border:"1px solid lightblue"}} type="email"
                    ref={emailRef} required></Form.Control>
                </Form.Group>
                
                <Button disabled={loading} type='submit' className="w-100 mt-4">Reset</Button>
                <Link to="/login" style={{color:"lightblue"}}
                className='text-center w-100'><p className='mt-4'>Log In</p></Link>
            </Form>
            </Card.Body>
        </Card>
        <div className='w-100 text-center mt-2'>
            Want to create a new account? <Link style={{color:"lightblue"}} to="/">Sign Up</Link>
        </div>
        </div>
    </Container>
  )
}