import React, { useState } from 'react'
// import {IoIosEye } from "@coreui/icons-react"
import { Link } from 'react-router-dom'
import { Menu, Button } from "@mui/material"
import { IoIosEye } from "react-icons/io"
import { AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import "./layerMenu.css"
import { fullDateFormat } from "../../../Common/utility"
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { DELETE_TEMPLATE_WITH_TEMP_ID_PARAMS } from 'admin/Api/api';
import axios from 'axios';
import { useProvider } from 'admin/context/ProviderApp';
import { toast } from 'react-toastify';
import { ConfirmModal } from 'admin/Modal/ConfirmModal/ConfirmModal';
import { DELETE_LAYER_WITH_TEMP_ID_PARAMS_AND_LAYER_NAME } from 'admin/Api/api';
import { EditLayer } from 'admin/Modal/EditLayer/EditLayer';
import { CiCircleChevRight } from "react-icons/ci";
import { CiCircleChevDown } from "react-icons/ci";

import {BsPencilSquare} from "react-icons/bs"

export const LayerMenu = (props) => {

  const { templateId, setTemplateId, setTemplateDeleted, selectedLayer, setLayerDeleted ,selectedBrowseLayer} = useProvider()
  const { layerName ,layerId,submitDelete,submitEdit,selected} = props
  const [anchorEl, setAnchorEl] = useState()
  const [show, setShow] = useState(false)
  const [showEditLayer, setShowEditLayer] = useState(false)


  const handleClick = (event) => {
    // console.log(event.currentTarget.name, "event target layer menu side")
    setAnchorEl(event.currentTarget);
    // setTemplateId(event.currentTarget.name)
    // localStorage.setItem("templateId",event.currentTarget.name)
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return (
    <>
      <EditLayer  layerName = {layerName} onSubmit = {submitEdit} show={showEditLayer} setShow={setShowEditLayer} />
      <ConfirmModal text={"Delete Layer"} onSubmit = {submitDelete} show={show} setShow={setShow} />
      <Button
        id="basic-button"
        name={layerName}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
      {/* {selectedLayer.layerName===layerName || selectedBrowseLayer.layerId===layerId?
        <CiCircleChevDown />
        :""} */}
        {selected?
        <CiCircleChevDown />
        :""}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <div className="list-box px-3 py-2">
          <h3 className="title mt-0 mb-2">{layerName}</h3>
          <ul className="edit-list d-flex mb-3 pb-1 flex-wrap align-items-center list-unstyled">
            {/* <li>NFT</li> */}
            {/* <li>Edited 04:02 pm </li>
              <li>29, Dec, 2022</li> */}

            {/* <li>Created {fullDateFormat(template.createdAt)}</li> */}
          </ul>
          <ul className="collection-list list-unstyled">
            <li onClick={handleMenuClose}>
              <Link to="#">
              <BsPencilSquare /><span onClick={() => setShowEditLayer(true)} className="ms-2">Edit Layer</span>
              </Link>
            </li>
            <li onClick={handleMenuClose}>
              <Link to="#">
                <MdDeleteOutline /><span onClick={() => {
                  setShow(true)
                  // submitDelete()
                  }} className="ms-2">Delete Layer</span>
              </Link>
            </li>
          </ul>
        </div>
      </Menu>
    </>
  )
}
