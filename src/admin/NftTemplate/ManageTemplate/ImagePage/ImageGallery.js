import React, { useEffect, useState } from "react"
import "./imageGallery.css"
import { CCard, CCardBody } from "@coreui/react"
import { API_BASE_URL } from "admin/Api/api"
import axios from "axios"
import { toast } from "react-toastify"

import addIcon from "../../../../assets/AddIcon.png"
import cross from "../../../../assets/cross.png"
import { Nav, Navbar } from "react-bootstrap"
import { UploadImage } from "admin/Modal/UploadImage/UploadImage"
import { useProvider } from "admin/context/ProviderApp"
import {
  GET_IMAGES_WITH_TEMP_ID_PARAMS,
  ADD_IMAGES,
  DELETE_LAYER_IMAGE_WITH_ID_PARAMS,
  DELETE_LAYER_WITH_TEMP_ID_PARAMS_AND_LAYER_NAME,
  UPDATE_LAYER_WITH_DATA_BODY,
  CHANGE_LAYER_ORDER
} from "admin/Api/api"
import { LayerMenu } from "../LayerMenu/LayerMenu"
import { ConfirmModal } from "admin/Modal/ConfirmModal/ConfirmModal"
import { Loader } from "admin/Loader/Loader"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export const ImageGallery = props => {
  const {
    loader,
    setLoader,
    selectedLayer,
    templateId,
    currentTemplate,
    setCurrentTemplate,
    setSelectedLayer,
    setLayerDeleted,
    setLayerUpdated,
    getTemplates,
  } = useProvider()

  const [show, setShow] = useState(false)
  const [layerImages, setLayerImages] = useState([])
  const [uploadImages, setUploadImages] = useState(null)
  const [imageId, setImageId] = useState("")
  const [showImageDelete, setShowImageDelete] = useState("")

  const handleOnChange = _files => {
    setUploadImages(_files)
  }

  useEffect(() => {
    setLoader(true)
    // console.log(selectedLayer.layerName, "selectedLayer.layerName useef")
    if (templateId && selectedLayer.layerName) {
      getLayerImages()
    }
    // setLoader(false)
  }, [selectedLayer.layerName])

  const getLayerImages = async () => {
    try {
      setLoader(true)

      let user = JSON.parse(localStorage.getItem("authUser"))

      const imagesResponse = await axios.get(
        `${GET_IMAGES_WITH_TEMP_ID_PARAMS}/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      if (imagesResponse.status === 200) {
        let presentLayerImages =
          imagesResponse.data.data.Images[selectedLayer.layerName]
        //  console.log(presentLayerImages,"presentLayerImages")
        if (presentLayerImages) {
          setLayerImages([...presentLayerImages])
        } else {
          setLayerImages([])
        }
      }
    } catch (error) {
      // console.log(error, "error image side ")
      toast.error(error.message ? error.message : error)
    } finally {
      setLoader(false)
    }
  }
  //ends 


  const uploadLayerImages = async e => {
    e.preventDefault()
    try {
      setLoader(true)
      //  console.log(selectedLayer,"selectedLayer- uploadImageSide")
      let user = JSON.parse(localStorage.getItem("authUser"))
      let formdata = new FormData()
      // formdata.append('layerId', selectedLayer.layerId)
      formdata.append("layerName", selectedLayer.layerName)
      formdata.append("templateId", templateId)

      for (let file of uploadImages) {
        formdata.append("images", file)
      }
      let uploadResponse = await axios.post(`${ADD_IMAGES}`, formdata, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "multipart/form-data; ",
        },
      })
      // console.log(updateResponse, "updaterespnse")
      if (uploadResponse.status === 200) {
        toast.success(uploadResponse.data.message)
        getLayerImages()
      } else {
        throw new Error(
          uploadResponse.data.message
            ? uploadResponse.data.message
            : uploadResponse.error
        )
      }
    } catch (error) {
      // console.log(error, "error,upload image error  ")
      toast.error(error.message ? error.message : error)
    } finally {
      setShow(false)
      setLoader(false)
    }
  }
  //ends 

  const deleteLayerImage = async e => {
    try {
      setLoader(true)
      e.preventDefault()
      let user = JSON.parse(localStorage.getItem("authUser"))

      const response = await axios.delete(
        `${DELETE_LAYER_IMAGE_WITH_ID_PARAMS}/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      // console.log(response,"response delete Image side ")
      if (response.status === 200) {
        toast.success(response.data?.message)
        // setImageDeleted(true)
        getLayerImages()
      }
    } catch (error) {
      console.log(error, "error image side ")
      toast.error(error.message ? error.message : error)
    } finally {
      setShowImageDelete(false)
      setLoader(false)
    }
  }
  //ends 

  const deleteLayer = async e => {
    try {
      setLoader(true)
      e.preventDefault()

      // console.log(e.target,"delete Layer side ")
      let user = JSON.parse(localStorage.getItem("authUser"))

      const response = await axios.delete(
        `${DELETE_LAYER_WITH_TEMP_ID_PARAMS_AND_LAYER_NAME}/${templateId}/${selectedLayer.layerName}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      // console.log(response, "response delete Layer side ")
      if (response.status === 200) {
        toast.success(response.data?.message)
        getTemplates()
        setSelectedLayer("")
        setLayerDeleted(true)
        // setShow(false)
        return true
      }
    } catch (error) {
      // console.log(error, "error Delte Layer side ")
      toast.error(error.message ? error.message : error)
    } finally {
      setLoader(false)
    }
  };
  //ends 
  const editLayer = async (event, _layerName, _oldName) => {
    try {
      setLoader(true)

      event.preventDefault()
      // console.log(_layerName, "_layerName" ,_oldName, "_oldName edit layer side ")
      let body = {
        templateId: templateId,
        name: _layerName,
        oldName: _oldName,
      }
      let user = JSON.parse(localStorage.getItem("authUser"))
      // console.log(user, "user")
      let response = await axios.post(`${UPDATE_LAYER_WITH_DATA_BODY}`, body, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      if (response.status === 200) {
        // console.log(response, "response edit layer side ")
        toast.success(response.data?.message)
        getTemplates()
        setLayerUpdated(true)
        setSelectedLayer({
          ...selectedLayer,
          layerId: "",
          layerName: _layerName,
        })
        // setLayer(response.data.data)
      }
    } catch (err) {
      // console.log(err, "error edit layer side ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }
  //ends

  const changeLayerOrder = async (_updatedLayerOrder) => {
    try {
      // setLoader(true)
      let body = {
        templateId: templateId,
        order: _updatedLayerOrder,
      }
      let user = JSON.parse(localStorage.getItem("authUser"))
      // console.log(user, "user")
      let response = await axios.post(`${CHANGE_LAYER_ORDER}`, body, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      if (response.status === 200) {
        // console.log(response, "response layerOrder api side ")
        // toast.success(response.data?.message)
        getTemplates()
        setLayerUpdated(true)
     
      }
    } catch (err) {
      // console.log(err, "error edit layer side ")
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      // setLoader(false)
    }
  }
  //ends


  // Function to update list on drop
  const handleDrop = droppedItem => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return

    // Update State
      let newIndex = droppedItem.destination.index;
      let oldIndex = droppedItem.source.index;

      // console.log(newIndex,"newIndex",oldIndex,"oldIndex")
      let updatedList = currentTemplate?.layers.map((e, i) => {
      if (i == oldIndex) {
        return currentTemplate?.layers[newIndex]
      } else if (i == newIndex) {
        return currentTemplate?.layers[oldIndex]
      } else {
        return e
      }
    })

    changeLayerOrder(updatedList)
    // console.log(updatedList, "updatedList after drag")
    setCurrentTemplate({...currentTemplate, layers: updatedList });
  }

  // console.log(currentTemplate, "currentTemplate after drag")

  return loader ? (
    <>
      <Loader />
    </>
  ) : (
    <>
      <ConfirmModal
        text={"Delete Image"}
        onSubmit={deleteLayerImage}
        show={showImageDelete}
        setShow={setShowImageDelete}
      />

      <UploadImage
        onSubmit={uploadLayerImages}
        handleOnChange={handleOnChange}
        show={show}
        setShow={setShow}
      />
      <CCard className="cardImage ">
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="list-container" direction="horizontal">
            {provided => (
              <div
                className="list-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <Nav
                  className="layersNav"
                  variant="tabs"
                  defaultActiveKey="/home"
                >
                  {(currentTemplate && currentTemplate.layers) ? (
                    <>
                      {currentTemplate?.layers.map((layer, index) => (
                        <Draggable  key={layer} draggableId={layer} index={index}>
                          {provided => (
                            <>
                            {selectedLayer.layerName === layer ? (
                            <div
                                className="item-container"
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                              >

                                  <Nav.Item key={index}>
                                    <Nav.Link
                                      active
                                      onClick={() => {
                                        setSelectedLayer({
                                          ...selectedLayer,
                                          layerId: "",
                                          layerName: layer,
                                        })
                                      }}
                                      href="#"
                                      eventKey={`link-${index}`}
                                    >
                                      {" "}
                                      {layer}
                                      <LayerMenu
                                        submitEdit={editLayer}
                                        submitDelete={deleteLayer}
                                        layerName={layer}
                                        selected={
                                          selectedLayer.layerName === layer ? true : false
                                        }
                                      />
                                    </Nav.Link>
                                  </Nav.Item>
                                  </div>
                                ) : (
                                  <div
                                className="item-container"
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                              >
                                  <Nav.Item>
                                    <Nav.Link
                                      onClick={() => {
                                        setSelectedLayer({
                                          ...selectedLayer,
                                          layerId: "",
                                          layerName: layer,
                                        })
                                      }}
                                      href="#"
                                      eventKey={`link-${index}`}
                                    >
                                      {" "}
                                      {layer}
                                      <LayerMenu
                                        submitEdit={editLayer}
                                        submitDelete={deleteLayer}
                                        layerName={layer}
                                      />
                                    </Nav.Link>
                                  </Nav.Item>
                                  </div>
                                )}
                          
                            </>
                          )}
                        </Draggable>
                      ))}
                    </>
                  ) : (
                    ""
                  )}

                </Nav>
                {provided.placeholder}

              </div>
            )}
          </Droppable>
        </DragDropContext>

        <CCardBody className="layer_img">
          <div className="grid-system row gx-3 mt-0 " style={{ gap: "10px" }}>
            <div className="col-xl-1 mt-2">
              <div onClick={() => setShow(true)} className="itemBrowse">
                <label htmlFor="check1" className="text-center ">
                  <img src={addIcon} alt="" className="addIcon mt-3" />
                  <p className="mt-2 mb-0">Upload</p>
                </label>
              </div>
            </div>
            {layerImages?.map((image, index) => (
              <React.Fragment key={index}>
                <div className="col-xl-1 mt-2">
                  <div className="itemGallery">
                    <span className="position-absolute">
                      <span className="testSpan"></span>
                      <img
                        onClick={e => {
                          setShowImageDelete(true)
                          setImageId(image._id)
                        }}
                        className="crossImg"
                        src={cross}
                        alt=""
                      />
                    </span>
                    <label
                      htmlFor="check1"
                      className="upload_img mb-0 position-relative"
                    >
                      <img
                        className="layerImg"
                        src={`${API_BASE_URL}${image.url}`}
                        alt=""
                      />
                    </label>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}
