import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { authStyle } from "../styles/auth_style.js";
import AuthHandler from "../app-core/flow/auth_handler.js";
import AppFlow from "../app-core/flow/app_flow.js";
import { navigate } from "./custom_function/navigationService.js";
import { OverlayCard } from "./custom_function/overlay_card.js";
import { UseOverlay } from "./overlay/overlay_main.js";
import GoogleAuth from "./provider_auth/google.js";
import {
  validateLogin,
  validateSignup,
  validateVerification,
  validateOAuthComplete,
} from "./input_validations/auth_validation.js"; // ← adjust path to match your project
import ResetPassword from "./auth/reset_password.js";

const { width, height } = Dimensions.get("window");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const randCoord = () => {
  const lat = (Math.random() * 180 - 90).toFixed(4);
  const lng = (Math.random() * 360 - 180).toFixed(4);
  return `${lat > 0 ? "+" : ""}${lat}° / ${lng > 0 ? "+" : ""}${lng}°`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SnapLabel() {
  const opacity = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    const loop = () => {
      opacity.setValue(0);
      slideX.setValue(-16);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(slideX, {
            toValue: 0,
            tension: 80,
            friction: 11,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(2600),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ]).start(({ finished }) => {
        if (finished) loop();
      });
    };
    loop();
  }, []);

  return (
    <Animated.View
      style={[fr.snapWrap, { opacity, transform: [{ translateX: slideX }] }]}
      pointerEvents="none"
    >
      <Text style={fr.snapText}>Snap your trip.</Text>
    </Animated.View>
  );
}

function CoordsLabel() {
  const [coords, setCoords] = useState(randCoord());
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cycle = () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCoords(randCoord());
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    };
    const t = setInterval(cycle, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <Animated.View style={[fr.coordsWrap, { opacity }]} pointerEvents="none">
      <Text style={fr.coordsLabel}>· coordinates ·</Text>
      <Text style={fr.coordsText}>{coords}</Text>
    </Animated.View>
  );
}

