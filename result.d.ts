import { nullOrUndefined } from "maybe-monad";
export declare enum ResultType {
    Just = "Just",
    Error = "Error",
}
export declare class Result<T, E = string> {
    private _type;
    private _value;
    private _error;
    protected static _guard: any;
    constructor(_type: ResultType, _value: T | undefined, _error: E | undefined, guard: any);
    /**
     * Creates a Result of the given value.
     * Values of null and undefined are permitted.
     * Example: var result = Result.justAllowNull(null);
     * @param value
     */
    static justAllowNull<T, E = string>(value: T): Result<T, E>;
    /**
     * Creates a Nothing Result of the given type
     * Example: var result = Result.nothing<string,Error>(new Error());
     */
    static error<T, E = String>(error: E): Result<T, E>;
    /**
     * Creates a Result with the passed value.
     * If the passed value is null or undefined a Result of type Nothing is created.
     * Example: var result = Result.nullToResult("Hello result world");
     * @param value
     */
    static nullToResult<T, E>(value: T | nullOrUndefined, error: E): Result<T, E>;
    /**
     * Creates a Result of the given value if the test is true.
     * If the test is true and null or undefined are passed a Nothing Result will be creted
     * If the test is false a Nothing Result will be created.
     * Example: var result = Result.if(someBooleanFunction(),"Function returns true");
     * @param test
     * @param value
     */
    static if<T, E>(test: boolean, value: T | nullOrUndefined, error: E): Result<T, E>;
    /**
     * Returns the value of the Result.
     * This will throw an error if called on an error Result
     * It is recommended to use defaultTo instead so that a default value can be provided for the Error case
     */
    readonly value: T;
    /**
     * Returns the value of the Error which may be undefined
     */
    readonly error: E | undefined;
    /**
     * indicates if this is an Error Result
     */
    readonly hasError: boolean;
    /**
     * indicates if this is a Value Result
     */
    readonly hasValue: boolean;
    /**
     * maps a result to another value
     * if the selector function returns null an error result is returned
     * Example: Result.nullToResult("Hello").map(value => value.length, "could not map value");
     * @param selector
     */
    map<TOut>(selector: (value: T) => TOut | nullOrUndefined, error: E): Result<TOut, E>;
    /**
     * maps a result to another value
     * null and undefined values may be returned from the selector function
     * Example: Result.nullToResult("Hello").mapAllowNull(value => null);
     * @param selector
     */
    mapAllowNull<TOut>(selector: (value: T) => TOut): Result<TOut, E>;
    /**
     * executes a function if the result is valid.
     * The function is not executed if the result is an error.
     * Example: Result.nullToResult("Hello world").do(message => console.log(message));
     * @param action
     */
    do(action: (value: T) => void): Result<T, E>;
    /**
     * executes a function if the result is an error.
     * The function is not executed if the Result is valid
     * Example: Result.nullToResult(null).elseDo(error => console.log("no message found: ${error}"));
     * @param action
     */
    elseDo(action: (error: E) => void): Result<T, E>;
    /**
     * Transforms the result from an error result to a valid result with the supplied value
     * Has no effect if the Result is valid
     * If value is null or undefined returns an error result
     * Example: Result.error<string>().orElse("GoodBye"); (returns result with value of 'Goodbye')
     * @param value
     */
    orElse(value: T | nullOrUndefined, error: E): Result<T, E>;
    /**
     * Transforms the result from an error result to a valid result with the supplied value
     * Has no effect if the Result is valid
     * Null or undefined values are permitted
     * Example: Result.error<string>().orElse(null); (returns result with null value)
     * @param value
     */
    orElseAllowNull(value: T): Result<T, E>;
    /**
     * Retuns a new Result if initial result and selector Result are valid.
     * If either result is an error an error result is returned
     * Example: Result.nullToResult(thing.parameterOne).and(paramOneValue => Result.nullToResult(thing.parameterTwo)) (return result with value of arameterTwo)
     * @param selector
     */
    and<TOut>(selector: (value: T) => Result<TOut, E>): Result<TOut, E>;
    /**
     * If result is an error return the other result;
     * Example: Result.error<string>().or(Result.nullToResult("here I am", "error creating")) (return result with value "here I am");
     * @param other
     */
    or(other: Result<T, E>): Result<T, E>;
    /**
     * Returns the value of a result whilst safely providing a default value to be used in case the result is an error.
     * Example: Result.error<string>().defaultTo("I am the default") (return a string of value "I am the default!")
     * @param defaultValue
     */
    defaultTo<TDefault>(defaultValue: TDefault): T | TDefault;
    /**
     * turns the Result into an error result if the function evaluates to false
     * Example: Result.nullToResult("").filter(value => value != "")
     * @param predicate
     */
    filter(predicate: (value: T) => boolean, error: E): Result<T, E>;
    /**
     * turns the result into an error result if the value is not of the specified type
     * also changes the type of the result
     * for example this could turn Result<string | number> into Result<string>
     *
     * Result.justAllowNull(stringOrNumber).filterType(<(value) => value is string>(value => typeof value === 'string'))
     *
     * @param predicate
     */
    filterType<TOut>(predicate: (value: any) => value is TOut, error: E): Result<TOut, E>;
    /**
     * Combines multiple Results into one Result with a value of an array of all the result values
     * If any result is an error an error result will be returned
     * Example: Result.nullToResult("Hello").combine(Result.nullToResult("World")).do(array => console.log(array[0] + " " + array[1])) (logs "Hello World")
     * @param results
     */
    combine<TOne>(maybeOne: Result<TOne, E>): Result<[T, TOne], (E | undefined)[]>;
    combine<TOne, TTwo>(maybeOne: Result<TOne, E>, maybeTwo: Result<TTwo, E>): Result<[T, TOne, TTwo], (E | undefined)[]>;
    combine<TOne, TTwo, TThree>(maybeOne: Result<TOne, E>, maybeTwo: Result<TTwo, E>, maybeThree: Result<TThree, E>): Result<[T, TOne, TTwo, TThree], (E | undefined)[]>;
    combine<TOne, TTwo, TThree, TFour>(maybeOne: Result<TOne, E>, maybeTwo: Result<TTwo, E>, maybeThree: Result<TThree, E>, maybeFour: Result<TFour, E>): Result<[T, TOne, TTwo, TThree, TFour], (E | undefined)[]>;
    combine<TOne, TTwo, TThree, TFour, TFive>(maybeOne: Result<TOne, E>, maybeTwo: Result<TTwo, E>, maybeThree: Result<TThree, E>, maybeFour: Result<TFour, E>, maybeFive: Result<TFive, E>): Result<[T, TOne, TTwo, TThree, TFour, TFive], (E | undefined)[]>;
    /**
     * Throws an error if the result is an error
     *
     */
    throw(): void;
    /**
     * returns the value if there is one or throws the error
     *
     */
    valueOrThrow(): T;
}
