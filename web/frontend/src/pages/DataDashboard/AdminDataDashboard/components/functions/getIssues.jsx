import axios from "axios";

const getIssues = async () => {
    const response = await axios.get("http://localhost:3000/api/issue/");

    return response.data
};

export default getIssues;