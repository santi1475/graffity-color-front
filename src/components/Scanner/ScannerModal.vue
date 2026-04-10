<script setup lang="ts">
import { ref, onUnmounted, nextTick, watch } from "vue";
import QRCode from "qrcode";
import { echo } from "@/services/echo";
import Swal from "sweetalert2";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const props = defineProps<{
  onProductScanned?: (product: any) => void;
}>();

const isOpen = ref(false);
const activeTab = ref<"local" | "remote">("local");

const uuid = ref<string>("");
const qrCodeDataUrl = ref<string>("");
const connectionStatus = ref<"disconnected" | "connected" | "listening">(
  "disconnected",
);
const channelName = ref<string>("");

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const initRemoteScanner = async () => {
  uuid.value = generateUUID();
  channelName.value = `scan.${uuid.value}`;

  // Generate QR
  let baseUrl = window.location.origin;
  if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
    // Replace localhost with local network IP so devices can reach it
    baseUrl = baseUrl.replace(/localhost|127\.0\.0\.1/, "192.168.1.66");
  }
  const base = import.meta.env.BASE_URL || "/";
  const mobileUrl = `${baseUrl}${base}mobile-scanner/${uuid.value}`;

  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(mobileUrl);
  } catch (err) {
    console.error("QR Gen Error", err);
  }

  // Subscribe to Echo
  console.log(`Subscribing to ${channelName.value}`);
  connectionStatus.value = "listening";

  echo.channel(channelName.value).listen(".product.scanned", (e: any) => {
    console.log("Event received:", e);
    handleScan(e);
  });
};

const cleanupRemoteScanner = () => {
  if (channelName.value) {
    echo.leave(channelName.value);
  }
  connectionStatus.value = "disconnected";
  channelName.value = "";
  uuid.value = "";
  qrCodeDataUrl.value = "";
};

// --- Local Scanner Logic ---
const readerId = "reader";
let html5QrcodeScanner: Html5Qrcode | null = null;
const isScanning = ref(false);

const startLocalScanner = async () => {
  await nextTick();
  if (html5QrcodeScanner) {
    // Already running or not properly cleaned
    await stopLocalScanner();
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
    await html5QrcodeScanner.start(
      { facingMode: "environment" },
      config,
      (decodedText, decodedResult) => {
        // Success callback
        console.log(`Code matched = ${decodedText}`, decodedResult);
        handleScan({ barcode: decodedText });
      },
      (errorMessage) => {
        // parse error, ignore it.
      },
    );
    isScanning.value = true;
  } catch (err) {
    console.error("Error starting scanner", err);
    Swal.fire(
      "Error",
      "No se pudo iniciar la cámara. Verifique los permisos.",
      "error",
    );
  }
};

const stopLocalScanner = async () => {
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

// --- Shared Logic ---
const handleScan = (data: any) => {
  if (props.onProductScanned) {
    props.onProductScanned(data);
  }
  Swal.fire({
    title: "Producto Escaneado",
    text: `${data.productData ? data.productData.name : ""} (${data.barcode})`,
    icon: "success",
    timer: 1500,
    showConfirmButton: false,
    position: "top-end",
    toast: true,
  });
};

const openModal = () => {
  isOpen.value = true;
  activeTab.value = "local";
  nextTick(() => {
    startLocalScanner();
  });
};

const closeModal = async () => {
  await stopLocalScanner();
  cleanupRemoteScanner();
  isOpen.value = false;
};

const switchTab = async (tab: "local" | "remote") => {
  if (activeTab.value === tab) return;
  activeTab.value = tab;

  if (tab === "local") {
    cleanupRemoteScanner();
    await startLocalScanner();
  } else {
    await stopLocalScanner();
    initRemoteScanner();
  }
};

const handleOk = (bvModalEvent: any) => {
  if (activeTab.value === "local") {
    bvModalEvent.preventDefault();
    if (isScanning.value) {
      stopLocalScanner();
    } else {
      startLocalScanner();
    }
  }
};

onUnmounted(() => {
  stopLocalScanner();
  cleanupRemoteScanner();
});

defineExpose({ openModal, closeModal });
</script>

<template>
  <b-modal
    v-model="isOpen"
    title="Escanear Código de Barras"
    :ok-title="
      activeTab === 'local' ? (isScanning ? 'Detener' : 'Iniciar') : 'Aceptar'
    "
    :ok-variant="
      activeTab === 'local' ? (isScanning ? 'warning' : 'success') : 'primary'
    "
    cancel-title="Cerrar"
    @ok="handleOk"
    @hidden="closeModal"
    centered
  >
    <div class="w-full">
      <div class="d-flex flex-wrap gap-2 mb-3 justify-content-center">
        <b-button
          variant="primary"
          :class="activeTab === 'local'"
          @click="switchTab('local')"
        >
          📷 Cámara Local
        </b-button>
        <b-button
          variant="info"
          :class="activeTab === 'remote'"
          @click="switchTab('remote')"
        >
          📱 Escáner Remoto
        </b-button>
      </div>

      <!-- Local Scanner Content -->
      <div v-show="activeTab === 'local'" class="flex flex-col items-center">
        <div id="reader" style="width: 100%; min-height: 250px"></div>
        <p class="text-sm mt-2">
          Apunta la cámara al código de barras del producto.
        </p>
      </div>

      <!-- Remote Scanner Content -->
      <div
        v-show="activeTab === 'remote'"
        class="flex flex-col items-center space-y-4"
      >
        <div
          v-if="qrCodeDataUrl"
          class="flex justify-center items-center bg-white p-2 rounded-lg shadow-inner"
        >
          <img
            :src="qrCodeDataUrl"
            alt="Scan QR"
            class="rounded d-block mx-auto"
          />
        </div>
        <div
          v-else
          class="w-64 h-64 bg-gray-200 animate-pulse flex items-center justify-center text-gray-400"
        >
          Generando QR...
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Escanea este código con tu celular para usarlo como lector.
          </p>
          <div
            class="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"
              ></span>
            </span>
            <span>Esperando conexión...</span>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
