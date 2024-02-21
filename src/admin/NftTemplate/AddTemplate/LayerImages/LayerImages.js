import React, { useEffect, useMemo, useState } from "react"
import "./layerImages.css"
import { CCard, CCardBody } from "@coreui/react"
import axios from "axios"
import back1 from "../../../../assets/bg.png"
import { toast } from "react-toastify"
import cross from "../../../../assets/cross.png"
import addIcon from "../../../../assets/AddIcon.png"
import { Nav, Navbar } from "react-bootstrap"
import { UploadImage } from "admin/Modal/UploadImage/UploadImage"
import {
  GET_BROWSE_CATEGORY,
  GET_BROWSE_IMAGE_WITH_LAYER_PARAMS,
  API_BASE_URL,
} from "admin/Api/api"
import { useProvider } from "admin/context/ProviderApp"
import nftBack from "../../../../assets/nftBackground.png"
export const LayerImages = props => {
  const { setSelectedLayer, selectedLayer ,createTemplate,currentTemplate } = useProvider()
  const { layer ,handleClose, onSubmit} = props;

  const [show, setShow] = useState(false)
  const [upload, setUpload] = useState(false)
  const [browseLayers, setBrowseLayers] = useState([])
  const [browseImages, setBrowseImages] = useState([])

  useEffect(() => {
    getBrowseLayers()
  }, [layer])

  useEffect(() => {
    // console.log(selectedLayer.layerId, "selectedLayer.layerId useef")
    if (selectedLayer.layerId) {
      // console.log("under if ")
      getBrowseImages()
    }
  }, [upload,selectedLayer])


  // console.log(upload,"upload browse image side")
  const getBrowseLayers = async () => {
    let user = JSON.parse(localStorage.getItem("authUser"))
    // console.log(user, "user")
    await axios
      .get(`${GET_BROWSE_CATEGORY}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(res => {
        // console.log(res, "response get layer side ")
        setBrowseLayers(res.data?.data)
        if(!selectedLayer.layerId){
          setSelectedLayer({
            ...selectedLayer,
            layerId: res.data?.data[0]._id,
            layerName: res.data?.data[0].layerName,
          })
        }
        
      })
      .catch(err => {
        // console.log(err, "err from get layer")
      })
  }

  const getBrowseImages = async () => {
    try {
      let user = JSON.parse(localStorage.getItem("authUser"))

      const imagesResponse = await axios.get(
        `${GET_BROWSE_IMAGE_WITH_LAYER_PARAMS}/${selectedLayer.layerId}`,
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
         

        if (imagesResponse.data.data.length > 0 && browseImages.length<0) {
          setBrowseImages([...browseImages,...imagesResponse.data.data])
        } else {
          setBrowseImages([...imagesResponse.data.data])
          // toast("No More Images For This Layer")
        }
      }
    } catch (error) {
      // console.log(error, "error image side ")
      toast.error(error.message ? error.message : error)
    }
  }

  return (
    <>
      <UploadImage setUpload={setUpload} show={show} setShow={setShow} />
        {createTemplate?(<>
          <div className="nftImage">
          <img src={nftBack} alt="" />
         </div>
        </>):
         <>
         <CCard className="cardImage ">
        <Nav variant="tabs" defaultActiveKey="/home">
          {currentTemplate?.layers?.map((layer, index) => (
            <Nav.Item key={index}>
              {index === 0 ? (
                <Nav.Link
                  active
                  onClick={() => {
                    setSelectedLayer({
                      ...selectedLayer,
                      layerId: layer._id,
                      layerName: layer.layerName,
                    })
                  }}
                  href="#"
                  eventKey={`link-${index}`}
                >
                  {" "}
                  {layer.layerName}
                </Nav.Link>
              ) : (
                <Nav.Link
                  onClick={() => {
                    setSelectedLayer({
                      ...selectedLayer,
                      layerId: layer._id,
                      layerName: layer.layerName,
                    })
                  }}
                  href="#"
                  eventKey={`link-${index}`}
                >
                  {" "}
                  {layer.layerName}
                </Nav.Link>
              )}

            </Nav.Item>
          ))}
        </Nav>
        <CCardBody>

          <div className="grid-system row gx-3 mt-0 " style={{ gap: "10px" }}>
            <div className="col-xl-1 mt-0">
              <div onClick={() => setShow(true)} className="itemBrowse">
                
                <label htmlFor="check1" className="text-center ">
                  <img src={addIcon} alt="" className="addIcon mt-3" />
                  <p className="mt-2 mb-0">Upload</p>
                  {/* <img src={`${API_BASE_URL}${image.url}`} alt="" /> */}
                </label>
              </div>
            </div>
            {browseImages?.map((image,index) => (
              <React.Fragment key={index}>
                <div className="col-xl-1 mt-2">
                  <div className="itemGallery">
                    <span className="position-absolute">
                      <span className="testSpan"></span>
                      <img className="crossImg" src={cross} alt="" />
                    </span>
                    <label
                      htmlFor="check1"
                      className="upload_img mb-0 position-relative"
                    >
                      <img className="layerImg" src={`${API_BASE_URL}${image.url}`} alt="" />
                    </label>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </CCardBody>
      </CCard>
      </> }
    </>
  )
}
