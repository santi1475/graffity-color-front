<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import QRCode from "qrcode";
import { echo } from "@/services/echo";
import Swal from "sweetalert2";

const props = defineProps<{
  onProductScanned?: (product: any) => void;
}>();

const isOpen = ref(false);
const uuid = ref<string>("");
const qrCodeDataUrl = ref<string>("");
const connectionStatus = ref<"disconnected" | "connected" | "listening">(
  "disconnected",
);
const channelName = ref<string>("");

// Generate UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const openModal = async () => {
  isOpen.value = true;
  uuid.value = generateUUID();
  channelName.value = `scan.${uuid.value}`;

  // Generate QR
  const mobileUrl = `${import.meta.env.VITE_API_BASE_URL.replace("/api/", "")}/mobile-scanner/${uuid.value}`;
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
    if (props.onProductScanned) {
      props.onProductScanned(e);
    }

    // Visual feedback
    Swal.fire({
      title: "Producto Escaneado",
      text: `${e.productData ? e.productData.name : "Producto desconocido"} (${e.barcode})`,
      icon: e.productData ? "success" : "warning",
      timer: 1500,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
  });
};

const closeModal = () => {
  if (channelName.value) {
    echo.leave(channelName.value);
  }
  isOpen.value = false;
  connectionStatus.value = "disconnected";
};

onUnmounted(() => {
  if (channelName.value) {
    echo.leave(channelName.value);
  }
});

defineExpose({ openModal, closeModal });
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="closeModal"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative"
    >
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 class="text-xl font-bold mb-4 text-center dark:text-white">
        Vincular Escáner Móvil
      </h2>

      <div class="flex flex-col items-center space-y-4">
        <div v-if="qrCodeDataUrl" class="bg-white p-2 rounded-lg shadow-inner">
          <img :src="qrCodeDataUrl" alt="Scan QR" class="w-64 h-64" />
        </div>
        <div
          v-else
          class="w-64 h-64 bg-gray-200 animate-pulse flex items-center justify-center text-gray-400"
        >
          Generando QR...
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Escanea este código con tu celular para usarlo como lector de
            barras.
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
  </div>
</template>
