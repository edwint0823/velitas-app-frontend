<template>
  <div class="mx-3 my-3 grid grid-cols-1 gap-x-16 gap-y-4 md:grid-cols-3 lg:mx-0">
    <div class="flex flex-col gap-2">
      <label for="name">Nombre de opción:</label>
      <InputText id="name" v-model="name" type="text" class="w-full" />
      <small class="text-red-600" :class="{ hidden: !errors.name }">{{ errors.name }}</small>
    </div>
    <div class="flex flex-col gap-2">
      <label for="retail_price">Precio al detal:</label>
      <InputNumber
        v-model="retail_price"
        placeholder="Precio al detal"
        input-id="retail_price"
        mode="currency"
        currency="COP"
        locale="es-mx"
      />
      <small class="text-red-600" :class="{ hidden: !errors.retail_price }">{{ errors.retail_price }}</small>
    </div>
    <div class="flex flex-col gap-2">
      <label for="bulk_price">Precio mayorista:</label>
      <InputNumber
        v-model="bulk_price"
        placeholder="Precio mayorista"
        input-id="bulk_price"
        mode="currency"
        currency="COP"
        locale="es-mx"
      />
      <small class="text-red-600" :class="{ hidden: !errors.bulk_price }">{{ errors.bulk_price }}</small>
    </div>
    <div class="flex flex-col gap-2">
      <label for="candle_type_id">Tipo de vela:</label>
      <Dropdown
        v-model="candle_type_id"
        :options="candleTypeOptions"
        :disabled="isEdit"
        input-id="candle_type_id"
        option-label="name"
        option-value="id"
        placeholder="Seleccione un tipo de vela"
      />
      <small class="text-red-600" :class="{ hidden: !errors.candle_type_id }">{{ errors.candle_type_id }}</small>
    </div>
    <div class="col-span-1 grid grid-cols-1 md:col-span-2 md:grid-cols-3">
      <div class="flex items-center justify-center gap-2">
        <label for="visible">Visible:</label>
        <Checkbox v-model="visible" :binary="true" input-id="visible" :disabled="!isEdit" />
        <small class="text-red-600" :class="{ hidden: !errors.visible }">{{ errors.visible }}</small>
      </div>
      <div class="flex items-center justify-center gap-2">
        <label for="is_pack">Es paquete:</label>
        <Checkbox v-model="is_pack" :binary="true" input-id="is_pack" />
        <small class="text-red-600" :class="{ hidden: !errors.is_pack }">{{ errors.is_pack }}</small>
      </div>
      <div class="flex items-center justify-center gap-2">
        <label for="is_vip_pack">Es paquete VIP:</label>
        <Checkbox v-model="is_vip_pack" :binary="true" input-id="is_vip_pack" />
        <small class="text-red-600" :class="{ hidden: !errors.is_vip_pack }">{{ errors.is_vip_pack }}</small>
      </div>
    </div>
    <div class="flex flex-col gap-2" v-if="showUploadInput">
      <label>Imagen:</label>
      <FileUpload
        name="file"
        ref="fileImageUploadRef"
        customUpload
        @uploader="ondUpload"
        @removeUploadedFile="onRemove"
        :multiple="false"
        accept="image/*"
        :maxFileSize="5000000"
        chooseLabel="Seleccionar una imagen"
        upload-label="Subir"
        :showCancelButton="false"
      >
        <template #header="{ chooseCallback, uploadedFiles, uploadCallback, clearCallback, files }">
          <div class="flex flex-1 flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap gap-2">
              <Button
                @click="chooseCallback()"
                label="Buscar imagen"
                icon="pi pi-images"
                rounded
                outlined
                severity="secondary"
                :disabled="files.length > 0 || uploadedFiles.length > 0"
              ></Button>
              <Button
                @click="uploadCallback()"
                icon="pi pi-cloud-upload"
                label="Subir"
                rounded
                outlined
                severity="success"
                :disabled="!files || files.length === 0"
              ></Button>
              <Button
                @click="clearCallback()"
                icon="pi pi-times"
                rounded
                outlined
                severity="danger"
                :disabled="!files || files.length === 0"
              ></Button>
            </div>
          </div>
        </template>
        <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
          <div class="flex flex-col gap-8">
            <div v-if="files.length > 0">
              <div class="flex flex-wrap gap-4">
                <div
                  v-for="(file, index) of files"
                  :key="file.name + file.type + file.size"
                  class="flex flex-col items-center gap-4 rounded border border-surface-400/80 p-2 dark:border-surface-500/80"
                >
                  <div>
                    <img role="presentation" :alt="file.name" :src="file.objectURL" width="80" height="50" />
                  </div>
                  <span class="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                    {{ file.name }}
                  </span>
                  <div>{{ formatSize(file.size) }}</div>
                  <Badge value="Pendiente" severity="warning" />
                  <Button
                    icon="pi pi-times"
                    @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                    outlined
                    rounded
                    severity="danger"
                  />
                </div>
              </div>
            </div>
            <div v-if="uploadedFiles.length > 0">
              <div class="flex flex-wrap gap-4">
                <div
                  v-for="(file, index) of uploadedFiles"
                  :key="file.name + file.type + file.size"
                  class="flex flex-col items-center gap-4 rounded border border-surface-400/80 p-2 dark:border-surface-500/80"
                >
                  <div>
                    <img role="presentation" :alt="file.name" :src="file.objectURL" width="80" height="50" />
                  </div>
                  <span class="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                    {{ file.name }}
                  </span>
                  <div>{{ formatSize(file.size) }}</div>
                  <Badge value="Completado" class="mt-4" severity="success" />
                  <Button
                    icon="pi pi-times"
                    @click="removeUploadedFileCallback(index)"
                    outlined
                    rounded
                    severity="danger"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          <div class="flex flex-col items-center justify-center">
            <i class="pi pi-cloud-upload text-muted-color rounded-full border-2 p-8 text-2xl" />
            <p class="mb-0 mt-5">Arrastra y suelta los archivos para subir.</p>
          </div>
        </template>
      </FileUpload>
      <small class="text-red-600" :class="{ hidden: !errors.imageFile }">{{ errors.imageFile }}</small>
    </div>
    <div v-else class="flex flex-col content-center gap-3">
      <label>Imagen:</label>
      <img :src="imageFile" :alt="name" class="w-full" />
      <Button
        icon="pi pi-refresh"
        rounded
        raised
        @click="changeToUploadNewImage"
        severity="info"
        label="Cargar nueva imagen"
      />
    </div>
    <div class="col-span-1 md:col-span-2">
      <span>Nombres: </span>
      <div class="mt-2 flex justify-between gap-2">
        <InputText
          type="text"
          v-model="nameToAdd"
          class="w-[85%] md:w-full lg:w-full xl:w-full 2xl:w-full"
          @keyup.enter="addNameToList"
        />
        <Button icon="pi pi-plus" rounded raised @click="addNameToList" severity="info" />
      </div>
      <div class="mt-3 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
        <div
          v-for="(nameCandle, index) in pack_names"
          :key="index"
          class="rounded-lg bg-surface-200 p-2 text-surface-700 dark:bg-surface-700 dark:text-surface-0/70"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="mr-3 block truncate text-wrap text-sm">
                {{ nameCandle }}
              </span>
              <button class="mr-1 h-7 w-7 justify-center rounded-lg bg-red-600" @click="removeCandleName(index)">
                <i class="pi pi-times p-1 text-xs text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <small class="text-red-600" :class="{ hidden: !errors.pack_names }">{{ errors.pack_names }}</small>
    </div>
  </div>
  <div class="flex justify-center pt-3 lg:pt-0">
    <Button
      icon="pi pi-save"
      :label="isEdit ? 'Actualizar información' : 'Guardar información'"
      @click="submitFormInfo"
    />
  </div>
