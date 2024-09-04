import p5 from "p5"
import { canvas, width, height } from "./planet"
import { explore } from "./planet";
import { Palette } from "./utils";

let p8Font: p5.Font;
const documentHeight: number = Array.from(document.getElementsByTagName("section")).reduce((h: number, v: HTMLElement) => h + v.clientHeight, 0);

function preload(): void {
    // https://www.lexaloffle.com/bbs/?tid=3760
    p8Font = p5.prototype.loadFont("assets/font/PICO-8_mono_upper.ttf");
}

function setup(): void {
    const pw: number = 192;
    const ph: number = 144;
    const minScale: number = 2;
    // 최소 배율을 minScale배로 하여, 스크롤하지 않고 화면에 맞는 최대 배율 계산
    const scaling: number = Math.floor(Math.max(Math.min(p5.prototype.windowWidth / pw, (p5.prototype.windowHeight - documentHeight) / ph), minScale));
  const canvas: p5.Renderer = p5.prototype.createCanvas(pw, ph);
  p5.prototype.pixelDensity(1); // 스마트폰을 위해
  canvas.parent("canvas");
  canvas.elt.style.cssText += `width: ${width * scaling}px; height: ${height * scaling}px;`;

  p5.prototype.textFont(p8Font, 5);
  p5.prototype.textAlign(p5.prototype.CENTER, p5.prototype.TOP);

  explore();
}

function draw(): void {
  p5.prototype.background(Palette.background);
  p5.prototype.loadPixels();
  {
    for (let star of stars) {
      pSet(...star);
    }

    for (let i = satellites.length - 1; i >= 0; i--) {
      satellites[i].draw(Properties.Draw.Back);
    }
    for (let i = planets.length - 1; i >= 0; i--) {
      planets[i].draw(Properties.Draw.Back);
    }
    for (let i = 0; i < planets.length; i++) {
      planets[i].draw(Properties.Draw.Front);
    }
    for (let i = 0; i < satellites.length; i++) {
      satellites[i].draw(Properties.Draw.Front);
    }
  }
  updatePixels();
  {
    textb(rng.seed, width / 2, 2);
  }

  // print(`fps: ${Math.floor(frameRate())}`);
}