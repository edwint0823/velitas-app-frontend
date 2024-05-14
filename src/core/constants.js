export const HttpStatus = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  EARLYHINTS: 103,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  AMBIGUOUS: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  I_AM_A_TEAPOT: 418,
  MISDIRECTED: 421,
  UNPROCESSABLE_ENTITY: 422,
  FAILED_DEPENDENCY: 424,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
};
export const bulkPriceTypeName = "mayorista";
export const retailPriceTypeName = "detal";
export const warnTitleMessage = "Acción no permitida";
export const defaultObservationValue = "Sin observaciones";
export const statusNameValidToCancel = ["creado", "pendiente corel", "en corel"];
export const statusPublicNameCancel = "Cancelado";
export const statusForCandleInventoryMovement = {
  name: "En Proceso de marcado",
  order: 5,
};

export const statusForBagInventoryMovement = {
  name: "En Proceso de Empaquetado",
  order: 7,
};
export const baseStructureOrderDetailByCode = {
  customerName: "",
  totalPrice: 0,
  deliveryDate: "1999-01-01",
  statusName: "",
  publicStatusName: "",
  deliveryAddress: "",
  deliveryPrice: 0,
  additionalInfo: "",
  orderDetails: [
    {
      candleOptionName: "",
      candleOptionUrlImage: "",
      nameList: [{ name: "Juan", packAlone: true, deceased: false, pet: true }],
      price: 0,
      quantity: 1,
      observation: "Sin observaciones",
    },
  ],
};

export const baseStructureForEditOrderByCode = {
  code: "",
  customerName: "",
  customerPriceType: "",
  statusName: "",
  publicStatusName: "",
  details: [
    {
      id: 0,
      nameToAdd: "",
      nameList: [{ name: "Juan", packAlone: true, deceased: false, pet: true }],
      price: 0,
      quantity: 0,
      observation: "",
      candleOptionId: 0,
    },
  ],
};
export const createOrEditDetailsOrderDialButtonItems = [
  {
    feature: "packAlone",
    tooltip: "Empacar solo",
    icon: "/icons/pack_alone.svg",
  },
  {
    feature: "deceased",
    tooltip: "Difunto",
    icon: "/icons/deceased.svg",
  },
  {
    feature: "pet",
    tooltip: "Mascota",
    icon: "/icons/pet.svg",
  },
];
export const menuItems = [
  {
    label: "Dashboard",
    icon: "pi pi-home",
    iconColor: "",
    root: false,
    route: "dashboard",
  },
  {
    label: "Inventario",
    icon: "pi pi-box",
    iconColor: "",
    root: true,
    items: [
      [
        {
          label: "Inventario",
          items: [
            {
              label: "Listado Velas",
              icon: "pi pi-list",
              iconColor: "",
              route: "list_candle_inventory",
            },
            {
              label: "Listado Bolsas",
              icon: "pi pi-list",
              iconColor: "",
              route: "list_bag_inventory",
            },
          ],
        },
      ],
    ],
  },
  {
    label: "Pedidos",
    icon: "pi pi-truck",
    iconColor: "",
    root: true,
    items: [
      [
        {
          label: "Pedidos",
          items: [
            {
              label: "Listar",
              icon: "pi pi-list",
              iconColor: "",
              route: "list_orders",
            },
            {
              label: "Crear",
              icon: "pi pi-plus",
              iconColor: "",
              route: "create_order",
            },
            {
              label: "Buscar",
              icon: "pi pi-search",
              iconColor: "",
              route: "search_order",
            },
          ],
        },
      ],
    ],
  },
  {
    label: "Clientes",
    icon: "pi pi-briefcase",
    iconColor: "",
    root: true,
    items: [
      [
        {
          label: "Clientes",
          items: [
            {
              label: "Listar",
              icon: "pi pi-box",
              iconColor: "",
              route: "list_orders",
            },
            {
              label: "Crear",
              icon: "pi pi-box",
              iconColor: "",
              route: "create_order",
            },
          ],
        },
      ],
    ],
  },
  {
    label: "Usuarios",
    icon: "pi pi-box",
    iconColor: "",
    root: true,
    items: [
      [
        {
          label: "Usuarios",
          items: [
            {
              label: "Listar",
              icon: "pi pi-box",
              iconColor: "",
              route: "list_orders",
            },
            {
              label: "Crear",
              icon: "pi pi-box",
              iconColor: "",
              route: "create_order",
            },
          ],
        },
      ],
    ],
  },
];
export const breadCrumbsLabels = {
  order: {
    main: "Pedidos",
    createOrder: "Crear Pedido",
    searchOrderByCode: "Ver pedido",
    editOrder: "Editar Pedido",
  },
  dashboard: {
    main: "dashboard",
  },
};

