import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState('')

    const { REACT_APP_CLOUD_NAME, REACT_APP_UPLOAD_PRESET } = process.env

    const PostData = async () => {
        try {
            console.log('image', image)
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", REACT_APP_UPLOAD_PRESET)
            const res = await fetch(`https://api.cloudinary.com/v1_1/${REACT_APP_CLOUD_NAME}/image/upload`, {
                method: 'post',
                body: data
            })
            const newData = await res.json()
            console.log('newData:', newData)
            const createPostRes = await fetch('/createPost', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    title, caption, url: newData.url
                })
            })
            const postedData = await createPostRes.json()
            if (postedData.error) {
                M.toast({
                    html: data.error,
                    classes: "red darker-3"
                })
            } else {
                M.toast({
                    html: "Data Posted Successfully",
                    classes: "green darken-1"
                })
                navigate('/')
            }
        } catch (err) {
            M.toast({
                html: err.message,
                classes: "red darker-3"
            })
            console.error(err)
        }
    }

    return (
        <div className="card input-div"
            style={{
                margin: "10px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"
            }}
        >
            <input type="text" placeholder="Title" onChange={(e) => { setTitle(e.target.value) }} />
            <input type="text" placeholder="Caption" onChange={(e) => { setCaption(e.target.value) }} />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => { console.log('e.target.files:', e.target.files); setImage(e.target.files[0]) }} />
                </div>
                <div className="file-path-wrapper">
                    <input
                        className="file-path validate" type="text"
                    />
                </div>
            </div>
            <button
                className="btn waves-effect waves-light blue darken-1" type="submit" name="action"
                onClick={PostData}
            >
                Create Post
            </button>
        </div>
    )
}

export default CreatePost