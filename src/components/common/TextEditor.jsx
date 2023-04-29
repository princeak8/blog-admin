import React, { useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';

function MyEditor ({
    onEditorStateChange,
    placeholder="",
    content="",
    classes="border-2"
}) {
//    console.log("in the editor");

   const getContentState = (content) => {
        if(content === "") {
            return EditorState.createEmpty();
        }else{
            const blocksFromHtml = htmlToDraft(content);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            return EditorState.createWithContent(contentState);
        }
    }

   const [textEditorState, setEditorState] = useState({
        editorState: getContentState(content)   
    });

    const onChange = (editorState) => {
        setEditorState({
            editorState
        });
        onEditorStateChange(editorState);
    }


    const { editorState } = textEditorState;

    // onEditorStateChange(content);
    

    return (
      <div className={classes}>
        <Editor
          editorState={editorState}
          wrapperClassName="rich-editor demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
}

export { MyEditor };