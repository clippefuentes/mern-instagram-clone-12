import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from 'materialize-css'

import { UserContext } from '../../App'

const Login = () => {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const login = async () => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        console.log(emailRegex.test(email))
        console.log(email)
        try {
            if (!emailRegex.test(email)) {
                M.toast({
                    html: "Input email properly",
                    classes: "red darker-3"
                })
            } else {
                const res = await fetch('/signin', {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        password, email
                    })
                })
                const data = await res.json()
                if (data.error) {
                    M.toast({
                        html: data.error,
                        classes: "red darker-3"
                    })
                } else {
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user})
                    M.toast({
                        html: "Signed in",
                        classes: "green darken-1"
                    })
                    navigate('/')
                }
                console.log(data)
            }
        } catch(err) {
            M.toast({ html: err.m})
        }
    }

    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2 className="brand-logo"> Clynestagram </h2>
                <input type="email" placeholder="Email" value={email}
                    onChange={(e) => { setEmail(e.target.value)}}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value)}}/>
                <button className="btn waves-effect waves-light blue darken-1" type="submit" name="action" onClick={login}>
                    Login
                </button>
                <h5>
                    <Link to="/signup">Want to create an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Login