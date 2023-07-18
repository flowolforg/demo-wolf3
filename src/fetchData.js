import axios from 'axios';

const fetchData = async (setText) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:8080/ask',
      params: { q: 'your text here' },
    });
    setText(response.data.keywords);
  } catch (error) {
    console.error(error);
  }
};

export default fetchData;