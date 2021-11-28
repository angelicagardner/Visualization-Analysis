export class DataService {
  static instance = null;
  messages = {
    all: [],
    byCluster: {},
    byLocation: {},
  };
  overall = {
    location: null,
    clusters: null,
    keywords: null,
  };

  static getInstance() {
    if (!this.instance) this.instance = new DataService();
    return this.instance;
  }

  setMessages(messages) {
    this.messages.all = messages;
    this.messages.byCluster = groupBy('cluster')(messages);
    this.messages.byLocation = groupBy('location')(messages);
  }

  async getTimeline(dataset, filters) {
    return dataset.map((d) => d.time);
  }

  async getKeywords(filters) {
    let data = this.messages.all;

    if (
      filters?.cluster?.id !== undefined &&
      filters?.location?.name !== undefined
    ) {
      data = this.messages.byCluster[filters.cluster.id].filter(
        (m) => m.location === filters.location.name
      );
    } else if (filters?.cluster?.id !== undefined) {
      data = this.messages.byCluster[filters.cluster.id];
    } else if (filters?.location?.name !== undefined) {
      data = this.messages.byLocation[filters.location.name];
    }

    if (
      this.overall.keywords &&
      filters?.cluster?.id === undefined &&
      filters?.location?.name === undefined
    )
      return this.overall.keywords;

    const keywords = data
      .reduce((a, c) => [...a, ...c.words], [])
      .reduce((obj, e) => {
        obj[e.name] = (obj[e.name] || 0) + 1;
        return obj;
      }, {});

    const result = Object.keys(keywords).map((k) => ({
      text: k,
      value: keywords[k],
    }));

    if (!this.overall.keywords && this.messages.all.length === data.length)
      this.overall.keywords = result;

    return result;
  }

  async getCluster(filters) {
    const temp = Object.keys(this.messages.byCluster).map((c) =>
      this.messages.byCluster[c].reduce((obj, e) => {
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

  async getLocations(filters) {
    let data = this.messages.byLocation;

    if (filters?.cluster?.id !== undefined) {
      data = groupBy('location')(this.messages.byCluster[filters.cluster.id]);
    } else if (this.overall.location) return this.overall.location;

    const result = Object.keys(data).map((k) => ({
      location: k,
      value: data[k].length,
    }));

    if (!this.overall.location && this.messages.byLocation === data)
      this.overall.location = result;

    return result;
  }

  getFilteredMessages(dataset, filters) {
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

  getKeywordWeights(messages) {
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
