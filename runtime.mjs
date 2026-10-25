// Run the original game logic without a browser. Canvas drawing stays in clients.
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const source = readFileSync(new URL('./public/engine.js', import.meta.url), 'utf8');
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
class Element {
  constructor(tag, document) {
    this.tagName = tag.toUpperCase(); this.document = document; this.children = []; this.dataset = {}; this.style = {};
    this.hidden = true; this.value = ''; this.listeners = {}; this._html = ''; this._text = ''; this.className = ''; this.width = 960; this.height = 600;
    this.classList = {
      contains: c => this.className.split(/\s+/).includes(c),
      add: (...cs) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...cs])].join(' '); },
      remove: (...cs) => { this.className = this.className.split(/\s+/).filter(c => !cs.includes(c)).join(' '); },
      toggle: (c, on) => { const next = on === undefined ? !this.classList.contains(c) : on; this.classList[next ? 'add' : 'remove'](c); return next; },
    };
  }
  set id(id) { this._id = id; this.document.elements.set(id, this); }
  get id() { return this._id; }
  set textContent(value) { this._text = String(value); this._html = ''; this.children = []; }
  get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
  set innerHTML(value) { this._html = String(value); this._text = ''; this.children = []; }
  get innerHTML() { return this._html + escape(this._text) + this.children.map(c => c.outerHTML).join(''); }
  get outerHTML() { return `<${this.tagName.toLowerCase()}${this.id ? ` id="${escape(this.id)}"` : ''}${this.className ? ` class="${escape(this.className)}"` : ''}>${this.innerHTML}</${this.tagName.toLowerCase()}>`; }
  appendChild(child) { this.children.push(child); return child; }
  addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
  click() { for (const cb of this.listeners.click || []) cb({ currentTarget:this, target:this, preventDefault(){}, stopPropagation(){} }); }
  focus() { this.document.activeElement = this; }
  blur() { if (this.document.activeElement === this) this.document.activeElement = null; }
  getContext() { return this.document.canvas; }
}
export function createRuntime(saved) {
  const noop = () => {};
  const canvas = new Proxy({}, { get: (target, key) => {
    if (key in target) return target[key];
    if (key === 'measureText') return text => ({ width:String(text).length * 9 });
    if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop:noop });
    return noop;
  }, set:(target,key,value) => { target[key] = value; return true; } });
  const document = { elements:new Map(), canvas, activeElement:null,
    getElementById(id) { if (!this.elements.has(id)) { const el = new Element('div', this); el.id = id; } return this.elements.get(id); },
    querySelectorAll() { return []; }, createElement(tag) { return new Element(tag, this); },
  };
  const timers = new Set();
  const errors = [];
  const schedule = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); try { const p = fn(); if(p?.catch) p.catch(e => errors.push(e)); } catch(e) { errors.push(e); } }, ms); timers.add(id); id.unref(); return id; };
  const window = { MULTIPLAYER_SERVER:true, addEventListener:noop, devicePixelRatio:1 };
  const context = vm.createContext({ window, document, performance, console, setTimeout:schedule,
    requestAnimationFrame:noop, Math, JSON, Map, Set, Promise });
  vm.runInContext(source, context, { timeout:3000 });
  const engine = window.__multiplayer;
  engine.startRoom(saved);
  return { engine, document, errors, dispose() { for (const t of timers) clearTimeout(t); timers.clear(); } };
}
