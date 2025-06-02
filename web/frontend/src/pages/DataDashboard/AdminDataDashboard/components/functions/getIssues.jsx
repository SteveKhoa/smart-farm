import axios from "axios";

const getIssues = async () => {
    const response = await fetch(
            `https://app.coreiot.io/api/alarm/DEVICE/1bbc3690-3864-11f0-aae0-0f85903b3644?startTime=${Date.now() - 604800000}&endTime=${Date.now()}&pageSize=128&page=0`,
            {
                headers: {
                    "X-Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsZXZpZXR0dW5nbHRAZ21haWwuY29tIiwidXNlcklkIjoiZGI4MDM3NjAtMjljMy0xMWYwLWEzYzktYWIwZDg5OTlmNTYxIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiIxNzMxZWM2YS0wNGEyLTRmMGMtYjE1Ny03NGQwOWQ5NzBjNTUiLCJleHAiOjE3NDg4NTIyNjksImlzcyI6ImNvcmVpb3QuaW8iLCJpYXQiOjE3NDg4NDMyNjksImZpcnN0TmFtZSI6InTDuW5nIiwibGFzdE5hbWUiOiJsw6oiLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiZGI2ZTM2MDAtMjljMy0xMWYwLWEzYzktYWIwZDg5OTlmNTYxIiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9._uTo6jmqMPeUxfr5xGsljUnrJ9tm9c9HcLVcY0xz-VbdmkJy5ZwF51ZechGrKh4cebVX1a6h-63m3ukyObXRBw",
                },
            }
        );

    const parsed = await response.json()

    return parsed.data
};

export default getIssues;