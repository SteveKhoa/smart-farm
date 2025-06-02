const express = require('express');
const Device = require('../models/device.model.js');
const axios = require('axios');

const GetDevice = async (req, res) => {
    try {
        const device = await Device.find({})
        res.status(200).json({device})
    }catch (error) {
        res.status(500).json({message: error.message})
        console.log(error)
    }
}
const GetDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Fetch the current value from Adafruit using the device name as the feedKey
        const currentValue = await fetchCurrentValueFromAdafruit(device.deviceID);

        // Update the device's current value in the database
        device.curValue = {
            lastValue: currentValue.lastValue, 
            updatedAt: currentValue.updatedAt
        };
        await device.save();

        // Respond with the updated device data
        res.status(200).json({ device });
    } catch (error) {
        if (error.message.includes('Unable to fetch current value from Adafruit')) {
            res.status(502).json({ message: 'Failed to fetch data from Adafruit IO' });
        } else {
            res.status(500).json({ message: error.message });
        }
        console.log(error);
    }
}

const CreateDevice = async (req, res) => {
    try {
        const device = await Device.findOne({deviceID: req.body.deviceID})
        if(device){
            res.status(400).json({message: 'Device already exists'})
        }
        else {
        const newDevice = await Device.create(req.body)
        res.status(201).json({newDevice})}
    }
    catch (error) {
        res.status(500).json({message: error.message})
        console.log(error)
    }
}

const UpdateDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(req.params.id, req.body)
        if(!device){
            res.status(404).json({message: 'Device not found'})
        }
        const updateDevice = await Device.findById(req.params.id);
        res.status(200).json({updateDevice})
    }
    catch (error) {
        res.status(500).json({message: error.message})
        console.log(error)
    }
}

const DeleteDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id)
        if(!device){
            res.status(404).json({message: 'Device not found'})
        }
        res.status(200).json({message: 'Device deleted'})
    }
    catch (error) {
        res.status(500).json({message: error.message})
        console.log(error)
    }
}


const fetchCurrentValueFromAdafruit = async (feedKey) => {
    const ADAFRUIT_IO_USERNAME = '1zy';
    const ADAFRUIT_IO_KEY = 'aio_HQHl865UcZU9BnFNjemUKCfwh7Vx';
    const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${feedKey}/data/last`;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-AIO-Key': ADAFRUIT_IO_KEY,
            },
        });
        //console.log("Adafruit Response Data:", response.data); // Log the raw response data
        const lastValue = response.data.value;
        //console.log("Last Value:", lastValue); 

        const updatedAt = response.data.updated_at;

        return {
            lastValue,
            updatedAt: new Date(updatedAt)
        };
    } catch (error) {
        console.error(error);
        throw new Error('Unable to fetch current value from Adafruit');
    }
};
 


module.exports = {
    GetDevice,
    GetDeviceById,
    CreateDevice,
    UpdateDevice,
    DeleteDevice
}