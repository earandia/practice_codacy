export const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  fg: {// Texto
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      orange: "\x1b[38;2;255;165;0m", 
      lightGray: "\x1b[37;1m",
      darkGray: "\x1b[30;1m",
      lightRed: "\x1b[31;1m",
      lightGreen: "\x1b[32;1m",
      lightYellow: "\x1b[33;1m",
      lightBlue: "\x1b[34;1m",
      lightMagenta: "\x1b[35;1m",
      lightCyan: "\x1b[36;1m",
  },
  bg: {// Fondo
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
      orange: "\x1b[48;2;255;165;0m", 
      lightGray: "\x1b[47;1m",
      darkGray: "\x1b[40;1m",
      lightRed: "\x1b[41;1m",
      lightGreen: "\x1b[42;1m",
      lightYellow: "\x1b[43;1m",
      lightBlue: "\x1b[44;1m",
      lightMagenta: "\x1b[45;1m",
      lightCyan: "\x1b[46;1m",
  },
};

  
  /**
   * Pinta un mensaje en la consola con el color especificado.
   * @param {string} message El mensaje a pintar.
   * @param {string} color El color con el que se pintar  el mensaje.
   * @returns {string} El mensaje pintado.
   */
  export const paint = (message: string, color: string) => {
    return `${color}${message}${colors.reset}`;
  };
  