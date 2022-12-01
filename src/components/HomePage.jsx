import React, { useState } from 'react';
import { Button, Container, ButtonGroup, Form} from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import { AuthUse } from '../contexts/AuthContext';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { fabric } from 'fabric';
import {Trash, Save} from "react-bootstrap-icons"
import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'

export default function HomePage(){
    const {currentUser, logout, email} = AuthUse()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [show, setShow] = useState(false)

    const [color, setColor] = useState({
        r: '241',
        g: '112',
        b: '19',
        a: '1',
    })
    const handleClick = () => {
        setShow(!show)
    };
    const handleClose = () => {
        setShow(false)
    };
    
    const handleChange = (color) => {
    setColor(color.rgb)
    };
    
    const styles = reactCSS({
        'default': {
          color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: `rgba(${color.r }, ${ color.g }, ${color.b }, ${color.a })`,
          },
          swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
          },
          popover: {
            position: 'absolute',
            zIndex: '2',
          },
          cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
        },
      });
  
    const { editor, onReady } = useFabricJSEditor()

    const onAddCircle = () => {
        editor?.setFillColor(`rgba(${color.r},${color.g},${color.b},${color.a})`)
        editor?.addCircle()
    }
    const onAddRectangle = () => {
        editor?.setFillColor(`rgba(${color.r},${color.g},${color.b},${color.a})`)
        editor?.addRectangle()
    }

    const onAddLine = ()=>{
        editor?.addLine()
    }

    const onClear = ()=>{
        editor?.deleteAll()
    }

    async function handleLogOut(){
        try{
            setError('')
            await logout(currentUser.multiFactor.user.email)
            navigate("/login")
         }catch{
            setError('Failed to log out')
         }
         
    }
    
    const addImage = (url)=>{
        fabric.Image.fromURL(URL.createObjectURL(url), function(oImg) { 
            editor.canvas.add( oImg )
        })
    } 
    
    const saveImage =()=>{
        document.getElementsByClassName('sample-canvas')[0].toBlob((blob)=>{
            console.log(blob)
        })
    }

    return(
        <>
       <header>
        <Container className='d-flex' style={{justifyContent:"space-between", alignItems:"center"}}>
            <h1>Make it<span style={{color:"lightblue"}}>.</span></h1>
            {email && <Button variant='light' onClick={handleLogOut}>LogOut <span style={{textDecoration:"underline",
            fontStyle:"italic"}}>{email}</span></Button>}
        </Container>
       </header>
        <Container className='draw-area'>
            <div style={{borderBottom:"1px solid lightblue", display:'flex',
            justifyContent:"space-between", alignItems:'center'}}>
            <ButtonGroup variant='light' size="md" className='mb-4'>
            <Button variant='light' onClick={onAddCircle}>Circle</Button>
            <Button variant='light' onClick={onAddRectangle}>Rectangle</Button>
            <Button variant='light' onClick={onAddLine}>Line</Button>
            <Button variant='light'> 
            <Form.Control type='file' onChange={(event) => {
                addImage(event.target.files[0])
                }} className='w-100 rounded-0'></Form.Control>
           </Button>
            <Button variant='light'>
                <div style={ styles.swatch } onClick={ handleClick }>
                <div style={ styles.color } />
                </div>
                { show ? <div style={ styles.popover }>
                <div style={ styles.cover } onClick={ handleClose }/>
                <SketchPicker color={ color } onChange={ handleChange } />
                </div> : null }
            </Button>
            </ButtonGroup>
            
            <ButtonGroup size="md" className='mb-4'>
            <Button variant='danger' onClick={onClear}><Trash/></Button>
            <Button variant='success' onClick={saveImage}><Save/></Button>
            </ButtonGroup>
            </div>
            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        </Container>
        </>
    )

}