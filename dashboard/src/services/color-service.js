const neutral = {
  base: '#d9d9d9',
  range: ['#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252'],
};
const colorSets = [
  {
    base: '#8dd3c7',
    range: ['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45'],
  },
  {
    base: '#ffffb3',
    range: ['#ffffd4', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02'],
  },
  {
    base: '#bebada',
    range: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3'],
  },
  {
    base: '#fb8072',
    range: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d'],
  },
  {
    base: '#80b1d3',
    range: ['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0'],
  },
  {
    base: '#fdb462',
    range: ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801'],
  },
  {
    base: '#b3de69',
    range: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443'],
  },
  {
    base: '#fccde5',
    range: ['#feebe2', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e'],
  },
];

export class ColorService {
  static #blue2red = ['#2dacd1', '#90b900', '#dfb81c', '#e85656'];
  static #qualitative = colorSets.map((i) => i.base);
  static #ordinal = colorSets.map((i) => i.range);

  static meterColor(index) {
    return this.#blue2red[index];
  }

  static getClusterColors() {
    return this.#qualitative;
  }

  static getClusterColorById(id) {
    if (id) return this.#ordinal[parseInt(id) % this.#ordinal.length];

    return neutral.range;
  }

  static getClusterBaseColorById(id) {
    if (id) return this.#qualitative[parseInt(id) % this.#qualitative.length];

    return neutral.base;
  }
}
