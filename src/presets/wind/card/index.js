export default {
  root: {
    class: [
      //Shape
      "rounded-lg",
      "shadow-lg",

      //Color
      "bg-white dark:bg-white",
      "text-black dark:black",
    ],
  },
  header: {
    // class: ['border-b border-surface-200 dark:border-surface-700']
    class: ["m-2"],
  },
  body: {
    class: "",
  },
  title: {
    class: "text-lg font-medium py-2 px-5 md:px-6",
  },
  subtitle: {
    class: [
      //Spacing
      "mb-1 px-5 md:px-6",

      //Color
      "text-surface-600 dark:text-surface-0/60",
    ],
  },
  content: {
    class: "py-2 lg:py-6 xl:py-6 2xl:py-6 px-2 lg:px-5 xl:px-6 2xl:px-6",
  },
  footer: {
    class: ["px-5 md:px-6 pt-5 pb-0", "border-t border-surface-200 dark:border-surface-700"],
  },
};
