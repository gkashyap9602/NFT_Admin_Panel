import React, { useState } from 'react'
// import {IoIosEye } from "@coreui/icons-react"
import { Link } from 'react-router-dom'
import { Menu, Button } from "@mui/material"
import { IoIosEye } from "react-icons/io"
import {} from "react-icons/"
import { AiOutlineSetting } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import "./templateMenu.css"
import { fullDateFormat } from "../../../Common/utility"
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import {GiRadioactive} from "react-icons/gi"
import {BsPencilSquare} from "react-icons/bs"
import { DELETE_TEMPLATE_WITH_TEMP_ID_PARAMS ,ACTIVE_INACTIVE_TEMPLATE,RENAME_NFT_TEMPLATE} from 'admin/Api/api';
import axios from 'axios';
import { useProvider } from 'admin/context/ProviderApp';
import { toast } from 'react-toastify';
import { ConfirmModal } from 'admin/Modal/ConfirmModal/ConfirmModal';
import { ConfirmModal2 } from 'admin/Modal/ConfirmModal2/ConfirmModal'
import {  cilPen } from '@coreui/icons'
import { RenameTemplate } from 'admin/Modal/RenameTemplate/RenameTemplate'

export const TemplateMenu = (props) => {

  const { templateId ,setTemplateId,setTemplateDeleted,setActive,getTemplates} = useProvider()
  const {template,setLoader } = props
  const [anchorEl, setAnchorEl] = useState()
  const [show,setShow] = useState(false)
  const [activeInactive,setActiveInactive]  = useState(false)

  const [showRenameTemplate,setShowRenameTemplate] = useState(false)
  
  const handleClick = (event) => {
    // console.log(event.currentTarget.name,"event target temp menu side")
    setAnchorEl(event.currentTarget);
    setTemplateId(event.currentTarget.name)
    localStorage.setItem("templateId",event.currentTarget.name)
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

 
  //Active InActive Templates Api 
  const activeInactiveTemplates = async (_tempId)=>{
    try {
      setLoader(true)
      // console.log(_tempId,"_tempId----activate temp or not ")
      let user = JSON.parse(localStorage.getItem("authUser"))
       let body = {
        isActive:template.isActive?"false":"true",
        id:_tempId
       }
      const response = await axios.post(`${ACTIVE_INACTIVE_TEMPLATE}`,body,{
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      // console.log(response,"response activate template side ")
        setActiveInactive(false)
      if(response.status===200){
        toast.success(response.data.message)
        getTemplates()
        // setActive(true)
        // setActiveInactive(false)

      }

    } catch (error) {
      toast.error(error.response ? error.response.data.error : error)

      
    }finally{
      setLoader(false)
    }
  };
  //ends here 
   

  //delete Templates Api 
  const deleteTemplate = async (e) => {
    try {
      setLoader(true)

      e.preventDefault()
      let user = JSON.parse(localStorage.getItem("authUser"))

      const response = await axios.delete(`${DELETE_TEMPLATE_WITH_TEMP_ID_PARAMS}/${templateId}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },})
        // console.log(response,"response delete template side ")
        if(response.status ===200){
          toast.success(response.data?.message)
          getTemplates()
          // setTemplateDeleted(true)
          setShow(false)
        }
    } catch (error) {
      // console.log(error, "error delete Template side ")
      toast.error(error.response ? error.response.data.error : error)
    }finally{
      setLoader(false)

    }
  };
  //ends here 

  // console.log(templateId,"templateId-template menu side ")
  // console.log(template,"template-template menu side ")

  return (
    <>
    <ConfirmModal text = {"Delete Template"}  onSubmit = {deleteTemplate} show = {show} setShow = {setShow}/>
    <ConfirmModal2 text = {template.isActive?"inActive Template":"Active Template"} template = {template} onSubmit = {activeInactiveTemplates} show = {activeInactive} setShow = {setActiveInactive}/>
    <RenameTemplate templateName = {template.name} templateId = {templateId} setLoader = {setLoader} show={showRenameTemplate} setShow={setShowRenameTemplate}/>
      <Button
        className="position-absolute top-0 right-0"
        id="basic-button"
        style={{overflow:"none"}}
        name = {template._id}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <IoEllipsisHorizontalSharp />
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
          horizontal: 'right',
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <div className="list-box px-3 py-2">
          <h3 className="title mt-0 mb-2">{template.name}</h3>
          <ul className="edit-list d-flex mb-3 pb-1 flex-wrap align-items-center list-unstyled">
            {/* <li>NFT</li> */}
            {/* <li>Edited 04:02 pm </li>
              <li>29, Dec, 2022</li> */}

            <li>Created {fullDateFormat(template.createdAt)}</li>
          </ul>
          <ul className="collection-list list-unstyled">
            <li onClick={handleMenuClose}>
              <Link to="/manage-templates">
                <AiOutlineSetting /><span className="ms-2">Manage Template</span>
              </Link>
            </li>
            
            <li onClick={handleMenuClose}>
              <Link to="#">
                <GiRadioactive /><span onClick={()=>setActiveInactive(true)} className="ms-2"> {template.isActive?"InActive Template":"Active Template"}</span>
              </Link>
            </li>
            <li onClick={handleMenuClose}>
              <Link to="#">
                <BsPencilSquare /><span onClick={()=>setShowRenameTemplate(true)} className="ms-2"> {"Rename Template"}</span>
              </Link>
            </li>
            <li onClick={handleMenuClose}>
              <Link to="#">
                <MdDeleteOutline /><span onClick={()=>setShow(true)} className="ms-2">Delete Template</span>
              </Link>
            </li>
          </ul>
        </div>
      </Menu>
    </>
  )
}
