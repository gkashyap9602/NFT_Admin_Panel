import React from "react"
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import { Row, Col, BreadcrumbItem } from "reactstrap"

const Breadcrumb = props => {
  return (
    <div className="mb-0 p-0 mt-2">
      {/* <Col className="col-12"> */}
        <div style={{padding:"0px"}} className="page-title-box mb-2 d-sm-flex align-items-center justify-content-between">
          {/* <h4 className="mb-sm-0 font-size-18">{props.breadcrumbItem}</h4> */}
          <h5 style={{ fontSize: "18px" }}>{props.breadcrumbItem}</h5>
          
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem>
                <Link to="#">{props.title}</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>
                <Link to="#">{props.breadcrumbItem}</Link>
              </BreadcrumbItem>
            </ol>
          </div>
        </div>
      {/* </Col> */}
    </div>
  )
}

Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string
}

export default Breadcrumb
