import React, { useEffect, useState } from "react"
import "./templates.css"
import style from "../../../Common/Pagination/Pagination.module.css"
import { PaginationComponent } from "admin/Common/Pagination/PaginationComponent"
import { CCard, CCardBody } from "@coreui/react"
import { API_BASE_URL } from "admin/Api/api"
import editNft from "../../../../assets/editNft2.gif"
import { Loader } from "admin/Loader/Loader"
import { TemplateMenu } from "../TemplateMenu/TemplateMenu"
import { useProvider } from "admin/context/ProviderApp"

export const Templates = (props) => {
  const { templates, setCurrentPage, currentPage, page } = useProvider()
  const { setLoader, loader, getTemplates } = props
  // const [loader,setLoader] = useState(false)
  // console.log(templates,"templates- side ")

  return (
    <>

    {templates.length===0?(<>
      <CCard className="cardImage mb-0 mt-2">

      <span style={{padding:"12px"}} className="text-center">There are no records to display</span>
      </CCard>

    </>):
      <CCard className="cardImage mb-0 mt-2">
        <CCardBody className="template_img">

          <div style={{ minHeight: "512px" }} className="grid-system row mt-0 " >
               


            {templates.map((template, index) => (
              <React.Fragment key={index}>

                <div className="nftTemplateCard col-lg-3 mt-1 ">

                  <div className="itemLayer mb-1 position-relative">
                    <div className={template.isActive ? "ribbon_badge" : "ribbon_badge_inactive"}> {template.isActive ? "Active" : "InActive"}</div>
                    <TemplateMenu getTemplates={getTemplates} template={template} loader={loader} setLoader={setLoader} />

                    <div htmlFor="check1" className="card_img">
                      {/* <img src={panda} alt="" className="img-fluid" /> */}
                      {!template.preview ?
                        <img className="editNftImage" src={editNft} alt="" /> :
                        <img src={`${API_BASE_URL}${template.preview}`} alt="" />}
                    </div>
                    <div className="card_text">{template.name}</div>
                  </div>
                </div>

              </React.Fragment>
            ))}

          </div>
          <div className={style.pagination}>
            {/* {console.log(page.totalItems, "page.totalItems", currentPage, "currentPage", page, "page")} */}
           
            <PaginationComponent itemsCount={page.totalItems} itemsPerPage={page.pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
          </div>
        </CCardBody>
      </CCard>
    }
    </>
  )
}
