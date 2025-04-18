import { useState, useEffect } from "react";
import { usePhoneContext } from "../hooks/useDataContext";
import { setBit, isBitSet, GameStateFlags } from "../stores/gameStateStore";
import { $sentimentState } from "../stores/sentimentStateStore";
import { $pastDate, $currentDate } from "../stores/stringStore";
import { $offScriptCount } from "../stores/offScriptCountStore";
import { formatDate } from "../utility/formatDate";
import { useStore } from "@nanostores/react";

export const Phone = () => {
  const [input, setInput] = useState("*0");
  const { number, setNumber, timer, setTimer } = usePhoneContext();
  const sentimentState = useStore($sentimentState);
  const [isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    const savedFlags = sessionStorage.getItem("flags");
    const flags = JSON.parse(savedFlags || "[]");
    const allFlagsTrue: boolean = flags.every((flag: boolean) => flag === true);
    setIsFinal(allFlagsTrue);
  }, [sentimentState]);

  const handleButtonClick = (number: string) => {
    if (input.startsWith("*")) {
      const newInput = `*${number}`;
      setInput(newInput);
      setNumber(Number(number));
    } else {
      setInput((prevInput) => prevInput + number);
    }
  };

  const handleCancelClick = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  const handleCallClick = () => {
    setInput("");
    if (input.endsWith("#") && !isBitSet(GameStateFlags.FLAG_CONNECTION)) {
      console.log(`Input timer ${input}...`);
      setNumber(-1);
      const time = Number(input.slice(0, -1));
      setTimer(time);
      const currentDate = new Date();
      const pastDate = new Date(currentDate.getTime() - time * 60 * 60 * 1000);
      const isSuccess = pastDate.getFullYear() === 2024;

      if (isSuccess) {
        setBit(GameStateFlags.FLAG_CONNECTION);
      }
      $currentDate.set(formatDate(currentDate));
      $pastDate.set(formatDate(pastDate));
    } else {
      console.log(`Calling ${input}... Not really`);
      const inputNumber = getInputAsNumber();
      setNumber(inputNumber);
      if (inputNumber === 418 && !isFinal) {
        const offScriptCount = JSON.parse(
          sessionStorage.getItem("offScriptCount") || "0"
        );
        sessionStorage.setItem(
          "offScriptCount",
          JSON.stringify(offScriptCount + 1)
        );
        $offScriptCount.set(offScriptCount + 1);
      }
    }
  };

  const getInputAsNumber = () => {
    return Number(input);
  };

  const numberStyle = {
    fill: "var(--color-primary)",
    fillRule: "evenodd",
    stroke: "var(--color-primary)",
    strokeWidth: 0.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const numberBackgroundStyle = {
    opacity: 1,
    fill: "var(--color-white-shade)",
    fillOpacity: 1,
    fillRule: "evenodd",
    strokeWidth: 0.184,
    strokeLinecap: "square",
    strokeLinejoin: "bevel",
  };
  return (
    <div className="sm:3/12 relative mx-auto w-10/12 shrink-0 select-none md:w-4/12 2xl:w-3/12">
      <div className="poppins-extrabold h5-text relative flex h-auto items-center justify-center">
        {input === "" ? <>&nbsp;</> : input}
      </div>
      <svg
        className="relative m-4"
        viewBox="0 0 74.424544 125"
        version="1.1"
        id="svg1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(-29.433558,-45.307568)">
          <g transform="matrix(1.1659726,0,0,1.1659726,-10.345064,-24.332114)">
            <g
              id="call"
              cursor="pointer"
              onClick={handleCallClick}
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={{
                  opacity: 1,
                  fill: "var(--color-green)",
                  fillOpacity: 1,
                  fillRule: "evenodd",
                  strokeWidth: 0.184,
                  strokeLinecap: "square",
                  strokeLinejoin: "bevel",
                }}
                cx="79.073036"
                cy="196.06964"
                r="8.9518633"
              />
              <path
                d="m 80.65525,197.14021 -0.20266,0.20146 c 0,0 -0.48167,0.47895 -1.796403,-0.82835 -1.314726,-1.30726 -0.833066,-1.78618 -0.833066,-1.78618 l 0.127602,-0.12689 c 0.31438,-0.31258 0.344012,-0.81441 0.06972,-1.18078 l -0.561015,-0.7494 c -0.339465,-0.45346 -0.995417,-0.51335 -1.384502,-0.12648 l -0.698344,0.69438 c -0.192926,0.19183 -0.322211,0.4405 -0.306531,0.71635 0.04011,0.70575 0.359413,2.2242 2.141155,3.99582 1.889455,1.8787 3.662321,1.95337 4.387317,1.88578 0.22931,-0.0214 0.428723,-0.13815 0.589427,-0.29796 l 0.632052,-0.6284 c 0.426632,-0.42423 0.306326,-1.15149 -0.239545,-1.44821 l -0.850017,-0.46209 c -0.358426,-0.19482 -0.795069,-0.13761 -1.07519,0.14095 z"
                fill="#1c274c"
                style={{
                  fill: "var(--color-white)",
                  fillOpacity: 1,
                  strokeWidth: 0.444919,
                }}
              />
            </g>
            <g
              id="2"
              onClick={() => handleButtonClick("2")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="79.073036"
                cy="107.96717"
                r="8.9518633"
              />
              <path
                style={numberStyle as React.CSSProperties}
                d="m 77.837958,109.36099 q 0.6096,-0.508 0.97155,-0.84455 0.36195,-0.3429 0.60325,-0.7112 0.2413,-0.3683 0.2413,-0.7239 0,-0.32385 -0.1524,-0.508 -0.1524,-0.18415 -0.4699,-0.18415 -0.3175,0 -0.48895,0.2159 -0.17145,0.20955 -0.1778,0.57785 h -0.8636 q 0.0254,-0.762 0.45085,-1.1557 0.4318,-0.3937 1.0922,-0.3937 0.7239,0 1.11125,0.38735 0.38735,0.381 0.38735,1.00965 0,0.4953 -0.2667,0.94615 -0.2667,0.45085 -0.6096,0.7874 -0.3429,0.3302 -0.89535,0.8001 h 1.87325 v 0.7366 h -3.1369 v -0.6604 z"
              />
            </g>
            <g
              id="5"
              onClick={() => handleButtonClick("5")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="79.073036"
                cy="129.99278"
                r="8.9518633"
              />
              <path
                d="m 80.397009,128.45291 h -2.0574 v 1.08585 q 0.13335,-0.1651 0.381,-0.2667 0.24765,-0.10795 0.52705,-0.10795 0.508,0 0.83185,0.22225 0.32385,0.22225 0.4699,0.5715 0.14605,0.3429 0.14605,0.7366 0,0.73025 -0.4191,1.17475 -0.41275,0.4445 -1.1811,0.4445 -0.7239,0 -1.1557,-0.36195 -0.4318,-0.36195 -0.48895,-0.94615 h 0.8636 q 0.05715,0.254 0.254,0.4064 0.2032,0.1524 0.51435,0.1524 0.37465,0 0.56515,-0.23495 0.1905,-0.23495 0.1905,-0.6223 0,-0.3937 -0.19685,-0.5969 -0.1905,-0.20955 -0.56515,-0.20955 -0.2667,0 -0.4445,0.13335 -0.1778,0.13335 -0.254,0.3556 h -0.8509 v -2.7178 h 2.8702 z"
                style={numberStyle as React.CSSProperties}
              />
            </g>
            <g
              id="8"
              onClick={() => handleButtonClick("8")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="79.073036"
                cy="152.0184"
                r="8.9518633"
              />
              <path
                style={numberStyle as React.CSSProperties}
                d="m 78.142759,151.87553 q -0.635,-0.3302 -0.635,-1.02235 0,-0.3429 0.17145,-0.6223 0.1778,-0.28575 0.52705,-0.45085 0.3556,-0.17145 0.8636,-0.17145 0.508,0 0.85725,0.17145 0.3556,0.1651 0.52705,0.45085 0.1778,0.2794 0.1778,0.6223 0,0.34925 -0.17145,0.61595 -0.17145,0.26035 -0.4572,0.4064 0.34925,0.1524 0.5461,0.4445 0.19685,0.2921 0.19685,0.69215 0,0.4318 -0.22225,0.75565 -0.2159,0.3175 -0.5969,0.48895 -0.381,0.17145 -0.85725,0.17145 -0.47625,0 -0.85725,-0.17145 -0.37465,-0.17145 -0.5969,-0.48895 -0.2159,-0.32385 -0.2159,-0.75565 0,-0.40005 0.19685,-0.69215 0.19685,-0.29845 0.5461,-0.4445 z m 1.6256,-0.89535 q 0,-0.31115 -0.1905,-0.4826 -0.18415,-0.17145 -0.508,-0.17145 -0.3175,0 -0.508,0.17145 -0.18415,0.17145 -0.18415,0.48895 0,0.28575 0.1905,0.4572 0.19685,0.17145 0.50165,0.17145 0.3048,0 0.50165,-0.17145 0.19685,-0.1778 0.19685,-0.46355 z m -0.6985,1.2827 q -0.36195,0 -0.59055,0.18415 -0.22225,0.18415 -0.22225,0.52705 0,0.3175 0.2159,0.5207 0.22225,0.19685 0.5969,0.19685 0.37465,0 0.59055,-0.2032 0.2159,-0.2032 0.2159,-0.51435 0,-0.33655 -0.22225,-0.5207 -0.22225,-0.1905 -0.5842,-0.1905 z"
              />
            </g>
            <g
              id="0"
              onClick={() => handleButtonClick("0")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="79.073036"
                cy="174.04402"
                r="8.9518633"
              />
              <path
                d="m 77.358538,174.03449 q 0,-1.09855 0.3937,-1.72085 0.40005,-0.6223 1.3208,-0.6223 0.92075,0 1.31445,0.6223 0.40005,0.6223 0.40005,1.72085 0,1.1049 -0.40005,1.73355 -0.3937,0.62865 -1.31445,0.62865 -0.92075,0 -1.3208,-0.62865 -0.3937,-0.62865 -0.3937,-1.73355 z m 2.5527,0 q 0,-0.4699 -0.0635,-0.7874 -0.05715,-0.32385 -0.2413,-0.52705 -0.1778,-0.2032 -0.5334,-0.2032 -0.3556,0 -0.53975,0.2032 -0.1778,0.2032 -0.2413,0.52705 -0.05715,0.3175 -0.05715,0.7874 0,0.4826 0.05715,0.8128 0.05715,0.32385 0.2413,0.52705 0.18415,0.19685 0.53975,0.19685 0.3556,0 0.53975,-0.19685 0.18415,-0.2032 0.2413,-0.52705 0.05715,-0.3302 0.05715,-0.8128 z"
                style={numberStyle as React.CSSProperties}
              />
            </g>
            {input && (
              <g
                id="cancel"
                onClick={handleCancelClick}
                cursor="pointer"
                transform="translate(-13.470384,-39.288619)"
              >
                <path
                  style={numberBackgroundStyle as React.CSSProperties}
                  d="m 100.68592,193.79045 -2.278934,2.27893 2.278934,2.27945 h 3.69538 c 0.23644,0 0.42685,-0.1904 0.42685,-0.42685 v -3.70365 c 0,-0.23644 -0.19041,-0.42684 -0.42685,-0.42684 h -3.69538 z"
                />
                <g transform="matrix(0.84287451,0,0,0.84287451,16.086077,30.807538)">
                  <path
                    style={{
                      fill: "var(--color-primary)",
                      fillOpacity: 1,
                      fillRule: "evenodd",
                      stroke: "var(--color-primary)",
                      strokeWidth: 0.7,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeDasharray: "none",
                      strokeOpacity: 1,
                    }}
                    d="m 101.68368,197.05187 1.96445,-1.96446"
                  />
                  <path
                    style={{
                      fill: "var(--color-primary)",
                      fillOpacity: 1,
                      fillRule: "evenodd",
                      stroke: "var(--color-primary)",
                      strokeWidth: 0.7,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeDasharray: "none",
                      strokeOpacity: 1,
                    }}
                    d="m 101.68368,195.08741 1.96445,1.96446"
                  />
                </g>
              </g>
            )}
            <g
              id="3"
              onClick={() => handleButtonClick("3")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="101.60757"
                cy="107.96717"
                r="8.9518633"
              />
              <path
                d="m 100.09627,106.9099 q 0.0318,-0.635 0.4445,-0.9779 0.4191,-0.34925 1.09855,-0.34925 0.46355,0 0.79375,0.1651 0.3302,0.15875 0.4953,0.43815 0.17145,0.27305 0.17145,0.6223 0,0.40005 -0.20955,0.67945 -0.2032,0.27305 -0.48895,0.3683 v 0.0254 q 0.3683,0.1143 0.5715,0.4064 0.20955,0.2921 0.20955,0.7493 0,0.381 -0.1778,0.67945 -0.17145,0.29845 -0.51435,0.4699 -0.33655,0.1651 -0.8128,0.1651 -0.71755,0 -1.1684,-0.36195 -0.45085,-0.36195 -0.47625,-1.0668 h 0.8636 q 0.0127,0.31115 0.20955,0.50165 0.2032,0.18415 0.55245,0.18415 0.32385,0 0.4953,-0.1778 0.1778,-0.18415 0.1778,-0.4699 0,-0.381 -0.2413,-0.5461 -0.2413,-0.1651 -0.7493,-0.1651 h -0.18415 v -0.73025 h 0.18415 q 0.9017,0 0.9017,-0.60325 0,-0.27305 -0.1651,-0.42545 -0.15875,-0.1524 -0.46355,-0.1524 -0.29845,0 -0.46355,0.1651 -0.15875,0.15875 -0.18415,0.4064 z"
                style={numberStyle as React.CSSProperties}
              />
            </g>
            <g
              id="6"
              onClick={() => handleButtonClick("6")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="101.60757"
                cy="129.99278"
                r="8.9518633"
              />
              <path
                d="m 102.27749,128.88153 q -0.0635,-0.2667 -0.22225,-0.40005 -0.1524,-0.13335 -0.4445,-0.13335 -0.43815,0 -0.6477,0.3556 -0.2032,0.34925 -0.20955,1.143 0.1524,-0.254 0.4445,-0.3937 0.2921,-0.14605 0.635,-0.14605 0.41275,0 0.73025,0.1778 0.3175,0.1778 0.4953,0.5207 0.1778,0.33655 0.1778,0.8128 0,0.45085 -0.18415,0.80645 -0.1778,0.34925 -0.52705,0.5461 -0.34925,0.19685 -0.83185,0.19685 -0.6604,0 -1.0414,-0.2921 -0.37465,-0.2921 -0.52705,-0.8128 -0.146048,-0.52705 -0.146048,-1.2954 0,-1.16205 0.400048,-1.7526 0.40005,-0.5969 1.26365,-0.5969 0.66675,0 1.03505,0.36195 0.3683,0.36195 0.42545,0.9017 z m -0.6477,1.1557 q -0.33655,0 -0.56515,0.19685 -0.2286,0.19685 -0.2286,0.5715 0,0.37465 0.20955,0.59055 0.2159,0.2159 0.60325,0.2159 0.3429,0 0.53975,-0.20955 0.2032,-0.20955 0.2032,-0.56515 0,-0.3683 -0.19685,-0.5842 -0.1905,-0.2159 -0.56515,-0.2159 z"
                style={numberStyle as React.CSSProperties}
              />
            </g>
            <g
              id="9"
              onClick={() => handleButtonClick("9")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="101.60757"
                cy="152.0184"
                r="8.9518633"
              />
              <path
                style={numberStyle as React.CSSProperties}
                d="m 100.95669,153.08202 q 0.0508,0.2794 0.2286,0.4318 0.18415,0.14605 0.48895,0.14605 0.3937,0 0.5715,-0.32385 0.1778,-0.3302 0.1778,-1.1049 -0.14605,0.2032 -0.41275,0.3175 -0.26035,0.1143 -0.56515,0.1143 -0.4064,0 -0.7366,-0.1651 -0.32385,-0.17145 -0.51435,-0.50165 -0.1905,-0.33655 -0.1905,-0.8128 0,-0.70485 0.4191,-1.1176 0.4191,-0.4191 1.143,-0.4191 0.9017,0 1.27,0.57785 0.37465,0.57785 0.37465,1.7399 0,0.8255 -0.14605,1.35255 -0.1397,0.52705 -0.48895,0.8001 -0.3429,0.27305 -0.9398,0.27305 -0.4699,0 -0.8001,-0.1778 -0.3302,-0.18415 -0.508,-0.47625 -0.17145,-0.29845 -0.19685,-0.65405 z m 0.6731,-1.143 q 0.3302,0 0.5207,-0.2032 0.1905,-0.2032 0.1905,-0.5461 0,-0.37465 -0.2032,-0.57785 -0.19685,-0.20955 -0.53975,-0.20955 -0.3429,0 -0.5461,0.2159 -0.19685,0.20955 -0.19685,0.5588 0,0.33655 0.1905,0.55245 0.19685,0.20955 0.5842,0.20955 z"
              />
            </g>
            <g
              id="hashtag"
              onClick={() => handleButtonClick("#")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="101.60757"
                cy="174.04402"
                r="8.9518633"
              />
              <path
                d="m 103.20459,173.54237 -0.20955,0.9779 h 0.80645 v 0.79375 h -0.9779 l -0.2286,1.0795 h -0.84455 l 0.2286,-1.0795 h -1.1557 l -0.2286,1.0795 h -0.838199 l 0.2286,-1.0795 h -0.95885 v -0.79375 h 1.130299 l 0.20955,-0.9779 h -0.952499 v -0.79375 h 1.123949 l 0.22225,-1.0541 h 0.8382 l -0.22225,1.0541 h 1.1557 l 0.22225,-1.0541 h 0.84455 l -0.22225,1.0541 h 0.8128 v 0.79375 z m -0.84455,0 h -1.1557 l -0.20955,0.9779 h 1.1557 z"
                style={numberStyle as React.CSSProperties}
              />
            </g>
            <g
              id="1"
              onClick={() => handleButtonClick("1")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="56.538506"
                cy="107.96717"
                r="8.9518633"
              />
              <path
                d="m 55.773331,106.47174 v -0.81915 h 1.53035 v 4.62915 h -0.9144 v -3.81 z"
                style={numberStyle as React.CSSProperties}
              />
            </g>
            <g
              id="4"
              onClick={() => handleButtonClick("4")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="56.538506"
                cy="129.99278"
                r="8.9518633"
              />
              <path
                d="m 54.703357,131.37708 v -0.6985 l 2.07645,-2.9718 h 1.03505 v 2.8956 h 0.5588 v 0.7747 h -0.5588 v 0.9017 h -0.889 v -0.9017 z m 2.27965,-2.7178 -1.30175,1.9431 h 1.30175 z"
                style={numberStyle as React.CSSProperties}
              />
            </g>
            <g
              id="7"
              onClick={() => handleButtonClick("7")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="56.538506"
                cy="152.0184"
                r="8.9518633"
              />
              <path
                d="m 58.068854,150.37058 -1.6891,3.95605 h -0.9017 l 1.7018,-3.85445 h -2.1717 v -0.762 h 3.0607 z"
                style={numberStyle as React.CSSProperties}
              />
            </g>
            <g
              id="star"
              onClick={() => handleButtonClick("*")}
              cursor="pointer"
              transform="translate(-13.470384,-39.288619)"
            >
              <circle
                style={numberBackgroundStyle as React.CSSProperties}
                cx="56.538506"
                cy="174.04402"
                r="8.9518633"
              />
              <path
                d="m 57.43068,173.17407 0.3175,0.5715 -0.8255,0.29845 0.8255,0.29845 -0.3302,0.59055 -0.6858,-0.56515 0.14605,0.8763 h -0.6604 l 0.1397,-0.8763 -0.67945,0.57785 -0.34925,-0.6096 0.8255,-0.29845 -0.81915,-0.28575 0.32385,-0.5842 0.70485,0.5588 -0.14605,-0.88265 h 0.66675 l -0.1524,0.88265 z"
                style={numberStyle as React.CSSProperties}
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
