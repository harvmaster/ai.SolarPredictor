import tf from '@tensorflow/tfjs-node'
import normalizeData from './normalizeData.mjs';

const d = [
  {
    "time": "2023-12-01T00:00",
    "temperature": 19.6,
    "cloudCoverage": 100,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-12-01T01:00",
    "temperature": 18.8,
    "cloudCoverage": 100,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-12-01T02:00",
    "temperature": 18.2,
    "cloudCoverage": 100,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-12-01T03:00",
    "temperature": 17.7,
    "cloudCoverage": 31,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-12-01T04:00",
    "temperature": 17.3,
    "cloudCoverage": 2,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-12-01T05:00",
    "temperature": 16.9,
    "cloudCoverage": 5,
    "solar": 0,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-12-01T06:00",
    "temperature": 16.4,
    "cloudCoverage": 9,
    "solar": 2,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-12-01T07:00",
    "temperature": 17.6,
    "cloudCoverage": 7,
    "solar": 77,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0.3
  },
  {
    "time": "2023-12-01T08:00",
    "temperature": 21.7,
    "cloudCoverage": 1,
    "solar": 277,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 1.75
  },
  {
    "time": "2023-12-01T09:00",
    "temperature": 24.3,
    "cloudCoverage": 0,
    "solar": 492,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 3.9
  },
  {
    "time": "2023-12-01T10:00",
    "temperature": 26.6,
    "cloudCoverage": 0,
    "solar": 687,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 5.9
  },
  {
    "time": "2023-12-01T11:00",
    "temperature": 28.4,
    "cloudCoverage": 0,
    "solar": 840,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 7.65
  },
  {
    "time": "2023-12-01T12:00",
    "temperature": 29.9,
    "cloudCoverage": 0,
    "solar": 935,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 8.8
  },
  {
    "time": "2023-12-01T13:00",
    "temperature": 31,
    "cloudCoverage": 69,
    "solar": 968,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 9.25
  },
  {
    "time": "2023-12-01T14:00",
    "temperature": 30.4,
    "cloudCoverage": 5,
    "solar": 922,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 8.95
  },
  {
    "time": "2023-12-01T15:00",
    "temperature": 29.4,
    "cloudCoverage": 42,
    "solar": 801,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 7.85
  },
  {
    "time": "2023-12-01T16:00",
    "temperature": 28.4,
    "cloudCoverage": 42,
    "solar": 596,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 2.3
  },
  {
    "time": "2023-12-01T17:00",
    "temperature": 27,
    "cloudCoverage": 58,
    "solar": 345,
    "precipitation_probability": 0,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 1.25
  },
  {
    "time": "2023-12-01T18:00",
    "temperature": 25.3,
    "cloudCoverage": 100,
    "solar": 104,
    "precipitation_probability": 1,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 2.05
  },
  {
    "time": "2023-12-01T19:00",
    "temperature": 24.1,
    "cloudCoverage": 97,
    "solar": 3,
    "precipitation_probability": 2,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0.45
  },
  {
    "time": "2023-12-01T20:00",
    "temperature": 22.8,
    "cloudCoverage": 100,
    "solar": 1,
    "precipitation_probability": 3,
    "rain": 0.2,
    "showers": 0.2,
    "visibility": 24140,
    "uv_index": 0.05
  },
  {
    "time": "2023-12-01T21:00",
    "temperature": 21.8,
    "cloudCoverage": 100,
    "solar": 0,
    "precipitation_probability": 6,
    "rain": 0.8,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-12-01T22:00",
    "temperature": 21.2,
    "cloudCoverage": 100,
    "solar": 0,
    "precipitation_probability": 10,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  },
  {
    "time": "2023-12-01T23:00",
    "temperature": 20.4,
    "cloudCoverage": 74,
    "solar": 0,
    "precipitation_probability": 13,
    "rain": 0,
    "showers": 0,
    "visibility": 24140,
    "uv_index": 0
  }
]

const loadModel = async () => {
    const model = await tf.loadLayersModel('file://./testModel/a4/model.json');
    model.predict
    return model;
}

const predict = async (model, data) => {
  // const cleaned = normalise(data);
  const arrayed = data.map(({ solarInput, SOC, time, visibility, ...d }) => Object.values(d))
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
  const normalised = normalizeData(data, 'solarInput')
  
  console.log(normalised)
  
  const cleaned = normalised.map(({ solarInput, SOC, time, visibility, ...d }) => Object.values(d))
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
  data = data.map(({ time, ...d }) => ({ time: new Date(time).getHours(), ...d  }))

  const normalised = normalizeData(data, 'solarInput');
  console.log(normalised)
  const cleaned = normalised.map(({ solarInput, SOC, visibility, ...d }) => Object.values(d))
  const nanRemoved = cleaned.map(row => row.map(v => isNaN(v) ? 0 : v))
  console.log(nanRemoved)

  let prediction
  for (let i = 0; i < nanRemoved.length; i++) {
    const row = nanRemoved[i];
    const tensor = tf.tensor2d(row, [1, 8]);
  
    prediction = await model.predict(tensor);
    console.log(normalised[i].time, prediction.dataSync()[0]);
  }
  return prediction;
}