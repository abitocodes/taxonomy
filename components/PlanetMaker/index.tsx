import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Planet } from './js/planet';

export default function PlanetMaker() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // p5.js 스케치 초기화
      const sketch = (p: any) => {
        p.setup = () => {
          // setup 함수 내용
        };

        p.draw = () => {
            p.background(0);
            p.translate(p.width / 2, p.height / 2);
            p.scale(0.7);
            planet.draw();
          };
      };

      new (window as any).p5(sketch, canvasRef.current);
    }
  }, []);

  const explore = () => {
    const seed = inputRef.current?.value || '';
    const rng = new (window as any).alea(seed);
    planet = new Planet(p, rng);
    planet.generate();
  };

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>Astraea</title>
        <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css" />
        <link rel="stylesheet" type="text/css" href="assets/css/style.css" />
      </Head>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/p5.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/lib/alea.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js" />
      <Script src="https://cdn.jsdelivr.net/gh/kchapelier/poisson-disk-sampling@2.2.0/build/poisson-disk-sampling.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/zlibjs@0.3.1/bin/gunzip.min.js" />

      <section className="hero is-dark is-bold">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">Astraea</h1>
            <h2 className="subtitle">
              The planet generator inspired by
              <a href="https://managore.itch.io/planetarium">Planetarium</a>.
            </h2>
            <a href="https://github.com/yurkth/astraea" target="_blank" rel="noopener noreferrer"
              className="button is-white is-outlined is-rounded">View on GitHub</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container has-text-centered is-size-5">
          <p>
            Enter the name of the planet and visit it!
          </p>
          <p>
            If not, you will reach an unknown planet.
          </p>
          <form className="field has-addons has-addons-centered" onSubmit={(e) => { e.preventDefault(); explore(); }}>
            <div className="control">
              <input className="input is-rounded" type="text" ref={inputRef} placeholder="unknown planet" maxLength={16}
                pattern="^[\w ]+$" />
            </div>
            <div className="control">
              <button className="button is-dark is-outlined is-rounded" type="submit">Explore</button>
            </div>
          </form>
        </div>
      </section>

      <div id="canvas" ref={canvasRef}></div>

      <footer className="hero is-dark">
        <div className="hero-body has-text-centered">
          <p className="has-text-grey-lighter">Copyright © 2020 torin All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};