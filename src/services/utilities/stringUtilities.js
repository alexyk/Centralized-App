export default class StringUtils {

  static shorten(str, length) {
    if (str.length <= length) {
      return str;
    }

    return `${str.substring(0, length)}...`;
  }

  static insertString(sourceStr, insertStr, index) {
    return sourceStr.substring(1,index) + insertStr + sourceStr.substring(index);
  }

  /**
   * Returns a substring of a string based on @sourceStr -> indexOf( @fromIndexOfStr ) and @length
   * @param {String} sourceStr
   * @param {String} fromIndexOfStr
   * @param {Number} length
   * @param {Number} indexCorrection Add or subtract from index (indexOf position)
   */
  static subFromIndexOf(sourceStr, fromIndexOfStr, length, indexCorrection=0) {
    if (!sourceStr || !fromIndexOfStr) {
      return '';
    }

    const index = sourceStr.indexOf(fromIndexOfStr);

    if (!sourceStr || !fromIndexOfStr || index == -1) {
      return '';
    } else {
      return sourceStr.substr(index+indexCorrection,length);
    }
  }

}
