import React, { useState, useEffect,useRef } from "react"
import { Row, Col, Container } from "reactstrap"
import { ImageGallery } from "../ImagePage/ImageGallery"
import { AddLayer } from "admin/Modal/AddLayer/AddLayer"
import { LetsBegin } from "admin/LetsBegin/LetsBegin"
import { useProvider } from "admin/context/ProviderApp"
import { ADD_LAYER, GENERATE_TEMPLATE,RENAME_NFT_TEMPLATE } from "admin/Api/api"
import axios from "axios"
import { toast } from "react-toastify"
import { BsArrowLeftCircleFill } from "react-icons/bs"
import { TfiSave } from "react-icons/tfi"
import { FiEdit } from "react-icons/fi"

import { TextField } from "@mui/material"

import "./manageTemplate.css"
import { Link } from "react-router-dom"
import { Loader } from "admin/Loader/Loader"
import { useHistory } from "react-router-dom"
export const ManageTemplate = props => {
  //meta title
  // document.title = "Manage Templates"

  const history = useHistory()
  const {
    loader,
    getTemplates,
    layerUpdated,
    layerDeleted,
    layerAdded,
    setTemplateId,
    currentTemplate,
    setCurrentTemplate,
    templateId,
    setLayerAdded,
    templates,
    selectedLayer,
    setSelectedLayer,
  } = useProvider()

  const [show, setShow] = useState(false)
  const [loader2, setLoader2] = useState(false)

  
  useEffect(() => {
    let tempId = localStorage.getItem("templateId")
    if (tempId) {
      setTemplateId(tempId)
    }
  }, [])

  useEffect(() => {
    // console.log(templateId, "templateId useEffect setCurrentTemp")
    if (templateId && templates.length > 0) {
      const presentTemplate = templates.filter(val => val._id === templateId)
      console.log(presentTemplate, "presentTemplate-Manage Template side")
      setCurrentTemplate(presentTemplate[0])

      if (presentTemplate[0]?.layers[0] && !selectedLayer.layerName) {
        setSelectedLayer({
          layerId: "",
          layerName: presentTemplate[0].layers[0],
        })
      }
    }
  }, [templateId, templates.length, layerAdded, layerDeleted, layerUpdated])

  const handleClose = () => {
    setShow(false)
  }

  const addLayer = async values => {
    try {
      // console.log(values,"values-ad")
      setLoader2(true)
      let body = {
        templateId: templateId,
        name: values.layer,
      }
      let user = JSON.parse(localStorage.getItem("authUser"))
      // console.log(user, "user")
      let response = await axios.post(`${ADD_LAYER}`, body, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      if (response.status === 200) {
        // console.log(response, "response add layer side ")
        toast.success(response.data?.message)
        setLayerAdded(true)
        getTemplates()
        handleClose()
        setSelectedLayer({
          layerId: "",
          layerName:
            response.data.data.layers[response.data.data.layers.length - 1],
        })
      }
    } catch (err) {
      // console.log(err, "error add layer side  ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader2(false)
    }
  }

  const generatePreview = async event => {
    try {
      setLoader2(true)

      event.preventDefault()

      let user = JSON.parse(localStorage.getItem("authUser"))
      // console.log(user, "user")
      let response = await axios.post(
        `${GENERATE_TEMPLATE}`,
        { templateId },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        toast.success(response.data?.message)
        history.push("/nft-templates")
        getTemplates()
      }
    } catch (err) {
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader2(false)
    }
  };
//ends 

//Rename Template 
const renameTemplate = async ()=>{
  try {
    // setLoader(true)
    let user = JSON.parse(localStorage.getItem("authUser"))
     let body = {
      name:currentTemplate?.name,
      id:templateId
     }
    const response = await axios.post(`${RENAME_NFT_TEMPLATE}`,body,{
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
    console.log(response,"response rename template side ")
    // console.log(response.status,"response status rename template side ")

    if(response.status===200){
      // console.log(getTemplates,"getTemplates-fn")
      getTemplates()
      toast.success(response.data.message)
    
    }

  } catch (error) {
    toast.error(error.response ? error.response.data.error : error)

  }finally{
    // setLoader(false)
  }
};
//ends here 
  const onChangeHandler = (_value)=>{
   
    console.log(_value,"_value onchange side ")
    setCurrentTemplate({...currentTemplate,name:_value})
  };
  //ends 

  return loader2 ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <AddLayer
        onSubmit={addLayer}
        handleClose={handleClose}
        show={show}
        setShow={setShow}
      />
      <div className="page-content">
        <Container fluid>
          <div className="div1 mb-0 d-flex justify-content-between align-items-center">
          <div style={{gap:"11px"}} className="leftBackArrow d-flex">

            <Link
              style={{ gap: "15px" }}
              className="leftItemTemp d-flex"
              to="/nft-templates"
            >
              <BsArrowLeftCircleFill
                style={{
                  fontSize: "25px",
                  cursor: "pointer",
                  marginTop: "3px",
                }}
              />
            
            </Link>
           
              <div style={{marginLeft:"10px"}} className="saveName">
              <TextField
              // variant="outlined"
              value={currentTemplate?.name}
              // variant="filled"
              onChange = {(e)=>onChangeHandler(e.target.value)}
              variant="standard"
              size="small"
              >
              {/* {currentTemplate?.name} */}
              </TextField>
              <TfiSave
              fontSize={20}
              color="#0d6efd"
              cursor="pointer"
              onClick={renameTemplate}
              />
              {/* <FiEdit
                fontSize={20}
              // color="#0d6efd"
              cursor="pointer"
              /> */}
              </div>
              

            {/* <h5
                style={{
                  fontSize: "18px",
                  marginLeft: "5px",
                  color: "black",
                  marginTop: "4px",
                }}
              >
                {currentTemplate?.name}
               <TfiSave/>
               

              </h5> */}
            </div>
            
            <div>
              <button
                disabled={loader}
                className="btn btn-primary me-3"
                onClick={() => {
                  setShow(true)
                  if (layerInput.current) {
                    layerInput.current.focus();
                          }
                }}
              >
                Add Layer
              </button>
              <button
                disabled={loader}
                className="btn btn-primary"
                onClick={e => {
                  if (templateId) {
                    generatePreview(e)
                  }
                }}
              >
                Generate Preview
              </button>
            </div>
          </div>

          <div className="">
            <>
              {currentTemplate && currentTemplate?.layers?.length !== 0 ? (
                <ImageGallery />
              ) : (
                <LetsBegin setShow={setShow} />
              )}
            </>
          </div>
        </Container>
      </div>
    </>
  )
}
