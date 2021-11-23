import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { useNavigate } from 'react-router'

const NavBar = () => {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const renderList = () => {
        if (state) {
            return [
                <li key="profile"><Link to="/profile">Profile</Link></li>,
                <li key="/newPost"><Link to="/newPost">Create Post</Link></li>,
                <li key="/followersPost"><Link to="/followersPost">My Followers Post</Link></li>,
                <li key="/logout">
                    <button
                        className="btn waves-effect waves-light red darken-3" type="submit" name="action"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            navigate('/login')
                        }}
                    >
                        Logout
                    </button>
                </li>
            ]
        } else {
            return [
                <li key="/login"><Link to="/login">Login</Link></li>,
                <li key="/signup"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/login"} className="brand-logo left">Clynestagram</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {
                        renderList()
                    }

                </ul>
            </div>
        </nav>
    )
}

export default NavBar