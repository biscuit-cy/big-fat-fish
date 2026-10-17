export function Skyline() {
  return (
    <div className="skyline" aria-hidden="true">
      <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
        <g className="skyline__far" fill="#2b3c35">
          <path d="M0 420V292h92v-38h52v38h74v-64h54v64h92v-46h42v46h106v-92h64v92h68v-34h62v34h78v-76h58v76h86v-50h46v50h92v-86h62v86h44v-38h70v38h72v-64h54v64h70Z" />
        </g>

        <g className="skyline__near" fill="#17231e">
          <rect x="-24" y="310" width="170" height="110" />
          <rect x="130" y="272" width="104" height="148" />
          <path d="M112 276L184 216L256 276Z" />
          <rect x="252" y="244" width="86" height="176" />
          <rect x="270" y="220" width="50" height="24" />
          <rect x="348" y="300" width="174" height="120" />
          <path d="M330 304L436 264L542 304Z" />
          <rect x="536" y="252" width="122" height="168" />
          <rect x="556" y="226" width="42" height="26" />
          <rect x="672" y="298" width="82" height="122" />
          <rect x="768" y="270" width="152" height="150" />
          <path d="M744 274L844 212L944 274Z" />
          <rect x="934" y="302" width="110" height="118" />
          <rect x="1060" y="234" width="88" height="186" />
          <rect x="1080" y="196" width="22" height="38" />
          <rect x="1160" y="282" width="150" height="138" />
          <rect x="1184" y="252" width="102" height="30" />
          <rect x="1326" y="312" width="138" height="108" />
          <path d="M1348 316L1428 276L1508 316Z" />
        </g>

        <g className="skyline__details" stroke="#f4ecde" strokeOpacity=".12" fill="none">
          <path d="M300 244v-28m-14 0h28" />
          <path d="M1080 196v-34" />
          <circle cx="1080" cy="158" r="3" fill="#eab578" stroke="none" opacity=".5" />
          <path d="M888 298V252m40 46V236m40 62v-34" />
        </g>

        <g className="skyline__windows" fill="#efb878">
          <rect x="36" y="332" width="10" height="14" rx="1" />
          <rect x="62" y="332" width="10" height="14" rx="1" />
          <rect x="152" y="294" width="9" height="13" rx="1" />
          <rect x="188" y="294" width="9" height="13" rx="1" />
          <rect x="272" y="270" width="8" height="12" rx="1" />
          <rect x="298" y="270" width="8" height="12" rx="1" />
          <rect x="380" y="322" width="9" height="12" rx="1" />
          <rect x="414" y="322" width="9" height="12" rx="1" />
          <rect x="462" y="322" width="9" height="12" rx="1" />
          <rect x="558" y="280" width="9" height="13" rx="1" />
          <rect x="600" y="280" width="9" height="13" rx="1" />
          <rect x="690" y="322" width="8" height="12" rx="1" />
          <rect x="788" y="296" width="9" height="13" rx="1" />
          <rect x="840" y="296" width="9" height="13" rx="1" />
          <rect x="880" y="296" width="9" height="13" rx="1" />
          <rect x="954" y="326" width="8" height="12" rx="1" />
          <rect x="1082" y="262" width="9" height="13" rx="1" />
          <rect x="1112" y="262" width="9" height="13" rx="1" />
          <rect x="1182" y="306" width="9" height="13" rx="1" />
          <rect x="1216" y="306" width="9" height="13" rx="1" />
          <rect x="1262" y="306" width="9" height="13" rx="1" />
          <rect x="1350" y="334" width="8" height="12" rx="1" />
        </g>
      </svg>
    </div>
  )
}
