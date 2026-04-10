<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import HttpClient from "@/helpers/http-client";
import Swal from "sweetalert2";

const route = useRoute();
const uuid = route.params.uuid as string;
const isScanning = ref(false);
const lastResult = ref<string | null>(null);
const scanStatus = ref<"idle" | "scanning" | "sending" | "success" | "error">(
  "idle",
);
const productName = ref<string | null>(null);

const readerId = "mobile-reader";
let html5QrcodeScanner: Html5Qrcode | null = null;
const audio = new Audio("/assets/audio/beep.mp3"); // Optional beep if file exists, or browser beep

const startScanner = async () => {
  await nextTick();
  if (html5QrcodeScanner) {
    await stopScanner();
  }

  const formatsToSupport = [
    Html5QrcodeSupportedFormats.EAN_13,
    Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.CODE_128,
    Html5QrcodeSupportedFormats.CODE_39,
    Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.CODABAR,
  ];

  html5QrcodeScanner = new Html5Qrcode(readerId);

  const config = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    formatsToSupport: formatsToSupport,
  };

  try {
    // Prefer back camera
    await html5QrcodeScanner.start(
      { facingMode: "environment" },
      config,
      (decodedText, decodedResult) => {
        handleScan(decodedText);
      },
      (errorMessage) => {
        // parse error, ignore
      },
    );
    isScanning.value = true;
    scanStatus.value = "scanning";
  } catch (err) {
    console.error("Error starting scanner", err);
    Swal.fire({
      icon: "error",
      title: "Error de Cámara",
      text: "No se pudo acceder a la cámara. Verifique los permisos.",
    });
    scanStatus.value = "error";
  }
};

const stopScanner = async () => {
  if (html5QrcodeScanner && isScanning.value) {
    try {
      await html5QrcodeScanner.stop();
      html5QrcodeScanner.clear();
      html5QrcodeScanner = null;
      isScanning.value = false;
    } catch (err) {
      console.error("Failed to stop scanner", err);
    }
  }
};

const handleScan = async (barcode: string) => {
  // Prevent duplicate scans while processing
  if (scanStatus.value === "sending") return;
  if (barcode === lastResult.value) return; // simple debounce

  lastResult.value = barcode;
  scanStatus.value = "sending";

  // Haptic feedback if available
  if (navigator.vibrate) navigator.vibrate(200);

  try {
    const response = await HttpClient.post("/scan", {
      barcode: barcode,
      channel_uuid: uuid,
    });

    console.log("Scan sent:", response);

    productName.value = response.data.product_name || "Producto escaneado";
    scanStatus.value = "success";

    Swal.fire({
      icon: "success",
      title: "¡Enviado!",
      text: `Código: ${barcode}`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top",
    });

    // Reset after delay to allow next scan
    setTimeout(() => {
      scanStatus.value = "scanning";
      lastResult.value = null; // allow rescan
    }, 2000);
  } catch (error) {
    console.error("Send error", error);
    scanStatus.value = "error";
    Swal.fire({
      icon: "error",
      title: "Error al enviar",
      text: "No se pudo conectar con el servidor.",
      timer: 2000,
      toast: true,
      position: "top",
    });
    setTimeout(() => {
      scanStatus.value = "scanning";
    }, 2000);
  }
};

onMounted(() => {
  // Request permissions explicitly first (redundant but good practice)
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(() => {
        startScanner();
      })
      .catch((err) => {
        console.error("Permission denied", err);
        Swal.fire(
          "Permiso denegado",
          "Se requiere acceso a la cámara.",
          "warning",
        );
      });
  } else {
    startScanner(); // Try anyway
  }
});

onUnmounted(() => {
  stopScanner();
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4 text-center text-gray-800">
        Escáner Móvil
      </h1>

      <div
        class="relative overflow-hidden rounded-lg bg-black mb-4 scanner-container"
      >
        <div id="mobile-reader" class="w-full"></div>
        <div
          v-if="scanStatus === 'sending'"
          class="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
        >
          <div class="text-white font-bold animate-pulse">Enviando...</div>
        </div>
      </div>

      <div class="text-center">
        <p
          v-if="scanStatus === 'scanning'"
          class="text-green-600 font-medium animate-pulse"
        >
          Escaneando...
        </p>
        <p v-else-if="scanStatus === 'success'" class="text-blue-600 font-bold">
          {{ productName }}
        </p>
        <p v-else-if="scanStatus === 'error'" class="text-red-500">
          Error. Intente de nuevo.
        </p>
        <p v-else class="text-gray-500">Iniciando cámara...</p>

        <p class="text-xs text-gray-400 mt-4">
          ID de Sesión: {{ uuid.substring(0, 8) }}...
        </p>
      </div>

      <div class="mt-6 flex justify-center">
        <button
          @click="startScanner"
          v-if="!isScanning"
          class="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition"
        >
          Activar Cámara
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scanner-container {
  min-height: 300px;
}
</style>
