import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { AuthUse } from '../contexts/AuthContext'
import { Container } from 'react-bootstrap';
import { Link,  useNavigate } from 'react-router-dom';

export default function LogIn() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = AuthUse()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        
        try{
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            setLoading(false)
            navigate("/home")
        }catch(error){
            setError('Failed to log in')
            setLoading(false)
        }
        
    }

    return (
        <Container className='d-flex align-items-center justify-content-center'
        style={{minHeight: "100vh"}}>
        <div className='w-100' style={{maxWidth: "400px"}}>
        <h4 className='text-center p-4'>Make it<span style={{color:"lightblue"}}>.</span>👩‍🎨</h4>
        <Card style={{border:"1px solid lightblue"}}>
        <Card.Body>
            {/* <p>{currentUser.multiFactor.user.email}</p> */}
            <h2 className='text-center mb-4'>Log In</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className='mb-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control style={{border:"1px solid lightblue"}} type="email"
                ref={emailRef} required></Form.Control>
            </Form.Group>

            <Form.Group id="password" className='mb-2'>
                <Form.Label>Password</Form.Label>
                <Form.Control style={{border:"1px solid lightblue"}} type="password"
                ref={passwordRef} required></Form.Control>
            </Form.Group>
            
            <Button disabled={loading} type='submit' className="w-100 mt-4">Log In</Button>
            </Form>
            <Link style={{color:"lightblue"}} className='w-100 text-center' to="/forgotpassword"><p className='mt-4'>Forgot Password?</p></Link>
        </Card.Body>
        </Card>
        <div className='w-100 text-center mt-2'>
            Don't have an account? <Link to="/" style={{color:"lightblue"}}>Sign Up</Link>
        </div>
        </div>
    </Container>
  )
}