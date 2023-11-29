import tf from '@tensorflow/tfjs-node';
import { data } from '../data.mjs';
import fs from 'fs';

import normalizeData from './normalizeData.mjs';

// setup file saving and remove old history
const fileName = new Date().toLocaleString().replace(/\//g, '-').replace(/,/g, '').replace(/:/g, '-').replace(/ /g, '_').replace(' ', '_');
if (fs.existsSync('./history.json')) fs.rmSync(`./history.json`)

// Data Preparation
const cleanedData = normalizeData(data.filter(row => row.SOC != null && row.SOC < 99), 'solarInput')

console.log(cleanedData)

const trainSize = Math.floor(cleanedData.length * 5 / 6);
const slicedDataTraining = cleanedData.slice(0, trainSize);
const slicedDataTesting = cleanedData.slice(trainSize);

const trainingLabel = slicedDataTraining.map(({ solarInput }) => Math.floor(solarInput));
const trainingData = slicedDataTraining.map(({ solarInput, SOC, visibility, time, ...d }) => Object.values(d));
const testingLabel = slicedDataTesting.map(({ solarInput }) => Math.floor(solarInput));
const testingData = slicedDataTesting.map(({ solarInput, SOC, visibility, time, ...d }) => Object.values(d));

// Reshape Data for LSTM
const numTimesteps = 24;
const features = 7;

const reshapeData = (data, numTimesteps, features) => {
    const reshaped = [];
    for (let i = 0; i <= data.length - numTimesteps; i++) {
        reshaped.push(data.slice(i, i + numTimesteps));
    }
    return tf.tensor3d(reshaped, [reshaped.length, numTimesteps, features]);
};

const trainingDataTensor = reshapeData(trainingData, numTimesteps, features);
const testingDataTensor = reshapeData(testingData, numTimesteps, features);

const adjustLabels = (labels, numTimesteps) => labels.slice(numTimesteps - 1);
const trainingLabelTensor = tf.tensor2d(adjustLabels(trainingLabel, numTimesteps), [trainingLabel.length - numTimesteps + 1, 1]);
const testingLabelTensor = tf.tensor2d(adjustLabels(testingLabel, numTimesteps), [testingLabel.length - numTimesteps + 1, 1]);

// Model Creation
const model = tf.sequential();
model.add(tf.layers.lstm({ units: 8, inputShape: [numTimesteps, features], returnSequences: true }));
model.add(tf.layers.lstm({ units: 4, returnSequences: false }));
// model.add(tf.layers.lstm({ units: 16, returnSequences: false }));
model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

const learningRate = 0.5;
const optimizer = tf.train.adamax(learningRate);

model.compile({
    optimizer: optimizer,
    loss: 'meanAbsoluteError',
});

// Training the Model
const trainModel = async () => {
    const response = await model.fit(trainingDataTensor, trainingLabelTensor, {
        epochs: 150,
        validationSplit: 0.3,
        callbacks: tf.node.tensorBoard('../tmp/fit_logs_1')
    });
    console.log(response.history);

    const historyFilePath = `./models/${fileName}/history.json`;
    fs.mkdirSync(`./models/${fileName}`)
    fs.writeFileSync(historyFilePath, JSON.stringify(response.history));
    fs.writeFileSync('./history.json', JSON.stringify(response.history));
};

// Evaluate the Model
const evaluateModel = async () => {
    const evaluation = await model.evaluate(testingDataTensor, testingLabelTensor);
    console.log('Model evaluation:', evaluation);

    const loss = evaluation.dataSync()[0];
    console.log('Test Loss:', loss);
};

// Save the Model
const saveModel = async () => {
    const fileName = new Date().toISOString().replace(/:/g, '-');
    const modelPath = `file://./models/${fileName}`;
    await model.save(modelPath);
    console.log(`Model saved at ${modelPath}`);
};

// Main Execution
trainModel()
    .then(evaluateModel)
    .then(saveModel)
    .catch(error => console.error(error));