</template>
<script setup>
import * as yup from "yup";
import { createCandleOptionMessages } from "@/core/constants.js";
import { usePrimeVue } from "primevue/config";
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import { listCandleTypes } from "@/services/candleType/candleType.service.js";
import { useRoute } from "vue-router";
import { findCandleOptionById } from "@/services/candleOptions/candleOptions.service.js";

const $primevue = usePrimeVue();
const route = useRoute();
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["submitForm"]);
const fileImageUploadRef = ref();
const candleTypeOptions = ref([]);
const showUploadInput = ref(true);
const nameToAdd = ref("");

const schema = yup.object().shape({
  imageFile: yup.mixed().default(null).required(createCandleOptionMessages.fileRequired),
  name: yup.string().default("").required(createCandleOptionMessages.nameRequired),
  retail_price: yup
    .number()
    .default(null)
    .required(createCandleOptionMessages.retailPriceRequired)
    .min(0, createCandleOptionMessages.retailPriceMinVal),
  bulk_price: yup
    .number()
    .default(null)
    .required(createCandleOptionMessages.bulkPriceRequired)
    .min(0, createCandleOptionMessages.bulkPriceMinVal),
  is_pack: yup.boolean().default(false).required(createCandleOptionMessages.isPackRequired),
  visible: yup.boolean().default(true),
  candle_type_id: yup.number().default(null).required(createCandleOptionMessages.candleTypeIdRequired),
  is_vip_pack: yup.boolean().default(false).required(createCandleOptionMessages.isVipPackRequired),
  pack_names: yup
    .array()
    .of(yup.string())
    .when("is_pack", {
      is: true,
      then: (schema) => schema.min(1, createCandleOptionMessages.packNamesEmpty),
      otherwise: (schema) => schema.notRequired(),
    })
    .default([]),
});
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [imageFile] = defineField("imageFile");
const [name] = defineField("name");
const [retail_price] = defineField("retail_price");
const [bulk_price] = defineField("bulk_price");
const [is_pack] = defineField("is_pack");
const [visible] = defineField("visible");
const [candle_type_id] = defineField("candle_type_id");
const [is_vip_pack] = defineField("is_vip_pack");
const [pack_names] = defineField("pack_names");

