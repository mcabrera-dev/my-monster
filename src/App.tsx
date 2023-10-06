import React, { useEffect, useRef, useState } from 'react';

import './App.css';
import { Tentacle, coord } from './domain/tentacle';


function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>()

  const [mouse, setMouse] = useState<coord>({ x: 0, y: 0 })

  const [last_mouse, setLastMouse] = useState<coord>({ x: 0, y: 0 })

  const [clicked, setClicked] = useState<boolean>(false)
  const [minl, setMinl] = useState<number>(50)
  const [maxl, setMaxl] = useState<number>(300)
  const [n, setN] = useState<number>(30)
  const [numt, setNumT] = useState<number>(600)
  const [tent, setTent] = useState<Tentacle[]>([])
  const [target, setTarget] = useState<coord>({ x: 0, y: 0 })
  const [last_target, setLastTarget] = useState<coord>({ x: 0, y: 0 })
  const [t, setT] = useState<number>(0)
  const [q, setQ] = useState<number>(10)
  const [w, setW] = useState<number>(0)
  const [h, setH] = useState<number>(0)


  useEffect(() => {
    init()

    canvasRef!.current!.addEventListener("mousemove", (e) => {
      setLastMouse({ x: mouse.x, y: mouse.y })
      setMouse({ x: e.pageX - canvasRef!.current!.offsetLeft, y: e.pageY - canvasRef!.current!.offsetTop })
    },
      false
    );

    canvasRef!.current!.addEventListener("mouseleave", (_e: MouseEvent) => {
      setMouse({ x: 0, y: 0 })
    });

    canvasRef!.current!.addEventListener("mousedown", (_e: MouseEvent) => {
      setClicked(true);
    },
      false
    );

    canvasRef!.current!.addEventListener("mouseup", (_e: MouseEvent) => {
      setClicked(false);
    },
      false
    );

    console.log('mount')
  }, []);

  useEffect(() => {
    if (canvasCtx) {
      canvasCtx!.clearRect(0, 0, w, h);
      draw();
    }
    console.log('draw')
  }, [mouse])

  useEffect(() => {

    if (canvasCtx) {
      const tents: Tentacle[] = []
      for (let i = 0; i < numt; i++) {
        tents.push(
          new Tentacle(
            Math.random() * w,
            Math.random() * h,
            Math.random() * (maxl - minl) + minl,
            n,
            Math.random() * 2 * Math.PI,
            canvasCtx!
          )
        );
      }

      setTent(tents)
    }
    console.log('canvasCtx')

  }, [canvasCtx])


  const init = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx !== undefined && ctx !== undefined && ctx !== null) {
      setCanvasCtx(ctx)
      const w = (canvas.width = window.innerWidth)
      const h = (canvas.height = window.innerHeight);

      setW(w)
      setH(h)
      ctx.fillStyle = "rgba(30,30,30,1)";
      ctx.fillRect(0, 0, w, h);
    }
  }


  const draw = () => {
    if (canvasCtx) {
      if (mouse.x) {
        target.errx = mouse.x - target.x;
        target.erry = mouse.y - target.y;
      } else {
        target.errx =
          w / 2 +
          ((h / 2 - q) * Math.sqrt(2) * Math.cos(t)) /
          (Math.pow(Math.sin(t), 2) + 1) -
          target.x;
        target.erry =
          h / 2 +
          ((h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) /
          (Math.pow(Math.sin(t), 2) + 1) -
          target.y;
      }

      target.x += target.errx / 10;
      target.y += target.erry / 10;

      setT(t + 0.01)

      canvasCtx.beginPath();
      canvasCtx.arc(
        target.x,
        target.y,
        10,
        0,
        2 * Math.PI
      );
      canvasCtx.fillStyle = "hsl(210,100%,80%)";
      canvasCtx.fill();


      tent.forEach(t => {
        t.move(last_target, target);
        t.show2(target);
      })

      tent.forEach(t => {
        t.show(target)
      })

      last_target.x = target.x;
      last_target.y = target.y;
    }

  }




  return (
    <canvas ref={canvasRef} />
  );
}

export default App;