// Renders a list of validation error strings
function ValidationErrors({ errors }) {
  if (!errors?.length) return null;
  return (
    <View style={{ marginBottom: 4 }}>
      {errors.map((msg, i) => (
        <Text key={i} style={fr.errorText}>
          {msg}
        </Text>
      ))}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export const AuthScreen = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

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

  // ── clear errors + sensitive fields when switching panels ──
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

  useEffect(() => {
    (async () => {
      showLoading();
      await AppFlow.tokenAuthorization();
      hideLoading();
    })();
  }, []);

  // ── handlers ──────────────────────────────────────────────────────────────
  const completeForm = (pending_token, id_token, provider) => {
    setShowCompleteForm(true);

    setProvider(provider);
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

    showLoading();
    const res = await AuthHandler.signUpProviderHandler(
      pendingtoken,
      displayName,
      username,
      password,
    );
    hideLoading();

    if (res.status === 200) {
      showLoading();
      const login = await AuthHandler.providerVerifyHandler(idtoken, provider);
      if (login.status === 200) {
        await AppFlow.onAuthSuccess();
      }
      hideLoading();
      return;
    }

    const msg =
      res.status === 500
        ? res.message
        : res.status === 429
          ? "Too many attempts — please try again shortly."
          : "Server error. Please try again.";
    // setPendingToken(null)
    // setIdToken(null)
    setErrors([msg]);
  };
  const handleLogin = async () => {
    setErrors([]);
    const errs = validateLogin({ username, password });
    if (errs.length) {
      setErrors(errs);
      return;
    }

    showLoading();
    const res = await AuthHandler.loginHandler(username, password);
    hideLoading();

    if (res.status === 200) {
      showLoading();
      await AppFlow.onAuthSuccess();
      hideLoading();
      return;
    }

    const msg =
      res.status === 401
        ? res.message
        : res.status === 429
          ? "Too many attempts — please try again shortly."
          : "Server error. Please try again.";
    setErrors([msg]);
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

    showLoading();
    const res = await AuthHandler.signUpHandler(
      email,
      displayName,
      username,
      password,
    );
    hideLoading();

    if (!res.ok || res.status === 401) {
      setErrors([res.message]);
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

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Polaroid frame ── */}
      <View style={fr.outerFrame}>
        <View style={fr.topBar}>
          <SnapLabel />
          <CoordsLabel />
        </View>

        <View style={fr.photoArea}>
          <Text style={fr.brandText}>Tripping</Text>
        </View>

        {/* S-curve route divider */}
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
          <GoogleAuth pending={completeForm}></GoogleAuth>
        </View>
      </View>
      {showCompleteForm && (
        <OverlayCard title="Complete setup account" onClose={closeAll}>
          <ValidationErrors errors={errors} />
          <TextInput
            style={authStyle.input}
            placeholder="Display name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            style={authStyle.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={authStyle.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={authStyle.input}
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={authStyle.submitButton}
            onPress={handleProviderSignup}
          >
            <Text style={authStyle.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </OverlayCard>
      )}
      {/* ── Login overlay ── */}
      {showLogin && (
        <OverlayCard title="LOGIN" onClose={closeAll}>
          <ValidationErrors errors={errors} />
          <TextInput
            style={authStyle.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={authStyle.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={authStyle.submitButton}
            onPress={handleLogin}
          >
            <Text style={authStyle.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <GoogleAuth action="signin" />
          <TouchableOpacity onPress={openSignup}>
            <Text style={fr.linkText}>Create an account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowResetPassword(true)}>
            <Text style={fr.linkText}>Forgot password?</Text>
          </TouchableOpacity>
        </OverlayCard>
      )}

      {/* ── Signup overlay ── */}
      {showSignup && (
        <OverlayCard title="SIGN UP" onClose={closeAll}>
          <ValidationErrors errors={errors} />
          <TextInput
            style={authStyle.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={authStyle.input}
            placeholder="Display name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            style={authStyle.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={authStyle.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={authStyle.input}
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={authStyle.submitButton}
            onPress={handleSignup}
          >
            <Text style={authStyle.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openLogin}>
            <Text style={fr.linkText}>Already have an account?</Text>
          </TouchableOpacity>
        </OverlayCard>
      )}

      {/* ── Verification overlay ── */}
      {showVerification && (
        <OverlayCard title="Confirm Code" onClose={closeAll}>
          <ValidationErrors errors={errors} />
          <TextInput
            style={authStyle.input}
            placeholder="6-digit code"
            value={verifyCode}
            onChangeText={setVerifyCode}
            inputMode="numeric"
            maxLength={6}
          />
          <TouchableOpacity
            style={authStyle.submitButton}
            onPress={handleVerification}
          >
            <Text style={authStyle.submitButtonText}>Verify</Text>
          </TouchableOpacity>
        </OverlayCard>
      )}
      {showResetPassword && (
        <ResetPassword
          onClose={() => setShowResetPassword(false)}
        ></ResetPassword>
      )}
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const FRAME_W = width * 0.9;
const FRAME_H = height * 0.9;
const PHOTO_H = FRAME_H * 0.68;

const fr = StyleSheet.create({
  outerFrame: {
    position: "absolute",
    top: (height - FRAME_H) / 2,
    left: (width - FRAME_W) / 2,
    width: FRAME_W,
    height: FRAME_H,
    backgroundColor: "#f5f0e8",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 0,
    elevation: 10,
  },
  topBar: {
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginBottom: 4,
  },
  snapWrap: { flex: 1 },
  snapText: {
    fontFamily: "mainfont",
    fontSize: 15,
    color: "#1a1a1a",
    letterSpacing: 0.3,
    opacity: 0.72,
  },
  coordsWrap: { alignItems: "flex-end" },
  coordsLabel: {
    fontFamily: "mainfont",
    fontSize: 7,
    color: "rgba(26,26,26,0.4)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  coordsText: {
    fontFamily: "mainfont",
    fontSize: 15,
    color: "rgba(26,26,26,0.65)",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  photoArea: {
    width: "100%",
    height: PHOTO_H - 52,
    backgroundColor: "#0d0c0a",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontFamily: "mainfont",
    fontSize: 52,
    color: "#f0f0ec",
    letterSpacing: 2,
    textShadowColor: "#000",
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 0,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 6,
  },
  pin: { alignItems: "center", width: 20 },
  pinHead: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  pinDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#f5f0e8",
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#1a1a1a",
    marginTop: -1,
  },
  dashTrack: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 28,
    overflow: "hidden",
  },
  dash: {
    width: 6,
    height: 2.5,
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
    opacity: 0.5,
  },
  captionStrip: { flex: 1, justifyContent: "center", paddingTop: 10 },
  btnRow: { flexDirection: "row", gap: 16 },
  btn: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
  },
  btnText: {
    fontFamily: "mainfont",
    fontSize: 16,
    color: "#f5f0e8",
    letterSpacing: 1.5,
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#1a1a1a",
  },
  btnTextOutline: { color: "#1a1a1a" },
  errorText: {
    textAlign: "center",
    marginTop: 6,
    color: "#CC3A2A",
    fontSize: 12,
  },
  linkText: { textAlign: "center", marginTop: 10, fontSize: 13, color: "#555" },
});
