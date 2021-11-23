import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import M from 'materialize-css'

const SubscribeUserPost = () => {
    const { state, dispatch } = useContext(UserContext)
    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
            const res = await fetch('/getUserPosts', {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
            const resJson = await res.json()
            const posts = resJson.posts
            console.log('posts:', posts)
            setData(posts)
        })();

    }, [])

    const likePost = async (item) => {
        const res = await fetch('/like', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: item._id
            })
        })
        const resJson = await res.json()
        const post = resJson.post
        const newData = data.map(item => {
            if (item._id == post._id) {
                return post
            } else {
                return item
            }
        })
        setData(newData)
    }


    const unlikePost = async (item) => {
        const res = await fetch('/unlike', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: item._id
            })
        })
        const resJson = await res.json()
        const post = resJson.post
        const newData = data.map(item => {
            if (item._id == post._id) {
                return post
            } else {
                return item
            }
        })
        setData(newData)
    }

    const makeComment = async (item, text) => {
        const res = await fetch('/comment', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: item._id,
                comment: text
            })
        })
        const resJson = await res.json()
        const post = resJson.post
        const newData = data.map(item => {
            if (item._id == post._id) {
                return post
            } else {
                return item
            }
        })
        setData(newData)
    }

    const deletePost = async (item) => {
        const res = await fetch(`/deletePost/${item._id}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
        })
        const resJson = await res.json()
        const { message, removedPost } = resJson
        if (message) {
            M.toast({
                html: message,
                classes: "green darken-1"
            })
            const newData = data.filter(item => {
                return item._id !== removedPost._id
            })
            setData(newData)
        }

    }

    return (
        <div className="home">
            {
                data.map((item) => {
                    return (
                        <div key={item._id} className="card home-card">
                            <h5 style={{
                                    padding: '5px'
                                }}><Link
                                to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : `/profile`}
                            >{item.postedBy.name}</Link>{item.postedBy._id === state._id ? (
                                <i className="material-icons"
                                    style={{ float: 'right' }}
                                    onClick={() => { deletePost(item) }}
                                >delete</i>
                            ) : ""}
                            </h5>

                            <div className="card-image">
                                <img src={`${item.photo}`} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: 'black' }}>favorite</i>
                                {
                                    item.likes.includes(state._id) ? (
                                        <i className="material-icons"
                                            style={{ color: 'black' }}
                                            onClick={() => { unlikePost(item) }}
                                        >thumb_down</i>
                                    ) : (

                                        <i className="material-icons"
                                            style={{ color: 'black' }}
                                            onClick={() => { likePost(item) }}
                                        >thumb_up</i>
                                    )
                                }

                                <h6>{item.likes ? item.likes.length : 0} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.caption}</p>
                                {
                                    item.comments.map((item, i) => {
                                        return (
                                            <h6 key={item._id}><span style={{ fontWeight: '500' }}>{item.postedBy.name}</span> {item.comment}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(item, e.target[0].value)
                                }}>
                                    <input type="text" placeholder="Add a comment" />
                                </form>

                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SubscribeUserPost