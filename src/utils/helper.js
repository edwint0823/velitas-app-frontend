import currency from "currency.js";

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
}

const install = (app) => {
    app.config.globalProperties.$h = helpers;
};
export {install as default, helpers as helper};