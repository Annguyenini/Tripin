import { StyleSheet } from "react-native";
export const tripStyle = StyleSheet.create(
    {
    input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  submitButton: {
    backgroundColor: '#000000ff', // black submit
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
   submitButtonText: {
    color: '#ffffff', // white text
    fontSize: 18,
    fontWeight: 'bold',
  },
    }
)