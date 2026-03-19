import React, { useState, useEffect, useRef } from 'react';
import {
  View, TouchableOpacity, Text, TextInput,
  Alert, StyleSheet, Dimensions, Animated, Easing
} from 'react-native';
import { styles }    from '../styles/style.js'
import { authStyle } from '../styles/auth_style.js'
import AuthService   from '../backend/services/auth.js';
import AuthHandler   from '../app-core/flow/auth_handler.js';
import { navigate }  from './custom_function/navigationService.js';
import { OverlayCard } from './custom_function/overlay_card.js';
import AppFlow       from '../app-core/flow/app_flow.js';
import { UseOverlay } from './overlay/overlay_main.js';
import { useLoading } from './custom_components/loading.js';

const { width, height } = Dimensions.get('window');

// ── random coords ──
const randCoord = () => {
  const lat = (Math.random() * 180 - 90).toFixed(4)
  const lng = (Math.random() * 360 - 180).toFixed(4)
  return `${lat > 0 ? '+' : ''}${lat}° / ${lng > 0 ? '+' : ''}${lng}°`
}

// ── TOP-LEFT: "Snap your trip." slides in, loops ──
function SnapLabel() {
  const opacity = useRef(new Animated.Value(0)).current
  const slideX  = useRef(new Animated.Value(-16)).current

  useEffect(() => {
    const loop = () => {
      opacity.setValue(0)
      slideX.setValue(-16)
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.spring(slideX,  { toValue: 0, tension: 80, friction: 11, useNativeDriver: true }),
        ]),
        Animated.delay(2600),
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.delay(500),
      ]).start(({ finished }) => { if (finished) loop() })
    }
    loop()
  }, [])

  return (
    <Animated.View style={[fr.snapWrap, { opacity, transform: [{ translateX: slideX }] }]} pointerEvents="none">
      <Text style={fr.snapText}>Snap your trip.</Text>
    </Animated.View>
  )
}

// ── TOP-RIGHT: cycling coords ──
function CoordsLabel() {
  const [coords, setCoords] = useState(randCoord())
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const cycle = () => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setCoords(randCoord())
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start()
      })
    }
    const t = setInterval(cycle, 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <Animated.View style={[fr.coordsWrap, { opacity }]} pointerEvents="none">
      <Text style={fr.coordsLabel}>· coordinates ·</Text>
      <Text style={fr.coordsText}>{coords}</Text>
    </Animated.View>
  )
}

