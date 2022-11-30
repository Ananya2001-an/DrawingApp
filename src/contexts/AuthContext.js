import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'

//create context allows us to send some context to all child components
//which can be then accessed usung the useContext hook
//if inside a function component but inside a class component we need to 
//use <Context.Consumer/> and wrap everything inside it where we will 
//actually use the context and manipulate the JSX accordingly   
const AuthContext = React.createContext()

export function AuthUse(){
   return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [email, setEmail] = useState("")

    function signup(email, password){
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout(email){
        return auth.signOut(email)
    }

    function forgotpassword(email){
        return auth.sendPasswordResetEmail(email)
    }

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user => {
            // console.log(user)
            setCurrentUser(user)
            setEmail(user.email)
        })

        //return statement is useEffect's cleanup that is if the useEffect is
        //triggered again then it will first call
        //the return statement, this is useful for removing any past API being
        //called or an eventListener being created again 
        return unsubscribe
    },[])

    const value ={currentUser, signup, login, logout, forgotpassword, email}

  return (
    // value will be shared with all children
    <AuthContext.Provider value = {value}>
        {children}        
    </AuthContext.Provider>
  )
}