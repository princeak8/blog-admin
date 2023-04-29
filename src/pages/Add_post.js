import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {saveTag, savePost, getTags, uploadImage} from "../api/post";
import AddTag from "../components/Add_tag";
import {postActions} from "../store/postSlice";
import { getUser } from "../localstorage/User";

import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import { MyEditor } from "../components/common/TextEditor";
import TextInput from "../components/common/TextInput";
import FileInput from "../components/common/FileInput";
import TextArea from "../components/common/TextArea";

import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const limit = 25;

function Add_post(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [post_title, setPost_title] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [savedImage, setSavedImage] = useState();
    const [isCreatingTag, setIsCreatingTag] = useState(false);

    const [tags, setTags] = useState();
    const [tagsLoaded, setTagsLoaded] = useState(false);
    const [preview, setPreview] = useState("");
    const [post_body, setPost_body] = useState("");

    const [modalIsShown, setModalIsShown] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const {domain, token} = getUser();
    const [selected_tag, setSelected_tag] = useState([]);
    const [InputKey, setInputKey] = useState();

    const resetFields = () => {
      setPost_title("");
      setSavedImage("");
      setPreview("");
      setPost_body("");
      setSelected_tag([]);
      resetsFileInput();
    };

    const resetsFileInput = () => {
        let randomString = Math.random().toString(36);
        setInputKey(randomString);
    };

    const handleCheck = (tag) => {
        const isChecked = selected_tag.find((item) => item.id === tag.id);

        if (!isChecked) {
            setSelected_tag([...selected_tag, tag]);
        } else {
            const update = selected_tag.filter((item) => item.id !== tag.id);
            setSelected_tag(update);
        }
    };

    const show_add_tag = (event) => {
        event.preventDefault();
        setModalIsShown(true);
    };

    const hide_add_tag = () => {
        setModalIsShown(false);
    };

    const getAllTags = async () => {
        const response = await getTags(domain, token);
        if (!response.ok) return setErrorMsg(response.data.error);

        setTags(response.data.data);
        setTagsLoaded(true);
    };

    const handlePreview = (text) => {
        let words = preview.split(" ").filter(Boolean);

        if (words.length > limit) {
            console.log(words);
            setPreview(words.slice(0, limit).join(" ").toString().trim());
        } else {
            setPreview(text.target.value);
        }
    };

    const handleCreateTag = async (tag) => {
        setIsCreatingTag(true);
        const response = await saveTag(domain, token, tag);
        if (!response.ok) {
            setErrorMsg(response.data.error);
            handleError(response.data.errors.title[0]);
            return;
        }

        setTags([...tags, response.data.data]);
        setIsCreatingTag(false);
        hide_add_tag();
    };

    const handleUpload = async (image) => {
        setIsUploading(true);
        let image_to_upload = new FormData();

        image_to_upload.append("image", image);

        //console.log("image to upload", image_to_upload);
        const response = await uploadImage(
          domain,
          token,
          image_to_upload
        );
        if (!response.ok) {
            setErrorMsg(response.data.error);
            handleError(response.data.errors.title[0]);
            return;
        }
        setIsUploading(false);

        setSavedImage(response.data.data);
    };

    useEffect(() => {
        if(!tagsLoaded) getAllTags();
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const tags = [];
        selected_tag.map((tag) => tags.push(tag.id));
        const post = {
            title: post_title,
            cover_photo: savedImage?.id,
            tags_id: tags,
            preview,
            content: post_body,
        };

        console.log(post);

        const response = await savePost(domain, token, post);

        if (!response.ok) return handleError(response.data.errors.title[0]);

        dispatch(postActions.addPost(response.data.data));

        resetFields();

        handleSuccess("Submitted Successfuly");
        navigate('/posts');
    };
    
    const OnBodyChange = (val) => {
        // console.log('body: ', val);
        setPost_body(val);
    }

    const renderTags = () => {
        if(tags) {
            return tags.map((tag) => {
                return (
                    <div key={tag.id}>
                      <label htmlFor={tag.id}>{tag.name}</label>
                      <input
                          checked={ selected_tag.find((item) => item.id === tag.id) ? true : false }
                          type="checkbox"
                          id={tag.id}
                          value={tag.id}
                          onChange={() => handleCheck(tag)}
                          className="h-4 w-4 rounded-full shadow ml-1"
                      />
                    </div>
                );
            });
        }
    }

    const CreateTagModal = () => {
        if(modalIsShown) {
            return (
                <AddTag onCloseModal={hide_add_tag} onTagCreate={handleCreateTag} isCreatingTag={isCreatingTag} />
            );
        }
    }

    const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // console.log('body: ', getHtml(editorState));

    const onEditorStateChange = editorState => {
        const htmlContent = getHtml(editorState);
        OnBodyChange(htmlContent);
    };

    const handleError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => {
            setErrorMsg("");
        }, 5000);
    }

    const handleSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => {
            setSuccessMsg("");
        }, 5000);
    }

    const renderError = () => {
        if(errorMsg !== "") {
            return(
                <p className="bg-[lightpink] text-[firebrick] font-bold p-2 mb-2 w-[80%] text-center rounded">
                    {errorMsg}
                </p>
            );
        }
    }

    const renderSuccess = () => {
        if(successMsg !== "") {
            return(
                <p className="bg-[lightgreen] text-[darkGreen] font-bold p-2 mb-2 w-[80%] text-center rounded">
                    {successMsg}
                </p>
            );
        }
    }


    return (
        <div style={{width: "100%"}}>
            {renderSuccess()}
            {renderError()}

            <h1 style={{paddingLeft: "2%"}}>Add Post</h1>
            <form style={{width:"85%", marginRight:"auto", marginLeft:"auto"}}>
                <TextInput classname="my-[2em]" label="title" value={post_title} placeholder="POST TITLE" onChange={(text) => setPost_title(text.target.value)}
                    inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                />

                <FileInput 
                    classname="my-[2em]" label="COVER IMAGE" inputKey={InputKey} onChange={(e) => handleUpload(e.target.files[0])} isUploading={isUploading}
                    inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                />

                <div className="my-[2em]">
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
                        value=""
                        inputStyle="w-full rounded-lg border bg-[#F3F4F6] py-3 px-3 text-sm font-medium leading-4 tracking-ultra-tight text-neutral-500 focus:border-primary-green focus:outline-none"
                    />
                    {`${preview.split(" ").length - 1} / ${limit} ${
                      preview.split(" ").length - 1 < 2 ? "word" : "words"
                    }`}
                </div>

                
                

                <div styles={{height:"20em"}}>
                    <label htmlFor="body">Post: </label><br/>
                    {/* <TiptapEditor onChange={OnBodyChange} /> */}
                    <MyEditor onEditorStateChange={onEditorStateChange} placeholder="The post content goes here..." classes="border-2 w-[99%] min-h-[15em]" />
                </div>

                <div className="mt-[10px]">
                  <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                </div>
            </form>
        </div>
  );
}

export default Add_post;
