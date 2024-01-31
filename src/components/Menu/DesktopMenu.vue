<template>
  <aside v-if="isLoggedIn">
    <MegaMenu :model="isLoggedIn ? items: []" orientation="vertical">
      <template #start>
        <div class="flex items-center flex-col mb-5">
          <img src="../../../public/images/logo_app.png" alt="" class="w-1/2"/>
          <span class="font-semibold dark:text-white text-surface-900">VELITAS APP</span>
        </div>
      </template>
      <template #item="{item}">
        <a v-if="item.root"
           class="flex align-items-center cursor-pointer px-3 py-2 overflow-hidden relative items-center"
           style="border-radius: 2rem">
          <span :class="[item.icon, item.iconColor ]"/>
          <span class="ml-2 flex-1">{{ item.label }}</span>
          <span class="pi pi-arrow-right "/>
        </a>
        <router-link v-else v-slot="{ href, navigate }" :to="{name: item.route}" custom>
          <a :href="href" @click="navigate"
             class="flex align-items-center cursor-pointer px-3 py-2 overflow-hidden relative items-center">
            <span :class="[item.icon, item.iconColor ]"/>
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </MegaMenu>
  </aside>
</template>
<script setup>

import {computed, ref} from "vue";

const isLoggedIn = computed(() => {
  // Todo: agregar storage para usuario loguedo
  return true
})


const items = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    iconColor: '',
    root: false,
    route: 'dashboard'
  },
  {
    label: 'Pedidos',
    icon: 'pi pi-box',
    iconColor: '',
    root: true,
    items: [
      [
        {
          label: 'Pedidos',
          items: [
            {
              label: 'Listar',
              icon: 'pi pi-box',
              iconColor: '',
              route: 'list_orders'
            },
            {
              label: 'Crear',
              icon: 'pi pi-box',
              iconColor: '',
              route: 'create_order'
            }
          ]
        }

      ]
    ]
  },
  {
    label: 'Clientes',
    icon: 'pi pi-briefcase',
    iconColor: '',
    root: true,
    items: [
      [
        {
          label: 'Clientes',
          items: [
            {
              label: 'Listar',
              icon: 'pi pi-box',
              iconColor: '',
              route: 'list_orders'
            },
            {
              label: 'Crear',
              icon: 'pi pi-box',
              iconColor: '',
              route: 'create_order'
            }
          ]
        }

      ]
    ]
  },
  {
    label: 'Usuarios',
    icon: 'pi pi-box',
    iconColor: '',
    root: true,
    items: [
      [
        {
          label: 'Usuarios',
          items: [
            {
              label: 'Listar',
              icon: 'pi pi-box',
              iconColor: '',
              route: 'list_orders'
            },
            {
              label: 'Crear',
              icon: 'pi pi-box',
              iconColor: '',
              route: 'create_order'
            }
          ]
        }
      ]
    ]
  }
])

</script>