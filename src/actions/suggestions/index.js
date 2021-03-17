async function getSuggestions(sentence, maskedSentence, language) {
  const data = {
    text: `${sentence} ${maskedSentence}`,
    language,
  };

  const url = 'https://velthyding.mideind.is:8001/fill_mask';
  const param = {
    method: 'POST',
    crossDomain: true,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json; utf-8',
    },
  };
  param.body = JSON.stringify(data);

  let suggestions;
  const response = await fetch(url, param).catch((e) => console.log(e));
  if (response !== undefined) {
    try {
      suggestions = await response.json();
      return { suggestions: suggestions.summary.map((sum) => sum[1]) };
    } catch (err) {
      return ['Error'];
    }
  } else {
    return ['Error'];
  }
}

export default getSuggestions;
