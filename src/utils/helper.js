import currency from "currency.js";
import Cookies from "js-cookie";

const helpers = {
  formatCurrency(number, precision = 0) {
    const cop = (value) =>
      currency(value, {
        symbol: "$",
        separator: ".",
        decimal: ",",
        precision: precision,
      });
    if (number) {
      return cop(number).format();
    } else {
      return 0;
    }
  },
  isMobileDevice() {
    // window.innerWidth < 766
    console.log(navigator.userAgent);
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  permissionCheck(permissionCodeName) {
    const user = JSON.parse(Cookies.get("token"));
    if (!user) return false;
    if (user.is_superuser) return true;
    return user.permissions.includes(permissionCodeName);
  },
};

const install = (app) => {
  app.config.globalProperties.$h = helpers;
};
export { install as default, helpers as helper };
