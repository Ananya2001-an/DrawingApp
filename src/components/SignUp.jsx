import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { AuthUse } from '../contexts/AuthContext'
import { Container } from 'react-bootstrap';
import { Link, useNavigate} from 'react-router-dom';

export default function SignUp() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = AuthUse()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        if(passwordRef.current.value !== passwordConfirmRef.current.value)
        {
            return setError('Passwords don\'t match')
        }
        
        try{
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            setLoading(false)
            navigate("/login")
        }catch(error){
            setError('Failed to create an account')
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
            <h2 className='text-center mb-4'>Sign Up</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>

            <Form.Group id="email" className='mb-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control style={{border:"1px solid lightblue"}}
                type="email" ref={emailRef} required></Form.Control>
            </Form.Group>

            <Form.Group id="password" className='mb-2'>
                <Form.Label>Password</Form.Label>
                <Form.Control style={{border:"1px solid lightblue"}}
                type="password" ref={passwordRef} required></Form.Control>
            </Form.Group>

            <Form.Group id="password-confirm" className='mb-2'>
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control style={{border:"1px solid lightblue"}}
                type="password" ref={passwordConfirmRef} required></Form.Control>
            </Form.Group>
            
            <Button disabled={loading} type='submit' className="w-100 mt-4">Sign Up</Button>
            </Form>
            </Card.Body>
        </Card>
        <div className='w-100 text-center mt-2'>
            Already have an account? <Link to="/login" style={{color:"lightblue"}}>Log In</Link>
        </div>
        </div>
    </Container>
  )
}