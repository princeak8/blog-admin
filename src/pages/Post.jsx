/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Request } from "../api";

import PostComponent from "../components/Post";

import { getUser, logout } from "../localstorage/User";

const Post = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({loaded: false, post: '', error: '', actionError: ''})
    const { postId } = useParams();

    useEffect(() => {
        if(!state.loaded) getPost();
    },[]);

    const {token, domain} = getUser();
    const auth = { token, domain};

    const publish = async () => {
        //Publish post
        if(window.confirm("You are about to Publish this post.. Go Ahead?")) {
            await performAction('publish');
        }
    }

    const visibility = async () => {
        //Toggle post visibility
        if(window.confirm("Are you sure you want to change the visibility of this post?")) {
            await performAction('visibility');
        }
    }

    const performAction = async (action) => {
        let res = '';
        switch(action) {
            case 'publish' : res = await Request('GET', '/post/toggle_publish/'+postId, auth); break;
            case 'visibility' : res = await Request('GET', '/post/toggle_visibility/'+postId, auth); break;
            default : res = '';
        }
        if(res !== '') {
            (res.status===200) ? setState({...state, post: res.data}) : setState({...state, actionError: res.message})
        }
    } 
    

    const getPost = async () => {
        const res = await Request('GET', '/post/'+postId, auth);
        if(res.status===200) {
            setState({...state, loaded: true, post: res.data})
        }else{
            if(res.status===401) logout(); navigate('/login');
            setState({...state, loaded: true, error: res.message})
        }
    }


    //if(state.loaded) console.log('post: ', state.post); console.log('error: ', state.error);
    const displaybtn = () => {
        if(state.loaded && state.error === '') {
            if(!state.post.published) {
                return(
                        <button className="btn btn-success" onClick={publish}>Publish</button>
                );
            }else{
                if(state.post.visible) {
                    return (<button className="btn btn-danger" onClick={visibility}>Hide</button>); 
                }else{
                    return (<button className="btn btn-success" onClick={visibility}>Make Visible</button>);
                }
            }
        }
    }
    const renderContent = () => {
        if(state.loaded) {
            if(state.error !== '') {
                return (
                    <p className="alert alert-danger">{state.error}</p>
                );
            }else{

                return (
                            <div>
                                {state.actionError !== '' && (<p className="alert alert-danger">{state.actionError}</p>)}
                                <div style={{float: "right", marginRight: "10%", marginTop: "2em"}} >
                                    <Link to={"/edit_post/"+postId} className="btn btn-warning">Edit</Link>
                                    {displaybtn()}
                                </div>
                                <PostComponent post={state.post} />
                            </div>
                        );
            }
        }else{
            return (<div style={{marginTop:'5em', textAlign: 'center'}}>LOADING...</div>);
        }
    }

  return (
    <>
        {renderContent()}
    </>
  );
};

export default Post;
