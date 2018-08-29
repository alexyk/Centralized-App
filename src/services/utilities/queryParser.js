class QueryParser {

  // @query {string} querystring
  static parse(query) {
    const queryParams = {};

    const queryPairs = query.substring(1).split('&');

    queryPairs.forEach((pair) => {
      const pairParams = pair.split('=');
      queryParams[pairParams[0]] = pairParams[1];
    });

    return queryParams;
  }
}

export {
  QueryParser
};