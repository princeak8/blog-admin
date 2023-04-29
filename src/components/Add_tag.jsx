import React, { useState } from "react";
import Modal from "./common/Modal";

const Add_tag = ({ onTagCreate, onCloseModal, isCreatingTag }) => {
  const [tag, setTag] = useState("");

  const handleCreateTag = () => {
    onTagCreate(tag);
    setTag("");
  };

  return (
    <Modal onCloseModal={onCloseModal}>
      Create Tag{" "}
      <input
        value={tag}
        type="text"
        onChange={(text) => setTag(text.target.value)}
      />
      <button disabled={isCreatingTag} type="submit" onClick={handleCreateTag}>
        Create
      </button>
    </Modal>
  );
};

export default Add_tag;
