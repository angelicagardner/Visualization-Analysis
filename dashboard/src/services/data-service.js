import { ColorService } from './color-service';

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
    timeline: null,
  };
  static meterTips = [
    'Results will be instantly computed.',
    'Reasonable computing time.',
    'You may experience a small delay.',
    'It takes time to compute, please be patient.',
  ];
  static meterColorClass = ['blue', 'green', 'orange', 'red'];

  static getInstance() {
    if (!this.instance) this.instance = new DataService();
    return this.instance;
  }

  setMessages(messages) {
    this.messages.all = messages;
    this.messages.byCluster = groupBy('cluster')(messages);
    this.messages.byLocation = groupBy('location')(messages);
  }

  async getTimeline(filters) {
    if (!this.overall.timeline)
      this.overall.timeline = this.messages.all.map((d) => d.time);

    const result = { main: this.overall.timeline };

    if (
      filters?.cluster?.id !== undefined &&
      filters?.location?.name !== undefined
    ) {
      result['full'] = this.messages.byCluster[filters.cluster.id]
        .filter((m) => m.location === filters.location.name)
        .map((d) => d.time);
    }

    if (filters?.cluster?.id !== undefined) {
      result['cluster'] = this.messages.byCluster[filters.cluster.id].map(
        (d) => d.time
      );
    }
    if (filters?.location?.name !== undefined) {
      result['location'] = this.messages.byLocation[filters.location.name].map(
        (d) => d.time
      );
    }

    return result;
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

    if (filters?.timeRange?.start && filters?.timeRange?.end) {
      data = data.filter(
        (d) =>
          d.time >= filters.timeRange.start && d.time <= filters.timeRange.end
      );
    }

    if (
      this.overall.keywords &&
      filters?.cluster?.id === undefined &&
      filters?.location?.name === undefined &&
      filters?.timeRange?.start === undefined &&
      filters?.timeRange?.end === undefined
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
    const temp = Object.keys(this.messages.byCluster)
      .sort()
      .map((c) =>
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
      labels.push('');
      parents.push('');
      values.push(Object.keys(temp[key]).reduce((a, c) => a + temp[key][c], 0));
    }
    for (const key in temp) {
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
      marker: {
        line: { width: 1, color: 'rgba(0,0,0,0.5)' },
        colors: ColorService.getClusterColors().slice(0, temp.length),
      },
    };
  }

  async getLocations(filters) {
    let data = this.messages.all;

    if (filters?.cluster?.id !== undefined) {
      data = this.messages.byCluster[filters.cluster.id];
    }

    if (filters?.timeRange?.start && filters?.timeRange?.end) {
      data = data.filter(
        (d) =>
          d.time >= filters.timeRange.start && d.time <= filters.timeRange.end
      );
    }

    if (this.overall.location && this.messages.byLocation === data)
      return this.overall.location;

    const grouped = data ? groupBy('location')(data) : this.messages.byLocation;
    const result = Object.keys(grouped).map((k) => ({
      location: k,
      value: grouped[k].length,
    }));

    if (!this.overall.location && this.messages.byLocation === data)
      this.overall.location = result;

    return result;
  }

  getFilteredMessages(filters) {
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

    if (filters?.timeRange?.start && filters?.timeRange?.end) {
      data = data.filter(
        (d) =>
          d.time >= filters.timeRange.start && d.time <= filters.timeRange.end
      );
    }

    if (filters?.sortedBy) {
      let filter = filters.sortedBy.replace('ASC', '').replace('DESC', '');
      let asc = filters.sortedBy.includes('ASC');

      if (asc) {
        data = data.sort((a, b) => {
          if (a[filter] < b[filter]) return -1;
          if (a[filter] > b[filter]) return 1;
          return 0;
        });
      } else {
        data = data.sort((a, b) => {
          if (b[filter] < a[filter]) return -1;
          if (b[filter] > a[filter]) return 1;
          return 0;
        });
      }
    }

    if (filters?.searchQuery) {
      data = data.filter((d) =>
        d.message.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    return data;
  }

  static getKeywordWeights(messages) {
    return messages.reduce((obj, e) => {
      e.words.forEach((w) => (obj[w.name] = [...(obj[w.name] ?? []), e.time]));
      return obj;
    }, {});
  }

  static getMessageMeterData(length) {
    const rate = Math.log10(length / 10 + 1) / DataService.meterTips.length;
    const percent = rate <= 1 ? rate : 1;
    const index = Math.round(percent * (DataService.meterTips.length - 1));

    return {
      tip: this.meterTips[index],
      colorClass: this.meterColorClass[index],
      messages: length,
      percent,
    };
  }
}

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
