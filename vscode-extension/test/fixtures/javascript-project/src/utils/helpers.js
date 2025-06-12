/**
 * @typedef {Object} Size
 * @property {number} width
 * @property {number} height
 */

/**
 * Utility functions for JavaScript project
 */
export class Helpers {
  /**
   * Calculate area using Math object
   * @param {Size} size
   * @returns {number}
   */
  static calculateArea(size) {
    return Math.round(size.width * size.height)
  }

  /**
   * Async utility with Promise
   * @param {number} delay
   * @returns {Promise<string>}
   */
  static async wait(delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = Date.now()
        resolve(`Waited ${delay}ms, finished at ${timestamp}`)
      }, delay)
    })
  }

  /**
   * Create size object
   * @param {number} width
   * @param {number} height
   * @returns {Size}
   */
  static createSize(width, height) {
    return { width, height }
  }

  /**
   * Process array with modern JS features
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