// ─────────────────────────────────────────
export const AuthScreen = () => {
  const [showLogin,              setShowLogin]              = useState(false);
  const [showSignup,             setShowSignup]             = useState(false);
  const [showVerification,       setShowVerification]       = useState(false);
  const [email,                  setEmail]                  = useState('');
  const [password,               setPassWord]               = useState('');
  const [confirmPassword,        setConfirmPassWord]        = useState('');
  const [username,               setUserName]               = useState('');
  const [displayName,            setDisplayName]            = useState('');
  const [verifyCode,             setVerifyCode]             = useState('');
  const [alert,                  setAlertType]              = useState('');
  const [showAlert,              setShowAleart]             = useState(false);
  const [alertColor,             setAlertColor]             = useState('#FF0000')
  const [passwordMissingList,    setPassWordMissingList]    = useState([]);
  const [showPasswordMissingList,setShowPML]                = useState(false);

  const specialRegex = /[^A-Za-z0-9]/;
  const emailRegex   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const { showLoading, hideLoading } = UseOverlay()

  useEffect(() => {
    const checkToken = async () => {
      showLoading()
      const status = await AppFlow.tokenAuthorization();
      hideLoading()
    };
    checkToken();
  }, []);

  const submitRequest = async ({ action }) => {
    setShowAleart(false);

    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please Fill out all the requirement!');
      setAlertType("Please Fill out all the requirement!");
      setShowAleart(true);
      return;
    }

    if (action === 'Login') {
      showLoading()
      const respond = await AuthHandler.loginHandler(username, password);
      const data = respond.data
      hideLoading()
      if (!respond.ok) {
        setAlertType('There are an error occur with the server! Please try again shortly')
        setShowAleart(true);
      }
      if (respond.status === 401) {
        setAlertType(data.message)
        setShowAleart(true);
        return;
      }
      else if (respond.status === 429) {
        setAlertType("Too many request please try again shortly!")
        setShowAleart(true);
        return;
      }
      else if (respond.status === 200) {
        showLoading()
        await AppFlow.onAuthSuccess()
        hideLoading()
      }
    }

    else if (action === "Signup") {
      showLoading()
      setShowPML(false);
      if (displayName.trim() === '' || confirmPassword === '' || email === '') {
        Alert.alert('Error', 'Please Fill out all the requirement!');
        setAlertType("Please Fill out all the requirement!");
        setShowAleart(true);
        return;
      };
      let res = [];
      if (!emailRegex.test(email))      res.push('Invalid Email');
      if (!/\d/.test(password))         res.push('Missing Number!');
      if (password.length < 8)          res.push('Password have to be longer than 8!');
      if (!specialRegex.test(password)) res.push("Missing special character!");
      if (specialRegex.test(username))  res.push("Username should not contain special characters!")
      if (!/[A-Z]/.test(password))      res.push('Missing upper letter!');
      if (confirmPassword != password)  res.push("Confirm password doesnt match!")
      if (res.length > 0) {
        setPassWordMissingList(res);
        setShowPML(true);
        hideLoading()
        return;
      }
      const response = await AuthHandler.signUpHandler(email, displayName, username, password);
      const data = response.data
      if (!response.ok || response.status === 401) {
        setAlertType(data.message);
        setShowAleart(true);
        hideLoading()
        return;
      }
      setShowSignup(false);
      setShowVerification(true);
      hideLoading()
    }

    else if (action === "Verification") {
      if (!/\d/.test(verifyCode.length)) {
        setAlertType("Please enter 6 digits code")
        showAlert(true)
        return
      }
      const respond = await AuthHandler.emailVerificationHandler(email, verifyCode);
      if (!respond.ok) {
        setAlertType('Server failed')
        setShowAleart(true)
        return;
      }
      if (respond.status != 200) {
        setAlertType(respond.message)
        setShowAleart(true)
        return;
      }
      setShowVerification(false)
      setShowLogin(true)
    }
  }

  return (
    <>
      {/* ══ OUTER POLAROID FRAME ══ */}
      <View style={fr.outerFrame}>

        {/* top bar: snap label left, coords right */}
        <View style={fr.topBar}>
          <SnapLabel />
          <CoordsLabel />
        </View>

        {/* photo area — dark, full bleed */}
        <View style={fr.photoArea}>
          <Text style={fr.brandText}>Tripping</Text>
        </View>

        {/* ── ROUTE DIVIDER — dashed S-curve with two pins ── */}
        <View style={fr.routeRow} pointerEvents="none">
          {/* pin left */}
          <View style={fr.pin}>
            <View style={fr.pinHead}><View style={fr.pinDot} /></View>
            <View style={fr.pinTail} />
          </View>

          {/* dashed S path */}
          <View style={fr.dashTrack}>
            {Array.from({ length: 22 }).map((_, i) => {
              const t    = i / 21
              const offY = Math.sin(t * Math.PI * 2.2) * 7
              return (
                <View key={i} style={[fr.dash, { marginTop: offY }]} />
              )
            })}
          </View>

          {/* pin right */}
          <View style={fr.pin}>
            <View style={fr.pinHead}><View style={fr.pinDot} /></View>
            <View style={fr.pinTail} />
          </View>
        </View>

        {/* caption strip — buttons live here */}
        <View style={fr.captionStrip}>
          <View style={fr.btnRow}>
            <TouchableOpacity style={fr.btn} onPress={() => {
              setShowLogin(true); setPassWord(''); setUserName('');
            }}>
              <Text style={fr.btnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[fr.btn, fr.btnOutline]} onPress={() => {
              setShowSignup(true); setPassWord(''); setUserName('');
            }}>
              <Text style={[fr.btnText, fr.btnTextOutline]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* ══ OVERLAYS — original untouched ══ */}

      {showLogin && (
        <OverlayCard title="LOGIN" onClose={() => setShowLogin(false)}>
          {showAlert && (<Text style={{ textAlign: 'center', marginTop: 10, color: alertColor }}>{alert}</Text>)}
          <TextInput style={authStyle.input} placeholder="UserName" value={username} onChangeText={text => setUserName(text)} />
          <TextInput style={authStyle.input} placeholder="Password" value={password} onChangeText={text => setPassWord(text)} secureTextEntry />
          <TouchableOpacity style={authStyle.submitButton} onPress={() => submitRequest({ action: 'Login' })}>
            <Text style={authStyle.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowLogin(false); setShowSignup(true), setShowAleart(false); }}>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Forgot Passwords?</Text>
          </TouchableOpacity>
        </OverlayCard>
      )}

      {showSignup && (
        <OverlayCard title="SIGNUP" onClose={() => setShowSignup(false)}>
          {showAlert && (<Text style={{ textAlign: 'center', marginTop: 10, color: alertColor }}>{alert}</Text>)}
          {showPasswordMissingList && (
            <View>
              {passwordMissingList.map((item, index) => (
                <Text key={index} style={{ textAlign: 'center', marginTop: 10, color: '#FF0000' }}>{item}</Text>
              ))}
            </View>
          )}
          <TextInput style={authStyle.input} placeholder="Email"            value={email}           onChangeText={text => setEmail(text)} />
          <TextInput style={authStyle.input} placeholder="DisplayName"      value={displayName}     onChangeText={text => setDisplayName(text)} />
          <TextInput style={authStyle.input} placeholder="UserName"         value={username}        onChangeText={text => setUserName(text)} />
          <TextInput style={authStyle.input} placeholder="Password"         value={password}        onChangeText={text => setPassWord(text)} secureTextEntry />
          <TextInput style={authStyle.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={text => setConfirmPassWord(text)} secureTextEntry />
          <TouchableOpacity style={authStyle.submitButton} onPress={() => submitRequest({ action: 'Signup' })}>
            <Text style={authStyle.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowLogin(true); setShowSignup(false), setShowAleart(false); }}>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Have an account?</Text>
          </TouchableOpacity>
        </OverlayCard>
      )}

      {showVerification && (
        <OverlayCard title="Confirm Code" onClose={() => setShowVerification(false)}>
          <TextInput style={authStyle.input} placeholder="6 digits code" value={verifyCode} inputMode="numeric" onChangeText={text => setVerifyCode(text)} />
          <TouchableOpacity style={authStyle.submitButton} onPress={() => submitRequest({ action: 'Verification' })}>
            <Text style={authStyle.submitButtonText}>Verify</Text>
          </TouchableOpacity>
          {showAlert && (<Text style={{ textAlign: 'center', marginTop: 10, color: alertColor }}>{alert}</Text>)}
        </OverlayCard>
      )}
    </>
  );
};

