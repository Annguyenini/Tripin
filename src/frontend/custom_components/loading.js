
export const Loading = ()=>{
    return(
        
 <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={{color:'white'}}>
        Please Be Patient.... 
      </Text>
    </View>    )
}


import React, { createContext, useContext, useState } from "react";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const show = () => setLoading(true);
  const hide = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ show, hide }}>
      {children}

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.text}>Please be patient…</Text>
        </View>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading must be used inside LoadingProvider");
  }
  return ctx;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  text: {
    color: "white",
    marginTop: 10,
  },
});
