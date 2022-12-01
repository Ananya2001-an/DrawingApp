import React, { useState, useEffect } from 'react';
import { Button, Container, ButtonGroup, Form, Carousel, Toast, ToastContainer, Spinner} from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import { AuthUse } from '../contexts/AuthContext';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import { fabric } from 'fabric';
import {Trash, Save, Camera} from "react-bootstrap-icons"
import { SketchPicker } from 'react-color'
import reactCSS from 'reactcss'
import { db } from '../firebase';
import {
    collection,
    addDoc, getDocs
  } from "firebase/firestore";
import {saveAs} from 'file-saver'

export default function HomePage(){
    const {currentUser, logout, email} = AuthUse()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [imageUrls, setImageUrls] = useState([]);
    const [show, setShow] = useState(false)
    const [showSaveToast, setShowSaveToast] = useState(false);
    const [showClearToast, setShowClearToast] = useState(false);
    const [showSpinner, setShowSpinner] = useState(true)
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

   useEffect(()=>{
    const getImages = async()=>{
        const imagesRef = collection(db, `${email}`)
        const data = await getDocs(imagesRef);
        setImageUrls(data.docs.map((doc) => (doc._document.data.value.mapValue.fields.url.stringValue)));
    } 
    getImages()
   },[email])
    
    const styles = reactCSS({
        'default': {
          color: {
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: `rgba(${color.r }, ${ color.g }, ${color.b }, ${color.a })`,
          },
          swatch: {
            alignSelf:"center",
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
        setShowClearToast(true)
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
    
    const addText = ()=>{
        var text = new fabric.IText("Type here...", {
            fontSize: 25,
            top: 10,
            left: 10,
            fontFamily: 'calibri'
          });
          
        editor.canvas.add(text);
    }

    const saveImage = async ()=>{
        setShowSpinner(false)
        let href = editor.canvas.toDataURL({
            format: "png"
        });
        const imagesRef = collection(db, `${email}`)
        await addDoc(imagesRef, {url: href}); 
        setImageUrls(prev => [...prev, href])
        let blob = new Blob([editor.canvas.toDataURL()], {type: "octet/stream"});
        saveAs(blob, "canvas.png");
        setShowSpinner(true)
        setShowSaveToast(true)
    }

    if(currentUser != undefined)
    {
        return(
            <div className='position-relative'>
            <Spinner style={{position: "fixed", top: "50%", left: "50%"}}
             animation='grow' variant='info' size='lg' hidden={showSpinner}/>
            <ToastContainer className="p-3" position='top-end'>
                <Toast bg='light' show={showSaveToast} onClose={()=> setShowSaveToast(false)}>
                <Toast.Header>
                    👩‍🎨
                    <strong className="me-auto">Saved</strong>
                    <small className='text-muted'>just now</small>
                </Toast.Header>
                <Toast.Body>Woohoo, you just saved a new design in "Make it." ! You can find your saved designs below.</Toast.Body>
                </Toast>

                <Toast bg='light' show={showClearToast} onClose={()=> setShowClearToast(false)}>
                <Toast.Header>
                    👩‍🎨
                    <strong className="me-auto">Cleared</strong>
                    <small className='text-muted'>just now</small>
                </Toast.Header>
                <Toast.Body>The board is all cleared now! Keep drawing.</Toast.Body>
                </Toast>
            </ToastContainer>
           <header>
            <Container className='d-flex p-2' style={{justifyContent:"space-between", alignItems:"center"}}>
                <h1>Make it<span style={{color:"lightblue"}}>.</span>👩‍🎨</h1>
                {email && <Button variant='light' onClick={handleLogOut}>LogOut  <span style={{textDecoration:"underline",
                fontStyle:"italic"}}>{email}</span>👋</Button>}
            </Container>
           </header>
            <Container className='draw-area'>
                <div style={{borderBottom:"1px solid lightblue", display:'flex',
                justifyContent:"space-between", alignItems:'center'}}>
                <ButtonGroup size="md" className='mb-4'>
                <Button  style={{background:"transparent", border:"1px solid lightblue", color:"black"}} onClick={onAddCircle}>Circle</Button>
                <Button  style={{background:"transparent", border:"1px solid lightblue", color:"black"}} onClick={onAddRectangle}>Rectangle</Button>
                <Button  style={{background:"transparent", border:"1px solid lightblue", color:"black"}} onClick={onAddLine}>Line</Button>
                <Button  style={{background:"transparent", border:"1px solid lightblue", color:"black"}} onClick={addText}>Text</Button>
                <Button style={{background:"transparent", border:"1px solid lightblue", color:"black"}}> 
                <label for="imageUpload" style={{cursor:"pointer"}}><Camera size='22px'/></label>
                <Form.Control type='file' id="imageUpload" onChange={(event) => {
                    addImage(event.target.files[0])
                    }} className='w-100 rounded-0'></Form.Control>
               </Button>
                <Button style={{background:"transparent", border:"1px solid lightblue", color:"black"}}>
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
                <Button style={{background:"transparent", border:"1px solid lightblue", color:"black"}} onClick={onClear}><Trash/></Button>
                <Button style={{background:"transparent", border:"1px solid lightblue", color:"black"}} onClick={saveImage}><Save/></Button>
                </ButtonGroup>
                </div>
                <FabricJSCanvas className="sample-canvas" onReady={onReady} />
            </Container>
            {
                imageUrls.length != 0 &&
                <Container>
                <h3 className='text-center p-4'>Your Designs<span style={{color:"lightblue"}}>.</span>🎨</h3>
                <Carousel slide={true} variant="dark">
                {
                    imageUrls.map(img=>{
                        return <Carousel.Item>
                        <img src={img}
                        />
                        </Carousel.Item>
                    })
                }
                </Carousel>
                </Container>
            }
            </div>
        )
    
    }
    else{
        navigate('/login')
    }
}