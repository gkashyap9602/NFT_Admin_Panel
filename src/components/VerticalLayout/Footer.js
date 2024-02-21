import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
      <div>

            {/* <Container fluid={true}> */}
          <Row>
            {/* <Col md={6}>{new Date().getFullYear()} ©</Col> */}
            <Col md={7}>
              <div className="text-sm-end d-none d-sm-block">
              {new Date().getFullYear()} © Created by BlockTech Brew
              </div>
            </Col>
          </Row>
        {/* </Container> */}
        </div>
 
      </footer>
    </React.Fragment>
  )
}

export default Footer
