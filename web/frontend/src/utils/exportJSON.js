const exportJSON = (object) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(object)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "data.json";
  
      link.click();
};

export default exportJSON;