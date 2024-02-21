const API_BASE_URL = "https://apis-staging.nftbuilder.pro";
// const API_BASE_URL = "http://localhost:8800";

// console.log("hellow")
const getApiUrl = (endpoint) => API_BASE_URL + endpoint;

const LOGIN_API = getApiUrl("/api/admin/login");
const GET_USER_DETAILS_WITH_PAGINATION = getApiUrl("/api/client/getlist");
const GET_USER_COLLECTIONS = getApiUrl("/api/client/collection/list");
const GET_COLLECTION_DETAILS_OF_USER = getApiUrl("/api/client/collection/details");
const GET_USER_DETAILS = getApiUrl("/api/client/profile/details");


const ActiveInactiveFeature = getApiUrl("/api/feature/softdelete");
const ActiveInactiveFeatureType = getApiUrl("/api/feature-type/softdelete");

const ADD_TEMPLATES = getApiUrl("/api/admin/mintingTemplate");
const VIEW_TEMPLATES_WITH_NAME_PARAMS = getApiUrl("/api/admin/mintingTemplate");
const ADD_BROWSE_IMAGE = getApiUrl("/api/admin/browseImages");
const GET_BROWSE_IMAGE_WITH_LAYER_PARAMS = getApiUrl("/api/admin/browseImages");
const ADD_BROWSE_CATEGORY = getApiUrl("/api/admin/browseLayers");
const GET_BROWSE_CATEGORY = getApiUrl("/api/admin/browseLayers");
const CREATE_NFT_TEMPLATE = getApiUrl("/api/nft-template/save")
const ADD_LAYER = getApiUrl("/api/nft-template/add-layer")
const ADD_IMAGES = getApiUrl("/api/nft-template/add-layer-images")
const GENERATE_TEMPLATE = getApiUrl("/api/nft-template/generate")
const GET_TEMPLATE_LIST = getApiUrl("/api/nft-template/getlistAdmin")
const GET_IMAGES_WITH_TEMP_ID_PARAMS = getApiUrl("/api/nft-template/images")
const DELETE_TEMPLATE_WITH_TEMP_ID_PARAMS = getApiUrl("/api/nft-template")
const DELETE_LAYER_WITH_TEMP_ID_PARAMS_AND_LAYER_NAME = getApiUrl("/api/nft-template/layer")
const DELETE_LAYER_IMAGE_WITH_ID_PARAMS = getApiUrl("/api/nft-template/image")

const RENAME_NFT_TEMPLATE = getApiUrl("/api/nft-template/rename")

const DELETE_BROWSEIMAGE_WITH_ID_PARAMS = getApiUrl("/api/admin/browseImage")
const DELETE_BROWSE_LAYER_WITH_ID_PARAMS = getApiUrl("/api/admin/browseLayer")


const UPDATE_LAYER_WITH_DATA_BODY = getApiUrl("/api/nft-template/update-layer")

const UPDATE_BROWSE_LAYER_WITH_DATA_BODY = getApiUrl("/api/admin/updateBrowserLayer")

const ADD_MINTING_TEMPLATE = getApiUrl("/api/template/save")
const GET_MINTING_TEMPLATE = getApiUrl("/api/template/list")
const DELETE_MINTING_TEMPLATE = getApiUrl("/api/template/delete")
const UPDATE_MINTING_TEMPLATE = getApiUrl("/api/template/update")
const GET_MINT_TEMPLATE_DETAIL = getApiUrl("/api/template/detail")

const GET_PROFILE = getApiUrl("/api/admin/profile")
const UPDATE_PROFIE = getApiUrl("/api/admin/updateProfile")
const CHANGE_PASSWORD = getApiUrl("/api/admin/changePassword")
const ACTIVE_INACTIVE_TEMPLATE = getApiUrl("/api/nft-template/activeInactive")
const ACTIVE_INACTIVE_USER = getApiUrl("/api/client/activeInactive")


const CHANGE_LAYER_ORDER = getApiUrl("/api/nft-template/layer-order")

const ADD_PACKAGE = getApiUrl("/api/package/save")
const GET_PACKAGES = getApiUrl("/api/package/list")
const DELETE_PACKAGE = getApiUrl("/api/package/delete")
const UPDATE_PACKAGE = getApiUrl("/api/package/update")
const GET_PACKAGE_DETAILS_WITH_ID = getApiUrl("/api/package/detail")
const DELETE_USER = getApiUrl("/api/client/clientDelete")

