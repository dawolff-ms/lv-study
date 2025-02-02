/**
 * An abstract class that provides listener functionality. Extend this class if you
 * need listener functionality for your class instance.
 */
export default abstract class Listenable<State> {
  /**
   * An array of all the current listeners to this object.
   */
  protected listeners: ((state: State) => void)[] = [];

  /**
   * Registers a listener function that will be called when state changes.
   * @param listener callback function to register as a listener.
   */
  public addListener(listener: (state: State) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Removes a listener function from listening to state changes.
   * @param listener callback function to remove as a listener.
   */
  public removeListener(listener: (state: State) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * To be called internally when listeners should be updated with new state.
   * If one or more listeners throw an error, this function will throw an error
   * after executing all listeners. The error will contain an array of all errors
   * encountered.
   * @param state the state to update listeners with.
   */
  protected updateListeners(state: State): void {
    const failures: unknown[] = [];
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        failures.push({ listener: listener.name, error });
      }
    });
    if (failures.length > 0) throw failures;
  }
}
