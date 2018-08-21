export class Config {
  static getValue(name, toTrim = true) {
    let result = process.env['REACT_APP_' + name];
    if (toTrim) {
      result = result.trim();
    }
    
    return result;
  }
}