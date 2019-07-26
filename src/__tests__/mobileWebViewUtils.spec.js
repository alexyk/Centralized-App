import { fixNatForMobileWebView, fixSearchQueryWithSchParam } from "../services/utilities/mobileWebViewUtils"
import queryStringUtils from 'query-string'

test('nat patch', () => {
  let res, location

  // case location is null
  res = fixNatForMobileWebView(null);
  expect(res)         .not    .toEqual(null);
  expect(res.search)          .toEqual('');

  // case nat=undefined
  location = '?region=978123&nat=undefined&startDate=29/05/2018'
  res = fixNatForMobileWebView(location);
  expect(res)         .not    .toEqual(null);
  expect(res.search)          .toEqual('?region=978123&nat=-1&startDate=29/05/2018');

  // case nat=null
  location = '?region=978123&nat=null&startDate=29/05/2018';
  res = fixNatForMobileWebView(location);
  expect(res)         .not    .toEqual(null);
  expect(res.search)          .toEqual('?region=978123&nat=-1&startDate=29/05/2018');

  // case nat is a number
  location = '?region=978123&nat=12543&startDate=29/05/2018';
  res = fixNatForMobileWebView(location);
  expect(res)         .not    .toEqual(null);
  expect(res.search)          .toEqual('?region=978123&nat=12543&startDate=29/05/2018');

  // real case - localhost 1
  location = 'http://localhost:3000/mobile/hotels/listings?currency=USD&endDate=17%2F07%2F2019&filters=%7B%22showUnavailable%22%3Afalse%2C%22name%22%3A%22%22%2C%22minPrice%22%3A0%2C%22maxPrice%22%3A5000%2C%22stars%22%3A%5B0%2C1%2C2%2C3%2C4%2C5%5D%7D&nat=undefined&page=0&region=15664&rooms=%5B%7B%22adults%22%3A2%2C%22children%22%3A%5B%5D%7D%5D&sort=rank%2Cdesc&startDate=18%2F07%2F2019';
  res = fixNatForMobileWebView(location);
  expect(res)         .not    .toEqual(null);
  expect(res.search)          .toEqual('http://localhost:3000/mobile/hotels/listings?currency=USD&endDate=17%2F07%2F2019&filters=%7B%22showUnavailable%22%3Afalse%2C%22name%22%3A%22%22%2C%22minPrice%22%3A0%2C%22maxPrice%22%3A5000%2C%22stars%22%3A%5B0%2C1%2C2%2C3%2C4%2C5%5D%7D&nat=-1&page=0&region=15664&rooms=%5B%7B%22adults%22%3A2%2C%22children%22%3A%5B%5D%7D%5D&sort=rank%2Cdesc&startDate=18%2F07%2F2019');

  // real case - filters 1
  location = '?region=15668&currency=EUR&startDate=18/06/2019&endDate=19/06/2019&rooms=%5B%7B%22adults%22:2,%22children%22:%5B%5D%7D%5D&nat=undefined';
  res = fixNatForMobileWebView(location);
  expect(res)         .not    .toEqual(null);
  expect(res.search)          .toEqual('?region=15668&currency=EUR&startDate=18/06/2019&endDate=19/06/2019&rooms=%5B%7B%22adults%22:2,%22children%22:%5B%5D%7D%5D&nat=-1');

})

test('sch patch', () => {
  // normal case
  let search = '?region=234&rooms=[{"adults":1,"children":[]}]&currency=EUR&startDate=27/07/2019&endDate=28/07/2019&priceMin=1&priceMax=5000&authEmail=mail@mail.ml&authToken=Bearer%20eyJhbGciOiJIUzUxMiJ9.ey999WIiOiJtYWxsZXhAYWJ2LmJnIikljXhwIopdNTY09KKJHTcxfQ.KHPev83Vksp4hakvz2lMd33RuU_HxoFJg1sLEbxHB2d2DKU7Q9n-Gax1HFNxSbk70n4xvpWAkKb4l6jbM-Y5YA';
  let params = queryStringUtils.parse(search);
  let res = fixSearchQueryWithSchParam(search, params);
  expect(res)   .toEqual('?region=234&rooms=[{"adults":1,"children":[]}]&currency=EUR&startDate=27/07/2019&endDate=28/07/2019&priceMin=1&priceMax=5000')

  // custom case
  search = '?region=234_34&rooms=[{"adults":1,"children":[]}]&currency=EUR&startDate=27/07/2019&endDate=28/07/2019&priceMin=1&priceMax=5000&authEmail=mail@mail.ml&authToken=Bearer%20eyJhbGciOiJIUzUxMiJ9.ey999WIiOiJtYWxsZXhAYWJ2LmJnIikljXhwIopdNTY09KKJHTcxfQ.KHPev83Vksp4hakvz2lMd33RuU_HxoFJg1sLEbxHB2d2DKU7Q9n-Gax1HFNxSbk70n4xvpWAkKb4l6jbM-Y5YA';
  params = queryStringUtils.parse(search);
  res = fixSearchQueryWithSchParam(search, params);
  expect(res)   .toEqual('?region=234&rooms=[{"adults":1,"children":[]}]&currency=EUR&startDate=27/07/2019&endDate=28/07/2019&priceMin=1&priceMax=5000&sch=34')

  // normal case with filters
  search = "?region=1937&currency=EUR&startDate=27/07/2019&endDate=28/07/2019&rooms=%5B%7B%22adults%22:1,%22children%22:%5B%5D%7D%5D&nat=-1&filters=%7B%22showUnavailable%22:false,%22name%22:%22%22,%22minPrice%22:0,%22maxPrice%22:5000,%22stars%22:%5B0,1,2,3,4,5%5D%7D&page=0&sort=rank,desc"
  params = queryStringUtils.parse(search);
  res = fixSearchQueryWithSchParam(search, params);
  expect(res)   .toEqual('?region=1937&currency=EUR&startDate=27/07/2019&endDate=28/07/2019&rooms=%5B%7B%22adults%22:1,%22children%22:%5B%5D%7D%5D&nat=-1&filters=%7B%22showUnavailable%22:false,%22name%22:%22%22,%22minPrice%22:0,%22maxPrice%22:5000,%22stars%22:%5B0,1,2,3,4,5%5D%7D&page=0&sort=rank,desc')
})