export const createOrderValidation = {
  validEmail: "Debe ser un email valido",
  requiredEmail: "El correo del cliente es requerido",
  requiredName: "El nombre del cliente es requerido",
  requiredPhone: "El numero telefónico es requerido",
  completePhone: "Ingrese el numero telefónico completo",
};
export const createDetailOrderMessages = {
  noCandleSelected: "Seleccione una vela para poder realizar la acción",
  createTitleError: "No es posible crear el pedido",
  candleListEmpty: "Debe agregar al menos una vela al pedido",
  nameListEmpty: "Todos las velas deben tener al menos un nombre",
  candleNotSelected: "Algunas velas no tienen un tipo seleccionado",
  detailSuccessCreate:
    "La fecha estimada para su entrega es para { date }. \n Si desea  conocer el estado de su pedido puede dar click { link }",
  candleIsVipPack: "El tipo de vela seleccionado no permite agregar nombres personalizados",
  deliveryAddressRequired: "La dirección de envío es requerida",
  deliverAddressMaxLength: "La dirección de envío no puede tener mas de 255 caracteres",
};

export const editOrderValidation = {
  requiredDeliveryAddress: "La dirección de envío es obligatoria",
};

export const editOrderMessages = {
  noCandleSelected: "Seleccione una vela para poder realizar la acción",
  candleIsVipPack: "El tipo de vela seleccionado no permite agregar nombres personalizados",
  updateTitleError: "No es posible actualizar el pedido",
  candleListEmpty: "Debe agregar al menos una vela al pedido",
  nameListEmpty: "Todos las velas deben tener al menos un nombre",
  candleNotSelected: "Algunas velas no tienen un tipo seleccionado",
};

export const createCandleInventoryMovementMessages = {
  requiredQuantity: "La cantidad a registrar es requerida",
  requiredMovementType: "El tipo de movimiento es requerido",
  requiredObservation: "La observación del movimiento es requerida",
};
export const createBagInventoryMovementMessages = {
  requiredQuantity: "La cantidad a registrar es requerida",
  requiredMovementType: "El tipo de movimiento es requerido",
  requiredObservation: "La observación del movimiento es requerida",
};

export const loginMessages = {
  requiredUserName: "El nombre de usuario es requerido",
  minLengthPassword: "La contraseña debe ser de al menos 6 caracteres",
  requiredPassword: "La contraseña es requerida",
};

export const registerMessages = {
  requiredFirstName: "Los nombres son requeridos",
  requiredLastName: "Los apellidos son requeridos",
  userNameRequired: "El nombre de usuario es requerido",
  requiredEmail: "El correo electrónico es requerido",
  validEmail: "Correo electrónico invalido",
  requiredPassword: "La contraseña es requerida",
  minLengthPassword: "La contraseña debe ser de al menos 6 caracteres",
};
export const paginatedListOrdersMessages = {
  validateFiltersTittle: "Verifique los filtros a aplicar",
  deliveryDateFilterError: "La fecha final de entrega no puede ser antes de la fecha inicial",
  createdAtFilterError: "La fecha final de creación no puede ser antes de la fecha inicial",
};

export const updateOrderStatusMessages = {
  sameStatusErrorTitle: "Estado sin cambios",
  sameStatusErrorText: "El estado que ingreso es el mismo que tiene el pedido actualmente. Por favor verificar",
  inventoryMovementQuestionTittle: "Se realizara un movimiento de inventario",
  candleInventoryMovementText:
    "Al actualizar el estado se realizara una salida de inventario de velas, ¿Esta seguro de realizar esta acción ?",
  bagInventoryMovementText:
    "Al actualizar el estado se realizara una salida de inventario de bolsas, ¿Esta seguro de realizar esta acción ?",
  updateSuccessTitle: "Estado del pedido actualizado",
};

export const errorMessages = {
  validationFieldsError: "Error de validación de campos",
  notAuthorizedError: "No Autorizado",
  expiredSessionError: "La sesión ha expirado",
  notFoundError: "No encontrado",
  accessDeniedError: "Acceso denegado",
  accessDeniedDetailError: "No tiene permisos para realizar esta acción",
  internalServerError: "Error interno del servidor",
};

export const successMessages = {
  userRegistered: "Usuario registrado con éxito",
};

export const statusColorPalette = {
  Creado: "text-orange-500",
  "Pendiente Corel": "text-amber-600",
  "En Corel": "text-yellow-600",
  Impreso: "text-lime-600",
  "En Proceso de marcado": "text-teal-600",
  Marcado: "text-cyan-600",
  "En Proceso de Empaquetado": "text-sky-600",
  Entregado: "text-green-600",
  Cancelado: "text-red-600",
  Empacado: "text-emerald-600",
};