const submitFormInfo = handleSubmit((values) => {
  emits("submitForm", values);
});

const getCandleInfoById = async () => {
  await findCandleOptionById(route.params.id).then(({ data }) => {
    name.value = data.name;
    retail_price.value = data.retail_price;
    bulk_price.value = data.bulk_price;
    is_pack.value = data.is_pack;
    visible.value = data.visible;
    candle_type_id.value = data.candleTypeId;
    is_vip_pack.value = data.is_vip_pack;
    pack_names.value = data.pack_names.map(({ name }) => name);
    imageFile.value = data.url_image;
    showUploadInput.value = false;
  });
};

const changeToUploadNewImage = () => {
  imageFile.value = undefined;
  showUploadInput.value = true;
};

const addNameToList = () => {
  if (nameToAdd.value === "") return;

  const nameCapitalized = nameToAdd.value
    .split(" ")
    .map((p) => {
      return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
    })
    .join(" ");

  if (pack_names.value.includes(nameCapitalized)) return;
  pack_names.value.push(nameCapitalized);
  nameToAdd.value = "";
};

const removeCandleName = (index) => {
  pack_names.value.splice(index, 1);
};

const ondUpload = (event) => {
  fileImageUploadRef.value.uploadedFiles.push(event.files[0]);
  imageFile.value = event.files[0];
};

const onRemove = (event) => {
  imageFile.value = undefined;
};

const onRemoveTemplatingFile = (fileData, removeFileCallback, index) => {
  removeFileCallback(index);
  imageFile.value = undefined;
};

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};

onMounted(async () => {
  await listCandleTypes().then(({ data }) => {
    candleTypeOptions.value = data;
  });

  if (props.isEdit) {
    await getCandleInfoById();
  } else {
    visible.value = true;
    is_pack.value = false;
    is_vip_pack.value = false;
    pack_names.value = [];
  }
});
</script>
<style scoped></style>