const GET_ASSIGN_FEATURE = getApiUrl("/api/package/assign-feature")
const POST_ASSIGN_FEATURE = getApiUrl("/api/package/assign-feature")



const ADD_FEATURE_TYPE = getApiUrl("/api/feature-type/save")
const UPDATE_FEATURE_TYPE = getApiUrl("/api/feature-type/update")
const GET_FEATURE_TYPE_LIST = getApiUrl("/api/feature-type/list")
const DELETE_FEATURE_TYPE = getApiUrl("/api/feature-type/delete")


const FEATURE_LIST_FOR_PACKAGES = getApiUrl("/api/feature/listForPackages")

const GET_FEATURE_LIST = getApiUrl("/api/feature/list")
const DELETE_FEATURE = getApiUrl("/api/feature/deletefeature")
const ADD_FEATURE= getApiUrl("/api/feature/save")
const UPDATE_FEATURE= getApiUrl("/api/feature/update")


 const ADD_PAYMENT_METHOD = getApiUrl("/api/payment/savePaymentMethod")
 const GET_PAYMENT_METHOD = getApiUrl("/api/payment/get")
 const DELETE_PAYMENT_METHOD = getApiUrl("/api/payment/delete")
const FORGOT_PASSWORD = getApiUrl("/api/admin/forgotPassword")
const RESET_PASSWORD = getApiUrl("/api/admin/resetPassword")

export {
  CHANGE_LAYER_ORDER,
  ActiveInactiveFeature,
  ActiveInactiveFeatureType,
  RENAME_NFT_TEMPLATE,
  GET_PACKAGE_DETAILS_WITH_ID,
  UPDATE_PACKAGE,
  GET_ASSIGN_FEATURE,
  POST_ASSIGN_FEATURE,
  FEATURE_LIST_FOR_PACKAGES,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  ADD_PAYMENT_METHOD,
  GET_PAYMENT_METHOD,
  DELETE_PAYMENT_METHOD,
  GET_USER_DETAILS,
  GET_USER_COLLECTIONS,
  GET_COLLECTION_DETAILS_OF_USER,
  UPDATE_FEATURE,
  UPDATE_FEATURE_TYPE,
  GET_FEATURE_LIST,
  DELETE_FEATURE,
  ADD_FEATURE,
  DELETE_FEATURE_TYPE,
  GET_FEATURE_TYPE_LIST,
  ADD_FEATURE_TYPE,
  DELETE_USER,
  DELETE_PACKAGE,
  ADD_PACKAGE,
  GET_PACKAGES,
  ACTIVE_INACTIVE_USER,
  CHANGE_PASSWORD,
  ACTIVE_INACTIVE_TEMPLATE,
  GET_PROFILE,
  UPDATE_PROFIE,
  LOGIN_API,
  ADD_BROWSE_CATEGORY,
  GET_BROWSE_CATEGORY,
  GET_USER_DETAILS_WITH_PAGINATION,
  ADD_TEMPLATES,
  VIEW_TEMPLATES_WITH_NAME_PARAMS,
  ADD_BROWSE_IMAGE,
  GET_BROWSE_IMAGE_WITH_LAYER_PARAMS,
  API_BASE_URL,
  CREATE_NFT_TEMPLATE,
  ADD_IMAGES,
  ADD_LAYER,
  GET_IMAGES_WITH_TEMP_ID_PARAMS,
  GET_TEMPLATE_LIST,
  GENERATE_TEMPLATE,
  DELETE_TEMPLATE_WITH_TEMP_ID_PARAMS,
  DELETE_LAYER_WITH_TEMP_ID_PARAMS_AND_LAYER_NAME,
  DELETE_LAYER_IMAGE_WITH_ID_PARAMS,
  DELETE_BROWSEIMAGE_WITH_ID_PARAMS,
  DELETE_BROWSE_LAYER_WITH_ID_PARAMS,
  UPDATE_LAYER_WITH_DATA_BODY,
  DELETE_MINTING_TEMPLATE,
  GET_MINTING_TEMPLATE,
  ADD_MINTING_TEMPLATE,
  UPDATE_MINTING_TEMPLATE,
  GET_MINT_TEMPLATE_DETAIL,
  UPDATE_BROWSE_LAYER_WITH_DATA_BODY
};
