<template>
  <div style="min-height: 84vh">
    <Card class="mb-5">
      <template #title> Información del Cliente</template>
      <template #content>
        <div class="grid grid-cols-3">
          <div class="flex flex-col gap-2">
            <label for="client_email">Correo Electrónico: </label>
            <div class="flex w-full">
              <InputText id="client_email" v-model="client_email" type="text" class="w-[55%]"
                         :disabled="disableFields"/>
              <Button :icon="`pi pi-${!disableFields ? 'search' : 'pencil'}`" rounded text raised
                      @click="searchClient"/>
            </div>

            <small class="text-red-600">{{ errors.client_email || '&nbsp;' }}</small>
          </div>
          <div class="flex flex-col gap-2" v-if="showClientExtraInfo">
            <label for="client_name">Nombre:</label>
            <InputText id="client_name" v-model="client_name" type="text"
                       class="w-1/2" :disabled="disableFields"
            />
            <small class="text-red-600">{{ errors.client_name || '&nbsp;' }}</small>
          </div>
          <div class="flex flex-col gap-2" v-if="showClientExtraInfo">
            <label for="client_tel">Num. Telefónico:</label>
            <InputMask id="client_tel" v-model="client_tel" mask="999 999 9999" placeholder="999 999 9999"
                       class="w-1/2" :disabled="disableFields"
            />
            <small class="text-red-600">{{ errors.client_tel || '&nbsp;' }}</small>
          </div>
        </div>
        <div class="flex justify-end">
          <Button type="button" label="Guardar" @click="saveClientData" v-show="showSubmitButton"/>
        </div>
      </template>
    </Card>
    <div v-show="showTableProducts">
      <TableProducts ref="tableProductsRef"/>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useForm} from 'vee-validate';
import * as yup from 'yup'
import {useMainStore} from '@/store/main.store.js'
import {useOrdersCreateStore} from '@/store/order/orders_create.store.js'
import {getDataClientByEmail} from '@/services/orders/createOrder.service.js'
import TableProducts from "@/components/orders/tableProducts.vue";

const mainStore = useMainStore()
const ordersCreateStore = useOrdersCreateStore()

const tableProductsRef = ref()

const schema = yup.object({
  client_email: yup.string().default('').email('Debe ser un email valido').required('El correo del cliente es requerido'),
  client_name: yup.string().default('').required('El nombre del cliente es requerido').max(50),
  client_tel: yup.string().required('El numero telefónico es requerido').max(12, 'Ingrese el numero telefónico completo').min(12, 'Ingrese el numero telefónico completo')
})
const {errors, defineField, handleSubmit, resetForm} = useForm({
  validationSchema: schema
})

const [client_email] = defineField('client_email');
const [client_name] = defineField('client_name');
const [client_tel] = defineField('client_tel');
const priceType = ref('detal')

const showClientExtraInfo = ref(false)
const disableFields = ref(false)
const showSubmitButton = ref(false)
const showTableProducts = ref(false)

const saveClientData = handleSubmit((values) => {
  console.log(values)
  ordersCreateStore.setClientInfo({
    email: values.client_email,
    name: values.client_name,
    tel: values.client_tel,
    priceType: priceType.value
  })
  disableFields.value = true
  showTableProducts.value = true
})

const searchClient = async () => {
  if (!disableFields.value) {
    if (!errors.value.hasOwnProperty('client_email') && ![undefined, '', null].includes(client_email.value)) {
      await getDataClientByEmail(client_email.value).then((data) => {
        const {found, ...clientData} = data
        if (found) {
          client_name.value = clientData.name
          client_tel.value = clientData.tel
          priceType.value = clientData.priceType
          saveClientData()
        } else {
          priceType.value = 'detal'
          showSubmitButton.value = true
        }
        showClientExtraInfo.value = true
      })
    }
  } else {
    //
    disableFields.value = false
    showClientExtraInfo.value = false
    showSubmitButton.value = false
    showTableProducts.value = false
    ordersCreateStore.setClientInfo({
      email: '',
      name: '',
      tel: '',
      priceType: ''
    })
    resetForm()
    tableProductsRef.value.clearList()
  }
}

onMounted(() => {
  mainStore.setBreadcrumbs([
    {label: 'Pedidos'},
    {label: 'Crear Pedido', route: 'create_order'}
  ])

})
/*
* <template>
  <form @submit="onSubmit">
    <div v-for="(field, idx) in fields" :key="field.id">
      <input :name="`links[${idx}].url`" type="url" />
      <button type="button" @click="remove(idx)">Remove</button>
    </div>
    <button type="button" @click="push({ url: '' })">Add</button>
    <button>Submit</button>
  </form>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

const { handleSubmit, errors, defineField } = useForm({
  initialValues: {
    links: [{ id: 1, url: 'https://github.com/logaretm' }],
  },
  validationSchema: yup.object({
    links: yup.array().of(
      yup.object({
        id: yup.number().required(),
        url: yup.string().required(),
      })
    ),
  }),
});

const { remove, push, fields } = useFieldArray('links');

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
//
*/

</script>
