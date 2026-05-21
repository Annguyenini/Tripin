import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { fr } from "../../../styles/auth_style.js";

export function ValidationErrors({ errors }) {
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

export function LoginForm({
  loginWithEmail,
  setLoginWithEmail,
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  errors,
  onSubmit,
  onSignup,
  onForgot,
  clearAllDataFields,
  GoogleAuth,
}) {
  return (
    <>
      <ValidationErrors errors={errors} />
      <View style={fr.toggleRow}>
        <TouchableOpacity
          style={[fr.toggleOpt, !loginWithEmail && fr.toggleActive]}
          onPress={() => {
            setLoginWithEmail(false);
            clearAllDataFields();
          }}
        >
          <Text
            style={
              !loginWithEmail ? fr.toggleTextActive : fr.toggleTextInactive
            }
          >
            USERNAME
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[fr.toggleOpt, loginWithEmail && fr.toggleActive]}
          onPress={() => setLoginWithEmail(true)}
        >
          <Text
            style={loginWithEmail ? fr.toggleTextActive : fr.toggleTextInactive}
          >
            EMAIL
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={fr.fieldLabel}>
        {loginWithEmail ? "Email address" : "Username"}
      </Text>
      {loginWithEmail ? (
        <TextInput
          style={fr.inp}
          placeholder="you@example.com"
          placeholderTextColor="#a08060"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      ) : (
        <TextInput
          style={fr.inp}
          placeholder="your_username"
          placeholderTextColor="#a08060"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      )}
      <Text style={fr.fieldLabel}>Password</Text>
      <TextInput
        style={fr.inp}
        placeholder="••••••••"
        placeholderTextColor="#a08060"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={fr.submitBtn}
        onPress={onSubmit}
        activeOpacity={0.8}
      >
        <Text style={fr.submitBtnText}>Submit</Text>
      </TouchableOpacity>
      <GoogleAuth action="signin" />
      <TouchableOpacity onPress={onSignup}>
        <Text style={fr.linkText}>Create an account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onForgot}>
        <Text style={fr.linkText}>Forgot password?</Text>
      </TouchableOpacity>
    </>
  );
}

export function SignupForm({
  email,
  setEmail,
  displayName,
  setDisplayName,
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
  onSubmit,
  onLogin,
}) {
  return (
    <>
      <ValidationErrors errors={errors} />
      <Text style={fr.fieldLabel}>Email</Text>
      <TextInput
        style={fr.inp}
        placeholder="you@example.com"
        placeholderTextColor="#a08060"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={fr.fieldLabel}>Display name</Text>
      <TextInput
        style={fr.inp}
        placeholder="Your Name"
        placeholderTextColor="#a08060"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Text style={fr.fieldLabel}>Username</Text>
      <TextInput
        style={fr.inp}
        placeholder="your_username"
        placeholderTextColor="#a08060"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={fr.fieldLabel}>Password</Text>
      <TextInput
        style={fr.inp}
        placeholder="••••••••"
        placeholderTextColor="#a08060"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={fr.fieldLabel}>Confirm password</Text>
      <TextInput
        style={fr.inp}
        placeholder="••••••••"
        placeholderTextColor="#a08060"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={fr.submitBtn}
        onPress={onSubmit}
        activeOpacity={0.8}
      >
        <Text style={fr.submitBtnText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onLogin}>
        <Text style={fr.linkText}>Already have an account?</Text>
      </TouchableOpacity>
    </>
  );
}

export function VerificationForm({
  verifyCode,
  setVerifyCode,
  errors,
  onSubmit,
}) {
  return (
    <>
      <ValidationErrors errors={errors} />
      <Text style={fr.fieldLabel}>6-digit code</Text>
      <TextInput
        style={fr.inp}
        placeholder="000000"
        placeholderTextColor="#a08060"
        value={verifyCode}
        onChangeText={setVerifyCode}
        inputMode="numeric"
        maxLength={6}
      />
      <TouchableOpacity
        style={fr.submitBtn}
        onPress={onSubmit}
        activeOpacity={0.8}
      >
        <Text style={fr.submitBtnText}>Verify</Text>
      </TouchableOpacity>
    </>
  );
}

export function CompleteForm({
  displayName,
  setDisplayName,
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
  onSubmit,
}) {
  return (
    <>
      <ValidationErrors errors={errors} />
      <Text style={fr.fieldLabel}>Display name</Text>
      <TextInput
        style={fr.inp}
        placeholder="Your Name"
        placeholderTextColor="#a08060"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Text style={fr.fieldLabel}>Username</Text>
      <TextInput
        style={fr.inp}
        placeholder="your_username"
        placeholderTextColor="#a08060"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Text style={fr.fieldLabel}>Password</Text>
      <TextInput
        style={fr.inp}
        placeholder="••••••••"
        placeholderTextColor="#a08060"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={fr.fieldLabel}>Confirm password</Text>
      <TextInput
        style={fr.inp}
        placeholder="••••••••"
        placeholderTextColor="#a08060"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={fr.submitBtn}
        onPress={onSubmit}
        activeOpacity={0.8}
      >
        <Text style={fr.submitBtnText}>Submit</Text>
      </TouchableOpacity>
    </>
  );
}
