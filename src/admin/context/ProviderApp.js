import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { GET_TEMPLATE_LIST } from "admin/Api/api"
export const GlobalNftContext = createContext()

export const ProviderApp = ({ children }) => {
  const [selectedLayer, setSelectedLayer] = useState({
    layerId: "",
    layerName: "",
  })
  const [selectedBrowseLayer, setSelectedBrowseLayer] = useState({
    layerId: "",
    layerName: "",
  })
  const [page, setPage] = useState({ current: 1, totalItems: 0, pageSize: 8 })
  const [currentPage,setCurrentPage] = useState(1)

  const [loader, setLoader] = useState(false)
  const [templates, setTemplates] = useState([])
  const [currentTemplate, setCurrentTemplate] = useState([])

  const [templateName, setTemplateName] = useState("")
  const [templateId, setTemplateId] = useState("")
  const [templateCreated, setTemplateCreated] = useState(false)
  const [layerAdded, setLayerAdded] = useState(false)
  const [templateDeleted, setTemplateDeleted] = useState(false)
  const [layerDeleted, setLayerDeleted] = useState(false)
  const [previewGenerated, setPreviewGenerated] = useState(false)
  const [layerUpdated, setLayerUpdated] = useState(false)
  const [addMintTemplate, setAddMintTemplate] = useState(false)
  const [active, setActive] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    // console.log(location.pathname,"pathName")
    let user = JSON.parse(localStorage.getItem("authUser"))
    if (user) {
      getTemplates()
    }
    // if(loginSuccess){
    // }
  }, [
    loginSuccess,
    // active,
    templateCreated,
    // layerAdded,
    // templateDeleted,
    // layerDeleted,
    previewGenerated,
    // layerUpdated,
    currentPage,
  ])

  const getTemplates = async () => {
    try {
      setLoader(true)
      let user = JSON.parse(localStorage.getItem("authUser"))
      // console.log(currentPage, "currentPage--context side")
      // ?pageNumber=${currentPage}&pageSize=${page.pageSize}
      let response = await axios.get(`${GET_TEMPLATE_LIST}?pageNumber=${currentPage}&pageSize=${page.pageSize}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })

      // console.log(response,"response--get templates context side")
      if (response.status === 200) {
        // console.log(response, "response get template side ")
        setTemplates(response.data.data.items)
        setTemplateCreated(false)
        setLayerAdded(false)
        // setTemplateDeleted(false)
        setLayerDeleted(false)
        setPreviewGenerated(false)
        setLayerUpdated(false)
        // setActive(false)
        
        setPage({...page,totalItems:response.data.data.totalItems})

        //   toast.success(response.data?.message)
        //   setLayer(true)
      }
    } catch (err) {
      // console.log(err, "error Get Templates side  ")
      if (err.message === "Network Error") {
        toast.error("Network Error")
      }
      toast.error(err.response ? err.response.data.error : err)
    } finally {
      setLoader(false)
    }
  }

  // console.log(selectedLayer, "selectedLayer- Context side")
  // console.log(templates, "templates- context side")
  //  .log(currentTemplate, "currentTemplate- context side")
  // console.log(templateId, "templateId- context side")
  // console.log(layerUpdated, "layerUpdated- context side")

  return (
    <GlobalNftContext.Provider
      value={{
        setSelectedLayer,
        selectedLayer,
        loader,
        setLoader,
        templates,
        setTemplates,
        setTemplateId,
        templateId,
        setCurrentTemplate,
        currentTemplate,
        setTemplateName,
        templateName,
        templateCreated,
        setTemplateCreated,
        setLayerAdded,
        layerAdded,
        setTemplateDeleted,
        setLayerDeleted,
        layerDeleted,
        setPreviewGenerated,
        setLayerUpdated,
        layerUpdated,
        setAddMintTemplate,
        addMintTemplate,
        setSelectedBrowseLayer,
        selectedBrowseLayer,
        setActive,
        getTemplates,
        setLoginSuccess,
        loginSuccess,
        page,
        setPage,
        setCurrentPage,
        currentPage
      }}
    >
      {children}
    </GlobalNftContext.Provider>
  )
}
export function useProvider() {
  return useContext(GlobalNftContext)
}
