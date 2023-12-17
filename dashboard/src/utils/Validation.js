function Validation() {
  // email
  let resultEmail; let messageEmail;

  // password
  let resultPass; let messagePass; let password;

  // confirm password
  let confirmPass; let messageConfirmPass;

  return {
    /**
     * @param {string} mail
     * @returns  result:Boolean, message:string
     */
    isEmail: (mail) => {
      const pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (pattern.test(mail)) resultEmail = true, messageEmail = '';
      if (!pattern.test(mail)) resultEmail = false, messageEmail = 'Invalid mail';

      return { result: resultEmail, message: messageEmail };
    },

    /**
     * @param {string} pass
     *  @returns  result:Boolean, message:string
     */
    checkPass: (pass) => {
      if (pass?.length <= 5) resultPass = false, messagePass = 'Password less then 6';
      if (pass?.length >= 5) resultPass = true, messagePass = '';
      password = pass;
      return { result: resultPass, message: messagePass };
    },

    /**
     * @param {string} pass
     * @returns object response result:Boolean, message:string
     */
    checkConfirmPass: (pass) => {
      const isPassOk = pass === password;
      if (isPassOk) confirmPass = true, messageConfirmPass = '';
      if (!isPassOk) confirmPass = false, messageConfirmPass = 'Password not match';
      return { result: confirmPass, message: messageConfirmPass };
    },
  };
}

export const validation = Validation();
