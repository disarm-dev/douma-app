// Source: internet, undated

export class LogValueConvertor {
  /**
   * @param {array} sorted_values_array
   */
  constructor(sorted_values_array) {
    const non_zeros = sorted_values_array.filter(v => v !== 0)

    const mino = Math.min(...non_zeros)
    const maxo = Math.max(...non_zeros) * 1.001

    this.minp = 0
    const maxp = 100

    this.minv = Math.log(mino)
    const maxv = Math.log(maxo)

    this.scale = (maxv - this.minv) / (maxp - this.minp)
  }

  /**
   * Take a value and return a position (log/scaled value)
   * @param value
   * @returns {log_value}
   */
  lval = (value) => {
    return ((Math.log(value) - this.minv) / this.scale + this.minp)
  }

  /**
   * Take a position (a log/scaled value) and return the original value
   * @param lval
   * @returns {value}
   */
  value = (lval) => {
    return (Math.exp((lval - this.minp) * this.scale + this.minv))
  }
}
