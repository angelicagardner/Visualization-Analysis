export class DataService {
  static async getTimeline(dataset, filters) {
    return dataset.map((d) => d.time);
  }

  static async getKeywords(dataset, filters) {
    const keywords = dataset
      .reduce((a, c) => [...a, ...c.words], [])
      .reduce((obj, e) => {
        obj[e.name] = (obj[e.name] || 0) + 1;
        return obj;
      }, {});

    return Object.keys(keywords).map((k) => ({ text: k, value: keywords[k] }));
  }

  static async getCluster(dataset, filters) {
    const clusters = groupBy('cluster')(dataset);
    const temp = Object.keys(clusters).map((c) =>
      clusters[c].reduce((obj, e) => {
        e.cluster_keywords.forEach(
          (w) => (obj[w.name] = (obj[w.name] || 0) + w.count)
        );
        return obj;
      }, {})
    );

    const ids = [];
    const labels = [];
    const parents = [];
    const values = [];

    for (const key in temp) {
      ids.push(key);
      labels.push('C' + key);
      parents.push('');
      values.push(Object.keys(temp[key]).reduce((a, c) => a + temp[key][c], 0));

      for (const word in temp[key]) {
        ids.push(`${key} - ${word}`);
        labels.push(word);
        parents.push(key);
        values.push(temp[key][word]);
      }
    }

    return {
      ids,
      labels,
      parents,
      values,
      colors: Object.keys(ids),
    };
  }

  static async getLocations(dataset, filters) {
    const locations = groupBy('location')(dataset);

    return Object.keys(locations).map((k) => ({
      location: k,
      value: locations[k].length,
    }));
  }

  static getFilteredMessages(dataset, filters) {
    let filtered = [...dataset];

    for (const filter of filters) {
      filtered = filtered.filter((m) => {
        if (filter.type === 'eq' && typeof m[filter.name] === 'string')
          return m[filter.name].toLowerCase() === filter.value.toLowerCase();
        if (filter.type === 'eq') return m[filter.name] === filter.value;
        if (filter.type === 'lte') return m[filter.name] <= filter.value;
        if (filter.type === 'gte') return m[filter.name] >= filter.value;
        return true;
      });
    }

    return filtered;
  }

  static getKeywordWeights(messages) {
    return messages.reduce((obj, e) => {
      e.words.forEach((w) => (obj[w.name] = [...(obj[w.name] ?? []), e.time]));
      return obj;
    }, {});
  }
}

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
