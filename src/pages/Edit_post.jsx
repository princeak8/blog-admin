/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Request } from "../api";
import {getTags, updatePost, saveTag, uploadImage } from "../api/post";
import { postActions } from "../store/postSlice";
import AddTag from "../components/Add_tag";
import { MyEditor } from "../components/common/TextEditor";
import TextInput from "../components/common/TextInput";
import FileInput from "../components/common/FileInput";
import TextArea from "../components/common/TextArea";

import { getUser, logout } from "../localstorage/User";

import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const limit = 25;

const Edit_post = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [state, setState] = useState({
                                            loaded: false, post: '', errormsg: '', errorsMsg: '', error: '', successMsg: '', tagError: '', isUploading: false, isCreatingTag: false, tags: [], modalIsShown: false, 
                                            selected_tag: [], InputKey: '', preview: '', title: '', coverImage: {}, content: '', isSubmiting: false
                                        })

    // const resetsFileInput = () => {
    //     let randomString = Math.random().toString(36);
    //     setInputKey(randomString);
    // };

    const { postId } = useParams();

    useEffect(() => {
        if(!state.loaded) getPost();
        //getTags();
    },[]);

    const {token, domain} = getUser();
    const auth = { token, domain};


    const getPost = async () => {
        const res = await Request('GET', '/post/'+postId, auth);
        if(res.status===200) {
            const response = await getTags(domain, token);
            let tagError = '';
            let allTags = {};
            if (!response.ok) {
                tagError =  response.data.error;
            }else{
                allTags = response.data.data;
            }
            const {title, preview, coverImage, content, tags} = res.data;
            // console.log("data:", content);
            // setEditorState({
            //     editorState: getContentState(state.content)   
            // });
            console.log("preview:", preview);
            setState({...state, loaded: true, post: res.data, preview, title, coverImage, content, selected_tag: tags, tags: allTags, tagError: tagError});
        }else{
            if(res.status===401) logout(); navigate('/login');
            setState({...state, loaded: true, error: [res.message]})
        }
    }

    const renderEditor = () => {
        if(state.loaded) {
            return (
                <MyEditor placeholder="The post content goes here..." onEditorStateChange={onEditorStateChange} content={state.content} classes="border-2 w-[99%] min-h-[15em]" />
            );
        }
    }

    const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // console.log('body: ', getHtml(editorState));

    const onEditorStateChange = editorState => {
        const htmlContent = getHtml(editorState);
        setState({...state, content: htmlContent});
    };

    // const getTags = async () => {
    //     const response = await getTags(domain, token);
    //     // console.log('getTags: ', response);
    //     if (!response.ok) return setState({...state, tagError: response.data.error});
    //     const tags = response.data.data;
    //     setState({...state, tags: tags});
    // };

    const handlePreview = (text) => {
        let words = state.preview.split(" ").filter(Boolean);

        if (words.length > limit) {
            console.log(words);
            setState({...state, preview: words.slice(0, limit).join(" ").toString().trim()});
        } else {
            setState({...state, preview: text.target.value});
        }
    };

    const OnTitleChange = (text) => {
        setState({...state, title: text.target.value});
    }

    // const OnBodyChange = (val) => {
    //     //console.log('body: ', val);
    //     setState({...state, content: val});
    // }

    const handleCheck = (tag) => {
        const isChecked = state.selected_tag.find((item) => item.id === tag.id);

        if (!isChecked) {
            console.log('checked');
            state.selected_tag.push(tag);
            setState({...state, selected_tag: state.selected_tag});
        } else {
            console.log('unchecked');
            const update = state.selected_tag.filter((item) => item.id !== tag.id);
            setState({...state, selected_tag: update});
        }
    };

    const handleUpload = async (image) => {
        setState({...state, isUploading: true});
        let image_to_upload = new FormData();

        image_to_upload.append("image", image);

        // console.log("image to upload", image_to_upload);

        // return;
        let accessToken = token;
        const response = await uploadImage(domain, accessToken, image_to_upload);
        if (!response.ok) {
            setState({...state, isUploading: false});
            return handleError(response.data.errors.title[0]);
        }

        setState({...state, isUploading: false, coverImage: response.data.data});
    };

    const handleSubmit = async (event) => {
        setState({...state, isSubmiting: true});
        event.preventDefault();
        const tags = [];
        state.selected_tag.map((tag) => tags.push(tag.id));
        let {title, coverImage, preview, content} = state;
        // let content = getHtml(editorState);
        console.log("content body:", content);
        const post = {post_id: postId, title, cover_photo_id: coverImage?.id, tags_id: tags, preview, content};

        // return console.log(post);

        console.log('submit post', post);

        const response = await updatePost(domain, token, post);
        setState({...state, isSubmiting: false});
        if (!response.ok) {
            return handleError(response.data.errors.title[0]);
        }

        dispatch(postActions.updatePost(response.data.data));


        handleSuccess("Updated");
        navigate('/post/'+postId);
    };

    const show_add_tag = (event) => {
        event.preventDefault();
        setState({...state, modalIsShown: true});
    };

    const hide_add_tag = () => {
        setState({...state, modalIsShown: false});
    };

    const handleCreateTag = async (tag) => {
        setState({...state, isCreatingTag: true});
        const response = await saveTag(domain, token, tag);
        if (!response.ok) {
            setState({...state, tagError: response.data.error});
            return handleError(response.data.errors.title[0]);
        }
        const createdTag = response.data.data;
        //console.log('create tag', tags);
        state.tags.push(createdTag);
        setState({...state, tags:state.tags, isCreatingTag: false});
        hide_add_tag();
    };

    const CreateTagModal = () => {
        if(state.modalIsShown) {
            return (
                <AddTag onCloseModal={hide_add_tag} onTagCreate={handleCreateTag} isCreatingTag={state.isCreatingTag} />
            );
        }
    }

    const removeCoverImage = () => {
        if(window.confirm("You are about to remove the cover image! go ahead?")) {
            setState({...state, coverImage:{}});
        }
    }

    const renderTags = () => {
        if(state.tags.length > 0) {
            return state.tags.map((tag) => {
                return (
                    <div key={tag.id}>
                        <label htmlFor={tag.id}>{tag.name}</label>
                        <input
                            checked={ state.selected_tag.find((item) => item.id === tag.id) ? true : false }
                            type="checkbox"
                            id={tag.id}
                            value={tag.id}
                            onChange={() => handleCheck(tag)}
                        />
                    </div>
                );
            });
        }
    }


    const renderCoverImage = () => {
        return (Object.values(state.coverImage).length === 0) ? 
            (   <>
                    {/* <input type="file" id="cover" onChange={(e) => handleUpload(e.target.files[0])} 
                        className="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                    /> */}
                    <FileInput 
                    className="my-[2em]" label="COVER IMAGE" inputKey={state.InputKey} onChange={(e) => handleUpload(e.target.files[0])} isUploading={state.isUploading}
                    inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                />
                </>
            ) 
            : 
            (
                <>
                    <a href={state.coverImage.url} target="_blank" rel="noreferrer"> {state.coverImage.original_filename}</a>
                    <button onClick={removeCoverImage}>Remove</button>
                </>
            )
    }

    const renderForm = () => {
        if(!state.loaded) {
            return (<p>LOADING...</p>);
        }else{
            if(state.error !== '') {
                return (<p className="alert alert-danger">{state.error}</p>);
            }else{
                return (
                        <form onSubmit={handleSubmit}>
                            {renderSuccess()}
                            {renderError()}
                            <TextInput containerStyle="my-2" label="title" value={state.title} placeholder="POST TITLE" onChange={OnTitleChange}
                                inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                            />
                            {/* <Link to={{ pathname: savedImage.url }} target="_blank">
                                {savedImage.original_filename}
                            </Link> */}
                            <div className="my-2">
                                <label htmlFor="cover">COVER IMAGE: </label><br/>
                                {renderCoverImage()}
                                {state.isUploading && <h5>Uploading</h5>}
                            </div>

                            <div className="my-2">
                                <label htmlFor="tags">TAGS: </label><br/>
                                Can't find your tag? <button onClick={show_add_tag.bind(this)}>Add Tag</button>
                                <div className="flex flex-row gap-3">
                                    {renderTags()}
                                </div>
                                {CreateTagModal()}
                            </div>

                            <div>
                                <TextArea 
                                    containerStyle="my-2" label="PREVIEW" placeholder="Post Preview" onChange={handlePreview} 
                                    value={state.preview}
                                    inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                                />
                                {`${state.preview.split(" ").length - 1} / ${limit} ${
                                    state.preview.split(" ").length - 1 < 2 ? "word" : "words"
                                }`}
                            </div>

                            <div className="my-2">
                                <label htmlFor="body">Post: </label><br/>
                                {renderEditor()}
                            </div>

                            <div>
                                {state.isSubmiting && (
                                    <button className="btn btn-primary" disabled={true}>
                                        <i className={`fa fa-circle-o-notch fa-spin`}></i>
                                        Submiting
                                    </button>
                                )}
                                {!state.isSubmiting && <button className="btn btn-primary">Submit</button>}
                            </div>
                            
                        </form>
                );
            }
        }
    }

    const handleError = (msg) => {
        setState({...state, errorsmsg: msg});
        setTimeout(() => {
            setState({...state, errorsmsg: ""});
        }, 5000);
    }

    const handleSuccess = (msg) => {
        setState({...state, successmsg: msg});
        setTimeout(() => {
            setState({...state, successmsg: ""});
        }, 5000);
    }

    const renderError = () => {
        if(state.errorsMsg !== '') {
            return(
                <p className="bg-[lightpink] text-[firebrick] font-bold p-2 mb-2 w-[80%] text-center rounded">
                    {state.errorsMsg}
                </p>
            );
        }
    }

    const renderSuccess = () => {
        if(state.successMsg !== "") {
            return(
                <p className="bg-[lightgreen] text-[darkGreen] font-bold p-2 mb-2 w-[80%] text-center rounded">
                    {state.successMsg}
                </p>
            );
        }
    }

  return (
    // <>
    //     {renderContent()}
    // </>
    <div>
        <Link to={`/post/${postId}`} style={{float: "right", marginRight: "10%"}}>
            <h3>Preview</h3>
        </Link>
        <h1 style={{paddingLeft: "2%"}}>Edit Post</h1>
          {renderForm()}
    </div>
  );
};

export default Edit_post;
