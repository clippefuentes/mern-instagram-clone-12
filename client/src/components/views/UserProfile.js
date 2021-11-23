import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../App'

const UserProfile = () => {
    const { state, dispatch } = useContext(UserContext)
    const [showFollow, setShowFollow] = useState(true)
    const [posts, setPosts] = useState([])
    const [userProfile, setUserProfile] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        (async () => {
            const res = await fetch(`/user/${id}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                }
            })
            const resJson = await res.json()
            const { user, posts: newPosts } = resJson
            
            setUserProfile(user)
            setPosts(newPosts)
        })()
    }, [])

    useEffect(() => {
        if (userProfile && userProfile.followers && state._id) {
            if (userProfile.followers.includes(state._id)) {
                setShowFollow(false)
            } else {
                setShowFollow(true)
            }
        }
    }, [state, userProfile])

    const followUser = async () => {
        const res = await fetch('/follow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: id,
            })
        })

        const resJson = await res.json()
        const { currentUser, followedUser } = resJson
        dispatch({
            type: "UPDATE", payload: {
                following: currentUser.following,
                followers: currentUser.followers,
            }
        })
        localStorage.setItem("user", JSON.stringify(currentUser))
        setUserProfile(followedUser)
        setShowFollow(false)
        console.log('Res ', resJson)
    }

    const unfollowUser = async () => {
        const res = await fetch('/unfollow', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: id,
            })
        })

        const resJson = await res.json()
        const { currentUser, unfollowedUser } = resJson
        dispatch({
            type: "UPDATE", payload: {
                following: currentUser.following,
                followers: currentUser.followers,
            }
        })
        localStorage.setItem("user", JSON.stringify(currentUser))
        setUserProfile(unfollowedUser)
        console.log('Res ', resJson)
        setShowFollow(true)
    }

    return (
        <>
            {
                !userProfile ? "Loading" : (
                    <div
                        style={{
                            maxWidth: "550px",
                            margin: "0px auto"
                        }}
                    >
                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",
                            margin: "18px 0px",
                            borderBottom: '1px solid grey'
                        }}>
                            <div>
                                <img
                                    style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                    src={userProfile.url}
                                />
                            </div>
                            <div>
                                <h4> {userProfile ? userProfile.name : 'Loading'}  </h4>
                                <h5> {userProfile ? userProfile.email : 'Loading'}  </h5>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '108%'
                                }}>
                                    <h6>{posts.length} post</h6>
                                    <h6>{userProfile.followers.length || 0} followers</h6>
                                    <h6>{userProfile.following.length || 0} following</h6>
                                </div>
                                {
                                    showFollow ? (
                                        <button style={{margin: '10px'}} className="btn waves-effect waves-light blue darken-1" type="submit" name="action" onClick={followUser}>
                                            Follow
                                        </button>
                                    ) : (
                                        <button style={{margin: '10px'}} className="btn waves-effect waves-light blue darken-1" type="submit" name="action" onClick={unfollowUser}>
                                            Unfollow
                                        </button>
                                    )
                                }


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

        </>

    )
}

export default UserProfile