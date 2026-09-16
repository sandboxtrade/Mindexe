import{o as _m,R as xa}from"./vendor-misc-BylpYxI7.js";const ym=()=>{};var el={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kh=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Em=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],a=n[t++],c=n[t++],l=((s&7)<<18|(i&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const i=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return e.join("")},La={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,c=a?n[s+1]:0,l=s+2<n.length,h=l?n[s+2]:0,p=i>>2,m=(i&3)<<4|c>>4;let v=(c&15)<<2|h>>6,V=h&63;l||(V=64,a||(v=64)),r.push(t[p],t[m],t[v],t[V])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(kh(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Em(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;const h=s<n.length?t[n.charAt(s)]:64;++s;const m=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||c==null||h==null||m==null)throw new Tm;const v=i<<2|c>>4;if(r.push(v),h!==64){const V=c<<4&240|h>>2;if(r.push(V),m!==64){const k=h<<6&192|m;r.push(k)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Tm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const wm=function(n){const e=kh(n);return La.encodeByteArray(e,!0)},vi=function(n){return wm(n).replace(/\./g,"")},Nh=function(n){try{return La.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oh(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Im=()=>Oh().__FIREBASE_DEFAULTS__,vm=()=>{if(typeof process>"u"||typeof el>"u")return;const n=el.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Am=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Nh(n[1]);return e&&JSON.parse(e)},Yi=()=>{try{return ym()||Im()||vm()||Am()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Dh=n=>Yi()?.emulatorHosts?.[n],Rm=n=>{const e=Dh(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},xh=()=>Yi()?.config,Lh=n=>Yi()?.[`_${n}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[vi(JSON.stringify(t)),vi(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Sm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Oe())}function Cm(){const n=Yi()?.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function bm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Vm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function km(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Nm(){const n=Oe();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Om(){return!Cm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Ma(){try{return typeof indexedDB=="object"}catch{return!1}}function Dm(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{e(s.error?.message||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xm="FirebaseError";class It extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=xm,Object.setPrototypeOf(this,It.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,dr.prototype.create)}}class dr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],a=i?Lm(i,r):"Error",c=`${this.serviceName}: ${a} (${s}).`;return new It(s,c,r)}}function Lm(n,e){try{let t=0,r="";for(;t<n.length;){const s=n.indexOf("{$",t);if(s===-1){r+=n.substring(t);break}const i=n.indexOf("}",s+2);if(i===-1){r+=n.substring(t);break}const a=n.substring(s+2,i),c=e[a];r+=n.substring(t,s)+(c!=null?String(c):`<${a}?>`),t=i+1}return r}catch{return n}}function Mm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Nn(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],a=e[s];if(tl(i)&&tl(a)){if(!Nn(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function tl(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vs(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Br(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function $r(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Um(n,e){const t=new Fm(n,e);return t.subscribe.bind(t)}class Fm{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Bm(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Wo),s.error===void 0&&(s.error=Wo),s.complete===void 0&&(s.complete=Wo);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Bm(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Wo(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $m=1e3,jm=2,qm=14400*1e3,Gm=.5;function Hm(n,e=$m,t=jm){const r=e*Math.pow(t,n),s=Math.round(Gm*r*(Math.random()-.5)*2);return Math.min(qm,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fe(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function As(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Mh(n){return(await fetch(n,{credentials:"include"})).ok}class yt{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new kn;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Km(e))try{this.getOrInitializeService({instanceIdentifier:vn})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=vn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=vn){return this.instances.has(e)}getOptions(e=vn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);r===c&&a.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Wm(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=vn){return this.component?this.component.multipleInstances?e:vn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Wm(n){return n===vn?void 0:n}function Km(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qm{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new zm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var J;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(J||(J={}));const Ym={debug:J.DEBUG,verbose:J.VERBOSE,info:J.INFO,warn:J.WARN,error:J.ERROR,silent:J.SILENT},Jm=J.INFO,Xm={[J.DEBUG]:"log",[J.VERBOSE]:"log",[J.INFO]:"info",[J.WARN]:"warn",[J.ERROR]:"error"},Zm=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Xm[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Rs{constructor(e){this.name=e,this._logLevel=Jm,this._logHandler=Zm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in J))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Ym[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,J.DEBUG,...e),this._logHandler(this,J.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,J.VERBOSE,...e),this._logHandler(this,J.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,J.INFO,...e),this._logHandler(this,J.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,J.WARN,...e),this._logHandler(this,J.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,J.ERROR,...e),this._logHandler(this,J.ERROR,...e)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eg{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(tg(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function tg(n){return n.getComponent()?.type==="VERSION"}const ua="@firebase/app",nl="0.16.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt=new Rs("@firebase/app"),ng="@firebase/app-compat",rg="@firebase/analytics-compat",sg="@firebase/analytics",ig="@firebase/app-check-compat",og="@firebase/app-check",ag="@firebase/auth",cg="@firebase/auth-compat",ug="@firebase/database",lg="@firebase/data-connect",hg="@firebase/database-compat",dg="@firebase/functions",fg="@firebase/functions-compat",pg="@firebase/installations",mg="@firebase/installations-compat",gg="@firebase/messaging",_g="@firebase/messaging-compat",yg="@firebase/performance",Eg="@firebase/performance-compat",Tg="@firebase/remote-config",wg="@firebase/remote-config-compat",Ig="@firebase/storage",vg="@firebase/storage-compat",Ag="@firebase/firestore",Rg="@firebase/ai",Pg="@firebase/firestore-compat",Sg="firebase",Cg="12.17.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const la="[DEFAULT]",bg={[ua]:"fire-core",[ng]:"fire-core-compat",[sg]:"fire-analytics",[rg]:"fire-analytics-compat",[og]:"fire-app-check",[ig]:"fire-app-check-compat",[ag]:"fire-auth",[cg]:"fire-auth-compat",[ug]:"fire-rtdb",[lg]:"fire-data-connect",[hg]:"fire-rtdb-compat",[dg]:"fire-fn",[fg]:"fire-fn-compat",[pg]:"fire-iid",[mg]:"fire-iid-compat",[gg]:"fire-fcm",[_g]:"fire-fcm-compat",[yg]:"fire-perf",[Eg]:"fire-perf-compat",[Tg]:"fire-rc",[wg]:"fire-rc-compat",[Ig]:"fire-gcs",[vg]:"fire-gcs-compat",[Ag]:"fire-fst",[Pg]:"fire-fst-compat",[Rg]:"fire-vertex","fire-js":"fire-js",[Sg]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ai=new Map,Vg=new Map,ha=new Map;function rl(n,e){try{n.container.addComponent(e)}catch(t){Nt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ot(n){const e=n.name;if(ha.has(e))return Nt.debug(`There were multiple attempts to register component ${e}.`),!1;ha.set(e,n);for(const t of Ai.values())rl(t,n);for(const t of Vg.values())rl(t,n);return!0}function Un(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function je(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Rt=new dr("app","Firebase",kg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ng{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new yt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Rt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fr=Cg;function Og(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:la,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw Rt.create("bad-app-name",{appName:String(s)});if(t||(t=xh()),!t)throw Rt.create("no-options");const i=Ai.get(s);if(i)if(Nn(t,i.options)){if(Nn(r,i.config))return i;throw Rt.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(r)})}else throw Rt.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});const a=new Qm(s);for(const l of ha.values())a.addComponent(l);const c=new Ng(t,r,a);return Ai.set(s,c),c}function Ji(n=la){const e=Ai.get(n);if(!e&&n===la&&xh())return Og();if(!e)throw Rt.create("no-app",{appName:n});return e}function ct(n,e,t){let r=bg[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const a=[`Unable to register library "${r}" with version "${e}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&a.push("and"),i&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Nt.warn(a.join(" "));return}Ot(new yt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dg="firebase-heartbeat-database",xg=1,rs="firebase-heartbeat-store";let Ko=null;function Uh(){return Ko||(Ko=_m(Dg,xg,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(rs)}catch(t){console.warn(t)}}}}).catch(n=>{throw Rt.create("idb-open",{originalErrorMessage:n.message})})),Ko}async function Lg(n){try{const t=(await Uh()).transaction(rs),r=await t.objectStore(rs).get(Fh(n));return await t.done,r}catch(e){if(e instanceof It)Nt.warn(e.message);else{const t=Rt.create("idb-get",{originalErrorMessage:e?.message});Nt.warn(t.message)}}}async function sl(n,e){try{const r=(await Uh()).transaction(rs,"readwrite");await r.objectStore(rs).put(e,Fh(n)),await r.done}catch(t){if(t instanceof It)Nt.warn(t.message);else{const r=Rt.create("idb-set",{originalErrorMessage:t?.message});Nt.warn(r.message)}}}function Fh(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mg=1024,Ug=30;class Fg{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new $g(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{const t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=il();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(s=>s.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>Ug){const s=jg(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){Nt.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=il(),{heartbeatsToSend:t,unsentEntries:r}=Bg(this._heartbeatsCache.heartbeats),s=vi(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(e){return Nt.warn(e),""}}}function il(){return new Date().toISOString().substring(0,10)}function Bg(n,e=Mg){const t=[];let r=n.slice();for(const s of n){const i=t.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),ol(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),ol(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class $g{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ma()?Dm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Lg(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return sl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return sl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function ol(n){return vi(JSON.stringify({version:2,heartbeats:n})).length}function jg(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qg(n){Ot(new yt("platform-logger",e=>new eg(e),"PRIVATE")),Ot(new yt("heartbeat",e=>new Fg(e),"PRIVATE")),ct(ua,nl,n),ct(ua,nl,"esm2020"),ct("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */qg("");var Gg="firebase",Hg="12.17.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ct(Gg,Hg,"app");function Bh(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const zg=Bh,$h=new dr("auth","Firebase",Bh());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ri=new Rs("@firebase/auth");function jh(n,...e){Ri.logLevel<=J.WARN&&Ri.warn(`Auth (${fr}): ${n}`,...e)}function fi(n,...e){Ri.logLevel<=J.ERROR&&Ri.error(`Auth (${fr}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nt(n,...e){throw Fa(n,...e)}function ut(n,...e){return Fa(n,...e)}function Ua(n,e,t){const r={...zg(),[e]:t};return new dr("auth","Firebase",r).create(e,{appName:n.name})}function bt(n){return Ua(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Wg(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&nt(n,"argument-error"),Ua(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Fa(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return $h.create(n,...e)}function q(n,e,...t){if(!n)throw Fa(e,...t)}function Pt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw fi(e),new Error(e)}function Dt(n,e){n||Pt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function da(){return typeof self<"u"&&self.location?.href||""}function Kg(){return al()==="http:"||al()==="https:"}function al(){return typeof self<"u"&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Kg()||Vm()||"connection"in navigator)?navigator.onLine:!0}function Yg(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ps{constructor(e,t){this.shortDelay=e,this.longDelay=t,Dt(t>e,"Short delay should be less than long delay!"),this.isMobile=Sm()||km()}get(){return Qg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ba(n,e){Dt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qh{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Pt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Pt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Pt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jg={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xg=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Zg=new Ps(3e4,6e4);function fn(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function Mt(n,e,t,r,s={}){return Gh(n,s,async()=>{let i={},a={};r&&(e==="GET"?a=r:i={body:JSON.stringify(r)});const c=vs({...a,key:n.config.apiKey}).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const h={method:e,headers:l,...i};return bm()||(h.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&As(n.emulatorConfig.host)&&(h.credentials="include"),qh.fetch()(await Hh(n,n.config.apiHost,t,c),h)})}async function Gh(n,e,t){n._canInitEmulator=!1;const r={...Jg,...e};try{const s=new t_(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw ri(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const c=i.ok?a.errorMessage:a.error.message,[l,h]=c.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw ri(n,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw ri(n,"email-already-in-use",a);if(l==="USER_DISABLED")throw ri(n,"user-disabled",a);const p=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Ua(n,p,h);nt(n,p)}}catch(s){if(s instanceof It)throw s;nt(n,"network-request-failed",{message:String(s)})}}async function Ss(n,e,t,r,s={}){const i=await Mt(n,e,t,r,s);return"mfaPendingCredential"in i&&nt(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function Hh(n,e,t,r){const s=`${e}${t}?${r}`,i=n,a=i.config.emulator?Ba(n.config,s):`${n.config.apiScheme}://${s}`;return Xg.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(a).toString():a}function e_(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class t_{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(ut(this.auth,"network-request-failed")),Zg.get())})}}function ri(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=ut(n,e,r);return s.customData._tokenResponse=t,s}function cl(n){return n!==void 0&&n.enterprise!==void 0}class n_{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return e_(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function r_(n,e){return Mt(n,"GET","/v2/recaptchaConfig",fn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function s_(n,e){return Mt(n,"POST","/v1/accounts:delete",e)}async function Pi(n,e){return Mt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function i_(n,e=!1){const t=fe(n),r=await t.getIdToken(e),s=$a(r);q(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i?.sign_in_provider;return{claims:s,token:r,authTime:Wr(Qo(s.auth_time)),issuedAtTime:Wr(Qo(s.iat)),expirationTime:Wr(Qo(s.exp)),signInProvider:a||null,signInSecondFactor:i?.sign_in_second_factor||null}}function Qo(n){return Number(n)*1e3}function $a(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return fi("JWT malformed, contained fewer than 3 sections"),null;try{const s=Nh(t);return s?JSON.parse(s):(fi("Failed to decode base64 JWT payload"),null)}catch(s){return fi("Caught error parsing JWT payload as JSON",s?.toString()),null}}function ul(n){const e=$a(n);return q(e,"internal-error"),q(typeof e.exp<"u","internal-error"),q(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof It&&o_(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function o_({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a_{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fa{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Wr(this.lastLoginAt),this.creationTime=Wr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Si(n){const e=n.auth,t=await n.getIdToken(),r=await nr(n,Pi(e,{idToken:t}));q(r?.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const i=s.providerUserInfo?.length?zh(s.providerUserInfo):[],a=u_(n.providerData,i),c=n.isAnonymous,l=!(n.email&&s.passwordHash)&&!a?.length,h=c?l:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new fa(s.createdAt,s.lastLoginAt),isAnonymous:h};Object.assign(n,p)}async function c_(n){const e=fe(n);await Si(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function u_(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function zh(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function l_(n,e){const t=await Gh(n,{},async()=>{const r=vs({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=await Hh(n,s,"/v1/token",`key=${i}`),c=await n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:c,body:r};return n.emulatorConfig&&As(n.emulatorConfig.host)&&(l.credentials="include"),qh.fetch()(a,l)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function h_(n,e){return Mt(n,"POST","/v2/accounts:revokeToken",fn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){q(e.idToken,"internal-error"),q(typeof e.idToken<"u","internal-error"),q(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ul(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){q(e.length!==0,"internal-error");const t=ul(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(q(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await l_(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,a=new Xn;return r&&(q(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(q(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),i&&(q(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Xn,this.toJSON())}_performRefresh(){return Pt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gt(n,e){q(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class ot{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new a_(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new fa(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await nr(this,this.stsTokenManager.getToken(this.auth,e));return q(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return i_(this,e)}reload(){return c_(this)}_assign(e){this!==e&&(q(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new ot({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){q(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Si(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(je(this.auth.app))return Promise.reject(bt(this.auth));const e=await this.getIdToken();return await nr(this,s_(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,a=t.photoURL??void 0,c=t.tenantId??void 0,l=t._redirectEventId??void 0,h=t.createdAt??void 0,p=t.lastLoginAt??void 0,{uid:m,emailVerified:v,isAnonymous:V,providerData:k,stsTokenManager:F}=t;q(m&&F,e,"internal-error");const L=Xn.fromJSON(this.name,F);q(typeof m=="string",e,"internal-error"),Gt(r,e.name),Gt(s,e.name),q(typeof v=="boolean",e,"internal-error"),q(typeof V=="boolean",e,"internal-error"),Gt(i,e.name),Gt(a,e.name),Gt(c,e.name),Gt(l,e.name),Gt(h,e.name),Gt(p,e.name);const W=new ot({uid:m,auth:e,email:s,emailVerified:v,displayName:r,isAnonymous:V,photoURL:a,phoneNumber:i,tenantId:c,stsTokenManager:L,createdAt:h,lastLoginAt:p});return k&&Array.isArray(k)&&(W.providerData=k.map(ee=>({...ee}))),l&&(W._redirectEventId=l),W}static async _fromIdTokenResponse(e,t,r=!1){const s=new Xn;s.updateFromServerResponse(t);const i=new ot({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Si(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];q(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?zh(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!i?.length,c=new Xn;c.updateFromIdToken(r);const l=new ot({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:a}),h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new fa(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!i?.length};return Object.assign(l,h),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ll=new Map;function St(n){Dt(n instanceof Function,"Expected a class definition");let e=ll.get(n);return e?(Dt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,ll.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wh{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Wh.type="NONE";const hl=Wh;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pi(n,e,t){return`firebase:${n}:${e}:${t}`}class Zn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=pi(this.userKey,s.apiKey,i),this.fullPersistenceKey=pi("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Pi(this.auth,{idToken:e}).catch(()=>{});return t?ot._fromGetAccountInfoResponse(this.auth,t,e):null}return ot._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Zn(St(hl),e,r);const s=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let i=s[0]||St(hl);const a=pi(r,e.config.apiKey,e.name);let c=null;for(const h of t)try{const p=await h._get(a);if(p){let m;if(typeof p=="string"){const v=await Pi(e,{idToken:p}).catch(()=>{});if(!v)break;m=await ot._fromGetAccountInfoResponse(e,v,p)}else m=ot._fromJSON(e,p);h!==i&&(c=m),i=h;break}}catch{}const l=s.filter(h=>h._shouldAllowMigration);return!i._shouldAllowMigration||!l.length?new Zn(i,e,r):(i=l[0],c&&await i._set(a,c.toJSON()),await Promise.all(t.map(async h=>{if(h!==i)try{await h._remove(a)}catch{}})),new Zn(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dl(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Jh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Kh(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Zh(e))return"Blackberry";if(ed(e))return"Webos";if(Qh(e))return"Safari";if((e.includes("chrome/")||Yh(e))&&!e.includes("edge/"))return"Chrome";if(Xh(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function Kh(n=Oe()){return/firefox\//i.test(n)}function Qh(n=Oe()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Yh(n=Oe()){return/crios\//i.test(n)}function Jh(n=Oe()){return/iemobile/i.test(n)}function Xh(n=Oe()){return/android/i.test(n)}function Zh(n=Oe()){return/blackberry/i.test(n)}function ed(n=Oe()){return/webos/i.test(n)}function ja(n=Oe()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function d_(n=Oe()){return ja(n)&&!!window.navigator?.standalone}function f_(){return Nm()&&document.documentMode===10}function td(n=Oe()){return ja(n)||Xh(n)||ed(n)||Zh(n)||/windows phone/i.test(n)||Jh(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nd(n,e=[]){let t;switch(n){case"Browser":t=dl(Oe());break;case"Worker":t=`${dl(Oe())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${fr}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((a,c)=>{try{const l=e(i);a(l)}catch(l){c(l)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function m_(n,e={}){return Mt(n,"GET","/v2/passwordPolicy",fn(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const g_=6;class __{constructor(e){const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??g_,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y_{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new fl(this),this.idTokenSubscription=new fl(this),this.beforeStateQueue=new p_(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=$h,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=St(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await Zn.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Pi(this,{idToken:e}),r=await ot._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(je(this.app)){const i=this.app.settings.authIdToken;return i?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(i).then(a,a))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const i=this.redirectUser?._redirectEventId,a=r?._redirectEventId,c=await this.tryRedirectSignIn(e);(!i||i===a)&&c?.user&&(r=c.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(i){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(i))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return q(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Si(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Yg()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(je(this.app))return Promise.reject(bt(this));const t=e?fe(e):null;return t&&q(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&q(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return je(this.app)?Promise.reject(bt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return je(this.app)?Promise.reject(bt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(St(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await m_(this),t=new __(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new dr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await h_(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&St(e)||this._popupRedirectResolver;q(t,this,"argument-error"),this.redirectPersistenceManager=await Zn.create(this,[St(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(q(c,this,"internal-error"),c.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,r,s);return()=>{a=!0,l()}}else{const l=e.addObserver(t);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return q(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=nd(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(je(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&jh(`Error while retrieving App Check token: ${e.error}`),e?.token}}function pn(n){return fe(n)}class fl{constructor(e){this.auth=e,this.observer=null,this.addObserver=Um(t=>this.observer=t)}get next(){return q(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function E_(n){Xi=n}function rd(n){return Xi.loadJS(n)}function T_(){return Xi.recaptchaEnterpriseScript}function w_(){return Xi.gapiScript}function I_(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class v_{constructor(){this.enterprise=new A_}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class A_{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R_="recaptcha-enterprise",sd="NO_RECAPTCHA",pl="onFirebaseAuthREInstanceReady";class zt{constructor(e){this.type=R_,this.auth=pn(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,c)=>{r_(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const h=new n_(l);return i.tenantId==null?i._agentRecaptchaConfig=h:i._tenantRecaptchaConfigs[i.tenantId]=h,a(h.siteKey)}}).catch(l=>{c(l)})})}function s(i,a,c){const l=window.grecaptcha;cl(l)?l.enterprise.ready(()=>{l.enterprise.execute(i,{action:e}).then(h=>{a(h)}).catch(()=>{a(sd)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new v_().execute("siteKey",{action:"verify"}):new Promise((i,a)=>{r(this.auth).then(async c=>{if(!t&&cl(window.grecaptcha)&&zt.scriptInjectionDeferred)await zt.scriptInjectionDeferred.promise,s(c,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=T_();l.length!==0&&(l+=c+`&onload=${pl}`),zt.scriptInjectionDeferred=new kn,window[pl]=()=>{zt.scriptInjectionDeferred?.resolve()},rd(l).then(()=>zt.scriptInjectionDeferred?.promise).then(()=>{s(c,i,a)}).catch(h=>{a(h)})}}).catch(c=>{a(c)})})}}zt.scriptInjectionDeferred=null;async function ml(n,e,t,r=!1,s=!1){const i=new zt(n);let a;if(s)a=sd;else try{a=await i.verify(t)}catch{a=await i.verify(t,!0)}const c={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){const l=c.phoneEnrollmentInfo.phoneNumber,h=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:h,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){const l=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:a}):Object.assign(c,{captchaResponse:a}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function pa(n,e,t,r,s){if(n._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await ml(n,e,t,t==="getOobCode");return r(n,i)}else return r(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await ml(n,e,t,t==="getOobCode");return r(n,a)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P_(n,e){const t=Un(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(Nn(i,e??{}))return s;nt(s,"already-initialized")}return t.initialize({options:e})}function S_(n,e){const t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(St);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function C_(n,e,t){const r=pn(n);q(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=id(e),{host:a,port:c}=b_(e),l=c===null?"":`:${c}`,h={url:`${i}//${a}${l}/`},p=Object.freeze({host:a,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){q(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),q(Nn(h,r.config.emulator)&&Nn(p,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=h,r.emulatorConfig=p,r.settings.appVerificationDisabledForTesting=!0,As(a)?Mh(`${i}//${a}${l}`):V_()}function id(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function b_(n){const e=id(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:gl(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:gl(a)}}}function gl(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function V_(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Pt("not implemented")}_getIdTokenResponse(e){return Pt("not implemented")}_linkToIdToken(e,t){return Pt("not implemented")}_getReauthenticationResolver(e){return Pt("not implemented")}}async function k_(n,e){return Mt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function N_(n,e){return Ss(n,"POST","/v1/accounts:signInWithPassword",fn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function O_(n,e){return Ss(n,"POST","/v1/accounts:signInWithEmailLink",fn(n,e))}async function D_(n,e){return Ss(n,"POST","/v1/accounts:signInWithEmailLink",fn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss extends qa{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new ss(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new ss(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return pa(e,t,"signInWithPassword",N_);case"emailLink":return O_(e,{email:this._email,oobCode:this._password});default:nt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return pa(e,r,"signUpPassword",k_);case"emailLink":return D_(e,{idToken:t,email:this._email,oobCode:this._password});default:nt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function er(n,e){return Ss(n,"POST","/v1/accounts:signInWithIdp",fn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x_="http://localhost";class On extends qa{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new On(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):nt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;const a=new On(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return er(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,er(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,er(e,t)}buildRequest(){const e={requestUri:x_,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=vs(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L_(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function M_(n){const e=Br($r(n)).link,t=e?Br($r(e)).deep_link_id:null,r=Br($r(n)).deep_link_id;return(r?Br($r(r)).link:null)||r||t||e||n}class Ga{constructor(e){const t=Br($r(e)),r=t.apiKey??null,s=t.oobCode??null,i=L_(t.mode??null);q(r&&s&&i,"argument-error"),this.apiKey=r,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=M_(e);try{return new Ga(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pr{constructor(){this.providerId=pr.PROVIDER_ID}static credential(e,t){return ss._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Ga.parseLink(t);return q(r,"argument-error"),ss._fromEmailAndCode(e,r.code,r.tenantId)}}pr.PROVIDER_ID="password";pr.EMAIL_PASSWORD_SIGN_IN_METHOD="password";pr.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ha{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs extends Ha{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt extends Cs{constructor(){super("facebook.com")}static credential(e){return On._fromParams({providerId:Wt.PROVIDER_ID,signInMethod:Wt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Wt.credentialFromTaggedObject(e)}static credentialFromError(e){return Wt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Wt.credential(e.oauthAccessToken)}catch{return null}}}Wt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Wt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt extends Cs{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return On._fromParams({providerId:Kt.PROVIDER_ID,signInMethod:Kt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Kt.credentialFromTaggedObject(e)}static credentialFromError(e){return Kt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Kt.credential(t,r)}catch{return null}}}Kt.GOOGLE_SIGN_IN_METHOD="google.com";Kt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt extends Cs{constructor(){super("github.com")}static credential(e){return On._fromParams({providerId:Qt.PROVIDER_ID,signInMethod:Qt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Qt.credentialFromTaggedObject(e)}static credentialFromError(e){return Qt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Qt.credential(e.oauthAccessToken)}catch{return null}}}Qt.GITHUB_SIGN_IN_METHOD="github.com";Qt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt extends Cs{constructor(){super("twitter.com")}static credential(e,t){return On._fromParams({providerId:Yt.PROVIDER_ID,signInMethod:Yt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Yt.credentialFromTaggedObject(e)}static credentialFromError(e){return Yt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Yt.credential(t,r)}catch{return null}}}Yt.TWITTER_SIGN_IN_METHOD="twitter.com";Yt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function U_(n,e){return Ss(n,"POST","/v1/accounts:signUp",fn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await ot._fromIdTokenResponse(e,r,s),a=_l(r);return new Dn({user:i,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=_l(r);return new Dn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function _l(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ci extends It{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Ci.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Ci(e,t,r,s)}}function od(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Ci._fromErrorAndOperation(n,i,e,r):i})}async function F_(n,e,t=!1){const r=await nr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Dn._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function B_(n,e,t=!1){const{auth:r}=n;if(je(r.app))return Promise.reject(bt(r));const s="reauthenticate";try{const i=await nr(n,od(r,s,e,n),t);q(i.idToken,r,"internal-error");const a=$a(i.idToken);q(a,r,"internal-error");const{sub:c}=a;return q(n.uid===c,r,"user-mismatch"),Dn._forOperation(n,s,i)}catch(i){throw i?.code==="auth/user-not-found"&&nt(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ad(n,e,t=!1){if(je(n.app))return Promise.reject(bt(n));const r="signIn",s=await od(n,r,e),i=await Dn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function $_(n,e){return ad(pn(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cd(n){const e=pn(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function DR(n,e,t){if(je(n.app))return Promise.reject(bt(n));const r=pn(n),a=await pa(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",U_).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&cd(n),l}),c=await Dn._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(c.user),c}function xR(n,e,t){return je(n.app)?Promise.reject(bt(n)):$_(fe(n),pr.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&cd(n),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function j_(n,e){return Mt(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function LR(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=fe(n),i={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},a=await nr(r,j_(r.auth,i));r.displayName=a.displayName||null,r.photoURL=a.photoUrl||null;const c=r.providerData.find(({providerId:l})=>l==="password");c&&(c.displayName=r.displayName,c.photoURL=r.photoURL),await r._updateTokensIfNecessary(a)}function q_(n,e,t,r){return fe(n).onIdTokenChanged(e,t,r)}function G_(n,e,t){return fe(n).beforeAuthStateChanged(e,t)}function MR(n,e,t,r){return fe(n).onAuthStateChanged(e,t,r)}function UR(n){return fe(n).signOut()}const bi="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ud{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(bi,"1"),this.storage.removeItem(bi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H_=1e3,z_=10;class ld extends ud{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=td(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,c,l)=>{this.notifyListeners(a,l)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);f_()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,z_):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},H_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}ld.type="LOCAL";const W_=ld;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hd extends ud{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}hd.type="SESSION";const dd=hd;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K_(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new Zi(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,a=this.handlersMap[s];if(!a?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const c=Array.from(a).map(async h=>h(t.origin,i)),l=await K_(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Zi.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function za(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((c,l)=>{const h=za("",20);s.port1.start();const p=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const v=m;if(v.data.eventId===h)switch(v.data.status){case"ack":clearTimeout(p),i=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(v.data.response);break;default:clearTimeout(p),clearTimeout(i),l(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mt(){return window}function Y_(n){mt().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fd(){return typeof mt().WorkerGlobalScope<"u"&&typeof mt().importScripts=="function"}async function J_(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function X_(){return navigator?.serviceWorker?.controller||null}function Z_(){return fd()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pd="firebaseLocalStorageDb",ey=1,Vi="firebaseLocalStorage",md="fbase_key";class bs{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function eo(n,e){return n.transaction([Vi],e?"readwrite":"readonly").objectStore(Vi)}function ty(){const n=indexedDB.deleteDatabase(pd);return new bs(n).toPromise()}function gd(){const n=indexedDB.open(pd,ey);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Vi,{keyPath:md})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Vi)?e(r):(r.close(),await ty(),e(await gd()))})})}async function yl(n,e,t){const r=eo(n,!0).put({[md]:e,value:t});return new bs(r).toPromise()}async function ny(n,e){const t=eo(n,!1).get(e),r=await new bs(t).toPromise();return r===void 0?null:r.value}function El(n,e){const t=eo(n,!0).delete(e);return new bs(t).toPromise()}const ry=800,sy=3;class _d{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow)),typeof document<"u"&&typeof document.addEventListener=="function"&&document.addEventListener("visibilitychange",this.onVisibilityChange)}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow)),typeof document<"u"&&typeof document.removeEventListener=="function"&&document.removeEventListener("visibilitychange",this.onVisibilityChange)}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isHiding=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isHiding=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isHiding&&(this.isHiding=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this.onVisibilityChange=()=>{typeof document<"u"&&(document.visibilityState==="hidden"?this.onPageHide():document.visibilityState==="visible"&&this.onPageShow())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isHiding)throw new Error("Database is closing/hidden");return this.dbPromise?this.dbPromise:(this.dbPromise=gd(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isHiding||t++>sy)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return fd()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Zi._getInstance(Z_()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await J_(),!this.activeServiceWorker)return;this.sender=new Q_(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||X_()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await yl(e,bi,"1"),await El(e,bi)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>yl(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>ny(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>El(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isHiding)return[];try{const e=await this._withRetries(s=>{const i=eo(s,!1).getAll();return new bs(i).toPromise()});if(this.isHiding)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isHiding||jh(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),ry)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}_d.type="LOCAL";const iy=_d;new Ps(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yd(n,e){return e?St(e):(q(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wa extends qa{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return er(e,this._buildIdpRequest())}_linkToIdToken(e,t){return er(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return er(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function oy(n){return ad(n.auth,new Wa(n),n.bypassAuthState)}function ay(n){const{auth:e,user:t}=n;return q(t,e,"internal-error"),B_(t,new Wa(n),n.bypassAuthState)}async function cy(n){const{auth:e,user:t}=n;return q(t,e,"internal-error"),F_(t,new Wa(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ed{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:a,type:c}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(l))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return oy;case"linkViaPopup":case"linkViaRedirect":return cy;case"reauthViaPopup":case"reauthViaRedirect":return ay;default:nt(this.auth,"internal-error")}}resolve(e){Dt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Dt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uy=new Ps(2e3,1e4);async function FR(n,e,t){if(je(n.app))return Promise.reject(ut(n,"operation-not-supported-in-this-environment"));const r=pn(n);Wg(n,e,Ha);const s=yd(r,t);return new Rn(r,"signInViaPopup",e,s).executeNotNull()}class Rn extends Ed{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,Rn.currentPopupAction&&Rn.currentPopupAction.cancel(),Rn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return q(e,this.auth,"internal-error"),e}async onExecution(){Dt(this.filter.length===1,"Popup operations only handle one event");const e=za();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(ut(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(ut(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Rn.currentPopupAction=null}pollUserCancellation(){const e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ut(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,uy.get())};e()}}Rn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ly="pendingRedirect",mi=new Map;class hy extends Ed{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=mi.get(this.auth._key());if(!e){try{const r=await dy(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}mi.set(this.auth._key(),e)}return this.bypassAuthState||mi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function dy(n,e){const t=my(e),r=py(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function fy(n,e){mi.set(n._key(),e)}function py(n){return St(n._redirectPersistence)}function my(n){return pi(ly,n.config.apiKey,n.name)}async function gy(n,e,t=!1){if(je(n.app))return Promise.reject(bt(n));const r=pn(n),s=yd(r,e),a=await new hy(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _y=600*1e3;class yy{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Ey(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!Td(e)){const r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(ut(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=_y&&this.cachedEventUids.clear(),this.cachedEventUids.has(Tl(e))}saveEventToCache(e){this.cachedEventUids.add(Tl(e)),this.lastProcessedEventTime=Date.now()}}function Tl(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Td({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function Ey(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Td(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ty(n,e={}){return Mt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wy=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Iy=/^https?/;async function vy(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Ty(n);for(const t of e)try{if(Ay(t))return}catch{}nt(n,"unauthorized-domain")}function Ay(n){const e=da(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Iy.test(t))return!1;if(wy.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ry=new Ps(3e4,6e4);function wl(){const n=mt().___jsl;if(n?.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Py(n){return new Promise((e,t)=>{function r(){wl(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{wl(),t(ut(n,"network-request-failed"))},timeout:Ry.get()})}if(mt().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(mt().gapi?.load)r();else{const s=I_("iframefcb");return mt()[s]=()=>{gapi.load?r():t(ut(n,"network-request-failed"))},rd(`${w_()}?onload=${s}`).catch(i=>t(i))}}).catch(e=>{throw gi=null,e})}let gi=null;function Sy(n){return gi=gi||Py(n),gi}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cy=new Ps(5e3,15e3),by="__/auth/iframe",Vy="emulator/auth/iframe",ky={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Ny=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Oy(n){const e=n.config;q(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Ba(e,Vy):`https://${n.config.authDomain}/${by}`,r={apiKey:e.apiKey,appName:n.name,v:fr},s=Ny.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${vs(r).slice(1)}`}async function Dy(n){const e=await Sy(n),t=mt().gapi;return q(t,n,"internal-error"),e.open({where:document.body,url:Oy(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:ky,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=ut(n,"network-request-failed"),c=mt().setTimeout(()=>{i(a)},Cy.get());function l(){mt().clearTimeout(c),s(r)}r.ping(l).then(l,()=>{i(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xy={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ly=500,My=600,Uy="_blank",Fy="http://localhost";class Il{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function By(n,e,t,r=Ly,s=My){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const l={...xy,width:r.toString(),height:s.toString(),top:i,left:a},h=Oe().toLowerCase();t&&(c=Yh(h)?Uy:t),Kh(h)&&(e=e||Fy,l.scrollbars="yes");const p=Object.entries(l).reduce((v,[V,k])=>`${v}${V}=${k},`,"");if(d_(h)&&c!=="_self")return $y(e||"",c),new Il(null);const m=window.open(e||"",c,p);q(m,n,"popup-blocked");try{m.focus()}catch{}return new Il(m)}function $y(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jy="__/auth/handler",qy="emulator/auth/handler",Gy=encodeURIComponent("fac");async function vl(n,e,t,r,s,i){q(n.config.authDomain,n,"auth-domain-config-required"),q(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:fr,eventId:s};if(e instanceof Ha){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Mm(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[p,m]of Object.entries({}))a[p]=m}if(e instanceof Cs){const p=e.getScopes().filter(m=>m!=="");p.length>0&&(a.scopes=p.join(","))}n.tenantId&&(a.tid=n.tenantId);const c=a;for(const p of Object.keys(c))c[p]===void 0&&delete c[p];const l=await n._getAppCheckToken(),h=l?`#${Gy}=${encodeURIComponent(l)}`:"";return`${Hy(n)}?${vs(c).slice(1)}${h}`}function Hy({config:n}){return n.emulator?Ba(n,qy):`https://${n.authDomain}/${jy}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yo="webStorageSupport";class zy{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=dd,this._completeRedirectFn=gy,this._overrideRedirectResult=fy}async _openPopup(e,t,r,s){Dt(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");const i=await vl(e,t,r,da(),s);return By(e,i,za())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await vl(e,t,r,da(),s);return Y_(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(Dt(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Dy(e),r=new yy(e);return t.register("authEvent",s=>(q(s?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Yo,{type:Yo},s=>{const i=s?.[0]?.[Yo];i!==void 0&&t(!!i),nt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=vy(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return td()||Qh()||ja()}}const Wy=zy;var Al="@firebase/auth",Rl="1.13.4";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){q(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qy(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Yy(n){Ot(new yt("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=r.options;q(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:nd(n)},h=new y_(r,s,i,l);return S_(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Ot(new yt("auth-internal",e=>{const t=pn(e.getProvider("auth").getImmediate());return(r=>new Ky(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),ct(Al,Rl,Qy(n)),ct(Al,Rl,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jy=300,Xy=Lh("authIdTokenMaxAge")||Jy;let Pl=null;const Zy=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Xy)return;const s=t?.token;Pl!==s&&(Pl=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function BR(n=Ji()){const e=Un(n,"auth");if(e.isInitialized())return e.getImmediate();const t=P_(n,{popupRedirectResolver:Wy,persistence:[iy,W_,dd]}),r=Lh("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=Zy(i.toString());G_(t,a,()=>a(t.currentUser)),q_(t,c=>a(c))}}const s=Dh("auth");return s&&C_(t,`http://${s}`),t}function eE(){return document.getElementsByTagName("head")?.[0]??document}E_({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=ut("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",eE().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Yy("Browser");var Sl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Zt,wd;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(w,g){function y(){}y.prototype=g.prototype,w.F=g.prototype,w.prototype=new y,w.prototype.constructor=w,w.D=function(I,T,R){for(var _=Array(arguments.length-2),Fe=2;Fe<arguments.length;Fe++)_[Fe-2]=arguments[Fe];return g.prototype[T].apply(I,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(w,g,y){y||(y=0);const I=Array(16);if(typeof g=="string")for(var T=0;T<16;++T)I[T]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(T=0;T<16;++T)I[T]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=w.g[0],y=w.g[1],T=w.g[2];let R=w.g[3],_;_=g+(R^y&(T^R))+I[0]+3614090360&4294967295,g=y+(_<<7&4294967295|_>>>25),_=R+(T^g&(y^T))+I[1]+3905402710&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(y^R&(g^y))+I[2]+606105819&4294967295,T=R+(_<<17&4294967295|_>>>15),_=y+(g^T&(R^g))+I[3]+3250441966&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(R^y&(T^R))+I[4]+4118548399&4294967295,g=y+(_<<7&4294967295|_>>>25),_=R+(T^g&(y^T))+I[5]+1200080426&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(y^R&(g^y))+I[6]+2821735955&4294967295,T=R+(_<<17&4294967295|_>>>15),_=y+(g^T&(R^g))+I[7]+4249261313&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(R^y&(T^R))+I[8]+1770035416&4294967295,g=y+(_<<7&4294967295|_>>>25),_=R+(T^g&(y^T))+I[9]+2336552879&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(y^R&(g^y))+I[10]+4294925233&4294967295,T=R+(_<<17&4294967295|_>>>15),_=y+(g^T&(R^g))+I[11]+2304563134&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(R^y&(T^R))+I[12]+1804603682&4294967295,g=y+(_<<7&4294967295|_>>>25),_=R+(T^g&(y^T))+I[13]+4254626195&4294967295,R=g+(_<<12&4294967295|_>>>20),_=T+(y^R&(g^y))+I[14]+2792965006&4294967295,T=R+(_<<17&4294967295|_>>>15),_=y+(g^T&(R^g))+I[15]+1236535329&4294967295,y=T+(_<<22&4294967295|_>>>10),_=g+(T^R&(y^T))+I[1]+4129170786&4294967295,g=y+(_<<5&4294967295|_>>>27),_=R+(y^T&(g^y))+I[6]+3225465664&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(R^g))+I[11]+643717713&4294967295,T=R+(_<<14&4294967295|_>>>18),_=y+(R^g&(T^R))+I[0]+3921069994&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(T^R&(y^T))+I[5]+3593408605&4294967295,g=y+(_<<5&4294967295|_>>>27),_=R+(y^T&(g^y))+I[10]+38016083&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(R^g))+I[15]+3634488961&4294967295,T=R+(_<<14&4294967295|_>>>18),_=y+(R^g&(T^R))+I[4]+3889429448&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(T^R&(y^T))+I[9]+568446438&4294967295,g=y+(_<<5&4294967295|_>>>27),_=R+(y^T&(g^y))+I[14]+3275163606&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(R^g))+I[3]+4107603335&4294967295,T=R+(_<<14&4294967295|_>>>18),_=y+(R^g&(T^R))+I[8]+1163531501&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(T^R&(y^T))+I[13]+2850285829&4294967295,g=y+(_<<5&4294967295|_>>>27),_=R+(y^T&(g^y))+I[2]+4243563512&4294967295,R=g+(_<<9&4294967295|_>>>23),_=T+(g^y&(R^g))+I[7]+1735328473&4294967295,T=R+(_<<14&4294967295|_>>>18),_=y+(R^g&(T^R))+I[12]+2368359562&4294967295,y=T+(_<<20&4294967295|_>>>12),_=g+(y^T^R)+I[5]+4294588738&4294967295,g=y+(_<<4&4294967295|_>>>28),_=R+(g^y^T)+I[8]+2272392833&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^y)+I[11]+1839030562&4294967295,T=R+(_<<16&4294967295|_>>>16),_=y+(T^R^g)+I[14]+4259657740&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(y^T^R)+I[1]+2763975236&4294967295,g=y+(_<<4&4294967295|_>>>28),_=R+(g^y^T)+I[4]+1272893353&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^y)+I[7]+4139469664&4294967295,T=R+(_<<16&4294967295|_>>>16),_=y+(T^R^g)+I[10]+3200236656&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(y^T^R)+I[13]+681279174&4294967295,g=y+(_<<4&4294967295|_>>>28),_=R+(g^y^T)+I[0]+3936430074&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^y)+I[3]+3572445317&4294967295,T=R+(_<<16&4294967295|_>>>16),_=y+(T^R^g)+I[6]+76029189&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(y^T^R)+I[9]+3654602809&4294967295,g=y+(_<<4&4294967295|_>>>28),_=R+(g^y^T)+I[12]+3873151461&4294967295,R=g+(_<<11&4294967295|_>>>21),_=T+(R^g^y)+I[15]+530742520&4294967295,T=R+(_<<16&4294967295|_>>>16),_=y+(T^R^g)+I[2]+3299628645&4294967295,y=T+(_<<23&4294967295|_>>>9),_=g+(T^(y|~R))+I[0]+4096336452&4294967295,g=y+(_<<6&4294967295|_>>>26),_=R+(y^(g|~T))+I[7]+1126891415&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~y))+I[14]+2878612391&4294967295,T=R+(_<<15&4294967295|_>>>17),_=y+(R^(T|~g))+I[5]+4237533241&4294967295,y=T+(_<<21&4294967295|_>>>11),_=g+(T^(y|~R))+I[12]+1700485571&4294967295,g=y+(_<<6&4294967295|_>>>26),_=R+(y^(g|~T))+I[3]+2399980690&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~y))+I[10]+4293915773&4294967295,T=R+(_<<15&4294967295|_>>>17),_=y+(R^(T|~g))+I[1]+2240044497&4294967295,y=T+(_<<21&4294967295|_>>>11),_=g+(T^(y|~R))+I[8]+1873313359&4294967295,g=y+(_<<6&4294967295|_>>>26),_=R+(y^(g|~T))+I[15]+4264355552&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~y))+I[6]+2734768916&4294967295,T=R+(_<<15&4294967295|_>>>17),_=y+(R^(T|~g))+I[13]+1309151649&4294967295,y=T+(_<<21&4294967295|_>>>11),_=g+(T^(y|~R))+I[4]+4149444226&4294967295,g=y+(_<<6&4294967295|_>>>26),_=R+(y^(g|~T))+I[11]+3174756917&4294967295,R=g+(_<<10&4294967295|_>>>22),_=T+(g^(R|~y))+I[2]+718787259&4294967295,T=R+(_<<15&4294967295|_>>>17),_=y+(R^(T|~g))+I[9]+3951481745&4294967295,w.g[0]=w.g[0]+g&4294967295,w.g[1]=w.g[1]+(T+(_<<21&4294967295|_>>>11))&4294967295,w.g[2]=w.g[2]+T&4294967295,w.g[3]=w.g[3]+R&4294967295}r.prototype.v=function(w,g){g===void 0&&(g=w.length);const y=g-this.blockSize,I=this.C;let T=this.h,R=0;for(;R<g;){if(T==0)for(;R<=y;)s(this,w,R),R+=this.blockSize;if(typeof w=="string"){for(;R<g;)if(I[T++]=w.charCodeAt(R++),T==this.blockSize){s(this,I),T=0;break}}else for(;R<g;)if(I[T++]=w[R++],T==this.blockSize){s(this,I),T=0;break}}this.h=T,this.o+=g},r.prototype.A=function(){var w=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);w[0]=128;for(var g=1;g<w.length-8;++g)w[g]=0;g=this.o*8;for(var y=w.length-8;y<w.length;++y)w[y]=g&255,g/=256;for(this.v(w),w=Array(16),g=0,y=0;y<4;++y)for(let I=0;I<32;I+=8)w[g++]=this.g[y]>>>I&255;return w};function i(w,g){var y=c;return Object.prototype.hasOwnProperty.call(y,w)?y[w]:y[w]=g(w)}function a(w,g){this.h=g;const y=[];let I=!0;for(let T=w.length-1;T>=0;T--){const R=w[T]|0;I&&R==g||(y[T]=R,I=!1)}this.g=y}var c={};function l(w){return-128<=w&&w<128?i(w,function(g){return new a([g|0],g<0?-1:0)}):new a([w|0],w<0?-1:0)}function h(w){if(isNaN(w)||!isFinite(w))return m;if(w<0)return L(h(-w));const g=[];let y=1;for(let I=0;w>=y;I++)g[I]=w/y|0,y*=4294967296;return new a(g,0)}function p(w,g){if(w.length==0)throw Error("number format error: empty string");if(g=g||10,g<2||36<g)throw Error("radix out of range: "+g);if(w.charAt(0)=="-")return L(p(w.substring(1),g));if(w.indexOf("-")>=0)throw Error('number format error: interior "-" character');const y=h(Math.pow(g,8));let I=m;for(let R=0;R<w.length;R+=8){var T=Math.min(8,w.length-R);const _=parseInt(w.substring(R,R+T),g);T<8?(T=h(Math.pow(g,T)),I=I.j(T).add(h(_))):(I=I.j(y),I=I.add(h(_)))}return I}var m=l(0),v=l(1),V=l(16777216);n=a.prototype,n.m=function(){if(F(this))return-L(this).m();let w=0,g=1;for(let y=0;y<this.g.length;y++){const I=this.i(y);w+=(I>=0?I:4294967296+I)*g,g*=4294967296}return w},n.toString=function(w){if(w=w||10,w<2||36<w)throw Error("radix out of range: "+w);if(k(this))return"0";if(F(this))return"-"+L(this).toString(w);const g=h(Math.pow(w,6));var y=this;let I="";for(;;){const T=Ue(y,g).g;y=W(y,T.j(g));let R=((y.g.length>0?y.g[0]:y.h)>>>0).toString(w);if(y=T,k(y))return R+I;for(;R.length<6;)R="0"+R;I=R+I}},n.i=function(w){return w<0?0:w<this.g.length?this.g[w]:this.h};function k(w){if(w.h!=0)return!1;for(let g=0;g<w.g.length;g++)if(w.g[g]!=0)return!1;return!0}function F(w){return w.h==-1}n.l=function(w){return w=W(this,w),F(w)?-1:k(w)?0:1};function L(w){const g=w.g.length,y=[];for(let I=0;I<g;I++)y[I]=~w.g[I];return new a(y,~w.h).add(v)}n.abs=function(){return F(this)?L(this):this},n.add=function(w){const g=Math.max(this.g.length,w.g.length),y=[];let I=0;for(let T=0;T<=g;T++){let R=I+(this.i(T)&65535)+(w.i(T)&65535),_=(R>>>16)+(this.i(T)>>>16)+(w.i(T)>>>16);I=_>>>16,R&=65535,_&=65535,y[T]=_<<16|R}return new a(y,y[y.length-1]&-2147483648?-1:0)};function W(w,g){return w.add(L(g))}n.j=function(w){if(k(this)||k(w))return m;if(F(this))return F(w)?L(this).j(L(w)):L(L(this).j(w));if(F(w))return L(this.j(L(w)));if(this.l(V)<0&&w.l(V)<0)return h(this.m()*w.m());const g=this.g.length+w.g.length,y=[];for(var I=0;I<2*g;I++)y[I]=0;for(I=0;I<this.g.length;I++)for(let T=0;T<w.g.length;T++){const R=this.i(I)>>>16,_=this.i(I)&65535,Fe=w.i(T)>>>16,_n=w.i(T)&65535;y[2*I+2*T]+=_*_n,ee(y,2*I+2*T),y[2*I+2*T+1]+=R*_n,ee(y,2*I+2*T+1),y[2*I+2*T+1]+=_*Fe,ee(y,2*I+2*T+1),y[2*I+2*T+2]+=R*Fe,ee(y,2*I+2*T+2)}for(w=0;w<g;w++)y[w]=y[2*w+1]<<16|y[2*w];for(w=g;w<2*g;w++)y[w]=0;return new a(y,0)};function ee(w,g){for(;(w[g]&65535)!=w[g];)w[g+1]+=w[g]>>>16,w[g]&=65535,g++}function oe(w,g){this.g=w,this.h=g}function Ue(w,g){if(k(g))throw Error("division by zero");if(k(w))return new oe(m,m);if(F(w))return g=Ue(L(w),g),new oe(L(g.g),L(g.h));if(F(g))return g=Ue(w,L(g)),new oe(L(g.g),g.h);if(w.g.length>30){if(F(w)||F(g))throw Error("slowDivide_ only works with positive integers.");for(var y=v,I=g;I.l(w)<=0;)y=st(y),I=st(I);var T=Ae(y,1),R=Ae(I,1);for(I=Ae(I,2),y=Ae(y,2);!k(I);){var _=R.add(I);_.l(w)<=0&&(T=T.add(y),R=_),I=Ae(I,1),y=Ae(y,1)}return g=W(w,T.j(g)),new oe(T,g)}for(T=m;w.l(g)>=0;){for(y=Math.max(1,Math.floor(w.m()/g.m())),I=Math.ceil(Math.log(y)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),R=h(y),_=R.j(g);F(_)||_.l(w)>0;)y-=I,R=h(y),_=R.j(g);k(R)&&(R=v),T=T.add(R),w=W(w,_)}return new oe(T,w)}n.B=function(w){return Ue(this,w).h},n.and=function(w){const g=Math.max(this.g.length,w.g.length),y=[];for(let I=0;I<g;I++)y[I]=this.i(I)&w.i(I);return new a(y,this.h&w.h)},n.or=function(w){const g=Math.max(this.g.length,w.g.length),y=[];for(let I=0;I<g;I++)y[I]=this.i(I)|w.i(I);return new a(y,this.h|w.h)},n.xor=function(w){const g=Math.max(this.g.length,w.g.length),y=[];for(let I=0;I<g;I++)y[I]=this.i(I)^w.i(I);return new a(y,this.h^w.h)};function st(w){const g=w.g.length+1,y=[];for(let I=0;I<g;I++)y[I]=w.i(I)<<1|w.i(I-1)>>>31;return new a(y,w.h)}function Ae(w,g){const y=g>>5;g%=32;const I=w.g.length-y,T=[];for(let R=0;R<I;R++)T[R]=g>0?w.i(R+y)>>>g|w.i(R+y+1)<<32-g:w.i(R+y);return new a(T,w.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,wd=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=h,a.fromString=p,Zt=a}).apply(typeof Sl<"u"?Sl:typeof self<"u"?self:typeof window<"u"?window:{});var si=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Id,jr,vd,_i,ma,Ad,Rd,Pd;(function(){var n,e=Object.defineProperty;function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof si=="object"&&si];for(var u=0;u<o.length;++u){var d=o[u];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=t(this);function s(o,u){if(u)e:{var d=r;o=o.split(".");for(var f=0;f<o.length-1;f++){var A=o[f];if(!(A in d))break e;d=d[A]}o=o[o.length-1],f=d[o],u=u(f),u!=f&&u!=null&&e(d,o,{configurable:!0,writable:!0,value:u})}}s("Symbol.dispose",function(o){return o||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(o){return o||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(o){return o||function(u){var d=[],f;for(f in u)Object.prototype.hasOwnProperty.call(u,f)&&d.push([f,u[f]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},a=this||self;function c(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function l(o,u,d){return o.call.apply(o.bind,arguments)}function h(o,u,d){return h=l,h.apply(null,arguments)}function p(o,u){var d=Array.prototype.slice.call(arguments,1);return function(){var f=d.slice();return f.push.apply(f,arguments),o.apply(this,f)}}function m(o,u){function d(){}d.prototype=u.prototype,o.Z=u.prototype,o.prototype=new d,o.prototype.constructor=o,o.Ob=function(f,A,P){for(var O=Array(arguments.length-2),K=2;K<arguments.length;K++)O[K-2]=arguments[K];return u.prototype[A].apply(f,O)}}var v=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?o=>o&&AsyncContext.Snapshot.wrap(o):o=>o;function V(o){const u=o.length;if(u>0){const d=Array(u);for(let f=0;f<u;f++)d[f]=o[f];return d}return[]}function k(o,u){for(let f=1;f<arguments.length;f++){const A=arguments[f];var d=typeof A;if(d=d!="object"?d:A?Array.isArray(A)?"array":d:"null",d=="array"||d=="object"&&typeof A.length=="number"){d=o.length||0;const P=A.length||0;o.length=d+P;for(let O=0;O<P;O++)o[d+O]=A[O]}else o.push(A)}}class F{constructor(u,d){this.i=u,this.j=d,this.h=0,this.g=null}get(){let u;return this.h>0?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function L(o){a.setTimeout(()=>{throw o},0)}function W(){var o=w;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class ee{constructor(){this.h=this.g=null}add(u,d){const f=oe.get();f.set(u,d),this.h?this.h.next=f:this.g=f,this.h=f}}var oe=new F(()=>new Ue,o=>o.reset());class Ue{constructor(){this.next=this.g=this.h=null}set(u,d){this.h=u,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let st,Ae=!1,w=new ee,g=()=>{const o=Promise.resolve(void 0);st=()=>{o.then(y)}};function y(){for(var o;o=W();){try{o.h.call(o.g)}catch(d){L(d)}var u=oe;u.j(o),u.h<100&&(u.h++,o.next=u.g,u.g=o)}Ae=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function T(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}T.prototype.h=function(){this.defaultPrevented=!0};var R=(function(){if(!a.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const d=()=>{};a.addEventListener("test",d,u),a.removeEventListener("test",d,u)}catch{}return o})();function _(o){return/^[\s\xa0]*$/.test(o)}function Fe(o,u){T.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o&&this.init(o,u)}m(Fe,T),Fe.prototype.init=function(o,u){const d=this.type=o.type,f=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget,u||(d=="mouseover"?u=o.fromElement:d=="mouseout"&&(u=o.toElement)),this.relatedTarget=u,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=o.pointerType,this.state=o.state,this.i=o,o.defaultPrevented&&Fe.Z.h.call(this)},Fe.prototype.h=function(){Fe.Z.h.call(this);const o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var _n="closure_listenable_"+(Math.random()*1e6|0),Fp=0;function Bp(o,u,d,f,A){this.listener=o,this.proxy=null,this.src=u,this.type=d,this.capture=!!f,this.ha=A,this.key=++Fp,this.da=this.fa=!1}function js(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function qs(o,u,d){for(const f in o)u.call(d,o[f],f,o)}function $p(o,u){for(const d in o)u.call(void 0,o[d],d,o)}function Zc(o){const u={};for(const d in o)u[d]=o[d];return u}const eu="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function tu(o,u){let d,f;for(let A=1;A<arguments.length;A++){f=arguments[A];for(d in f)o[d]=f[d];for(let P=0;P<eu.length;P++)d=eu[P],Object.prototype.hasOwnProperty.call(f,d)&&(o[d]=f[d])}}function Gs(o){this.src=o,this.g={},this.h=0}Gs.prototype.add=function(o,u,d,f,A){const P=o.toString();o=this.g[P],o||(o=this.g[P]=[],this.h++);const O=Ao(o,u,f,A);return O>-1?(u=o[O],d||(u.fa=!1)):(u=new Bp(u,this.src,P,!!f,A),u.fa=d,o.push(u)),u};function vo(o,u){const d=u.type;if(d in o.g){var f=o.g[d],A=Array.prototype.indexOf.call(f,u,void 0),P;(P=A>=0)&&Array.prototype.splice.call(f,A,1),P&&(js(u),o.g[d].length==0&&(delete o.g[d],o.h--))}}function Ao(o,u,d,f){for(let A=0;A<o.length;++A){const P=o[A];if(!P.da&&P.listener==u&&P.capture==!!d&&P.ha==f)return A}return-1}var Ro="closure_lm_"+(Math.random()*1e6|0),Po={};function nu(o,u,d,f,A){if(Array.isArray(u)){for(let P=0;P<u.length;P++)nu(o,u[P],d,f,A);return null}return d=iu(d),o&&o[_n]?o.J(u,d,c(f)?!!f.capture:!1,A):jp(o,u,d,!1,f,A)}function jp(o,u,d,f,A,P){if(!u)throw Error("Invalid event type");const O=c(A)?!!A.capture:!!A;let K=Co(o);if(K||(o[Ro]=K=new Gs(o)),d=K.add(u,d,f,O,P),d.proxy)return d;if(f=qp(),d.proxy=f,f.src=o,f.listener=d,o.addEventListener)R||(A=O),A===void 0&&(A=!1),o.addEventListener(u.toString(),f,A);else if(o.attachEvent)o.attachEvent(su(u.toString()),f);else if(o.addListener&&o.removeListener)o.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return d}function qp(){function o(d){return u.call(o.src,o.listener,d)}const u=Gp;return o}function ru(o,u,d,f,A){if(Array.isArray(u))for(var P=0;P<u.length;P++)ru(o,u[P],d,f,A);else f=c(f)?!!f.capture:!!f,d=iu(d),o&&o[_n]?(o=o.i,P=String(u).toString(),P in o.g&&(u=o.g[P],d=Ao(u,d,f,A),d>-1&&(js(u[d]),Array.prototype.splice.call(u,d,1),u.length==0&&(delete o.g[P],o.h--)))):o&&(o=Co(o))&&(u=o.g[u.toString()],o=-1,u&&(o=Ao(u,d,f,A)),(d=o>-1?u[o]:null)&&So(d))}function So(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[_n])vo(u.i,o);else{var d=o.type,f=o.proxy;u.removeEventListener?u.removeEventListener(d,f,o.capture):u.detachEvent?u.detachEvent(su(d),f):u.addListener&&u.removeListener&&u.removeListener(f),(d=Co(u))?(vo(d,o),d.h==0&&(d.src=null,u[Ro]=null)):js(o)}}}function su(o){return o in Po?Po[o]:Po[o]="on"+o}function Gp(o,u){if(o.da)o=!0;else{u=new Fe(u,this);const d=o.listener,f=o.ha||o.src;o.fa&&So(o),o=d.call(f,u)}return o}function Co(o){return o=o[Ro],o instanceof Gs?o:null}var bo="__closure_events_fn_"+(Math.random()*1e9>>>0);function iu(o){return typeof o=="function"?o:(o[bo]||(o[bo]=function(u){return o.handleEvent(u)}),o[bo])}function Ce(){I.call(this),this.i=new Gs(this),this.M=this,this.G=null}m(Ce,I),Ce.prototype[_n]=!0,Ce.prototype.removeEventListener=function(o,u,d,f){ru(this,o,u,d,f)};function xe(o,u){var d,f=o.G;if(f)for(d=[];f;f=f.G)d.push(f);if(o=o.M,f=u.type||u,typeof u=="string")u=new T(u,o);else if(u instanceof T)u.target=u.target||o;else{var A=u;u=new T(f,o),tu(u,A)}A=!0;let P,O;if(d)for(O=d.length-1;O>=0;O--)P=u.g=d[O],A=Hs(P,f,!0,u)&&A;if(P=u.g=o,A=Hs(P,f,!0,u)&&A,A=Hs(P,f,!1,u)&&A,d)for(O=0;O<d.length;O++)P=u.g=d[O],A=Hs(P,f,!1,u)&&A}Ce.prototype.N=function(){if(Ce.Z.N.call(this),this.i){var o=this.i;for(const u in o.g){const d=o.g[u];for(let f=0;f<d.length;f++)js(d[f]);delete o.g[u],o.h--}}this.G=null},Ce.prototype.J=function(o,u,d,f){return this.i.add(String(o),u,!1,d,f)},Ce.prototype.K=function(o,u,d,f){return this.i.add(String(o),u,!0,d,f)};function Hs(o,u,d,f){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();let A=!0;for(let P=0;P<u.length;++P){const O=u[P];if(O&&!O.da&&O.capture==d){const K=O.listener,ge=O.ha||O.src;O.fa&&vo(o.i,O),A=K.call(ge,f)!==!1&&A}}return A&&!f.defaultPrevented}function Hp(o,u){if(typeof o!="function")if(o&&typeof o.handleEvent=="function")o=h(o.handleEvent,o);else throw Error("Invalid listener argument");return Number(u)>2147483647?-1:a.setTimeout(o,u||0)}function ou(o){o.g=Hp(()=>{o.g=null,o.i&&(o.i=!1,ou(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class zp extends I{constructor(u,d){super(),this.m=u,this.l=d,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:ou(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ir(o){I.call(this),this.h=o,this.g={}}m(Ir,I);var au=[];function cu(o){qs(o.g,function(u,d){this.g.hasOwnProperty(d)&&So(u)},o),o.g={}}Ir.prototype.N=function(){Ir.Z.N.call(this),cu(this)},Ir.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Vo=a.JSON.stringify,Wp=a.JSON.parse,Kp=class{stringify(o){return a.JSON.stringify(o,void 0)}parse(o){return a.JSON.parse(o,void 0)}};function uu(){}function lu(){}var vr={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function ko(){T.call(this,"d")}m(ko,T);function No(){T.call(this,"c")}m(No,T);var yn={},hu=null;function zs(){return hu=hu||new Ce}yn.Ia="serverreachability";function du(o){T.call(this,yn.Ia,o)}m(du,T);function Ar(o){const u=zs();xe(u,new du(u))}yn.STAT_EVENT="statevent";function fu(o,u){T.call(this,yn.STAT_EVENT,o),this.stat=u}m(fu,T);function Le(o){const u=zs();xe(u,new fu(u,o))}yn.Ja="timingevent";function pu(o,u){T.call(this,yn.Ja,o),this.size=u}m(pu,T);function Rr(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){o()},u)}function Pr(){this.g=!0}Pr.prototype.ua=function(){this.g=!1};function Qp(o,u,d,f,A,P){o.info(function(){if(o.g)if(P){var O="",K=P.split("&");for(let te=0;te<K.length;te++){var ge=K[te].split("=");if(ge.length>1){const Te=ge[0];ge=ge[1];const dt=Te.split("_");O=dt.length>=2&&dt[1]=="type"?O+(Te+"="+ge+"&"):O+(Te+"=redacted&")}}}else O=null;else O=P;return"XMLHTTP REQ ("+f+") [attempt "+A+"]: "+u+`
`+d+`
`+O})}function Yp(o,u,d,f,A,P,O){o.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+A+"]: "+u+`
`+d+`
`+P+" "+O})}function jn(o,u,d,f){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Xp(o,d)+(f?" "+f:"")})}function Jp(o,u){o.info(function(){return"TIMEOUT: "+u})}Pr.prototype.info=function(){};function Xp(o,u){if(!o.g)return u;if(!u)return null;try{const P=JSON.parse(u);if(P){for(o=0;o<P.length;o++)if(Array.isArray(P[o])){var d=P[o];if(!(d.length<2)){var f=d[1];if(Array.isArray(f)&&!(f.length<1)){var A=f[0];if(A!="noop"&&A!="stop"&&A!="close")for(let O=1;O<f.length;O++)f[O]=""}}}}return Vo(P)}catch{return u}}var Ws={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},mu={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},gu;function Oo(){}m(Oo,uu),Oo.prototype.g=function(){return new XMLHttpRequest},gu=new Oo;function Sr(o){return encodeURIComponent(String(o))}function Zp(o){var u=1;o=o.split(":");const d=[];for(;u>0&&o.length;)d.push(o.shift()),u--;return o.length&&d.push(o.join(":")),d}function Ut(o,u,d,f){this.j=o,this.i=u,this.l=d,this.S=f||1,this.V=new Ir(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new _u}function _u(){this.i=null,this.g="",this.h=!1}var yu={},Do={};function xo(o,u,d){o.M=1,o.A=Qs(ht(u)),o.u=d,o.R=!0,Eu(o,null)}function Eu(o,u){o.F=Date.now(),Ks(o),o.B=ht(o.A);var d=o.B,f=o.S;Array.isArray(f)||(f=[String(f)]),Nu(d.i,"t",f),o.C=0,d=o.j.L,o.h=new _u,o.g=Yu(o.j,d?u:null,!o.u),o.P>0&&(o.O=new zp(h(o.Y,o,o.g),o.P)),u=o.V,d=o.g,f=o.ba;var A="readystatechange";Array.isArray(A)||(A&&(au[0]=A.toString()),A=au);for(let P=0;P<A.length;P++){const O=nu(d,A[P],f||u.handleEvent,!1,u.h||u);if(!O)break;u.g[O.key]=O}u=o.J?Zc(o.J):{},o.u?(o.v||(o.v="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.B,o.v,o.u,u)):(o.v="GET",o.g.ea(o.B,o.v,null,u)),Ar(),Qp(o.i,o.v,o.B,o.l,o.S,o.u)}Ut.prototype.ba=function(o){o=o.target;const u=this.O;u&&$t(o)==3?u.j():this.Y(o)},Ut.prototype.Y=function(o){try{if(o==this.g)e:{const K=$t(this.g),ge=this.g.ya(),te=this.g.ca();if(!(K<3)&&(K!=3||this.g&&(this.h.h||this.g.la()||Fu(this.g)))){this.K||K!=4||ge==7||(ge==8||te<=0?Ar(3):Ar(2)),Lo(this);var u=this.g.ca();this.X=u;var d=em(this);if(this.o=u==200,Yp(this.i,this.v,this.B,this.l,this.S,K,u),this.o){if(this.U&&!this.L){t:{if(this.g){var f,A=this.g;if((f=A.g?A.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(f)){var P=f;break t}}P=null}if(o=P)jn(this.i,this.l,o,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Mo(this,o);else{this.o=!1,this.m=3,Le(12),En(this),Cr(this);break e}}if(this.R){o=!0;let Te;for(;!this.K&&this.C<d.length;)if(Te=tm(this,d),Te==Do){K==4&&(this.m=4,Le(14),o=!1),jn(this.i,this.l,null,"[Incomplete Response]");break}else if(Te==yu){this.m=4,Le(15),jn(this.i,this.l,d,"[Invalid Chunk]"),o=!1;break}else jn(this.i,this.l,Te,null),Mo(this,Te);if(Tu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),K!=4||d.length!=0||this.h.h||(this.m=1,Le(16),o=!1),this.o=this.o&&o,!o)jn(this.i,this.l,d,"[Invalid Chunked Response]"),En(this),Cr(this);else if(d.length>0&&!this.W){this.W=!0;var O=this.j;O.g==this&&O.aa&&!O.P&&(O.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Ho(O),O.P=!0,Le(11))}}else jn(this.i,this.l,d,null),Mo(this,d);K==4&&En(this),this.o&&!this.K&&(K==4?zu(this.j,this):(this.o=!1,Ks(this)))}else mm(this.g),u==400&&d.indexOf("Unknown SID")>0?(this.m=3,Le(12)):(this.m=0,Le(13)),En(this),Cr(this)}}}catch{}finally{}};function em(o){if(!Tu(o))return o.g.la();const u=Fu(o.g);if(u==="")return"";let d="";const f=u.length,A=$t(o.g)==4;if(!o.h.i){if(typeof TextDecoder>"u")return En(o),Cr(o),"";o.h.i=new a.TextDecoder}for(let P=0;P<f;P++)o.h.h=!0,d+=o.h.i.decode(u[P],{stream:!(A&&P==f-1)});return u.length=0,o.h.g+=d,o.C=0,o.h.g}function Tu(o){return o.g?o.v=="GET"&&o.M!=2&&o.j.Aa:!1}function tm(o,u){var d=o.C,f=u.indexOf(`
`,d);return f==-1?Do:(d=Number(u.substring(d,f)),isNaN(d)?yu:(f+=1,f+d>u.length?Do:(u=u.slice(f,f+d),o.C=f+d,u)))}Ut.prototype.cancel=function(){this.K=!0,En(this)};function Ks(o){o.T=Date.now()+o.H,wu(o,o.H)}function wu(o,u){if(o.D!=null)throw Error("WatchDog timer not null");o.D=Rr(h(o.aa,o),u)}function Lo(o){o.D&&(a.clearTimeout(o.D),o.D=null)}Ut.prototype.aa=function(){this.D=null;const o=Date.now();o-this.T>=0?(Jp(this.i,this.B),this.M!=2&&(Ar(),Le(17)),En(this),this.m=2,Cr(this)):wu(this,this.T-o)};function Cr(o){o.j.I==0||o.K||zu(o.j,o)}function En(o){Lo(o);var u=o.O;u&&typeof u.dispose=="function"&&u.dispose(),o.O=null,cu(o.V),o.g&&(u=o.g,o.g=null,u.abort(),u.dispose())}function Mo(o,u){try{var d=o.j;if(d.I!=0&&(d.g==o||Uo(d.h,o))){if(!o.L&&Uo(d.h,o)&&d.I==3){try{var f=d.Ba.g.parse(u)}catch{f=null}if(Array.isArray(f)&&f.length==3){var A=f;if(A[0]==0){e:if(!d.v){if(d.g)if(d.g.F+3e3<o.F)ei(d),Xs(d);else break e;Go(d),Le(18)}}else d.xa=A[1],0<d.xa-d.K&&A[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=Rr(h(d.Va,d),6e3));Au(d.h)<=1&&d.ta&&(d.ta=void 0)}else wn(d,11)}else if((o.L||d.g==o)&&ei(d),!_(u))for(A=d.Ba.g.parse(u),u=0;u<A.length;u++){let te=A[u];const Te=te[0];if(!(Te<=d.K))if(d.K=Te,te=te[1],d.I==2)if(te[0]=="c"){d.M=te[1],d.ba=te[2];const dt=te[3];dt!=null&&(d.ka=dt,d.j.info("VER="+d.ka));const In=te[4];In!=null&&(d.za=In,d.j.info("SVER="+d.za));const jt=te[5];jt!=null&&typeof jt=="number"&&jt>0&&(f=1.5*jt,d.O=f,d.j.info("backChannelRequestTimeoutMs_="+f)),f=d;const qt=o.g;if(qt){const ni=qt.g?qt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ni){var P=f.h;P.g||ni.indexOf("spdy")==-1&&ni.indexOf("quic")==-1&&ni.indexOf("h2")==-1||(P.j=P.l,P.g=new Set,P.h&&(Fo(P,P.h),P.h=null))}if(f.G){const zo=qt.g?qt.g.getResponseHeader("X-HTTP-Session-Id"):null;zo&&(f.wa=zo,ne(f.J,f.G,zo))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-o.F,d.j.info("Handshake RTT: "+d.T+"ms")),f=d;var O=o;if(f.na=Qu(f,f.L?f.ba:null,f.W),O.L){Ru(f.h,O);var K=O,ge=f.O;ge&&(K.H=ge),K.D&&(Lo(K),Ks(K)),f.g=O}else Gu(f);d.i.length>0&&Zs(d)}else te[0]!="stop"&&te[0]!="close"||wn(d,7);else d.I==3&&(te[0]=="stop"||te[0]=="close"?te[0]=="stop"?wn(d,7):qo(d):te[0]!="noop"&&d.l&&d.l.qa(te),d.A=0)}}Ar(4)}catch{}}var nm=class{constructor(o,u){this.g=o,this.map=u}};function Iu(o){this.l=o||10,a.PerformanceNavigationTiming?(o=a.performance.getEntriesByType("navigation"),o=o.length>0&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function vu(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Au(o){return o.h?1:o.g?o.g.size:0}function Uo(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function Fo(o,u){o.g?o.g.add(u):o.h=u}function Ru(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}Iu.prototype.cancel=function(){if(this.i=Pu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Pu(o){if(o.h!=null)return o.i.concat(o.h.G);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const d of o.g.values())u=u.concat(d.G);return u}return V(o.i)}var Su=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function rm(o,u){if(o){o=o.split("&");for(let d=0;d<o.length;d++){const f=o[d].indexOf("=");let A,P=null;f>=0?(A=o[d].substring(0,f),P=o[d].substring(f+1)):A=o[d],u(A,P?decodeURIComponent(P.replace(/\+/g," ")):"")}}}function Ft(o){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let u;o instanceof Ft?(this.l=o.l,br(this,o.j),this.o=o.o,this.g=o.g,Vr(this,o.u),this.h=o.h,Bo(this,Ou(o.i)),this.m=o.m):o&&(u=String(o).match(Su))?(this.l=!1,br(this,u[1]||"",!0),this.o=kr(u[2]||""),this.g=kr(u[3]||"",!0),Vr(this,u[4]),this.h=kr(u[5]||"",!0),Bo(this,u[6]||"",!0),this.m=kr(u[7]||"")):(this.l=!1,this.i=new Or(null,this.l))}Ft.prototype.toString=function(){const o=[];var u=this.j;u&&o.push(Nr(u,Cu,!0),":");var d=this.g;return(d||u=="file")&&(o.push("//"),(u=this.o)&&o.push(Nr(u,Cu,!0),"@"),o.push(Sr(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&o.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&o.push("/"),o.push(Nr(d,d.charAt(0)=="/"?om:im,!0))),(d=this.i.toString())&&o.push("?",d),(d=this.m)&&o.push("#",Nr(d,cm)),o.join("")},Ft.prototype.resolve=function(o){const u=ht(this);let d=!!o.j;d?br(u,o.j):d=!!o.o,d?u.o=o.o:d=!!o.g,d?u.g=o.g:d=o.u!=null;var f=o.h;if(d)Vr(u,o.u);else if(d=!!o.h){if(f.charAt(0)!="/")if(this.g&&!this.h)f="/"+f;else{var A=u.h.lastIndexOf("/");A!=-1&&(f=u.h.slice(0,A+1)+f)}if(A=f,A==".."||A==".")f="";else if(A.indexOf("./")!=-1||A.indexOf("/.")!=-1){f=A.lastIndexOf("/",0)==0,A=A.split("/");const P=[];for(let O=0;O<A.length;){const K=A[O++];K=="."?f&&O==A.length&&P.push(""):K==".."?((P.length>1||P.length==1&&P[0]!="")&&P.pop(),f&&O==A.length&&P.push("")):(P.push(K),f=!0)}f=P.join("/")}else f=A}return d?u.h=f:d=o.i.toString()!=="",d?Bo(u,Ou(o.i)):d=!!o.m,d&&(u.m=o.m),u};function ht(o){return new Ft(o)}function br(o,u,d){o.j=d?kr(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function Vr(o,u){if(u){if(u=Number(u),isNaN(u)||u<0)throw Error("Bad port number "+u);o.u=u}else o.u=null}function Bo(o,u,d){u instanceof Or?(o.i=u,um(o.i,o.l)):(d||(u=Nr(u,am)),o.i=new Or(u,o.l))}function ne(o,u,d){o.i.set(u,d)}function Qs(o){return ne(o,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),o}function kr(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Nr(o,u,d){return typeof o=="string"?(o=encodeURI(o).replace(u,sm),d&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function sm(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Cu=/[#\/\?@]/g,im=/[#\?:]/g,om=/[#\?]/g,am=/[#\?@]/g,cm=/#/g;function Or(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function Tn(o){o.g||(o.g=new Map,o.h=0,o.i&&rm(o.i,function(u,d){o.add(decodeURIComponent(u.replace(/\+/g," ")),d)}))}n=Or.prototype,n.add=function(o,u){Tn(this),this.i=null,o=qn(this,o);let d=this.g.get(o);return d||this.g.set(o,d=[]),d.push(u),this.h+=1,this};function bu(o,u){Tn(o),u=qn(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Vu(o,u){return Tn(o),u=qn(o,u),o.g.has(u)}n.forEach=function(o,u){Tn(this),this.g.forEach(function(d,f){d.forEach(function(A){o.call(u,A,f,this)},this)},this)};function ku(o,u){Tn(o);let d=[];if(typeof u=="string")Vu(o,u)&&(d=d.concat(o.g.get(qn(o,u))));else for(o=Array.from(o.g.values()),u=0;u<o.length;u++)d=d.concat(o[u]);return d}n.set=function(o,u){return Tn(this),this.i=null,o=qn(this,o),Vu(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=ku(this,o),o.length>0?String(o[0]):u):u};function Nu(o,u,d){bu(o,u),d.length>0&&(o.i=null,o.g.set(qn(o,u),V(d)),o.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(let f=0;f<u.length;f++){var d=u[f];const A=Sr(d);d=ku(this,d);for(let P=0;P<d.length;P++){let O=A;d[P]!==""&&(O+="="+Sr(d[P])),o.push(O)}}return this.i=o.join("&")};function Ou(o){const u=new Or;return u.i=o.i,o.g&&(u.g=new Map(o.g),u.h=o.h),u}function qn(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function um(o,u){u&&!o.j&&(Tn(o),o.i=null,o.g.forEach(function(d,f){const A=f.toLowerCase();f!=A&&(bu(this,f),Nu(this,A,d))},o)),o.j=u}function lm(o,u){const d=new Pr;if(a.Image){const f=new Image;f.onload=p(Bt,d,"TestLoadImage: loaded",!0,u,f),f.onerror=p(Bt,d,"TestLoadImage: error",!1,u,f),f.onabort=p(Bt,d,"TestLoadImage: abort",!1,u,f),f.ontimeout=p(Bt,d,"TestLoadImage: timeout",!1,u,f),a.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=o}else u(!1)}function hm(o,u){const d=new Pr,f=new AbortController,A=setTimeout(()=>{f.abort(),Bt(d,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:f.signal}).then(P=>{clearTimeout(A),P.ok?Bt(d,"TestPingServer: ok",!0,u):Bt(d,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(A),Bt(d,"TestPingServer: error",!1,u)})}function Bt(o,u,d,f,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),f(d)}catch{}}function dm(){this.g=new Kp}function $o(o){this.i=o.Sb||null,this.h=o.ab||!1}m($o,uu),$o.prototype.g=function(){return new Ys(this.i,this.h)};function Ys(o,u){Ce.call(this),this.H=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}m(Ys,Ce),n=Ys.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=o,this.D=u,this.readyState=1,xr(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const u={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};o&&(u.body=o),(this.H||a).fetch(new Request(this.D,u)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Dr(this)),this.readyState=0},n.Pa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,xr(this)),this.g&&(this.readyState=3,xr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Du(this)}else o.text().then(this.Oa.bind(this),this.ga.bind(this))};function Du(o){o.j.read().then(o.Ma.bind(o)).catch(o.ga.bind(o))}n.Ma=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.B.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?Dr(this):xr(this),this.readyState==3&&Du(this)}},n.Oa=function(o){this.g&&(this.response=this.responseText=o,Dr(this))},n.Na=function(o){this.g&&(this.response=o,Dr(this))},n.ga=function(){this.g&&Dr(this)};function Dr(o){o.readyState=4,o.l=null,o.j=null,o.B=null,xr(o)}n.setRequestHeader=function(o,u){this.A.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var d=u.next();!d.done;)d=d.value,o.push(d[0]+": "+d[1]),d=u.next();return o.join(`\r
`)};function xr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Ys.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function xu(o){let u="";return qs(o,function(d,f){u+=f,u+=":",u+=d,u+=`\r
`}),u}function jo(o,u,d){e:{for(f in d){var f=!1;break e}f=!0}f||(d=xu(d),typeof o=="string"?d!=null&&Sr(d):ne(o,u,d))}function ae(o){Ce.call(this),this.headers=new Map,this.L=o||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}m(ae,Ce);var fm=/^https?$/i,pm=["POST","PUT"];n=ae.prototype,n.Fa=function(o){this.H=o},n.ea=function(o,u,d,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():gu.g(),this.g.onreadystatechange=v(h(this.Ca,this));try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(P){Lu(this,P);return}if(o=d||"",d=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var A in f)d.set(A,f[A]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const P of f.keys())d.set(P,f.get(P));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(d.keys()).find(P=>P.toLowerCase()=="content-type"),A=a.FormData&&o instanceof a.FormData,!(Array.prototype.indexOf.call(pm,u,void 0)>=0)||f||A||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[P,O]of d)this.g.setRequestHeader(P,O);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(o),this.v=!1}catch(P){Lu(this,P)}};function Lu(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.o=5,Mu(o),Js(o)}function Mu(o){o.A||(o.A=!0,xe(o,"complete"),xe(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=o||7,xe(this,"complete"),xe(this,"abort"),Js(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Js(this,!0)),ae.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Uu(this):this.Xa())},n.Xa=function(){Uu(this)};function Uu(o){if(o.h&&typeof i<"u"){if(o.v&&$t(o)==4)setTimeout(o.Ca.bind(o),0);else if(xe(o,"readystatechange"),$t(o)==4){o.h=!1;try{const P=o.ca();e:switch(P){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var d;if(!(d=u)){var f;if(f=P===0){let O=String(o.D).match(Su)[1]||null;!O&&a.self&&a.self.location&&(O=a.self.location.protocol.slice(0,-1)),f=!fm.test(O?O.toLowerCase():"")}d=f}if(d)xe(o,"complete"),xe(o,"success");else{o.o=6;try{var A=$t(o)>2?o.g.statusText:""}catch{A=""}o.l=A+" ["+o.ca()+"]",Mu(o)}}finally{Js(o)}}}}function Js(o,u){if(o.g){o.m&&(clearTimeout(o.m),o.m=null);const d=o.g;o.g=null,u||xe(o,"ready");try{d.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function $t(o){return o.g?o.g.readyState:0}n.ca=function(){try{return $t(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),Wp(u)}};function Fu(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.F){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function mm(o){const u={};o=(o.g&&$t(o)>=2&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<o.length;f++){if(_(o[f]))continue;var d=Zp(o[f]);const A=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const P=u[A]||[];u[A]=P,P.push(d)}$p(u,function(f){return f.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Lr(o,u,d){return d&&d.internalChannelParams&&d.internalChannelParams[o]||u}function Bu(o){this.za=0,this.i=[],this.j=new Pr,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Lr("failFast",!1,o),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Lr("baseRetryDelayMs",5e3,o),this.Za=Lr("retryDelaySeedMs",1e4,o),this.Ta=Lr("forwardChannelMaxRetries",2,o),this.va=Lr("forwardChannelRequestTimeoutMs",2e4,o),this.ma=o&&o.xmlHttpFactory||void 0,this.Ua=o&&o.Rb||void 0,this.Aa=o&&o.useFetchStreams||!1,this.O=void 0,this.L=o&&o.supportsCrossDomainXhr||!1,this.M="",this.h=new Iu(o&&o.concurrentRequestLimit),this.Ba=new dm,this.S=o&&o.fastHandshake||!1,this.R=o&&o.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=o&&o.Pb||!1,o&&o.ua&&this.j.ua(),o&&o.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&o&&o.detectBufferingProxy||!1,this.ia=void 0,o&&o.longPollingTimeout&&o.longPollingTimeout>0&&(this.ia=o.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=Bu.prototype,n.ka=8,n.I=1,n.connect=function(o,u,d,f){Le(0),this.W=o,this.H=u||{},d&&f!==void 0&&(this.H.OSID=d,this.H.OAID=f),this.F=this.X,this.J=Qu(this,null,this.W),Zs(this)};function qo(o){if($u(o),o.I==3){var u=o.V++,d=ht(o.J);if(ne(d,"SID",o.M),ne(d,"RID",u),ne(d,"TYPE","terminate"),Mr(o,d),u=new Ut(o,o.j,u),u.M=2,u.A=Qs(ht(d)),d=!1,a.navigator&&a.navigator.sendBeacon)try{d=a.navigator.sendBeacon(u.A.toString(),"")}catch{}!d&&a.Image&&(new Image().src=u.A,d=!0),d||(u.g=Yu(u.j,null),u.g.ea(u.A)),u.F=Date.now(),Ks(u)}Ku(o)}function Xs(o){o.g&&(Ho(o),o.g.cancel(),o.g=null)}function $u(o){Xs(o),o.v&&(a.clearTimeout(o.v),o.v=null),ei(o),o.h.cancel(),o.m&&(typeof o.m=="number"&&a.clearTimeout(o.m),o.m=null)}function Zs(o){if(!vu(o.h)&&!o.m){o.m=!0;var u=o.Ea;st||g(),Ae||(st(),Ae=!0),w.add(u,o),o.D=0}}function gm(o,u){return Au(o.h)>=o.h.j-(o.m?1:0)?!1:o.m?(o.i=u.G.concat(o.i),!0):o.I==1||o.I==2||o.D>=(o.Sa?0:o.Ta)?!1:(o.m=Rr(h(o.Ea,o,u),Wu(o,o.D)),o.D++,!0)}n.Ea=function(o){if(this.m)if(this.m=null,this.I==1){if(!o){this.V=Math.floor(Math.random()*1e5),o=this.V++;const A=new Ut(this,this.j,o);let P=this.o;if(this.U&&(P?(P=Zc(P),tu(P,this.U)):P=this.U),this.u!==null||this.R||(A.J=P,P=null),this.S)e:{for(var u=0,d=0;d<this.i.length;d++){t:{var f=this.i[d];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(u+=f,u>4096){u=d;break e}if(u===4096||d===this.i.length-1){u=d+1;break e}}u=1e3}else u=1e3;u=qu(this,A,u),d=ht(this.J),ne(d,"RID",o),ne(d,"CVER",22),this.G&&ne(d,"X-HTTP-Session-Id",this.G),Mr(this,d),P&&(this.R?u="headers="+Sr(xu(P))+"&"+u:this.u&&jo(d,this.u,P)),Fo(this.h,A),this.Ra&&ne(d,"TYPE","init"),this.S?(ne(d,"$req",u),ne(d,"SID","null"),A.U=!0,xo(A,d,null)):xo(A,d,u),this.I=2}}else this.I==3&&(o?ju(this,o):this.i.length==0||vu(this.h)||ju(this))};function ju(o,u){var d;u?d=u.l:d=o.V++;const f=ht(o.J);ne(f,"SID",o.M),ne(f,"RID",d),ne(f,"AID",o.K),Mr(o,f),o.u&&o.o&&jo(f,o.u,o.o),d=new Ut(o,o.j,d,o.D+1),o.u===null&&(d.J=o.o),u&&(o.i=u.G.concat(o.i)),u=qu(o,d,1e3),d.H=Math.round(o.va*.5)+Math.round(o.va*.5*Math.random()),Fo(o.h,d),xo(d,f,u)}function Mr(o,u){o.H&&qs(o.H,function(d,f){ne(u,f,d)}),o.l&&qs({},function(d,f){ne(u,f,d)})}function qu(o,u,d){d=Math.min(o.i.length,d);const f=o.l?h(o.l.Ka,o.l,o):null;e:{var A=o.i;let K=-1;for(;;){const ge=["count="+d];K==-1?d>0?(K=A[0].g,ge.push("ofs="+K)):K=0:ge.push("ofs="+K);let te=!0;for(let Te=0;Te<d;Te++){var P=A[Te].g;const dt=A[Te].map;if(P-=K,P<0)K=Math.max(0,A[Te].g-100),te=!1;else try{P="req"+P+"_"||"";try{var O=dt instanceof Map?dt:Object.entries(dt);for(const[In,jt]of O){let qt=jt;c(jt)&&(qt=Vo(jt)),ge.push(P+In+"="+encodeURIComponent(qt))}}catch(In){throw ge.push(P+"type="+encodeURIComponent("_badmap")),In}}catch{f&&f(dt)}}if(te){O=ge.join("&");break e}}O=void 0}return o=o.i.splice(0,d),u.G=o,O}function Gu(o){if(!o.g&&!o.v){o.Y=1;var u=o.Da;st||g(),Ae||(st(),Ae=!0),w.add(u,o),o.A=0}}function Go(o){return o.g||o.v||o.A>=3?!1:(o.Y++,o.v=Rr(h(o.Da,o),Wu(o,o.A)),o.A++,!0)}n.Da=function(){if(this.v=null,Hu(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var o=4*this.T;this.j.info("BP detection timer enabled: "+o),this.B=Rr(h(this.Wa,this),o)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Le(10),Xs(this),Hu(this))};function Ho(o){o.B!=null&&(a.clearTimeout(o.B),o.B=null)}function Hu(o){o.g=new Ut(o,o.j,"rpc",o.Y),o.u===null&&(o.g.J=o.o),o.g.P=0;var u=ht(o.na);ne(u,"RID","rpc"),ne(u,"SID",o.M),ne(u,"AID",o.K),ne(u,"CI",o.F?"0":"1"),!o.F&&o.ia&&ne(u,"TO",o.ia),ne(u,"TYPE","xmlhttp"),Mr(o,u),o.u&&o.o&&jo(u,o.u,o.o),o.O&&(o.g.H=o.O);var d=o.g;o=o.ba,d.M=1,d.A=Qs(ht(u)),d.u=null,d.R=!0,Eu(d,o)}n.Va=function(){this.C!=null&&(this.C=null,Xs(this),Go(this),Le(19))};function ei(o){o.C!=null&&(a.clearTimeout(o.C),o.C=null)}function zu(o,u){var d=null;if(o.g==u){ei(o),Ho(o),o.g=null;var f=2}else if(Uo(o.h,u))d=u.G,Ru(o.h,u),f=1;else return;if(o.I!=0){if(u.o)if(f==1){d=u.u?u.u.length:0,u=Date.now()-u.F;var A=o.D;f=zs(),xe(f,new pu(f,d)),Zs(o)}else Gu(o);else if(A=u.m,A==3||A==0&&u.X>0||!(f==1&&gm(o,u)||f==2&&Go(o)))switch(d&&d.length>0&&(u=o.h,u.i=u.i.concat(d)),A){case 1:wn(o,5);break;case 4:wn(o,10);break;case 3:wn(o,6);break;default:wn(o,2)}}}function Wu(o,u){let d=o.Qa+Math.floor(Math.random()*o.Za);return o.isActive()||(d*=2),d*u}function wn(o,u){if(o.j.info("Error code "+u),u==2){var d=h(o.bb,o),f=o.Ua;const A=!f;f=new Ft(f||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||br(f,"https"),Qs(f),A?lm(f.toString(),d):hm(f.toString(),d)}else Le(2);o.I=0,o.l&&o.l.pa(u),Ku(o),$u(o)}n.bb=function(o){o?(this.j.info("Successfully pinged google.com"),Le(2)):(this.j.info("Failed to ping google.com"),Le(1))};function Ku(o){if(o.I=0,o.ja=[],o.l){const u=Pu(o.h);(u.length!=0||o.i.length!=0)&&(k(o.ja,u),k(o.ja,o.i),o.h.i.length=0,V(o.i),o.i.length=0),o.l.oa()}}function Qu(o,u,d){var f=d instanceof Ft?ht(d):new Ft(d);if(f.g!="")u&&(f.g=u+"."+f.g),Vr(f,f.u);else{var A=a.location;f=A.protocol,u=u?u+"."+A.hostname:A.hostname,A=+A.port;const P=new Ft(null);f&&br(P,f),u&&(P.g=u),A&&Vr(P,A),d&&(P.h=d),f=P}return d=o.G,u=o.wa,d&&u&&ne(f,d,u),ne(f,"VER",o.ka),Mr(o,f),f}function Yu(o,u,d){if(u&&!o.L)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Aa&&!o.ma?new ae(new $o({ab:d})):new ae(o.ma),u.Fa(o.L),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Ju(){}n=Ju.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function ti(){}ti.prototype.g=function(o,u){return new Ke(o,u)};function Ke(o,u){Ce.call(this),this.g=new Bu(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.sa&&(o?o["X-WebChannel-Client-Profile"]=u.sa:o={"X-WebChannel-Client-Profile":u.sa}),this.g.U=o,(o=u&&u.Qb)&&!_(o)&&(this.g.u=o),this.A=u&&u.supportsCrossDomainXhr||!1,this.v=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!_(u)&&(this.g.G=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Gn(this)}m(Ke,Ce),Ke.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Ke.prototype.close=function(){qo(this.g)},Ke.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var d={};d.__data__=o,o=d}else this.v&&(d={},d.__data__=Vo(o),o=d);u.i.push(new nm(u.Ya++,o)),u.I==3&&Zs(u)},Ke.prototype.N=function(){this.g.l=null,delete this.j,qo(this.g),delete this.g,Ke.Z.N.call(this)};function Xu(o){ko.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const d in u){o=d;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}m(Xu,ko);function Zu(){No.call(this),this.status=1}m(Zu,No);function Gn(o){this.g=o}m(Gn,Ju),Gn.prototype.ra=function(){xe(this.g,"a")},Gn.prototype.qa=function(o){xe(this.g,new Xu(o))},Gn.prototype.pa=function(o){xe(this.g,new Zu)},Gn.prototype.oa=function(){xe(this.g,"b")},ti.prototype.createWebChannel=ti.prototype.g,Ke.prototype.send=Ke.prototype.o,Ke.prototype.open=Ke.prototype.m,Ke.prototype.close=Ke.prototype.close,Pd=function(){return new ti},Rd=function(){return zs()},Ad=yn,ma={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Ws.NO_ERROR=0,Ws.TIMEOUT=8,Ws.HTTP_ERROR=6,_i=Ws,mu.COMPLETE="complete",vd=mu,lu.EventType=vr,vr.OPEN="a",vr.CLOSE="b",vr.ERROR="c",vr.MESSAGE="d",Ce.prototype.listen=Ce.prototype.J,jr=lu,ae.prototype.listenOnce=ae.prototype.K,ae.prototype.getLastError=ae.prototype.Ha,ae.prototype.getLastErrorCode=ae.prototype.ya,ae.prototype.getStatus=ae.prototype.ca,ae.prototype.getResponseJson=ae.prototype.La,ae.prototype.getResponseText=ae.prototype.la,ae.prototype.send=ae.prototype.ea,ae.prototype.setWithCredentials=ae.prototype.Fa,Id=ae}).apply(typeof si<"u"?si:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let mr="12.17.0";function tE(n){mr=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xn=new Rs("@firebase/firestore");function Hn(){return xn.logLevel}function D(n,...e){if(xn.logLevel<=J.DEBUG){const t=e.map(Ka);xn.debug(`Firestore (${mr}): ${n}`,...t)}}function xt(n,...e){if(xn.logLevel<=J.ERROR){const t=e.map(Ka);xn.error(`Firestore (${mr}): ${n}`,...t)}}function lt(n,...e){if(xn.logLevel<=J.WARN){const t=e.map(Ka);xn.warn(`Firestore (${mr}): ${n}`,...t)}}function Ka(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Sd(n,r,t)}function Sd(n,e,t){let r=`FIRESTORE (${mr}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw xt(r),new Error(r)}function M(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||Sd(e,s,r)}function z(n,e){return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nE(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qa{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=nE(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}}function Y(n,e){return n<e?-1:n>e?1:0}function ga(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),i=e.charAt(r);if(s!==i)return Jo(s)===Jo(i)?Y(s,i):Jo(s)?1:-1}return Y(n.length,e.length)}const rE=55296,sE=57343;function Jo(n){const e=n.charCodeAt(0);return e>=rE&&e<=sE}function rr(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(e,t){this.comparator=e,this.root=t||Re.EMPTY}insert(e,t){return new se(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Re.BLACK,null,null))}remove(e){return new se(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Re.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ii(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ii(this.root,e,this.comparator,!1)}getReverseIterator(){return new ii(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ii(this.root,e,this.comparator,!0)}}class ii{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Re{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??Re.RED,this.left=s??Re.EMPTY,this.right=i??Re.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new Re(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Re.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Re.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Re.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Re.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw U(43730,{key:this.key,value:this.value});if(this.right.isRed())throw U(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw U(27949);return e+(this.isRed()?0:1)}}Re.EMPTY=null,Re.RED=!0,Re.BLACK=!1;Re.EMPTY=new class{constructor(){this.size=0}get key(){throw U(57766)}get value(){throw U(16141)}get color(){throw U(16727)}get left(){throw U(29726)}get right(){throw U(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new Re(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(e){this.comparator=e,this.data=new se(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Cl(this.data.getIterator())}getIteratorFrom(e){return new Cl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof de)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new de(this.comparator);return t.data=e,t}}class Cl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class x extends It{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sr="__name__";class ft{constructor(e,t,r){t===void 0?t=0:t>e.length&&U(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&U(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return ft.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ft?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=ft.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return Y(e.length,t.length)}static compareSegments(e,t){const r=ft.isNumericId(e),s=ft.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?ft.extractNumericId(e).compare(ft.extractNumericId(t)):ga(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Zt.fromString(e.substring(4,e.length-2))}}class Z extends ft{construct(e,t,r){return new Z(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new x(b.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new Z(t)}static emptyPath(){return new Z([])}}const iE=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let Ze=class zn extends ft{construct(e,t,r){return new zn(e,t,r)}static isValidIdentifier(e){return iE.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),zn.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===sr}static keyField(){return new zn([sr])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new x(b.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new x(b.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[s+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new x(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=l,s+=2}else c==="`"?(a=!a,s++):c!=="."||a?(r+=c,s++):(i(),s++)}if(i(),a)throw new x(b.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new zn(t)}static emptyPath(){return new zn([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e){this.fields=e,e.sort(Ze.comparator)}static empty(){return new Je([])}unionWith(e){let t=new de(Ze.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new Je(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return rr(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ki(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function mn(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function oE(n,e){const t=[];for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function Cd(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.path=e}static fromPath(e){return new B(Z.fromString(e))}static fromName(e){return new B(Z.fromString(e).popFirst(5))}static empty(){return new B(Z.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Z.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Z.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new B(new Z(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aE(n,e,t){if(!t)throw new x(b.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function cE(n,e,t,r){if(e===!0&&r===!0)throw new x(b.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function bl(n){if(!B.isDocumentKey(n))throw new x(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Vs(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Ya(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":U(12329,{type:typeof n})}function Ln(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new x(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ya(n);throw new x(b.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function le(n,e){const t={typeString:n};return e&&(t.value=e),t}function ks(n,e){if(!Vs(n))throw new x(b.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&a!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new x(b.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vl=-62135596800,kl=1e6;class re{static now(){return re.fromMillis(Date.now())}static fromDate(e){return re.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*kl);return new re(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new x(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new x(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Vl)throw new x(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new x(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/kl}_compareTo(e){return this.seconds===e.seconds?Y(this.nanoseconds,e.nanoseconds):Y(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:re._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ks(e,re._jsonSchema))return new re(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Vl;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}re._jsonSchemaVersion="firestore/timestamp/1.0",re._jsonSchema={type:le("string",re._jsonSchemaVersion),seconds:le("number"),nanoseconds:le("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bd extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new bd("Invalid base64 string: "+i):i}})(e);return new pe(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i})(e);return new pe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Y(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}pe.EMPTY_BYTE_STRING=new pe("");const uE=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function rn(n){if(M(!!n,39018),typeof n=="string"){let e=0;const t=uE.exec(n);if(M(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ie(n.seconds),nanos:ie(n.nanos)}}function ie(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function sn(n){return typeof n=="string"?pe.fromBase64String(n):pe.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vd="server_timestamp",kd="__type__",Nd="__previous_value__",Od="__local_write_time__";function to(n){return(n?.mapValue?.fields||{})[kd]?.stringValue===Vd}function Ns(n){const e=n.mapValue.fields[Nd];return to(e)?Ns(e):e}function ir(n){const e=rn(n.mapValue.fields[Od].timestampValue);return new re(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lE{constructor(e,t,r,s,i,a,c,l,h,p,m,v,V){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=l,this.useFetchStreams=h,this.isUsingEmulator=p,this.apiKey=m,this._customHeaders=v,this.grpcFlowControlWindow=V}}const Ni="(default)";class is{constructor(e,t){this.projectId=e,this.database=t||Ni}static empty(){return new is("","")}get isDefaultDatabase(){return this.database===Ni}isEqual(e){return e instanceof is&&e.projectId===this.projectId&&e.database===this.database}}function hE(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new x(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new is(n.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ja=-1;function Os(n){return n==null}function os(n){return n===0&&1/n==-1/0}function dE(n){return typeof n=="number"&&Number.isInteger(n)&&!os(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function fE(n){return typeof n=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dd="__type__",pE="__max__",oi={mapValue:{}},xd="__vector__",as="value",or={nullValue:"NULL_VALUE"},He={booleanValue:!0},ve={booleanValue:!1};function me(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?to(n)?4:mE(n)?9007199254740991:Oi(n)?10:11:U(28295,{value:n})}function rt(n,e,t){if(n===e)return!0;const r=me(n);if(r!==me(e))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return ir(n).isEqual(ir(e));case 3:return(function(i,a){if(typeof i.timestampValue=="string"&&typeof a.timestampValue=="string"&&i.timestampValue.length===a.timestampValue.length)return i.timestampValue===a.timestampValue;const c=rn(i.timestampValue),l=rn(a.timestampValue);return c.seconds===l.seconds&&c.nanos===l.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,a){return sn(i.bytesValue).isEqual(sn(a.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,a){return ie(i.geoPointValue.latitude)===ie(a.geoPointValue.latitude)&&ie(i.geoPointValue.longitude)===ie(a.geoPointValue.longitude)})(n,e);case 2:return(function(i,a,c){if("integerValue"in i&&"integerValue"in a)return ie(i.integerValue)===ie(a.integerValue);let l,h;if("doubleValue"in i&&"doubleValue"in a)l=ie(i.doubleValue),h=ie(a.doubleValue);else{if(!c?.t)return!1;l=ie(i.integerValue??i.doubleValue),h=ie(a.integerValue??a.doubleValue)}return l===h?!!c?.i||os(l)===os(h):!!(c===void 0||c.o)&&isNaN(l)&&isNaN(h)})(n,e,t);case 9:return rr(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>rt(s,i,t)));case 10:case 11:return(function(i,a,c){const l=i.mapValue.fields||{},h=a.mapValue.fields||{};if(ki(l)!==ki(h))return!1;for(const p in l)if(l.hasOwnProperty(p)&&(h[p]===void 0||!rt(l[p],h[p],c)))return!1;return!0})(n,e,t);default:return U(52216,{left:n})}}function cs(n,e){return(n.values||[]).find((t=>rt(t,e)))!==void 0}function ze(n,e){if(n===e)return 0;const t=me(n),r=me(e);if(t!==r)return Y(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return Y(n.booleanValue,e.booleanValue);case 2:return(function(i,a){const c=ie(i.integerValue||i.doubleValue),l=ie(a.integerValue||a.doubleValue);return c<l?-1:c>l?1:c===l?0:isNaN(c)?isNaN(l)?0:-1:1})(n,e);case 3:return Nl(n.timestampValue,e.timestampValue);case 4:return Nl(ir(n),ir(e));case 5:return ga(n.stringValue,e.stringValue);case 6:return(function(i,a){const c=sn(i),l=sn(a);return c.compareTo(l)})(n.bytesValue,e.bytesValue);case 7:return(function(i,a){const c=i.split("/"),l=a.split("/");for(let h=0;h<c.length&&h<l.length;h++){const p=Y(c[h],l[h]);if(p!==0)return p}return Y(c.length,l.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,a){const c=Y(ie(i.latitude),ie(a.latitude));return c!==0?c:Y(ie(i.longitude),ie(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return Ol(n.arrayValue,e.arrayValue);case 10:return(function(i,a){const c=i.fields||{},l=a.fields||{},h=c[as]?.arrayValue,p=l[as]?.arrayValue,m=Y(h?.values?.length||0,p?.values?.length||0);return m!==0?m:Ol(h,p)})(n.mapValue,e.mapValue);case 11:return(function(i,a){if(i===oi.mapValue&&a===oi.mapValue)return 0;if(i===oi.mapValue)return 1;if(a===oi.mapValue)return-1;const c=i.fields||{},l=Object.keys(c),h=a.fields||{},p=Object.keys(h);l.sort(),p.sort();for(let m=0;m<l.length&&m<p.length;++m){const v=ga(l[m],p[m]);if(v!==0)return v;const V=ze(c[l[m]],h[p[m]]);if(V!==0)return V}return Y(l.length,p.length)})(n.mapValue,e.mapValue);default:throw U(23264,{u:t})}}function Nl(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return Y(n,e);const t=rn(n),r=rn(e),s=Y(t.seconds,r.seconds);return s!==0?s:Y(t.nanos,r.nanos)}function Ol(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=ze(t[s],r[s]);if(i!==void 0&&i!==0)return i}return Y(t.length,r.length)}function ar(n){return _a(n)}function _a(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=rn(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return sn(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return B.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=_a(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${_a(t.fields[a])}`;return s+"}"})(n.mapValue):U(61005,{value:n})}function yi(n){switch(me(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ns(n);return e?16+yi(e):16;case 5:return 2*n.stringValue.length;case 6:return sn(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+yi(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return mn(r.fields,((i,a)=>{s+=i.length+yi(a)})),s})(n.mapValue);default:throw U(13486,{value:n})}}function pt(n){return!!n&&"integerValue"in n}function Pn(n){return!!n&&"doubleValue"in n}function on(n){return pt(n)||Pn(n)}function cr(n){return!!n&&"arrayValue"in n}function Xe(n){return!!n&&"nullValue"in n}function We(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function Cn(n){return!!n&&"mapValue"in n}function Oi(n){return(n?.mapValue?.fields||{})[Dd]?.stringValue===xd}function ya(n){return(n?.mapValue?.fields||{})[as]?.arrayValue}function Kr(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return mn(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=Kr(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Kr(n.arrayValue.values[t]);return e}return{...n}}function mE(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===pE}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e){this.value=e}static empty(){return new Ne({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Cn(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Kr(t)}setAll(e){let t=Ze.emptyPath(),r={},s=[];e.forEach(((a,c)=>{if(!t.isImmediateParentOf(c)){const l=this.getFieldsMap(t);this.applyChanges(l,r,s),r={},s=[],t=c.popLast()}a?r[c.lastSegment()]=Kr(a):s.push(c.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());Cn(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return rt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Cn(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){mn(t,((s,i)=>e[s]=i));for(const s of r)delete e[s]}clone(){return new Ne(Kr(this.value))}}function Ld(n){const e=[];return mn(n.fields,((t,r)=>{const s=new Ze([t]);if(Cn(r)){const i=Ld(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)})),new Je(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function no(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:os(e)?"-0":e}}function Xa(n){return{integerValue:""+n}}function Za(n,e,t){return dE(e)?Xa(e):no(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro{constructor(){this._=void 0}}function gE(n,e,t){return n instanceof Di?(function(s,i){const a={fields:{[kd]:{stringValue:Vd},[Od]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&to(i)&&(i=Ns(i)),i&&(a.fields[Nd]=i),{mapValue:a}})(t,e):n instanceof us?Ud(n,e):n instanceof ls?Fd(n,e):n instanceof hs?(function(s,i){const a=Md(s,i),c=Mi(a)+Mi(s.l);return pt(a)&&pt(s.l)?Xa(c):no(s.serializer,c)})(n,e):n instanceof xi?(function(s,i){return Dl(s,i,Math.min)})(n,e):n instanceof Li?(function(s,i){return Dl(s,i,Math.max)})(n,e):void 0}function _E(n,e,t){return n instanceof us?Ud(n,e):n instanceof ls?Fd(n,e):t}function Md(n,e){return n instanceof hs?on(e)?e:{integerValue:0}:null}class Di extends ro{}class us extends ro{constructor(e){super(),this.elements=e}}function Ud(n,e){const t=Bd(e);for(const r of n.elements)t.some((s=>rt(s,r)))||t.push(r);return{arrayValue:{values:t}}}class ls extends ro{constructor(e){super(),this.elements=e}}function Fd(n,e){let t=Bd(e);for(const r of n.elements)t=t.filter((s=>!rt(s,r)));return{arrayValue:{values:t}}}class ec extends ro{constructor(e,t){super(),this.serializer=e,this.l=t}}class hs extends ec{}class xi extends ec{}class Li extends ec{}function Dl(n,e,t){if(!on(e))return n.l;const r=t(Mi(e),Mi(n.l));return pt(e)&&pt(n.l)?Xa(r):no(n.serializer,r)}function Mi(n){return ie(n.integerValue||n.doubleValue)}function Bd(n){return cr(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function yE(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof us&&s instanceof us||r instanceof ls&&s instanceof ls?rr(r.elements,s.elements,rt):r instanceof hs&&s instanceof hs||r instanceof xi&&s instanceof xi||r instanceof Li&&s instanceof Li?rt(r.l,s.l):r instanceof Di&&s instanceof Di})(n.transform,e.transform)}class EE{constructor(e,t){this.version=e,this.transformResults=t}}class Me{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Me}static exists(e){return new Me(void 0,e)}static updateTime(e){return new Me(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Ei(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class so{}function $d(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new io(n.key,Me.none()):new Ds(n.key,n.data,Me.none());{const t=n.data,r=Ne.empty();let s=new de(Ze.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new gn(n.key,r,new Je(s.toArray()),Me.none())}}function TE(n,e,t){n instanceof Ds?(function(s,i,a){const c=s.value.clone(),l=Ll(s.fieldTransforms,i,a.transformResults);c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()})(n,e,t):n instanceof gn?(function(s,i,a){if(!Ei(s.precondition,i))return void i.convertToUnknownDocument(a.version);const c=Ll(s.fieldTransforms,i,a.transformResults),l=i.data;l.setAll(jd(s)),l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):(function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function Qr(n,e,t,r){return n instanceof Ds?(function(i,a,c,l){if(!Ei(i.precondition,a))return c;const h=i.value.clone(),p=Ml(i.fieldTransforms,l,a);return h.setAll(p),a.convertToFoundDocument(a.version,h).setHasLocalMutations(),null})(n,e,t,r):n instanceof gn?(function(i,a,c,l){if(!Ei(i.precondition,a))return c;const h=Ml(i.fieldTransforms,l,a),p=a.data;return p.setAll(jd(i)),p.setAll(h),a.convertToFoundDocument(a.version,p).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((m=>m.field)))})(n,e,t,r):(function(i,a,c){return Ei(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c})(n,e,t)}function wE(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=Md(r.transform,s||null);i!=null&&(t===null&&(t=Ne.empty()),t.set(r.field,i))}return t||null}function xl(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&rr(r,s,((i,a)=>yE(i,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Ds extends so{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class gn extends so{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function jd(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function Ll(n,e,t){const r=new Map;M(n.length===t.length,32656,{h:t.length,T:n.length});for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,c=e.data.field(i.field);r.set(i.field,_E(a,c,t[s]))}return r}function Ml(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,gE(i,a,e))}return r}class io extends so{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class qd extends so{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ui{constructor(e,t){this.position=e,this.inclusive=t}}function Ul(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=B.comparator(B.fromName(a.referenceValue),t.key):r=ze(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Fl(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!rt(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd{}class ye extends Gd{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new vE(e,t,r):t==="array-contains"?new PE(e,r):t==="in"?new SE(e,r):t==="not-in"?new CE(e,r):t==="array-contains-any"?new bE(e,r):new ye(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new AE(e,r):new RE(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(ze(t,this.value)):t!==null&&me(this.value)===me(t)&&this.matchesComparison(ze(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return U(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Et extends Gd{constructor(e,t){super(),this.filters=e,this.op=t,this.P=null}static create(e,t){return new Et(e,t)}matches(e){return Hd(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.P!==null||(this.P=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.P}getFilters(){return Object.assign([],this.filters)}}function Hd(n){return n.op==="and"}function zd(n){return IE(n)&&Hd(n)}function IE(n){for(const e of n.filters)if(e instanceof Et)return!1;return!0}function Ea(n){if(n instanceof ye)return n.field.canonicalString()+n.op.toString()+ar(n.value);if(zd(n))return n.filters.map((e=>Ea(e))).join(",");{const e=n.filters.map((t=>Ea(t))).join(",");return`${n.op}(${e})`}}function Wd(n,e){return n instanceof ye?(function(r,s){return s instanceof ye&&r.op===s.op&&r.field.isEqual(s.field)&&rt(r.value,s.value)})(n,e):n instanceof Et?(function(r,s){return s instanceof Et&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,a,c)=>i&&Wd(a,s.filters[c])),!0):!1})(n,e):void U(19439)}function Kd(n){return n instanceof ye?(function(t){return`${t.field.canonicalString()} ${t.op} ${ar(t.value)}`})(n):n instanceof Et?(function(t){return t.op.toString()+" {"+t.getFilters().map(Kd).join(" ,")+"}"})(n):"Filter"}class vE extends ye{constructor(e,t,r){super(e,t,r),this.key=B.fromName(r.referenceValue)}matches(e){const t=B.comparator(e.key,this.key);return this.matchesComparison(t)}}class AE extends ye{constructor(e,t){super(e,"in",t),this.keys=Qd("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class RE extends ye{constructor(e,t){super(e,"not-in",t),this.keys=Qd("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Qd(n,e){return(e.arrayValue?.values||[]).map((t=>B.fromName(t.referenceValue)))}class PE extends ye{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return cr(t)&&cs(t.arrayValue,this.value)}}class SE extends ye{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&cs(this.value.arrayValue,t)}}class CE extends ye{constructor(e,t){super(e,"not-in",t)}matches(e){if(cs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!cs(this.value.arrayValue,t)}}class bE extends ye{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!cr(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>cs(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fi{constructor(e,t="asc"){this.field=e,this.dir=t}}function VE(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{static fromTimestamp(e){return new j(e)}static min(){return new j(new re(0,0))}static max(){return new j(new re(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e,t,r,s,i,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=c}static newInvalidDocument(e){return new Ie(e,0,j.min(),j.min(),j.min(),Ne.empty(),0)}static newFoundDocument(e,t,r,s){return new Ie(e,1,t,j.min(),r,s,0)}static newNoDocument(e,t){return new Ie(e,2,t,j.min(),j.min(),Ne.empty(),0)}static newUnknownDocument(e,t){return new Ie(e,3,t,j.min(),j.min(),Ne.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(j.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ne.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ne.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=j.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ie&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ie(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ds=-1;function kE(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=j.fromTimestamp(r===1e9?new re(t+1,0):new re(t,r));return new an(s,B.empty(),e)}function NE(n){return new an(n.readTime,n.key,ds)}class an{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new an(j.min(),B.empty(),ds)}static max(){return new an(j.max(),B.empty(),ds)}}function OE(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=B.comparator(n.documentKey,e.documentKey),t!==0?t:Y(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DE{constructor(e,t=null,r=[],s=[],i=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=c,this.R=null}}function Bl(n,e=null,t=[],r=[],s=null,i=null,a=null){return new DE(n,e,t,r,s,i,a)}function Yd(n){const e=z(n);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>Ea(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),Os(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>ar(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>ar(r))).join(",")),e.R=t}return e.R}function Jd(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!VE(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Wd(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Fl(n.startAt,e.startAt)&&Fl(n.endAt,e.endAt)}function An(n){return!!n.isCorePipeline}function Xd(n){return!!n.path&&B.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(e,t=null,r=[],s=[],i=null,a="F",c=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=c,this.endAt=l,this.I=null,this.A=null,this.V=null,this.startAt,this.endAt}}function xE(n,e,t,r,s,i,a,c){return new oo(n,e,t,r,s,i,a,c)}function tc(n){return new oo(n)}function $l(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function LE(n){return B.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function ME(n){return n.collectionGroup!==null}function Yr(n){const e=z(n);if(e.I===null){e.I=[];const t=new Set;for(const i of e.explicitOrderBy)e.I.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new de(Ze.comparator);return a.filters.forEach((l=>{l.getFlattenedFilters().forEach((h=>{h.isInequality()&&(c=c.add(h.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.I.push(new Fi(i,r))})),t.has(Ze.keyField().canonicalString())||e.I.push(new Fi(Ze.keyField(),r))}return e.I}function gt(n){const e=z(n);return e.A||(e.A=UE(e,Yr(n))),e.A}function UE(n,e){if(n.limitType==="F")return Bl(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new Fi(s.field,i)}));const t=n.endAt?new Ui(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Ui(n.startAt.position,n.startAt.inclusive):null;return Bl(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Ta(n,e,t){return new oo(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function FE(n,e){return Jd(gt(n),gt(e))&&n.limitType===e.limitType}function Jr(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>Kd(s))).join(", ")}]`),Os(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>ar(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>ar(s))).join(",")),`Target(${r})`})(gt(n))}; limitType=${n.limitType})`}function ao(n,e){return e.isFoundDocument()&&(function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):B.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(const i of Yr(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(a,c,l){const h=Ul(a,c,l);return a.inclusive?h<=0:h<0})(r.startAt,Yr(r),s)||r.endAt&&!(function(a,c,l){const h=Ul(a,c,l);return a.inclusive?h>=0:h>0})(r.endAt,Yr(r),s))})(n,e)}function nc(n){return(e,t)=>{let r=!1;for(const s of Yr(n)){const i=BE(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function BE(n,e,t){const r=n.field.isKeyField()?B.comparator(e.key,t.key):(function(i,a,c){const l=a.data.field(i),h=c.data.field(i);return l!==null&&h!==null?ze(l,h):U(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return U(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $E{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ue,X;function Zd(n){switch(n){case b.OK:return U(64938);case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0;default:return U(15467,{code:n})}}function ef(n){if(n===void 0)return xt("GRPC error has no .code"),b.UNKNOWN;switch(n){case ue.OK:return b.OK;case ue.CANCELLED:return b.CANCELLED;case ue.UNKNOWN:return b.UNKNOWN;case ue.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case ue.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case ue.INTERNAL:return b.INTERNAL;case ue.UNAVAILABLE:return b.UNAVAILABLE;case ue.UNAUTHENTICATED:return b.UNAUTHENTICATED;case ue.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case ue.NOT_FOUND:return b.NOT_FOUND;case ue.ALREADY_EXISTS:return b.ALREADY_EXISTS;case ue.PERMISSION_DENIED:return b.PERMISSION_DENIED;case ue.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case ue.ABORTED:return b.ABORTED;case ue.OUT_OF_RANGE:return b.OUT_OF_RANGE;case ue.UNIMPLEMENTED:return b.UNIMPLEMENTED;case ue.DATA_LOSS:return b.DATA_LOSS;default:return U(39323,{code:n})}}(X=ue||(ue={}))[X.OK=0]="OK",X[X.CANCELLED=1]="CANCELLED",X[X.UNKNOWN=2]="UNKNOWN",X[X.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",X[X.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",X[X.NOT_FOUND=5]="NOT_FOUND",X[X.ALREADY_EXISTS=6]="ALREADY_EXISTS",X[X.PERMISSION_DENIED=7]="PERMISSION_DENIED",X[X.UNAUTHENTICATED=16]="UNAUTHENTICATED",X[X.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",X[X.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",X[X.ABORTED=10]="ABORTED",X[X.OUT_OF_RANGE=11]="OUT_OF_RANGE",X[X.UNIMPLEMENTED=12]="UNIMPLEMENTED",X[X.INTERNAL=13]="INTERNAL",X[X.UNAVAILABLE=14]="UNAVAILABLE",X[X.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){mn(this.inner,((t,r)=>{for(const[s,i]of r)e(s,i)}))}isEmpty(){return Cd(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jE=new se(B.comparator);function qe(){return jE}const tf=new se(B.comparator);function Wn(...n){let e=tf;for(const t of n)e=e.insert(t.key,t);return e}function nf(n){let e=tf;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Jt(){return Xr()}function rf(){return Xr()}function Xr(){return new Fn((n=>n.toString()),((n,e)=>n.isEqual(e)))}const qE=new se(B.comparator),GE=new de(B.comparator);function Q(...n){let e=GE;for(const t of n)e=e.add(t);return e}const HE=new de(Y);function zE(){return HE}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WE(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KE=new Zt([4294967295,4294967295],0);function jl(n){const e=WE().encode(n),t=new wd;return t.update(e),new Uint8Array(t.digest())}function ql(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Zt([t,r],0),new Zt([s,i],0)]}class rc{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new qr(`Invalid padding: ${t}`);if(r<0)throw new qr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new qr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new qr(`Invalid padding when bitmap length is 0: ${t}`);this.m=8*e.length-t,this.p=Zt.fromNumber(this.m)}v(e,t,r){let s=e.add(t.multiply(Zt.fromNumber(r)));return s.compare(KE)===1&&(s=new Zt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.p).toNumber()}S(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.m===0)return!1;const t=jl(e),[r,s]=ql(t);for(let i=0;i<this.hashCount;i++){const a=this.v(r,s,i);if(!this.S(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new rc(i,s,t);return r.forEach((c=>a.insert(c))),a}insert(e){if(this.m===0)return;const t=jl(e),[r,s]=ql(t);for(let i=0;i<this.hashCount;i++){const a=this.v(r,s,i);this.D(a)}}D(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class qr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xs{constructor(e,t,r,s,i,a){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=a}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,Ls.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new xs(j.min(),s,new se(Y),qe(),qe(),Q())}}class Ls{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Ls(r,t,Q(),Q(),Q())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ti{constructor(e,t,r,s){this.C=e,this.removedTargetIds=t,this.key=r,this.F=s}}class sf{constructor(e,t){this.targetId=e,this.O=t}}class of{constructor(e,t,r=pe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Gl{constructor(e){this.targetId=e,this.M=0,this.N=Hl(),this.L=pe.EMPTY_BYTE_STRING,this.B=!1,this.U=!0}get current(){return this.B}get resumeToken(){return this.L}get k(){return this.M!==0}get q(){return this.U}$(e){e.approximateByteSize()>0&&(this.U=!0,this.L=e)}K(){let e=Q(),t=Q(),r=Q();return this.N.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:U(38017,{changeType:i})}})),new Ls(this.L,this.B,e,t,r)}W(){this.U=!1,this.N=Hl()}G(e,t){this.U=!0,this.N=this.N.insert(e,t)}j(e){this.U=!0,this.N=this.N.remove(e)}H(){this.M+=1}J(){this.M-=1,M(this.M>=0,3241,{M:this.M,targetId:this.targetId})}Y(){this.U=!0,this.B=!0}}const Ur="WatchChangeAggregator";class QE{constructor(e){this.Z=e,this.X=new Map,this.ee=qe(),this.te=ai(),this.ne=qe(),this.re=ai(),this.ie=new se(Y)}se(e){for(const t of e.C)e.F&&e.F.isFoundDocument()?this._e(t,e.F):this.oe(t,e.key,e.F);for(const t of e.removedTargetIds)this.oe(t,e.key,e.F)}ae(e){this.forEachTarget(e,(t=>{const r=this.X.get(t);if(r)switch(e.state){case 0:this.ue(t)&&r.$(e.resumeToken);break;case 1:r.J(),r.k||r.W(),r.$(e.resumeToken);break;case 2:r.J(),r.k||this.removeTarget(t);break;case 3:this.ue(t)&&(r.Y(),r.$(e.resumeToken));break;case 4:this.ue(t)&&(this.ce(t),r.$(e.resumeToken));break;default:U(56790,{state:e.state})}else D(Ur,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.X.forEach(((r,s)=>{this.ue(s)&&t(s)}))}le(e){return An(e)?e.getPipelineSourceType()==="documents"&&e.getPipelineDocuments()?.length===1:Xd(e)}Ee(e){const t=e.targetId,r=e.O.count,s=this.he(t);if(s){const i=s.target;if(this.le(i))if(r===0){const a=new B(An(i)?Z.fromString(i.getPipelineDocuments()[0]):i.path);this.oe(t,a,Ie.newNoDocument(a,j.min()))}else M(r===1,20013,"Single document existence filter with count: "+r);else{const a=this.Te(t);if(a!==r){const c=this.Pe(e),l=c?this.Re(c,e,a):1;if(l!==0){this.ce(t);const h=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.ie=this.ie.insert(t,h)}}}}}Pe(e){const t=e.O.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,c;try{a=sn(r).toUint8Array()}catch(l){if(l instanceof bd)return lt("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{c=new rc(a,s,i)}catch(l){return lt(l instanceof qr?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return c.m===0?null:c}Re(e,t,r){return t.O.count===r-this.Ve(e,t.targetId)?0:2}Ve(e,t){const r=this.Z.getRemoteKeysForTarget(t);let s=0;return r.forEach((i=>{const a=this.Z.Ae(),c=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.oe(t,i,null),s++)})),s}de(e){const t=new Map;this.X.forEach(((i,a)=>{const c=this.he(a);if(c){if(i.current&&this.le(c.target)){const l=An(c.target)?Z.fromString(c.target.getPipelineDocuments()[0]):c.target.path,h=new B(l);this.fe(h).has(a)||this.me(a,h)||this.oe(a,h,Ie.newNoDocument(h,e))}i.q&&(t.set(a,i.K()),i.W())}}));let r=Q();this.re.forEach(((i,a)=>{let c=!0;a.forEachWhile((l=>{const h=this.he(l);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(i))})),this.ee.forEach(((i,a)=>a.setReadTime(e))),this.ne.forEach(((i,a)=>a.setReadTime(e)));const s=new xs(e,t,this.ie,this.ee,this.ne,r);return this.ee=qe(),this.te=ai(),this.ne=qe(),this.re=ai(),this.ie=new se(Y),s}_e(e,t){const r=this.X.get(e);if(!r||!this.ue(e))return void D(Ur,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.me(e,t.key)?2:0;r.G(t.key,s),An(this.he(e).target)&&this.he(e).target.getPipelineFlavor()!=="exact"?this.ne=this.ne.insert(t.key,t):this.ee=this.ee.insert(t.key,t),this.te=this.te.insert(t.key,this.fe(t.key).add(e)),this.re=this.re.insert(t.key,this.pe(t.key).add(e))}oe(e,t,r){const s=this.X.get(e);s&&this.ue(e)?(this.me(e,t)?s.G(t,1):s.j(t),this.re=this.re.insert(t,this.pe(t).delete(e)),this.re=this.re.insert(t,this.pe(t).add(e)),r&&(An(this.he(e).target)&&this.he(e).target.getPipelineFlavor()!=="exact"?this.ne=this.ne.insert(t,r):this.ee=this.ee.insert(t,r))):D(Ur,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.X.delete(e)}Te(e){const t=this.X.get(e);if(!t)return 0;const r=t.K();return this.Z.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}H(e){let t=this.X.get(e);t||(D(Ur,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Gl(e),this.X.set(e,t)),t.H()}pe(e){let t=this.re.get(e);return t||(t=new de(Y),this.re=this.re.insert(e,t)),t}fe(e){let t=this.te.get(e);return t||(t=new de(Y),this.te=this.te.insert(e,t)),t}ue(e){const t=this.he(e)!==null;return t||D(Ur,"Detected inactive target",e),t}he(e){const t=this.X.get(e);return t===void 0||t.k?null:this.Z.ge(e)}ce(e){this.X.set(e,new Gl(e)),this.Z.getRemoteKeysForTarget(e).forEach((t=>{this.oe(e,t,null)}))}me(e,t){return this.Z.getRemoteKeysForTarget(e).has(t)}}function ai(){return new se(B.comparator)}function Hl(){return new se(B.comparator)}const YE={asc:"ASCENDING",desc:"DESCENDING"},JE={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},XE={and:"AND",or:"OR"};class ZE{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function wa(n,e){return n.useProto3Json||Os(e)?e:{value:e}}function Bi(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function sc(n){const e=rn(n);return new re(e.seconds,e.nanos)}function af(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function wi(n,e){return Bi(n,e.toTimestamp())}function et(n){return M(!!n,49232),j.fromTimestamp(sc(n))}function ic(n,e){return Ia(n,e).canonicalString()}function Ia(n,e){const t=(function(s){return new Z(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function cf(n){const e=Z.fromString(n);return M(pf(e),10190,{key:e.toString()}),e}function fs(n,e){return ic(n.databaseId,e.path)}function Zr(n,e){const t=cf(e);if(t.get(1)!==n.databaseId.projectId)throw new x(b.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new x(b.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new B(lf(t))}function uf(n,e){return ic(n.databaseId,e)}function eT(n){const e=cf(n);return e.length===4?Z.emptyPath():lf(e)}function va(n){return new Z(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function lf(n){return M(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function zl(n,e,t){return{name:fs(n,e),fields:t.value.mapValue.fields}}function tT(n,e){return"found"in e?(function(r,s){M(!!s.found,43571),s.found.name,s.found.updateTime;const i=Zr(r,s.found.name),a=et(s.found.updateTime),c=s.found.createTime?et(s.found.createTime):j.min(),l=new Ne({mapValue:{fields:s.found.fields}});return Ie.newFoundDocument(i,a,c,l)})(n,e):"missing"in e?(function(r,s){M(!!s.missing,3894),M(!!s.readTime,22933);const i=Zr(r,s.missing),a=et(s.readTime);return Ie.newNoDocument(i,a)})(n,e):U(7234,{result:e})}function nT(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:U(39313,{state:h})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(h,p){return h.useProto3Json?(M(p===void 0||typeof p=="string",58123),pe.fromBase64String(p||"")):(M(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),pe.fromUint8Array(p||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&(function(h){const p=h.code===void 0?b.UNKNOWN:ef(h.code);return new x(p,h.message||"")})(a);t=new of(r,s,i,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Zr(n,r.document.name),i=et(r.document.updateTime),a=r.document.createTime?et(r.document.createTime):j.min(),c=new Ne({mapValue:{fields:r.document.fields}}),l=Ie.newFoundDocument(s,i,a,c),h=r.targetIds||[],p=r.removedTargetIds||[];t=new Ti(h,p,l.key,l)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Zr(n,r.document),i=r.readTime?et(r.readTime):j.min(),a=Ie.newNoDocument(s,i),c=r.removedTargetIds||[];t=new Ti([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Zr(n,r.document),i=r.removedTargetIds||[];t=new Ti([],i,s,null)}else{if(!("filter"in e))return U(11601,{ye:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new $E(s,i),c=r.targetId;t=new sf(c,a)}}return t}function hf(n,e){let t;if(e instanceof Ds)t={update:zl(n,e.key,e.value)};else if(e instanceof io)t={delete:fs(n,e.key)};else if(e instanceof gn)t={update:zl(n,e.key,e.data),updateMask:dT(e.fieldMask)};else{if(!(e instanceof qd))return U(16599,{we:e.type});t={verify:fs(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,a){const c=a.transform;if(c instanceof Di)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof us)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof ls)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof hs)return{fieldPath:a.field.canonicalString(),increment:c.l};if(c instanceof xi)return{fieldPath:a.field.canonicalString(),minimum:c.l};if(c instanceof Li)return{fieldPath:a.field.canonicalString(),maximum:c.l};throw U(20930,{transform:a.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:wi(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:U(27497)})(n,e.precondition)),t}function rT(n,e){return n&&n.length>0?(M(e!==void 0,14353),n.map((t=>(function(s,i){let a=s.updateTime?et(s.updateTime):et(i);return a.isEqual(j.min())&&(a=et(i)),new EE(a,s.transformResults||[])})(t,e)))):[]}function sT(n,e){return{documents:[uf(n,e.path)]}}function iT(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=uf(n,s);const i=(function(h){if(h.length!==0)return ff(Et.create(h,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const a=(function(h){if(h.length!==0)return h.map((p=>(function(v){return{field:Kn(v.field),direction:uT(v.dir)}})(p)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=wa(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{be:t,parent:s}}function oT(n){let e=eT(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){M(r===1,65062);const p=t.from[0];p.allDescendants?s=p.collectionId:e=e.child(p.collectionId)}let i=[];t.where&&(i=(function(m){const v=df(m);return v instanceof Et&&zd(v)?v.getFilters():[v]})(t.where));let a=[];t.orderBy&&(a=(function(m){return m.map((v=>(function(k){return new Fi(Qn(k.field),(function(L){switch(L){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(k.direction))})(v)))})(t.orderBy));let c=null;t.limit&&(c=(function(m){let v;return v=typeof m=="object"?m.value:m,Os(v)?null:v})(t.limit));let l=null;t.startAt&&(l=(function(m){const v=!!m.before,V=m.values||[];return new Ui(V,v)})(t.startAt));let h=null;return t.endAt&&(h=(function(m){const v=!m.before,V=m.values||[];return new Ui(V,v)})(t.endAt)),xE(e,s,a,i,c,"F",l,h)}function aT(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return U(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function cT(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function df(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Qn(t.unaryFilter.field);return ye.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Qn(t.unaryFilter.field);return ye.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Qn(t.unaryFilter.field);return ye.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Qn(t.unaryFilter.field);return ye.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return U(61313);default:return U(60726)}})(n):n.fieldFilter!==void 0?(function(t){return ye.create(Qn(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return U(58110);default:return U(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Et.create(t.compositeFilter.filters.map((r=>df(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return U(1026)}})(t.compositeFilter.op))})(n):U(30097,{filter:n})}function uT(n){return YE[n]}function lT(n){return JE[n]}function hT(n){return XE[n]}function Kn(n){return{fieldPath:n.canonicalString()}}function Qn(n){return Ze.fromServerFormat(n.fieldPath)}function ff(n){return n instanceof ye?(function(t){if(t.op==="=="){if(We(t.value))return{unaryFilter:{field:Kn(t.field),op:"IS_NAN"}};if(Xe(t.value))return{unaryFilter:{field:Kn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(We(t.value))return{unaryFilter:{field:Kn(t.field),op:"IS_NOT_NAN"}};if(Xe(t.value))return{unaryFilter:{field:Kn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Kn(t.field),op:lT(t.op),value:t.value}}})(n):n instanceof Et?(function(t){const r=t.getFilters().map((s=>ff(s)));return r.length===1?r[0]:{compositeFilter:{op:hT(t.op),filters:r}}})(n):U(54877,{filter:n})}function dT(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function pf(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function mf(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function ps(n,e){const t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function gf(n){return{stringValue:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function co(n){return new ZE(n,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ye(pe.fromBase64String(e))}catch(t){throw new x(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ye(pe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ye._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ks(e,Ye._jsonSchema))return Ye.fromBase64String(e.bytes)}}Ye._jsonSchemaVersion="firestore/bytes/1.0",Ye._jsonSchema={type:le("string",Ye._jsonSchemaVersion),bytes:le("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new x(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ze(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function fT(){return new uo(sr)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oc{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new x(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new x(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Y(this._lat,e._lat)||Y(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:_t._jsonSchemaVersion}}static fromJSON(e){if(ks(e,_t._jsonSchema))return new _t(e.latitude,e.longitude)}}_t._jsonSchemaVersion="firestore/geoPoint/1.0",_t._jsonSchema={type:le("string",_t._jsonSchemaVersion),latitude:le("number"),longitude:le("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ke.UNAUTHENTICATED=new ke(null),ke.GOOGLE_CREDENTIALS=new ke("google-credentials-uid"),ke.FIRST_PARTY=new ke("first-party-uid"),ke.MOCK_USER=new ke("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _f{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class pT{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(ke.UNAUTHENTICATED)))}shutdown(){}}class mT{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class gT{constructor(e){this.Se=e,this.currentUser=ke.UNAUTHENTICATED,this.De=0,this.forceRefresh=!1,this.auth=null}start(e,t){M(this.xe===void 0,42304);let r=this.De;const s=l=>this.De!==r?(r=this.De,t(l)):Promise.resolve();let i=new Vt;this.xe=()=>{this.De++,this.currentUser=this.Ce(),i.resolve(),i=new Vt,e.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const l=i;e.enqueueRetryable((async()=>{await l.promise,await s(this.currentUser)}))},c=l=>{D("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.xe&&(this.auth.addAuthTokenListener(this.xe),a())};this.Se.onInit((l=>c(l))),setTimeout((()=>{if(!this.auth){const l=this.Se.getImmediate({optional:!0});l?c(l):(D("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Vt)}}),0),a()}getToken(){const e=this.De,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.De!==e?(D("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(M(typeof r.accessToken=="string",31837,{Fe:r}),new _f(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.xe&&this.auth.removeAuthTokenListener(this.xe),this.xe=void 0}Ce(){const e=this.auth&&this.auth.getUid();return M(e===null||typeof e=="string",2055,{Oe:e}),new ke(e)}}class _T{constructor(e,t,r){this.Me=e,this.Ne=t,this.Le=r,this.type="FirstParty",this.user=ke.FIRST_PARTY,this.Be=new Map}Ue(){return this.Le?this.Le():null}get headers(){this.Be.set("X-Goog-AuthUser",this.Me);const e=this.Ue();return e&&this.Be.set("Authorization",e),this.Ne&&this.Be.set("X-Goog-Iam-Authorization-Token",this.Ne),this.Be}}class yT{constructor(e,t,r){this.Me=e,this.Ne=t,this.Le=r}getToken(){return Promise.resolve(new _T(this.Me,this.Ne,this.Le))}start(e,t){e.enqueueRetryable((()=>t(ke.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Wl{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ET{constructor(e,t){this.ke=t,this.forceRefresh=!1,this.appCheck=null,this.qe=null,this.$e=null,je(e)&&e.settings.appCheckToken&&(this.$e=e.settings.appCheckToken)}start(e,t){M(this.xe===void 0,3512);const r=i=>{i.error!=null&&D("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.qe;return this.qe=i.token,D("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.xe=i=>{e.enqueueRetryable((()=>r(i)))};const s=i=>{D("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.xe&&this.appCheck.addTokenListener(this.xe)};this.ke.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.ke.getImmediate({optional:!0});i?s(i):D("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.$e)return Promise.resolve(new Wl(this.$e));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(M(typeof t.token=="string",44558,{tokenResult:t}),this.qe=t.token,new Wl(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.xe&&this.appCheck.removeTokenListener(this.xe),this.xe=void 0}}function yf(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TT{Ke(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl="ConnectivityMonitor";class Ql{constructor(){this.We=()=>this.Qe(),this.Ge=()=>this.ze(),this.je=[],this.He()}Ke(e){this.je.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.Ge)}He(){window.addEventListener("online",this.We),window.addEventListener("offline",this.Ge)}Qe(){D(Kl,"Network connectivity changed: AVAILABLE");for(const e of this.je)e(0)}ze(){D(Kl,"Network connectivity changed: UNAVAILABLE");for(const e of this.je)e(1)}static Je(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ci=null;function Aa(){return ci===null?ci=(function(){return 268435456+Math.round(2147483648*Math.random())})():ci++,"0x"+ci.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xo="RestConnection",wT={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class IT{get Ye(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Ze=t+"://"+e.host,this.Xe=`projects/${r}/databases/${s}`,this.et=this.databaseId.database===Ni?`project_id=${r}`:`project_id=${r}&database_id=${s}`}tt(e,t,r,s,i){const a=Aa(),c=this.nt(e,t.toUriEncodedString());D(Xo,`Sending RPC '${e}' ${a}:`,c,r);const l={"google-cloud-resource-prefix":this.Xe,"x-goog-request-params":this.et};this.rt(l,s,i);const{host:h}=new URL(c),p=As(h);return this.it(e,c,l,r,p).then((m=>(D(Xo,`Received RPC '${e}' ${a}: `,m),m)),(m=>{throw lt(Xo,`RPC '${e}' ${a} failed with error: `,m,"url: ",c,"request:",r),m}))}st(e,t,r,s,i,a){return this.tt(e,t,r,s,i)}rt(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+mr})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}nt(e,t){const r=wT[e];let s=`${this.Ze}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vT{constructor(e){this._t=e._t,this.ot=e.ot}ut(e){this.ct=e}lt(e){this.Et=e}ht(e){this.Tt=e}onMessage(e){this.Pt=e}close(){this.ot()}send(e){this._t(e)}Rt(){this.ct()}It(){this.Et()}At(e){this.Tt(e)}Vt(e){this.Pt(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const be="WebChannelConnection",Fr=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))};class tr extends IT{constructor(e){super(e),this.dt=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static ft(){if(!tr.gt){const e=Rd();Fr(e,Ad.STAT_EVENT,(t=>{t.stat===ma.PROXY?D(be,"STAT_EVENT: detected buffering proxy"):t.stat===ma.NOPROXY&&D(be,"STAT_EVENT: detected no buffering proxy")})),tr.gt=!0}}it(e,t,r,s,i){const a=Aa();return new Promise(((c,l)=>{const h=new Id;h.setWithCredentials(!0),h.listenOnce(vd.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case _i.NO_ERROR:const m=h.getResponseJson();D(be,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(m)),c(m);break;case _i.TIMEOUT:D(be,`RPC '${e}' ${a} timed out`),l(new x(b.DEADLINE_EXCEEDED,"Request time out"));break;case _i.HTTP_ERROR:const v=h.getStatus();if(D(be,`RPC '${e}' ${a} failed with status:`,v,"response text:",h.getResponseText()),v>0){let V=h.getResponseJson();Array.isArray(V)&&(V=V[0]);const k=V?.error;if(k&&k.status&&k.message){const F=(function(W){const ee=W.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf(ee)>=0?ee:b.UNKNOWN})(k.status);l(new x(F,k.message))}else l(new x(b.UNKNOWN,"Server responded with status "+h.getStatus()))}else l(new x(b.UNAVAILABLE,"Connection failed."));break;default:U(9055,{yt:e,streamId:a,wt:h.getLastErrorCode(),bt:h.getLastError()})}}finally{D(be,`RPC '${e}' ${a} completed.`)}}));const p=JSON.stringify(s);D(be,`RPC '${e}' ${a} sending request:`,s),h.send(t,"POST",p,r,15)}))}vt(e,t,r){const s=Aa(),i=[this.Ze,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},l=this.longPollingOptions.timeoutSeconds;l!==void 0&&(c.longPollingTimeout=Math.round(1e3*l)),this.useFetchStreams&&(c.useFetchStreams=!0),this.rt(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;const h=i.join("");D(be,`Creating RPC '${e}' stream ${s}: ${h}`,c);const p=a.createWebChannel(h,c);this.St(p);let m=!1,v=!1;const V=new vT({_t:k=>{v?D(be,`Not sending because RPC '${e}' stream ${s} is closed:`,k):(m||(D(be,`Opening RPC '${e}' stream ${s} transport.`),p.open(),m=!0),D(be,`RPC '${e}' stream ${s} sending:`,k),p.send(k))},ot:()=>p.close()});return Fr(p,jr.EventType.OPEN,(()=>{v||(D(be,`RPC '${e}' stream ${s} transport opened.`),V.Rt())})),Fr(p,jr.EventType.CLOSE,(()=>{v||(v=!0,D(be,`RPC '${e}' stream ${s} transport closed`),V.At(),this.Dt(p))})),Fr(p,jr.EventType.ERROR,(k=>{v||(v=!0,lt(be,`RPC '${e}' stream ${s} transport errored. Name:`,k.name,"Message:",k.message),V.At(new x(b.UNAVAILABLE,"The operation could not be completed")))})),Fr(p,jr.EventType.MESSAGE,(k=>{if(!v){const F=k.data[0];M(!!F,16349);const L=F,W=L?.error||L[0]?.error;if(W){D(be,`RPC '${e}' stream ${s} received error:`,W);const ee=W.status;let oe=(function(Ae){const w=ue[Ae];if(w!==void 0)return ef(w)})(ee),Ue=W.message;ee==="NOT_FOUND"&&Ue.includes("database")&&Ue.includes("does not exist")&&Ue.includes(this.databaseId.database)&&lt(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),oe===void 0&&(oe=b.INTERNAL,Ue="Unknown error status: "+ee+" with message "+W.message),v=!0,V.At(new x(oe,Ue)),p.close()}else D(be,`RPC '${e}' stream ${s} received:`,F),V.Vt(F)}})),tr.ft(),setTimeout((()=>{V.It()}),0),V}terminate(){this.dt.forEach((e=>e.close())),this.dt=[]}St(e){this.dt.push(e)}Dt(e){this.dt=this.dt.filter((t=>t===e))}rt(e,t,r){super.rt(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Pd()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AT(n){return new tr(n)}tr.gt=!1;class ac{constructor(e,t,r=1e3,s=1.5,i=6e4){this.xt=e,this.timerId=t,this.Ct=r,this.Ft=s,this.Ot=i,this.Mt=0,this.Nt=null,this.Lt=Date.now(),this.reset()}reset(){this.Mt=0}Bt(){this.Mt=this.Ot}Ut(e){this.cancel();const t=Math.floor(this.Mt+this.kt()),r=Math.max(0,Date.now()-this.Lt),s=Math.max(0,t-r);s>0&&D("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Mt} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Nt=this.xt.enqueueAfterDelay(this.timerId,s,(()=>(this.Lt=Date.now(),e()))),this.Mt*=this.Ft,this.Mt<this.Ct&&(this.Mt=this.Ct),this.Mt>this.Ot&&(this.Mt=this.Ot)}qt(){this.Nt!==null&&(this.Nt.skipDelay(),this.Nt=null)}cancel(){this.Nt!==null&&(this.Nt.cancel(),this.Nt=null)}kt(){return(Math.random()-.5)*this.Mt}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yl="PersistentStream";class Ef{constructor(e,t,r,s,i,a,c,l){this.xt=e,this.$t=r,this.Kt=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=l,this.state=0,this.Wt=0,this.Qt=null,this.Gt=null,this.stream=null,this.zt=0,this.jt=new ac(e,t)}Ht(){return this.state===1||this.state===5||this.Jt()}Jt(){return this.state===2||this.state===3}start(){this.zt=0,this.state!==4?this.auth():this.Yt()}async stop(){this.Ht()&&await this.close(0)}Zt(){this.state=0,this.jt.reset()}Xt(){this.Jt()&&this.Qt===null&&(this.Qt=this.xt.enqueueAfterDelay(this.$t,6e4,(()=>this.en())))}tn(e){this.nn(),this.stream.send(e)}async en(){if(this.Jt())return this.close(0)}nn(){this.Qt&&(this.Qt.cancel(),this.Qt=null)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}async close(e,t){this.nn(),this.rn(),this.jt.cancel(),this.Wt++,e!==4?this.jt.reset():t&&t.code===b.RESOURCE_EXHAUSTED?(xt(t.toString()),xt("Using maximum backoff delay to prevent overloading the backend."),this.jt.Bt()):t&&t.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.sn(),this.stream.close(),this.stream=null),this.state=e,await this.listener.ht(t)}sn(){}auth(){this.state=1;const e=this._n(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.Wt===t&&this.an(r,s)}),(r=>{e((()=>{const s=new x(b.UNKNOWN,"Fetching auth token failed: "+r.message);return this.un(s)}))}))}an(e,t){const r=this._n(this.Wt);this.stream=this.cn(e,t),this.stream.ut((()=>{r((()=>this.listener.ut()))})),this.stream.lt((()=>{r((()=>(this.state=2,this.Gt=this.xt.enqueueAfterDelay(this.Kt,1e4,(()=>(this.Jt()&&(this.state=3),Promise.resolve()))),this.listener.lt())))})),this.stream.ht((s=>{r((()=>this.un(s)))})),this.stream.onMessage((s=>{r((()=>++this.zt==1?this.En(s):this.onNext(s)))}))}Yt(){this.state=5,this.jt.Ut((async()=>{this.state=0,this.start()}))}un(e){return D(Yl,`close with error: ${e}`),this.stream=null,this.close(4,e)}_n(e){return t=>{this.xt.enqueueAndForget((()=>this.Wt===e?t():(D(Yl,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class RT extends Ef{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}cn(e,t){return this.connection.vt("Listen",e,t)}En(e){return this.onNext(e)}onNext(e){this.jt.reset();const t=nT(this.serializer,e),r=(function(i){if(!("targetChange"in i))return j.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?j.min():a.readTime?et(a.readTime):j.min()})(e);return this.listener.hn(t,r)}Tn(e){const t={};t.database=va(this.serializer),t.addTarget=(function(i,a){let c;const l=a.target;if(c=An(l)?{pipelineQuery:cT(i,l)}:Xd(l)?{documents:sT(i,l)}:{query:iT(i,l).be},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=af(i,a.resumeToken);const h=wa(i,a.expectedCount);h!==null&&(c.expectedCount=h)}else if(a.snapshotVersion.compareTo(j.min())>0){c.readTime=Bi(i,a.snapshotVersion.toTimestamp());const h=wa(i,a.expectedCount);h!==null&&(c.expectedCount=h)}return c})(this.serializer,e);const r=aT(this.serializer,e);r&&(t.labels=r),this.tn(t)}Pn(e){const t={};t.database=va(this.serializer),t.removeTarget=e,this.tn(t)}}class PT extends Ef{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get Rn(){return this.zt>0}start(){this.lastStreamToken=void 0,super.start()}sn(){this.Rn&&this.In([])}cn(e,t){return this.connection.vt("Write",e,t)}En(e){return M(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,M(!e.writeResults||e.writeResults.length===0,55816),this.listener.An()}onNext(e){M(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.jt.reset();const t=rT(e.writeResults,e.commitTime),r=et(e.commitTime);return this.listener.Vn(r,t)}dn(){const e={};e.database=va(this.serializer),this.tn(e)}In(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>hf(this.serializer,r)))};this.tn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ST{}class CT extends ST{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.fn=!1}mn(){if(this.fn)throw new x(b.FAILED_PRECONDITION,"The client has already been terminated.")}tt(e,t,r,s){return this.mn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.tt(e,Ia(t,r),s,i,a))).catch((i=>{throw i.name==="FirebaseError"?(i.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new x(b.UNKNOWN,i.toString())}))}st(e,t,r,s,i){return this.mn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,c])=>this.connection.st(e,Ia(t,r),s,a,c,i))).catch((a=>{throw a.name==="FirebaseError"?(a.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new x(b.UNKNOWN,a.toString())}))}terminate(){this.fn=!0,this.connection.terminate()}}function bT(n,e,t,r){return new CT(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VT="ComponentProvider",Jl=new Map;function kT(n,e,t,r,s){return new lE(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,yf(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xl={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Tf=41943040;class Be{static withCacheSize(e){return new Be(e,Be.DEFAULT_COLLECTION_PERCENTILE,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}Be.DEFAULT_COLLECTION_PERCENTILE=10,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Be.DEFAULT=new Be(Tf,Be.DEFAULT_COLLECTION_PERCENTILE,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Be.DISABLED=new Be(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.pn(r),this.gn=r=>t.writeSequenceNumber(r))}pn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.gn&&this.gn(e),e}}lo.yn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NT="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class OT{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gr(n){if(n.code!==b.FAILED_PRECONDITION||n.message!==NT)throw n;D("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&U(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new C(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof C?t:C.resolve(t)}catch(t){return C.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):C.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):C.reject(t)}static resolve(e){return new C(((t,r)=>{t(e)}))}static reject(e){return new C(((t,r)=>{r(e)}))}static waitFor(e){return new C(((t,r)=>{let s=0,i=0,a=!1;e.forEach((c=>{++s,c.next((()=>{++i,a&&i===s&&t()}),(l=>r(l)))})),a=!0,i===s&&t()}))}static or(e){let t=C.resolve(!1);for(const r of e)t=t.next((s=>s?C.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new C(((r,s)=>{const i=e.length,a=new Array(i);let c=0;for(let l=0;l<i;l++){const h=l;t(e[h]).next((p=>{a[h]=p,++c,c===i&&r(a)}),(p=>s(p)))}}))}static doWhile(e,t){return new C(((r,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}}function DT(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function _r(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zl="LruGarbageCollector",xT=1048576;function eh([n,e],[t,r]){const s=Y(n,t);return s===0?Y(e,r):s}class LT{constructor(e){this.Jn=e,this.buffer=new de(eh),this.Yn=0}Zn(){return++this.Yn}Xn(e){const t=[e,this.Zn()];if(this.buffer.size<this.Jn)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();eh(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class MT{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.tr(6e4)}stop(){this.er&&(this.er.cancel(),this.er=null)}get started(){return this.er!==null}tr(e){D(Zl,`Garbage collection scheduled in ${e}ms`),this.er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){_r(t)?D(Zl,"Ignoring IndexedDB error during garbage collection: ",t):await gr(t)}await this.tr(3e5)}))}}class UT{constructor(e,t){this.nr=e,this.params=t}calculateTargetCount(e,t){return this.nr.rr(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return C.resolve(lo.yn);const r=new LT(t);return this.nr.forEachTarget(e,(s=>r.Xn(s.sequenceNumber))).next((()=>this.nr.ir(e,(s=>r.Xn(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.nr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.nr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(D("LruGarbageCollector","Garbage collection skipped; disabled"),C.resolve(Xl)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(D("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Xl):this.sr(e,t)))}getCacheSize(e){return this.nr.getCacheSize(e)}sr(e,t){let r,s,i,a,c,l,h;const p=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((m=>(m>this.params.maximumSequenceNumbersToCollect?(D("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,a=Date.now(),this.nthSequenceNumber(e,s)))).next((m=>(r=m,c=Date.now(),this.removeTargets(e,r,t)))).next((m=>(i=m,l=Date.now(),this.removeOrphanedDocuments(e,r)))).next((m=>(h=Date.now(),Hn()<=J.DEBUG&&D("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-p}ms
	Determined least recently used ${s} in `+(c-a)+`ms
	Removed ${i} targets in `+(l-c)+`ms
	Removed ${m} documents in `+(h-l)+`ms
Total Duration: ${h-p}ms`),C.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:m}))))}}function FT(n,e){return new UT(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wf="firestore.googleapis.com",th=!0;class nh{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new x(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=wf,this.ssl=th}else this.host=e.host,this.ssl=e.ssl??th;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=Tf;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<xT)throw new x(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(cE("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=yf(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new x(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new x(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new x(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new x(b.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;const i=Object.keys(r),a=Object.keys(s);if(i.length!==a.length)return!1;for(const c of i)if(r[c]!==s[c])return!1;return!0})(this._customHeaders,e._customHeaders)}}let cc=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new nh({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new x(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new x(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new nh(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new pT;switch(r.type){case"firstParty":return new yT(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new x(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=Jl.get(t);r&&(D(VT,"Removing Datastore"),Jl.delete(t),r.terminate())})(this),Promise.resolve()}};function BT(n,e,t,r={}){n=Ln(n,cc);const s=As(e),i=n._getSettings(),a={...i,emulatorOptions:n._getEmulatorOptions()},c=`${e}:${t}`;s&&Mh(`https://${c}`),i.host!==wf&&i.host!==c&&lt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const l={...i,host:c,ssl:s,emulatorOptions:r};if(!Nn(l,a)&&(n._setSettings(l),r.mockUserToken)){let h,p;if(typeof r.mockUserToken=="string")h=r.mockUserToken,p=ke.MOCK_USER;else{h=Pm(r.mockUserToken,n._app?.options.projectId);const m=r.mockUserToken.sub||r.mockUserToken.user_id;if(!m)throw new x(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");p=new ke(m)}n._authCredentials=new mT(new _f(h,p))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new uc(this.firestore,e,this._query)}}class he{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ms(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new he(this.firestore,e,this._key)}toJSON(){return{type:he._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(ks(t,he._jsonSchema))return new he(e,r||null,new B(Z.fromString(t.referencePath)))}}he._jsonSchemaVersion="firestore/documentReference/1.0",he._jsonSchema={type:le("string",he._jsonSchemaVersion),referencePath:le("string")};class ms extends uc{constructor(e,t,r){super(e,t,tc(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new he(this.firestore,null,new B(e))}withConverter(e){return new ms(this.firestore,e,this._path)}}function qR(n,e,...t){if(n=fe(n),arguments.length===1&&(e=Qa.newId()),aE("doc","path",e),n instanceof cc){const r=Z.fromString(e,...t);return bl(r),new he(n,null,new B(r))}{if(!(n instanceof he||n instanceof ms))throw new x(b.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Z.fromString(e,...t));return bl(r),new he(n.firestore,n instanceof ms?n.converter:null,new B(r))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Ge._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ks(e,Ge._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Ge(e.vectorValues);throw new x(b.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Ge._jsonSchemaVersion="firestore/vectorValue/1.0",Ge._jsonSchema={type:le("string",Ge._jsonSchemaVersion),vectorValues:le("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $T=/^__.*__$/;class jT{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new gn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Ds(e,this.data,t,this.fieldTransforms)}}class If{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new gn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function vf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw U(40011,{dataSource:n})}}class lc{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new lc({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){const t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){const t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return $i(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(vf(this.dataSource)&&$T.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class qT{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||co(e)}createContext(e,t,r,s=!1){return new lc({dataSource:e,methodName:t,targetDoc:r,path:Ze.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Af(n){const e=n._freezeSettings(),t=co(n._databaseId);return new qT(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Rf(n,e,t,r,s,i={}){const a=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);hc("Data must be an object, but it was:",a,r);const c=Pf(r,a);let l,h;if(i.merge)l=new Je(a.fieldMask),h=a.fieldTransforms;else if(i.mergeFields){const p=[];for(const m of i.mergeFields){const v=ur(e,m,t);if(!a.contains(v))throw new x(b.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);bf(p,v)||p.push(v)}l=new Je(p),h=a.fieldTransforms.filter((m=>l.covers(m.field)))}else l=null,h=a.fieldTransforms;return new jT(new Ne(c),l,h)}class ho extends oc{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ho}}function GT(n,e,t,r){const s=n.createContext(1,e,t);hc("Data must be an object, but it was:",s,r);const i=[],a=Ne.empty();mn(r,((l,h)=>{const p=Cf(e,l,t);h=fe(h);const m=s.childContextForFieldPath(p);if(h instanceof ho)i.push(p);else{const v=Mn(h,m);v!=null&&(i.push(p),a.set(p,v))}}));const c=new Je(i);return new If(a,c,s.fieldTransforms)}function HT(n,e,t,r,s,i){const a=n.createContext(1,e,t),c=[ur(e,r,t)],l=[s];if(i.length%2!=0)throw new x(b.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<i.length;v+=2)c.push(ur(e,i[v])),l.push(i[v+1]);const h=[],p=Ne.empty();for(let v=c.length-1;v>=0;--v)if(!bf(h,c[v])){const V=c[v];let k=l[v];k=fe(k);const F=a.childContextForFieldPath(V);if(k instanceof ho)h.push(V);else{const L=Mn(k,F);L!=null&&(h.push(V),p.set(V,L))}}const m=new Je(h);return new If(p,m,a.fieldTransforms)}function Mn(n,e,t){if(Sf(n=fe(n)))return hc("Unsupported field value:",e,n),Pf(n,e);if(n instanceof oc)return(function(s,i){if(!vf(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const a=s._toFieldTransform(i);a&&i.fieldTransforms.push(a)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const a=[];let c=0;for(const l of s){let h=Mn(l,i.childContextForArray(c));h==null&&(h={nullValue:"NULL_VALUE"}),a.push(h),c++}return{arrayValue:{values:a}}})(n,e)}return(function(s,i,a){if((s=fe(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Za(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const c=re.fromDate(s);return{timestampValue:Bi(i.serializer,c)}}if(s instanceof re){const c=new re(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Bi(i.serializer,c)}}if(s instanceof _t)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Ye)return{bytesValue:af(i.serializer,s._byteString)};if(s instanceof he){const c=i.databaseId,l=s.firestore._databaseId;if(!l.isEqual(c))throw i.createError(`Document reference is for database ${l.projectId}/${l.database} but should be for database ${c.projectId}/${c.database}`);return{referenceValue:ic(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof Ge)return(function(l,h){const p=l instanceof Ge?l.toArray():l;return{mapValue:{fields:{[Dd]:{stringValue:xd},[as]:{arrayValue:{values:p.map((v=>{if(typeof v!="number")throw h.createError("VectorValues must only contain numeric values.");return no(h.serializer,v)}))}}}}}})(s,i);if(mf(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${Ya(s)}`)})(n,e)}function Pf(n,e){const t={};return Cd(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):mn(n,((r,s)=>{const i=Mn(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function Sf(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof re||n instanceof _t||n instanceof Ye||n instanceof he||n instanceof oc||n instanceof Ge||mf(n))}function hc(n,e,t){if(!Sf(t)||!Vs(t)){const r=Ya(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function ur(n,e,t){if((e=fe(e))instanceof uo)return e._internalPath;if(typeof e=="string")return Cf(n,e);throw $i("Field path arguments must be of type string or ",n,!1,void 0,t)}const zT=new RegExp("[~\\*/\\[\\]]");function Cf(n,e,t){if(e.search(zT)>=0)throw $i(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new uo(...e.split("."))._internalPath}catch{throw $i(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function $i(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let l="";return(i||a)&&(l+=" (found",i&&(l+=` in field ${r}`),a&&(l+=` in document ${s}`),l+=")"),new x(b.INVALID_ARGUMENT,c+n+l)}function bf(n,e){return n.some((t=>t.isEqual(e)))}function WT(n){return typeof n._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const r=Ne.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const a=e[s];let c;i.nestedOptions&&Vs(a)?c={mapValue:{fields:new De(i.nestedOptions).getOptionsProto(t,a)}}:a&&(c=Mn(a,t)??void 0),c&&r.set(Ze.fromServerFormat(i.serverName),c)}}return r}getOptionsProto(e,t,r){const s=this._getKnownOptions(t,e);if(r){const i=new Map(oE(r,((a,c)=>[Ze.fromServerFormat(c),a!==void 0?Mn(a,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function KT(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!Vs(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}function QT(n){return new Ge(n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N(n){let e;return n instanceof Bn?n:(e=Vs(n)?tw(n):n instanceof Array?nw(n):Vf(n,void 0),e)}function Zo(n){if(n instanceof Bn)return n;if(n instanceof Ge)return gs(n);if(Array.isArray(n))return gs(QT(n));throw new Error("Unsupported value: "+typeof n)}function dc(n){return fE(n)?XT(n):N(n)}class Bn{constructor(){this._protoValueType="ProtoValue"}add(e){return new S("add",[this,N(e)],"add")}asBoolean(){if(this instanceof cn)return this;if(this instanceof yr)return new Nf(this);if(this instanceof Ms)return new ew(this);if(this instanceof S)return new kf(this);throw new x("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new S("subtract",[this,N(e)],"subtract")}multiply(e){return new S("multiply",[this,N(e)],"multiply")}divide(e){return new S("divide",[this,N(e)],"divide")}mod(e){return new S("mod",[this,N(e)],"mod")}equal(e){return new S("equal",[this,N(e)],"equal").asBoolean()}notEqual(e){return new S("not_equal",[this,N(e)],"notEqual").asBoolean()}lessThan(e){return new S("less_than",[this,N(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new S("less_than_or_equal",[this,N(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new S("greater_than",[this,N(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new S("greater_than_or_equal",[this,N(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const r=[e,...t].map((s=>N(s)));return new S("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new S("array_contains",[this,N(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new Gr(e.map(N),"arrayContainsAll"):e;return new S("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new Gr(e.map(N),"arrayContainsAny"):e;return new S("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new S("array_reverse",[this])}arrayLength(){return new S("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new Gr(e.map(N),"equalAny"):e;return new S("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new Gr(e.map(N),"notEqualAny"):e;return new S("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new S("exists",[this],"exists").asBoolean()}charLength(){return new S("char_length",[this],"charLength")}like(e){return new S("like",[this,N(e)],"like").asBoolean()}regexContains(e){return new S("regex_contains",[this,N(e)],"regexContains").asBoolean()}regexFind(e){return new S("regex_find",[this,N(e)],"regexFind")}regexFindAll(e){return new S("regex_find_all",[this,N(e)],"regexFindAll")}regexMatch(e){return new S("regex_match",[this,N(e)],"regexMatch").asBoolean()}stringContains(e){return new S("string_contains",[this,N(e)],"stringContains").asBoolean()}startsWith(e){return new S("starts_with",[this,N(e)],"startsWith").asBoolean()}endsWith(e){return new S("ends_with",[this,N(e)],"endsWith").asBoolean()}toLower(){return new S("to_lower",[this],"toLower")}toUpper(){return new S("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(N(e)),new S("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(N(e)),new S("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(N(e)),new S("rtrim",t,"rtrim")}type(){return new S("type",[this])}isType(e){return new S("is_type",[this,gs(e)],"isType").asBoolean()}stringConcat(e,...t){const r=[e,...t].map(N);return new S("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new S("string_index_of",[this,N(e)],"stringIndexOf")}stringRepeat(e){return new S("string_repeat",[this,N(e)],"stringRepeat")}stringReplaceAll(e,t){return new S("string_replace_all",[this,N(e),N(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new S("string_replace_one",[this,N(e),N(t)],"stringReplaceOne")}concat(e,...t){const r=[e,...t].map(N);return new S("concat",[this,...r],"concat")}reverse(){return new S("reverse",[this],"reverse")}arrayFilter(e,t){return new S("array_filter",[this,N(e),t],"arrayFilter")}arrayTransform(e,t){return new S("array_transform",[this,N(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new S("array_transform",[this,N(e),N(t),r],"arrayTransformWithIndex")}arraySlice(e,t){const r=[this,N(e)];return t!==void 0&&r.push(N(t)),new S("array_slice",r,"arraySlice")}arrayFirst(){return new S("array_first",[this],"arrayFirst")}arrayFirstN(e){return new S("array_first_n",[this,N(e)],"arrayFirstN")}arrayLast(){return new S("array_last",[this],"arrayLast")}arrayLastN(e){return new S("array_last_n",[this,N(e)],"arrayLastN")}arrayMaximum(){return new S("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new S("maximum_n",[this,N(e)],"arrayMaximumN")}arrayMinimum(){return new S("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new S("minimum_n",[this,N(e)],"arrayMinimumN")}arrayIndexOf(e){return new S("array_index_of",[this,N(e),N("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new S("array_index_of",[this,N(e),N("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new S("array_index_of_all",[this,N(e)],"arrayIndexOfAll")}byteLength(){return new S("byte_length",[this],"byteLength")}ceil(){return new S("ceil",[this])}floor(){return new S("floor",[this])}abs(){return new S("abs",[this])}exp(){return new S("exp",[this])}mapGet(e){return new S("map_get",[this,gs(e)],"mapGet")}mapSet(e,t,...r){const s=[this,N(e),N(t),...r.map(N)];return new S("map_set",s,"mapSet")}mapKeys(){return new S("map_keys",[this],"mapKeys")}mapValues(){return new S("map_values",[this],"mapValues")}mapEntries(){return new S("map_entries",[this],"mapEntries")}getField(e){return new S("get_field",[this,N(e)],"get_field")}count(){return Qe._create("count",[this],"count")}sum(){return Qe._create("sum",[this],"sum")}average(){return Qe._create("average",[this],"average")}minimum(){return Qe._create("minimum",[this],"minimum")}maximum(){return Qe._create("maximum",[this],"maximum")}first(){return Qe._create("first",[this],"first")}last(){return Qe._create("last",[this],"last")}arrayAgg(){return Qe._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Qe._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Qe._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const r=[e,...t];return new S("maximum",[this,...r.map(N)],"logicalMaximum")}logicalMinimum(e,...t){const r=[e,...t];return new S("minimum",[this,...r.map(N)],"minimum")}vectorLength(){return new S("vector_length",[this],"vectorLength")}cosineDistance(e){return new S("cosine_distance",[this,Zo(e)],"cosineDistance")}dotProduct(e){return new S("dot_product",[this,Zo(e)],"dotProduct")}euclideanDistance(e){return new S("euclidean_distance",[this,Zo(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new S("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new S("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new S("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new S("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new S("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new S("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new S("timestamp_add",[this,N(e),N(t)],"timestampAdd")}timestampSubtract(e,t){return new S("timestamp_subtract",[this,N(e),N(t)],"timestampSubtract")}timestampDiff(e,t){return new S("timestamp_diff",[this,dc(e),N(t)],"timestampDiff")}timestampExtract(e,t){const r=[this,N(e)];return t&&r.push(N(t)),new S("timestamp_extract",r,"timestampExtract")}documentId(){return new S("document_id",[this],"documentId")}parent(){return new S("parent",[this],"parent")}substring(e,t){const r=N(e);return new S("substring",t===void 0?[this,r]:[this,r,N(t)],"substring")}arrayGet(e){return new S("array_get",[this,N(e)],"arrayGet")}isError(){return new S("is_error",[this],"isError").asBoolean()}ifError(e){const t=new S("if_error",[this,N(e)],"ifError");return e instanceof cn?t.asBoolean():t}isAbsent(){return new S("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new S("map_remove",[this,N(e)],"mapRemove")}mapMerge(e,...t){const r=N(e),s=t.map(N);return new S("map_merge",[this,r,...s],"mapMerge")}pow(e){return new S("pow",[this,N(e)])}trunc(e){return e===void 0?new S("trunc",[this]):new S("trunc",[this,N(e)],"trunc")}round(e){return e===void 0?new S("round",[this]):new S("round",[this,N(e)],"round")}collectionId(){return new S("collection_id",[this])}length(){return new S("length",[this])}ln(){return new S("ln",[this])}sqrt(){return new S("sqrt",[this])}stringReverse(){return new S("string_reverse",[this])}ifAbsent(e){return new S("if_absent",[this,N(e)],"ifAbsent")}ifNull(e){return new S("if_null",[this,N(e)],"ifNull")}coalesce(e,...t){return new S("coalesce",[this,N(e),...t.map(N)],"coalesce")}join(e){return new S("join",[this,N(e)],"join")}log10(){return new S("log10",[this])}arraySum(){return new S("sum",[this])}split(e){return new S("split",[this,N(e)])}timestampTruncate(e,t){const r=[this,N(e)];return t&&r.push(N(t)),new S("timestamp_trunc",r)}ascending(){return rw(this)}descending(){return sw(this)}as(e){return new JT(this,e,"as")}}class Qe{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){const s=new Qe(e,t);return s._methodName=r,s}as(e){return new YT(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class YT{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}}class JT{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class Gr extends Bn{constructor(e,t){super(),this.ur=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.ur.map((t=>t._toProto(e)))}}}_readUserData(e){this.ur.forEach((t=>t._readUserData(e)))}}class Ms extends Bn{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new S("geo_distance",[this,N(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function XT(n){return ZT(n,"field")}function ZT(n,e){return new Ms(typeof n=="string"?sr===n?fT()._internalPath:ur("field",n):n._internalPath,e)}class yr extends Bn{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new yr(e,void 0);return t._protoValue=e,t}_toProto(e){return M(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,KT(this._protoValue)||(this._protoValue=Mn(this.value,e))}}function gs(n,e){return Vf(n,"constant")}function Vf(n,e){const t=new yr(n,e);return typeof n=="boolean"?new Nf(t):t}class S extends Bn{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new De({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class cn extends Bn{get _methodName(){return this._expr._methodName}countIf(){return Qe._create("count_if",[this],"countIf")}not(){return new S("not",[this],"not").asBoolean()}conditional(e,t){return new S("conditional",[this,e,t],"conditional")}ifError(e){const t=N(e),r=new S("if_error",[this,t],"ifError");return t instanceof cn?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class kf extends cn{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class Nf extends cn{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class ew extends cn{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function tw(n,e){const t=[];for(const r in n)if(Object.prototype.hasOwnProperty.call(n,r)){const s=n[r];t.push(gs(r)),t.push(N(s))}return new S("map",t,"map")}function nw(n){return(function(t,r){return new S("array",t.map((s=>N(s))),r)})(n,"array")}function rw(n){return new Of(dc(n),"ascending","ascending")}function sw(n){return new Of(dc(n),"descending","descending")}class Of{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:gf(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class Df extends tt{get _name(){return"add_fields"}get _optionsUtil(){return new De({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[ps(e,this.fields)]}}_readUserData(e){super._readUserData(e),un(this.fields,e)}}class xf extends tt{get _name(){return"aggregate"}get _optionsUtil(){return new De({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[ps(e,this.accumulators),ps(e,this.groups)]}}_readUserData(e){super._readUserData(e),un(this.groups,e),un(this.accumulators,e)}}class Lf extends tt{get _name(){return"distinct"}get _optionsUtil(){return new De({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[ps(e,this.groups)]}}_readUserData(e){super._readUserData(e),un(this.groups,e)}}class fo extends tt{get _name(){return"collection"}get _optionsUtil(){return new De({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.Er=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.Er}]}}_readUserData(e){super._readUserData(e)}}class po extends tt{get _name(){return"collection_group"}get _optionsUtil(){return new De({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class fc extends tt{get _name(){return"database"}get _optionsUtil(){return new De({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class pc extends tt{get _name(){return"documents"}get _optionsUtil(){return new De({})}constructor(e,t){if(super(t),!e||e.length===0)throw new x(b.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new x(b.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.hr=r,this.Tr=s}_toProto(e){return{...super._toProto(e),args:this.hr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class mc extends tt{get _name(){return"where"}get _optionsUtil(){return new De({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),un(this.condition,e)}}class _s extends tt{get _name(){return"limit"}get _optionsUtil(){return new De({})}constructor(e,t){M(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Za(e,this.limit)]}}}class rh extends tt{get _name(){return"offset"}get _optionsUtil(){return new De({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Za(e,this.offset)]}}}class iw extends tt{get _name(){return"select"}get _optionsUtil(){return new De({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[ps(e,this.selections)]}}_readUserData(e){super._readUserData(e),un(this.selections,e)}}class gc extends tt{get _name(){return"sort"}get _optionsUtil(){return new De({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),un(this.orderings,e)}}class _c extends tt{get _name(){return"replace_with"}get _optionsUtil(){return new De({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),gf(_c.Pr)]}}_readUserData(e){super._readUserData(e),un(this.map,e)}}_c.Pr="full_replace";function un(n,e){return WT(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}// Copyright 2024 Google LLC* @license
class E{constructor(e,t){this.type=e,this.value=t}static dr(){return new E("ERROR",void 0)}static mr(){return new E("UNSET",void 0)}static pr(){return new E("NULL",or)}static newValue(e){return Xe(e)?new E("NULL",or):(function(r){return!!r&&"booleanValue"in r})(e)?new E("BOOLEAN",e):pt(e)?new E("INT",e):Pn(e)?new E("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new E("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new E("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new E("BYTES",e):e.referenceValue?new E("REFERENCE",e):e.geoPointValue?new E("GEO_POINT",e):cr(e)?new E("ARRAY",e):Oi(e)?new E("VECTOR",e):Cn(e)?new E("MAP",e):new E("ERROR",void 0)}gr(){return this.type==="ERROR"||this.type==="UNSET"}yr(){return this.type==="NULL"}}function es(n){if(!n.gr())return n.value}function Mf(n){return n instanceof cn?n._expr:n}function $(n){if((n=Mf(n))instanceof Ms)return new ow(n);if(n instanceof yr)return new aw(n);if(n instanceof Gr)return new cw(n);if(n instanceof S){if(n.name==="add")return new hw(n);if(n.name==="subtract")return new dw(n);if(n.name==="multiply")return new fw(n);if(n.name==="divide")return new pw(n);if(n.name==="mod")return new mw(n);if(n.name==="and")return new gw(n);if(n.name==="equal")return new Cw(n);if(n.name==="not_equal")return new bw(n);if(n.name==="less_than")return new Vw(n);if(n.name==="less_than_or_equal")return new kw(n);if(n.name==="greater_than")return new Nw(n);if(n.name==="greater_than_or_equal")return new Ow(n);if(n.name==="array_concat")return new Dw(n);if(n.name==="array_reverse")return new xw(n);if(n.name==="array_contains")return new Lw(n);if(n.name==="array_contains_all")return new Mw(n);if(n.name==="array_contains_any")return new Uw(n);if(n.name==="array_length")return new Fw(n);if(n.name==="array_element")return new Bw(n);if(n.name==="equal_any")return new Uf(n);if(n.name==="not_equal_any")return new yw(n);if(n.name==="is_nan")return new Ew(n);if(n.name==="is_not_nan")return new Tw(n);if(n.name==="is_null")return new ww(n);if(n.name==="is_not_null")return new Iw(n);if(n.name==="is_error")return new vw(n);if(n.name==="exists")return new Aw(n);if(n.name==="not")return new mo(n);if(n.name==="or")return new _w(n);if(n.name==="xor")return new yc(n);if(n.name==="conditional")return new Rw(n);if(n.name==="maximum")return new Pw(n);if(n.name==="minimum")return new Sw(n);if(n.name==="reverse")return new $w(n);if(n.name==="replace_first")return new jw(n);if(n.name==="replace_all")return new qw(n);if(n.name==="char_length")return new Gw(n);if(n.name==="byte_length")return new Hw(n);if(n.name==="like")return new zw(n);if(n.name==="regex_contains")return new Ww(n);if(n.name==="regex_match")return new Kw(n);if(n.name==="string_contains")return new Qw(n);if(n.name==="starts_with")return new Yw(n);if(n.name==="ends_with")return new Jw(n);if(n.name==="to_lower")return new Xw(n);if(n.name==="to_upper")return new Zw(n);if(n.name==="trim")return new eI(n);if(n.name==="string_concat")return new tI(n);if(n.name==="map_get")return new nI(n);if(n.name==="cosine_distance")return new rI(n);if(n.name==="dot_product")return new sI(n);if(n.name==="euclidean_distance")return new iI(n);if(n.name==="vector_length")return new oI(n);if(n.name==="unix_micros_to_timestamp")return new hI(n);if(n.name==="timestamp_to_unix_micros")return new pI(n);if(n.name==="unix_millis_to_timestamp")return new dI(n);if(n.name==="timestamp_to_unix_millis")return new mI(n);if(n.name==="unix_seconds_to_timestamp")return new fI(n);if(n.name==="timestamp_to_unix_seconds")return new gI(n);if(n.name==="timestamp_add")return new _I(n);if(n.name==="timestamp_subtract")return new yI(n)}throw new Error(`Unknown Expr : ${n}`)}class ow{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===sr)return E.newValue({referenceValue:fs(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return E.newValue({timestampValue:wi(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return E.newValue({timestampValue:wi(e.serializer,t.createTime)});const r=t.data.field(this.expr._fieldPath);return r?to(r)?E.newValue((function(i,a){if(i.serverTimestampBehavior==="estimate")return{timestampValue:wi(i.serializer,j.fromTimestamp(ir(a)))};if(i.serverTimestampBehavior==="previous"){const c=Ns(a);if(c)return c}return{nullValue:"NULL_VALUE"}})(e,r)):E.newValue(r):E.mr()}}class aw{constructor(e){this.expr=e}evaluate(e,t){return E.newValue(this.expr._getValue())}}class cw{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.ur.map((s=>$(s).evaluate(e,t)));return r.some((s=>s.gr()))?E.dr():E.newValue({arrayValue:{values:r.map((s=>s.value))}})}}function Se(n){return Pn(n)?Number(n.doubleValue):Number(n.integerValue)}function Tt(n){return BigInt(n.integerValue)}const uw=BigInt("0x7fffffffffffffff"),lw=-BigInt("0x8000000000000000");class Us{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length>=2,24778);const r=$(this.expr.params[0]).evaluate(e,t),s=$(this.expr.params[1]).evaluate(e,t);let i=this.wr(r,s);for(const a of this.expr.params.slice(2)){const c=$(a).evaluate(e,t);i=this.wr(i,c)}return i}wr(e,t){if(e.gr()||t.gr())return E.dr();if(e.yr()||t.yr())return E.pr();const r=e.value,s=t.value;if(!Pn(r)&&!pt(r)||!Pn(s)&&!pt(s))return E.dr();if(Pn(r)||Pn(s)){const i=this.br(r,s);return i?E.newValue(i):E.dr()}if(pt(r)&&pt(s)){const i=this.vr(r,s);return i===void 0?E.dr():typeof i=="number"?E.newValue({doubleValue:i}):i<lw||i>uw?E.dr():E.newValue({integerValue:`${i}`})}return E.dr()}}function Lt(n,e){return me(n)!==me(e)?"TYPE_MISMATCH":We(n)||We(e)?"NOT_EQ":Xe(n)&&Xe(e)?"EQ":Xe(n)||Xe(e)?"NULL":cr(n)&&cr(e)?(function(r,s){if(r.values?.length!==s.values?.length)return"NOT_EQ";let i=!1;for(let a=0;a<(r.values?.length??0);a++){const c=r.values[a],l=s.values[a];switch(Lt(c,l)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:U(44609,{Sr:c,Dr:l})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):Oi(n)&&Oi(e)||Cn(n)&&Cn(e)?(function(r,s){const i=r.fields||{},a=s.fields||{};if(ki(i)!==ki(a))return"NOT_EQ";let c=!1;for(const l in i)if(i.hasOwnProperty(l)){if(a[l]===void 0)return"NOT_EQ";switch(Lt(i[l],a[l])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":c=!0}}return c?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return rt(r,s,{o:!1,t:!0,i:!0})})(n,e)?"EQ":"NOT_EQ"}class hw extends Us{vr(e,t){return Tt(e)+Tt(t)}br(e,t){return{doubleValue:Se(e)+Se(t)}}}class dw extends Us{constructor(e){super(e),this.expr=e}vr(e,t){return Tt(e)-Tt(t)}br(e,t){return{doubleValue:Se(e)-Se(t)}}}class fw extends Us{constructor(e){super(e),this.expr=e}vr(e,t){return Tt(e)*Tt(t)}br(e,t){return{doubleValue:Se(e)*Se(t)}}}class pw extends Us{constructor(e){super(e),this.expr=e}vr(e,t){const r=Tt(t);if(r!==BigInt(0))return Tt(e)/r}br(e,t){const r=Se(t);return r===0?{doubleValue:os(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:Se(e)/r}}}class mw extends Us{constructor(e){super(e),this.expr=e}vr(e,t){const r=Tt(t);if(r!==BigInt(0))return Tt(e)%r}br(e,t){const r=Se(t);if(r!==0)return{doubleValue:Se(e)%r}}}class gw{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(const i of this.expr.params){const a=$(i).evaluate(e,t);switch(a.type){case"BOOLEAN":if(!a.value?.booleanValue)return E.newValue(ve);break;case"NULL":s=!0;break;default:r=!0}}return r?E.dr():s?E.pr():E.newValue(He)}}class mo{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,9634);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return E.newValue({booleanValue:!r.value?.booleanValue});case"NULL":return E.pr();default:return E.dr()}}}class _w{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(const i of this.expr.params){const a=$(i).evaluate(e,t);switch(a.type){case"BOOLEAN":if(a.value?.booleanValue)return E.newValue(He);break;case"NULL":s=!0;break;default:r=!0}}return r?E.dr():s?E.pr():E.newValue(ve)}}class yc{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(const i of this.expr.params){const a=$(i).evaluate(e,t);switch(a.type){case"BOOLEAN":r=yc.xor(r,!!a.value?.booleanValue);break;case"NULL":s=!0;break;default:return E.dr()}}return s?E.pr():E.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}}class Uf{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===2,55094);let r=!1;const s=$(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return E.dr()}const i=$(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.dr()}if(r)return E.pr();for(const a of i.value?.arrayValue?.values??[])switch(Xe(s.value)&&Xe(a)?"EQ":Lt(s.value,a)){case"EQ":return E.newValue(He);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:U(44608,{value:s.value,candidate:a})}return r?E.pr():E.newValue(ve)}}class yw{constructor(e){this.expr=e}evaluate(e,t){return new mo(new S("not",[new S("equal_any",this.expr.params)])).evaluate(e,t)}}class Ew{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,23322);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return E.newValue(ve);case"DOUBLE":return E.newValue({booleanValue:isNaN(Se(r.value))});case"NULL":return E.pr();default:return E.dr()}}}class Tw{constructor(e){this.expr=e}evaluate(e,t){return M(this.expr.params.length===1,50406),new mo(new S("not",[new S("is_nan",this.expr.params)])).evaluate(e,t)}}class ww{constructor(e){this.expr=e}evaluate(e,t){switch(M(this.expr.params.length===1,23123),$(this.expr.params[0]).evaluate(e,t).type){case"NULL":return E.newValue(He);case"UNSET":case"ERROR":return E.dr();default:return E.newValue(ve)}}}class Iw{constructor(e){this.expr=e}evaluate(e,t){return M(this.expr.params.length===1,23167),new mo(new S("not",[new S("is_null",this.expr.params)])).evaluate(e,t)}}class vw{constructor(e){this.expr=e}evaluate(e,t){return M(this.expr.params.length===1,5228),$(this.expr.params[0]).evaluate(e,t).type==="ERROR"?E.newValue(He):E.newValue(ve)}}class Aw{constructor(e){this.expr=e}evaluate(e,t){switch(M(this.expr.params.length===1,6877),$(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return E.dr();case"UNSET":return E.newValue(ve);default:return E.newValue(He)}}}class Rw{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===3,11706);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return r.value?.booleanValue?$(this.expr.params[1]).evaluate(e,t):$(this.expr.params[2]).evaluate(e,t);case"NULL":return $(this.expr.params[2]).evaluate(e,t);default:return E.dr()}}}class Pw{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>$(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||ze(i.value,s.value)>0?i:s}return s===void 0?E.pr():s}}class Sw{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>$(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||ze(i.value,s.value)<0?i:s}return s===void 0?E.pr():s}}class Er{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return E.dr()}const s=$(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return E.dr()}return this.Cr(r,s)}}class Cw extends Er{constructor(e){super(e),this.expr=e}Cr(e,t){if(e.yr()&&t.yr())return E.newValue(He);if(e.yr()||t.yr()||We(e.value)||We(t.value)||me(e.value)!==me(t.value))return E.newValue(ve);switch(Lt(e.value,t.value)){case"EQ":return E.newValue(He);case"NOT_EQ":return E.newValue(ve);case"NULL":return E.pr();default:U(44615,{left:e,right:t})}}}class bw extends Er{constructor(e){super(e),this.expr=e}Cr(e,t){switch(Lt(e.value,t.value)){case"EQ":return E.newValue(ve);case"NOT_EQ":case"TYPE_MISMATCH":return E.newValue(He);case"NULL":return E.pr();default:U(44614,{left:e,right:t})}}}class Vw extends Er{constructor(e){super(e),this.expr=e}Cr(e,t){return me(e.value)!==me(t.value)||We(e.value)||We(t.value)?E.newValue(ve):E.newValue({booleanValue:ze(e.value,t.value)<0})}}class kw extends Er{constructor(e){super(e),this.expr=e}Cr(e,t){return me(e.value)!==me(t.value)||We(e.value)||We(t.value)?E.newValue(ve):Lt(e.value,t.value)==="EQ"?E.newValue(He):E.newValue({booleanValue:ze(e.value,t.value)<0})}}class Nw extends Er{constructor(e){super(e),this.expr=e}Cr(e,t){return me(e.value)!==me(t.value)||We(e.value)||We(t.value)?E.newValue(ve):E.newValue({booleanValue:ze(e.value,t.value)>0})}}class Ow extends Er{constructor(e){super(e),this.expr=e}Cr(e,t){return me(e.value)!==me(t.value)||We(e.value)||We(t.value)?E.newValue(ve):Lt(e.value,t.value)==="EQ"?E.newValue(He):E.newValue({booleanValue:ze(e.value,t.value)>0})}}class Dw{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class xw{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,216);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.pr();case"ARRAY":{const s=r.value.arrayValue?.values??[];return E.newValue({arrayValue:{values:[...s].reverse()}})}default:return E.dr()}}}class Lw{constructor(e){this.expr=e}evaluate(e,t){return M(this.expr.params.length===2,52884),new Uf(new S("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class Mw{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===2,1392);let r=!1;const s=$(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.dr()}const i=$(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.dr()}if(r)return E.pr();const a=i.value?.arrayValue?.values??[],c=s.value?.arrayValue?.values??[];for(const l of a){let h=!1;r=!1;for(const p of c){switch(Xe(l)&&Xe(p)?"EQ":Lt(l,p)){case"EQ":h=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:U(44613,{value:p,search:l})}if(h)break}if(!h)return E.newValue(ve)}return E.newValue(He)}}class Uw{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===2,2680);let r=!1;const s=$(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.dr()}const i=$(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.dr()}if(r)return E.pr();const a=i.value?.arrayValue?.values??[],c=s.value?.arrayValue?.values??[];for(const l of c)for(const h of a)switch(Xe(l)&&Xe(h)?"EQ":Lt(l,h)){case"EQ":return E.newValue(He);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:U(60403,{value:l,search:h})}return r?E.pr():E.newValue(ve)}}class Fw{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,38605);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.pr();case"ARRAY":return E.newValue({integerValue:`${r.value?.arrayValue?.values?.length??0}`});default:return E.dr()}}}class Bw{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class $w{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,1508);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.pr();case"BYTES":{const s=r.value?.bytesValue;if(typeof s=="string"){const i=pe.fromBase64String(s).toUint8Array();return i.reverse(),E.newValue({bytesValue:pe.fromUint8Array(i).toBase64()})}return E.newValue({bytesValue:new Uint8Array(s).reverse()})}case"STRING":{const s=r.value?.stringValue,i=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(s),a=Array.from(i,(c=>c.segment)).reverse();return E.newValue({stringValue:a.join("")})}default:return E.dr()}}}class jw{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class qw{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class Gw{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,19400);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.pr();case"STRING":{const s=(function(a){let c=0;for(let l=0;l<a.length;l++){const h=a.codePointAt(l);if(h===void 0)return;if(h<=65535)if(h>=55296&&h<=57343)if(h<=56319){const p=a.codePointAt(l+1);p!==void 0&&p>=56320&&p<=57343?(c+=1,l++):c+=1}else c+=1;else c+=1;else{if(!(h<=1114111))return;c+=1,l++}}return c})(r.value.stringValue);return s===void 0?E.dr():E.newValue({integerValue:s})}default:return E.dr()}}}class Hw{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,8486);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{const s=r.value?.bytesValue;return typeof s=="string"?E.newValue({integerValue:pe.fromBase64String(s).toUint8Array().length}):E.newValue({integerValue:new Uint8Array(s).length})}case"STRING":{const s=(function(a){let c=0;for(let l=0;l<a.length;l++){const h=a.codePointAt(l);if(h===void 0)return;if(h>=55296&&h<=57343){if(!(h<=56319))return;{const p=a.codePointAt(l+1);if(p===void 0||!(p>=56320&&p<=57343))return;c+=4,l++}}else if(h<=127)c+=1;else if(h<=2047)c+=2;else if(h<=65535)c+=3;else{if(!(h<=1114111))return;c+=4,l++}}return c})(r.value?.stringValue);return s===void 0?E.dr():E.newValue({integerValue:s})}case"NULL":return E.pr();default:return E.dr()}}}class Tr{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1;const s=$(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return E.dr()}const i=$(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return E.dr()}return r?E.pr():this.Fr(s.value?.stringValue,i.value?.stringValue)}}class zw extends Tr{Fr(e,t){try{const r=(function(a){let c="";for(let l=0;l<a.length;l++){const h=a.charAt(l);switch(h){case"_":c+=".";break;case"%":c+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":c+="\\"+h;break;default:c+=h}}return"^"+c+"$"})(t),s=xa.compile(r);return E.newValue({booleanValue:s.matches(e)})}catch(r){return lt(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),E.dr()}}}class Ww extends Tr{Fr(e,t){try{const r=xa.compile(t);return E.newValue({booleanValue:r.test(e)})}catch{return lt(`Invalid regex pattern found in regex_contains: ${t}, returning error`),E.dr()}}}class Kw extends Tr{Fr(e,t){try{return E.newValue({booleanValue:xa.compile(t).matches(e)})}catch{return lt(`Invalid regex pattern found in regex_match: ${t}, returning error`),E.dr()}}}class Qw extends Tr{Fr(e,t){return E.newValue({booleanValue:e.includes(t)})}}class Yw extends Tr{Fr(e,t){return E.newValue({booleanValue:e.startsWith(t)})}}class Jw extends Tr{Fr(e,t){return E.newValue({booleanValue:e.endsWith(t)})}}class Xw{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,29079);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return E.newValue({stringValue:r.value?.stringValue?.toLowerCase()});case"NULL":return E.pr();default:return E.dr()}}}class Zw{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,60487);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return E.newValue({stringValue:r.value?.stringValue?.toUpperCase()});case"NULL":return E.pr();default:return E.dr()}}}class eI{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,28544);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return E.newValue({stringValue:r.value?.stringValue?.trim()});case"NULL":return E.pr();default:return E.dr()}}}class tI{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((a=>$(a).evaluate(e,t)));let s="",i=!1;for(const a of r)switch(a.type){case"STRING":s+=a.value.stringValue;break;case"NULL":i=!0;break;default:return E.dr()}return i?E.pr():E.newValue({stringValue:s})}}class nI{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===2,4483);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return E.mr();case"MAP":break;default:return E.dr()}const s=$(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return E.dr();const i=r.value?.mapValue?.fields?.[s.value?.stringValue];return i===void 0?E.mr():E.newValue(i)}}class Ec{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1;const s=$(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return E.dr()}const i=$(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return E.dr()}if(r)return E.pr();const a=ya(s.value),c=ya(i.value);if(a===void 0||c===void 0||a.values?.length!==c.values?.length)return E.dr();const l=this.Or(a,c);return l===void 0||isNaN(l)?E.dr():E.newValue({doubleValue:l})}}class rI extends Ec{Or(e,t){const r=e?.values??[],s=t?.values??[];if(r.length===0)return;let i=0,a=0,c=0;for(let h=0;h<r.length;h++){if(!on(r[h])||!on(s[h]))return;const p=Se(r[h]),m=Se(s[h]);i+=p*m,a+=p*p,c+=m*m}const l=Math.sqrt(a)*Math.sqrt(c);if(l!==0)return 1-Math.max(-1,Math.min(1,i/l))}}class sI extends Ec{Or(e,t){const r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let a=0;a<r.length;a++){if(!on(r[a])||!on(s[a]))return;i+=Se(r[a])*Se(s[a])}return i}}class iI extends Ec{Or(e,t){const r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let a=0;a<r.length;a++){if(!on(r[a])||!on(s[a]))return;const c=Se(r[a]),l=Se(s[a]);i+=Math.pow(c-l,2)}return Math.sqrt(i)}}class oI{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,39044);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{const s=ya(r.value);return E.newValue({integerValue:s?.values?.length??0})}case"NULL":return E.pr();default:return E.dr()}}}const ys=BigInt(-62135596800),Es=BigInt(253402300799),ji=BigInt(1e3),en=BigInt(1e6),aI=ys*ji,cI=Es*ji+BigInt(999),uI=ys*en,lI=Es*en+BigInt(999999);function Tc(n){return n>=uI&&n<=lI}function Ff(n){return n>=ys&&n<=Es}function Ts(n,e){const t=BigInt(n);return!(t<ys||t>Es)&&!(e<0||e>=1e9)&&(t!==ys||e===0)&&!(t===Es&&e>999999999)}function Bf(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function wc(n){return BigInt(n.seconds)*en+BigInt(Math.trunc(n.nanoseconds/1e3))}class Ic{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return E.pr();default:return E.dr()}}}class hI extends Ic{toTimestamp(e){if(!Tc(e))return E.dr();let t=Number(e/en),r=Number(e%en*BigInt(1e3));const s=Bf(t,r);return t=s.seconds,r=s.nanos,Ts(t,r)?E.newValue({timestampValue:{seconds:t,nanos:r}}):E.dr()}}class dI extends Ic{toTimestamp(e){if(!(function(a){return a>=aI&&a<=cI})(e))return E.dr();let t=Number(e/ji),r=Number(e%ji*BigInt(1e6));const s=Bf(t,r);return t=s.seconds,r=s.nanos,Ts(t,r)?E.newValue({timestampValue:{seconds:t,nanos:r}}):E.dr()}}class fI extends Ic{toTimestamp(e){if(!Ff(e))return E.dr();const t=Number(e);return E.newValue({timestampValue:{seconds:t,nanos:0}})}}class vc{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const r=$(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return E.pr();default:return E.dr()}const s=sc(r.value.timestampValue);return Ts(s.seconds,s.nanoseconds)?this.Mr(s):E.dr()}}class pI extends vc{Mr(e){const t=wc(e);return Tc(t)?E.newValue({integerValue:`${t.toString()}`}):E.dr()}}class mI extends vc{Mr(e){const t=wc(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?E.newValue({integerValue:r.toString()}):E.newValue({integerValue:(r-BigInt(1)).toString()})}}class gI extends vc{Mr(e){const t=BigInt(e.seconds);return Ff(t)?E.newValue({integerValue:t.toString()}):E.dr()}}class $f{constructor(e){this.expr=e}evaluate(e,t){M(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1;const s=$(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return E.dr()}const i=$(this.expr.params[1]).evaluate(e,t);let a;switch(i.type){case"STRING":if(a=(function(ee){switch(ee){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),a===void 0)return E.dr();break;case"NULL":r=!0;break;default:return E.dr()}const c=$(this.expr.params[2]).evaluate(e,t);switch(c.type){case"INT":break;case"NULL":r=!0;break;default:return E.dr()}if(r)return E.pr();const l=BigInt(c.value.integerValue);let h;try{switch(a){case"microsecond":h=l;break;case"millisecond":h=l*BigInt(1e3);break;case"second":h=l*BigInt(1e6);break;case"minute":h=l*BigInt(6e7);break;case"hour":h=l*BigInt(36e8);break;case"day":h=l*BigInt(864e8);break;default:return E.dr()}if(a!=="microsecond"&&l!==BigInt(0)&&h/l!==BigInt(this.Nr(a)))return E.dr()}catch(W){return lt(`Error during timestamp arithmetic: ${W}`),E.dr()}const p=sc(s.value.timestampValue);if(!Ts(p.seconds,p.nanoseconds))return E.dr();const m=wc(p),v=this.Lr(m,h);if(!Tc(v))return E.dr();const V=Number(v/en),k=v%en,F=Number((k<0?k+en:k)*BigInt(1e3)),L=k<0?V-1:V;return Ts(L,F)?E.newValue({timestampValue:{seconds:L,nanos:F}}):E.dr()}Nr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class _I extends $f{Lr(e,t){return e+t}}class yI extends $f{Lr(e,t){return e-t}}// Copyright 2024 Google LLC* @license
class $e{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return go(this)}getPipelineCollectionGroup(){return Ac(this)}getPipelineCollectionId(){return EI(this)}getPipelineDocuments(){return Ra(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==Lf.name&&s._name!==xf.name||(r="keyless"),s._name===iw.name&&r==="exact"&&(r="augmented"),s._name===Df.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return tn(this)}}function tn(n){const e=n.stages[0];return e instanceof fo||e instanceof po||e instanceof fc||e instanceof pc?e._name:"unknown"}function go(n){if(tn(n)==="collection")return n.stages[0].Er}function Ac(n){if(tn(n)==="collection_group")return n.stages[0].collectionId}function EI(n){switch(tn(n)){case"collection":return Z.fromString(go(n)).lastSegment();case"collection_group":return Ac(n);default:return}}function Ra(n){if(tn(n)==="documents")return n.stages[0].hr}function ws(n){if((n=Mf(n))instanceof Ms)return`fld(${n.fieldName})`;if(n instanceof yr)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof he?`ref(${t.path})`:t instanceof Ge?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof S)return`fn(${n.name},[${n.params.map(ws).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.ur.map(ws).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function TI(n){if(n instanceof Df)return`${n._name}(${ui(n.fields)})`;if(n instanceof xf){let e=`${n._name}(${ui(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${ui(n.groups)})`),e}if(n instanceof Lf)return`${n._name}(${ui(n.groups)})`;if(n instanceof fo)return`${n._name}(${n.Er})`;if(n instanceof po)return`${n._name}(${n.collectionId})`;if(n instanceof fc)return`${n._name}()`;if(n instanceof pc)return`${n._name}(${n.hr.sort()})`;if(n instanceof mc)return`${n._name}(${ws(n.condition)})`;if(n instanceof _s)return`${n._name}(${n.limit})`;if(n instanceof gc)return`${n._name}(${(function(t){return t.map((r=>`${ws(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function ui(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${ws(t)}`)).join(",")}`}function kt(n){return n.stages.map((e=>TI(e))).join("|")}function jf(n,e){return kt(n)===kt(e)}function Ee(n){return n instanceof $e}function sh(n){return Ee(n)?kt(n):Jr(n)}function qf(n){return Ee(n)?kt(n):(function(t){return`${Yd(gt(t))}|lt:${t.limitType}`})(n)}function _o(n,e){return n instanceof $e&&e instanceof $e?jf(n,e):!(n instanceof $e&&!(e instanceof $e)||!(n instanceof $e)&&e instanceof $e)&&FE(n,e)}function Gf(n){return An(n)?kt(n):Yd(n)}function Hf(n,e){return n instanceof $e&&e instanceof $e?jf(n,e):!(n instanceof $e&&!(e instanceof $e)||!(n instanceof $e)&&e instanceof $e)&&Jd(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wI{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&TE(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Qr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Qr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=rf();return this.mutations.forEach((s=>{const i=e.get(s.key),a=i.overlayedDocument;let c=this.applyToLocalView(a,i.mutatedFields);c=t.has(s.key)?null:c;const l=$d(a,c);l!==null&&r.set(s.key,l),a.isValidDocument()||a.convertToNoDocument(j.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Q())}isEqual(e){return this.batchId===e.batchId&&rr(this.mutations,e.mutations,((t,r)=>xl(t,r)))&&rr(this.baseMutations,e.baseMutations,((t,r)=>xl(t,r)))}}class Rc{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){M(e.mutations.length===r.length,58842,{Br:e.mutations.length,Ur:r.length});let s=(function(){return qE})();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new Rc(e,t,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zf="";function II(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=ih(e)),e=vI(n.get(t),e);return ih(e)}function vI(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const i=n.charAt(s);switch(i){case"\0":t+="";break;case zf:t+="";break;default:t+=i}}return t}function ih(n){return n+zf+""}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AI{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e,t,r,s,i=j.min(),a=j.min(),c=pe.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=l}withSequenceNumber(e){return new Ct(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RI{constructor(e){this.qr=e}}function PI(n){const e=oT({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Ta(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SI{constructor(){this.Yi=new CI}addToCollectionParentIndex(e,t){return this.Yi.add(t),C.resolve()}getCollectionParents(e,t){return C.resolve(this.Yi.getEntries(t))}addFieldIndex(e,t){return C.resolve()}deleteFieldIndex(e,t){return C.resolve()}deleteAllFieldIndexes(e){return C.resolve()}createTargetIndexes(e,t){return C.resolve()}getDocumentsMatchingTarget(e,t){return C.resolve(null)}getIndexType(e,t){return C.resolve(0)}getFieldIndexes(e,t){return C.resolve([])}getNextCollectionGroupToUpdate(e){return C.resolve(null)}getMinOffset(e,t){return C.resolve(an.min())}getMinOffsetFromCollectionGroup(e,t){return C.resolve(an.min())}updateCollectionGroup(e,t,r){return C.resolve()}updateIndexEntries(e,t){return C.resolve()}}class CI{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new de(Z.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new de(Z.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln{constructor(e){this.gs=e}next(){return this.gs+=2,this.gs}static ys(){return new ln(0)}static ws(){return new ln(-1)}}// Copyright 2024 Google LLC* @license
function Wf(n,e){let t=e;for(const r of n.stages)t=VI({serializer:n.serializer,serverTimestampBehavior:n.listenOptions?.serverTimestampBehavior},r,t);return t}function yo(n,e){return Wf(n,[e]).length>0}function bI(n,e){return Ee(n)?yo(n,e):ao(n,e)}function VI(n,e,t){if(e instanceof fo)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()&&`/${c.key.getCollectionPath().canonicalString()}`===i.Er))})(0,e,t);if(e instanceof mc)return(function(s,i,a){return a.filter((c=>{const l=es($(i.condition).evaluate(s,c));return l!==void 0&&rt(l,He)}))})(n,e,t);if(e instanceof po)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()&&c.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof fc)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()))})(0,0,t);if(e instanceof pc)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()&&i.Tr.has(c.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof _s)return(function(s,i,a){return a.slice(0,i.limit)})(0,e,t);if(e instanceof gc)return(function(s,i,a){const c=i.orderings.map((l=>({Os:$(l.expr),direction:l.direction})));return[...a].sort(((l,h)=>{for(const{Os:p,direction:m}of c){const v=es(p.evaluate(s,l)),V=es(p.evaluate(s,h)),k=ze(v??or,V??or);if(k!==0)return m==="ascending"?k:-k}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function Pa(n){const e=(function(r){for(let s=r.stages.length-1;s>=0;s--){const i=r.stages[s];if(i instanceof gc)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(const s of e){const i=es($(s.expr).evaluate({serializer:n.serializer},t)),a=es($(s.expr).evaluate({serializer:n.serializer},r)),c=ze(i||or,a||or);if(c!==0)return s.direction==="ascending"?c:-c}return 0}}function ea(n){for(let e=n.stages.length-1;e>=0;e--){const t=n.stages[e];if(t instanceof _s)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kI{constructor(){this.changes=new Fn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ie.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?C.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NI{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OI{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&Qr(r.mutation,s,Je.empty(),re.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,Q()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=Q()){const s=Jt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let a=Wn();return i.forEach(((c,l)=>{a=a.insert(c,l.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const r=Jt();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,Q())))}populateOverlays(e,t,r){const s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((a,c)=>{t.set(a,c)}))}))}computeViews(e,t,r,s){let i=qe();const a=Xr(),c=(function(){return Xr()})();return t.forEach(((l,h)=>{const p=r.get(h.key);s.has(h.key)&&(p===void 0||p.mutation instanceof gn)?i=i.insert(h.key,h):p!==void 0?(a.set(h.key,p.mutation.getFieldMask()),Qr(p.mutation,h,p.mutation.getFieldMask(),re.now())):a.set(h.key,Je.empty())})),this.recalculateAndSaveOverlays(e,i).next((l=>(l.forEach(((h,p)=>a.set(h,p))),t.forEach(((h,p)=>c.set(h,new NI(p,a.get(h)??null)))),c)))}recalculateAndSaveOverlays(e,t){const r=Xr();let s=new se(((a,c)=>a-c)),i=Q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const c of a)c.keys().forEach((l=>{const h=t.get(l);if(h===null)return;let p=r.get(l)||Je.empty();p=c.applyToLocalView(h,p),r.set(l,p);const m=(s.get(c.batchId)||Q()).add(l);s=s.insert(c.batchId,m)}))})).next((()=>{const a=[],c=s.getReverseIterator();for(;c.hasNext();){const l=c.getNext(),h=l.key,p=l.value,m=rf();p.forEach((v=>{if(!i.has(v)){const V=$d(t.get(v),r.get(v));V!==null&&m.set(v,V),i=i.add(v)}})),a.push(this.documentOverlayCache.saveOverlays(e,h,m))}return C.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return Ee(t)?this.getDocumentsMatchingPipeline(e,t,r,s):LE(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):ME(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):C.resolve(Jt());let c=ds,l=i;return a.next((h=>C.forEach(h,((p,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),i.get(p)?C.resolve():this.remoteDocumentCache.getEntry(e,p).next((v=>{l=l.insert(p,v)}))))).next((()=>this.populateOverlays(e,h,i))).next((()=>this.computeViews(e,l,h,Q()))).next((p=>({batchId:c,changes:nf(p)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new B(t)).next((r=>{let s=Wn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=Wn();return this.indexManager.getCollectionParents(e,i).next((c=>C.forEach(c,(l=>{const h=(function(m,v){return new oo(v,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(t,l.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,r,s).next((p=>{p.forEach(((m,v)=>{a=a.insert(m,v)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((a=>this.retrieveMatchingLocalDocuments(i,a,(c=>ao(t,c)))))}getDocumentsMatchingPipeline(e,t,r,s){if(tn(t)==="collection_group"){const i=Ac(t);let a=Wn();return this.indexManager.getCollectionParents(e,i).next((c=>C.forEach(c,(l=>{const h=(function(m,v){const V=m.stages.map((k=>k instanceof po?new fo(v.canonicalString(),{}):k));return new $e(m.serializer,V)})(t,l.child(i));return this.getDocumentsMatchingPipeline(e,h,r,s).next((p=>{p.forEach(((m,v)=>{a=a.insert(m,v)}))}))})).next((()=>a))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((a=>{switch(i=a,tn(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let c=Q();for(const l of Ra(t))c=c.add(B.fromPath(l));return this.remoteDocumentCache.getEntries(e,c);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new x("invalid-argument",`Invalid pipeline source to execute offline: ${kt(t)}`)}})).next((a=>this.retrieveMatchingLocalDocuments(i,a,(c=>yo(t,c)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,a)=>{const c=a.getKey();t.get(c)===null&&(t=t.insert(c,Ie.newInvalidDocument(c)))}));let s=Wn();return t.forEach(((i,a)=>{const c=e.get(i);c!==void 0&&Qr(c.mutation,a,Je.empty(),re.now()),r(a)&&(s=s.insert(i,a))})),s}getOverlaysForPipeline(e,t,r){switch(tn(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,Z.fromString(go(t)),r);case"collection_group":throw new x("invalid-argument",`Unexpected collection group pipeline: ${kt(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,Ra(t).map((s=>B.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new x("invalid-argument",`Failed to get overlays for pipeline: ${kt(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DI{constructor(e){this.serializer=e,this.Ks=new Map,this.Ws=new Map}getBundleMetadata(e,t){return C.resolve(this.Ks.get(t))}saveBundleMetadata(e,t){return this.Ks.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:et(s.createTime)}})(t)),C.resolve()}getNamedQuery(e,t){return C.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,(function(s){return{name:s.name,query:PI(s.bundledQuery),readTime:et(s.readTime)}})(t)),C.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xI{constructor(){this.overlays=new se(B.comparator),this.Qs=new Map}getOverlay(e,t){return C.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Jt();return C.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){const r=Jt();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),C.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.Yr(e,t,i)})),C.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Qs.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Qs.delete(r)),C.resolve()}getOverlaysForCollection(e,t,r){const s=Jt(),i=t.length+1,a=new B(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const l=c.getNext().value,h=l.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===i&&l.largestBatchId>r&&s.set(l.getKey(),l)}return C.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new se(((h,p)=>h-p));const a=this.overlays.getIterator();for(;a.hasNext();){const h=a.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>r){let p=i.get(h.largestBatchId);p===null&&(p=Jt(),i=i.insert(h.largestBatchId,p)),p.set(h.getKey(),h)}}const c=Jt(),l=i.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach(((h,p)=>c.set(h,p))),!(c.size()>=s)););return C.resolve(c)}Yr(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Qs.get(s.largestBatchId).delete(r.key);this.Qs.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new AI(t,r));let i=this.Qs.get(t);i===void 0&&(i=Q(),this.Qs.set(t,i)),this.Qs.set(t,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LI{constructor(){this.sessionToken=pe.EMPTY_BYTE_STRING}getSessionToken(e){return C.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,C.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pc{constructor(){this.Gs=new de(we.zs),this.js=new de(we.Hs)}isEmpty(){return this.Gs.isEmpty()}addReference(e,t){const r=new we(e,t);this.Gs=this.Gs.add(r),this.js=this.js.add(r)}Js(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Ys(new we(e,t))}Zs(e,t){e.forEach((r=>this.removeReference(r,t)))}Xs(e){const t=new B(new Z([])),r=new we(t,e),s=new we(t,e+1),i=[];return this.js.forEachInRange([r,s],(a=>{this.Ys(a),i.push(a.key)})),i}e_(){this.Gs.forEach((e=>this.Ys(e)))}Ys(e){this.Gs=this.Gs.delete(e),this.js=this.js.delete(e)}t_(e){const t=new B(new Z([])),r=new we(t,e),s=new we(t,e+1);let i=Q();return this.js.forEachInRange([r,s],(a=>{i=i.add(a.key)})),i}containsKey(e){const t=new we(e,0),r=this.Gs.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class we{constructor(e,t){this.key=e,this.n_=t}static zs(e,t){return B.comparator(e.key,t.key)||Y(e.n_,t.n_)}static Hs(e,t){return Y(e.n_,t.n_)||B.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MI{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Qr=1,this.r_=new de(we.zs)}checkEmpty(e){return C.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Qr;this.Qr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new wI(i,t,r,s);this.mutationQueue.push(a);for(const c of s)this.r_=this.r_.add(new we(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return C.resolve(a)}lookupMutationBatch(e,t){return C.resolve(this.i_(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.s_(r),i=s<0?0:s;return C.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return C.resolve(this.mutationQueue.length===0?Ja:this.Qr-1)}getAllMutationBatches(e){return C.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new we(t,0),s=new we(t,Number.POSITIVE_INFINITY),i=[];return this.r_.forEachInRange([r,s],(a=>{const c=this.i_(a.n_);i.push(c)})),C.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new de(Y);return t.forEach((s=>{const i=new we(s,0),a=new we(s,Number.POSITIVE_INFINITY);this.r_.forEachInRange([i,a],(c=>{r=r.add(c.n_)}))})),C.resolve(this.__(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;B.isDocumentKey(i)||(i=i.child(""));const a=new we(new B(i),0);let c=new de(Y);return this.r_.forEachWhile((l=>{const h=l.key.path;return!!r.isPrefixOf(h)&&(h.length===s&&(c=c.add(l.n_)),!0)}),a),C.resolve(this.__(c))}__(e){const t=[];return e.forEach((r=>{const s=this.i_(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){M(this.o_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.r_;return C.forEach(t.mutations,(s=>{const i=new we(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.r_=r}))}jr(e){}containsKey(e,t){const r=new we(t,0),s=this.r_.firstAfterOrEqual(r);return C.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,C.resolve()}o_(e,t){return this.s_(e)}s_(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}i_(e){const t=this.s_(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UI{constructor(e){this.a_=e,this.docs=(function(){return new se(B.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.a_(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return C.resolve(r?r.document.mutableCopy():Ie.newInvalidDocument(t))}getEntries(e,t){let r=qe();return t.forEach((s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Ie.newInvalidDocument(s))})),C.resolve(r)}getAllEntries(e){let t=qe();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),C.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,a;Ee(t)?(i=Z.fromString(go(t)),a=p=>yo(t,p)):(i=t.path,a=p=>ao(t,p));let c=qe();const l=new B(i.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(l);for(;h.hasNext();){const{key:p,value:{document:m}}=h.getNext();if(!i.isPrefixOf(p.path))break;p.path.length>i.length+1||OE(NE(m),r)<=0||(s.has(m.key)||a(m))&&(c=c.insert(m.key,m.mutableCopy()))}return C.resolve(c)}getAllFromCollectionGroup(e,t,r,s){U(9500)}u_(e,t){return C.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new FI(this)}getSize(e){return C.resolve(this.size)}}class FI extends kI{constructor(e){super(),this.qs=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.qs.addEntry(e,s)):this.qs.removeEntry(r)})),C.waitFor(t)}getFromCache(e,t){return this.qs.getEntry(e,t)}getAllFromCache(e,t){return this.qs.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BI{constructor(e){this.persistence=e,this.c_=new Fn((t=>Gf(t)),Hf),this.lastRemoteSnapshotVersion=j.min(),this.highestTargetId=0,this.l_=0,this.E_=new Pc,this.targetCount=0,this.h_=ln.ys()}forEachTarget(e,t){return this.c_.forEach(((r,s)=>t(s))),C.resolve()}getLastRemoteSnapshotVersion(e){return C.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return C.resolve(this.l_)}allocateTargetId(e){return this.highestTargetId=this.h_.next(),C.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.l_&&(this.l_=t),C.resolve()}Ss(e){this.c_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.h_=new ln(t),this.highestTargetId=t),e.sequenceNumber>this.l_&&(this.l_=e.sequenceNumber)}addTargetData(e,t){return this.Ss(t),this.targetCount+=1,C.resolve()}updateTargetData(e,t){return this.Ss(t),C.resolve()}removeTargetData(e,t){return this.c_.delete(t.target),this.E_.Xs(t.targetId),this.targetCount-=1,C.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.c_.forEach(((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.c_.delete(a),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),C.waitFor(i).next((()=>s))}getTargetCount(e){return C.resolve(this.targetCount)}getTargetData(e,t){const r=this.c_.get(t)||null;return C.resolve(r)}addMatchingKeys(e,t,r){return this.E_.Js(t,r),C.resolve()}removeMatchingKeys(e,t,r){this.E_.Zs(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((a=>{i.push(s.markPotentiallyOrphaned(e,a))})),C.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.E_.Xs(t),C.resolve()}getMatchingKeysForTargetId(e,t){const r=this.E_.t_(t);return C.resolve(r)}containsKey(e,t){return C.resolve(this.E_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(e,t){this.T_={},this.overlays={},this.P_=new lo(0),this.R_=!1,this.R_=!0,this.I_=new LI,this.referenceDelegate=e(this),this.A_=new BI(this),this.indexManager=new SI,this.remoteDocumentCache=(function(s){return new UI(s)})((r=>this.referenceDelegate.V_(r))),this.serializer=new RI(t),this.d_=new DI(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new xI,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.T_[e.toKey()];return r||(r=new MI(t,this.referenceDelegate),this.T_[e.toKey()]=r),r}getGlobalsCache(){return this.I_}getTargetCache(){return this.A_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.d_}runTransaction(e,t,r){D("MemoryPersistence","Starting transaction:",e);const s=new $I(this.P_.next());return this.referenceDelegate.f_(),r(s).next((i=>this.referenceDelegate.m_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}p_(e,t){return C.or(Object.values(this.T_).map((r=>()=>r.containsKey(e,t))))}}class $I extends OT{constructor(e){super(),this.currentSequenceNumber=e}}class Sc{constructor(e){this.persistence=e,this.g_=new Pc,this.y_=null}static w_(e){return new Sc(e)}get b_(){if(this.y_)return this.y_;throw U(60996)}addReference(e,t,r){return this.g_.addReference(r,t),this.b_.delete(r.toString()),C.resolve()}removeReference(e,t,r){return this.g_.removeReference(r,t),this.b_.add(r.toString()),C.resolve()}markPotentiallyOrphaned(e,t){return this.b_.add(t.toString()),C.resolve()}removeTarget(e,t){this.g_.Xs(t.targetId).forEach((s=>this.b_.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.b_.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}f_(){this.y_=new Set}m_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return C.forEach(this.b_,(r=>{const s=B.fromPath(r);return this.v_(e,s).next((i=>{i||t.removeEntry(s,j.min())}))})).next((()=>(this.y_=null,t.apply(e))))}updateLimboDocument(e,t){return this.v_(e,t).next((r=>{r?this.b_.delete(t.toString()):this.b_.add(t.toString())}))}V_(e){return 0}v_(e,t){return C.or([()=>C.resolve(this.g_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.p_(e,t)])}}class qi{constructor(e,t){this.persistence=e,this.S_=new Fn((r=>II(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=FT(this,t)}static w_(e,t){return new qi(e,t)}f_(){}m_(e){return C.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}rr(e){const t=this.xs(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}xs(e){let t=0;return this.ir(e,(r=>{t++})).next((()=>t))}ir(e,t){return C.forEach(this.S_,((r,s)=>this.Fs(e,r,s).next((i=>i?C.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.u_(e,(a=>this.Fs(e,a,t).next((c=>{c||(r++,i.removeEntry(a,j.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.S_.set(t,e.currentSequenceNumber),C.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.S_.set(r,e.currentSequenceNumber),C.resolve()}removeReference(e,t,r){return this.S_.set(r,e.currentSequenceNumber),C.resolve()}updateLimboDocument(e,t){return this.S_.set(t,e.currentSequenceNumber),C.resolve()}V_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=yi(e.data.value)),t}Fs(e,t,r){return C.or([()=>this.persistence.p_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.S_.get(t);return C.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cc{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Ao=r,this.Vo=s}static fo(e,t){let r=Q(),s=Q();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Cc(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jI(n,e){return B.comparator(n.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qI{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GI{constructor(){this.mo=!1,this.po=!1,this.yo=100,this.wo=(function(){return Om()?8:DT(Oe())>0?6:4})()}initialize(e,t){this.bo=e,this.indexManager=t,this.mo=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.vo(e,t).next((a=>{i.result=a})).next((()=>{if(!i.result)return this.So(e,t,s,r).next((a=>{i.result=a}))})).next((()=>{if(i.result)return;const a=new qI;return this.Do(e,t,a).next((c=>{if(i.result=c,this.po)return this.xo(e,t,a,c.size)}))})).next((()=>i.result))}xo(e,t,r,s){return Ee(t)?C.resolve():r.documentReadCount<this.yo?(Hn()<=J.DEBUG&&D("QueryEngine","SDK will not create cache indexes for query:",Jr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.yo,"documents"),C.resolve()):(Hn()<=J.DEBUG&&D("QueryEngine","Query:",Jr(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.wo*s?(Hn()<=J.DEBUG&&D("QueryEngine","The SDK decides to create cache indexes for query:",Jr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,gt(t))):C.resolve())}vo(e,t){if(Ee(t))return C.resolve(null);let r=t;if($l(r))return C.resolve(null);let s=gt(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=Ta(r,null,"F"),s=gt(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((a=>{const c=Q(...a);return this.bo.getDocuments(e,c).next((l=>this.indexManager.getMinOffset(e,s).next((h=>{const p=this.Co(r,l);return this.Fo(r,p,c,h.readTime)?this.vo(e,Ta(r,null,"F")):this.Oo(e,p,r,h)}))))})))))}So(e,t,r,s){return(Ee(t)?(function(a){for(const c of a.stages){if(c instanceof _s||c instanceof rh)return!1;if(c instanceof mc){if(c.condition instanceof kf&&c.condition._expr.name==="exists"&&c.condition._expr.params[0]instanceof Ms&&c.condition._expr.params[0].fieldName===sr)continue;return!1}}return!0})(t):$l(t))||s.isEqual(j.min())?C.resolve(null):this.bo.getDocuments(e,r).next((i=>{const a=this.Co(t,i);return this.Fo(t,a,r,s)?C.resolve(null):(Hn()<=J.DEBUG&&D("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),sh(t)),this.Oo(e,a,t,kE(s,ds)).next((c=>c)))}))}Co(e,t){let r,s;return Ee(e)?(r=new de(jI),s=i=>yo(e,i)):(r=new de(nc(e)),s=i=>ao(e,i)),t.forEach(((i,a)=>{s(a)&&(r=r.add(a))})),r}Fo(e,t,r,s){if(Ee(e))return(function(c){return c.stages.some((l=>l instanceof _s||l instanceof rh))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Do(e,t,r){return Hn()<=J.DEBUG&&D("QueryEngine","Using full collection scan to execute query:",sh(t)),this.bo.getDocumentsMatchingQuery(e,t,an.min(),r)}Oo(e,t,r,s){return this.bo.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((a=>{i=i.insert(a.key,a)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bc="LocalStore",HI=3e8;class zI{constructor(e,t,r,s){this.persistence=e,this.Mo=t,this.serializer=s,this.No=new se(Y),this.Lo=new Fn((i=>Gf(i)),Hf),this.Bo=new Map,this.Uo=e.getRemoteDocumentCache(),this.A_=e.getTargetCache(),this.d_=e.getBundleCache(),this.ko(r)}ko(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new OI(this.Uo,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Uo.setIndexManager(this.indexManager),this.Mo.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.No)))}}function WI(n,e,t,r){return new zI(n,e,t,r)}async function Qf(n,e){const t=z(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.ko(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{const a=[],c=[];let l=Q();for(const h of s){a.push(h.batchId);for(const p of h.mutations)l=l.add(p.key)}for(const h of i){c.push(h.batchId);for(const p of h.mutations)l=l.add(p.key)}return t.localDocuments.getDocuments(r,l).next((h=>({qo:h,removedBatchIds:a,addedBatchIds:c})))}))}))}function KI(n,e){const t=z(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),i=t.Uo.newChangeBuffer({trackRemovals:!0});return(function(c,l,h,p){const m=h.batch,v=m.keys();let V=C.resolve();return v.forEach((k=>{V=V.next((()=>p.getEntry(l,k))).next((F=>{const L=h.docVersions.get(k);M(L!==null,48541),F.version.compareTo(L)<0&&(m.applyToRemoteDocument(F,h),F.isValidDocument()&&(F.setReadTime(h.commitVersion),p.addEntry(F)))}))})),V.next((()=>c.mutationQueue.removeMutationBatch(l,m)))})(t,r,e,i).next((()=>i.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(c){let l=Q();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(l=l.add(c.batch.mutations[h].key));return l})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function Yf(n){const e=z(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.A_.getLastRemoteSnapshotVersion(t)))}function QI(n,e){const t=z(n),r=e.snapshotVersion;let s=t.No;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const a=t.Uo.newChangeBuffer({trackRemovals:!0});s=t.No;const c=[];e.targetChanges.forEach(((p,m)=>{const v=s.get(m);if(!v)return;c.push(t.A_.removeMatchingKeys(i,p.removedDocuments,m).next((()=>t.A_.addMatchingKeys(i,p.addedDocuments,m))));let V=v.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?V=V.withResumeToken(pe.EMPTY_BYTE_STRING,j.min()).withLastLimboFreeSnapshotVersion(j.min()):p.resumeToken.approximateByteSize()>0&&(V=V.withResumeToken(p.resumeToken,r)),s=s.insert(m,V),(function(F,L,W){return F.resumeToken.approximateByteSize()===0||L.snapshotVersion.toMicroseconds()-F.snapshotVersion.toMicroseconds()>=HI?!0:W.addedDocuments.size+W.modifiedDocuments.size+W.removedDocuments.size>0})(v,V,p)&&c.push(t.A_.updateTargetData(i,V))}));let l=qe(),h=Q();if(e.documentUpdates.forEach((p=>{e.resolvedLimboDocuments.has(p)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,p))})),c.push(YI(i,a,e.documentUpdates).next((p=>{l=p.$o,h=p.Ko}))),!r.isEqual(j.min())){const p=t.A_.getLastRemoteSnapshotVersion(i).next((m=>t.A_.setTargetsMetadata(i,i.currentSequenceNumber,r)));c.push(p)}return C.waitFor(c).next((()=>a.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,l,h))).next((()=>l))})).then((i=>(t.No=s,i)))}function YI(n,e,t){let r=Q(),s=Q();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let a=qe();return t.forEach(((c,l)=>{const h=i.get(c);l.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(c)),l.isNoDocument()&&l.version.isEqual(j.min())?(e.removeEntry(c,l.readTime),a=a.insert(c,l)):!h.isValidDocument()||l.version.compareTo(h.version)>0||l.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(l),a=a.insert(c,l)):D(bc,"Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",l.version)})),{$o:a,Ko:s}}))}function JI(n,e){const t=z(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Ja),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function XI(n,e){const t=z(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.A_.getTargetData(r,e).next((i=>i?(s=i,C.resolve(s)):t.A_.allocateTargetId(r).next((a=>(s=new Ct(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.A_.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.No.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.No=t.No.insert(r.targetId,r),t.Lo.set(e,r.targetId)),r}))}async function Sa(n,e,t){const r=z(n),s=r.No.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(a=>r.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!_r(a))throw a;D(bc,`Failed to update sequence numbers for target ${e}: ${a}`)}r.No=r.No.remove(e),r.Lo.delete(s.target)}function oh(n,e,t){const r=z(n);let s=j.min(),i=Q();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(l,h,p){const m=z(l),v=m.Lo.get(p);return v!==void 0?C.resolve(m.No.get(v)):m.A_.getTargetData(h,p)})(r,a,Ee(e)?e:gt(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.A_.getMatchingKeysForTargetId(a,c.targetId).next((l=>{i=l}))})).next((()=>r.Mo.getDocumentsMatchingQuery(a,e,t?s:j.min(),t?i:Q()))).next((c=>(ZI(r,c),{documents:c,Wo:i})))))}function ZI(n,e){e.forEach(((t,r)=>{const s=r.key.getCollectionGroup(),i=n.Bo.get(s)||j.min();r.readTime.compareTo(i)>0&&n.Bo.set(s,r.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ev{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Jo=0,this.Yo=null,this.Zo=!0}Xo(){this.Jo===0&&(this.ea("Unknown"),this.Yo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Yo=null,this.ta("Backend didn't respond within 10 seconds."),this.ea("Offline"),Promise.resolve()))))}na(e){this.state==="Online"?this.ea("Unknown"):(this.Jo++,this.Jo>=1&&(this.ra(),this.ta(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ea("Offline")))}set(e){this.ra(),this.Jo=0,e==="Online"&&(this.Zo=!1),this.ea(e)}ea(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ta(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Zo?(xt(t),this.Zo=!1):D("OnlineStateTracker",t)}ra(){this.Yo!==null&&(this.Yo.cancel(),this.Yo=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wt="RemoteStore";class tv{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.ia=[],this.sa=new Map,this._a=new Map,this.oa=new Map,this.aa=new ln(1e3),this.ua=new ln(1001),this.ca=new Set,this.la=[],this.Ea=i,this.Ea.Ke((a=>{r.enqueueAndForget((async()=>{$n(this)&&(D(wt,"Restarting streams for network reachability change."),await(async function(l){const h=z(l);h.ca.add(4),await Fs(h),h.ha.set("Unknown"),h.ca.delete(4),await Eo(h)})(this))}))})),this.ha=new ev(r,s)}}async function Eo(n){if($n(n))for(const e of n.la)await e(!0)}async function Fs(n){for(const e of n.la)await e(!1)}function Ca(n,e){return n._a.get(e)||void 0}function Jf(n,e){const t=z(n),r=Ca(t,e.targetId);if(r!==void 0&&t.sa.has(r))return;const s=(function(c,l){const h=Ca(c,l);h!==void 0&&c.oa.delete(h);const p=(function(v,V){return V%2!=0?v.ua.next():v.aa.next()})(c,l);return c._a.set(l,p),c.oa.set(p,l),p})(t,e.targetId);D(wt,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new Ct(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.sa.set(s,i),Oc(t)?Nc(t):wr(t).Jt()&&kc(t,i)}function Vc(n,e){const t=z(n),r=wr(t),s=Ca(t,e);D(wt,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.sa.delete(s),t._a.delete(e),t.oa.delete(s),r.Jt()&&Xf(t,s),t.sa.size===0&&(r.Jt()?r.Xt():$n(t)&&t.ha.set("Unknown"))}function kc(n,e){if(n.Ta.H(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(j.min())>0){const t=n.oa.get(e.targetId);if(t===void 0)return void D(wt,"SDK target ID not found for remote ID: "+e.targetId);const r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}wr(n).Tn(e)}function Xf(n,e){n.Ta.H(e),wr(n).Pn(e)}function Nc(n){n.Ta=new QE({getRemoteKeysForTarget:e=>{const t=n.oa.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):Q()},ge:e=>n.sa.get(e)||null,Ae:()=>n.datastore.serializer.databaseId}),wr(n).start(),n.ha.Xo()}function Oc(n){return $n(n)&&!wr(n).Ht()&&n.sa.size>0}function $n(n){return z(n).ca.size===0}function Zf(n){n.Ta=void 0}async function nv(n){n.ha.set("Online")}async function rv(n){n.sa.forEach(((e,t)=>{kc(n,e)}))}async function sv(n,e){Zf(n),Oc(n)?(n.ha.na(e),Nc(n)):n.ha.set("Unknown")}async function iv(n,e,t){if(n.ha.set("Online"),e instanceof of&&e.state===2&&e.cause)try{await(async function(s,i){const a=i.cause;for(const c of i.targetIds){if(s.sa.has(c)){const l=s.oa.get(c);l!==void 0&&(await s.remoteSyncer.rejectListen(l,a),s._a.delete(l),s.oa.delete(c)),s.sa.delete(c)}s.Ta.removeTarget(c)}})(n,e)}catch(r){D(wt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Gi(n,r)}else if(e instanceof Ti?n.Ta.se(e):e instanceof sf?n.Ta.Ee(e):n.Ta.ae(e),!t.isEqual(j.min()))try{const r=await Yf(n.localStore);t.compareTo(r)>=0&&await(function(i,a){const c=i.Ta.de(a);c.targetChanges.forEach(((h,p)=>{if(h.resumeToken.approximateByteSize()>0){const m=i.sa.get(p);m&&i.sa.set(p,m.withResumeToken(h.resumeToken,a))}})),c.targetMismatches.forEach(((h,p)=>{const m=i.sa.get(h);if(!m)return;i.sa.set(h,m.withResumeToken(pe.EMPTY_BYTE_STRING,m.snapshotVersion)),Xf(i,h);const v=new Ct(m.target,h,p,m.sequenceNumber);kc(i,v)}));const l=(function(p,m){const v=new Map;m.targetChanges.forEach(((k,F)=>{const L=p.oa.get(F);L!==void 0&&v.set(L,k)}));let V=new se(Y);return m.targetMismatches.forEach(((k,F)=>{const L=p.oa.get(k);L!==void 0&&(V=V.insert(L,F))})),new xs(m.snapshotVersion,v,V,m.documentUpdates,m.augmentedDocumentUpdates,m.resolvedLimboDocuments)})(i,c);return i.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(r){D(wt,"Failed to raise snapshot:",r),await Gi(n,r)}}async function Gi(n,e,t){if(!_r(e))throw e;n.ca.add(1),await Fs(n),n.ha.set("Offline"),t||(t=()=>Yf(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{D(wt,"Retrying IndexedDB access"),await t(),n.ca.delete(1),await Eo(n)}))}function ep(n,e){return e().catch((t=>Gi(n,t,e)))}async function To(n){const e=z(n),t=hn(e);let r=e.ia.length>0?e.ia[e.ia.length-1].batchId:Ja;for(;ov(e);)try{const s=await JI(e.localStore,r);if(s===null){e.ia.length===0&&t.Xt();break}r=s.batchId,av(e,s)}catch(s){await Gi(e,s)}tp(e)&&np(e)}function ov(n){return $n(n)&&n.ia.length<10}function av(n,e){n.ia.push(e);const t=hn(n);t.Jt()&&t.Rn&&t.In(e.mutations)}function tp(n){return $n(n)&&!hn(n).Ht()&&n.ia.length>0}function np(n){hn(n).start()}async function cv(n){hn(n).dn()}async function uv(n){const e=hn(n);for(const t of n.ia)e.In(t.mutations)}async function lv(n,e,t){const r=n.ia.shift(),s=Rc.from(r,e,t);await ep(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await To(n)}async function hv(n,e){e&&hn(n).Rn&&await(async function(r,s){if((function(a){return Zd(a)&&a!==b.ABORTED})(s.code)){const i=r.ia.shift();hn(r).Zt(),await ep(r,(()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s))),await To(r)}})(n,e),tp(n)&&np(n)}async function ah(n,e){const t=z(n);t.asyncQueue.verifyOperationInProgress(),D(wt,"RemoteStore received new credentials");const r=$n(t);t.ca.add(3),await Fs(t),r&&t.ha.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.ca.delete(3),await Eo(t)}async function dv(n,e){const t=z(n);e?(t.ca.delete(2),await Eo(t)):e||(t.ca.add(2),await Fs(t),t.ha.set("Unknown"))}function wr(n){return n.Pa||(n.Pa=(function(t,r,s){const i=z(t);return i.mn(),new RT(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ut:nv.bind(null,n),lt:rv.bind(null,n),ht:sv.bind(null,n),hn:iv.bind(null,n)}),n.la.push((async e=>{e?(n.Pa.Zt(),Oc(n)?Nc(n):n.ha.set("Unknown")):(await n.Pa.stop(),Zf(n))}))),n.Pa}function hn(n){return n.Ra||(n.Ra=(function(t,r,s){const i=z(t);return i.mn(),new PT(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ut:()=>Promise.resolve(),lt:cv.bind(null,n),ht:hv.bind(null,n),An:uv.bind(null,n),Vn:lv.bind(null,n)}),n.la.push((async e=>{e?(n.Ra.Zt(),await To(n)):(await n.Ra.stop(),n.ia.length>0&&(D(wt,`Stopping write stream with ${n.ia.length} pending writes`),n.ia=[]))}))),n.Ra}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fv{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ia(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ia(this.observer.error,e):xt("Uncaught Error in snapshot listener:",e.toString()))}Aa(){this.muted=!0}Ia(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dc{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Vt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,c=new Dc(e,t,a,s,i);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new x(b.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function xc(n,e){if(xt("AsyncQueue",`${e}: ${n}`),_r(n))return new x(b.UNAVAILABLE,`${e}: ${n}`);throw n}class ch{constructor(){this.activeTargetIds=zE()}La(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ba(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Na(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class pv{constructor(){this.du=new ch,this.fu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.du.La(e),this.fu[e]||"not-current"}updateQueryState(e,t,r){this.fu[e]=t}removeLocalQueryTarget(e){this.du.Ba(e)}isLocalQueryTarget(e){return this.du.activeTargetIds.has(e)}clearQueryState(e){delete this.fu[e]}getAllActiveQueryTargets(){return this.du.activeTargetIds}isActiveQueryTarget(e){return this.du.activeTargetIds.has(e)}start(){return this.du=new ch,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}function ta(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{static emptySet(e){return new bn(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||B.comparator(t.key,r.key):(t,r)=>B.comparator(t.key,r.key),this.keyedMap=Wn(),this.sortedSet=new se(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof bn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new bn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh{constructor(){this.mu=new se(B.comparator)}track(e){const t=e.doc.key,r=this.mu.get(t);r?e.type!==0&&r.type===3?this.mu=this.mu.insert(t,e):e.type===3&&r.type!==1?this.mu=this.mu.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.mu=this.mu.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.mu=this.mu.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.mu=this.mu.remove(t):e.type===1&&r.type===2?this.mu=this.mu.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.mu=this.mu.insert(t,{type:2,doc:e.doc}):U(63341,{ye:e,pu:r}):this.mu=this.mu.insert(t,e)}gu(){const e=[];return this.mu.inorderTraversal(((t,r)=>{e.push(r)})),e}}class lr{constructor(e,t,r,s,i,a,c,l,h){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=l,this.hasCachedResults=h}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach((c=>{a.push({type:0,doc:c})})),new lr(e,t,bn.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&_o(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mv{constructor(){this.yu=void 0,this.wu=[]}bu(){return this.wu.some((e=>e.vu()))}}class gv{constructor(){this.queries=lh(),this.onlineState="Unknown",this.Su=new Set}terminate(){(function(t,r){const s=z(t),i=s.queries;s.queries=lh(),i.forEach(((a,c)=>{for(const l of c.wu)l.onError(r)}))})(this,new x(b.ABORTED,"Firestore shutting down"))}}function lh(){return new Fn((n=>qf(n)),_o)}async function _v(n,e){const t=z(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.bu()&&e.vu()&&(r=2):(i=new mv,r=e.vu()?0:1);try{switch(r){case 0:i.yu=await t.onListen(s,!0);break;case 1:i.yu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const c=xc(a,`Initialization of query '${Ee(e.query)?kt(e.query):Jr(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.wu.push(e),e.Du(t.onlineState),i.yu&&e.xu(i.yu)&&Lc(t)}async function yv(n,e){const t=z(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.wu.indexOf(e);a>=0&&(i.wu.splice(a,1),i.wu.length===0?s=e.vu()?0:1:!i.bu()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function Ev(n,e){const t=z(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const c of a.wu)c.xu(s)&&(r=!0);a.yu=s}}r&&Lc(t)}function Tv(n,e,t){const r=z(n),s=r.queries.get(e);if(s)for(const i of s.wu)i.onError(t);r.queries.delete(e)}function Lc(n){n.Su.forEach((e=>{e.next()}))}var ba;(function(n){n.Default="default",n.Cache="cache"})(ba||(ba={}));class wv{constructor(e,t,r){this.query=e,this.Cu=t,this.Fu=!1,this.Ou=null,this.onlineState="Unknown",this.options=r||{}}xu(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new lr(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Fu?this.Mu(e)&&(this.Cu.next(e),t=!0):this.Nu(e,this.onlineState)&&(this.Lu(e),t=!0),this.Ou=e,t}onError(e){this.Cu.error(e)}Du(e){this.onlineState=e;let t=!1;return this.Ou&&!this.Fu&&this.Nu(this.Ou,e)&&(this.Lu(this.Ou),t=!0),t}Nu(e,t){if(!e.fromCache||!this.vu())return!0;const r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Mu(e){if(e.docChanges.length>0)return!0;const t=this.Ou&&this.Ou.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Lu(e){e=lr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Fu=!0,this.Cu.next(e)}vu(){return this.options.source!==ba.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rp{constructor(e){this.key=e}}class sp{constructor(e){this.key=e}}class Iv{constructor(e,t){this.query=e,this.Gu=t,this.zu=null,this.hasCachedResults=!1,this.current=!1,this.ju=Q(),this.mutatedKeys=Q(),this.Hu=Ee(e)?Pa(e):nc(e),this.Ju=new bn(this.Hu)}get Yu(){return this.Gu}Zu(e,t){const r=t?t.Xu:new uh,s=t?t.Ju:this.Ju;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,c=!1;const[l,h]=this.ec(this.query,s);e.inorderTraversal(((m,v)=>{const V=s.get(m),k=bI(this.query,v)?v:null,F=!!V&&this.mutatedKeys.has(V.key),L=!!k&&(k.hasLocalMutations||this.mutatedKeys.has(k.key)&&k.hasCommittedMutations);let W=!1;V&&k?V.data.isEqual(k.data)?F!==L&&(r.track({type:3,doc:k}),W=!0):this.tc(V,k)||(r.track({type:2,doc:k}),W=!0,(l&&this.Hu(k,l)>0||h&&this.Hu(k,h)<0)&&(c=!0)):!V&&k?(r.track({type:0,doc:k}),W=!0):V&&!k&&(r.track({type:1,doc:V}),W=!0,(l||h)&&(c=!0)),W&&(k?(a=a.add(k),i=L?i.add(m):i.delete(m)):(a=a.delete(m),i=i.delete(m)))}));const p=this.nc(this.query);if(p)if(Ee(this.query)){const m=[];a.forEach((k=>m.push(k)));const v=Wf(this.query,m);let V=new bn(Pa(this.query));for(const k of v)V=V.add(k);a.forEach((k=>{V.has(k.key)||(i=i.delete(k.key),r.track({type:1,doc:k}))})),a=V}else{const m=this.rc(this.query);for(;a.size>p;){const v=m==="F"?a.last():a.first();a=a.delete(v.key),i=i.delete(v.key),r.track({type:1,doc:v})}}return{Ju:a,Xu:r,Fo:c,mutatedKeys:i}}nc(e){return Ee(e)?ea(e)?.limit:e.limit||void 0}rc(e){if(Ee(e)){const t=ea(e);return t&&t.limit<0?"L":"F"}return e.limitType}ec(e,t){if(Ee(e)){const r=ea(e)?.limit;return[t.size===r?t.last():null,null]}return[e.limitType==="F"&&t.size===this.nc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.nc(this.query)?t.first():null]}tc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Ju;this.Ju=e.Ju,this.mutatedKeys=e.mutatedKeys;const a=e.Xu.gu();a.sort(((p,m)=>(function(V,k){const F=L=>{switch(L){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return U(20277,{ye:L})}};return F(V)-F(k)})(p.type,m.type)||this.Hu(p.doc,m.doc))),this.sc(r),s=s??!1;const c=t&&!s?this._c():[],l=this.ju.size===0&&this.current&&!s?1:0,h=l!==this.zu;return this.zu=l,a.length!==0||h?{snapshot:new lr(this.query,e.Ju,i,a,e.mutatedKeys,l===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),oc:c}:{oc:c}}Du(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ju:this.Ju,Xu:new uh,mutatedKeys:this.mutatedKeys,Fo:!1},!1)):{oc:[]}}ac(e){return!this.Gu.has(e)&&!!this.Ju.has(e)&&!this.Ju.get(e).hasLocalMutations}sc(e){e&&(e.addedDocuments.forEach((t=>this.Gu=this.Gu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Gu=this.Gu.delete(t))),this.current=e.current)}_c(){if(!this.current)return[];const e=this.ju;this.ju=Q(),this.Ju.forEach((r=>{this.ac(r.key)&&(this.ju=this.ju.add(r.key))}));const t=[];return e.forEach((r=>{this.ju.has(r)||t.push(new sp(r))})),this.ju.forEach((r=>{e.has(r)||t.push(new rp(r))})),t}uc(e){this.Gu=e.Wo,this.ju=Q();const t=this.Zu(e.documents);return this.applyChanges(t,!0)}cc(){return lr.fromInitialDocuments(this.query,this.Ju,this.mutatedKeys,this.zu===0,this.hasCachedResults)}}const Mc="SyncEngine";class vv{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class Av{constructor(e){this.key=e,this.lc=!1}}class Rv{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ec={},this.hc=new Fn((c=>qf(c)),_o),this.Tc=new Map,this.Pc=new Set,this.Rc=new se(B.comparator),this.Ic=new Map,this.Ac=new Pc,this.Vc={},this.dc=new Map,this.fc=ln.ws(),this.onlineState="Unknown",this.mc=void 0}get isPrimaryClient(){return this.mc===!0}}async function Pv(n,e,t=!0){const r=lp(n);let s;const i=r.hc.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.cc()):s=await ip(r,e,t,!0),s}async function Sv(n,e){const t=lp(n);await ip(t,e,!0,!1)}async function ip(n,e,t,r){const s=await XI(n.localStore,Ee(e)?e:gt(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let c;return r&&(c=await Cv(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&Jf(n.remoteStore,s),c}async function Cv(n,e,t,r,s){n.gc=(m,v,V)=>(async function(F,L,W,ee){let oe=L.view.Zu(W);oe.Fo&&(oe=await oh(F.localStore,L.query,!1).then((({documents:w})=>L.view.Zu(w,oe))));const Ue=ee&&ee.targetChanges.get(L.targetId),st=ee&&ee.targetMismatches.get(L.targetId)!=null,Ae=L.view.applyChanges(oe,F.isPrimaryClient,Ue,st);return dh(F,L.targetId,Ae.oc),Ae.snapshot})(n,m,v,V);const i=await oh(n.localStore,e,!0),a=new Iv(e,i.Wo),c=a.Zu(i.documents),l=Ls.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),h=a.applyChanges(c,n.isPrimaryClient,l);dh(n,t,h.oc);const p=new vv(e,t,a);return n.hc.set(e,p),n.Tc.has(t)?n.Tc.get(t).push(e):n.Tc.set(t,[e]),h.snapshot}async function bv(n,e,t){const r=z(n),s=r.hc.get(e),i=r.Tc.get(s.targetId);if(i.length>1)return r.Tc.set(s.targetId,i.filter((a=>!_o(a,e)))),void r.hc.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Sa(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Vc(r.remoteStore,s.targetId),Va(r,s.targetId)})).catch(gr)):(Va(r,s.targetId),await Sa(r.localStore,s.targetId,!0))}async function Vv(n,e){const t=z(n),r=t.hc.get(e),s=t.Tc.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Vc(t.remoteStore,r.targetId))}async function kv(n,e,t){const r=Uv(n);try{const s=await(function(a,c){const l=z(a),h=re.now(),p=c.reduce(((V,k)=>V.add(k.key)),Q());let m,v;return l.persistence.runTransaction("Locally write mutations","readwrite",(V=>{let k=qe(),F=Q();return l.Uo.getEntries(V,p).next((L=>{k=L,k.forEach(((W,ee)=>{ee.isValidDocument()||(F=F.add(W))}))})).next((()=>l.localDocuments.getOverlayedDocuments(V,k))).next((L=>{m=L;const W=[];for(const ee of c){const oe=wE(ee,m.get(ee.key).overlayedDocument);oe!=null&&W.push(new gn(ee.key,oe,Ld(oe.value.mapValue),Me.exists(!0)))}return l.mutationQueue.addMutationBatch(V,h,W,c)})).next((L=>{v=L;const W=L.applyToLocalDocumentSet(m,F);return l.documentOverlayCache.saveOverlays(V,L.batchId,W)}))})).then((()=>({batchId:v.batchId,changes:nf(m)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(a,c,l){let h=a.Vc[a.currentUser.toKey()];h||(h=new se(Y)),h=h.insert(c,l),a.Vc[a.currentUser.toKey()]=h})(r,s.batchId,t),await Bs(r,s.changes),await To(r.remoteStore)}catch(s){const i=xc(s,"Failed to persist write");t.reject(i)}}async function op(n,e){const t=z(n);try{const r=await QI(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const a=t.Ic.get(i);a&&(M(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.lc=!0:s.modifiedDocuments.size>0?M(a.lc,14607):s.removedDocuments.size>0&&(M(a.lc,42227),a.lc=!1))})),await Bs(t,r,e)}catch(r){await gr(r)}}function hh(n,e,t){const r=z(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.hc.forEach(((i,a)=>{const c=a.view.Du(e);c.snapshot&&s.push(c.snapshot)})),(function(a,c){const l=z(a);l.onlineState=c;let h=!1;l.queries.forEach(((p,m)=>{for(const v of m.wu)v.Du(c)&&(h=!0)})),h&&Lc(l)})(r.eventManager,e),s.length&&r.Ec.hn(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Nv(n,e,t){const r=z(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Ic.get(e),i=s&&s.key;if(i){let a=new se(B.comparator);a=a.insert(i,Ie.newNoDocument(i,j.min()));const c=Q().add(i),l=new xs(j.min(),new Map,new se(Y),a,qe(),c);await op(r,l),r.Rc=r.Rc.remove(i),r.Ic.delete(e),Uc(r)}else await Sa(r.localStore,e,!1).then((()=>Va(r,e,t))).catch(gr)}async function Ov(n,e){const t=z(n),r=e.batch.batchId;try{const s=await KI(t.localStore,e);cp(t,r,null),ap(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Bs(t,s)}catch(s){await gr(s)}}async function Dv(n,e,t){const r=z(n);try{const s=await(function(a,c){const l=z(a);return l.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let p;return l.mutationQueue.lookupMutationBatch(h,c).next((m=>(M(m!==null,37113),p=m.keys(),l.mutationQueue.removeMutationBatch(h,m)))).next((()=>l.mutationQueue.performConsistencyCheck(h))).next((()=>l.documentOverlayCache.removeOverlaysForBatchId(h,p,c))).next((()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,p))).next((()=>l.localDocuments.getDocuments(h,p)))}))})(r.localStore,e);cp(r,e,t),ap(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Bs(r,s)}catch(s){await gr(s)}}function ap(n,e){(n.dc.get(e)||[]).forEach((t=>{t.resolve()})),n.dc.delete(e)}function cp(n,e,t){const r=z(n);let s=r.Vc[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.Vc[r.currentUser.toKey()]=s}}function Va(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Tc.get(e))n.hc.delete(r),t&&n.Ec.yc(r,t);n.Tc.delete(e),n.isPrimaryClient&&n.Ac.Xs(e).forEach((r=>{n.Ac.containsKey(r)||up(n,r)}))}function up(n,e){n.Pc.delete(e.path.canonicalString());const t=n.Rc.get(e);t!==null&&(Vc(n.remoteStore,t),n.Rc=n.Rc.remove(e),n.Ic.delete(t),Uc(n))}function dh(n,e,t){for(const r of t)r instanceof rp?(n.Ac.addReference(r.key,e),xv(n,r)):r instanceof sp?(D(Mc,"Document no longer in limbo: "+r.key),n.Ac.removeReference(r.key,e),n.Ac.containsKey(r.key)||up(n,r.key)):U(19791,{wc:r})}function xv(n,e){const t=e.key,r=t.path.canonicalString();n.Rc.get(t)||n.Pc.has(r)||(D(Mc,"New document in limbo: "+t),n.Pc.add(r),Uc(n))}function Uc(n){for(;n.Pc.size>0&&n.Rc.size<n.maxConcurrentLimboResolutions;){const e=n.Pc.values().next().value;n.Pc.delete(e);const t=new B(Z.fromString(e)),r=n.fc.next();n.Ic.set(r,new Av(t)),n.Rc=n.Rc.insert(t,r),Jf(n.remoteStore,new Ct(gt(tc(t.path)),r,"TargetPurposeLimboResolution",lo.yn))}}async function Bs(n,e,t){const r=z(n),s=[],i=[],a=[];r.hc.isEmpty()||(r.hc.forEach(((c,l)=>{a.push(r.gc(l,e,t).then((h=>{if((h||t)&&r.isPrimaryClient){const p=h?!h.fromCache:t?.targetChanges.get(l.targetId)?.current;r.sharedClientState.updateQueryState(l.targetId,p?"current":"not-current")}if(h){s.push(h);const p=Cc.fo(l.targetId,h);i.push(p)}})))})),await Promise.all(a),r.Ec.hn(s),await(async function(l,h){const p=z(l);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>C.forEach(h,(v=>C.forEach(v.Ao,(V=>p.persistence.referenceDelegate.addReference(m,v.targetId,V))).next((()=>C.forEach(v.Vo,(V=>p.persistence.referenceDelegate.removeReference(m,v.targetId,V)))))))))}catch(m){if(!_r(m))throw m;D(bc,"Failed to update sequence numbers: "+m)}for(const m of h){const v=m.targetId;if(!m.fromCache){const V=p.No.get(v),k=V.snapshotVersion,F=V.withLastLimboFreeSnapshotVersion(k);p.No=p.No.insert(v,F)}}})(r.localStore,i))}async function Lv(n,e){const t=z(n);if(!t.currentUser.isEqual(e)){D(Mc,"User change. New user:",e.toKey());const r=await Qf(t.localStore,e);t.currentUser=e,(function(i,a){i.dc.forEach((c=>{c.forEach((l=>{l.reject(new x(b.CANCELLED,a))}))})),i.dc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Bs(t,r.qo)}}function Mv(n,e){const t=z(n),r=t.Ic.get(e);if(r&&r.lc)return Q().add(r.key);{let s=Q();const i=t.Tc.get(e);if(!i)return s;for(const a of i??[]){const c=t.hc.get(a);s=s.unionWith(c.view.Yu)}return s}}function lp(n){const e=z(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=op.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Mv.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Nv.bind(null,e),e.Ec.hn=Ev.bind(null,e.eventManager),e.Ec.yc=Tv.bind(null,e.eventManager),e}function Uv(n){const e=z(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Ov.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Dv.bind(null,e),e}class Hi{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=co(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Sc(e),await this.persistence.start(),this.localStore=this.Dc(e),this.gcScheduler=this.xc(e,this.localStore),this.indexBackfillerScheduler=this.Cc(e,this.localStore)}xc(e,t){return null}Cc(e,t){return null}Dc(e){return WI(this.persistence,new GI,e.initialUser,this.serializer)}Sc(e){return new Kf(Sc.w_,this.serializer)}vc(e){return new pv}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Hi.provider={build:()=>new Hi};class Fv extends Hi{constructor(e){super(),this.cacheSizeBytes=e}xc(e,t){M(this.persistence.referenceDelegate instanceof qi,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new MT(r,e.asyncQueue,t)}Sc(e){const t=this.cacheSizeBytes!==void 0?Be.withCacheSize(this.cacheSizeBytes):Be.DEFAULT;return new Kf((r=>qi.w_(r,t)),this.serializer)}}class ka{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>hh(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Lv.bind(null,this.syncEngine),await dv(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new gv})()}createDatastore(e){const t=co(e.databaseInfo.databaseId),r=AT(e.databaseInfo);return bT(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,a,c){return new tv(r,s,i,a,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>hh(this.syncEngine,t,0)),(function(){return Ql.Je()?new Ql:new TT})())}createSyncEngine(e,t){return(function(s,i,a,c,l,h,p){const m=new Rv(s,i,a,c,l,h);return p&&(m.mc=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){const r=z(t);D(wt,"RemoteStore shutting down."),r.ca.add(5),await Fs(r),r.Ea.shutdown(),r.ha.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}ka.provider={build:()=>new ka};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Bv=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new x(b.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await(async function(s,i){const a=z(s),c={documents:i.map((m=>fs(a.serializer,m)))},l=await a.st("BatchGetDocuments",a.serializer.databaseId,Z.emptyPath(),c,i.length),h=new Map;l.forEach((m=>{const v=tT(a.serializer,m);h.set(v.key.toString(),v)}));const p=[];return i.forEach((m=>{const v=h.get(m.toString());M(!!v,55234,{key:m}),p.push(v)})),p})(this.datastore,e);return t.forEach((r=>this.recordVersion(r))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new io(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,r)=>{const s=B.fromPath(r);this.mutations.push(new qd(s,this.precondition(s)))})),await(async function(r,s){const i=z(r),a={writes:s.map((c=>hf(i.serializer,c)))};await i.tt("Commit",i.serializer.databaseId,Z.emptyPath(),a)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw U(50498,{Oc:e.constructor.name});t=j.min()}const r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new x(b.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(j.min())?Me.exists(!1):Me.updateTime(t):Me.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(j.min()))throw new x(b.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Me.updateTime(t)}return Me.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $v{constructor(e,t,r,s,i){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=s,this.deferred=i,this.Mc=r.maxAttempts,this.jt=new ac(this.asyncQueue,"transaction_retry")}Nc(){this.Mc-=1,this.Lc()}Lc(){this.jt.Ut((async()=>{const e=new Bv(this.datastore),t=this.Bc(e);t&&t.then((r=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(r)})).catch((s=>{this.Uc(s)}))))})).catch((r=>{this.Uc(r)}))}))}Bc(e){try{const t=this.updateFunction(e);return!Os(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}Uc(e){this.Mc>0&&this.kc(e)?(this.Mc-=1,this.asyncQueue.enqueueAndForget((()=>(this.Lc(),Promise.resolve())))):this.deferred.reject(e)}kc(e){if(e?.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!Zd(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dn="FirestoreClient";class jv{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=ke.UNAUTHENTICATED,this.clientId=Qa.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async a=>{D(dn,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(D(dn,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Vt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=xc(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function na(n,e){n.asyncQueue.verifyOperationInProgress(),D(dn,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await Qf(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function fh(n,e){n.asyncQueue.verifyOperationInProgress();const t=await qv(n);D(dn,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>ah(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>ah(e.remoteStore,s))),n._onlineComponents=e}async function qv(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){D(dn,"Using user provided OfflineComponentProvider");try{await na(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===b.FAILED_PRECONDITION||s.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;lt("Error using user provided cache. Falling back to memory cache: "+t),await na(n,new Hi)}}else D(dn,"Using default OfflineComponentProvider"),await na(n,new Fv(void 0));return n._offlineComponents}async function Fc(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(D(dn,"Using user provided OnlineComponentProvider"),await fh(n,n._uninitializedComponentsProvider._online)):(D(dn,"Using default OnlineComponentProvider"),await fh(n,new ka))),n._onlineComponents}function Gv(n){return Fc(n).then((e=>e.syncEngine))}function Hv(n){return Fc(n).then((e=>e.datastore))}async function zv(n){const e=await Fc(n),t=e.eventManager;return t.onListen=Pv.bind(null,e.syncEngine),t.onUnlisten=bv.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Sv.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Vv.bind(null,e.syncEngine),t}function Wv(n,e,t={}){const r=new Vt;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,c,l,h){const p=new fv({next:v=>{p.Aa(),a.enqueueAndForget((()=>yv(i,m)));const V=v.docs.has(c);!V&&v.fromCache?h.reject(new x(b.UNAVAILABLE,"Failed to get document because the client is offline.")):V&&v.fromCache&&l&&l.source==="server"?h.reject(new x(b.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(v)},error:v=>h.reject(v)}),m=new wv(tc(c.path),p,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return _v(i,m)})(await zv(n),n.asyncQueue,e,t,r))),r.promise}function Kv(n,e){const t=new Vt;return n.asyncQueue.enqueueAndForget((async()=>kv(await Gv(n),e,t))),t.promise}function Qv(n,e,t){const r=new Vt;return n.asyncQueue.enqueueAndForget((async()=>{const s=await Hv(n);new $v(n.asyncQueue,s,t,e,r).Nc()})),r.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ph="AsyncQueue";class mh{constructor(e=Promise.resolve()){this.Wc=[],this.Qc=!1,this.Gc=[],this.zc=null,this.jc=!1,this.Hc=!1,this.Jc=[],this.jt=new ac(this,"async_queue_retry"),this.Yc=()=>{const r=ta();r&&D(ph,"Visibility state changed to "+r.visibilityState),this.jt.qt()},this.Zc=e;const t=ta();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Yc)}get isShuttingDown(){return this.Qc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Xc(),this.el(e)}enterRestrictedMode(e){if(!this.Qc){this.Qc=!0,this.Hc=e||!1;const t=ta();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Yc)}}enqueue(e){if(this.Xc(),this.Qc)return new Promise((()=>{}));const t=new Vt;return this.el((()=>this.Qc&&this.Hc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Wc.push(e),this.tl())))}async tl(){if(this.Wc.length!==0){try{await this.Wc[0](),this.Wc.shift(),this.jt.reset()}catch(e){if(!_r(e))throw e;D(ph,"Operation failed with retryable error: "+e)}this.Wc.length>0&&this.jt.Ut((()=>this.tl()))}}el(e){const t=this.Zc.then((()=>(this.jc=!0,e().catch((r=>{throw this.zc=r,this.jc=!1,xt("INTERNAL UNHANDLED ERROR: ",gh(r)),r})).then((r=>(this.jc=!1,r))))));return this.Zc=t,t}enqueueAfterDelay(e,t,r){this.Xc(),this.Jc.indexOf(e)>-1&&(t=0);const s=Dc.createAndSchedule(this,e,t,r,(i=>this.nl(i)));return this.Gc.push(s),s}Xc(){this.zc&&U(47125,{rl:gh(this.zc)})}verifyOperationInProgress(){}async il(){let e;do e=this.Zc,await e;while(e!==this.Zc)}sl(e){for(const t of this.Gc)if(t.timerId===e)return!0;return!1}_l(e){return this.il().then((()=>{this.Gc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.Gc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.il()}))}ol(e){this.Jc.push(e)}nl(e){const t=this.Gc.indexOf(e);this.Gc.splice(t,1)}}function gh(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class $s extends cc{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new mh,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new mh(e),this._firestoreClient=void 0,await e}}}function HR(n,e){const t=typeof n=="object"?n:Ji(),r=typeof n=="string"?n:Ni,s=Un(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Rm("firestore");i&&BT(s,...i)}return s}function Bc(n){if(n._terminated)throw new x(b.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Yv(n),n._firestoreClient}function Yv(n){const e=n._freezeSettings(),t=kT(n._databaseId,n._app?.options.appId||"",n._persistenceKey,n._app?.options.apiKey,e);n._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new jv(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(s){const i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hp{convertValue(e,t="none"){switch(me(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ie(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(sn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw U(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return mn(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){const t=e.fields?.[as].arrayValue?.values?.map((r=>ie(r.doubleValue)));return new Ge(t)}convertGeoPoint(e){return new _t(ie(e.latitude),ie(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Ns(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(ir(e));default:return null}}convertTimestamp(e){const t=rn(e);return new re(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=Z.fromString(e);M(pf(r),9688,{name:e});const s=new is(r.get(1),r.get(3)),i=new B(r.popFirst(5));return s.isEqual(t)||xt(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp extends hp{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ye(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new he(this.firestore,null,t)}}const _h="@firebase/firestore",yh="4.17.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zi=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new he(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Jv(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){const t=this._document.data.field(ur("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},Jv=class extends zi{data(){return super.data()}};function fp(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}class Xv extends hp{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ye(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new he(this.firestore,null,t)}}class Yn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class nn extends zi{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ii(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(ur("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new x(b.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=nn._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}nn._jsonSchemaVersion="firestore/documentSnapshot/1.0",nn._jsonSchema={type:le("string",nn._jsonSchemaVersion),bundleSource:le("string","DocumentSnapshot"),bundleName:le("string"),bundle:le("string")};class Ii extends nn{data(e={}){return super.data(e)}}class ts{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Yn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Ii(this._firestore,this._userDataWriter,r.key,r,new Yn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new x(b.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((c=>{Ee(s._snapshot.query)?Pa(s._snapshot.query):nc(s.query._query);const l=new Ii(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Yn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:l,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{const l=new Ii(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Yn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,p=-1;return c.type!==0&&(h=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),p=a.indexOf(c.doc.key)),{type:Zv(c.type),doc:l,oldIndex:h,newIndex:p}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new x(b.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ts._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Qa.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Zv(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return U(61501,{type:n})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ts._jsonSchemaVersion="firestore/querySnapshot/1.0",ts._jsonSchema={type:le("string",ts._jsonSchemaVersion),bundleSource:le("string","QuerySnapshot"),bundleName:le("string"),bundle:le("string")};const eA={maxAttempts:5};function Hr(n,e){if((n=fe(n)).firestore!==e)throw new x(b.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tA=class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=Af(e)}get(e){const t=Hr(e,this._firestore),r=new Xv(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return U(24041);const i=s[0];if(i.isFoundDocument())return new zi(this._firestore,r,i.key,i,t.converter);if(i.isNoDocument())return new zi(this._firestore,r,t._key,null,t.converter);throw U(18433,{doc:i})}))}set(e,t,r){const s=Hr(e,this._firestore),i=fp(s.converter,t,r),a=Rf(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,r);return this._transaction.set(s._key,a),this}update(e,t,r,...s){const i=Hr(e,this._firestore);let a;return a=typeof(t=fe(t))=="string"||t instanceof uo?HT(this._dataReader,"Transaction.update",i._key,t,r,s):GT(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,a),this}delete(e){const t=Hr(e,this._firestore);return this._transaction.delete(t._key),this}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nA extends tA{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Hr(e,this._firestore),r=new dp(this._firestore);return super.get(e).then((s=>new nn(this._firestore,r,t._key,s._document,new Yn(!1,!1),t.converter)))}}function QR(n,e,t){n=Ln(n,$s);const r={...eA,...t};(function(a){if(a.maxAttempts<1)throw new x(b.INVALID_ARGUMENT,"Max attempts must be at least 1")})(r);const s=Bc(n);return Qv(s,(i=>e(new nA(n,i))),r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YR(n){n=Ln(n,he);const e=Ln(n.firestore,$s),t=Bc(e);return Wv(t,n._key).then((r=>rA(e,n,r)))}function JR(n,e,t){n=Ln(n,he);const r=Ln(n.firestore,$s),s=fp(n.converter,e,t),i=Af(r);return pp(r,[Rf(i,"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,Me.none())])}function XR(n){return pp(Ln(n.firestore,$s),[new io(n._key,Me.none())])}function pp(n,e){const t=Bc(n);return Kv(t,e)}function rA(n,e,t){const r=t.docs.get(e._key),s=new dp(n);return new nn(n,s,e._key,r,new Yn(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){tE(fr),Ot(new yt("firestore",((r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),c=new $s(new gT(r.getProvider("auth-internal")),new ET(a,r.getProvider("app-check-internal")),hE(a,s),a);return i={useFetchStreams:t,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),ct(_h,yh,e),ct(_h,yh,"esm2020")})();var Eh="@firebase/ai",Na="2.14.0";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vn="AI",sA="us-central1",iA="global",oA="firebasevertexai.googleapis.com",hr="v1beta",Th=Na,aA="gl-js",cA="hybrid",uA=180*1e3,lA="gemini-2.5-flash-lite";/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H extends It{constructor(e,t,r){const s=Vn,i=`${s}/${e}`,a=`${s}: ${t} (${i})`;super(e,a),this.code=e,this.customErrorData=r,Error.captureStackTrace&&Error.captureStackTrace(this,H),Object.setPrototypeOf(this,H.prototype),this.toString=()=>a}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wh=["user","model","function","system"],mp={HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"},Ve={SAFETY:"SAFETY",RECITATION:"RECITATION",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"},at={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},Ht={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vt={AGENT_PLATFORM:"AGENT_PLATFORM",VERTEX_AI:"VERTEX_AI",GOOGLE_AI:"GOOGLE_AI"};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $c{constructor(e){this.backendType=e}}class jc extends $c{constructor(){super(vt.GOOGLE_AI)}_getModelPath(e,t){return`/${hr}/projects/${e}/${t}`}_getTemplatePath(e,t){return`/${hr}/projects/${e}/templates/${t}`}}class qc extends $c{constructor(e){super(vt.VERTEX_AI),this.location=sA,e&&(this.location=e)}_getModelPath(e,t){return`/${hr}/projects/${e}/locations/${this.location}/${t}`}_getTemplatePath(e,t){return`/${hr}/projects/${e}/locations/${this.location}/templates/${t}`}}class Gc extends $c{constructor(e){super(vt.AGENT_PLATFORM),this.location=iA,e&&(this.location=e)}_getModelPath(e,t){return`/${hr}/projects/${e}/locations/${this.location}/${t}`}_getTemplatePath(e,t){return`/${hr}/projects/${e}/locations/${this.location}/templates/${t}`}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hA(n){if(n instanceof jc)return`${Vn}/googleai`;if(n instanceof qc)return`${Vn}/vertexai/${n.location}`;if(n instanceof Gc)return`${Vn}/agentplatform/${n.location}`;throw new H(G.ERROR,`Invalid backend: ${JSON.stringify(n.backendType)}`)}function dA(n){const e=n.split("/");if(e[0]!==Vn)throw new H(G.ERROR,`Invalid instance identifier, unknown prefix '${e[0]}'`);switch(e[1]){case"vertexai":const r=e[2];if(!r)throw new H(G.ERROR,`Invalid instance identifier, unknown location '${n}'`);return new qc(r);case"agentplatform":const s=e[2];if(!s)throw new H(G.ERROR,`Invalid instance identifier, unknown location '${n}'`);return new Gc(s);case"googleai":return new jc;default:throw new H(G.ERROR,`Invalid instance identifier string: '${n}'`)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _e=new Rs("@firebase/vertexai");var At;(function(n){n.UNAVAILABLE="unavailable",n.DOWNLOADABLE="downloadable",n.DOWNLOADING="downloading",n.AVAILABLE="available"})(At||(At={}));/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gp={type:"text",languages:["en"]},ra=[gp,{type:"image"}],sa=[gp];class it{constructor(e,t,r){this.languageModelProvider=e,this.mode=t,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:ra,expectedOutputs:sa}},r&&(this.onDeviceParams=r,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=ra),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=sa)):this.onDeviceParams.createOptions={expectedInputs:ra,expectedOutputs:sa})}async isAvailable(e){if(!this.mode)return _e.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===at.ONLY_IN_CLOUD)return _e.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;const t=await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);if(this.mode===at.ONLY_ON_DEVICE){if(t===At.UNAVAILABLE)throw new H(G.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(t===At.DOWNLOADABLE||t===At.DOWNLOADING){_e.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(r){throw new H(G.ERROR,r.message)}return!0}return!0}return t!==At.AVAILABLE?(_e.debug(`On-device inference unavailable because availability is "${t}".`),!1):it.isOnDeviceRequest(e)?!0:(_e.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(e){const t=await this.createSession(),r=await Promise.all(e.contents.map(it.toLanguageModelMessage)),s=await t.prompt(r,this.onDeviceParams.promptOptions);return it.toResponse(s)}async generateContentStream(e){const t=await this.createSession(),r=await Promise.all(e.contents.map(it.toLanguageModelMessage)),s=t.promptStreaming(r,this.onDeviceParams.promptOptions);return it.toStreamResponse(s)}async countTokens(e){throw new H(G.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(e){if(e.contents.length===0)return _e.debug("Empty prompt rejected for on-device inference."),!1;for(const t of e.contents){if(t.role==="function")return _e.debug('"Function" role rejected for on-device inference.'),!1;for(const r of t.parts)if(r.inlineData&&it.SUPPORTED_MIME_TYPES.indexOf(r.inlineData.mimeType)===-1)return _e.debug(`Unsupported mime type "${r.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(e){const t=await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);return(t===At.DOWNLOADABLE||t===At.DOWNLOADING)&&this.download(e),t}download(e){if(this.downloadPromise)return;const t={...this.onDeviceParams.createOptions};t&&!t.monitor&&e&&(t.monitor=r=>{r.addEventListener("downloadprogress",s=>{e(s.loaded)})}),this.downloadPromise=this.languageModelProvider?.create(t).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(e){const t=await Promise.all(e.parts.map(it.toLanguageModelMessageContent));return{role:it.toLanguageModelMessageRole(e.role),content:t}}static async toLanguageModelMessageContent(e){if(e.text)return{type:"text",value:e.text};if(e.inlineData){const r=await(await fetch(`data:${e.inlineData.mimeType};base64,${e.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(r)}}throw new H(G.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(e){return e==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new H(G.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");const e=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=e,e}static toResponse(e){return{json:async()=>({candidates:[{content:{parts:[{text:e}]}}]})}}static toStreamResponse(e){const t=new TextEncoder;return{body:e.pipeThrough(new TransformStream({transform(r,s){const i=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:r}]}}]});s.enqueue(t.encode(`data: ${i}

`))}}))}}}it.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function fA(n,e,t){if(typeof e<"u"&&n)return new it(e.LanguageModel,n,t)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pA{constructor(e,t,r,s,i){this.app=e,this.backend=t,this.chromeAdapterFactory=i;const a=s?.getImmediate({optional:!0}),c=r?.getImmediate({optional:!0});this.auth=c||null,this.appCheck=a||null,t instanceof qc||t instanceof Gc?this.location=t.location:this.location=""}_delete(){return Promise.resolve()}set options(e){this._options=e}get options(){return this._options}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mA(n,{instanceIdentifier:e}){if(!e)throw new H(G.ERROR,"AIService instance identifier is undefined.");const t=dA(e),r=n.getProvider("app").getImmediate(),s=n.getProvider("auth-internal"),i=n.getProvider("app-check-internal");return new pA(r,t,s,i,fA)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gA(n){if(n.app?.options?.apiKey)if(n.app?.options?.projectId){if(!n.app?.options?.appId)throw new H(G.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new H(G.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new H(G.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');const e={apiKey:n.app.options.apiKey,project:n.app.options.projectId,appId:n.app.options.appId,automaticDataCollectionEnabled:n.app.automaticDataCollectionEnabled,location:n.location,backend:n.backend};if(je(n.app)&&n.app.settings.appCheckToken){const t=n.app.settings.appCheckToken;e.getAppCheckToken=()=>Promise.resolve({token:t})}else n.appCheck&&(n.options?.useLimitedUseAppCheckTokens?e.getAppCheckToken=()=>n.appCheck.getLimitedUseToken():e.getAppCheckToken=()=>n.appCheck.getToken());return n.auth&&(e.getAuthToken=()=>n.auth.getToken()),e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e,t){this._apiSettings=gA(e),this.model=ns.normalizeModelName(t,this._apiSettings.backend.backendType)}static normalizeModelName(e,t){return t===vt.GOOGLE_AI?ns.normalizeGoogleAIModelName(e):ns.normalizeVertexAIModelName(e)}static normalizeGoogleAIModelName(e){return`models/${e}`}static normalizeVertexAIModelName(e){let t;return e.includes("/")?e.startsWith("models/")?t=`publishers/google/${e}`:t=e:t=`publishers/google/models/${e}`,t}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _A="Timeout has expired.",ia="AbortError";class yA{constructor(e){this.params=e}toString(){const e=new URL(this.baseUrl);return e.pathname=this.pathname,e.search=this.queryParams.toString(),e.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){return this.params.singleRequestOptions?.baseUrl??`https://${oA}`}get queryParams(){const e=new URLSearchParams;return this.params.stream&&e.set("alt","sse"),e}}function EA(n){const e=[];return e.push(`${aA}/${Th}`),e.push(`fire/${Th}`),(n.params.apiSettings.inferenceMode===at.PREFER_ON_DEVICE||n.params.apiSettings.inferenceMode===at.PREFER_IN_CLOUD)&&e.push(cA),e.join(" ")}async function TA(n){const e=new Headers;if(e.append("Content-Type","application/json"),e.append("x-goog-api-client",EA(n)),e.append("x-goog-api-key",n.params.apiSettings.apiKey),n.params.apiSettings.automaticDataCollectionEnabled&&e.append("X-Firebase-Appid",n.params.apiSettings.appId),n.params.apiSettings.getAppCheckToken){const t=await n.params.apiSettings.getAppCheckToken();t&&(e.append("X-Firebase-AppCheck",t.token),t.error&&_e.warn(`Unable to obtain a valid App Check token: ${t.error.message}`))}if(n.params.apiSettings.getAuthToken){const t=await n.params.apiSettings.getAuthToken();t&&e.append("Authorization",`Firebase ${t.accessToken}`)}return e}async function Hc(n,e){const t=new yA(n);let r;const s=n.singleRequestOptions?.signal,i=n.singleRequestOptions?.timeout!=null&&n.singleRequestOptions.timeout>=0?n.singleRequestOptions.timeout:uA,a=new AbortController,c=setTimeout(()=>{a.abort(new DOMException(_A,ia)),_e.debug(`Aborting request to ${t} due to timeout (${i}ms)`)},i),l=AbortSignal.any(s?[s,a.signal]:[a.signal]);if(s&&s.aborted)throw clearTimeout(c),new DOMException(s.reason??"Aborted externally before fetch",ia);try{const h={method:"POST",headers:await TA(t),signal:l,body:e};if(r=await fetch(t.toString(),h),!r.ok){let p="",m;try{const v=await r.json();p=v.error.message,v.error.details&&(p+=` ${JSON.stringify(v.error.details)}`,m=v.error.details)}catch{}throw r.status===403&&m&&m.some(v=>v.reason==="SERVICE_DISABLED")&&m.some(v=>v.links?.[0]?.description.includes("Google developers console API activation"))?new H(G.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${t.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:r.status,statusText:r.statusText,errorDetails:m}):new H(G.FETCH_ERROR,`Error fetching from ${t}: [${r.status} ${r.statusText}] ${p}`,{status:r.status,statusText:r.statusText,errorDetails:m})}}catch(h){let p=h;throw h.code!==G.FETCH_ERROR&&h.code!==G.API_NOT_ENABLED&&h instanceof Error&&h.name!==ia&&(p=new H(G.ERROR,`Error fetching from ${t.toString()}: ${h.message}`),p.stack=h.stack),p}finally{clearTimeout(c)}return r}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function li(n){if(n.candidates&&n.candidates.length>0){if(n.candidates.length>1&&_e.warn(`This response had ${n.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),yp(n.candidates[0]))throw new H(G.RESPONSE_ERROR,`Response error: ${Sn(n)}. Response body stored in error.response`,{response:n});return!0}else return!1}function Wi(n,e=Ht.IN_CLOUD){n.candidates&&!n.candidates[0].hasOwnProperty("index")&&(n.candidates[0].index=0);const t=wA(n);return t.inferenceSource=e,t}function wA(n){return n.text=()=>{if(li(n))return Ih(n,e=>!e.thought);if(n.promptFeedback)throw new H(G.RESPONSE_ERROR,`Text not available. ${Sn(n)}`,{response:n});return""},n.thoughtSummary=()=>{if(li(n)){const e=Ih(n,t=>!!t.thought);return e===""?void 0:e}else if(n.promptFeedback)throw new H(G.RESPONSE_ERROR,`Thought summary not available. ${Sn(n)}`,{response:n})},n.inlineDataParts=()=>{if(li(n))return IA(n);if(n.promptFeedback)throw new H(G.RESPONSE_ERROR,`Data not available. ${Sn(n)}`,{response:n})},n.functionCalls=()=>{if(li(n))return _p(n);if(n.promptFeedback)throw new H(G.RESPONSE_ERROR,`Function call not available. ${Sn(n)}`,{response:n})},n}function Ih(n,e){const t=[];if(n.candidates?.[0].content?.parts)for(const r of n.candidates?.[0].content?.parts)r.text&&e(r)&&t.push(r.text);return t.length>0?t.join(""):""}function _p(n){if(!n)return;const e=[];if(n.candidates?.[0].content?.parts)for(const t of n.candidates?.[0].content?.parts)t.functionCall&&e.push(t.functionCall);if(e.length>0)return e}function IA(n){const e=[];if(n.candidates?.[0].content?.parts)for(const t of n.candidates?.[0].content?.parts)t.inlineData&&e.push(t);if(e.length>0)return e}const vA=[Ve.RECITATION,Ve.SAFETY,Ve.BLOCKLIST,Ve.PROHIBITED_CONTENT,Ve.SPII,Ve.MALFORMED_FUNCTION_CALL,Ve.IMAGE_SAFETY,Ve.IMAGE_PROHIBITED_CONTENT,Ve.IMAGE_OTHER,Ve.NO_IMAGE,Ve.IMAGE_RECITATION,Ve.LANGUAGE,Ve.UNEXPECTED_TOOL_CALL,Ve.TOO_MANY_TOOL_CALLS,Ve.MISSING_THOUGHT_SIGNATURE,Ve.MALFORMED_RESPONSE];function yp(n){return!!n.finishReason&&vA.some(e=>e===n.finishReason)}function Sn(n){let e="";if((!n.candidates||n.candidates.length===0)&&n.promptFeedback)e+="Response was blocked",n.promptFeedback?.blockReason&&(e+=` due to ${n.promptFeedback.blockReason}`),n.promptFeedback?.blockReasonMessage&&(e+=`: ${n.promptFeedback.blockReasonMessage}`);else if(n.candidates?.[0]){const t=n.candidates[0];yp(t)&&(e+=`Candidate was blocked due to ${t.finishReason}`,t.finishMessage&&(e+=`: ${t.finishMessage}`))}return e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ep(n){if(n.safetySettings?.forEach(e=>{if(e.method)throw new H(G.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),n.generationConfig?.topK){const e=Math.round(n.generationConfig.topK);e!==n.generationConfig.topK&&(_e.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),n.generationConfig.topK=e)}return n}function zc(n){return{candidates:n.candidates?RA(n.candidates):void 0,prompt:n.promptFeedback?PA(n.promptFeedback):void 0,usageMetadata:n.usageMetadata}}function AA(n,e){return{generateContentRequest:{model:e,...n}}}function RA(n){const e=[];let t;return e&&n.forEach(r=>{let s;if(r.citationMetadata&&(s={citations:r.citationMetadata.citationSources}),r.safetyRatings&&(t=r.safetyRatings.map(a=>({...a,severity:a.severity??mp.HARM_SEVERITY_UNSUPPORTED,probabilityScore:a.probabilityScore??0,severityScore:a.severityScore??0}))),r.content?.parts?.some(a=>a?.videoMetadata))throw new H(G.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");const i={index:r.index,content:r.content,finishReason:r.finishReason,finishMessage:r.finishMessage,safetyRatings:t,citationMetadata:s,groundingMetadata:r.groundingMetadata,urlContextMetadata:r.urlContextMetadata};e.push(i)}),e}function PA(n){const e=[];return n.safetyRatings.forEach(r=>{e.push({category:r.category,probability:r.probability,severity:r.severity??mp.HARM_SEVERITY_UNSUPPORTED,probabilityScore:r.probabilityScore??0,severityScore:r.severityScore??0,blocked:r.blocked})}),{blockReason:n.blockReason,safetyRatings:e,blockReasonMessage:n.blockReasonMessage}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vh=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function SA(n,e,t){const r=n.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),s=kA(r),[i,a]=s.tee(),{response:c,firstValue:l}=await CA(a,e,t);return{stream:VA(i,e,t),response:c,firstValue:l}}async function CA(n,e,t){const[r,s]=n.tee(),i=r.getReader(),{value:a}=await i.read();return{firstValue:a,response:bA(s,e,t)}}async function bA(n,e,t){const r=[],s=n.getReader();for(;;){const{done:i,value:a}=await s.read();if(i){let c=NA(r);return e.backend.backendType===vt.GOOGLE_AI&&(c=zc(c)),Wi(c,t)}r.push(a)}}async function*VA(n,e,t){const r=n.getReader();for(;;){const{value:s,done:i}=await r.read();if(i)break;let a;e.backend.backendType===vt.GOOGLE_AI?a=Wi(zc(s),t):a=Wi(s,t);const c=a.candidates?.[0];!c?.content?.parts&&!c?.finishReason&&!c?.citationMetadata&&!c?.urlContextMetadata||(yield a)}}function kA(n){const e=n.getReader();return new ReadableStream({start(r){let s="";return i();function i(){return e.read().then(({value:a,done:c})=>{if(c){if(s.trim()){r.error(new H(G.PARSE_FAILED,"Failed to parse stream"));return}r.close();return}s+=a;let l=s.match(vh),h;for(;l;){try{h=JSON.parse(l[1])}catch{r.error(new H(G.PARSE_FAILED,`Error parsing JSON response: "${l[1]}`));return}r.enqueue(h),s=s.substring(l[0].length),l=s.match(vh)}return i()})}}})}function NA(n){const t={promptFeedback:n[n.length-1]?.promptFeedback};for(const r of n)if(r.candidates)for(const s of r.candidates){const i=s.index||0;t.candidates||(t.candidates=[]),t.candidates[i]||(t.candidates[i]={index:s.index}),t.candidates[i].citationMetadata=s.citationMetadata,t.candidates[i].finishReason=s.finishReason,t.candidates[i].finishMessage=s.finishMessage,t.candidates[i].safetyRatings=s.safetyRatings,t.candidates[i].groundingMetadata=s.groundingMetadata;const a=s.urlContextMetadata;if(typeof a=="object"&&a!==null&&Object.keys(a).length>0&&(t.candidates[i].urlContextMetadata=a),s.content){if(!s.content.parts)continue;t.candidates[i].content||(t.candidates[i].content={role:s.content.role||"user",parts:[]});for(const c of s.content.parts){const l={...c};c.text!==""&&Object.keys(l).length>0&&t.candidates[i].content.parts.push(l)}}}return t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OA=[G.FETCH_ERROR,G.ERROR,G.API_NOT_ENABLED];async function Tp(n,e,t,r){if(!e)return{response:await r(),inferenceSource:Ht.IN_CLOUD};switch(e.mode){case at.ONLY_ON_DEVICE:if(await e.isAvailable(n))return{response:await t(),inferenceSource:Ht.ON_DEVICE};throw new H(G.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case at.ONLY_IN_CLOUD:return{response:await r(),inferenceSource:Ht.IN_CLOUD};case at.PREFER_IN_CLOUD:try{return{response:await r(),inferenceSource:Ht.IN_CLOUD}}catch(s){if(s instanceof H&&OA.includes(s.code)&&await e.isAvailable(n))return{response:await t(),inferenceSource:Ht.ON_DEVICE};throw s}case at.PREFER_ON_DEVICE:return await e.isAvailable(n)?{response:await t(),inferenceSource:Ht.ON_DEVICE}:{response:await r(),inferenceSource:Ht.IN_CLOUD};default:throw new H(G.ERROR,`Unexpected infererence mode: ${e.mode}`)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function DA(n,e,t,r){return n.backend.backendType===vt.GOOGLE_AI&&(t=Ep(t)),Hc({task:"streamGenerateContent",model:e,apiSettings:n,stream:!0,singleRequestOptions:r},JSON.stringify(t))}async function wp(n,e,t,r,s){const i=await Tp(t,r,()=>r.generateContentStream(t),()=>DA(n,e,t,s));return SA(i.response,n,i.inferenceSource)}async function xA(n,e,t,r){return n.backend.backendType===vt.GOOGLE_AI&&(t=Ep(t)),Hc({model:e,task:"generateContent",apiSettings:n,stream:!1,singleRequestOptions:r},JSON.stringify(t))}async function Ip(n,e,t,r,s){const i=await Tp(t,r,()=>r.generateContent(t),()=>xA(n,e,t,s)),a=await LA(i.response,n);return{response:Wi(a,i.inferenceSource)}}async function LA(n,e){const t=await n.json();return e.backend.backendType===vt.GOOGLE_AI?zc(t):t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wc(n){if(n!=null){if(typeof n=="string")return{role:"system",parts:[{text:n}]};if(n.text)return{role:"system",parts:[n]};if(n.parts)return n.role?n:{role:"system",parts:n.parts}}}function zr(n){let e=[];if(typeof n=="string")e=[{text:n}];else for(const t of n)typeof t=="string"?e.push({text:t}):e.push(t);return MA(e)}function MA(n){const e={role:"user",parts:[]},t={role:"function",parts:[]};let r=!1,s=!1;for(const i of n)"functionResponse"in i?(t.parts.push(i),s=!0):(e.parts.push(i),r=!0);if(r&&s)throw new H(G.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!r&&!s)throw new H(G.INVALID_CONTENT,"No Content is provided for sending chat message.");return r?e:t}function oa(n){let e;return n.contents?e=n:e={contents:[zr(n)]},n.systemInstruction&&(e.systemInstruction=Wc(n.systemInstruction)),e}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ah="SILENT_ERROR",Rh=10;class UA{constructor(e,t,r){this.params=t,this.requestOptions=r,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=e}async getHistory(){return await this._sendPromise,this._history}async _sendMessage(e,t){let r={};await this._sendPromise;const s=[];return this._sendPromise=this._sendPromise.then(async()=>{let i,a=0;const c=this.requestOptions?.maxSequentialFunctionCalls??Rh;do{let l;if(i){a++;const m=await this._callFunctionsAsNeeded(i);l=zr(m)}else l=zr(e);const h=this._formatRequest(l,[...s]);s.push(l);const p=await this._callGenerateContent(h,t);if(p)if(r=p,i=this._getCallableFunctionCalls(p.response),p.response.candidates&&p.response.candidates.length>0){const m={parts:p.response.candidates?.[0].content.parts||[],role:p.response.candidates?.[0].content.role||"model"};s.push(m)}else{const m=Sn(p.response);m&&_e.warn(`sendMessage() was unsuccessful. ${m}. Inspect response object for details.`)}else i=void 0}while(i&&a<c);i&&a>=c&&_e.warn(`Automatic function calling exceeded the limit of ${c} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(s),r}async _sendMessageStream(e,t){await this._sendPromise;const r=[],i=(async()=>{let a,c=0;const l=this.requestOptions?.maxSequentialFunctionCalls??Rh;let h;do{let p;if(a){c++;const v=await this._callFunctionsAsNeeded(a);p=zr(v)}else p=zr(e);const m=this._formatRequest(p,[...r]);if(r.push(p),h=await this._callGenerateContentStream(m,t),a=this._getCallableFunctionCalls(h.firstValue),a&&h.firstValue&&h.firstValue.candidates&&h.firstValue.candidates.length>0){const v={...h.firstValue.candidates[0].content};v.role||(v.role="model"),r.push(v)}}while(a&&c<l);return a&&c>=l&&_e.warn(`Automatic function calling exceeded the limit of ${l} function calls. Returning last model response.`),{stream:h.stream,response:h.response}})();return this._sendPromise=this._sendPromise.then(async()=>i).catch(a=>{throw new Error(Ah)}).then(a=>a.response).then(a=>{if(a.candidates&&a.candidates.length>0){this._history=this._history.concat(r);const c={...a.candidates[0].content};c.role||(c.role="model"),this._history.push(c)}else{const c=Sn(a);c&&_e.warn(`sendMessageStream() was unsuccessful. ${c}. Inspect response object for details.`)}}).catch(a=>{a.message!==Ah&&a.name!=="AbortError"&&_e.error(a)}),i}_getCallableFunctionCalls(e){const t=this.params?.tools?.find(s=>s.functionDeclarations);if(!t?.functionDeclarations)return;const r=_p(e);if(r){for(const s of r)if(!t.functionDeclarations?.some(a=>a.name===s.name&&typeof a.functionReference=="function"))return;return r}}async _callFunctionsAsNeeded(e){const t=[],r=[],s=this.params?.tools?.find(i=>i.functionDeclarations);if(s&&s.functionDeclarations){for(const a of e){const c=s.functionDeclarations.find(l=>l.name===a.name);if(c?.functionReference){const l=Promise.resolve(c.functionReference(a.args)).catch(h=>{const p=new H(G.ERROR,`Error in user-defined function "${c.name}": ${h.message}`);throw p.stack=h.stack,p});t.push({name:a.name,id:a.id,results:l}),r.push(l)}}await Promise.all(r);const i=[];for(const{name:a,id:c,results:l}of t){const h={name:a,response:await l};c&&(h.id=c),i.push({functionResponse:h})}return i}else throw new H(G.REQUEST_ERROR,'No function declarations were provided in "tools".')}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ph=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],FA={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},Sh={user:["model"],function:["model"],model:["user","function"],system:[]};function BA(n){let e=null;for(const t of n){const{role:r,parts:s}=t;if(!e&&r!=="user")throw new H(G.INVALID_CONTENT,`First Content should be with role 'user', got ${r}`);if(!wh.includes(r))throw new H(G.INVALID_CONTENT,`Each item should include role field. Got ${r} but valid roles are: ${JSON.stringify(wh)}`);if(!Array.isArray(s))throw new H(G.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(s.length===0)throw new H(G.INVALID_CONTENT,"Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,executableCode:0,codeExecutionResult:0};for(const c of s)for(const l of Ph)l in c&&(i[l]+=1);const a=FA[r];for(const c of Ph)if(!a.includes(c)&&i[c]>0)throw new H(G.INVALID_CONTENT,`Content with role '${r}' can't contain '${c}' part`);if(e&&!Sh[r].includes(e.role))throw new H(G.INVALID_CONTENT,`Content with role '${r}' can't follow '${e.role}'. Valid previous roles: ${JSON.stringify(Sh)}`);e=t}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $A extends UA{constructor(e,t,r,s,i){super(e,s,i),this.model=t,this.chromeAdapter=r,this.params=s,this.requestOptions=i,s?.history&&(BA(s.history),this._history=s.history),this.params?.systemInstruction!=null&&(this.params={...this.params,systemInstruction:Wc(this.params.systemInstruction)})}_formatRequest(e,t){return{safetySettings:this.params?.safetySettings,generationConfig:this.params?.generationConfig,tools:this.params?.tools,toolConfig:this.params?.toolConfig,systemInstruction:this.params?.systemInstruction,contents:[...this._history,...t,e]}}_callGenerateContent(e,t){return Ip(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...t})}_callGenerateContentStream(e,t){return wp(this._apiSettings,this.model,e,this.chromeAdapter,{...this.requestOptions,...t})}async sendMessage(e,t){return this._sendMessage(e,t)}async sendMessageStream(e,t){return this._sendMessageStream(e,t)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jA(n,e,t,r){let s="";if(n.backend.backendType===vt.GOOGLE_AI){const a=AA(t,e);s=JSON.stringify(a)}else s=JSON.stringify(t);return(await Hc({model:e,task:"countTokens",apiSettings:n,stream:!1,singleRequestOptions:r},s)).json()}async function qA(n,e,t,r,s){if(r?.mode===at.ONLY_ON_DEVICE)throw new H(G.UNSUPPORTED,"countTokens() is not supported for on-device models.");return jA(n,e,t,s)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GA extends ns{constructor(e,t,r,s){super(e,t.model),this.chromeAdapter=s,this.generationConfig=t.generationConfig||{},HA(this.generationConfig),this.safetySettings=t.safetySettings||[],this.tools=t.tools,this.toolConfig=t.toolConfig,this.systemInstruction=Wc(t.systemInstruction),this.requestOptions=r||{}}async initializeDeviceModel(e){if(!this.chromeAdapter||this.chromeAdapter.mode===at.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(e)===At.UNAVAILABLE){const r=new H(G.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===at.ONLY_ON_DEVICE)throw r;_e.debug(r.message)}await this.chromeAdapter.downloadPromise}async generateContent(e,t){const r=oa(e);return Ip(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...r},this.chromeAdapter,{...this.requestOptions,...t})}async generateContentStream(e,t){const r=oa(e),{stream:s,response:i}=await wp(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...r},this.chromeAdapter,{...this.requestOptions,...t});return{stream:s,response:i}}startChat(e){return new $A(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...e},this.requestOptions)}async countTokens(e,t){const r=oa(e);return qA(this._apiSettings,this.model,r,this.chromeAdapter,{...this.requestOptions,...t})}}function HA(n){if(n.thinkingConfig?.thinkingBudget!=null&&n.thinkingConfig?.thinkingLevel)throw new H(G.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(n.responseSchema!=null&&n.responseJsonSchema!=null)throw new H(G.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((n.responseSchema!=null||n.responseJsonSchema!=null)&&n.responseMimeType!=="application/json")throw new H(G.UNSUPPORTED,'responseMimeType must be set to "application/json" if responseSchema or responseJsonSchema are set.')}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ZR(n=Ji(),e){n=fe(n);const t=Un(n,Vn),r=e?.backend??new jc,s={useLimitedUseAppCheckTokens:e?.useLimitedUseAppCheckTokens??!1},i=hA(r),a=t.getImmediate({identifier:i});return a.options=s,a}const zA=["mode","onDeviceParams","inCloudParams"];function eP(n,e,t){const r=e;let s;if(r.mode){for(const c of Object.keys(e))zA.includes(c)||_e.warn(`When a hybrid inference mode is specified (mode is currently set to ${r.mode}), "${c}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);s=r.inCloudParams||{model:lA}}else s=e;if(!s.model)throw new H(G.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");const i=n.chromeAdapterFactory?.(r.mode,typeof window>"u"?void 0:window,r.onDeviceParams),a=new GA(n,s,t,i);return a._apiSettings.inferenceMode=r.mode,a}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WA(){Ot(new yt(Vn,mA,"PUBLIC").setMultipleInstances(!0)),ct(Eh,Na),ct(Eh,Na,"esm2020")}WA();/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oa=new Map,vp={activated:!1,tokenObservers:[]},KA={initialized:!1,enabled:!1};function ce(n){return Oa.get(n)||{...vp}}function QA(n,e){return Oa.set(n,e),Oa.get(n)}function wo(){return KA}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kc="https://content-firebaseappcheck.googleapis.com/v1",YA="exchangeRecaptchaV3Token",JA="exchangeRecaptchaEnterpriseToken",XA="exchangeDebugToken",Ch={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},ZA=1440*60*1e3;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eR{constructor(e,t,r,s,i){if(this.operation=e,this.retryPolicy=t,this.getWaitDuration=r,this.lowerBound=s,this.upperBound=i,this.pending=null,this.nextErrorWaitInterval=s,s>i)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new kn,this.pending.promise.catch(t=>{}),await tR(this.getNextRun(e)),this.pending.resolve(),await this.pending.promise,this.pending=new kn,this.pending.promise.catch(t=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(t){this.retryPolicy(t)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const t=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),t}}}function tR(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nR={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},Pe=new dr("appCheck","AppCheck",nR);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ki(n=!1){return n?self.grecaptcha?.enterprise:self.grecaptcha}function Qc(n){if(!ce(n).activated)throw Pe.create("use-before-activation",{appName:n.name})}function Yc(n){const e=Math.round(n/1e3),t=Math.floor(e/(3600*24)),r=Math.floor((e-t*3600*24)/3600),s=Math.floor((e-t*3600*24-r*3600)/60),i=e-t*3600*24-r*3600-s*60;let a="";return t&&(a+=hi(t)+"d:"),r&&(a+=hi(r)+"h:"),a+=hi(s)+"m:"+hi(i)+"s",a}function hi(n){return n===0?"00":n>=10?n.toString():"0"+n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Io({url:n,body:e},t){const r={"Content-Type":"application/json"},s=t.getImmediate({optional:!0});if(s){const m=await s.getHeartbeatsHeader();m&&(r["X-Firebase-Client"]=m)}const i={method:"POST",body:JSON.stringify(e),headers:r};let a;try{a=await fetch(n,i)}catch(m){throw Pe.create("fetch-network-error",{originalErrorMessage:m?.message})}if(a.status!==200)throw Pe.create("fetch-status-error",{httpStatus:a.status});let c;try{c=await a.json()}catch(m){throw Pe.create("fetch-parse-error",{originalErrorMessage:m?.message})}const l=c.ttl.match(/^([\d.]+)(s)$/);if(!l||!l[2]||isNaN(Number(l[1])))throw Pe.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${c.ttl}`});const h=Number(l[1])*1e3,p=Date.now();return{token:c.token,expireTimeMillis:p+h,issuedAtTimeMillis:p}}function rR(n,e){const{projectId:t,appId:r,apiKey:s}=n.options;return{url:`${Kc}/projects/${t}/apps/${r}:${YA}?key=${s}`,body:{recaptcha_v3_token:e}}}function sR(n,e){const{projectId:t,appId:r,apiKey:s}=n.options;return{url:`${Kc}/projects/${t}/apps/${r}:${JA}?key=${s}`,body:{recaptcha_enterprise_token:e}}}function Ap(n,e){const{projectId:t,appId:r,apiKey:s}=n.options;return{url:`${Kc}/projects/${t}/apps/${r}:${XA}?key=${s}`,body:{debug_token:e}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iR="firebase-app-check-database",oR=1,Is="firebase-app-check-store",Rp="debug-token";let di=null;function Pp(){return di||(di=new Promise((n,e)=>{try{const t=indexedDB.open(iR,oR);t.onsuccess=r=>{n(r.target.result)},t.onerror=r=>{e(Pe.create("storage-open",{originalErrorMessage:r.target.error?.message}))},t.onupgradeneeded=r=>{const s=r.target.result;switch(r.oldVersion){case 0:s.createObjectStore(Is,{keyPath:"compositeKey"})}}}catch(t){e(Pe.create("storage-open",{originalErrorMessage:t?.message}))}}),di)}function aR(n){return Cp(bp(n))}function cR(n,e){return Sp(bp(n),e)}function uR(n){return Sp(Rp,n)}function lR(){return Cp(Rp)}async function Sp(n,e){const r=(await Pp()).transaction(Is,"readwrite"),i=r.objectStore(Is).put({compositeKey:n,value:e});return new Promise((a,c)=>{i.onsuccess=l=>{a()},r.onerror=l=>{c(Pe.create("storage-set",{originalErrorMessage:l.target.error?.message}))}})}async function Cp(n){const t=(await Pp()).transaction(Is,"readonly"),s=t.objectStore(Is).get(n);return new Promise((i,a)=>{s.onsuccess=c=>{const l=c.target.result;i(l?l.value:void 0)},t.onerror=c=>{a(Pe.create("storage-get",{originalErrorMessage:c.target.error?.message}))}})}function bp(n){return`${n.options.appId}-${n.name}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xt=new Rs("@firebase/app-check");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hR(n){if(Ma()){let e;try{e=await aR(n)}catch(t){Xt.warn(`Failed to read token from IndexedDB. Error: ${t}`)}return e}}function aa(n,e){return Ma()?cR(n,e).catch(t=>{Xt.warn(`Failed to write token to IndexedDB. Error: ${t}`)}):Promise.resolve()}async function dR(){let n;try{n=await lR()}catch{}if(n)return n;{const e=crypto.randomUUID();return uR(e).catch(t=>Xt.warn(`Failed to persist debug token to IndexedDB. Error: ${t}`)),e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jc(){return wo().enabled}async function Xc(){const n=wo();if(n.enabled&&n.token)return n.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function fR(){const n=Oh(),e=wo();if(e.initialized=!0,typeof n.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&n.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;e.enabled=!0;const t=new kn;e.token=t,typeof n.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?t.resolve(n.FIREBASE_APPCHECK_DEBUG_TOKEN):t.resolve(dR())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pR={error:"UNKNOWN_ERROR"};function mR(n){return La.encodeString(JSON.stringify(n),!1)}async function Da(n,e=!1,t=!1){const r=n.app;Qc(r);const s=ce(r);let i=s.token,a;if(i&&!Jn(i)&&(s.token=void 0,i=void 0),!i){const h=await s.cachedTokenPromise;h&&(Jn(h)?i=h:await aa(r,void 0))}if(!e&&i&&Jn(i))return{token:i.token};let c=!1;if(Jc())try{const h=await Xc();s.exchangeTokenPromise||(s.exchangeTokenPromise=Io(Ap(r,h),n.heartbeatServiceProvider).finally(()=>{s.exchangeTokenPromise=void 0}),c=!0);const p=await s.exchangeTokenPromise;return await aa(r,p),s.token=p,{token:p.token}}catch(h){return h.code==="appCheck/throttled"||h.code==="appCheck/initial-throttle"?Xt.warn(h.message):t&&Xt.error(h),ca(h)}try{s.exchangeTokenPromise||(s.exchangeTokenPromise=s.provider.getToken().finally(()=>{s.exchangeTokenPromise=void 0}),c=!0),i=await ce(r).exchangeTokenPromise}catch(h){h.code==="appCheck/throttled"||h.code==="appCheck/initial-throttle"?Xt.warn(h.message):t&&Xt.error(h),a=h}let l;return i?a?Jn(i)?l={token:i.token,internalError:a}:l=ca(a):(l={token:i.token},s.token=i,await aa(r,i)):l=ca(a),c&&Np(r,l),l}async function gR(n){const e=n.app;Qc(e);const{provider:t}=ce(e);if(Jc()){const r=await Xc(),s=Ap(e,r);s.body.limited_use=!0;const{token:i}=await Io(s,n.heartbeatServiceProvider);return{token:i}}else{const{token:r}=await t.getToken(!0);return{token:r}}}function Vp(n,e,t,r){const{app:s}=n,i=ce(s),a={next:t,error:r,type:e};if(i.tokenObservers=[...i.tokenObservers,a],i.token&&Jn(i.token)){const c=i.token;Promise.resolve().then(()=>{t({token:c.token}),bh(n)}).catch(()=>{})}i.cachedTokenPromise.then(()=>bh(n))}function kp(n,e){const t=ce(n),r=t.tokenObservers.filter(s=>s.next!==e);r.length===0&&t.tokenRefresher&&t.tokenRefresher.isRunning()&&t.tokenRefresher.stop(),t.tokenObservers=r}function bh(n){const{app:e}=n,t=ce(e);let r=t.tokenRefresher;r||(r=_R(n),t.tokenRefresher=r),!r.isRunning()&&t.isTokenAutoRefreshEnabled&&r.start()}function _R(n){const{app:e}=n;return new eR(async()=>{const t=ce(e);let r;if(t.token?r=await Da(n,!0):r=await Da(n),r.error)throw r.error;if(r.internalError)throw r.internalError},()=>!0,()=>{const t=ce(e);if(t.token){let r=t.token.issuedAtTimeMillis+(t.token.expireTimeMillis-t.token.issuedAtTimeMillis)*.5+3e5;const s=t.token.expireTimeMillis-300*1e3;return r=Math.min(r,s),Math.max(0,r-Date.now())}else return 0},Ch.RETRIAL_MIN_WAIT,Ch.RETRIAL_MAX_WAIT)}function Np(n,e){const t=ce(n).tokenObservers;for(const r of t)try{r.type==="EXTERNAL"&&e.error!=null?r.error(e.error):r.next(e)}catch{}}function Jn(n){return n.expireTimeMillis-Date.now()>0}function ca(n){return{token:mR(pR),error:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yR{constructor(e,t){this.app=e,this.heartbeatServiceProvider=t}_delete(){const{tokenObservers:e}=ce(this.app);for(const t of e)kp(this.app,t.next);return Promise.resolve()}}function ER(n,e){return new yR(n,e)}function TR(n){return{getToken:e=>Da(n,e),getLimitedUseToken:()=>gR(n),addTokenListener:e=>Vp(n,"INTERNAL",e),removeTokenListener:e=>kp(n.app,e)}}const wR="@firebase/app-check",IR="0.13.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vR="https://www.google.com/recaptcha/api.js",AR="https://www.google.com/recaptcha/enterprise.js";function RR(n,e){const t=new kn,r=ce(n);r.reCAPTCHAState={initialized:t};const s=Op(n),i=Ki(!1);return i?Qi(n,e,i,s,t):CR(()=>{const a=Ki(!1);if(!a)throw new Error("no recaptcha");Qi(n,e,a,s,t)}),t.promise}function PR(n,e){const t=new kn,r=ce(n);r.reCAPTCHAState={initialized:t};const s=Op(n),i=Ki(!0);return i?Qi(n,e,i,s,t):bR(()=>{const a=Ki(!0);if(!a)throw new Error("no recaptcha");Qi(n,e,a,s,t)}),t.promise}function Qi(n,e,t,r,s){t.ready(()=>{SR(n,e,t,r),s.resolve(t)})}function Op(n){const e=`fire_app_check_${n.name}`,t=document.createElement("div");return t.id=e,t.style.display="none",document.body.appendChild(t),e}async function Dp(n){Qc(n);const t=await ce(n).reCAPTCHAState.initialized.promise;return new Promise((r,s)=>{const i=ce(n).reCAPTCHAState;t.ready(()=>{r(t.execute(i.widgetId,{action:"fire_app_check"}))})})}function SR(n,e,t,r){const s=t.render(r,{sitekey:e,size:"invisible",callback:()=>{ce(n).reCAPTCHAState.succeeded=!0},"error-callback":()=>{ce(n).reCAPTCHAState.succeeded=!1}}),i=ce(n);i.reCAPTCHAState={...i.reCAPTCHAState,widgetId:s}}function CR(n){const e=document.createElement("script");e.src=vR,e.onload=n,document.head.appendChild(e)}function bR(n){const e=document.createElement("script");e.src=AR+"?render=explicit",e.onload=n,document.head.appendChild(e)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xp{constructor(e){this._siteKey=e,this._throttleData=null}async getToken(e=!1){Up(this._throttleData);const t=await Dp(this._app).catch(s=>{throw Pe.create("recaptcha-error")});if(!ce(this._app).reCAPTCHAState?.succeeded)throw Pe.create("recaptcha-error");let r;try{const s=rR(this._app,t);e&&(s.body.limited_use=!0),r=await Io(s,this._heartbeatServiceProvider)}catch(s){throw s.code?.includes("fetch-status-error")?(this._throttleData=Mp(Number(s.customData?.httpStatus),this._throttleData),Pe.create("initial-throttle",{time:Yc(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):s}return this._throttleData=null,r}initialize(e){this._app=e,this._heartbeatServiceProvider=Un(e,"heartbeat"),RR(e,this._siteKey).catch(()=>{})}isEqual(e){return e instanceof xp?this._siteKey===e._siteKey:!1}}class Lp{constructor(e){this._siteKey=e,this._throttleData=null}async getToken(e=!1){Up(this._throttleData);const t=await Dp(this._app).catch(s=>{throw Pe.create("recaptcha-error")});if(!ce(this._app).reCAPTCHAState?.succeeded)throw Pe.create("recaptcha-error");let r;try{const s=sR(this._app,t);e&&(s.body.limited_use=!0),r=await Io(s,this._heartbeatServiceProvider)}catch(s){throw s.code?.includes("fetch-status-error")?(this._throttleData=Mp(Number(s.customData?.httpStatus),this._throttleData),Pe.create("initial-throttle",{time:Yc(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):s}return this._throttleData=null,r}initialize(e){this._app=e,this._heartbeatServiceProvider=Un(e,"heartbeat"),PR(e,this._siteKey).catch(()=>{})}isEqual(e){return e instanceof Lp?this._siteKey===e._siteKey:!1}}function Mp(n,e){if(n===404||n===403)return{backoffCount:1,allowRequestsAfter:Date.now()+ZA,httpStatus:n};{const t=e?e.backoffCount:0,r=Hm(t,1e3,2);return{backoffCount:t+1,allowRequestsAfter:Date.now()+r,httpStatus:n}}}function Up(n){if(n&&Date.now()-n.allowRequestsAfter<=0)throw Pe.create("throttled",{time:Yc(n.allowRequestsAfter-Date.now()),httpStatus:n.httpStatus})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tP(n=Ji(),e){n=fe(n);const t=Un(n,"app-check");if(wo().initialized||fR(),Jc()&&Xc().then(s=>console.log(`App Check debug token: ${s}. You will need to add it to your app's App Check settings in the Firebase console for it to work.`)),t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(i&&!!i.isTokenAutoRefreshEnabled==!!e.isTokenAutoRefreshEnabled&&i.provider?.isEqual(e.provider))return s;throw Pe.create("already-initialized",{appName:n.name})}const r=t.initialize({options:e});return VR(n,e.provider,e.isTokenAutoRefreshEnabled),ce(n).isTokenAutoRefreshEnabled&&Vp(r,"INTERNAL",()=>{}),r}function VR(n,e,t=!1){const r=QA(n,{...vp});r.activated=!0,r.provider=e,r.cachedTokenPromise=hR(n).then(s=>(s&&Jn(s)&&(r.token=s,Np(n,{token:s.token})),s)),r.isTokenAutoRefreshEnabled=t&&n.automaticDataCollectionEnabled,!n.automaticDataCollectionEnabled&&t&&Xt.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),r.provider.initialize(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kR="app-check",Vh="app-check-internal";function NR(){Ot(new yt(kR,n=>{const e=n.getProvider("app").getImmediate(),t=n.getProvider("heartbeat");return ER(e,t)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((n,e,t)=>{n.getProvider(Vh).initialize()})),Ot(new yt(Vh,n=>{const e=n.getProvider("app-check").getImmediate();return TR(e)},"PUBLIC").setInstantiationMode("EXPLICIT")),ct(wR,IR)}NR();export{jc as G,Lp as R,BR as a,HR as b,tP as c,xp as d,ZR as e,qR as f,eP as g,YR as h,Og as i,XR as j,Kt as k,FR as l,UR as m,xR as n,MR as o,DR as p,QR as r,JR as s,LR as u};
