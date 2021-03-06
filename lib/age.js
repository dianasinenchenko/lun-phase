var today = require('./today');

// Thank you Ben Daglish for providing moon phase calculation methods.
// http://www.ben-daglish.net/moon.shtml

function GetFrac(fr) {
  return (fr - Math.floor(fr));
}

function julday(year, month, day) {
  if (year < 0) {
    year ++;
  }

  var jy = parseInt(year);
  var jm = parseInt(month) +1;

  if (month <= 2) {
    jy--;
    jm += 12;
  }

  var jul = Math.floor(365.25 *jy) + Math.floor(30.6001 * jm) + parseInt(day) + 1720995;

  if (day+31*(month+12*year) >= (15+31*(10+12*1582))) {
    ja = Math.floor(0.01 * jy);
    jul = jul + 2 - ja + Math.floor(0.25 * ja);
  }

  return jul;
}

function Trig1(year,month,day) {
  var thisJD = julday(year,month,day);
  var degToRad = 3.14159265 / 180;
  var K0, T, T2, T3, J0, F0, M0, M1, B1, oldJ;

  K0 = Math.floor((year-1900)*12.3685);
  T = (year-1899.5) / 100;
  T2 = T*T; T3 = T*T*T;
  J0 = 2415020 + 29*K0;
  F0 = 0.0001178*T2 - 0.000000155*T3 + (0.75933 + 0.53058868*K0) - (0.000837*T + 0.000335*T2);
  M0 = 360*(GetFrac(K0*0.08084821133)) + 359.2242 - 0.0000333*T2 - 0.00000347*T3;
  M1 = 360*(GetFrac(K0*0.07171366128)) + 306.0253 + 0.0107306*T2 + 0.00001236*T3;
  B1 = 360*(GetFrac(K0*0.08519585128)) + 21.2964 - (0.0016528*T2) - (0.00000239*T3);

  var phase = 0;
  var jday = 0;

  while (jday < thisJD) {
    var F  = F0 + 1.530588*phase;
    var M5 = (M0 + phase*29.10535608)*degToRad;
    var M6 = (M1 + phase*385.81691806)*degToRad;
    var B6 = (B1 + phase*390.67050646)*degToRad;

    F -= 0.4068*Math.sin(M6) + (0.1734 - 0.000393*T)*Math.sin(M5);
    F += 0.0161*Math.sin(2*M6) + 0.0104*Math.sin(2*B6);
    F -= 0.0074*Math.sin(M5 - M6) - 0.0051*Math.sin(M5 + M6);
    F += 0.0021*Math.sin(2*M5) + 0.0010*Math.sin(2*B6-M6);
    F += 0.5 / 1440;

    oldJ = jday;
    jday = J0 + 28*phase + Math.floor(F);

    phase++;
  }
  return (thisJD - oldJ)%30;
}


module.exports = {
  today: Trig1(today.year, today.month, today.day)
};
