import React from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PostsSection = (props) => {
    const navigate = useNavigate();
    const { posts, visibility, publish } = props

    const renderPosts = () => {
        return posts.map((post, index)=> {
            return (
                <tr key={post.id} className="pt-[30px]">
                    <td className="text-center">{post.title}</td>
                    <td className="text-center">{post.created_at}</td>
                    <td className="text-center">
                        <button className="btn btn-primary" onClick={() => navigate(`/post/${post.id}`)}>View</button>
                        <button className="btn btn-warning" onClick={() => navigate(`/edit_post/${post.id}`, {state: { ...post },})}>
                            Edit
                        </button>
                        {(post.visible && post.published) && (
                            <button className="btn btn-danger" onClick={() => visibility(post.id)}>Hide</button>
                        ) }
                        {!post.published && (
                            <button className="btn btn-success" onClick={() => publish(post.id)}>Publish</button>
                        ) }
                        {!post.visible && (
                            <button className="btn btn-success" onClick={() => visibility(post.id)}>Make Visible</button>
                        ) }
                    </td>
                </tr>
            );
        })
    }

  const renderContent = () => {
      if(posts.length > 0) {
            return (
                <table style={{width: "100%", borderCollapse:"separate", borderspacing: "0 15em"}} spacing="2" >
                    <thead>
                        <tr>
                            <th className="text-center">Title</th>
                            <th className="text-center">Created At</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderPosts()}
                    </tbody>
                </table>
            );
      }else{
          return (
              <p className="ml-[30%] mt-[5em]">No Posts</p>
          );
      }
  }

    return (
        <>
            {renderContent()}
        </>
    );
};

export default PostsSection;
