export type Result = {
  UserID: string;
  TestName: string;
  TestNumber: number;
  Duration?: number;
  Delay: number;
  Acknowledged: boolean;
};

export default class ResultsProvider {
  protected endpoint = "/data-api/rest/SurveyResult";

  constructor() {}

  public async createResult(data: Result): Promise<void> {
    try {
      console.log("ResultsProvider.createResult", data);
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw "failed to create result";
      }
    } catch (error) {
      console.error("ResultsProvider.createResult", error);
    }
  }
}
