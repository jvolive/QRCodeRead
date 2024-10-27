import { useRef, useState } from "react";
import { StyleSheet, Button, View, Modal, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const qrCodeLock = useRef(false);

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        return Alert.alert("Camera", "Voce precisa habilitar o uso da camera");
      }

      setModalIsVisible(true);
      qrCodeLock.current = false;
    } catch (erro) {
      console.log(erro);
    }
  }

  function handleQRCodeRead(data: string) {
    setModalIsVisible(false);
    Alert.alert("QRCode", data);
  }

  return (
    <View style={styles.container}>
      <Button title="Ler QRCode" onPress={handleOpenCamera} />

      <Modal visible={modalIsVisible} style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrCodeLock.current) {
              qrCodeLock.current = true;
              setTimeout(() => handleQRCodeRead(data), 500);
            }
          }}
        />

        <View style={styles.footer}>
          <Button title="Cancelar" onPress={() => setModalIsVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 32,
    right: 32,
  },
});