const FRAME_W = width  * 0.9
const FRAME_H = height * 0.9
const PHOTO_H = FRAME_H * 0.68
const CAP_H   = FRAME_H - PHOTO_H

const fr = StyleSheet.create({
  // ── outer polaroid ──
  outerFrame: {
    position:        'absolute',
    top:             (height - FRAME_H) / 2,
    left:            (width  - FRAME_W) / 2,
    width:           FRAME_W,
    height:          FRAME_H,
    backgroundColor: '#f5f0e8',
    padding:         10,
    shadowColor:     '#000',
    shadowOffset:    { width: 6, height: 6 },
    shadowOpacity:   0.22,
    shadowRadius:    0,
    elevation:       10,
  },

  // ── top bar ──
  topBar: {
    height:         38,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom:   4,
  },

  // snap label
  snapWrap: {
    flex: 1,
  },
  snapText: {
    fontFamily:    'mainfont',
    fontSize:       15,
    color:         '#1a1a1a',
    letterSpacing:  0.3,
    opacity:        0.72,
  },

  // coords
  coordsWrap: {
    alignItems: 'flex-end',
  },
  coordsLabel: {
    fontFamily:    'mainfont',
    fontSize:       7,
    color:         'rgba(26,26,26,0.4)',
    letterSpacing:  1.2,
    textTransform: 'uppercase',
  },
  coordsText: {
    fontFamily:    'mainfont',
    fontSize:       15,
    color:         'rgba(26,26,26,0.65)',
    letterSpacing:  0.5,
    marginTop:      1,
  },

  // ── photo area ──
  photoArea: {
    width:           '100%',
    height:          PHOTO_H - 52,  // minus topBar + padding
    backgroundColor: '#0d0c0a',
    alignItems:      'center',
    justifyContent:  'center',
  },
  brandText: {
    fontFamily:      'mainfont',
    fontSize:         52,
    color:           '#f0f0ec',
    letterSpacing:    2,
    textShadowColor:  '#000',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 0,
  },

  // ── route divider ──
  routeRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap:             6,
  },
  pin: {
    alignItems:  'center',
    width:       20,
  },
  pinHead: {
    width:           18,
    height:          18,
    borderRadius:    9,
    backgroundColor: '#1a1a1a',
    alignItems:      'center',
    justifyContent:  'center',
  },
  pinDot: {
    width:           7,
    height:          7,
    borderRadius:    3.5,
    backgroundColor: '#f5f0e8',
  },
  pinTail: {
    width:           0,
    height:          0,
    borderLeftWidth:  5,
    borderRightWidth: 5,
    borderTopWidth:   8,
    borderLeftColor:  'transparent',
    borderRightColor: 'transparent',
    borderTopColor:   '#1a1a1a',
    marginTop:        -1,
  },
  dashTrack: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent:'space-between',
    height:        28,
    overflow:      'hidden',
  },
  dash: {
    width:           6,
    height:          2.5,
    backgroundColor: '#1a1a1a',
    borderRadius:    2,
    opacity:         0.5,
  },

  // ── caption strip ──
  captionStrip: {
    flex:           1,
    justifyContent: 'center',
    paddingTop:    10,
  },
  btnRow: {
    flexDirection:  'row',
    gap:            16,
  },
  btn: {
    flex:            1,
    backgroundColor: '#1a1a1a',
    paddingVertical:  12,
    alignItems:      'center',
    shadowColor:     '#000',
    shadowOffset:    { width: 3, height: 3 },
    shadowOpacity:   0.25,
    shadowRadius:    0,
    elevation:        4,
  },
  btnText: {
    fontFamily:    'mainfont',
    fontSize:       16,
    color:         '#f5f0e8',
    letterSpacing:  1.5,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth:      1.5,
    borderColor:     '#1a1a1a',
  },
  btnTextOutline: {
    color: '#1a1a1a',
  },
})