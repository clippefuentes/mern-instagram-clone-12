import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from 'materialize-css'

const { REACT_APP_CLOUD_NAME, REACT_APP_UPLOAD_PRESET } = process.env

const Signup = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState('')

    const uploadPic = async () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", REACT_APP_UPLOAD_PRESET)
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${REACT_APP_CLOUD_NAME}/image/upload`, {
            method: 'post',
            body: data
        })
        const newData = await uploadRes.json()
        return newData.url
    }

    const PostData = async () => {
        let imageUrl = null
        let bodyToPost = {  name, password, email }
        M.toast({
            html: "Please wait, signing up",
            classes: "Blue",
            displayLength: 5000
        })

        if (image) {
            imageUrl = await uploadPic()
            bodyToPost['url'] = imageUrl
        } 
        
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
                const res = await fetch('/signup', {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      ...bodyToPost
                    })
                })
                const data = await res.json()
                if (data.error) {
                    M.toast({
                        html: data.error,
                        classes: "red darker-3"
                    })
                } else {
                    M.toast({
                        html: data.message,
                        classes: "green darken-1"
                    })
                    navigate('/login')
                }
                console.log(data)
            }
        } catch (err) {
            M.toast({ html: err.m })
        }


    }

    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2 className="brand-logo"> Clynestagram </h2>
                <input type="text" placeholder="Name" value={name} onChange={(e) => { setName(e.target.value) }} />
                <input type="email" placeholder="Email" value={email}
                    onChange={(e) => { setEmail(e.target.value) }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                <div className="file-field input-field">
                    <div className="btn  blue darken-1">
                        <span>Upload Profile Picture</span>
                        <input type="file" onChange={(e) => { console.log('e.target.files:', e.target.files); setImage(e.target.files[0]) }} />
                    </div>
                    <div className="file-path-wrapper">
                        <input
                            className="file-path validate" type="text"
                        />
                    </div>
                </div>
                <button className="btn waves-effect waves-light blue darken-1" type="submit" name="action" onClick={PostData}>
                    Sign Up
                </button>
                <h5>
                    <Link to="/login">Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup