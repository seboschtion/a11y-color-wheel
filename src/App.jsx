import { useState } from "react";
import "./App.css";

function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return ((brightest + 0.05) / (darkest + 0.05)).toFixed(1);
}

function hslToRgb(h, s, l, hex = false) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    const color255 = Math.round(255 * color);
    return hex
      ? color255.toString(16).padStart(2, "0")
      : color255.toString().padStart(3, "0");
  };
  return hex ? `#${f(0)}${f(8)}${f(4)}` : [f(0), f(8), f(4)];
}

const Color = (props) => {
  const { h, s, l, step } = props;
  const style = { backgroundColor: `hsl(${h}, ${s}%, ${l}%)` };
  const contrastToBlack = contrast(hslToRgb(h, s, l), [0, 0, 0]);
  const contrastToWhite = contrast(hslToRgb(h, s, l), [255, 255, 255]);
  const errorBlack = contrastToBlack < 4.5;
  const errorWhite = contrastToWhite < 4.5;
  const className =
    "color" +
    `${errorBlack ? " error-black " : ""}` +
    `${errorWhite ? " error-white " : ""}`;
  return (
    <div className={className} style={style}>
      <p>color-{step}</p>
      <pre className="hex">{hslToRgb(h, s, l, true)}</pre>
      <pre className="contrast contrast-small contrast-black">
        {contrastToBlack}:1
      </pre>
      <pre className="contrast contrast-small contrast-white">
        {contrastToWhite}:1
      </pre>
    </div>
  );
};

const Range = (props) => {
  const { label, value, onChange } = props;
  const max = label === "Hue" ? 360 : label === "Lightness" ? 9 : 100;
  return (
    <div className="range">
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const Selector = (props) => {
  const { h, s, l, onChangeH, onChangeS, onChangeL } = props;
  return (
    <ul className="selector">
      <li>
        <Range label="Hue" value={h} onChange={(v) => onChangeH(v)} />
      </li>
      <li>
        <Range label="Saturation" value={s} onChange={(v) => onChangeS(v)} />
      </li>
      <li>
        <Range label="Lightness" value={l} onChange={(v) => onChangeL(v)} />
      </li>
      <li>
        <div class="helper">
          <p>
            Mit diesem speziellen Color Wheel kann man mit HSL verschiedene
            Farben auswählen. Das L wird automatisch abgestuft (10ner-Schritte),
            man kann L deshalb nur feinjustieren. Gleichzeitig wird jeweils der
            Farbkontrast angezeigt.
          </p>
          <p>
            A minimum contrast ratio of <strong>4.5:1</strong> is required for
            the visual presentation of both text, and images embedded as text,
            against the presented background color.
          </p>
          <p>
            Large text (18pt+ or bold and 14pt+) only requires a{" "}
            <strong>3:1</strong> or greater contrast ratio.
          </p>
        </div>
      </li>
    </ul>
  );
};

const ColorStrip = (props) => {
  const { h, s, l } = props;
  const steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  return (
    <ul className="colorstrip">
      {steps.map((step) => (
        <li key={step}>
          <Color
            h={h}
            s={s}
            l={Math.min(step + parseInt(l), 100)}
            step={step}
          />
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [h, setH] = useState(155);
  const [s, setS] = useState(100);
  const [l, setL] = useState(0);
  return (
    <div className="App">
      <Selector
        h={h}
        s={s}
        l={l}
        onChangeH={(value) => setH(value)}
        onChangeS={(value) => setS(value)}
        onChangeL={(value) => setL(value)}
      />
      <div className="light">
        <ColorStrip h={h} s={s} l={l} />
      </div>
      <div className="dark">
        <ColorStrip h={h} s={s} l={l} />
      </div>
    </div>
  );
};

export default App;
