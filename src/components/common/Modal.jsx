import React from "react";
import ReactDOM from "react-dom";
import styles from "../../css/Modal.module.css";

const Backdrop = (props) => {
  return <div onClick={props.onCloseModal} className={styles.backdrop}></div>;
};

const ModalOverlay = (props) => {
  // console.log(props);

  return (
    <div className={styles.modal}>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onCloseModal={props.onCloseModal} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </React.Fragment>
  );
};

export default Modal;
