import axios from "../../libs/axios.lib.js";

const API_BACKEND_VELAS = import.meta.env.VITE_API_BACKEND_VELAS;

export const createCandleOrder = async (orderPayload) => {
  return axios.post(`${API_BACKEND_VELAS}/order/create`, orderPayload);
};

export const getOrderByCode = async (code) => {
  return await axios.get(`${API_BACKEND_VELAS}/order/find_by_code/${code}`);
};

export const paginateOrderList = async (pageNumber, pageSize, payload) => {
  return await axios.get(`${API_BACKEND_VELAS}/order/paginate_list/${pageSize}/${pageNumber}`, {
    headers: {
      auth: true,
    },
    params: { ...payload },
  });
};

export const updateOrderStatus = async (orderCode, newStatusId) => {
  return await axios.patch(
    `${API_BACKEND_VELAS}/order/update_status/${orderCode}/${newStatusId}`,
    {},
    {
      headers: {
        auth: true,
      },
    },
  );
};

export const getDetailAndBags = async (orderCode) => {
  return await axios.get(`${API_BACKEND_VELAS}/order/get_details_and_bags/${orderCode}`, {
    headers: {
      auth: true,
    },
  });
};

export const editOrderByCode = async (orderCode) => {
  return await axios.get(`${API_BACKEND_VELAS}/order/edit_order/${orderCode}`, {
    headers: {
      auth: true,
    },
  });
};

export const updateOrderAndDetails = async (orderCode, orderPayload) => {
  return await axios.put(`${API_BACKEND_VELAS}/order/update_order_and_details/${orderCode}`, orderPayload, {
    headers: {
      auth: true,
    },
  });
};

export const downloadExcel = async (orderCode) => {
  return window.open(`${API_BACKEND_VELAS}/order/export_to_excel/${orderCode}`, "_blank");
};
