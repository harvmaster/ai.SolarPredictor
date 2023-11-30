import tf from '@tensorflow/tfjs-node'
import normalizeData from './normalizeData.mjs';

const d = [
  {
    "time": "2023-11-30T00:00",
    "temperature": 20.7,
    "cloudCoverage": 76,
    "solar": 0,
    "precipitation_probability": 83,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-11-30T01:00",
    "temperature": 20.1,
    "cloudCoverage": 70,
    "solar": 0,
    "precipitation_probability": 69,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-11-30T02:00",
    "temperature": 19.9,
    "cloudCoverage": 59,
    "solar": 0,
    "precipitation_probability": 55,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-11-30T03:00",
    "temperature": 19.7,
    "cloudCoverage": 56,
    "solar": 0,
    "precipitation_probability": 37,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-11-30T04:00",
    "temperature": 19.2,
    "cloudCoverage": 41,
    "solar": 0,
    "precipitation_probability": 18,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-11-30T05:00",
    "temperature": 18.5,
    "cloudCoverage": 31,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-11-30T06:00",
    "temperature": 18,
    "cloudCoverage": 0,
    "solar": 2,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-11-30T07:00",
    "temperature": 19.3,
    "cloudCoverage": 0,
    "solar": 86,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0.6
  },
  {
    "time": "2023-11-30T08:00",
    "temperature": 22,
    "cloudCoverage": 0,
    "solar": 284,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 2.05
  },
  {
    "time": "2023-11-30T09:00",
    "temperature": 23.6,
    "cloudCoverage": 0,
    "solar": 499,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 3.95
  },
  {
    "time": "2023-11-30T10:00",
    "temperature": 24.5,
    "cloudCoverage": 0,
    "solar": 691,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 5.95
  },
  {
    "time": "2023-11-30T11:00",
    "temperature": 26.1,
    "cloudCoverage": 5,
    "solar": 844,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 7.65
  },
  {
    "time": "2023-11-30T12:00",
    "temperature": 27.9,
    "cloudCoverage": 10,
    "solar": 941,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 8.8
  },
  {
    "time": "2023-11-30T13:00",
    "temperature": 29.1,
    "cloudCoverage": 31,
    "solar": 951,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 9.25
  },
  {
    "time": "2023-11-30T14:00",
    "temperature": 29.8,
    "cloudCoverage": 57,
    "solar": 846,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 8.95
  },
  {
    "time": "2023-11-30T15:00",
    "temperature": 29.9,
    "cloudCoverage": 46,
    "solar": 624,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 7.95
  },
  {
    "time": "2023-11-30T16:00",
    "temperature": 30,
    "cloudCoverage": 78,
    "solar": 514,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 6.35
  },
  {
    "time": "2023-11-30T17:00",
    "temperature": 29.5,
    "cloudCoverage": 52,
    "solar": 366,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 4.4
  },
  {
    "time": "2023-11-30T18:00",
    "temperature": 28.1,
    "cloudCoverage": 68,
    "solar": 254,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 2.45
  },
  {
    "time": "2023-11-30T19:00",
    "temperature": 25.6,
    "cloudCoverage": 33,
    "solar": 98,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0.85
  },
  {
    "time": "2023-11-30T20:00",
    "temperature": 23.3,
    "cloudCoverage": 40,
    "solar": 5,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0.05
  },
  {
    "time": "2023-11-30T21:00",
    "temperature": 22.5,
    "cloudCoverage": 7,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-11-30T22:00",
    "temperature": 21.3,
    "cloudCoverage": 0,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-11-30T23:00",
    "temperature": 20.3,
    "cloudCoverage": 100,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  }
]

const loadModel = async () => {
    const model = await tf.loadLayersModel('file://./testModel/a3/model.json');
    model.predict
    return model;
}

const predict = async (model, data) => {
  // const cleaned = normalise(data);
  const arrayed = data.map(({ solarInput, SOC, visibility, time, ...d }) => Object.values(d))
  const cleaned = reshape(arrayed);
  console.log(cleaned)

  const tensor = tf.tensor3d(cleaned, [1, 24, 7]);

  const prediction = model.predict(tensor);
  return prediction;
}

const reshape = (data) => {
  const reshaped = [];
  for (let i = 0; i <= data.length - 24; i++) {
      reshaped.push(data.slice(i, i + 24));
  }

  return reshaped
}

const normalise = (data) => {
  const normalised = normalizeData(data, 'solarInput');
  console.log(normalised)
  const cleaned = normalised.map(({ solarInput, SOC, visibility, time, ...d }) => Object.values(d))
  const reshaped = [];
  for (let i = 0; i <= cleaned.length - 24; i++) {
      reshaped.push(cleaned.slice(i, i + 24));
  }
  console.log(reshaped)

  // remove NaN values
  const cleaned2 = reshaped.filter(row => row.every(v => v != null));

  // Check for NaN values in the cleaned data
  cleaned2.forEach((row, i) => {
      row.forEach((value, j) => {
        value.forEach((v, k) => {
          if (isNaN(v)) {
            console.error('NaN value found in input data');
            cleaned2[i][j][k] = 0;
          }
        })
      });
  });

  return cleaned2
}

const main = async () => {
    const model = await loadModel();
    // const prediction = await predict(model, d);
    const prediction = await dense(model, d);
    console.log(prediction.dataSync()[0]);
}

main();


const dense = async (model, data) => {
  const normalised = normalizeData(data, 'solarInput');
  console.log(normalised)
  const cleaned = normalised.map(({ solarInput, SOC, visibility, time, ...d }) => Object.values(d))
  const nanRemoved = cleaned.map(row => row.map(v => isNaN(v) ? 0 : v))
  console.log(nanRemoved)

  let prediction
  for (let i = 0; i < nanRemoved.length; i++) {
    const row = nanRemoved[i];
    const tensor = tf.tensor2d(row, [1, 7]);
  
    prediction = await model.predict(tensor);
    console.log(normalised[i].time, prediction.dataSync()[0]);
  }
  return prediction;
}