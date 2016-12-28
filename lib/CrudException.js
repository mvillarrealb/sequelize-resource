"use strict"
/**
 * Class CrudException represents an Exception thrown by CRUD operations nature,
 * as if CRUD where represented as REST resources, this class extends Error native
 * class working as a fancy error class to detect whether an exception is thrown
 * by validations such as resource existence, or required fields, or in more general
 * terms internal errors(500 codes)
 *
 * @class CrudException
 * @extends Error
 * @author Marco Villarreal
 * @since 2016-12-24
 *
 */
class CrudException extends Error {
  /**
   * Constant to define HTTP code 412
   * @static
   * @return {Integer}
   */
  static get VALIDATION_FAILED() {
    return 412;
  }
  /**
   * Constant to define HTTP code 422
   * @static
   * @return {Integer}
   */
  static get UNPROCESABLE_ENTITY() {
    return 422;
  }
  /**
   * Constant to define HTTP code 500
   * @static
   * @return {Integer}
   */
  static get INTERNAL_ERROR() {
    return 500;
  }
  /**
   * Constant to define HTTP code 404
   * @static
   * @return {Integer}
   */
  static get NOT_FOUND () {
    return 404;
  }
  /**
   *
   *
   * @constructor
   * @param {Integer} errorCode
   * @param {String} message
   * @param {Array} errors
   *
   */
  constructor(errorCode, message, errors) {
    super(message);
    this.errorCode = errorCode;
    this.errors = (typeof errors == "string")? [errors] : errors;
  }

  set errorCode(errorCode) {
    this._errCode = errorCode;
  }

  get errorCode() {
    return this._errCode;
  }

  set errors(errors) {
    this._errors = errors;
  }

  get errors() {
    return this._errors;
  }

  toString() {
    return JSON.stringify(this.toJson());
  }

  toJson() {
    return {
      code: this.errorCode,
      message: this.message,
      errors: this.errors
    };
  }

}

module.exports = CrudException;
