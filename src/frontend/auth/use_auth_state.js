import { useRef, useState } from "react";
import AuthHandler from "../../app-core/flow/auth_handler.js";
import AppFlow from "../../app-core/flow/app_flow.ts";
import { UseOverlay } from "../overlay/overlay_main.js";
import {
  validateLogin,
  validateSignup,
  validateVerification,
  validateOAuthComplete,
} from "../input_validations/auth_validation.js";

export function useAuthState() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const [idtoken, setIdToken] = useState(null);
  const [pendingtoken, setPendingToken] = useState(null);
  const [provider, setProvider] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [errors, setErrors] = useState([]);
  const { showLoading, hideLoading } = UseOverlay();
  const loadingRef = useRef(null);
  const loadingSteps = ["Checking your credential", "Nanana"];
  const AuthLoading = () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    showLoading(() => HideAuthLoading, loadingSteps);
  };
  const HideAuthLoading = () => {
    console.log("end", loadingRef.current);
    if (!loadingRef.current) return;
    console.log("end");

    hideLoading();
    loadingRef.current = false;
  };
  const openLogin = () => {
    setShowSignup(false);
    setErrors([]);
    setPassword("");
    setConfirmPassword("");
    setShowLogin(true);
  };

  const openSignup = () => {
    setShowLogin(false);
    setErrors([]);
    setPassword("");
    setConfirmPassword("");
    setShowSignup(true);
  };

  const closeAll = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowVerification(false);
    setShowCompleteForm(false);
    setErrors([]);
  };

  const clearAllDataFields = () => {
    setUsername("");
    setPassword("");
    setDisplayName("");
    setConfirmPassword("");
    setEmail("");
  };

  const completeForm = (pending_token, id_token, prov) => {
    setShowCompleteForm(true);
    setProvider(prov);
    setPendingToken(pending_token);
    setIdToken(id_token);
  };

  const handleProviderSignup = async () => {
    setErrors([]);
    const errs = validateOAuthComplete({
      username,
      displayName,
      password,
      confirmPassword,
    });
    if (errs.length) {
      setErrors(errs);
      return;
    }
    AuthLoading();
    const res = await AuthHandler.signUpProviderHandler(
      pendingtoken,
      displayName,
      username,
      password,
    );
    HideAuthLoading();
    if (res.status === 200) {
      AuthLoading();
      const login = await AuthHandler.providerVerifyHandler(idtoken, provider);
      if (login.status === 200) AppFlow.onAuthSuccess();
      HideAuthLoading();
      return;
    }
    setErrors([
      res.status === 429
        ? "Too many attempts — please try again shortly."
        : res.data?.message,
    ]);
  };

  const handleLogin = async () => {
    setErrors([]);
    const errs = validateLogin({ username, password, email });
    if (errs.length) {
      setErrors(errs);
      return;
    }
    AuthLoading();
    const res = await AuthHandler.loginHandler(username, email, password);
    HideAuthLoading();
    if (res.status === 200) {
      AuthLoading();
      AppFlow.onAuthSuccess();
      HideAuthLoading();
      return;
    }
    setErrors([
      res.status === 429
        ? "Too many attempts — please try again shortly."
        : `${res.ok ? res.data.message : "Connection Lost"}`,
    ]);
  };

  const handleSignup = async () => {
    setErrors([]);
    const errs = validateSignup({
      email,
      username,
      displayName,
      password,
      confirmPassword,
    });
    if (errs.length) {
      setErrors(errs);
      return;
    }
    AuthLoading();
    const res = await AuthHandler.signUpHandler(
      email,
      displayName,
      username,
      password,
    );
    HideAuthLoading();
    if (!res.ok || res.status !== 201) {
      console.log(res);
      setErrors([res.data?.message]);
      return;
    }
    setShowSignup(false);
    setShowVerification(true);
  };

  const handleVerification = async () => {
    setErrors([]);
    const errs = validateVerification({ verifyCode });
    if (errs.length) {
      setErrors(errs);
      return;
    }
    const res = await AuthHandler.emailVerificationHandler(email, verifyCode);
    if (!res.ok || res.status !== 200) {
      setErrors([res.message || "Verification failed."]);
      return;
    }
    setShowVerification(false);
    openLogin();
  };

  return {
    // visibility
    showLogin,
    showSignup,
    showVerification,
    showCompleteForm,
    showResetPassword,
    setShowResetPassword,
    // login
    loginWithEmail,
    setLoginWithEmail,
    // fields
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    displayName,
    setDisplayName,
    verifyCode,
    setVerifyCode,
    errors,
    // actions
    openLogin,
    openSignup,
    closeAll,
    clearAllDataFields,
    completeForm,
    handleLogin,
    handleSignup,
    handleVerification,
    handleProviderSignup,
  };
}
