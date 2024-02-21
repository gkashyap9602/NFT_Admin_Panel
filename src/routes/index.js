import React from "react"
import { Redirect } from "react-router-dom"
// import { useProvider } from "admin/context/Provider"
import { Features } from "admin/Features/Features"
//User Table Component
import Users from "../admin/Users/Users/Users"
import { Profile } from "admin/ProfilePage/Profile"
// import { PaymentMethods } from "admin/PaymentMethods/AddMethod"
import { AddMethod } from "admin/PaymentMethods/AddMethod"
import { ViewMethod } from "admin/PaymentMethods/ViewMethod"
import { UpdateMethod } from "admin/PaymentMethods/UpdateMethod"
//Nft Templates
import { ViewMintingTemplate } from "admin/MintingTemplate/View/ViewMintingTemplate"
import { AddMintingTemplate } from "admin/MintingTemplate/Add/AddMintingTemplate"

//Miniting Templates
import { ManageTemplate } from "admin/NftTemplate/ManageTemplate/Main/ManageTemplate"
import { ViewTemplate} from "admin/NftTemplate/ViewTemplate/Main/ViewTemplate"
//browse images
import { BrowseSection } from "admin/BrowseImages/Main/BrowseSection"
//add category
// import { AddCategory } from "admin/BrowseImages/AddCategory"
import { FeatureType } from "admin/Features/FeatureType"

import { EditMintTemplate } from "admin/MintingTemplate/Edit/EditMintTemplate"
import { UpdateUser } from "admin/Users/UpdateUser/UpdateUser"
import { AddNftTemplate } from "admin/NftTemplate/AddTemplate/Main/AddNftTemplate"
//packages
import { ActivePackages } from "admin/Packages/ActivePackages" 
import { UpdatePackage } from "admin/Packages/UpdatePackage"
// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
import { Collections } from "admin/Users/ViewUser/Collections"

// Dashboard
import Dashboard from "../pages/Dashboard/Dashboard"
// import DashboardSaas from "../pages/Dashboard-saas/index"
// import DashboardCrypto from "../pages/Dashboard-crypto/index"
// import Blog from "../pages/Dashboard-Blog/index"
// import DashboardJob from "../pages/DashboardJob/index"


import ResetPassword from "pages/Authentication/ResetPassword"
const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  // { path: "/dashboard-saas", component: DashboardSaas },
  // { path: "/dashboard-crypto", component: DashboardCrypto },
  // { path: "/blog", component: Blog },
  // { path: "/dashboard-job", component: DashboardJob },


  //Featues
  { path: "/users", component: Users },
  { path: "/view-minting-templates", component: ViewMintingTemplate },
  { path: "/add-minting-templates", component: AddMintingTemplate },
  { path: "/minting-template-update", component: EditMintTemplate },
  { path: "/profile-setting", component: Profile},
  { path: "/user-view/:id", component: Collections},

  {path:"/manage-templates",component:ManageTemplate},
  {path:"/nft-templates",component:ViewTemplate},
  { path: "/browseImages", component: BrowseSection },
  { path: "/active-packages", component: ActivePackages },
  { path: "/features", component: Features },
  { path: "/feature-types", component: FeatureType },
  { path: "/update-package/:id", component: UpdatePackage},
  { path: "/update-user/:id", component: UpdateUser},
  { path: "/add-payment-method", component: AddMethod},
  { path: "/view-payment-method", component: ViewMethod},
  { path: "/update-payment-method/:id", component: UpdateMethod},
  

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/reset-password", component: ResetPassword },

  { path: "/register", component: Register },
]

export { authProtectedRoutes, publicRoutes }
