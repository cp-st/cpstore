import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { LucideIcon, Rocket } from 'lucide-react';

// Types for component props
interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  }
}

// Internal Classes (Moved BEFORE the hook as per summary instructions)
class WebGLRenderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private program: WebGLProgram | null = null;
    private startTime: number;
    private mouseX: number = 0.5;
    private mouseY: number = 0.5;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const gl = canvas.getContext('webgl');
        if (!gl) throw new Error("WebGL not supported");
        this.gl = gl;
        this.startTime = Date.now();
        this.init();
    }

    private createShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const info = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error("Could not compile shader: " + info);
        }
        return shader;
    }

    private init() {
        const vs = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;
        const fs = `
            precision highp float;
            uniform float time;
            uniform vec2 resolution;
            uniform vec2 mouse;

            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec2 p = -1.0 + 2.0 * uv;
                p.x *= resolution.x / resolution.y;

                float d = length(p - (mouse * 2.0 - 1.0));
                
                vec3 color = vec3(0.02, 0.02, 0.05); // Deep base
                
                // Animated waves
                float wave1 = sin(p.x * 2.0 + time * 0.5) * 0.5 + 0.5;
                float wave2 = sin(p.y * 3.0 - time * 0.3) * 0.5 + 0.5;
                
                color += vec3(0.0, 0.2, 0.5) * wave1 * 0.2;
                color += vec3(0.2, 0.0, 0.5) * wave2 * 0.1;
                
                // Subtle glow at mouse
                color += vec3(0.0, 0.3, 0.8) * (0.05 / (d + 0.5));
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vs);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fs);

        this.program = this.gl.createProgram()!;
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
             throw new Error("Could not link program");
        }

        this.gl.useProgram(this.program);

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), this.gl.STATIC_DRAW);

        const pos = this.gl.getAttribLocation(this.program, "position");
        this.gl.enableVertexAttribArray(pos);
        this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 0, 0);
    }

    public updateMouse(x: number, y: number) {
        this.mouseX = x;
        this.mouseY = y;
    }

    public render() {
        if (!this.program) return;
        const time = (Date.now() - this.startTime) / 1000;
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        const timeLoc = this.gl.getUniformLocation(this.program, "time");
        const resLoc = this.gl.getUniformLocation(this.program, "resolution");
        const mouseLoc = this.gl.getUniformLocation(this.program, "mouse");

        this.gl.uniform1f(timeLoc, time);
        this.gl.uniform2f(resLoc, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(mouseLoc, this.mouseX, 1.0 - this.mouseY);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    public resize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

class PointerHandler {
    private onMove: (x: number, y: number) => void;

    constructor(onMove: (x: number, y: number) => void) {
        this.onMove = onMove;
        this.init();
    }

    private init() {
        window.addEventListener('mousemove', (e) => {
            this.onMove(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
        });
    }
}

const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new WebGLRenderer(canvasRef.current);
    rendererRef.current = renderer;

    const pointer = new PointerHandler((x, y) => {
        renderer.updateMouse(x, y);
    });

    const handleResize = () => {
        renderer.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationId: number;
    const loop = (time: number) => {
        renderer.render();
        animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return canvasRef;
};

export const AnimatedShaderHero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons
}) => {
  const canvasRef = useShaderBackground();

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-32">
      {/* GL Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full -z-10 opacity-40 pointer-events-none"
      />
      
      {/* Content */}
      <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
        {trustBadge && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            {trustBadge.text}
          </motion.div>
        )}

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-9xl font-black tracking-tight leading-[0.85] text-white"
          >
            {headline.line1}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 glow-blue">
              {headline.line2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {buttons?.primary && (
            <button
              onClick={buttons.primary.onClick}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-white/90 transition-all active:scale-95 shadow-2xl shadow-white/10"
            >
              {buttons.primary.text}
            </button>
          )}
          {buttons?.secondary && (
            <button
              onClick={buttons.secondary.onClick}
              className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all active:scale-95"
            >
              {buttons.secondary.text}
            </button>
          )}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#050505] to-transparent" />
    </div>
  );
};
