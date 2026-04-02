/**
 * @typedef {Object} Size
 * @property {number} width
 * @property {number} height
 */

export class Helpers {
  /**
   * @param {Size} size
   * @returns {number}
   */
  static calculateArea(size) {
    return Math.round(size.width * size.height)
  }

  /**
   * @param {number} delay
   * @returns {Promise<string>}
   */
  static async wait(delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Waited ${delay}ms, finished at ${Date.now()}`)
      }, delay)
    })
  }

  /**
   * @param {number} width
   * @param {number} height
   * @returns {Size}
   */
  static createSize(width, height) {
    return { width, height }
  }

  /**
   * @param {number[]} numbers
   * @returns {number[]}
   */
  static processNumbers(numbers) {
    return numbers
      .filter((n) => n > 0)
      .map((n) => Math.pow(n, 2))
      .sort((a, b) => b - a)
  }
}
