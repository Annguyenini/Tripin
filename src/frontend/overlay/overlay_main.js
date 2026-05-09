import { createContext, useContext, useRef, useState } from "react";
import { Loading } from "../custom_components/loading";
import { ErrorMessageBox } from "../custom_components/error";
const OverLayContext = createContext();
import LoadingScreen from "./fetching_loading_screen";
import { SyncBanner } from "./syncing_banner";
export const OverLayProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(null);
  const [errorDataObject, setErrorDataObject] = useState({});
  const [steps, setSteps] = useState(null);
  const allow_type = ["error", "loading", "syncing"];
  const showErrorBox = (title = null, message = null, duration = 3000) => {
    setErrorDataObject({
      title: title,
      message: message,
      duration: duration,
    });
    console.log(errorDataObject);

    setType("error");
    setVisible(true);
  };
  const hideErrorBox = () => {
    setType("error");
    setVisible(false);
  };
  const showLoading = (steps = null) => {
    setSteps(steps);
    setType("loading");
    setVisible(true);
  };
  const hideLoading = () => {
    setType("loading");
    setVisible(false);
  };
  const showSyncing = () => {
    setType("syncing");
    setVisible(true);
  };
  const hideSyncing = () => {
    setType("syncing");
    setVisible(false);
  };
  return (
    <OverLayContext.Provider
      value={{
        showErrorBox,
        hideErrorBox,
        showLoading,
        hideLoading,
        showSyncing,
        hideSyncing,
      }}
    >
      {children}
      {visible && type === "loading" && (
        <LoadingScreen steps={steps}></LoadingScreen>
      )}
      {visible && type === "error" && (
        <ErrorMessageBox
          title={errorDataObject.title}
          message={errorDataObject.message}
          duration={errorDataObject.duration}
        ></ErrorMessageBox>
      )}
      {visible && type === "syncing" && <SyncBanner></SyncBanner>}
    </OverLayContext.Provider>
  );
};
export const UseOverlay = () => {
  const ctx = useContext(OverLayContext);
  if (!ctx) {
    throw new Error("useLoading must be used inside LoadingProvider");
  }
  return ctx;
};
