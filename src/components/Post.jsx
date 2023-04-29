import React from "react";
import DOMPurify from 'dompurify';
import styled from "styled-components";

const Post = (props) => {
    const { post } = props

    const Image = styled.img`
        height: 350px;
        width: 80%;
        `;

    const createMarkup = (html) => {
        return  {
          __html: DOMPurify.sanitize(html)
        }
    }

    const renderTags = () => {
        if(post.tags.length > 0) {
            return post.tags.map((tag) => (<span key={tag.id}>{tag.name} | </span>))
        }
    }

    const photo = (post?.coverImage?.url) ? post.coverImage.url : '/no-image.png';

    return (
        <div style={{width: "100%", paddingLeft: "5%", paddingRight: "5%"}}>
            <h2 style={{marginTop:"2em"}}>
                <b>TITLE: </b> {post.title}
            </h2>

            <div style={{marginTop:"2em"}}>
                <h4>Cover Photo</h4> <br/>
                <Image src={photo} alt="cover photo of the post" />
            </div>

            <h4 style={{marginTop:"3em"}}><b>PREVIEW</b></h4>
            <p>
                {post.preview}
            </p>
            <div style={{marginTop: "3em"}}>
                <h4 style={{marginTop:"3em"}}><b>CONTENT</b></h4>
                <p dangerouslySetInnerHTML={createMarkup(post.content)}></p>
            </div>
            <div style={{marginTop: "3em"}}>
                <b>Tags: </b>
                <div>{renderTags()}</div>
            </div>
        </div>
    );
};

export default Post;
