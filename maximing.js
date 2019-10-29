// Задаємо початкові точки
// -9,-2,-10,-4,-10,-6,-9,-7,2,-7,3,-7,4,-7,3,-10,5,-9,7,-2,8,-2,8,0,9,0

let points = [];
let html = "";

let Zn = [];
let ZnIndexes = [];
let pointsWithoutCenters = [];
let distances = [];
let maxDistance = [0];
let m;
let max = 0;
let lastDistances = [];
let clusters = [];

let extraArrayX = new Array();
let extraArrayY = new Array();
let extraArrayX2 = new Array();
let extraArrayY2 = new Array();

const start = () => {
  let coordinates = document.getElementById("points").value;
  var p = coordinates.split(",").map(Number);
  points = p;
  step1();
};

/////// Візуалізація роботи алгоритму ///////
const getData = () => {
  for (let i = 0; i < clusters.length; i++) {
    let xArr = new Array();
    for (let j = 0; j < clusters[i].length; j++) {
      xArr[j] = clusters[i][j][0];
    }
    extraArrayX[i] = xArr;
  }

  for (let i = 0; i < clusters.length; i++) {
    let yArr = new Array();
    for (let j = 0; j < clusters[i].length; j++) {
      yArr[j] = clusters[i][j][1];
    }
    extraArrayY[i] = yArr;
  }

  start2();
};

const start2 = () => {
  var data = [];

  for (let i = 0; i < clusters.length; i++) {
    let name = `S${i + 1}`;
    data.push({
      x: extraArrayX[i],
      y: extraArrayY[i],
      mode: "markers",
      type: "scatter",
      name: name,
      marker: { size: 12 }
    });
  }

  for (let i = 0; i < Zn.length; i++) {
    let name = `Z${i + 1}`;
    data.push({
      x: [Zn[i][0]],
      y: [Zn[i][1]],
      mode: "markers",
      type: "scatter",
      name: name,
      marker: { size: 12, color: ["#2a3d3a"] }
    });
  }

  data.push({
    x: [10],
    y: [10],
    mode: "markers",
    type: "scatter",
    name: name,
    marker: { size: 12, color: ["#ffffff"] }
  });

  data.push({
    x: [-10],
    y: [-10],
    mode: "markers",
    type: "scatter",
    name: name,
    marker: { size: 12, color: ["#ffffff"] }
  });

  Plotly.newPlot("container", data, { showSendToCloud: false });
};
//////////////////////////////////////////////////

// Крок 1
const setInitialCenter = () => {
  Zn.push([points[0], points[1]]);
  ZnIndexes.push([0, 1]);
};

const step1 = () => {
  setInitialCenter();
  pointsWithoutCenters = points;
  pointsWithoutCenters.splice(ZnIndexes[0][0], 2);
  html += `<b>1.</b> Координати початкового центра <b>Z1</b>: (${Zn[0]}) <br>`;
  html += `S' = { ${pointsWithoutCenters} }<br>`;
  step2();
};

// Крок 2
const getDistances = () => {
  for (let i = 0, j = 0; i < pointsWithoutCenters.length / 2; i++, j += 2) {
    distances.push(
      Math.sqrt(
        Math.pow(Zn[0][0] - pointsWithoutCenters[j], 2) +
          Math.pow(Zn[0][1] - pointsWithoutCenters[j + 1], 2)
      )
    );
  }
};

const maxDistances = () => {
  for (let i = 0; i < distances.length; i++) {
    if (distances[i] > maxDistance[0]) {
      maxDistance[0] = distances[i];
    }
  }
};

const step2 = () => {
  getDistances();
  maxDistances();

  Zn.push([
    pointsWithoutCenters[distances.indexOf(maxDistance[0]) * 2],
    pointsWithoutCenters[distances.indexOf(maxDistance[0]) * 2 + 1]
  ]);

  pointsWithoutCenters.splice(distances.indexOf(maxDistance[0]) * 2, 2);
  m = Zn.length;
  html += `<b>2.</b> Координати центра <b>Z2</b>: (${Zn[1]}) <br>`;
  html += `S' = { ${pointsWithoutCenters} }<br>`;
  step3();
};

