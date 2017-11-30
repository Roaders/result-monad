"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResultType;
(function (ResultType) {
    ResultType["Just"] = "Just";
    ResultType["Error"] = "Error";
})(ResultType = exports.ResultType || (exports.ResultType = {}));
var Result = /** @class */ (function () {
    //Constructor
    function Result(_type, _value, _error, guard) {
        this._type = _type;
        this._value = _value;
        this._error = _error;
        if (guard !== Result._guard) {
            throw new Error("Direct contruction of Result not possible. Please use Result.justAllowNull, Result.error or Result.nullToMaybe instead.");
        }
    }
    //  Static Methods
    /**
     * Creates a Result of the given value.
     * Values of null and undefined are permitted.
     * Example: var result = Result.justAllowNull(null);
     * @param value
     */
    Result.justAllowNull = function (value) {
        return new Result(ResultType.Just, value, undefined, Result._guard);
    };
    /**
     * Creates a Nothing Result of the given type
     * Example: var result = Result.nothing<string,Error>(new Error());
     */
    Result.error = function (error) {
        return new Result(ResultType.Error, undefined, error, Result._guard);
    };
    /**
     * Creates a Result with the passed value.
     * If the passed value is null or undefined a Result of type Nothing is created.
     * Example: var result = Result.nullToResult("Hello result world");
     * @param value
     */
    Result.nullToResult = function (value, error) {
        if (value == null) {
            return Result.error(error);
        }
        return new Result(ResultType.Just, value, undefined, Result._guard);
    };
    /**
     * Creates a Result of the given value if the test is true.
     * If the test is true and null or undefined are passed a Nothing Result will be creted
     * If the test is false a Nothing Result will be created.
     * Example: var result = Result.if(someBooleanFunction(),"Function returns true");
     * @param test
     * @param value
     */
    Result.if = function (test, value, error) {
        if (!test) {
            return Result.error(error);
        }
        return Result.nullToResult(value, error);
    };
    Object.defineProperty(Result.prototype, "value", {
        //  Properties
        /**
         * Returns the value of the Result.
         * This will throw an error if called on an error Result
         * It is recommended to use defaultTo instead so that a default value can be provided for the Error case
         */
        get: function () {
            if (this.hasError) {
                throw new Error("Unable to access value of an error Result. Use defaultTo instead.");
            }
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Result.prototype, "error", {
        /**
         * Returns the value of the Error which may be undefined
         */
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Result.prototype, "hasError", {
        /**
         * indicates if this is an Error Result
         */
        get: function () {
            return this._type === ResultType.Error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Result.prototype, "hasValue", {
        /**
         * indicates if this is a Value Result
         */
        get: function () {
            return this._type === ResultType.Just;
        },
        enumerable: true,
        configurable: true
    });
    //  Public Methods
    /**
     * maps a result to another value
     * if the selector function returns null an error result is returned
     * Example: Result.nullToResult("Hello").map(value => value.length, "could not map value");
     * @param selector
     */
    Result.prototype.map = function (selector, error) {
        if (this.hasError) {
            return Result.error(this.error);
        }
        return Result.nullToResult(selector(this._value), error);
    };
    /**
     * maps a result to another value
     * null and undefined values may be returned from the selector function
     * Example: Result.nullToResult("Hello").mapAllowNull(value => null);
     * @param selector
     */
    Result.prototype.mapAllowNull = function (selector) {
        if (this.hasError) {
            return Result.error(this.error);
        }
        return Result.justAllowNull(selector(this._value));
    };
    /**
     * executes a function if the result is valid.
     * The function is not executed if the result is an error.
     * Example: Result.nullToResult("Hello world").do(message => console.log(message));
     * @param action
     */
    Result.prototype.do = function (action) {
        if (!this.hasError) {
            action(this._value);
        }
        return this;
    };
    /**
     * executes a function if the result is an error.
     * The function is not executed if the Result is valid
     * Example: Result.nullToResult(null).elseDo(error => console.log("no message found: ${error}"));
     * @param action
     */
    Result.prototype.elseDo = function (action) {
        if (this.hasError) {
            action(this._error);
        }
        return this;
    };
    /**
     * Transforms the result from an error result to a valid result with the supplied value
     * Has no effect if the Result is valid
     * If value is null or undefined returns an error result
     * Example: Result.error<string>().orElse("GoodBye"); (returns result with value of 'Goodbye')
     * @param value
     */
    Result.prototype.orElse = function (value, error) {
        if (this.hasError) {
            return Result.nullToResult(value, error);
        }
        return this;
    };
    /**
     * Transforms the result from an error result to a valid result with the supplied value
     * Has no effect if the Result is valid
     * Null or undefined values are permitted
     * Example: Result.error<string>().orElse(null); (returns result with null value)
     * @param value
     */
    Result.prototype.orElseAllowNull = function (value) {
        if (this.hasError) {
            return Result.justAllowNull(value);
        }
        return this;
    };
    /**
     * Retuns a new Result if initial result and selector Result are valid.
     * If either result is an error an error result is returned
     * Example: Result.nullToResult(thing.parameterOne).and(paramOneValue => Result.nullToResult(thing.parameterTwo)) (return result with value of arameterTwo)
     * @param selector
     */
    Result.prototype.and = function (selector) {
        if (this.hasError) {
            return Result.error(this._error);
        }
        return selector(this._value);
    };
    /**
     * If result is an error return the other result;
     * Example: Result.error<string>().or(Result.nullToResult("here I am", "error creating")) (return result with value "here I am");
     * @param other
     */
    Result.prototype.or = function (other) {
        if (this.hasError) {
            return other;
        }
        return this;
    };
    /**
     * Returns the value of a result whilst safely providing a default value to be used in case the result is an error.
     * Example: Result.error<string>().defaultTo("I am the default") (return a string of value "I am the default!")
     * @param defaultValue
     */
    Result.prototype.defaultTo = function (defaultValue) {
        if (this.hasError) {
            return defaultValue;
        }
        return this._value;
    };
    /**
     * turns the Result into an error result if the function evaluates to false
     * Example: Result.nullToResult("").filter(value => value != "")
     * @param predicate
     */
    Result.prototype.filter = function (predicate, error) {
        var _this = this;
        return this.and(function (v) { return predicate(v) ? Result.justAllowNull(_this._value) : Result.error(error); });
    };
    /**
     * turns the result into an error result if the value is not of the specified type
     * also changes the type of the result
     * for example this could turn Result<string | number> into Result<string>
     *
     * Result.justAllowNull(stringOrNumber).filterType(<(value) => value is string>(value => typeof value === 'string'))
     *
     * @param predicate
     */
    Result.prototype.filterType = function (predicate, error) {
        return this.and(function (v) { return predicate(v) ? Result.justAllowNull(v) : Result.error(error); });
    };
    Result.prototype.combine = function () {
        var results = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            results[_i] = arguments[_i];
        }
        results.unshift(this);
        if (results.some(function (v) { return v.hasError; })) {
            return Result.error(results.map(function (r) { return r.error; }));
        }
        return Result.justAllowNull(results.map(function (m) { return m.value; }));
    };
    /**
     * Throws an error if the result is an error
     *
     */
    Result.prototype.throw = function () {
        if (this.hasError) {
            throw this._error;
        }
    };
    /**
     * returns the value if there is one or throws the error
     *
     */
    Result.prototype.valueOrThrow = function () {
        this.throw();
        return this._value;
    };
    Result._guard = {};
    return Result;
}());
exports.Result = Result;
//# sourceMappingURL=result.js.map