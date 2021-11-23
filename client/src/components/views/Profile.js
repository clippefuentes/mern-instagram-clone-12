import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
const { REACT_APP_CLOUD_NAME, REACT_APP_UPLOAD_PRESET } = process.env

const Profile = () => {
    const { state, dispatch } = useContext(UserContext)
    const [posts, setPosts] = useState([])
    const [image, setImage] = useState('')

    useEffect(() => {
        (async () => {
            const res = await fetch('/myPosts', {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
            const resJson = await res.json()
            const myPosts = resJson.posts
            setPosts(myPosts)
        })()
    }, [])

    const updatePhoto = async () => {
        const newProfilePicUrl = await uploadPic()
        const updatePicUser = await fetch('/updatePic', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                url: newProfilePicUrl
            })
        })
        const updatePicUserJson = await updatePicUser.json()
        console.log('updatePicUserJson', updatePicUserJson)
        localStorage.setItem("user", JSON.stringify({
            ...state,
            url: updatePicUserJson.currentUser.url
        }))
        dispatch({ 
            type: "UPDATE_PROFILE",
            payload: updatePicUserJson.currentUser.url
        })
        setImage(null)
    }

    const uploadPic = async () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", REACT_APP_UPLOAD_PRESET)
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${REACT_APP_CLOUD_NAME}/image/upload`, {
            method: 'post',
            body: data
        })
        const newData = await uploadRes.json()
        return newData.url || undefined
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-around",
            }}
        >
            <div style={{
                margin: "18px 0px",
                borderBottom: '1px solid grey'
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                }}>
                    <div>
                        <img
                            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                            src={state ? state.url : "Loading"}
                        />
                    </div>
                    <div>
                        <h4> {state ? state.name : 'Loading'}  </h4>
                        <h5> {state ? state.email : 'Loading'}  </h5>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '108%'
                        }}>
                            <h6>{posts.length} post</h6>
                            <h6>{state && state.followers && state.followers.length || 0} followers</h6>
                            <h6>{state && state.following && state.following.length || 0} following</h6>
                        </div>
                    </div>
                </div>
                {
                    image ? (
                        <button className="btn waves-effect waves-light blue darken-1" type="submit" name="action"
                            onClick={() => {
                                updatePhoto()
                            }}
                            style={{ margin: '10px 0px 10px 30px' }}
                        >
                            Update
                        </button>
                    ) : ''
                }

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
            </div>

            <div className="gallery">
                {
                    posts.map(p => {
                        return (
                            <img key={p._id} className="item" src={`${p.photo}`} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile