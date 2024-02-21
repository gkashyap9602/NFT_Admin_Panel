import React, { useState, useEffect } from "react"
import { Row, Col, Container } from "reactstrap"
import { Templates } from "../Templates/Templates"
import * as Yup from "yup"
import { CreateProject } from "admin/Modal/CreateNft/CreateProject"
import { useProvider } from "admin/context/ProviderApp"
import { ImageSkeleton } from "admin/Common/SkeltonShimmer/ImageSkeleton"

export const ViewTemplate = () => {
  //meta title
  // document.title = "NFT Templates"
  const { setSelectedLayer, loader, setLoader } =
    useProvider()

  const SignupSchema = Yup.object().shape({
    layerName: Yup.string().required("Please Enter Category Name"),
  })

  useEffect(() => {
    setSelectedLayer({
      layerId: "",
      layerName: "",
    })
  }, [])

  const [showAddTemplate, setShowAddTemplate] = useState(false)

  // console.log(loader,"loader view template side ")
  return (
    <>
      <CreateProject
        show={showAddTemplate}
        setShow={setShowAddTemplate}
        setLoader={setLoader}
        loader={loader}
      />

      <div className="page-content" style={{ padding: 0 }}>
        <Container fluid>
          <div className="div1 mb-2 d-flex justify-content-between align-items-center">
            {/* <strong style={{fontWeight:"bolder",fontSize: "initial"}}>Nft Templates</strong> */}
            <h5 style={{ fontSize: "18px" }}>NFT Templates</h5>

            <button
              disabled={loader}
              className="btn btn-primary"
              onClick={() => {
                setShowAddTemplate(true)
              }}
            >
              Add Template
            </button>
          </div>
          <div>
            <>
              {loader ? (
                <ImageSkeleton />
              ) : (
                <Templates loader={loader} setLoader={setLoader} />
              )}
            </>
          </div>
        </Container>
      </div>
    </>
  )
}
