import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  VERSION as VERSION2,
  ɵzoneWrap
} from "./chunk-7HTGQD52.js";
import {
  deleteApp,
  getApp,
  getApps,
  initializeApp,
  initializeServerApp,
  onLog,
  registerVersion,
  setLogLevel
} from "./chunk-KY4EGEUN.js";
import {
  Inject,
  InjectionToken,
  NgModule,
  Optional,
  PLATFORM_ID,
  VERSION,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-BTNWH524.js";
import {
  require_cjs
} from "./chunk-VFW7PX74.js";
import {
  require_operators
} from "./chunk-KKWATYV7.js";
import {
  __toESM
} from "./chunk-LKDWXENB.js";

// node_modules/@angular/fire/fesm2022/angular-fire-app.mjs
var import_rxjs = __toESM(require_cjs(), 1);
var import_operators = __toESM(require_operators(), 1);
var FirebaseApp = class {
  constructor(app) {
    return app;
  }
};
var FirebaseApps = class {
  constructor() {
    return getApps();
  }
};
var firebaseApp$ = (0, import_rxjs.timer)(0, 300).pipe((0, import_operators.concatMap)(() => (0, import_rxjs.from)(getApps())), (0, import_operators.distinct)());
function defaultFirebaseAppFactory(provided) {
  if (provided && provided.length === 1) {
    return provided[0];
  }
  return new FirebaseApp(getApp());
}
var PROVIDED_FIREBASE_APPS = new InjectionToken("angularfire2._apps");
var DEFAULT_FIREBASE_APP_PROVIDER = {
  provide: FirebaseApp,
  useFactory: defaultFirebaseAppFactory,
  deps: [[new Optional(), PROVIDED_FIREBASE_APPS]]
};
var FIREBASE_APPS_PROVIDER = {
  provide: FirebaseApps,
  deps: [[new Optional(), PROVIDED_FIREBASE_APPS]]
};
var FirebaseAppModule = class _FirebaseAppModule {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(platformId) {
    registerVersion("angularfire", VERSION2.full, "core");
    registerVersion("angularfire", VERSION2.full, "app");
    registerVersion("angular", VERSION.full, platformId.toString());
  }
  static ɵfac = function FirebaseAppModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FirebaseAppModule)(ɵɵinject(PLATFORM_ID));
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _FirebaseAppModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [DEFAULT_FIREBASE_APP_PROVIDER, FIREBASE_APPS_PROVIDER]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FirebaseAppModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_FIREBASE_APP_PROVIDER, FIREBASE_APPS_PROVIDER]
    }]
  }], () => [{
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }], null);
})();
var deleteApp2 = ɵzoneWrap(deleteApp, true);
var getApp2 = ɵzoneWrap(getApp, true);
var getApps2 = ɵzoneWrap(getApps, true);
var initializeApp2 = ɵzoneWrap(initializeApp, true);
var initializeServerApp2 = ɵzoneWrap(initializeServerApp, true);
var onLog2 = ɵzoneWrap(onLog, true);
var registerVersion2 = ɵzoneWrap(registerVersion, true);
var setLogLevel2 = ɵzoneWrap(setLogLevel, true);

export {
  FirebaseApp,
  FirebaseApps
};
//# sourceMappingURL=chunk-IC65C4JC.js.map
