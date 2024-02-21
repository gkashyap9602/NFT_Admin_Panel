import React,{useState,useEffect} from 'react'

export const CSwitchCustom = (props) => {
    const {isActive,id,onChange}  = props
    //  console.log(isActive,"isActive")
    //  console.log(id,"id")
    const [show, setShow] = useState(false)
    const [active, setActive] = useState(isActive)
    
    useEffect(() => {
      if (!show) {
        setActive(isActive)
      }
    }, [])
    
    useEffect(() => {
      if (!show) {
        setActive(isActive)
      }
    }, [show])

    
    const handleChangeStatus = async (_id,_status) => {
        console.log(_id,_status,"_id and status")
        let formdata = {
          status:_status.toString(),
          id: _id,
        }

        onChange(formdata,setShow,setActive)
        
      }
//ends here

const onChangeHandler = event => {
  console.log(event.target.checked, "onchange side ")
  let id = event.target.value
  if (!event.target.checked) {
    setActive(false)
  } else {
    setActive(true)
  }
  handleChangeStatus(id,event.target.checked)
}

    return (
        <>
            <div className="square-switch mytoggle">
                <input
                    type="checkbox"
                    id={`square-switch${id}`}
                    switch="success"
                    // defaultChecked={Boolean(isActive)}
                    checked={Boolean(active)}
                    value={id}
                    onChange = {onChangeHandler}
                />
                <label
                    htmlFor={`square-switch${id}`}
                    data-on-label="Active"
                    data-off-label="Inactive"
                />
            </div>
        </>
    )
}
