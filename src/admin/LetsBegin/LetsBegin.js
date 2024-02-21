import React, { useState } from "react";
import styles from "./LetsBegin.module.css";
// import StartProject from "../modals/createNft/StartProject";
import NftBackImg from "../../assets/nftBackground2.png"
import { AddLayer } from "admin/Modal/AddLayer/AddLayer";

export const LetsBegin = (props) => {
       const {setShow} = props;
  return (
    <>
      <div className={styles.canvasPanel}>
       <div className={styles.generate}>
       <div className={styles.maincontent}>
         <div className={styles.upload}>
           <p className={styles.drag}>Manage NFT Template.</p>
           <button
             className={`${styles.getStart}`}
             onClick={() => setShow(true)}
           >
             Lets Start
           </button>
           <div className={styles.pdfImage}>
             <img
               src={NftBackImg}
               // src="https://designcloud.appypie.com/dist/img/public/img/edit_img.png"
               alt="design"
             />
           </div>
         </div>
       </div>
     </div>
      </div>
    </>
  );
};
