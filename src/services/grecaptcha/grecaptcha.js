import { Config } from "../../config";

const grecaptcha = window.grecaptcha;

export const executeWithToken = callback => {
  grecaptcha.ready(() => {
    grecaptcha.execute(Config.getValue("RECAPTCHA_KEY")).then(token => {
      callback(token);
    });
  });
};
