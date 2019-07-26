export const dlog = console.log;


export function dalert(title, qstringOrObject, caller = null) {
  let asStr = '';
  if (qstringOrObject == null) {
    asStr = '<null or undefined>';
  } else if (typeof(qstringOrObject) == 'object') {
    asStr = debugFormatObject(qstringOrObject);
  } else {
    asStr = debugFormatQueryString(qstringOrObject);
  }

  alert(`${caller ? `[${caller}] ` : ''}${title}:\n${asStr}`);
  console.log(`[alert] ${title}\n${asStr.substr(0,10)}...`,{qstringOrObject, caller, asStr})
}


function debugFormatQueryString(qstring) {
  let result = '';
  let asArray = qstring.split('&');
  const prefix = (i) => (i == 0 ? '' : '&');
  asArray.forEach( (item, i) => result += `\n${prefix(i)}${item}` );

  return result;
}

function debugFormatObject(obj, itemsLimit=10) {
  let result = '';
  let i = 0;

  for (let prop in obj) {
    result += `\n${prop}: ${obj[prop]}`;
    i++;

    if (i == itemsLimit) {
      result += `\n...`;
      break;
    }
  }

  return result;
}
