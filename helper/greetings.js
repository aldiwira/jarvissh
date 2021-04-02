module.exports = {
  sayGreetings: () => {
    const date = new Date();
    const time = date.getHours();
    let greet;
    if (time >= 0 && time <= 9) {
      greet = 'Selamat Pagi';
    } else if (time >= 10 && time <= 14) {
      greet = 'Selamat Siang';
    } else if (time >= 15 && time <= 17) {
      greet = 'Selamat Sore';
    } else if (time >= 18 && time <= 23) {
      greet = 'Selamat Malam';
    }
    return greet;
  },
};
