import tf from '@tensorflow/tfjs-node'
import { data } from '../data.mjs'
import fs from 'fs'

const cleanedData = data.filter(row => row.SOC != null)
.filter(row => row.SOC < 99)

const slicedDataTraining = cleanedData.slice(0, cleanedData.length - (cleanedData.length / 6))
const slicedDataTesting = cleanedData.slice(cleanedData.length - (cleanedData.length / 6))




const trainingLabel = slicedDataTraining.map(({ solarInput }) => Math.floor(solarInput))
const trainingData = slicedDataTraining.map(({ solarInput, SOC, time, ...d }) => Object.values({ ...d}))
// const trainingData = slicedDataTraining.map(({ solarInput, SOC, time, ...d }) => Object.values({ time: new Date(time).getTime(),  ...d}))

const testingLabel = slicedDataTesting.map(({ solarInput }) => Math.floor(solarInput))
const testingData = slicedDataTesting.map(({ solarInput, SOC, time, ...d }) => Object.values({ ...d}))
// const testingData = slicedDataTesting.map(({ solarInput, SOC, time, ...d }) => Object.values({ time: new Date(time).getTime(),  ...d}))
console.log(trainingData)
console.log(trainingLabel)

const isEven = testingData.every(d => Object.keys(d).length == 8)
console.log(isEven)
console.log('matching lengths: ', testingData.length == testingLabel.length)

// const trainingDataTensor = tf.tensor2d(trainingData)
const trainingLabelTensor = tf.tensor2d(trainingLabel, [trainingLabel.length, 1])

const numTimesteps = 8; // This is an example value
const features = 8; // Number of features in your data

const reshapeData = (data, numTimesteps, features) => {
    const reshaped = [];
    for (let i = 0; i < data.length - numTimesteps + 1; i++) {
        reshaped.push(data.slice(i, i + numTimesteps));
    }
    return tf.tensor3d(reshaped, [reshaped.length, numTimesteps, features]);
};

const trainingDataTensor = reshapeData(trainingData, numTimesteps, features);
const testingDataTensor = reshapeData(testingData, numTimesteps, features);

const model = tf.sequential()

model.add(tf.layers.lstm({units: 8, inputShape: [8, 8], returnSequences: false}));
// model.add(tf.layers.lstm({units: 8, returnSequences: true}));

// model.add(tf.layers.dense({units: 8, activation: 'relu', inputShape: [8]})); // Adjust 'inputShape' based on your feature count
// model.add(tf.layers.dense({units: 4, activation: 'relu'}));
// model.add(tf.layers.dense({units: 32, activation: 'relu'}));
// model.add(tf.layers.dense({units: 64, activation: 'relu'}));
// model.add(tf.layers.dense({units: 64, activation: 'relu'}));
// model.add(tf.layers.dense({units: 64, activation: 'relu'}));
// model.add(tf.layers.dense({units: 64, activation: 'relu'}));
model.add(tf.layers.dense({units: 1, activation: 'linear'}));


const learningRate = 0.0001; // Set your custom learning rate
const optimizer = tf.train.adamax(learningRate);

model.compile({
  optimizer: optimizer,
  loss: 'meanSquaredError',
  // metrics: ['accuracy']
});

const fileName = new Date().toLocaleString().replace(/\//g, '-').replace(/,/g, '').replace(/:/g, '-').replace(/ /g, '_').replace(' ', '_');
fs.mkdirSync(`./models/${fileName}`);

async function trainModel() {
  const response = await model.fit(trainingDataTensor, trainingLabelTensor, {
      epochs: 200, // Number of iterations over the entire dataset
      validationSplit: 0.2, // Split some data for validation (e.g., 20%)
      callbacks: tf.node.tensorBoard('../tmp/fit_logs_1') // Optional: for TensorBoard logging
  });
  console.log(response.history);
  fs.writeFileSync(`./models/${fileName}/history.json`, JSON.stringify(response.history))
  if (fs.existsSync('./history.json')) fs.rmSync(`./history.json`)
  fs.writeFileSync(`./history.json`, JSON.stringify(response.history))
}

// const testingDataTensor = tf.tensor2d(testingData)
const testingLabelTensor = tf.tensor2d(testingLabel, [testingLabel.length, 1])

trainModel().then(async () => {
  // Assuming testDataTensor and testLabelTensor are defined
  const evaluation = await model.evaluate(testingDataTensor, testingLabelTensor);
  console.log('Model evaluation:', evaluation);

  if (evaluation[1]) {
      console.log('Accuracy', evaluation[1].dataSync()[0]);
      console.log('Loss', evaluation[0].dataSync()[0])
  } else {
    const loss = evaluation.dataSync()[0];
    console.log('Test Loss:', loss);
  }


  // save the model
  // const fileName = new Date().toLocaleString().replace(/\//g, '-').replace(/,/g, '').replace(/:/g, '-').replace(/ /g, '_').replace(' ', '_');
  // await fs.mkdirSync('./models');
  // await fs.mkdirSync(`./models/${fileName}`);
  await model.save(`file://./models/${fileName}`);
});

