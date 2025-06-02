import axios from "axios";

function getWeekNumber(d) {
    // Copy from https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php

    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

const getDevicesConsumption = async () => {
    const response = await axios.get("http://localhost:3000/api/device/");

    // Just keep fan and led2
    const devices = response.data.device
        .filter((x) => x.deviceID == "fan")
        .map((dict) => {
            const retval = {
                id: dict.deviceID,
                c_num: dict.c_num,
            };

            return retval;
        });

    const getDeviceDateValue = async (deviceID) => {
        const response = await fetch(
            `https://app.coreiot.io/api/plugins/telemetry/DEVICE/1bbc3690-3864-11f0-aae0-0f85903b3644/values/timeseries?keys=value&startTs=${Date.now() - 604800000}&endTs=${Date.now()}`,
            {
                headers: {
                    "X-Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsZXZpZXR0dW5nbHRAZ21haWwuY29tIiwidXNlcklkIjoiZGI4MDM3NjAtMjljMy0xMWYwLWEzYzktYWIwZDg5OTlmNTYxIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiIxNzMxZWM2YS0wNGEyLTRmMGMtYjE1Ny03NGQwOWQ5NzBjNTUiLCJleHAiOjE3NDg4NTIyNjksImlzcyI6ImNvcmVpb3QuaW8iLCJpYXQiOjE3NDg4NDMyNjksImZpcnN0TmFtZSI6InTDuW5nIiwibGFzdE5hbWUiOiJsw6oiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiZGI2ZTM2MDAtMjljMy0xMWYwLWEzYzktYWIwZDg5OTlmNTYxIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9._uTo6jmqMPeUxfr5xGsljUnrJ9tm9c9HcLVcY0xz-VbdmkJy5ZwF51ZechGrKh4cebVX1a6h-63m3ukyObXRBw",
                },
            }
        );

        const parsedResponse = await response.json();
        const date_value_pairs = parsedResponse.value;

        const result = date_value_pairs.map((x) => {
            x.ts = new Date(x.ts);
            x.ts = getWeekNumber(x.ts)[1];

            x.value = Number(x.value)
            return ([x.ts, x.value]);
        });

        return { id: deviceID, data: result };
    };

    const a = await Promise.all(
        devices.map((x) => x.id).map(getDeviceDateValue)
    );

    const b = a.map((deviceData) => {
        let retval = {};

        deviceData.data.map((timestamp) => {
            const val =
                parseFloat(timestamp[1]) *
                devices.find((e) => e.id === deviceData.id).c_num;

            if (timestamp[0] in retval) {
                retval[timestamp[0]] += val;
            } else {
                retval[timestamp[0]] = val;
            }
        });

        return { id: deviceData.id, data: retval };
    });

    return b;
};

const getConsumptionKPI = async () => {
    /**
     *
     * @returns (thisWeekConsumption, deltaLastWeekConsumption)
     */

    const b = await getDevicesConsumption();

    let perWeekTotal = {};
    b.map((perWeekTotalIndividual) => {
        for (const [key, value] of Object.entries(
            perWeekTotalIndividual.data
        )) {
            if (key in perWeekTotal) {
                perWeekTotal[key] += value;
            } else {
                perWeekTotal[key] = value;
            }
        }
    });

    const today = new Date(Date.now());
    const thisWeek = getWeekNumber(today)[1];

    let thisWeekConsumption = 0;
    if (thisWeek in perWeekTotal) {
        thisWeekConsumption = perWeekTotal[thisWeek];
    }

    let lastWeekConsumption = 0;
    let lastOfLastWeekConsumption = 0;
    if (thisWeek - 1 in perWeekTotal) {
        lastWeekConsumption = perWeekTotal[thisWeek - 1];
    }
    if (thisWeek - 3 in perWeekTotal) {
        lastOfLastWeekConsumption = perWeekTotal[thisWeek - 3];
    }

    let deltaLastWeekConsumption = 0.0;
    if (lastWeekConsumption + lastOfLastWeekConsumption != 0) {
        deltaLastWeekConsumption =
            1.0 -
            (lastWeekConsumption - lastOfLastWeekConsumption) /
                (lastWeekConsumption + lastOfLastWeekConsumption);
    }

    console.log("thisWeekConsumption=", thisWeekConsumption)
    console.log("deltaLastWeekConsumption=", deltaLastWeekConsumption)
    console.log("lastWeekConsumption=", lastWeekConsumption)
    console.log("lastOfLastWeekConsumption=", lastOfLastWeekConsumption)

    return [
        thisWeekConsumption / 1000,
        deltaLastWeekConsumption,
        lastWeekConsumption,
        lastOfLastWeekConsumption,
    ];
};

export { getDevicesConsumption, getConsumptionKPI }
