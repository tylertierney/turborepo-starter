import styles from './EyeTopSvg.module.scss'
import { ComponentProps } from 'react'

export const EyeTopSvg = ({ className, ...rest }: ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    id="eye-top"
    viewBox="0 0 600 550"
    // width={600}
    // height={550}
    className={`${className} ${styles.svg}`}
    {...rest}
  >
    {/* <defs>
      <style>
        {'a{fill:var(--foreground); font-family: serif;font-size:20px}'}
      </style>
    </defs> */}
    <path
      id="path3647"
      d="M411.406 266.247c3.66 98.411-71.881 157.56-158.854 157.56-27.866 0-35.878-1.744-55.214-3.701-14.68 25.882-7.325 46.493-27.36 73.192-16.19-6.96-31.457-17.468-50.598-27.051 7.453-21.058 16.657-43.563 42.376-62.874-41.898-33.92-62.787-83.64-67.41-136.803-6.094-70.056 39.404-124.432 98.196-146.728 35.528-31.558 76.762-49.586 125.461.818 56.49 23.954 93.403 80.396 93.403 145.587z"
      style={{
        fill: '#a7adb6',
        stroke: '#000',
        strokeWidth: 0.88706362,
        strokeLinecap: 'butt',
      }}
      transform="matrix(1.12732 0 0 1.12732 54.12 -26.967)"
    />
    <path
      id="path6760"
      d="M509.693 276.113c-8.731 99.239-69.64 164.023-166.91 167.633-92.071 3.418-164.043-76.292-169.477-168.664-4.109-69.839 55.27-167.28 169.477-166.602 99.848.593 166.396 80.258 166.91 167.633z"
      style={{
        fill: '#ecb100',
        stroke: '#000',
        strokeWidth: 0.99999917,
        strokeLinecap: 'butt',
      }}
    />
    <path
      id="path7649"
      d="M391.087 261.413c0 59.11-46.584 107.027-104.048 107.027s-104.047-47.917-104.047-107.027 46.583-107.027 104.047-107.027 104.048 47.918 104.048 107.027z"
      style={{
        fill: 'var(--background)',
        stroke: '#000',
        strokeWidth: 0.65354329,
        strokeLinecap: 'butt',
      }}
      transform="translate(-98.007 -127.749) scale(1.53012)"
    />
    <path
      id="path1873"
      d="M199.138 503.316c12.387-32.809 30.017-51.235 38.478-59.997 8.096-8.398 9.636-15.254 11.489-22.066 1.898-6.981-4.458-17.09-11.307-21.883-6.971-4.878-27.917-28.475-34.466-39.39-6.549-10.915-15.43-34.662-16.96-42.308-.613-3.07-6.58-24.95-7.64-48.176-.524-11.45 1.781-34.761 8.105-51.47 5.73-15.138 11.251-20.01 17.225-29.283-12.346 23.022-21.488 48.463-21.17 74.664.319 26.02 8.78 69.963 24.356 90.726 6.063 8.083 21.392 32.505 40.114 44.712 20.33.414 20.004 7.625 22.568 14.389 17.55-4.139 30.657 12.007 43.127 17.476 15.945-.824 36.846 6.055 43.96 4.95 8.92-1.385 8.79-6.254 16.093-7.671 20.883-4.053 40.303-11.583 54.164-20.759 16.277-10.775 42.927-38.318 58.198-70.104 4.984-10.374 14.822-43.046 13.15-74.912-1.493-28.456-4.273-37.556-19.013-71.1 15.59 31.463 26.034 40.346 24.436 80.239-1.597 39.88-7.394 66.815-35.743 105.769-10.83 14.883-42.73 44.544-74.404 53.973-58.021 17.27-106.943 2.792-111.152 1.748-6.829-1.696-11.197 5.205-14.73 7.754-3.45 2.487-12.566 24.68-13.44 27.888-4.105 15.05-6.273 34.603-19.878 55.255"
      style={{
        fill: 'red',
        stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path9428"
      d="M394.446 127.47c0 13.69-22.63 24.801-50.514 24.801-27.883 0-50.514-11.11-50.514-24.8 20.478-18.48 81.594-15.776 101.028 0z"
      style={{
        fill: '#94b3c3',
        stroke: '#000',
        strokeWidth: 0.93822116,
        strokeLinecap: 'butt',
      }}
      transform="matrix(1 0 0 1.13603 .182 -19.072)"
    />
    <path
      id="path7656"
      d="M284.665 118.17c60.237-9.236 72.024-10.01 114.158-.365-10.783-21.25-26.71-32.486-54.526-33.92-27.656-1.424-44.382 15.22-59.632 34.102"
      className={styles.lens}
      style={{
        // fill: '#d1d3d3',
        stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path11201"
      d="M254.576 131.482c8.416-5.207 15.317-12.423 28.63-14.042 38.034-4.625 29.368-2.67 2.759 2.452.896 5.44 3.59 10.01 1.436 15.602-3.317-.247-3.886-7.105-6.748-4.741-.571.714-.902 1.32-2.188 1.64-1.413.354-2.02-1.556-3.647-2.37-.887-.443-3.452 5.21-3.921 5.562-2.346.36-3.263-1.037-5.197-2.462-2.707-.676-.76 3.345-3.192 2.189-1.776-.844-5.078-1.01-5.835 0-2.787-.42-1.5-1.333-2.097-3.83z"
      style={{
        fill: '#980000',
        stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path12088"
      d="M431.81 132.623c-8.417-5.208-16.827-13.18-37.385-16.504-45.095-7.29-34.565-4.22 4.9 5.096-.713 5.257-1.766 9.19.389 14.781 3.317-.246 3.155-6.466 6.018-4.103.571.714.902 1.32 2.188 1.641 1.413.354 2.02-1.556 3.647-2.37.886-.443 3.451 5.21 3.92 5.562 2.346.359 3.264-1.037 5.198-2.462 2.707-.677.76 3.344 3.192 2.188 1.775-.844 5.077-1.01 5.835 0 2.787-.419 1.5-1.332 2.097-3.83z"
      style={{
        fill: '#980000',
        stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path12090"
      d="M392.35 135.22c1.2 1.095 3.358.958 6.61.365"
      style={{
        fill: '#ecb100',
        stroke: '#d1ef00',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path12977"
      d="M288.388 133.203c4.007.281 5.096-.121 6.186-.751"
      style={{
        fill: '#ecb100',
        stroke: '#d1ef00',
        strokeWidth: '1.00000024px',
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path12979"
      d="M285.349 121.908c1.678 1.084 2.836 2.464 4.058 4.24.449.653 1.337 1.839 1.823 2.325.621.621.788 2.097 2.599 2.097"
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        stroke: '#980000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path12981"
      d="M294.421 123.276c.62.464-1.263.966-1.64 1.641-2.277 4.072-5.639 5.456-5.836 5.653"
      style={{
        fill: 'none',
        stroke: '#980000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path13868"
      d="M400.923 126.47c-4.033.132-5.335 8.492-7.893 7.425"
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        stroke: '#980000',
        strokeWidth: '1.00000012px',
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path13870"
      d="M400.581 133.069c-5.226.79-3.471-5.957-5.56-5.993"
      style={{
        fill: 'none',
        stroke: '#980000',
        strokeWidth: '.9999997px',
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14008"
      d="M90.384 262 165 264"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14010"
      d="M109.5 234h70"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14012"
      d="m148 201.5 45.5 2"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14014"
      d="M193.5 115.5 289 127"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14016"
      d="m206 84.5 87 35.5"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14018"
      d="m319 166-28-33.5"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14020"
      d="M257.5 53.5 302 112"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14022"
      d="m316 43 22.5 59"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14024"
      d="m397 56-26.5 27.5"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14026"
      d="m360.5 98 49.5-5.5"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14028"
      d="m416.455 126.9 61.236 10.496"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14030"
      d="m356 436.5-1 18.5"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14033"
      d="m151.32 401.508 108.895 7.07"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <path
      id="path14035"
      d="m135.764 460.905 101.824 11.313"
      className={styles.line}
      style={{
        fill: 'none',
        fillOpacity: 0.75,
        // stroke: '#000',
        strokeWidth: 1,
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
      }}
    />
    <a target="_blank" href="http://en.wikipedia.org/wiki/Fovea">
      <text xmlSpace="preserve" id="text14037" x={339.232} y={474.502}>
        <tspan id="tspan14039" x={339.232} y={474.503}>
          {'fovea'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Optic_nerve">
      <text xmlSpace="preserve" id="text14041" x={45.96} y={456.592}>
        <tspan id="tspan14043" x={45.96} y={456.592}>
          {'optic nerve'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Optic_disc">
      <text xmlSpace="preserve" id="text14045" x={68.983} y={405.885}>
        <tspan id="tspan14047" x={68.983} y={405.885}>
          {'optic disc'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Sclera">
      <text xmlSpace="preserve" id="text14049" x={36.671} y={268.626}>
        <tspan id="tspan14051" x={36.671} y={268.626}>
          {'sclera'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Choroid">
      <text xmlSpace="preserve" id="text14053" x={43.733} y={237.822}>
        <tspan id="tspan14055" x={43.733} y={237.822}>
          {'choroid'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Vitreous_humour">
      <text xmlSpace="preserve" id="text14057" x={285.072} y={275.923}>
        <tspan id="tspan14059" x={285.072} y={275.923}>
          {'vitrous humour'}
        </tspan>
      </text>
    </a>
    <a
      target="_blank"
      href="http://en.wikipedia.org/wiki/Suspensory_ligament_of_the_lens"
    >
      <text xmlSpace="preserve" id="text14061" x={255.554} y={186.309}>
        <tspan id="tspan14063" x={255.554} y={186.309}>
          {'suspensory ligament'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Retina">
      <text xmlSpace="preserve" id="text14065" x={95.908} y={203.708}>
        <tspan id="tspan14067" x={95.908} y={203.708}>
          {'retina'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Zonular_fibres">
      <text xmlSpace="preserve" id="text14069" x={81.669} y={120.123}>
        <tspan id="tspan14071" x={81.669} y={120.123}>
          {'zonular fibres'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Lens_%28anatomy%29">
      <text xmlSpace="preserve" id="text14073" x={327.405} y={135.66}>
        <tspan id="tspan14075" x={327.405} y={135.66}>
          {'lens'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Ciliary_muscle">
      <text xmlSpace="preserve" id="text14077" x={481.057} y={141.046}>
        <tspan id="tspan14079" x={481.057} y={141.046}>
          {'ciliary muscle'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Anterior_chamber">
      <text xmlSpace="preserve" id="text14081" x={411.064} y={81.927}>
        <tspan id="tspan14083" x={411.064} y={81.927}>
          {'anterior chamber'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Cornea">
      <text xmlSpace="preserve" id="text14085" x={389.299} y={46.654}>
        <tspan id="tspan14087" x={389.299} y={46.654}>
          {'cornea'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Posterior_chamber">
      <text xmlSpace="preserve" id="text14089" x={67.422} y={75.779}>
        <tspan id="tspan14091" x={67.422} y={75.779}>
          {'posterior chamber'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Iris_%28anatomy%29">
      <text xmlSpace="preserve" id="text14093" x={237.396} y={47.854}>
        <tspan id="tspan14095" x={237.396} y={47.854}>
          {'iris'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Pupil">
      <text xmlSpace="preserve" id="text14097" x={301.418} y={35.227}>
        <tspan id="tspan14099" x={301.418} y={35.227}>
          {'pupil'}
        </tspan>
      </text>
    </a>
    <a target="_blank" href="http://en.wikipedia.org/wiki/Aqueous_humour">
      <text xmlSpace="preserve" id="text1933" x={418.492} y={101.36}>
        <tspan id="tspan1935" x={418.492} y={101.36}>
          {'(aqueous humour)'}
        </tspan>
      </text>
    </a>
  </svg>
)