// Крок 3
const step3 = () => {
  if (pointsWithoutCenters.length > 1) {
    html += `<b>3.</b> Множина S' не порожня <br>`;
    let MinDistances = [];
    let distances = [];
    for (let i = 0; i < Zn.length; i++) {
      let dis = [];
      for (let j = 0, k = 0; j < pointsWithoutCenters.length / 2; j++, k += 2) {
        dis.push(
          Math.sqrt(
            Math.pow(Zn[i][0] - pointsWithoutCenters[k], 2) +
              Math.pow(Zn[i][1] - pointsWithoutCenters[k + 1], 2)
          )
        );
      }
      distances[i] = dis;
    }

    for (let i = 0; i < pointsWithoutCenters.length / 2; i++) {
      let minValue = 999;
      for (let j = 0; j < Zn.length; j++) {
        if (distances[j][i] < minValue) {
          minValue = distances[j][i];
        }
      }
      MinDistances.push(minValue);
    }

    for (let i = 0; i < MinDistances.length; i++) {
      if (MinDistances[i] > max) {
        max = MinDistances[i];
      }
    }

    let localMax = max;
    max = 0;

    html += `Максимум із знайдених мінімальних відстаней: <br> d' = ${localMax} <br>`;

    let k = 0.5;
    let sum = 0;

    for (let i = 0; i < maxDistance.length; i++) {
      sum += maxDistance[i];
    }

    let value = (k * sum) / (m - 1);

    if (localMax <= value) {
      html += `d' <= ki * (d1 + ... + dm-1 ) / (m-1) <br>`;
      step4();
    } else {
      html += `d' > ki * (d1 + ... + dm-1 ) / (m-1) <br>`;
      maxDistance.push(localMax);
      m++;

      Zn.push([
        pointsWithoutCenters[MinDistances.indexOf(localMax) * 2],
        pointsWithoutCenters[MinDistances.indexOf(localMax) * 2 + 1]
      ]);

      pointsWithoutCenters.splice(MinDistances.indexOf(localMax) * 2, 2);
      html += `Координати центрів: <br>`;
      for (let i = 0; i < Zn.length; i++) {
        html += `<b>Z${i + 1}</b> (${Zn[i][0]}:${Zn[i][1]}) <br>`;
      }
      html += `S' = { ${pointsWithoutCenters} }<br>`;
      step3();
    }
  } else {
    html += `<b>3.</b> Множина S' - порожня <br>`;
    step4();
  }
};

// Крок 4
const step4 = () => {
  let d = []; // може бути пов'язано з цим
  for (let i = 0; i < Zn.length; i++) {
    let dis = [];
    for (let j = 0, k = 0; j < pointsWithoutCenters.length / 2; j++, k += 2) {
      dis.push(
        Math.sqrt(
          Math.pow(Zn[i][0] - pointsWithoutCenters[k], 2) +
            Math.pow(Zn[i][1] - pointsWithoutCenters[k + 1], 2)
        )
      );
    }

    d[i] = dis; // і цим
  }

  for (let i = 0; i < Zn.length; i++) {
    clusters.push([]);
  }

  for (let i = 0; i < pointsWithoutCenters.length / 2; i++) {
    let min = 999;
    let index;
    for (let j = 0; j < Zn.length; j++) {
      if (d[j][i] < min) {
        min = d[j][i];
        index = j;
      }
    }

    clusters[index].push([
      pointsWithoutCenters[d[index].indexOf(min) * 2],
      pointsWithoutCenters[d[index].indexOf(min) * 2 + 1]
    ]);
  }

  html += `Координати центрів: <br>`;
  for (let i = 0; i < Zn.length; i++) {
    html += `<b>Z${i + 1}</b> (${Zn[i][0]}:${Zn[i][1]}) <br>`;
  }
  for (let i = 0; i < clusters.length; i++) {
    html += `Кластер <b>S${i + 1}</b>: <br>`;
    for (let j = 0; j < clusters[i].length; j++) {
      html += `(${clusters[i][j][0]}:${clusters[i][j][1]}) `;
    }
    html += `<br>`;
  }
  html += `----------------------Кінець роботи--------------------><br>`;

  getData();
  document.getElementById("math").innerHTML = html;
};
