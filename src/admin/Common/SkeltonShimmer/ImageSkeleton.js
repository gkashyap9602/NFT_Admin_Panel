import { CCard, CCardBody } from "@coreui/react"
import { Skeleton } from "@mui/material"
import React from "react"

export const ImageSkeleton = () => {
  const data = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
    {
      id: 7,
    },
    {
      id: 8,
    },
    
  ]

  return (
      <CCard className="cardImage mb-0 mt-2">
        <CCardBody className="template_img">
          <div className="grid-system row mt-0 ">
            {data.map((template, index) => (
              <React.Fragment key={index}>
                <div className="col-lg-3 mt-2">
                  <div className="itemLayer mb-3 position-relative">
                  <div htmlFor="check1" className="card_img">
                    
                    <Skeleton
                      variant="rounded"
                      width={178}
                      height={178}
                    //   className="mb-3"
                    />
                  
                  </div>
                  <div className="card_text">
                  <Skeleton
                    variant="rounded"
                    width={125}
                    height={24}
                    // className="my-3"
                    style={{margin : "auto"}}
                  />
                  </div>

                  </div>                  
                </div>
              </React.Fragment>
            ))}
          </div>
        </CCardBody>
      </CCard>
  )
}
