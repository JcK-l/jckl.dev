import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { isBitSet, SentimentStateFlags } from "../stores/sentimentStateStore";

export const Face = () => {
  let ref = useRef(null);

  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0% 0%", "100% 0%"],
  });

  let layer = useTransform(scrollYProgress, [0, 1], ["0vh", "10vh"]);

  return (
    <div
      ref={ref}
      className="relative z-30 mb-8 h-auto w-10/12 select-none overflow-hidden bg-bgColor sm:w-9/12 md:mb-10 md:w-8/12 lg:w-6/12 2xl:w-5/12 desk:w-4/12 desk-l:w-4/12"
    >
      <svg
        viewBox="0 0 900 743"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className="relative -z-30"
      >
        <path style={{ fill: "none" }} d="M 0,0 V 743 H 900 V 0 Z" />
      </svg>

      {isBitSet(SentimentStateFlags.FLAG_NEGATIVE) ? (
        <div></div>
      ) : isBitSet(SentimentStateFlags.FLAG_NEUTRAL) ? (
        <motion.img
          style={{ y: layer }}
          className={"absolute bottom-0 left-0 mix-blend-screen"}
          src="/jTransparent.avif"
        />
      ) : isBitSet(SentimentStateFlags.FLAG_POSITIVE) ? (
        <motion.img
          style={{ y: layer }}
          className={"absolute bottom-0 left-0 mix-blend-screen"}
          src={"/classicPhone.avif"}
        />
      ) : (
        <motion.img
          style={{ y: layer }}
          className={"absolute bottom-0 left-0 mix-blend-screen"}
          srcSet="/MeTransparent-sm.avif 500w, /MeTransparent-md.avif 1000w, /MeTransparent-l.avif 1500w, /MeTransparent-xl.avif 2000w"
          sizes="(max-width: 500px) 500w, (max-width: 1500px) 1000w, (max-width: 2000px) 1500w, 2000w"
          alt="Get a better browser"
        />
      )}

      <svg
        className="absolute left-0 top-0 z-10"
        viewBox="0 0 900 743"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          style={{
            filter:
              "drop-shadow(0 15px 15px rgba(35, 25, 66, 0.05)) drop-shadow(0 8px 5px rgba(35, 25, 66, 0.1))",
            fill: "var(--color-secondary)",
            opacity: 1,
          }}
          d="M 0,0 V 743 H 900 V 0 Z m 331.7852,104.4824 c 28.5059,0.2033 57.1359,2.3928 83.2265,3.9746 69.6046,4.1394 125.97,2.5086 152.1582,31.9532 26.1095,29.4146 38.007,76.3095 81.59381,118.7324 43.5083,42.3932 113.8793,81.7606 114.6797,104.8281 0.8004,23.0677 -83.8557,43.4598 -130.7676,83.457 -46.88201,39.9184 -56.02091,99.4419 -98.24801,155.3399 -42.2761,55.7896 -117.7485,108.0035 -152.5899,80.5 C 346.9176,655.7346 352.6284,548.4838 312.793,476.4394 272.8492,404.4439 187.3595,367.6553 156,308.6289 c -31.3594,-59.0264 -8.5888,-140.2897 46.6426,-176.5957 34.4705,-22.71 81.6327,-27.8896 129.1426,-27.5508 z"
        />
        <motion.path
          style={{
            filter:
              "drop-shadow(0 15px 15px rgba(35, 25, 66, 0.05)) drop-shadow(0 8px 5px rgba(35, 25, 66, 0.1))",
            fill: "var(--color-transition1)",
            opacity: 1,
          }}
          d="M 0,0 V 743 H 900 V 0 Z m 279.77149,100 h 127.62305 c 17.4936,0.033 83.92346,0.6663 97.38086,1.1543 85.5714,2.9171 110.04147,-5.8019 144.92187,31.8809 34.9198,37.8274 29.4379,123.3959 55.9043,191.5742 26.4664,68.1784 84.73711,119.0047 108.66211,190.9824 23.9778,71.8858 13.64862,165.068 -42.63868,172.6817 -56.32669,7.469 -158.66496,-70.5375 -226.41796,-103.9434 -67.845,-33.4585 -101.14355,-22.4621 -145.46875,-23.1523 -44.4172,-0.7429 -99.94018,-13.4622 -145.17188,-51.2051 -45.0871,-37.7823 -80.0677,-100.6919 -91.2168,-178.5528 -11.2413,-77.9136 1.25817,-170.8322 55.38477,-209.2519 16.8436,-11.9728 37.71471,-18.6813 61.03711,-22.168 z"
        />
        <motion.path
          style={{
            filter:
              "drop-shadow(0 15px 15px rgba(35, 25, 66, 0.05)) drop-shadow(0 8px 5px rgba(35, 25, 66, 0.1))",
            fill: "var(--color-transition2)",
            opacity: 1,
          }}
          d="M 0,0 V 743 H 900 V 0 Z m 419.3047,131.9531 c 47.8941,0.7276 86.1607,13.5353 121.6015,18.0215 40.50371,5.0245 77.21281,-0.7179 134.12311,3.2812 56.9104,3.8966 133.9187,17.5344 149.1972,53.834 15.1761,36.197 -31.2738,95.0562 -54.7558,159.5547 -23.3793,64.4984 -23.7904,134.7395 -57.4239,169.8086 -33.6335,35.0691 -100.5919,34.8638 -186.72651,61.4219 C 439.0832,624.4332 333.6694,677.6508 260.455,655.5019 187.3431,633.2505 146.5323,535.6327 141.3027,444.166 c -5.3321,-91.4668 24.9169,-176.6785 75.9824,-230.8203 50.9629,-54.2442 122.8445,-77.3173 180.8828,-80.9063 7.2548,-0.4486 14.2948,-0.5903 21.1368,-0.4863 z"
        />
      </svg>

      <svg
        className="absolute inset-0 z-20 h-[101%] w-[101%]"
        viewBox="0 0 900 743"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          style={{
            filter:
              "drop-shadow(0 15px 15px rgba(35, 25, 66, 0.05)) drop-shadow(0 8px 5px rgba(35, 25, 66, 0.1))",
            fill: "var(--color-fg-color)",
          }}
          d="M 0,0 V 743 H 900 V 0 Z m 373.04887,107.92578 c 11.3543,-0.1479 22.7659,-0.013 34.1445,0.35156 91.1203,3.007 179.9623,20.59437 266.709,62.50977 86.6554,41.8242 171.0338,107.88654 180.3281,186.52344 9.2943,78.6368 -56.5867,169.84691 -115.0859,236.82031 -58.4082,67.0646 -109.4363,109.80104 -163.1973,115.08594 -53.761,5.285 -110.1641,-26.78939 -170.9414,-20.77539 -60.7773,6.0139 -125.9284,50.20709 -188.89259,47.83789 -62.9641,-2.278 -123.83212,-51.02809 -140.41602,-111.89649 -16.675,-60.8684 10.7519,-133.76326 27.0625,-218.41406 16.4017,-84.5597 21.68632,-180.87506 70.98242,-234.81836 43.1341,-47.28 119.82549,-62.18941 199.30669,-63.22461 z"
        />
      </svg>
    </div>
  );
};
