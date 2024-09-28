export default {
  root: ({ props }) => ({
    class: [
      //Font
      "text-xs font-bold",

      //Alignments
      "inline-flex items-center justify-center",

      //Spacing
      "px-2 py-1",

      //Shape
      {
        "rounded-md": !props.rounded,
        "rounded-full": props.rounded,
      },

      //Colors
      // 'text-white dark:text-surface-900',
      {
        "text-green-700 bg-green-100 dark:text-primary-300 dark:bg-primary-500/80":
          props.severity == null || props.severity == "primary",
        "text-slate-600 bg-slate-100 dark:text-zinc-300 dark:bg-zinc-800": props.severity == "secondary",
        "text-green-700 bg-green-100 dark:text-green-600 dark:bg-green-500/16": props.severity == "success",
        "text-blue-700 bg-blue-100 dark:text-blue-600 dark:bg-blue-500/16": props.severity == "info",
        "text-orange-700 bg-orange-100 dark:text-yellow-600 dark:bg-yellow-500/16": props.severity == "warning",
        "text-red-700 bg-red-100 dark:text-red-600 dark:bg-red-500/16": props.severity == "danger",
      },
    ],
  }),
  value: {
    class: "leading-normal",
  },
  icon: {
    class: "mr-1 text-sm",
  },
};
