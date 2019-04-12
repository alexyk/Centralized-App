import { Observable } from "rxjs";
import { debounceTime } from "rxjs/operators";

export function debounceFn(fn, ms) {
  let observer;
  const base = Observable.create(_observer => {
    observer = _observer;
  });
  var debounced = base.pipe(debounceTime(ms));
  debounced.subscribe(fn, err => {}, done => {});
  return value => observer.next(value);
}
