export class ColorService {
  static #blue2red = ['#2dacd1', '#90b900', '#dfb81c', '#e85656'];

  static meterColor(index) {
    return this.#blue2red[index];
  }
}
