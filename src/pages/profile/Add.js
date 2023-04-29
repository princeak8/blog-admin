import React, {useState} from "react";
import { useDispatch } from "react-redux";
import {updateUserInfo} from "../../api/user";
import { userActions } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { getUser, saveUser } from "../../localstorage/User";

import TextInput from "../../components/common/TextInput";
import { MyEditor } from "../../components/common/TextEditor";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function Add(props) {
    const {domain, token} = getUser();

    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [blog_name, setBlog_name] = useState("");
    const [about, setAbout] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();


    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleBlogNameChange = (event) => {
        setBlog_name(event.target.value);
    };

    const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // console.log('body: ', getHtml(editorState));

    const onEditorStateChange = editorState => {
        const htmlContent = getHtml(editorState);
        handleAboutChange(htmlContent);
    };

    const handleAboutChange = (htmlVal) => {
        setAbout(htmlVal);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const user = { name, blog_name, about };
        const response = await updateUserInfo(user, domain, token);
        setIsLoading(false);
        if (!response.ok) {
            console.log('error: ',response);
            handleError(response.problem);
            return;
        }
        //console.log('dispatch', response.data);
        dispatch(userActions.setUser(response.data.data));
        saveUser(response.data.data);
        //authCtx.addUser(response.data.data.name);
        navigate("/dashboard", { replace: true });
    };

    const handleError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => {
            setErrorMsg("");
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

  return (
    <div className="flex flex-col items-center h-full">
      {/* <img src={logo} alt="medicsync_logo" className={styles.logo} /> */}

      {renderError()}

      <form className="w-[80%] h-auto flex justify-between flex-col" onSubmit={handleSubmit}>
        <TextInput 
            label="Name" onChange={handleNameChange} placeholder="Please enter your name" value={name} containerStyle="flex flex-col h-[100px]"
        />

        <TextInput 
            label="Blog Name" onChange={handleBlogNameChange} placeholder="Please enter your preferred Blog name" value={blog_name} containerStyle="flex flex-col h-[100px]"
        />

        <div className="flex flex-col h-auto border-2">
          <label htmlFor="about" className="h-[22px] font-[DM Sans] font-semibold text-base">
            About
          </label>
          <MyEditor onEditorStateChange={onEditorStateChange} placeholder="The About content goes here..." classes="border-2 w-[99%] min-h-[15em]" />
        </div>

        <div className="mt-12">
            {isLoading && (
            <button 
                className="bg-[#243466] rounded h-[45px] text-white font-[DM Sans] font-semibold text-base leading-6 w-full ml-0
                            disabled:hover:bg-[#ccc] disabled:active:bg-[#ccc] disabled:bg-[#ccc] 
                            disabled:hover:text-[#292929] disabled:active:text-[#292929] disabled:text-[#292929]
                            disabled:hover:border-[#ccc] disabled:active:border-[#ccc] disabled:border-[#ccc]
                            disabled:hover:cursor-not-allowed disabled:active:cursor-not-allowed disabled:cursor-not-allowed"
                disabled={true}
            >
                <i className="ml-[-12px] mr-[8px] fa fa-circle-o-notch fa-spin"></i>
                Loading
            </button>
            )}
            {!isLoading && 
                <button className="bg-[#243466] rounded h-[45px] text-white font-[DM Sans] font-semibold text-base leading-6 w-full ml-0">
                    Update
                </button>
            }
        </div>
      </form>
    </div>
  );
}

export default Add;
