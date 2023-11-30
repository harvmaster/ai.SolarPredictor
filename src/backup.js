import tf from '@tensorflow/tfjs-node';
import { data } from '../data.mjs';
import fs from 'fs';

import normalizeData from './normalizeData.mjs';

// setup file saving and remove old history
const fileName = new Date().toLocaleString().replace(/\//g, '-').replace(/,/g, '').replace(/:/g, '-').replace(/ /g, '_').replace(' ', '_');
if (fs.existsSync('./history.json')) fs.rmSync(`./history.json`)

// Data Preparation
const cleanedData = normalizeData(data.filter(row => row.SOC != null && row.SOC < 95), 'solarInput')
.map(({ time, ...d }) => {
    const date = new Date(time);
    return {
        time: date.getHours(),
        ...d
    }
})

console.log(cleanedData)

const trainSize = Math.floor(cleanedData.length * 5 / 6);
const slicedDataTraining = cleanedData.slice(0, trainSize);
const slicedDataTesting = cleanedData.slice(trainSize);

const trainingLabel = slicedDataTraining.map(({ solarInput }) => Math.floor(solarInput));
const trainingData = slicedDataTraining.map(({ solarInput, SOC, visibility, ...d }) => Object.values(d));
const testingLabel = slicedDataTesting.map(({ solarInput }) => Math.floor(solarInput));
const testingData = slicedDataTesting.map(({ solarInput, SOC, visibility, ...d }) => Object.values(d));

const features = 8;

const trainingDataTensor = tf.tensor2d(trainingData, [trainingData.length, features]);
const testingDataTensor = tf.tensor2d(testingData, [testingData.length, features]);

const trainingLabelTensor = tf.tensor2d(trainingLabel, [trainingLabel.length, 1]);
const testingLabelTensor = tf.tensor2d(testingLabel, [testingLabel.length, 1]);

// Model Creation
const model = tf.sequential();

model.add(tf.layers.dense({units: 16, activation: 'relu', inputShape: [features]})); // Adjust 'inputShape' based on your feature count
model.add(tf.layers.dense({units: 16, activation: 'relu'}));
model.add(tf.layers.dense({units: 1, activation: 'relu'}));

const learningRate = 0.1;
const optimizer = tf.train.adamax(learningRate);

model.compile({
    optimizer: optimizer,
    loss: 'meanAbsoluteError',
});

// Training the Model
const trainModel = async () => {
    const response = await model.fit(trainingDataTensor, trainingLabelTensor, {
        epochs: 400,
        validationSplit: 0.3,
        callbacks: tf.node.tensorBoard(`../tmp/${fileName}`)
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
