import { useEffect, useState } from "react";
// import styles from "./css/Dashboard.module.css";
// import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PostsSection from "../components/PostsSection";
import { Request } from "../api";
import { getUser, logout } from "../localstorage/User";

let count = 0;
const Dashboard = () => {
    count++;
    console.log("rendered",count);
    const navigate = useNavigate();
    const [state, setState] = useState({activeTab: "public", loaded: false, posts: '', error: '', actionError: ''})
  
    // const dispatch = useDispatch();

    const {token, domain} = getUser();
    const auth = { token, domain};
    //const posts = useSelector((state) => state.postsDisplay.allPosts);
    useEffect(() => {
        if(!state.loaded) getPosts();
    });
    //console.log('posts: ', posts);
    //console.log('unpublished', unpublished);

    const getPosts = async () => {
        const res = await Request('GET', '/post/all', auth);
        if(res.status===200) {
            setState({...state, loaded: true, posts: res.data})
        }else{
            if(res.status===401) logout(); navigate('/login');
            setState({...state, loaded: true, error: res.message})
        }
    }
    

  const switchTab = (tab) => {
      //console.log('tab: ', tab);
      setState({...state, activeTab: tab});
  }

  const getStyle = (tab, last=false) => {
      return (tab===state.activeTab) ? selectedTabStyle : (!last) ? tabStyle : {cursor: "pointer"};
  }

  const renderContent = () => {
        if(state.loaded) {
            if(state.error !== '') {
                return (
                    <p className="alert alert-danger">{state.error}</p>
                );
            }else{
                const publicPosts = state.posts.filter((post) => (post.published && post.visible));
                const unpublished = state.posts.filter((post) => (!post.published));
                const hidden = state.posts.filter((post) => (!post.visible));
                // console.log('public posts: ', publicPosts.length);
                // console.log('hidden posts: ', hidden.length);
                // console.log('unpublished posts: ', unpublished.length);
            
                switch(state.activeTab) {
                    case 'public' : return <PostsSection posts={publicPosts} publish={publish} visibility={visibility}/>; 
                    case 'unpublished' : return <PostsSection posts={unpublished} publish={publish} visibility={visibility}/>;
                    case 'hidden' : return <PostsSection posts={hidden} publish={publish} visibility={visibility}/>; 
                    default : return <PostsSection posts={publicPosts}/>;
                }
            }
        }else{
            return (<div style={{marginTop:'5em', textAlign: 'center'}}>LOADING...</div>);
        }
  }

  const publish = async (postId) => {
    //Publish post
    if(window.confirm("You are about to Publish this post.. Go Ahead?")) {
        await performAction('publish', postId);
    }
}

const visibility = async (postId) => {
    //Toggle post visibility
    if(window.confirm("Are you sure you want to change the visibility of this post?")) {
        await performAction('visibility', postId);
    }
}

const performAction = async (action, postId) => {
    let res = '';
    switch(action) {
        case 'publish' : res = await Request('GET', '/post/toggle_publish/'+postId, auth); break;
        case 'visibility' : res = await Request('GET', '/post/toggle_visibility/'+postId, auth); break;
        default : res = '';
    }
    if(res !== '') {
        if(res.status===200) {
            state.posts.forEach((post, index) => {
                if(post.id===res.data.id) {
                    console.log('replace data');
                    state.posts[index] = res.data;
                }
            })
            setState({...state, posts: state.posts}); 
        }else{
            setState({...state, actionError: res.message})
        }
    }
}

  const myStyles = {
      tabStyle: {borderRight:"2px outset #000", width:"35%", textAlign: "center", cursor: "pointer", marginRight: "5%"},
      selectedTabStyle: {width:"25%", textAlign: "center", backgroundColor: "grey", marginRight: "5%"}
  };

  const { tabStyle, selectedTabStyle } = myStyles;

  return (
    <div className="flex flex-col w-full h-full">
        <div className="mb-[1em]">
            <h2 className="mb-[1em] mt-5 ml-4">Dashboard</h2>
            <h4 className="ml-[5%] underline">
                <Link to="/posts/add">New Post</Link>
            </h4>
        </div>
        <div className="flex flex-row">
            <p style={getStyle('public')} onClick={() => switchTab('public')}>
                Public
            </p>
            <p style={getStyle('unpublished')} onClick={() => switchTab('unpublished')}>
                Unpublished
            </p>
            <p style={getStyle('hidden', true)} onClick={() => switchTab('hidden')}>
                Hidden
            </p>
        </div>
        
        {renderContent()}
    </div>
  );
};

export default Dashboard;
