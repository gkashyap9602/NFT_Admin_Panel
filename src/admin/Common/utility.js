import React from 'react'
import moment from 'moment'
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const showToast=(toastType,message)=> {
    const title = ""
    toastr.options = {
      positionClass: "toast-top-right",
      timeOut: 5000,
      extendedTimeOut: 1000,
      closeButton: true,
    //   debug: debug,
      progressBar: true,
      preventDuplicates: true,
    //   newestOnTop: newestOnTop,
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
      showDuration: 9000,
      hideDuration: 1000,
    };

    // setTimeout(() => toastr.success(Settings updated ), 300)
    //Toaster Types
    if (toastType === "success") toastr.success(message, title);
    else if (toastType === "warning") toastr.warning(message, title);
    else if (toastType === "error") toastr.error(message, title);
    else toastr.info(message, title);
  }

 export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
export const fullDateFormat = (date) => {
  return (
    <>
      {moment(date).format('MMMM DD, YYYY')}
      <br />
      <small>{moment(date).format('h:mm a')}</small>
    </>
  )
};

export const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    ;(rv[_.get(x, key)] = rv[_.get(x, key)] || []).push(x)
    return rv
  }, {})
}

export const StandardPicketDateFormat = (Date) => {
  // console.log(moment(Date).format(('h:mm a')),"hours")
  // console.log( moment(Date).format("DD-MM-YYYY"),"total date")
  // console.log(moment(Date).seconds,"seconds")

  return moment(Date).format('MM/DD/YYYY')

};

export const downloadFile = (dataurl, filename) => {
  try {
    console.log("download side ")
    const a = document.createElement('a')
    a.href = dataurl
    a.setAttribute('download', filename)
    a.click()
  } catch (error) {
    console.log(error, "download file side error")
  }


}
export const changeApiStatus = (inProgress, failMessage) => {
  setApiStatus({
    inProgress,
    failed: !!failMessage,
    failMessage,
  })
}