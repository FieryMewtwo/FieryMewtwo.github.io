// @license magnet:?xt=urn:btih:8e4f440f4c65981c5bf93c76d35135ba5064d8b7&dn=apache-2.0.txt Apache-2.0
(function () {
  'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /*
  Copyright 2020 The Matrix.org Foundation C.I.C.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  */
  function asErrorMessage(err) {
    return {
      type: "error",
      message: err.message,
      stack: err.stack
    };
  }

  function asSuccessMessage(payload) {
    return {
      type: "success",
      payload: payload
    };
  }

  var MessageHandler = /*#__PURE__*/function () {
    function MessageHandler() {
      _classCallCheck(this, MessageHandler);

      this._olm = null;
      this._randomValues = self.crypto ? null : [];
    }

    _createClass(MessageHandler, [{
      key: "_feedRandomValues",
      value: function _feedRandomValues(randomValues) {
        if (this._randomValues) {
          var _this$_randomValues;

          (_this$_randomValues = this._randomValues).push.apply(_this$_randomValues, _toConsumableArray(randomValues));
        }
      }
    }, {
      key: "_checkRandomValuesUsed",
      value: function _checkRandomValuesUsed() {
        if (this._randomValues && this._randomValues.length !== 0) {
          throw new Error("".concat(this._randomValues.length, " random values left"));
        }
      }
    }, {
      key: "_getRandomValues",
      value: function _getRandomValues(typedArray) {
        if (!(typedArray instanceof Uint8Array)) {
          throw new Error("only Uint8Array is supported: " + JSON.stringify({
            Int8Array: typedArray instanceof Int8Array,
            Uint8Array: typedArray instanceof Uint8Array,
            Int16Array: typedArray instanceof Int16Array,
            Uint16Array: typedArray instanceof Uint16Array,
            Int32Array: typedArray instanceof Int32Array,
            Uint32Array: typedArray instanceof Uint32Array
          }));
        }

        if (this._randomValues.length === 0) {
          throw new Error("no more random values, needed one of length " + typedArray.length);
        }

        var precalculated = this._randomValues.shift();

        if (precalculated.length !== typedArray.length) {
          throw new Error("typedArray length (".concat(typedArray.length, ") does not match precalculated length (").concat(precalculated.length, ")"));
        } // copy values


        for (var i = 0; i < typedArray.length; ++i) {
          typedArray[i] = precalculated[i];
        }

        return typedArray;
      }
    }, {
      key: "handleEvent",
      value: function handleEvent(e) {
        if (e.type === "message") {
          this._handleMessage(e.data);
        }
      }
    }, {
      key: "_sendReply",
      value: function _sendReply(refMessage, reply) {
        reply.replyToId = refMessage.id;
        self.postMessage(reply);
      }
    }, {
      key: "_toMessage",
      value: function _toMessage(fn) {
        try {
          var payload = fn();

          if (payload instanceof Promise) {
            return payload.then(function (payload) {
              return asSuccessMessage(payload);
            }, function (err) {
              return asErrorMessage(err);
            });
          } else {
            return asSuccessMessage(payload);
          }
        } catch (err) {
          return asErrorMessage(err);
        }
      }
    }, {
      key: "_loadOlm",
      value: function _loadOlm(path) {
        var _this = this;

        return this._toMessage( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var olm;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!self.crypto) {
                    self.crypto = {
                      getRandomValues: _this._getRandomValues.bind(_this)
                    };
                  } // mangle the globals enough to make olm believe it is running in a browser


                  self.window = self;
                  self.document = {};
                  self.importScripts(path);
                  olm = self.olm_exports;
                  _context.next = 7;
                  return olm.init();

                case 7:
                  _this._olm = olm;

                case 8:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        })));
      }
    }, {
      key: "_megolmDecrypt",
      value: function _megolmDecrypt(sessionKey, ciphertext) {
        var _this2 = this;

        return this._toMessage(function () {
          var session = new _this2._olm.InboundGroupSession();

          try {
            session.import_session(sessionKey); // returns object with plaintext and message_index

            return session.decrypt(ciphertext);
          } finally {
            session.free();
          }
        });
      }
    }, {
      key: "_olmCreateAccountAndOTKs",
      value: function _olmCreateAccountAndOTKs(randomValues, otkAmount) {
        var _this3 = this;

        return this._toMessage(function () {
          _this3._feedRandomValues(randomValues);

          var account = new _this3._olm.Account();

          try {
            account.create();
            account.generate_one_time_keys(otkAmount);

            _this3._checkRandomValuesUsed();

            return account.pickle("");
          } finally {
            account.free();
          }
        });
      }
    }, {
      key: "_olmCreateOutbound",
      value: function _olmCreateOutbound(randomValues, accountPickle, theirIdentityKey, theirOneTimeKey) {
        var _this4 = this;

        return this._toMessage(function () {
          _this4._feedRandomValues(randomValues);

          var account = new _this4._olm.Account();
          var newSession = new _this4._olm.Session();

          try {
            account.unpickle("", accountPickle);
            newSession.create_outbound(account, theirIdentityKey, theirOneTimeKey);
            return newSession.pickle("");
          } finally {
            account.free();
            newSession.free();
          }
        });
      }
    }, {
      key: "_handleMessage",
      value: function () {
        var _handleMessage2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(message) {
          var type;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  type = message.type;

                  if (!(type === "ping")) {
                    _context2.next = 5;
                    break;
                  }

                  this._sendReply(message, {
                    type: "success"
                  });

                  _context2.next = 15;
                  break;

                case 5:
                  if (!(type === "load_olm")) {
                    _context2.next = 14;
                    break;
                  }

                  _context2.t0 = this;
                  _context2.t1 = message;
                  _context2.next = 10;
                  return this._loadOlm(message.path);

                case 10:
                  _context2.t2 = _context2.sent;

                  _context2.t0._sendReply.call(_context2.t0, _context2.t1, _context2.t2);

                  _context2.next = 15;
                  break;

                case 14:
                  if (type === "megolm_decrypt") {
                    this._sendReply(message, this._megolmDecrypt(message.sessionKey, message.ciphertext));
                  } else if (type === "olm_create_account_otks") {
                    this._sendReply(message, this._olmCreateAccountAndOTKs(message.randomValues, message.otkAmount));
                  } else if (type === "olm_create_outbound") {
                    this._sendReply(message, this._olmCreateOutbound(message.randomValues, message.accountPickle, message.theirIdentityKey, message.theirOneTimeKey));
                  }

                case 15:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function _handleMessage(_x) {
          return _handleMessage2.apply(this, arguments);
        }

        return _handleMessage;
      }()
    }]);

    return MessageHandler;
  }();

  self.addEventListener("message", new MessageHandler());

}());

// @license-end