import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import AppFlow from "../../app-core/flow/app_flow.ts";
import { OverlayCard } from "../overlay/overlay_card.js";
import { UseOverlay } from "../overlay/overlay_main.js";
import GoogleAuth from "./provider_auth/google.js";
import ResetPassword from "./reset_password.js";
import { SnapLabel } from "./components/snap_label.js";
import { CoordsLabel } from "./components/coords_label.js";
import {
  LoginForm,
  SignupForm,
  VerificationForm,
  CompleteForm,
} from "./components/forms.js";
import { useAuthState } from "./use_auth_state.js";
import { fr, PHOTO_H } from "../../styles/auth_style.js";
console.log("test", AppFlow);
export const AuthScreen = () => {
  const { showLoading, hideLoading, showErrorBox, hideErrorBox } = UseOverlay();
  const {
    showLogin,
    showSignup,
    showVerification,
    showCompleteForm,
    showResetPassword,
    setShowResetPassword,
    loginWithEmail,
    setLoginWithEmail,
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
    openLogin,
    openSignup,
    closeAll,
    clearAllDataFields,
    completeForm,
    handleLogin,
    handleSignup,
    handleVerification,
    handleProviderSignup,
  } = useAuthState();
  const loadingRef = useRef();

  const loadingSteps = [
    "Checking you credential",
    "Making sure you are not a robot",
    "Nanana",
  ];
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
  useEffect(() => {
    (async () => {
      AuthLoading();
      await AppFlow.tokenHandler().then(() => {
        HideAuthLoading();
      });
    })();
  }, []);

  return (
    <>
      <View style={fr.outerFrame}>
        <View style={fr.topBar}>
          <SnapLabel />
          <CoordsLabel />
        </View>
        <View style={fr.photoArea}>
          <Text style={fr.brandText}>Tripping</Text>
        </View>
        <View style={fr.routeRow} pointerEvents="none">
          <View style={fr.pin}>
            <View style={fr.pinHead}>
              <View style={fr.pinDot} />
            </View>
            <View style={fr.pinTail} />
          </View>
          <View style={fr.dashTrack}>
            {Array.from({ length: 22 }).map((_, i) => (
              <View
                key={i}
                style={[
                  fr.dash,
                  { marginTop: Math.sin((i / 21) * Math.PI * 2.2) * 7 },
                ]}
              />
            ))}
          </View>
          <View style={fr.pin}>
            <View style={fr.pinHead}>
              <View style={fr.pinDot} />
            </View>
            <View style={fr.pinTail} />
          </View>
        </View>
        <View style={fr.captionStrip}>
          <View style={fr.btnRow}>
            <TouchableOpacity style={fr.btn} onPress={openLogin}>
              <Text style={fr.btnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[fr.btn, fr.btnOutline]}
              onPress={openSignup}
            >
              <Text style={[fr.btnText, fr.btnTextOutline]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <GoogleAuth pending={completeForm} errorTrigger={showErrorBox} />
        </View>
      </View>

      {showCompleteForm && (
        <OverlayCard title="Complete setup account" onClose={closeAll}>
          <CompleteForm
            displayName={displayName}
            setDisplayName={setDisplayName}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errors={errors}
            onSubmit={handleProviderSignup}
          />
        </OverlayCard>
      )}

      {showLogin && (
        <OverlayCard title="LOGIN" onClose={closeAll}>
          <LoginForm
            loginWithEmail={loginWithEmail}
            setLoginWithEmail={setLoginWithEmail}
            email={email}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            errors={errors}
            onSubmit={handleLogin}
            onSignup={openSignup}
            onForgot={() => setShowResetPassword(true)}
            clearAllDataFields={clearAllDataFields}
            GoogleAuth={GoogleAuth}
          />
        </OverlayCard>
      )}

      {showSignup && (
        <OverlayCard title="SIGN UP" onClose={closeAll}>
          <SignupForm
            email={email}
            setEmail={setEmail}
            displayName={displayName}
            setDisplayName={setDisplayName}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errors={errors}
            onSubmit={handleSignup}
            onLogin={openLogin}
          />
        </OverlayCard>
      )}

      {showVerification && (
        <OverlayCard title="Confirm Code" onClose={closeAll}>
          <VerificationForm
            verifyCode={verifyCode}
            setVerifyCode={setVerifyCode}
            errors={errors}
            onSubmit={handleVerification}
          />
        </OverlayCard>
      )}

      {showResetPassword && (
        <ResetPassword onClose={() => setShowResetPassword(false)} />
      )}
    </>
  );
};
