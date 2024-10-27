<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <template #content>
        <div class="flex flex-col items-center">
          <span class="text-lg font-extrabold text-cyan-600">CANTIDAD TOTAL PEDIDOS</span>
          <span class="text-xl font-semibold">{{ productionTotals.orders || "0" }}</span>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <div class="flex flex-col items-center">
          <span class="text-lg font-extrabold text-green-600">DINERO DISPONIBLE</span>
          <span class="text-xl font-semibold">{{ $h.formatCurrency(productionTotals.totalMoney, 2) || "0" }}</span>
        </div>
      </template>
      template>
    </Card>
    <Card>
      <template #content>
        <div class="flex flex-col items-center">
          <span class="text-lg font-extrabold text-indigo-600">VELA CON MENOS INVENTARIO</span>
          <div>
            <span class="text-xl font-semibold">{{ productionTotals.minInventoryCandle || "" }} : </span>
            <span class="text-xl font-semibold">{{ productionTotals.quantityMinInventoryCandle || "0" }}</span>
          </div>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <div class="flex flex-col items-center">
          <span class="text-lg font-extrabold text-violet-600">BOLSA CON MENOS INVENTARIO</span>
          <div>
            <span class="text-xl font-semibold">{{ productionTotals.minInventoryBag || "" }} : </span>
            <span class="text-xl font-semibold">{{ productionTotals.quantityMinInventoryBag || "0" }}</span>
          </div>
        </div>
        <span></span>
      </template>
    </Card>
  </div>
  <div class="grid grid-cols-1 pt-4 md:grid-cols-2">
    <div>
      <Card>
        <template #content>
          <div ref="ordersGraphic" style="width: 100%; height: 500px"></div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useMainStore } from "@/store/main.store.js";
import { breadCrumbsLabels } from "@/core/constants.js";
import { getProductionDetails } from "@/services/dashboard/dashboard.service.js";
import * as echarts from "echarts";

const mainStore = useMainStore();

const productionTotals = ref({});
let chart = reactive({});
const ordersGraphic = ref();
const orderData = ref([]);

const getProductionTotals = async () => {
  await getProductionDetails().then((result) => {
    const { orderStatusGraphic, ...productionTotalsData } = result.data;
    productionTotals.value = productionTotalsData;
    orderData.value = orderStatusGraphic;
  });
};

const drawOrderEchart = () => {
  if (chart !== null && chart !== "" && chart !== undefined && Object.keys(chart).length > 0) {
    chart.dispose(); // borra la instancia en caso de estar creada
  }
  chart = echarts.init(ordersGraphic.value, "light");
  const options = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "0%",
      left: "center",
    },
    series: [
      {
        name: "Pedidos",
        type: "pie",
        radius: ["50%", "90%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: orderData.value,
      },
    ],
  };
  chart.setOption(options);
};
onMounted(async () => {
  mainStore.setBreadcrumbs([{ label: breadCrumbsLabels.dashboard.main, route: "dashboard" }]);
  await getProductionTotals();
  drawOrderEchart();
});
</script>
