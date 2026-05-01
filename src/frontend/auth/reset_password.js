import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { validate } from "../input_validations/auth_validation";
import { OverlayCard } from "../custom_function/overlay_card";
import { colors } from "../../styles/function/overlay_card.js";
import AuthService from "../../backend/services/auth";

const STEPS = ["Email", "Code", "Password"];

export default function ResetPassword({ onClose }) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [session_token, set_session_token] = useState(null);
  const codeRefs = useRef([]);

  const clearError = () => setError("");

  const goNext = async () => {
    setError("");
    if (step === 0) {
      if (!validate.email(email.trim())) {
        setError("Enter a valid email address.");
        return;
      }
      if (!(await handleRequestReset())) return;
      setStep(1);
    } else if (step === 1) {
      if (!validate.verifyCode(code.join(""))) {
        setError("Enter the full 6-digit code.");
        return;
      }

      if (!(await handleRequestResetVerify())) return;
      setStep(2);
    } else if (step === 2) {
      console.log(pw1);
      if (!validate.password(pw1)) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (pw1 !== pw2) {
        setError("Passwords don't match.");
        return;
      }
      if (!(await handleRequestResetComplete())) return;

      setDone(true);
    }
  };
  const handleRequestReset = async () => {
    try {
      const respond = await AuthService.requestResetPassword(email);
      if (respond.status != 200 || !respond.ok) {
        return false;
      }
      const data = respond?.data;
      set_session_token(data?.token);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const handleRequestResetVerify = async () => {
    try {
      const respond = await AuthService.requestResetPasswordVerify(
        code.join(""),
        session_token,
      );
      if (respond.status != 200 || !respond.ok) {
        return false;
      }
      const data = respond?.data;
      set_session_token(data?.token);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const handleRequestResetComplete = async () => {
    console.log(pw1, session_token);
    try {
      const respond = await AuthService.requestResetPasswordReset(
        pw1,
        session_token,
      );
      if (respond.status != 200 || !respond.ok) {
        return false;
      }
      set_session_token(null);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const handleCodeChange = (val, i) => {
    const digit = val.replace(/[^0-9]/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const handleCodeKey = (e, i) => {
    if (e.nativeEvent.key === "Backspace" && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  };

  const strengthScore = () => {
    let s = 0;
    if (pw1.length >= 8) s++;
    if (/[A-Z]/.test(pw1)) s++;
    if (/[0-9]/.test(pw1)) s++;
    if (/[^A-Za-z0-9]/.test(pw1)) s++;
    return s;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "",
    colors.roseDark,
    colors.peachDark,
    colors.sageDark,
    colors.skyDark,
  ];

  const score = strengthScore();

  const title = done
    ? "All done!"
    : ["Reset password", "Check your email", "New password"][step];

  return (
    <OverlayCard title={title} onClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Step indicator */}
        {!done && (
          <View style={s.stepRow}>
            {STEPS.map((label, i) => (
              <View key={i} style={s.stepItem}>
                <View
                  style={[
                    s.dot,
                    i < step && s.dotDone,
                    i === step && s.dotActive,
                  ]}
                >
                  {i < step ? (
                    <Text style={s.dotCheckText}>✓</Text>
                  ) : (
                    <Text style={[s.dotText, i === step && s.dotTextActive]}>
                      {i + 1}
                    </Text>
                  )}
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[s.line, i < step && s.lineDone]} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Step 0 — Email */}
        {!done && step === 0 && (
          <View>
            <Text style={s.sub}>Enter the email linked to your account.</Text>
            <Text style={s.label}>Email address</Text>
            <TextInput
              style={s.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textHint}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                clearError();
              }}
            />
          </View>
        )}

        {/* Step 1 — Code */}
        {!done && step === 1 && (
          <View>
            <Text style={s.sub}>
              We sent a 6-digit code to{"\n"}
              {email}
            </Text>
            <View style={s.codeRow}>
              {code.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => (codeRefs.current[i] = r)}
                  style={s.codeBox}
                  value={digit}
                  onChangeText={(v) => {
                    handleCodeChange(v, i);
                    clearError();
                  }}
                  onKeyPress={(e) => handleCodeKey(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Text style={s.resend}>
                Didn't get it? <Text style={s.resendLink}>Resend code</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2 — New Password */}
        {!done && step === 2 && (
          <View>
            <Text style={s.label}>New password</Text>
            <TextInput
              style={s.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textHint}
              secureTextEntry
              value={pw1}
              onChangeText={(v) => {
                setPw1(v);
                clearError();
              }}
            />
            {pw1.length > 0 && (
              <View style={s.strengthWrap}>
                <View style={s.strengthTrack}>
                  <View
                    style={[
                      s.strengthBar,
                      {
                        width: `${score * 25}%`,
                        backgroundColor: strengthColor[score],
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[s.strengthLabel, { color: strengthColor[score] }]}
                >
                  {strengthLabel[score]}
                </Text>
              </View>
            )}
            <Text style={[s.label, { marginTop: 14 }]}>Confirm password</Text>
            <TextInput
              style={s.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textHint}
              secureTextEntry
              value={pw2}
              onChangeText={(v) => {
                setPw2(v);
                clearError();
              }}
            />
          </View>
        )}

        {/* Success */}
        {done && (
          <View style={s.successWrap}>
            <View style={s.checkCircle}>
              <Text style={s.checkMark}>✓</Text>
            </View>
            <Text style={s.sub}>
              Your password has been reset. You can now log in with your new
              password.
            </Text>
          </View>
        )}

        {/* Error */}
        {!!error && <Text style={s.error}>{error}</Text>}

        {/* Button */}
        <TouchableOpacity
          style={s.btn}
          onPress={done ? onClose : goNext}
          activeOpacity={0.8}
        >
          <Text style={s.btnText}>
            {done
              ? "Back to login"
              : step === 2
                ? "Reset password"
                : "Continue →"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </OverlayCard>
  );
}

const s = StyleSheet.create({
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  dotActive: {
    borderColor: colors.peachMid,
    backgroundColor: colors.peach,
  },
  dotDone: {
    borderColor: colors.peachMid,
    backgroundColor: colors.peachMid,
  },
  dotText: {
    fontFamily: "DMMono-Regular",
    fontSize: 11,
    color: colors.textMuted,
  },
  dotTextActive: {
    color: colors.peachDark,
  },
  dotCheckText: {
    fontFamily: "DMMono-Regular",
    fontSize: 11,
    color: colors.bg,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.divider,
    marginHorizontal: 4,
  },
  lineDone: {
    backgroundColor: colors.peachMid,
  },
  sub: {
    fontFamily: "DMMono-Regular",
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontFamily: "DMMono-Regular",
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 10,
    padding: 12,
    fontFamily: "DMMono-Regular",
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  codeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  codeBox: {
    flex: 1,
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 10,
    fontFamily: "DMMono-Regular",
    fontSize: 22,
    color: colors.text,
  },
  resend: {
    fontFamily: "DMMono-Regular",
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 8,
  },
  resendLink: {
    color: colors.peachDark,
    textDecorationLine: "underline",
  },
  strengthWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
    marginTop: 4,
  },
  strengthTrack: {
    flex: 1,
    height: 3,
    backgroundColor: colors.divider,
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthBar: {
    height: "100%",
    borderRadius: 2,
  },
  strengthLabel: {
    fontFamily: "DMMono-Regular",
    fontSize: 11,
    width: 36,
  },
  successWrap: {
    alignItems: "center",
    paddingVertical: 8,
  },
  checkCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.sageDark,
    backgroundColor: colors.sage,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  checkMark: {
    fontSize: 20,
    color: colors.sageDark,
  },
  error: {
    fontFamily: "DMMono-Regular",
    fontSize: 12,
    color: colors.roseDark,
    marginBottom: 8,
    marginTop: 4,
  },
  btn: {
    backgroundColor: colors.peach,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 8,
    shadowColor: colors.text,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
    elevation: 4,
  },
  btnText: {
    fontFamily: "DMMono-Medium",
    fontSize: 14,
    color: colors.peachDark,
    letterSpacing: 0.4,
  },
});
