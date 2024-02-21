import React, { useEffect, useMemo, useState } from "react"
import "./browseImages.css"
import { CCard, CCardBody } from "@coreui/react"
import axios from "axios"
import { toast } from "react-toastify"
import cross from "../../../assets/cross.png"
import addIcon from "../../../assets/AddIcon.png"
import { Button, Nav, Navbar } from "react-bootstrap"
import { UploadImage } from "admin/Modal/UploadImage/UploadImage"
import { LayerMenu } from "admin/NftTemplate/ManageTemplate/LayerMenu/LayerMenu"
import {
  GET_BROWSE_CATEGORY,
  GET_BROWSE_IMAGE_WITH_LAYER_PARAMS,
  API_BASE_URL,
  ADD_BROWSE_IMAGE,
  DELETE_BROWSEIMAGE_WITH_ID_PARAMS,
  DELETE_BROWSE_LAYER_WITH_NAME_PARAMS
  

} from "admin/Api/api"
import { Loader } from "admin/Loader/Loader"
import { useProvider } from "admin/context/ProviderApp"
import { ConfirmModal } from "admin/Modal/ConfirmModal/ConfirmModal"
import { ConfirmModal2 } from "admin/Modal/ConfirmModal2/ConfirmModal"
export const BrowseImages = (props) => {
  const { setSelectedBrowseLayer, selectedBrowseLayer, setLayerDeleted} = useProvider()
  const {layer,editBrowseLayer, setLayer ,getBrowseLayers,browseLayers,setBrowseLayers,deleteBrowseLayer} = props
  const [loader, setLoader] = useState(false)
  const [show, setShow] = useState(false)
  const [upload, setUpload] = useState(false)
  // const [browseLayers, setBrowseLayers] = useState([])
  const [browseImages, setBrowseImages] = useState([])
  const [images, setImages] = useState(null)
  const [imageDeleted, setImageDeleted] = useState(false)
  const [showImageDelete, setShowImageDelete] = useState(false)
  const [imageId, setImageId] = useState("")

  const handleOnChange = (_files) => {
    setImages(_files)
  }


  useEffect(() => {
    // console.log(selectedBrowseLayer.layerId, "selectedLayer.layerId useef")
    if (selectedBrowseLayer.layerId) {
      // console.log("under if ")
      getBrowseImages()
    }
  }, [selectedBrowseLayer.layerId])

  
  // console.log(loader,"loader browse image side")
  const getBrowseImages = async () => {
    try {
      setLoader(true)
      let user = JSON.parse(localStorage.getItem("authUser"))

      const imagesResponse = await axios.get(
        `${GET_BROWSE_IMAGE_WITH_LAYER_PARAMS}/${selectedBrowseLayer.layerId}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "multipart/form-data; ",
          },
        }
      )
      // console.log(imagesResponse, "get browseimages response")
      if (imagesResponse.status === 200) {
        setUpload(false)
        setImageDeleted(false)

        if (imagesResponse.data.data.length > 0 && browseImages.length < 0) {
          setBrowseImages([...browseImages, ...imagesResponse.data.data])
        } else {
          setBrowseImages(imagesResponse.data.data)
          // toast("No More Images For This Layer")
        }
      }
    } catch (error) {
      // console.log(error, "error image side ")
      toast.error(error.message ? error.message : error)
    }finally{
      setLoader(false)
    }
  }

  // console.log(browseImages, "browseImages side")
  // console.log(browseLayers,"browseLayers")

  const uploadBrowseImages = async (e) => {
    e.preventDefault()
    try {
      setLoader(true)
      // console.log(selectedBrowseLayer, "selectedBrowseLayer- uploadImageSide")
      let user = JSON.parse(localStorage.getItem("authUser"))
      let formdata = new FormData();
      formdata.append('layerId', selectedBrowseLayer.layerId)
      formdata.append("layerName", selectedBrowseLayer.layerName)
      for (let file of images) {
        formdata.append('image', file)
      }
      let uploadResponse = await axios.post(`${ADD_BROWSE_IMAGE}`, formdata, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'multipart/form-data; '
        },
      })
      // console.log(updateResponse, "updaterespnse")
      if (uploadResponse.status === 201) {
        toast.success(uploadResponse.data.message)
        // setUpload(true)
        getBrowseImages()
        // handleClose()
        setShow(false)
      } else {
        throw new Error(uploadResponse.data.message ? uploadResponse.data.message : uploadResponse.error)
      }
    } catch (error) {
      // console.log(error, "error,upload image error  ")
      toast.error(error.message ? error.message : error)
    } finally {
      setLoader(false)
    }
  };

  const deleteBrowseImage = async (e) => {
    try {
      setLoader(true)
      e.preventDefault()
      let user = JSON.parse(localStorage.getItem("authUser"))

      const response = await axios.delete(`${DELETE_BROWSEIMAGE_WITH_ID_PARAMS}/${imageId}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      // console.log(response, "response delete Image side ")
      if (response.status === 200) {
        toast.success(response.data?.message)
        // setImageDeleted(true)
        getBrowseImages()
        setShowImageDelete(false)
      }
    } catch (error) {
      // console.log(error, "error image side ")
      toast.error(error.message ? error.message : error)
    } finally {
      setLoader(false)
    }

  };

  // console.log(selectedBrowseLayer, "selectedBrowseLayer browse Image side ")
// console.log(showImageDelete,"ShowImageDelete--")
  return loader ? (
    <>
      <Loader />
    </>
  ) :(
    <>
      <ConfirmModal text={"Delete Image"} onSubmit={deleteBrowseImage} show={showImageDelete} setShow={setShowImageDelete} />
      <UploadImage onSubmit={uploadBrowseImages} handleOnChange={handleOnChange} show={show} setShow={setShow} />
      <CCard className="cardImage mb-0 mt-2">

        <Nav className="layersNav" variant="tabs" defaultActiveKey="/home">
          {browseLayers.map((layer, index) => (
            <React.Fragment key={index}>
              {selectedBrowseLayer.layerId === layer._id ? (
                <Nav.Item key={index}>
                  <Nav.Link
                    active
                    onClick={() => {
                      setSelectedBrowseLayer({
                        ...selectedBrowseLayer,
                        layerId: layer._id,
                        layerName: layer.layerName,
                      })
                    }}
                    href="#"
                    eventKey={`link-${index}`}
                  >
                    {" "}
                    {layer.layerName}
                    <LayerMenu submitEdit={editBrowseLayer} submitDelete={deleteBrowseLayer} layerName={layer.layerName} layerId = {layer._id} selected = {selectedBrowseLayer.layerName===layer.layerName?true:false}/>
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Item>
                  <Nav.Link
                    onClick={() => {
                      setSelectedBrowseLayer({
                        ...selectedBrowseLayer,
                        layerId: layer._id,
                        layerName: layer.layerName,
                      })
                    }}
                    href="#"
                    eventKey={`link-${index}`}
                  >
                    {" "}
                    {layer.layerName}
                    <LayerMenu submitEdit={editBrowseLayer} submitDelete={deleteBrowseLayer} layerName={layer.layerName} />
                  </Nav.Link>
                </Nav.Item>
              )}
            </React.Fragment>
          ))}
        </Nav>
        <CCardBody className="browse_img">

          <div className="grid-system row gx-3 mt-0 " style={{ gap: "10px" }}>
            <div className="col-xl-1 mt-2">
              <div onClick={() => setShow(true)} className="itemBrowse">
              
                <label htmlFor="check1" className="text-center ">
                  <img src={addIcon} alt="" className="addIcon mt-3" />
                  <p className="mt-2 mb-0">Upload</p>
                  {/* <img src={`${API_BASE_URL}${image.url}`} alt="" /> */}
                </label>
              </div>
            </div>
            {browseImages?.map((image, index) => (
              <React.Fragment key={index}>
                <div className="col-xl-1 mt-2">
                  <div className="itemGallery">

                    <span className="position-absolute">
                      <span className="testSpan"></span>
                      <img onClick={(e) => {
                        setShowImageDelete(true)
                        setImageId(image._id)
                      }} className="crossImg" src={cross} alt="" />
                    </span>
                    <label
                      htmlFor="check1"
                      className="upload_img mb-0 position-relative"
                    >
                      {/* <img className="layerImg" src={back1} alt="" /> */}
                      <img className="layerImg" src={`${API_BASE_URL}${image.url}`} alt="" />
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
