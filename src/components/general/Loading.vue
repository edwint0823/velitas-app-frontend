<template>
  <div id="loading-component" class="absolute z-10 hidden h-full w-full bg-white/80">
    <div class="absolute left-[45%] top-[45%]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="background: rgba(241, 242, 243, 0)"
        width="170px"
        height="170px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle cx="50" cy="50" r="0" fill="none" stroke="#4ade80" stroke-width="5">
          <animate
            attributeName="r"
            repeatCount="indefinite"
            dur="1s"
            values="0;45"
            keyTimes="0;1"
            keySplines="0 0.2 0.8 1"
            calcMode="spline"
            begin="0s"
          ></animate>
          <animate
            attributeName="opacity"
            repeatCount="indefinite"
            dur="1s"
            values="1;0"
            keyTimes="0;1"
            keySplines="0.2 0 0.8 1"
            calcMode="spline"
            begin="0s"
          ></animate>
        </circle>
        <circle cx="50" cy="50" r="0" fill="none" stroke="#7dd3fc" stroke-width="5">
          <animate
            attributeName="r"
            repeatCount="indefinite"
            dur="1s"
            values="0;45"
            keyTimes="0;1"
            keySplines="0 0.2 0.8 1"
            calcMode="spline"
            begin="-0.5s"
          ></animate>
          <animate
            attributeName="opacity"
            repeatCount="indefinite"
            dur="1s"
            values="1;0"
            keyTimes="0;1"
            keySplines="0.2 0 0.8 1"
            calcMode="spline"
            begin="-0.5s"
          ></animate>
        </circle>
      </svg>
    </div>
  </div>
</template>
