const User = require('../models/user.model')
const bcrypt = require('bcrypt')

const getUser = async (req, res) => {
    try {
        const user = await User.find({})
        res.status(200).json({user})
    }catch (error) {
        res.status(500).json({message: error.message})
        console.log(error)
    }
}
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json({user})
    }catch (error) {
        res.status(500).json({message: error.message})
        console.log(error)
    }
}
// Create user with raw password not hashed yet then hash it before saving to database
const createUser = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(user){
            res.status(400).json({message: 'User already exists'})
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // create new user with hashed password
        const newUser = await User.create({
            email: req.body.email,
            password: hashedPassword,
            fullname: req.body.fullname,
            role: req.body.role,
            schedule: req.body.schedule,
            phoneNo: req.body.phoneNo,
            positionList: req.body.positionList
        })
        res.status(201).json({newUser})
    }catch (error) {
        res.status(500).json({message: error.message})
        console.log(error)
    }
}
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body)
        if(!user){
            res.status(404).json({message: 'User not found'})
        }
        const updateUser = await User.findById(req.params.id);
        res.status(200).json({updateUser})
    }
    catch (error) {
        res.status(500).json({message: error.message})
        console.log(error)
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).json({message: 'User not found'})
        }
        res.status(200).json({message: 'User deleted'})
    }catch (error) {
        res.status(500).json({message: error.message})
        console.log(error)
    }
}

const getTotalUsersCount = async (req, res) => {
    try {
        const totalUsersCount = await User.countDocuments();
        res.status(200).json({ totalUsersCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};


const getUserRoles = async (req, res) => {
    try {
        // Get user roles distribution
        const userRoles = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        // Convert the result to the desired format
        const labels = userRoles.map(role => role._id);
        const data = userRoles.map(role => role.count);

        res.status(200).json({
            labels,
            data,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

const getLoginIntensity = async (req, res) => {
    try {
        // Fetch login data and calculate intensity
        // For this, you need to have login history in your database
        
        const loginData = {
            labels: ["0:00", "3:00", "6:00", "9:00", "12:00", "14:00", "16:00"],
            datasets: [
                {
                    label: "Number of logins",
                    data: [65, 59, 80, 81, 56, 55, 40], // This is just sample data, replace with actual data
                    fill: false,
                    tension: 0.1,
                },
            ],
        };

        // Calculate average per hour and last peak
        const averagePerHour = 12.7; // Replace with actual average
        const lastPeak = {
            time: "16:20 30/04/1975", // Replace with actual last peak time
            value: 16400, // Replace with actual last peak value
        };

        res.status(200).json({
            labels: loginData.labels,
            data: loginData.datasets[0].data,
            averagePerHour,
            lastPeak,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

const getAdmins = async (req, res) => {
    try {
        // Fetching admin users with the role "admin"
        const admins = await User.find({ role: "admin" }).select("name");
        
        // Check if the admins list is retrieved successfully
        if (!admins) {
            return res.status(404).json({ message: "No admins found" });
        }

        // Sending response with admins data
        res.status(200).json({ admins });
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getTotalUsersCount,
    getUserRoles,
    getLoginIntensity,
    getAdmins
}