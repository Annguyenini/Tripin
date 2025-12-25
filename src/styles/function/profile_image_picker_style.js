import { StyleSheet } from "react-native";
export const profileImagePicker = StyleSheet.create({
  imageFrame: {
    width: '100%',
    height: 500,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    color: '#999',
  },

  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },

  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#000',
    fontWeight: '600',
  },

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
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
